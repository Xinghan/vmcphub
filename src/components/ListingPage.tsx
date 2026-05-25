import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import type { Catalog, Tier } from '../types/entry';
import { useManifest, uniqueValues } from '../lib/manifest';
import { EntryCard } from './EntryCard';
import { FilterPanel, FilterState } from './FilterPanel';
import styles from './ListingPage.module.css';

const TIER_TITLES: Record<Tier, string> = {
  official: 'VMware Official',
  verified: 'VMware-Verified Partners',
  community: 'Popular Community',
};

const CATALOG_TITLES: Record<Catalog, string> = {
  servers: 'MCP Servers',
  skills: 'Skills',
};

function parseQuery(search: string): FilterState {
  const params = new URLSearchParams(search);
  const split = (v: string | null) => (v ? v.split(',').filter(Boolean) : []);
  return {
    capability: split(params.get('capability')),
    product: split(params.get('product')),
  };
}

function toQuery(state: FilterState): string {
  const params = new URLSearchParams();
  if (state.capability.length) params.set('capability', state.capability.join(','));
  if (state.product.length) params.set('product', state.product.join(','));
  const s = params.toString();
  return s ? `?${s}` : '';
}

export function ListingPage({ catalog, tier }: { catalog: Catalog; tier: Tier }) {
  const entries = useManifest(catalog, tier);
  const capabilityOptions = useMemo(() => uniqueValues(entries, 'capability_tags'), [entries]);
  const productOptions = useMemo(() => uniqueValues(entries, 'vmware_products'), [entries]);

  const [filters, setFilters] = useState<FilterState>({ capability: [], product: [] });

  useEffect(() => {
    if (typeof window !== 'undefined') setFilters(parseQuery(window.location.search));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const q = toQuery(filters);
    const next = `${window.location.pathname}${q}`;
    if (next !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(null, '', next);
    }
  }, [filters]);

  const visible = entries.filter((e) => {
    if (filters.capability.length && !filters.capability.some((c) => e.capability_tags.includes(c))) return false;
    if (filters.product.length && !filters.product.some((p) => e.vmware_products.includes(p))) return false;
    return true;
  });

  const title = `${CATALOG_TITLES[catalog]} — ${TIER_TITLES[tier]}`;

  return (
    <Layout title={title}>
      <div className={styles.layout}>
        <header className={styles.header}>
          <h1>{title}</h1>
          <p>{visible.length} of {entries.length} {catalog}</p>
        </header>
        <FilterPanel
          capabilityOptions={capabilityOptions}
          productOptions={productOptions}
          value={filters}
          onChange={setFilters}
        />
        {visible.length > 0 ? (
          <div className={styles.grid}>
            {visible.map((e) => <EntryCard key={e.slug} entry={e} />)}
          </div>
        ) : (
          <div className={styles.empty}>No {catalog} match your filters.</div>
        )}
      </div>
    </Layout>
  );
}
