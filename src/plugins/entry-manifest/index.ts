import type { LoadContext, Plugin } from '@docusaurus/types';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import matter from 'gray-matter';
import { EntryFrontmatterSchema } from './schema';
import type { Catalog, Manifest, ManifestEntry } from '../../types/entry';

const REQUIRED_FILES = ['index.mdx', 'install.mdx', 'deploy.mdx'];

async function scanCatalog(siteDir: string, catalog: Catalog): Promise<ManifestEntry[]> {
  const root = path.join(siteDir, 'content', catalog);
  const entries: ManifestEntry[] = [];
  let tierDirs: string[];
  try {
    tierDirs = await fs.readdir(root);
  } catch {
    return entries;
  }

  for (const tier of tierDirs) {
    const tierPath = path.join(root, tier);
    const stat = await fs.stat(tierPath);
    if (!stat.isDirectory()) continue;

    const slugDirs = await fs.readdir(tierPath);
    for (const slug of slugDirs) {
      const entryDir = path.join(tierPath, slug);
      const entryStat = await fs.stat(entryDir);
      if (!entryStat.isDirectory()) continue;

      for (const required of REQUIRED_FILES) {
        const fp = path.join(entryDir, required);
        try {
          await fs.access(fp);
        } catch {
          throw new Error(`vmcphub: missing required file ${catalog}/${tier}/${slug}/${required}`);
        }
      }

      const indexPath = path.join(entryDir, 'index.mdx');
      const raw = await fs.readFile(indexPath, 'utf8');
      const { data } = matter(raw);

      const parsed = EntryFrontmatterSchema.safeParse(data);
      if (!parsed.success) {
        const issues = parsed.error.issues
          .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
          .join('\n');
        throw new Error(
          `vmcphub: invalid frontmatter in ${catalog}/${tier}/${slug}/index.mdx\n${issues}`,
        );
      }

      if (parsed.data.tier !== tier) {
        throw new Error(
          `vmcphub: tier mismatch in ${catalog}/${tier}/${slug}/index.mdx — frontmatter says "${parsed.data.tier}", directory says "${tier}"`,
        );
      }
      const expectedType = catalog === 'servers' ? 'server' : 'skill';
      if (parsed.data.type !== expectedType) {
        throw new Error(
          `vmcphub: type mismatch in ${catalog}/${tier}/${slug}/index.mdx — expected "${expectedType}", got "${parsed.data.type}"`,
        );
      }

      entries.push({
        ...parsed.data,
        slug,
        catalog,
        detailUrl: `/${catalog}/${tier}/${slug}`,
      });
    }
  }

  return entries;
}

export default function entryManifestPlugin(context: LoadContext): Plugin<{
  servers: Manifest;
  skills: Manifest;
}> {
  return {
    name: 'vmcphub-entry-manifest',
    async loadContent() {
      const servers = await scanCatalog(context.siteDir, 'servers');
      const skills = await scanCatalog(context.siteDir, 'skills');
      return { servers, skills };
    },
    async contentLoaded({ content, actions }) {
      const { createData, setGlobalData } = actions;
      await createData('servers-manifest.json', JSON.stringify(content.servers, null, 2));
      await createData('skills-manifest.json', JSON.stringify(content.skills, null, 2));
      setGlobalData({ servers: content.servers, skills: content.skills });
    },
  };
}
