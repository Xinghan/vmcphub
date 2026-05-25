import React from 'react';
import styles from './DeployGuide.module.css';

const SECTIONS = [
  { id: 'prerequisites', label: 'Prerequisites' },
  { id: 'container-image', label: 'Container / Image' },
  { id: 'secrets', label: 'Secrets' },
  { id: 'networking', label: 'Networking' },
  { id: 'verification', label: 'Verification' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
];

export function DeployGuide({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <nav className={styles.nav}>
        <h4>On this page</h4>
        <ol>
          {SECTIONS.map((s) => (
            <li key={s.id}><a href={`#${s.id}`}>{s.label}</a></li>
          ))}
        </ol>
      </nav>
      <div>{children}</div>
    </div>
  );
}
