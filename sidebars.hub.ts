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
      label: 'MCP Servers',
      collapsed: false,
      items: [
        { type: 'link', label: 'Official', href: '/servers/official' },
        { type: 'link', label: 'Verified Partners', href: '/servers/verified' },
        { type: 'link', label: 'Community', href: '/servers/community' },
      ],
    },
    {
      type: 'category',
      label: 'Skills',
      collapsed: false,
      items: [
        { type: 'link', label: 'Official', href: '/skills/official' },
        { type: 'link', label: 'Verified Partners', href: '/skills/verified' },
        { type: 'link', label: 'Community', href: '/skills/community' },
      ],
    },
    {
      type: 'category',
      label: 'Deploy on PAIF',
      collapsed: false,
      items: ['deployment-primer'],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      items: ['glossary', 'contribution'],
    },
  ],
};

export default sidebars;
