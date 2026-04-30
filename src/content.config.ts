import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const KEBAB = /^[a-z][a-z0-9-]*$/;

// Tag taxonomy. Two axes: topic + mode. Edit this list to add/rename tags.
// See docs/tags.md for the schema and review checklist before adding.
export const TOPIC_TAGS = [
  'claude-code',
  'mental-models',
  'ai-culture',
  'talks',
  'debugging',
  'writing',
  'creative-expression',
] as const;

export const MODE_TAGS = [
  'workflow',
  'critique',
  'ruminating',
  'unhinged',
] as const;

export const ALLOWED_TAGS = [...TOPIC_TAGS, ...MODE_TAGS] as const;
const ALLOWED_TAG_SET = new Set<string>(ALLOWED_TAGS);

const tagSchema = z
  .string()
  .regex(KEBAB, 'tags must be lowercase kebab-case')
  .refine((t) => ALLOWED_TAG_SET.has(t), {
    message: `tag not in allowed taxonomy (src/content.config.ts). allowed: ${ALLOWED_TAGS.join(', ')}`,
  });

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    slug: z.string().regex(KEBAB, 'slug must be lowercase kebab-case'),
    description: z.string().optional(),
    updated_at: z.string().optional(),
    tags: z.array(tagSchema).default([]),
    custom_cap_toggle: z.string().optional(),
    draft: z.boolean().default(false),
  }).superRefine((data, ctx) => {
    if (!data.draft && data.tags.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'published posts must have at least one tag',
        path: ['tags'],
      });
    }
  }),
});

const kernels = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/kernels' }),
  schema: z.object({
    idea: z.string(),
    date: z.coerce.date(),
    sprouted: z.boolean().default(false),
    post_title: z.string().optional(),
    post_url: z.string().optional(),
  }),
});

export const collections = { posts, kernels };
