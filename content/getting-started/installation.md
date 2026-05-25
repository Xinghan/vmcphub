---
title: Installation
sidebar_position: 1
---

# Installation

Before you can install any server from vmcphub, you need (1) an MCP-capable client, and (2) a place to run MCP server workloads — typically your VMware Private AI Foundation (PAIF) cluster.

## 1. Install an MCP client

Pick whichever fits your workflow. Each per-entry **Install** page in vmcphub provides a copy-to-clipboard config snippet for these clients.

| Client | Install |
|---|---|
| Claude Desktop | [claude.ai/download](https://claude.ai/download) |
| Cursor | [cursor.com](https://cursor.com) |
| VS Code (with MCP extension) | [marketplace.visualstudio.com](https://marketplace.visualstudio.com/) |
| Generic / custom agent | Any client that speaks the MCP protocol — see [modelcontextprotocol.io](https://modelcontextprotocol.io) |

## 2. Prepare your PAIF cluster

For deployments that target VMware Private AI Foundation, confirm the following before installing any server:

- **PAIF version** — most server deploy guides assume PAIF 2.x.
- **A dedicated namespace** for MCP workloads (e.g., `mcp-servers`).
- **An image registry** the cluster can pull from. Mirror upstream MCP images into it.
- **Egress** from that namespace to whichever upstream the MCP server talks to (vCenter, NSX, Confluence, Jira, etc.) on the documented ports.

See the [Deploying MCP on PAIF](/deployment-primer) primer for cluster-level patterns shared by every entry.

## 3. Configure your MCP client

For local-only runs (no PAIF involved), each entry's **Install** tab gives you a snippet like:

```json
{
  "mcpServers": {
    "vcenter": {
      "command": "npx",
      "args": ["-y", "@vmware/mcp-vcenter"]
    }
  }
}
```

For PAIF-hosted servers, your MCP client points at the in-cluster Service URL instead of running `npx` locally — see the per-entry **Deploy** tab.

## What's next

Head to [Your first MCP server on PAIF](./your-first-server.md) for an end-to-end walkthrough.
