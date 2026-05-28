---
title: Deploy MCP server from Broadcom official containers
sidebar_label: From Broadcom containers
---

# Deploy MCP server from Broadcom official containers

Broadcom publishes signed, official container images for every **Official-tier** and most **Verified Partners** MCP servers in vmcphub. You pull the image, apply a reference manifest, and operate the workload yourself — without building anything from source. Use this when:

- You want a **trusted, signed image** but don't want the operational overhead of building it yourself.
- You're already running Kubernetes manifests in your own GitOps pipeline and want MCP to fit in.
- You need to be on a **specific image version** for compliance, but don't need to fork the upstream code.

If you don't need to own the manifests, the [VCF Builder path](/deploy/vcf-builder) is faster. If the server you want isn't on Broadcom's registry yet (most Community-tier servers), drop to the [from-source path](/deploy/from-source).

## Where the images live

| Tier | Registry path | Example |
|---|---|---|
| Official | `registry.broadcom.com/mcp/<slug>` | `registry.broadcom.com/mcp/vcenter:0.1.0` |
| Verified Partners | `registry.broadcom.com/mcp/verified/<slug>` | `registry.broadcom.com/mcp/verified/govmomi-mcp:0.4.2` |

Each image is:

- Built from a tagged upstream release (we do not ship images from `main`).
- Signed with `cosign` using a Broadcom key — verify with `cosign verify --key broadcom.pub …`.
- Scanned with Trivy at build time; the SBOM is attached as an OCI artifact.
- Mirrored to public regions; your cluster can pull directly (no offline staging required for connected sites).

For air-gapped sites, mirror the image into your internal registry first using `crane copy` or `oras copy` — see the [air-gapped mirror appendix](#air-gapped-mirror) below.

## Prerequisites

- Cluster prerequisites from the [Deploy on VCF overview](/deployment-primer).
- Network access to `registry.broadcom.com` from your VCF cluster (or an in-house mirror — see appendix).
- (Optional but recommended) `cosign` installed locally for image signature verification.

## Steps

### 1. (Optional) Verify the image signature

```bash
cosign verify \
  --key https://registry.broadcom.com/keys/broadcom-mcp.pub \
  registry.broadcom.com/mcp/vcenter:0.1.0
```

You should see `Verified signature` in the output. If you have an admission controller (e.g., Kyverno, Gatekeeper) configured to require signed images, point it at the same key.

### 2. Provision secrets

Same as the from-source path:

```bash
kubectl -n mcp-servers create secret generic mcp-vcenter \
  --from-literal=VCENTER_HOST=vcsa.example.com \
  --from-literal=VCENTER_USERNAME=svc-mcp@vsphere.local \
  --from-literal=VCENTER_PASSWORD='...'
```

### 3. Apply the reference manifest

Each entry's **Deploy** tab in vmcphub publishes a reference manifest pinning the Broadcom-published image tag. For vCenter MCP:

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
          image: registry.broadcom.com/mcp/vcenter:0.1.0
          envFrom: [{ secretRef: { name: mcp-vcenter } }]
          ports: [{ containerPort: 8080 }]
          livenessProbe: { httpGet: { path: /healthz, port: 8080 } }
          readinessProbe: { httpGet: { path: /healthz, port: 8080 } }
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

### 4. Verify and wire

Same as the [from-source steps 5 and 6](/deploy/from-source).

## Upgrading

1. Watch the Broadcom registry for new tags (or subscribe to the per-server release feed in the entry's Overview tab).
2. Bump the `image:` tag in your manifest.
3. `kubectl apply` and monitor the rollout.

Because Broadcom-published images are versioned semantically, you can pin to a minor version (`0.1.x`) if you want automatic patch updates via `imagePullPolicy: Always` plus a periodic rollout restart — but most users pin to a fully-qualified tag and bump deliberately.

## Air-gapped mirror

For VCF clusters without internet egress:

```bash
# On a host that CAN reach both registries:
oras copy \
  registry.broadcom.com/mcp/vcenter:0.1.0 \
  registry.internal.example.com/mcp/vcenter:0.1.0

# Then update your manifest:
#   image: registry.internal.example.com/mcp/vcenter:0.1.0
```

`oras copy` preserves signatures and SBOM attachments, so your admission policy still works against the mirrored image.

## What you give up by choosing this path

- **You still own the manifests, secrets, and upgrades.** Broadcom only owns the image.
- **No assistant auto-wiring** — you hand-edit the MCP client config (or wrap it in your own Helm/Argo chart).

If you want any of that managed for you, the [VCF Builder path](/deploy/vcf-builder) takes those concerns off your plate.
