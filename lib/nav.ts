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

export type Section = 'home' | 'about' | 'join' | 'competition' | 'jsm' | 'asaip' | 'news';

/** Which top-level section a URL belongs to, for highlighting the nav. */
export function sectionFor(url: string): Section {
  if (url === '/') return 'home';
  if (url.startsWith('/about')) return 'about';
  if (url.startsWith('/join')) return 'join';
  if (url.startsWith('/competition')) return 'competition';
  if (url.startsWith('/jsm')) return 'jsm';
  if (url.startsWith('/ASAIP')) return 'asaip';
  if (url.startsWith('/news')) return 'news';
  return 'home';
}

export type NavItem = { label: string; url: string; section: Section };

export function mainNav(): NavItem[] {
  return [
    { label: 'Home', url: '/', section: 'home' },
    { label: 'About Us', url: '/about/', section: 'about' },
    { label: 'Join AIG', url: '/join.html', section: 'join' },
    { label: 'Student Paper Competition', url: '/competition/', section: 'competition' },
    { label: 'JSM', url: `/jsm${currentJsmYear()}/`, section: 'jsm' },
    { label: 'ASAIP', url: '/ASAIP/', section: 'asaip' },
    { label: 'News', url: '/news.html', section: 'news' },
  ];
}
