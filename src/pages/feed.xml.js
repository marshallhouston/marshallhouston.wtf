import rss from '@astrojs/rss';
import { getPosts } from '../lib/post-utils';

export async function GET(context) {
  const posts = (await getPosts()).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: 'marshall houston',
    description: 'exploring creativity, ai, and how we write the future together',
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      link: `/${p.data.slug}/`,
      categories: p.data.tags,
    })),
    customData: `<language>en-us</language>`,
  });
}
