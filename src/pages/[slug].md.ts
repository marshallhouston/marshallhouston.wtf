import type { APIRoute } from 'astro';
import { getRoutablePosts } from '../lib/post-utils';

// Emits each post's markdown source alongside its HTML page, so agents can
// fetch the content without the surrounding chrome. Caddy serves this file
// for `Accept: text/markdown` on the slashless post URL (see Caddyfile), so
// /unpromptable and /unpromptable.md are the same content, two formats.
//
// The prose pages (about, contact, privacy) are authored as markdown in
// src/prose/ and rendered by their .astro page, so the same source serves
// both formats with no second copy to keep in sync.

const prose = import.meta.glob<string>('../prose/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export async function getStaticPaths() {
  const posts = await getRoutablePosts();

  return [
    ...posts.map((post) => ({
      params: { slug: post.data.slug },
      props: { post },
    })),
    ...Object.entries(prose).map(([file, source]) => ({
      params: { slug: file.replace(/^.*\/(.+)\.md$/, '$1') },
      props: { source },
    })),
  ];
}

// Minimal YAML scalar quoting: only what post frontmatter can actually hold.
const yaml = (s: string) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

const markdown = (body: string) =>
  new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });

export const GET: APIRoute = ({ props, params }) => {
  const { post, source } = props as {
    post?: Awaited<ReturnType<typeof getRoutablePosts>>[number];
    source?: string;
  };

  // Prose pages already carry their own frontmatter; pass them through with a
  // source url appended so an agent can find the canonical html.
  if (source !== undefined) {
    const url = new URL(`/${params.slug}`, 'https://marshallhouston.wtf').toString();
    return markdown(source.replace(/^---\n/, `---\nsource: ${yaml(url)}\n`));
  }

  const { title, date, tags, description } = post!.data;

  const frontmatter = [
    '---',
    `title: ${yaml(title)}`,
    `date: ${date.toISOString().slice(0, 10)}`,
    ...(description ? [`description: ${yaml(description)}`] : []),
    ...(tags.length ? [`tags: [${tags.join(', ')}]`] : []),
    `source: ${yaml(new URL(`/${post!.data.slug}`, 'https://marshallhouston.wtf').toString())}`,
    '---',
    '',
  ].join('\n');

  return markdown(frontmatter + (post!.body ?? ''));
};
