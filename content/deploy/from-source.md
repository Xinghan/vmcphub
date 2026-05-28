---
title: Deploy MCP server from source code
sidebar_label: From source code
---

# Deploy MCP server from source code

This path is for teams who want full control — build the image from upstream source, push it to your own registry, and deploy it with your own Kubernetes manifests. Use this when:

- The MCP server is **Community-tier** (Broadcom does not publish an official container).
- You need to **fork or patch the upstream** before deploying.
- Your org requires that every image be **rebuilt from source and signed in-house**.

If neither of those applies, prefer the [Broadcom official container path](/deploy/from-broadcom-containers) (less ops work) or [VCF Builder](/deploy/vcf-builder) (zero ops work).

## Prerequisites

- Cluster prerequisites from the [Deploy on VCF overview](/deployment-primer).
- A build host with Docker / Podman / Buildah.
- A registry the VCF cluster can pull from.

## Steps

### 1. Clone the upstream

Every entry in vmcphub links to its upstream repo in the entry's frontmatter (`repo_url`). For example, for the vCenter MCP Server:

```bash
git clone https://github.com/vmware/vmcphub-placeholder-vcenter mcp-vcenter
cd mcp-vcenter
```

### 2. Build and push the image

```bash
docker build -t registry.example.com/mcp/vcenter:$(git rev-parse --short HEAD) .
docker push registry.example.com/mcp/vcenter:$(git rev-parse --short HEAD)
```

Pin the image tag to a commit SHA so deployments are reproducible. If your supply chain requires it, sign the image (e.g., with `cosign`) before pushing.

### 3. Provision secrets

```bash
kubectl -n mcp-servers create secret generic mcp-vcenter \
  --from-literal=VCENTER_HOST=vcsa.example.com \
  --from-literal=VCENTER_USERNAME=svc-mcp@vsphere.local \
  --from-literal=VCENTER_PASSWORD='...'
```

### 4. Apply your own Deployment + Service

Reference manifest — adapt as needed:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mcp-vcenter
  namespace: mcp-servers
spec:
  replicas: 1
  selector: { matchLabels: { app: mcp-vcenter } }
  template:
    metadata: { labels: { app: mcp-vcenter } }
    spec:
      containers:
        - name: mcp-vcenter
          image: registry.example.com/mcp/vcenter:<your-sha>
          envFrom: [{ secretRef: { name: mcp-vcenter } }]
          ports: [{ containerPort: 8080 }]
          livenessProbe: { httpGet: { path: /healthz, port: 8080 } }
          readinessProbe: { httpGet: { path: /healthz, port: 8080 } }
          resources:
            requests: { cpu: 100m, memory: 128Mi }
            limits:   { cpu: 500m, memory: 512Mi }
---
apiVersion: v1
kind: Service
metadata: { name: mcp-vcenter, namespace: mcp-servers }
spec:
  selector: { app: mcp-vcenter }
  ports: [{ port: 8080, targetPort: 8080 }]
```

```bash
kubectl apply -f mcp-vcenter.yaml
```

### 5. Verify

```bash
kubectl -n mcp-servers exec deploy/mcp-vcenter -- curl -s localhost:8080/healthz
# expected: {"status":"ok"}
```

### 6. Wire to your assistant

Add an entry to the assistant's MCP client config pointing at the in-cluster Service:

```json
{
  "mcpServers": {
    "vcenter": {
      "transport": "sse",
      "url": "http://mcp-vcenter.mcp-servers.svc.cluster.local:8080/sse"
    }
  }
}
```

## Upgrading

Rebuild the image at a new commit SHA, update the Deployment's `image:` field, and `kubectl apply`. Use `kubectl rollout` to monitor:

```bash
kubectl -n mcp-servers rollout status deploy/mcp-vcenter --timeout=2m
```

Roll back with `kubectl rollout undo deploy/mcp-vcenter` if the new image misbehaves.

## What you give up by choosing this path

- **No managed upgrades** — you're responsible for tracking upstream releases.
- **No managed signing** — if you need image signatures, set up cosign yourself.
- **No managed secret rotation** — you own the lifecycle of the Secret you created in step 3.
- **No assistant auto-wiring** — you hand-edit the MCP client config.

For any of those, drop to the [Broadcom container path](/deploy/from-broadcom-containers) or [VCF Builder](/deploy/vcf-builder).
