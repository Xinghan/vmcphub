import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

export default function Home() {
  return (
    <Layout title="vmcphub" description="MCP Servers & Skills for VMware Private AI Foundation">
      <section className={styles.hero}>
        <h1>vmcphub</h1>
        <p>MCP Servers & Skills for VMware Private AI Foundation</p>
      </section>
      <section className={styles.tiers}>
        <div className={styles.tierCard}>
          <h2>Official</h2>
          <p>Authored and maintained by VMware.</p>
          <ul>
            <li><Link to="/servers/official">MCP Servers</Link></li>
            <li><Link to="/skills/official">Skills</Link></li>
          </ul>
        </div>
        <div className={styles.tierCard}>
          <h2>Verified Partners</h2>
          <p>Third-party offerings reviewed and verified by VMware.</p>
          <ul>
            <li><Link to="/servers/verified">MCP Servers</Link></li>
            <li><Link to="/skills/verified">Skills</Link></li>
          </ul>
        </div>
        <div className={styles.tierCard}>
          <h2>Community</h2>
          <p>Popular third-party tools with PAIF deployment guidance.</p>
          <ul>
            <li><Link to="/servers/community">MCP Servers</Link></li>
            <li><Link to="/skills/community">Skills</Link></li>
          </ul>
        </div>
      </section>
    </Layout>
  );
}
