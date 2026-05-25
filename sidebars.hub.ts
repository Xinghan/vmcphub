import * as fs from 'node:fs';
import * as path from 'node:path';
import type { SidebarsConfig, SidebarItemConfig } from '@docusaurus/plugin-content-docs';

type Tier = 'official' | 'verified' | 'community';
type Catalog = 'servers' | 'skills';

const TIER_LABEL: Record<Tier, string> = {
  official: 'Official',
  verified: 'Verified Partners',
  community: 'Community',
};

function scanEntries(catalog: Catalog, tier: Tier): { slug: string; name: string }[] {
  const dir = path.join(__dirname, 'content', catalog, tier);
  if (!fs.existsSync(dir)) return [];
  const slugs = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  const entries = slugs.map((slug) => {
    const fp = path.join(dir, slug, 'index.mdx');
    const raw = fs.readFileSync(fp, 'utf8');
    const m = raw.match(/^name:\s*(.+)$/m);
    return { slug, name: m ? m[1]!.trim() : slug };
  });
  entries.sort((a, b) => a.name.localeCompare(b.name));
  return entries;
}

function tierCategory(catalog: Catalog, tier: Tier): SidebarItemConfig {
  const entries = scanEntries(catalog, tier);
  return {
    type: 'category',
    label: TIER_LABEL[tier],
    collapsed: true,
    items: [
      { type: 'doc', id: `${catalog}/${tier}/index`, label: 'Overview' },
      ...entries.map((e) => ({
        type: 'doc' as const,
        id: `${catalog}/${tier}/${e.slug}/index`,
        label: e.name,
      })),
    ],
  };
}

function catalogCategory(catalog: Catalog, label: string): SidebarItemConfig {
  return {
    type: 'category',
    label,
    collapsed: false,
    items: [
      tierCategory(catalog, 'official'),
      tierCategory(catalog, 'verified'),
      tierCategory(catalog, 'community'),
    ],
  };
}

const sidebars: SidebarsConfig = {
  hubSidebar: [
    'welcome',
    {
      type: 'category',
      label: 'Get Started',
      collapsed: false,
      items: ['getting-started/installation', 'getting-started/your-first-server'],
    },
    catalogCategory('servers', 'MCP Servers'),
    catalogCategory('skills', 'Skills'),
    {
      type: 'category',
      label: 'Deploy on PAIF',
      collapsed: false,
      items: [
        'deployment-primer',
        'deploy/from-source',
        'deploy/from-broadcom-containers',
        'deploy/paif-builder',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: true,
      items: ['glossary', 'contribution'],
    },
  ],
};

export default sidebars;
