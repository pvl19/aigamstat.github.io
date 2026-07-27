import fs from 'node:fs';
import path from 'node:path';
import { CONTENT_DIR } from './markdown';

/**
 * Navigation is derived from what is on disk, not from a config list. Drop a
 * new file into content/ and it appears in the right menu automatically --
 * under Jekyll this needed a matching edit in _config.yml, which was easy to
 * forget and left pages unreachable.
 */

function yearsFromFiles(dir: string): string[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .map((f) => f.match(/^(\d{4})\.md$/)?.[1])
    .filter((y): y is string => Boolean(y))
    .sort()
    .reverse();
}

/** JSM years come from directories: content/jsm2026/ -> "2026". Newest first. */
export function jsmYears(): string[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .map((d) => d.match(/^jsm(\d{4})$/)?.[1])
    .filter((y): y is string => Boolean(y))
    .sort()
    .reverse();
}

/** The newest JSM year is the current meeting. */
export function currentJsmYear(): string {
  return jsmYears()[0];
}

export const winnerYears = () => yearsFromFiles('competition/winners');
export const officerYears = () => yearsFromFiles('about/officers');

export type Section =
  | 'home'
  | 'officers'
  | 'charter'
  | 'join'
  | 'competition'
  | 'jsm'
  | 'news'
  | 'contact';

/**
 * Which top-level section a URL belongs to, for highlighting the nav.
 *
 * Officers and Charter are top-level sections but keep their original
 * /about/... URLs so existing links and bookmarks still resolve. The nav
 * hierarchy and the URL structure differ here deliberately.
 */
export function sectionFor(url: string): Section {
  if (url === '/') return 'home';
  if (url.startsWith('/about/officers')) return 'officers';
  if (url.startsWith('/about/charter')) return 'charter';
  if (url.startsWith('/join')) return 'join';
  if (url.startsWith('/competition')) return 'competition';
  if (url.startsWith('/jsm')) return 'jsm';
  if (url.startsWith('/news')) return 'news';
  if (url.startsWith('/contact')) return 'contact';
  return 'home';
}

export type NavItem = { label: string; url: string; section: Section };

/**
 * The nav row. Join AIG is deliberately absent: it is the site's call to
 * action and lives as a standalone button in the header (see SiteHeader), so
 * the 'join' section still exists for highlighting purposes.
 */
export function mainNav(): NavItem[] {
  return [
    { label: 'Home', url: '/', section: 'home' },
    { label: 'JSM 2026', url: `/jsm${currentJsmYear()}/`, section: 'jsm' },
    { label: 'Officers', url: '/about/officers/', section: 'officers' },
    { label: 'Charter', url: '/about/charter.html', section: 'charter' },
    // Points at the first item of the section row, not at /competition/, so the
    // tab opens on whatever that row shows first.
    {
      label: 'Student Paper Competition',
      url: '/competition/nominees.html',
      section: 'competition',
    },
    { label: 'News', url: '/news.html', section: 'news' },
    { label: 'Contact', url: '/contact.html', section: 'contact' },
  ];
}
