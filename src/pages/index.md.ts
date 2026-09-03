import type { APIRoute } from 'astro';
import { getPosts, excerpt, fmtDate } from '../lib/post-utils';

// The homepage as markdown. Caddy rewrites `/` here when the request asks for
// text/markdown (see Caddyfile), so an agent gets the post index without
// parsing the html listing.

const SITE = 'https://marshallhouston.wtf';

export const GET: APIRoute = async () => {
  const posts = (await getPosts()).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const body = [
    '---',
    'title: "marshall houston"',
    'description: "exploring creativity, ai, and how we write the future together"',
    `source: "${SITE}/"`,
    '---',
    '',
    '# marshall houston',
    '',
    'exploring creativity, ai, and how we write the future together.',
    'exploratory writing, ideas in flight, and small tools.',
    '',
    '## recent posts',
    '',
    ...posts.map((p) => {
      const summary = p.data.description || excerpt(p.body ?? '');
      return `- [${p.data.title}](${SITE}/${p.data.slug}) - ${fmtDate(p.data.date)}${summary ? `. ${summary}` : ''}`;
    }),
    '',
    '## elsewhere',
    '',
    `- [about](${SITE}/about)`,
    `- [contact](${SITE}/contact)`,
    `- [privacy](${SITE}/privacy)`,
    `- [kernels](${SITE}/kernels)`,
    `- [influences](${SITE}/influences)`,
    `- [talks](${SITE}/talks)`,
    `- [tags](${SITE}/tags)`,
    '',
    '## machine-readable',
    '',
    `- [llms.txt](${SITE}/llms.txt) - what this site is, and when to use it`,
    `- [sitemap](${SITE}/sitemap-index.xml)`,
    `- [rss](${SITE}/feed.xml)`,
    '',
    'every post is also available as markdown: append `.md` to its url, or send',
    '`Accept: text/markdown`.',
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
