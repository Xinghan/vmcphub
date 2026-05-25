import React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import type { ManifestEntry } from '../types/entry';
import { TierBadge } from './TierBadge';
import styles from './EntryCard.module.css';

export function EntryCard({ entry }: { entry: ManifestEntry }) {
  return (
    <Link to={entry.detailUrl} className={styles.card}>
      <div className={styles.header}>
        <img src={entry.icon} alt="" className={styles.icon} />
        <h3 className={styles.name}>{entry.name}</h3>
        <TierBadge tier={entry.tier} />
      </div>
      <p className={styles.description}>{entry.description}</p>
      <div className={styles.tags}>
        {entry.capability_tags.map((t) => (
          <span key={`cap-${t}`} className={styles.tag}>{t}</span>
        ))}
        {entry.vmware_products.map((p) => (
          <span key={`prod-${p}`} className={clsx(styles.tag, styles.productTag)}>{p}</span>
        ))}
      </div>
    </Link>
  );
}
