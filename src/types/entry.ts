export type Tier = 'official' | 'verified' | 'community';
export type Catalog = 'servers' | 'skills';
export type EntryType = 'server' | 'skill';

export type SupportedClient =
  | 'claude-desktop'
  | 'cursor'
  | 'vscode'
  | 'generic';

export type DeployTarget = 'vmware-private-ai-foundation';

export interface EntryFrontmatter {
  name: string;
  tier: Tier;
  type: EntryType;
  description: string;
  icon: string;
  repo_url: string;
  maintainer: string;
  capability_tags: string[];
  vmware_products: string[];
  clients_supported: SupportedClient[];
  deploy_targets: DeployTarget[];
  last_verified: string;
}

export interface ManifestEntry extends EntryFrontmatter {
  slug: string;
  catalog: Catalog;
  detailUrl: string;
}

export type Manifest = ManifestEntry[];
