import * as path from 'node:path';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'vmcphub',
  tagline: 'MCP Servers & Skills for VMware Private AI Foundation',
  favicon: 'img/favicon.ico',
  url: 'https://example.invalid',
  baseUrl: '/',
  organizationName: 'Xinghan',
  projectName: 'vmcphub',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: { defaultLocale: 'en', locales: ['en'] },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: false,
        theme: { customCss: './src/css/custom.css' },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'servers',
        path: 'servers',
        routeBasePath: 'servers',
        sidebarPath: './sidebars.servers.ts',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'skills',
        path: 'skills',
        routeBasePath: 'skills',
        sidebarPath: './sidebars.skills.ts',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'hub-docs',
        path: 'docs',
        routeBasePath: '/',
        sidebarPath: './sidebars.hub.ts',
        include: ['**/*.md', '**/*.mdx'],
        exclude: ['superpowers/**'],
      },
    ],
    path.resolve(__dirname, 'src/plugins/entry-manifest'),
  ],

  themeConfig: {
    navbar: {
      title: 'vmcphub',
      items: [
        { to: '/getting-started/installation', label: 'Get Started', position: 'left' },
        { to: '/servers/official', label: 'MCP Servers', position: 'left' },
        { to: '/skills/official', label: 'Skills', position: 'left' },
        { to: '/deployment-primer', label: 'Deploy on PAIF', position: 'left' },
        { to: '/contribution', label: 'Contribute', position: 'right' },
        { href: 'https://github.com/Xinghan/vmcphub', label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} VMware.`,
    },
    colorMode: { defaultMode: 'light', respectPrefersColorScheme: true },
  } satisfies Preset.ThemeConfig,
};

export default config;
