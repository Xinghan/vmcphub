import type { SupportedClient } from '../types/entry';

export interface SnippetInput {
  slug: string;
  name: string;
  repo_url: string;
}

export function buildSnippet(client: SupportedClient, input: SnippetInput): string {
  const serverKey = input.slug.replace(/-/g, '_');
  const block = {
    [serverKey]: {
      command: 'npx',
      args: ['-y', `@vmware/mcp-${input.slug}`],
    },
  };
  switch (client) {
    case 'claude-desktop':
      return JSON.stringify({ mcpServers: block }, null, 2);
    case 'cursor':
      return JSON.stringify({ mcpServers: block }, null, 2);
    case 'vscode':
      return JSON.stringify({ 'mcp.servers': block }, null, 2);
    case 'generic':
      return JSON.stringify(block, null, 2);
  }
}

export const CLIENT_LABEL: Record<SupportedClient, string> = {
  'claude-desktop': 'Claude Desktop',
  'cursor': 'Cursor',
  'vscode': 'VS Code',
  'generic': 'Generic JSON',
};
