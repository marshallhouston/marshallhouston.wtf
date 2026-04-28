// Port all _posts/*.md → src/content/posts/<slug>.md
// Computes slug from permalink: field or filename (date-prefix stripped).
import fs from 'node:fs';
import path from 'node:path';

const SRC = '/Users/marshallhouston/code/marshallhouston.wtf-astro-spike/_posts';
const DST = '/Users/marshallhouston/code/marshallhouston.wtf-astro-spike/astro/src/content/posts';

const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.md'));
const ported = [];

for (const f of files) {
  const raw = fs.readFileSync(path.join(SRC, f), 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) { console.error(`skip ${f}: no frontmatter`); continue; }
  const fm = m[1];
  const body = m[2];

  const permalinkMatch = fm.match(/^permalink:\s*\/?(.+?)\/?\s*$/m);
  let slug;
  if (permalinkMatch) {
    slug = permalinkMatch[1].replace(/^\/|\/$/g, '');
  } else {
    // strip date prefix YYYY-MM-DD-
    slug = f.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
  }

  // Build new frontmatter: drop permalink, add slug, ensure date
  let newFm = fm
    .split('\n')
    .filter((line) => !line.startsWith('permalink:'))
    .join('\n');
  if (!/^slug:/m.test(newFm)) newFm += `\nslug: ${slug}`;
  if (!/^date:/m.test(newFm)) {
    const dateMatch = f.match(/^(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) newFm += `\ndate: ${dateMatch[1]}`;
  }

  const out = `---\n${newFm}\n---\n${body}`;
  const outPath = path.join(DST, `${slug}.md`);
  fs.writeFileSync(outPath, out);
  ported.push({ file: f, slug });
}

console.log(JSON.stringify(ported, null, 2));
console.log(`\nPorted ${ported.length} posts.`);
