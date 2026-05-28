---
title: Welcome to Open Source MCP Servers / Skills for PAIF
sidebar_label: Welcome
sidebar_position: 1
slug: /
---

# Welcome to Open Source MCP Servers / Skills for PAIF

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io) is an open protocol that enables seamless integration between LLM applications and external data sources and tools.

An MCP server exposes capabilities through this standardized protocol. Host applications — chatbots, IDEs, and AI tools — maintain connections with MCP servers. Common MCP clients include coding assistants like Cursor, Cline, and VS Code, plus Claude Desktop and the agents you build on **VMware Private AI Foundation (PAIF)**. These servers access local and remote data to provide context that improves model outputs.

**MCP servers and skills for VMware Cloud Foundation (VCF)** grant AI applications access to VCF products — vCenter, NSX, vSAN, and more — along with the documentation, guidance, and best practices for operating them, making AI-assisted private-cloud operations more accessible and efficient.

## Why MCP servers and skills for VCF?

- **Improved output quality** — By providing relevant information directly in the model's context, MCP servers significantly improve model responses for specialized domains like VCF products. This reduces hallucinations, provides accurate technical details, enables precise configuration and code generation, and ensures recommendations align with current VCF best practices.
- **Access to your live environment** — Foundation models have no knowledge of *your* vCenter inventory, NSX policies, or vSAN health. MCP servers pull current state from your environment so the assistant reasons about what you actually run, not a generic example.
- **Workflow automation** — MCP servers convert common VCF operations into tools that foundation models can use directly — VM lifecycle, NSX policy authoring, vSAN triage — enabling complex task execution under tight permission scopes.
- **Specialized domain knowledge** — Skills bundle deep, contextual VCF knowledge — troubleshooting runbooks, upgrade-readiness checklists, policy linting — that is not fully represented in a foundation model's training data.

## Getting started essentials

The essential MCP servers for VCF resource management are foundational before exploring specific products:

- **[vCenter MCP Server](/servers/official/vcenter)** — vSphere inventory, VM lifecycle, host and cluster status, and read-only performance counters.
- **[NSX MCP Server](/servers/official/nsx)** — NSX segments, gateways, security groups, and distributed firewall rules.

Start with these, then layer on Verified and Community servers for the rest of your stack.

## Trust tiers

Every server and skill in the catalog is sorted into one of three trust tiers:

- **Official** — authored and maintained by VMware for core VCF products.
- **Verified Partners** — third-party, mostly open-source MCP servers and skills that target VCF products (vCenter, NSX, vSAN, VMware Cloud Foundation), reviewed and verified by VMware against a recent product release.
- **Community** — popular community-maintained tools (GitHub, Slack, Postgres, Datadog, and more) with VMware-supplied PAIF deployment guidance.

## Catalog at a glance

- **[MCP Servers](/servers/official)** — runtimes that expose VCF products, third-party tools, and popular SaaS systems as MCP tools and resources.
- **[Skills](/skills/official)** — bundled prompts, runbooks, and heuristics that complement MCP servers for specific job-to-be-done workflows.

## Local vs. on-cluster deployment

**Local MCP servers** excel for:

- Development, testing, and debugging.
- Offline work with limited connectivity.
- Keeping sensitive data and credentials on your workstation.
- Minimal network latency and direct resource control.

**On-cluster (PAIF) MCP servers** excel for:

- Team collaboration with consistent configurations.
- Resource-intensive tasks offloaded to the cluster.
- Always-available access from any assistant on PAIF.
- Centralized security controls with namespace-scoped service accounts and Kubernetes Secrets.
- Comprehensive audit logging and compliance monitoring for enterprise-grade governance.

For the on-cluster path, see the three [deployment options on PAIF](/deployment-primer).

## Workflow types

Each server and skill targets specific use cases:

- **Vibe coding & development** — AI coding assistants that help you build and operate VCF faster.
- **Conversational assistants** — interactive Q&A over your live environment ("which hosts are in maintenance mode?").
- **Autonomous background agents** — headless automation, health triage, and operational runbooks.

## Use-case examples

- The **vCenter MCP Server** lets an assistant answer "list the VMs in cluster X" or "which datastores are over 85% full?" against live inventory.
- The **NSX MCP Server** lets an assistant audit distributed firewall rules and propose least-privilege segments.
- The **vSphere Troubleshooter skill** walks an operator through boot-loop, HA-failure, and storage-path diagnostics, pairing with the vCenter server for live data.
- The **VCF Upgrade Readiness skill** runs an operator through pre-upgrade checks for VMware Cloud Foundation.

## Next steps

1. **[Installation](./getting-started/installation.md)** — set up an MCP client and confirm it can reach your PAIF cluster.
2. **[Your first MCP server on PAIF](./getting-started/your-first-server.md)** — a walkthrough that deploys the vCenter MCP Server end-to-end.
3. **Browse the catalog** — [MCP Servers](/servers/official) or [Skills](/skills/official).
