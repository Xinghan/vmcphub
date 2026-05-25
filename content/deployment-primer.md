---
title: Deploying MCP on VMware Private AI Foundation
sidebar_label: Overview
---

# Deploying MCP on VMware Private AI Foundation

There are three supported ways to run an MCP server (or skill) on VMware Private AI Foundation. Pick the path that matches how much control you want versus how much VMware does for you.

## Choose your path

| Path | What you do | When to use |
|---|---|---|
| **[Deploy from source code](/deploy/from-source)** | Clone the upstream repo, build your own image, write your own Deployment manifest. | The server is brand-new, you've forked the upstream, or you have a hard requirement to audit/pin every build artifact yourself. |
| **[Deploy from Broadcom official containers](/deploy/from-broadcom-containers)** | Pull a Broadcom-published container image from `registry.broadcom.com/mcp/…` and apply our reference manifest. | You want a trusted, signed image without building anything, but still want to own the Kubernetes manifests and lifecycle. |
| **[Using PAIF Builder](/deploy/paif-builder)** | One-click install from the PAIF Builder catalog. Builder manages images, secrets, upgrades, and assistant wiring. | You want the fastest path to a running, assistant-connected MCP server and don't need fine-grained manifest control. |

If you're new to MCP on PAIF, start with **PAIF Builder** for the Official-tier servers it supports; drop to the official container path for Verified entries; drop to source-code only for Community entries or custom forks.

## Cluster prerequisites (all paths)

Regardless of which path you pick, your PAIF cluster needs:

- **VMware Private AI Foundation 2.x** with cluster admin access.
- **A namespace dedicated to MCP workloads** (e.g., `mcp-servers`).
- **Per-server service accounts** scoped to the upstream system the server reads from (vCenter, NSX, Confluence, Jira, etc.) — least privilege wins.
- **Egress** from that namespace to those upstream systems on the documented ports.
- **A trusted image registry** the cluster can pull from (for the source-code and Broadcom-container paths).

The three deployment pages below build on these baseline prerequisites and don't repeat them in detail.

## Shared operational concerns

- **Secrets** — use Kubernetes Secrets for per-server credentials. Never bake credentials into images or ConfigMaps.
- **Networking** — expose MCP servers via in-cluster Services. Only egress to upstream targets needs to leave the cluster.
- **Health checks** — every MCP server image we publish exposes `/healthz`. Wire it to a Kubernetes liveness probe.
- **Observability** — point your existing log/metrics pipeline at the MCP namespace; nothing MCP-specific is required.
