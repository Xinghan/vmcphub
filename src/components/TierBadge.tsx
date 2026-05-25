import React from 'react';
import clsx from 'clsx';
import type { Tier } from '../types/entry';
import styles from './TierBadge.module.css';

const LABEL: Record<Tier, string> = {
  official: 'Official',
  verified: 'Verified',
  community: 'Community',
};

export function TierBadge({ tier }: { tier: Tier }) {
  return <span className={clsx(styles.badge, styles[tier])}>{LABEL[tier]}</span>;
}
