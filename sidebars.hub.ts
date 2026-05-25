import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  hubSidebar: [
    'welcome',
    {
      type: 'category',
      label: 'Get Started',
      collapsed: false,
      items: ['getting-started/installation', 'getting-started/your-first-server'],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      items: ['deployment-primer', 'glossary', 'contribution'],
    },
  ],
};

export default sidebars;
