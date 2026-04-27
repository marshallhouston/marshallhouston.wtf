import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('posts');
  const staticPages = ['', 'about/', 'books/', 'influences/', 'moments/', 'kernels/', 'tags/'];
  const postUrls = posts.map((p) => `${p.data.slug}/`);

  const urls = [...staticPages, ...postUrls].map(
    (u) => `  <url><loc>${context.site}${u}</loc></url>`
  );

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
