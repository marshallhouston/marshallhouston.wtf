#!/usr/bin/env node
// One-shot migration: _drafts/*.md → src/content/posts/*.md with draft: true.
// Strips Jekyll-only frontmatter (layout, classes, permalink, series). Derives
// slug from permalink when present, else from filename minus YYYY-MM-DD prefix.
// Keeps original date if set; falls back to file mtime.

import { readdirSync, readFileSync, writeFileSync, statSync, unlinkSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SRC = '_drafts';
const DEST = 'src/content/posts';
const STRIP = new Set(['layout', 'classes', 'permalink', 'series', 'kernel', 'captured', 'status', 'venue', 'length', 'format']);

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: raw };
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].trim();
  }
  return { fm, body: m[2], rawFm: m[1] };
}

function deriveSlug(filename, fm) {
  if (fm.permalink) {
    return fm.permalink.replace(/^\/|\/$/g, '');
  }
  return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
}

function deriveDate(fm, filepath) {
  if (fm.date) return fm.date.split(' ')[0].replace(/['"]/g, '');
  return statSync(filepath).mtime.toISOString().slice(0, 10);
}

function rebuild(fm, body, slug, date) {
  const lines = ['---'];
  lines.push(`title: ${fm.title || 'untitled draft'}`);
  lines.push(`date: ${date}`);
  lines.push(`slug: ${slug}`);
  lines.push('draft: true');
  if (fm.updated_at) lines.push(`updated_at: ${fm.updated_at}`);
  if (fm.tags) lines.push(`tags: ${fm.tags}`);
  for (const [k, v] of Object.entries(fm)) {
    if (STRIP.has(k)) continue;
    if (['title', 'date', 'slug', 'draft', 'updated_at', 'tags'].includes(k)) continue;
    lines.push(`${k}: ${v}`);
  }
  lines.push('---');
  return lines.join('\n') + '\n' + body;
}

const files = readdirSync(SRC).filter((f) => f.endsWith('.md'));
const moves = [];

for (const f of files) {
  const path = join(SRC, f);
  const raw = readFileSync(path, 'utf-8');
  const { fm, body } = parseFrontmatter(raw);
  const slug = deriveSlug(f, fm);
  const date = deriveDate(fm, path);
  const out = rebuild(fm, body, slug, date);
  let destFilename = f.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  let destPath = join(DEST, destFilename);
  if (existsSync(destPath)) {
    const renamed = destFilename.replace(/\.md$/, '-draft.md');
    destPath = join(DEST, renamed);
    if (existsSync(destPath)) {
      console.error(`SKIP: ${f} → ${destPath} also exists, refusing to overwrite`);
      continue;
    }
  }
  writeFileSync(destPath, out);
  unlinkSync(path);
  moves.push({ from: path, to: destPath, slug, date });
}

console.log(`migrated ${moves.length} drafts:`);
for (const m of moves) console.log(`  ${m.from} → ${m.to}  (slug=${m.slug}, date=${m.date})`);
