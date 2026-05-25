import React from 'react';
import styles from './FilterPanel.module.css';

export interface FilterState {
  capability: string[];
  product: string[];
}

interface Props {
  capabilityOptions: string[];
  productOptions: string[];
  value: FilterState;
  onChange: (next: FilterState) => void;
}

function toggle(arr: string[], v: string): string[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function FilterPanel({ capabilityOptions, productOptions, value, onChange }: Props) {
  return (
    <aside className={styles.panel}>
      <div className={styles.group}>
        <h4>Capability</h4>
        {capabilityOptions.map((opt) => (
          <label key={opt} className={styles.option}>
            <input
              type="checkbox"
              checked={value.capability.includes(opt)}
              onChange={() => onChange({ ...value, capability: toggle(value.capability, opt) })}
            />
            {opt}
          </label>
        ))}
        {capabilityOptions.length === 0 && <p>No capabilities.</p>}
      </div>
      <div className={styles.group}>
        <h4>VMware Product</h4>
        {productOptions.map((opt) => (
          <label key={opt} className={styles.option}>
            <input
              type="checkbox"
              checked={value.product.includes(opt)}
              onChange={() => onChange({ ...value, product: toggle(value.product, opt) })}
            />
            {opt}
          </label>
        ))}
        {productOptions.length === 0 && <p>No products.</p>}
      </div>
      {(value.capability.length > 0 || value.product.length > 0) && (
        <button className={styles.clearBtn} onClick={() => onChange({ capability: [], product: [] })}>
          Clear filters
        </button>
      )}
    </aside>
  );
}
