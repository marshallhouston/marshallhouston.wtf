import type { APIRoute } from 'astro';
import { getRoutablePosts } from '../lib/post-utils';

// Emits each post's markdown source alongside its HTML page, so agents can
// fetch the content without the surrounding chrome. Caddy serves this file
// for `Accept: text/markdown` on the slashless post URL (see Caddyfile), so
// /unpromptable and /unpromptable.md are the same content, two formats.

export async function getStaticPaths() {
  const posts = await getRoutablePosts();
  return posts.map((post) => ({
    params: { slug: post.data.slug },
    props: { post },
  }));
}

// Minimal YAML scalar quoting: only what post frontmatter can actually hold.
const yaml = (s: string) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

export const GET: APIRoute = ({ props }) => {
  const { post } = props as { post: Awaited<ReturnType<typeof getRoutablePosts>>[number] };
  const { title, date, tags, description } = post.data;

  const frontmatter = [
    '---',
    `title: ${yaml(title)}`,
    `date: ${date.toISOString().slice(0, 10)}`,
    ...(description ? [`description: ${yaml(description)}`] : []),
    ...(tags.length ? [`tags: [${tags.join(', ')}]`] : []),
    `source: ${yaml(new URL(`/${post.data.slug}`, 'https://marshallhouston.wtf').toString())}`,
    '---',
    '',
  ].join('\n');

  return new Response(frontmatter + (post.body ?? ''), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
};
