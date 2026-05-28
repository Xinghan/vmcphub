---
title: Installation
sidebar_position: 1
---

# Installation

Before you can install any server from vmcphub, you need (1) an MCP-capable client, and (2) a place to run MCP server workloads — typically your VMware Cloud Foundation (VCF) cluster.

## 1. Install an MCP client

Pick whichever fits your workflow. Each per-entry **Install** page in vmcphub provides a copy-to-clipboard config snippet for these clients.

| Client | Install |
|---|---|
| Claude Desktop | [claude.ai/download](https://claude.ai/download) |
| Cursor | [cursor.com](https://cursor.com) |
| VS Code (with MCP extension) | [marketplace.visualstudio.com](https://marketplace.visualstudio.com/) |
| Generic / custom agent | Any client that speaks the MCP protocol — see [modelcontextprotocol.io](https://modelcontextprotocol.io) |

## 2. Prepare your VCF cluster

For deployments that target VMware Cloud Foundation, confirm the following before installing any server:

- **VCF version** — most server deploy guides assume VCF 2.x.
- **A dedicated namespace** for MCP workloads (e.g., `mcp-servers`).
- **An image registry** the cluster can pull from. Mirror upstream MCP images into it.
- **Egress** from that namespace to whichever upstream the MCP server talks to (vCenter, NSX, Confluence, Jira, etc.) on the documented ports.

See the [Deploying MCP on VCF](/deployment-primer) primer for cluster-level patterns shared by every entry.

## 3. Configure your MCP client

For local-only runs (no VCF involved), each entry's **Install** tab gives you a snippet like:

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

For VCF-hosted servers, your MCP client points at the in-cluster Service URL instead of running `npx` locally — see the per-entry **Deploy** tab.

## What's next

Head to [Your first MCP server on VCF](./your-first-server.md) for an end-to-end walkthrough.
