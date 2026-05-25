import React from 'react';
import type { Catalog, Tier } from '../types/entry';
import { useManifest } from '../lib/manifest';
import { EntryCard } from './EntryCard';
import styles from './CardGrid.module.css';

export function CardGrid({ catalog, tier }: { catalog: Catalog; tier: Tier }) {
  const entries = useManifest(catalog, tier);
  if (entries.length === 0) {
    return <p className={styles.empty}>No {catalog} in this tier yet.</p>;
  }
  return (
    <div className={styles.grid}>
      {entries.map((e) => <EntryCard key={e.slug} entry={e} />)}
    </div>
  );
}
