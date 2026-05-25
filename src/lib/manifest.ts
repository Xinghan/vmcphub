import { usePluginData } from '@docusaurus/useGlobalData';
import type { Catalog, Manifest, Tier, ManifestEntry } from '../types/entry';

interface PluginData {
  servers: Manifest;
  skills: Manifest;
}

export function useManifest(catalog: Catalog, tier: Tier): ManifestEntry[] {
  const data = usePluginData('vmcphub-entry-manifest') as PluginData;
  return data[catalog].filter((e) => e.tier === tier);
}

export function uniqueValues(
  entries: ManifestEntry[],
  key: 'capability_tags' | 'vmware_products',
): string[] {
  const set = new Set<string>();
  for (const e of entries) for (const v of e[key]) set.add(v);
  return [...set].sort();
}
