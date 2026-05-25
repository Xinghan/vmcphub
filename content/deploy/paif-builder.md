---
title: Using PAIF Builder
sidebar_label: Using PAIF Builder
---

# Using PAIF Builder

**PAIF Builder** is the deployment surface inside VMware Private AI Foundation for provisioning ready-made AI workloads — including MCP servers — without writing your own Kubernetes manifests. If you have PAIF 2.x or later, prefer Builder over hand-rolled YAML: it handles image mirroring, secrets, networking, and assistant wiring for you.

This is the third of the [three deployment paths](/deployment-primer). For the source-code path see [Deploy from source](/deploy/from-source); for the official-container path see [Deploy from Broadcom containers](/deploy/from-broadcom-containers).

## When to use PAIF Builder vs. the manual path

| Use PAIF Builder when… | Use the manual path when… |
|---|---|
| You want one-click install for a server already catalogued by Builder | The server is brand-new or community-maintained and not yet in Builder's catalogue |
| You want Builder to manage upgrades and image-pinning for you | You need to fork the upstream image or pin a hash Builder doesn't expose |
| Your operators prefer a UI-driven workflow | You're integrating MCP into an existing GitOps pipeline |

vmcphub publishes Builder catalogue compatibility on each entry's overview page (look for the **PAIF Builder ready** badge — coming soon for all Official-tier servers).

## Prerequisites

- VMware Private AI Foundation 2.x with the **AI Workload Catalog** add-on enabled.
- An MCP-workloads namespace (e.g., `mcp-servers`) registered with Builder.
- Network policy allowing egress from that namespace to whatever upstream the server targets (vCenter, NSX, Confluence, etc.) on the documented ports.

If you don't yet have Builder, follow the [PAIF Builder setup](/deployment-primer) section first (it ships as part of the AI Workload Catalog add-on).

## Step-by-step: deploy an MCP server via PAIF Builder

1. **Open PAIF Builder.** From the PAIF console, navigate to **Workloads → AI Workload Catalog → MCP Servers**.
2. **Pick a server.** Browse the catalogue and select the entry you want (for example, **vCenter MCP Server**). Builder shows the same metadata as vmcphub: maintainer, version, capability tags.
3. **Choose a target namespace.** Pick the MCP-workloads namespace you provisioned in the prerequisites.
4. **Fill in connection inputs.** Builder renders a form for the server-specific inputs (e.g., `VCENTER_HOST`, `VCENTER_USERNAME`, `VCENTER_PASSWORD`). It writes them to a managed Kubernetes Secret on your behalf.
5. **Click Deploy.** Builder mirrors the image (if not already cached), applies the Deployment + Service, and waits for the liveness probe to go green.
6. **Wire it to your assistant.** Once the Deploy step is green, Builder offers a **Connect to Assistant** action. Pick which PAIF assistant should consume the new MCP server; Builder updates that assistant's MCP client config and reloads it.
7. **Verify.** Open the connected assistant and ask a question that exercises the new server (e.g., "list the VMs in cluster X"). The response should reference live data from the upstream system.

## What Builder does that the manual path doesn't

- **Image mirroring** — Builder mirrors the upstream image into your trusted registry the first time you deploy a server, then uses the mirror for all future deploys.
- **Secret lifecycle** — Secrets created by Builder are tagged and rotated together with the server; uninstalling cleans them up.
- **Assistant wiring** — Builder edits the assistant's MCP client config so you don't have to. This is the same config block shown on each entry's **Install** tab.
- **Upgrade flow** — Bumping a server to a new version is a one-click action; Builder runs a rolling update and rolls back on health-check failure.

## Limitations (today)

- Only **Official** and select **Verified Partners** servers ship with Builder catalogue entries. Community servers still need the manual Kubernetes path.
- Builder does not yet manage skill bundles — skill installation remains a ConfigMap-mount workflow today (see each skill's **Deploy** tab).
- Custom image overrides require dropping into the underlying Helm/Carvel value file; the Builder UI does not expose every knob.

## Troubleshooting

- **Builder shows the server but Deploy is greyed out** — the target namespace is not registered for MCP workloads. Add it via **Settings → Namespaces → Allow MCP workloads**.
- **Health probe times out** — most often the upstream endpoint (vCenter, etc.) is unreachable from the namespace. Use Builder's **Diagnose Connectivity** action to confirm.
- **"Image pull backoff"** — Builder's mirror job failed. Re-run it from **Image Mirror → Retry**, or check that the cluster's egress to the upstream registry is open.

For server-specific failures, see the **Troubleshooting** section of that server's per-entry **Deploy** tab.
