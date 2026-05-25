---
title: Welcome to vmcphub
sidebar_position: 1
slug: /
---

# Welcome to vmcphub

**vmcphub** is a curated catalog of [Model Context Protocol (MCP)](https://modelcontextprotocol.io) servers and skills for users of **VMware Private AI Foundation (PAIF)**. It is to MCP on VMware what `awslabs/mcp` is to MCP on AWS — a single place to discover trusted integrations and learn how to deploy them on your private AI stack.

## What you'll find here

- **MCP Servers** — runtimes that expose VMware products, third-party tools, and popular SaaS systems as MCP tools and resources.
- **Skills** — bundled prompts, runbooks, and heuristics that complement MCP servers for specific job-to-be-done workflows.
- **Three trust tiers** for both:
  - **Official** — authored and maintained by VMware.
  - **Verified Partners** — third-party offerings reviewed and verified by VMware.
  - **Community** — popular community-maintained tools with VMware-supplied PAIF deployment guidance.

## Why a hub?

MCP is an open protocol that lets LLM clients (Claude Desktop, Cursor, VS Code, custom agents on PAIF) call tools and read data from external systems through a single contract. As the ecosystem grows, picking the right server for *your* environment gets harder — especially when you also need to run it inside an on-prem stack with its own networking, secrets, and image-distribution rules.

vmcphub solves that by collecting:

1. The **trusted servers and skills** you should consider for VMware workloads.
2. Per-entry **install snippets** for the common MCP clients.
3. Per-entry **deployment guides** specific to VMware Private AI Foundation — image, secrets, networking, verification, troubleshooting.

## Next steps

1. **[Installation](./getting-started/installation.md)** — set up an MCP client and confirm it can reach your PAIF cluster.
2. **[Your first MCP server on PAIF](./getting-started/your-first-server.md)** — a walkthrough that deploys the vCenter MCP Server end-to-end.
3. **Browse the catalog** — [MCP Servers](/servers/official) or [Skills](/skills/official).
