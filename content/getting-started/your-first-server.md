---
title: Your first MCP server on VCF
sidebar_position: 2
---

# Your first MCP server on VCF

This walkthrough deploys the [vCenter MCP Server](/servers/official/vcenter) on VMware Cloud Foundation and connects an MCP client to it. The same shape applies to every other server in the catalog — the only differences are the image, the secret keys, and the upstream port.

## Step 1 — Pick a server

Browse [/servers/official](/servers/official) and pick an entry. For this guide, we use **vCenter MCP Server**.

Each entry has three tabs:

- **Overview** — what it does and prerequisites
- **Install** — copy-to-clipboard config for popular MCP clients (for local runs)
- **Deploy** — step-by-step Kubernetes deployment on VCF

## Step 2 — Create the namespace and secret

```bash
kubectl create namespace mcp-servers

kubectl -n mcp-servers create secret generic mcp-vcenter \
  --from-literal=VCENTER_HOST=vcsa.example.com \
  --from-literal=VCENTER_USERNAME=svc-mcp@vsphere.local \
  --from-literal=VCENTER_PASSWORD='...'
```

## Step 3 — Apply the Deployment + Service

Mirror the upstream image into your registry, then:

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
          image: registry.example.com/vmware/mcp-vcenter:0.1.0
          envFrom: [{ secretRef: { name: mcp-vcenter } }]
          ports: [{ containerPort: 8080 }]
          livenessProbe: { httpGet: { path: /healthz, port: 8080 } }
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

## Step 4 — Verify

```bash
kubectl -n mcp-servers exec deploy/mcp-vcenter -- curl -s localhost:8080/healthz
```

Expected: `{"status":"ok"}`

## Step 5 — Wire it to your MCP client

For a VCF-hosted assistant, point its MCP client config at the in-cluster Service URL:

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

Restart the assistant. You should now be able to ask "list the VMs in cluster X" and see the MCP server answer.

## Troubleshooting

See the **Troubleshooting** section of each entry's **Deploy** tab for entry-specific tips. For shared patterns (proxies, image pulls, RBAC) see [Deploying MCP on VCF](/deployment-primer).
