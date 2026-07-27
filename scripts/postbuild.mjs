import fs from 'node:fs';
import path from 'node:path';

/**
 * Next's static export writes `about.html` for the route `/about`, but the
 * site's canonical URL has always been `/about/`, which GitHub Pages serves
 * from `about/index.html`. This moves the file into place.
 *
 * It is a move, not a copy, for two reasons: relative links inside the content
 * (`./winners/2025.html`) only resolve correctly from the directory URL, and
 * leaving both would publish duplicate pages with broken links. Nothing needs
 * the flat file — navigation uses real <a href> page loads rather than the
 * client-side router.
 *
 * The list is derived from the content tree: every `content/<dir>/index.md`
 * is a directory-style URL. Nothing to maintain by hand.
 */

const OUT = path.join(process.cwd(), 'out');
const CONTENT = path.join(process.cwd(), 'content');

function dirsWithIndex(dir, prefix = '') {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (fs.existsSync(path.join(dir, entry.name, 'index.md'))) out.push(rel);
    out.push(...dirsWithIndex(path.join(dir, entry.name), rel));
  }
  return out;
}

if (!fs.existsSync(OUT)) {
  console.error('postbuild: out/ not found — run `next build` first.');
  process.exit(1);
}

const created = [];
const missing = [];

for (const rel of dirsWithIndex(CONTENT)) {
  const source = path.join(OUT, `${rel}.html`);
  const target = path.join(OUT, rel, 'index.html');
  if (!fs.existsSync(source)) {
    missing.push(`${rel}.html`);
    continue;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.renameSync(source, target);
  created.push(`/${rel}/`);
}

console.log(`postbuild: moved ${created.length} pages to directory-index URLs`);
for (const url of created) console.log(`  ${url}`);

if (missing.length) {
  console.error(`postbuild: expected export output that was not found: ${missing.join(', ')}`);
  process.exit(1);
}
