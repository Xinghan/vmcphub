import React, { useState } from 'react';
import clsx from 'clsx';
import type { SupportedClient } from '../types/entry';
import { buildSnippet, CLIENT_LABEL, SnippetInput } from '../lib/config-snippets';
import styles from './InstallSnippets.module.css';

interface Props {
  clients: SupportedClient[];
  entry: SnippetInput;
}

export function InstallSnippets({ clients, entry }: Props) {
  const [active, setActive] = useState<SupportedClient>(clients[0] ?? 'generic');
  const [copied, setCopied] = useState(false);
  const snippet = buildSnippet(active, entry);

  const copy = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className={styles.tabs}>
        {clients.map((c) => (
          <button
            key={c}
            className={clsx(styles.tab, c === active && styles.active)}
            onClick={() => setActive(c)}
          >
            {CLIENT_LABEL[c]}
          </button>
        ))}
      </div>
      <div className={styles.codeWrap}>
        <button
          className={clsx(styles.copyBtn, copied && styles.copied)}
          onClick={copy}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
        <pre className={styles.code}><code>{snippet}</code></pre>
      </div>
    </div>
  );
}
