# vmcphub — VMware MCP Server & Skills Portal Hub

**Date:** 2026-05-25
**Status:** Design approved, pending written-spec review

## 1. Purpose

A static documentation portal that catalogs MCP servers and Skills relevant to VMware Private AI Foundation users. Modeled in spirit on the AWS Labs MCP portal (`https://awslabs.github.io/mcp/`), but organized around VMware's product portfolio and trust boundaries.

The hub is a **catalog and guidance site only** — it does not host MCP server source code. Each entry points to an external repository via `repo_url`.

## 2. Audience & use cases

- VMware admins (vSphere, NSX, vSAN, Aria, Tanzu) looking for AI-ready integrations with their existing products.
- AI engineers and devops building agentic workflows on top of VMware Private AI Foundation (PAIF).
- Both groups need: (a) a trusted index of what exists, (b) one-click install snippets for popular MCP clients, (c) concrete guidance for deploying each server/skill on PAIF.

## 3. Scope

### In scope (v1)
- Two catalogs: **MCP Servers** and **Skills**, each split into three trust tiers as top-level sections.
- Per-entry detail page with Overview / Install / Deploy tabs.
- Category and VMware-product filtering on listing pages.
- Copy-to-clipboard install snippets for Claude Desktop, Cursor, VS Code, and a generic JSON config.
- Per-entry "Deploy on VMware Private AI Foundation" documentation page.
- Build-time frontmatter validation that fails the build on schema violations.
- Seed content: 2 example entries per tier per catalog (12 total).

### Out of scope (v1)
- Free-text search (category/tag filters only; revisit in v2).
- User submissions / open community PR flow (VMware team authors only).
- Hosting the MCP server source code itself (entries link out via `repo_url`; placeholder URLs are acceptable until real repos exist).
- Standalone test suite (Vitest, link-checker etc.) — schema validation in the build plugin is the v1 quality gate.
- Hosting target decision (GitHub Pages vs internal mirror) — deferred.

## 4. Information architecture

```
vmcphub
├── /                            Home (hero, tier overview, featured Official entries)
├── /servers/official/           MCP Servers — VMware Official
├── /servers/verified/           MCP Servers — VMware-Verified Third-Party
├── /servers/community/          MCP Servers — Popular Community
├── /skills/official/            Skills — VMware Official
├── /skills/verified/            Skills — VMware-Verified Third-Party
├── /skills/community/           Skills — Popular Community
├── /servers/<slug>/             Entry detail page (Overview / Install / Deploy tabs)
├── /skills/<slug>/              Entry detail page
└── /docs/                       Hub-level guides
    ├── contribution.md
    ├── deployment-primer.md     Canonical "deploying MCP on PAIF" guide
    └── glossary.md
```

Two Docusaurus `@docusaurus/plugin-content-docs` instances (`servers`, `skills`), each with its own sidebar grouped by tier. Listing pages are React pages that consume a build-time-aggregated entry manifest.

### Taxonomy

Hybrid taxonomy — every entry has both:

- **`capability_tags`** (primary filter axis): e.g., `infrastructure`, `monitoring`, `security`, `data-analytics`, `developer-tools`, `knowledge-docs`, `messaging`.
- **`vmware_products`** (secondary filter axis): e.g., `vsphere`, `vcenter`, `nsx`, `vsan`, `aria`, `tanzu`, `cloud-foundation`, `workspace-one`. May be empty for generic community entries.

### Trust tiers

- **Official** — VMware-authored and maintained.
- **Verified** — Third-party MCP servers/skills reviewed and verified by VMware against a documented checklist.
- **Community** — Popular third-party tools (e.g., Confluence, Jira) that VMware has not authored but provides PAIF deployment guidance for.

Tier is both the top-level section and a visible badge on every card and detail page.

## 5. Entry data model

Each entry is a folder under `servers/<tier>/<slug>/` or `skills/<tier>/<slug>/`:

- `index.mdx` — overview content + frontmatter (see below)
- `install.mdx` — copy-to-clipboard install snippets per client
- `deploy.mdx` — per-entry "Deploy on VMware Private AI Foundation" guide

### Frontmatter schema (on `index.mdx`)

```yaml
---
slug: vcenter                          # required, unique within catalog
name: vCenter MCP Server               # required
tier: official                         # required: official | verified | community
type: server                           # required: server | skill (matches catalog)
description: One-line summary shown on cards.   # required, <= 140 chars
icon: /img/icons/vcenter.svg           # required, path under static/
repo_url: https://github.com/vmware/vmcphub-placeholder/vcenter   # required; placeholder OK
maintainer: VMware                     # required
capability_tags: [infrastructure, monitoring]   # required, >= 1
vmware_products: [vsphere, vcenter]    # optional; empty array allowed for generic entries
clients_supported: [claude-desktop, cursor, vscode, generic]   # required, >= 1
deploy_targets: [vmware-private-ai-foundation]  # required, >= 1
last_verified: 2026-05-25              # required, ISO date
---
```

Schema is enforced by a build-time plugin (`src/plugins/entry-manifest`) using Zod (or equivalent). Violations fail the Docusaurus build.

## 6. Detail page layout

Each entry page renders three tabs (sticky at top):

1. **Overview** — `index.mdx` body content with a metadata sidebar (tier badge, maintainer, repo link, last verified, capability/product tags).
2. **Install** — `<InstallSnippets>` component renders one tab per supported client. Each tab shows the exact `mcpServers` (or equivalent) JSON config block, with a copy-to-clipboard button. Config blocks are generated from frontmatter where possible.
3. **Deploy on VMware Private AI Foundation** — `deploy.mdx` body wrapped in `<DeployGuide>`, which enforces a consistent section order: Prerequisites → Container/Image → Secrets → Networking → Verification → Troubleshooting.

## 7. Shared React components

Under `src/components/`:

- `<TierBadge tier="official|verified|community" />` — colored badge.
- `<EntryCard entry={...} />` — used on listing pages; shows icon, name, tier badge, description, capability tags, VMware product tags.
- `<InstallSnippets clients={...} configBlocks={...} />` — tabbed copy-to-clipboard.
- `<DeployGuide>` — layout wrapper with anchor nav for the canonical deploy section order.
- `<FilterPanel facets={[capability, vmwareProduct]} />` — listing-page sidebar; updates URL query params so filtered views are shareable.

## 8. Listing pages

Six listing pages (3 tiers × 2 catalogs) implemented as React pages under `src/pages/`. Each:

1. Imports the build-time-generated `manifest.json` for its catalog and filters to its tier.
2. Renders `<FilterPanel>` + a responsive grid of `<EntryCard>`.
3. Reads URL query params (`?capability=monitoring&product=vsphere`) to apply filters; updates them on user interaction.

## 9. Build-time entry manifest plugin

Custom Docusaurus plugin at `src/plugins/entry-manifest/`:

- Scans `servers/**/index.mdx` and `skills/**/index.mdx`.
- Validates each frontmatter against the Zod schema in `schema.ts`.
- Emits two JSON manifests (`servers-manifest.json`, `skills-manifest.json`) into the Docusaurus data dir, consumed by listing pages.
- On any validation failure: log a clear error (`servers/community/foo/index.mdx: capability_tags is required`) and fail the build.

## 10. Repository layout

```
vmcphub/
├── docusaurus.config.ts
├── sidebars.ts
├── package.json
├── src/
│   ├── components/{TierBadge,EntryCard,InstallSnippets,DeployGuide,FilterPanel}.tsx
│   ├── pages/
│   │   ├── servers/{official,verified,community}.tsx
│   │   └── skills/{official,verified,community}.tsx
│   ├── plugins/entry-manifest/{index.ts, schema.ts}
│   └── lib/config-snippets.ts
├── servers/
│   ├── official/<slug>/{index.mdx, install.mdx, deploy.mdx}
│   ├── verified/<slug>/...
│   └── community/<slug>/...
├── skills/
│   └── (same shape as servers/)
├── docs/{contribution.md, deployment-primer.md, glossary.md}
└── static/img/icons/
```

## 11. Seed content (v1)

12 entries total — 2 per tier per catalog. All `repo_url` values are placeholder URLs (e.g., `https://github.com/vmware/vmcphub-placeholder/<slug>`) until real repositories exist.

| Catalog | Tier | Entries (slugs) |
|---|---|---|
| Servers | Official | `vcenter`, `nsx` |
| Servers | Verified | `verified-server-a`, `verified-server-b` (TBD) |
| Servers | Community | `confluence`, `jira` |
| Skills | Official | `vsphere-troubleshooting`, `nsx-policy-author` (TBD names) |
| Skills | Verified | `verified-skill-a`, `verified-skill-b` (TBD) |
| Skills | Community | `github-skill`, `slack-skill` (TBD) |

Final entry names for the TBD slots will be picked during implementation; the schema and layout do not depend on the specific choices.

## 12. Quality gates

- TypeScript strict mode; `tsc --noEmit` passes.
- Docusaurus production build (`pnpm build`) succeeds — this transitively runs the frontmatter validation plugin.
- All seed entries render without runtime errors in `pnpm start`.

No standalone test suite in v1.

## 13. Deferred decisions

- **Hosting target** — GitHub Pages vs. internal VMware mirror vs. both. Build output is the same; deployment pipeline differs.
- **Free-text search** — likely Algolia DocSearch or local lunr/fuse; revisit when catalog grows past ~50 entries.
- **Open contributions** — VMware-only in v1; if the community PR model is adopted later, the schema already supports it (tier field gates trust).
- **Versioning** — Docusaurus supports doc versioning; not enabled in v1.

## 14. Open items at end of brainstorming

None blocking implementation. Final TBD entry names noted in §11.
