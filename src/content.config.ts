import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    slug: z.string(),
    description: z.string().optional(),
    updated_at: z.string().optional(),
    tags: z.array(z.string()).default([]),
    custom_cap_toggle: z.string().optional(),
    draft: z.boolean().default(false),
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
