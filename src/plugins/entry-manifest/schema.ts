import { z } from 'zod';

export const TierSchema = z.enum(['official', 'verified', 'community']);
export const EntryTypeSchema = z.enum(['server', 'skill']);
export const SupportedClientSchema = z.enum([
  'claude-desktop',
  'cursor',
  'vscode',
  'generic',
]);
export const DeployTargetSchema = z.enum(['vmware-private-ai-foundation']);

export const EntryFrontmatterSchema = z.object({
  name: z.string().min(1),
  tier: TierSchema,
  type: EntryTypeSchema,
  description: z.string().min(1).max(140),
  icon: z.string().startsWith('/'),
  repo_url: z.string().url(),
  maintainer: z.string().min(1),
  capability_tags: z.array(z.string().min(1)).min(1),
  vmware_products: z.array(z.string().min(1)).default([]),
  clients_supported: z.array(SupportedClientSchema).min(1),
  deploy_targets: z.array(DeployTargetSchema).min(1),
  last_verified: z
    .union([z.string(), z.date()])
    .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v))
    .refine((s) => /^\d{4}-\d{2}-\d{2}$/.test(s), 'must be ISO date YYYY-MM-DD'),
});

export type ParsedFrontmatter = z.infer<typeof EntryFrontmatterSchema>;
