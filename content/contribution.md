---
title: Contributing
---

# Contributing to vmcphub

vmcphub is currently maintained by the VMware team. To propose a new entry,
open an issue describing the MCP server or skill, its trust tier, and its
relevance to VMware Private AI Foundation users.

## Entry structure

Every entry is a folder under `servers/<tier>/<slug>/` or `skills/<tier>/<slug>/`
containing three files: `index.mdx`, `install.mdx`, `deploy.mdx`. The
frontmatter on `index.mdx` is validated at build time — see the schema in
`src/plugins/entry-manifest/schema.ts`.
