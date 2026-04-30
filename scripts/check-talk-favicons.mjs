#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const TALKS_DIR = "public/talks";
const REQUIRED = [
  '<link rel="icon" type="image/svg+xml" href="/favicon.svg"',
  '<link rel="apple-touch-icon" href="/apple-touch-icon.png"',
];

let missing = [];
for (const entry of readdirSync(TALKS_DIR)) {
  const path = join(TALKS_DIR, entry);
  if (!statSync(path).isDirectory()) continue;
  const html = join(path, "index.html");
  let content;
  try { content = readFileSync(html, "utf8"); } catch { continue; }
  for (const tag of REQUIRED) {
    if (!content.includes(tag)) { missing.push(`${html} missing: ${tag}`); break; }
  }
}

if (missing.length) {
  console.error("talk favicon check failed:");
  for (const m of missing) console.error("  " + m);
  console.error("\nadd to <head>:");
  console.error('  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />');
  console.error('  <link rel="icon" type="image/x-icon" href="/favicon.ico" />');
  console.error('  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />');
  process.exit(1);
}
