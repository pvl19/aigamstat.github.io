/**
 * `basePath` is the React equivalent of Jekyll's old `baseurl`: it must match
 * the path GitHub Pages serves the repository from.
 *
 *   served from a custom domain or <account>.github.io  ->  '' (empty)
 *   served at <account>.github.io/<repo>/               ->  '/<repo>'
 *
 * Set below for a project-page deployment. Serving from the root with this
 * non-empty resolves every asset one level too high, and the site loads
 * unstyled. See README.md.
 */
const basePath = '/aigamstat.github.io';

/** @type {import('next').NextConfig} */
export default {
  // Emits a plain folder of .html files -- no Node server needed at runtime,
  // which is what lets GitHub Pages host it.
  output: 'export',
  basePath,

  /**
   * Every page is a directory URL: the route /officers exports to
   * out/officers/index.html and is served at /officers/.
   *
   * This is worth more than it looks. It makes the dev server and the published
   * site agree on every URL, which they did not when routes exported as
   * `officers.html`: the dev server had nothing at that path, so links broke
   * locally while working in production, and previously needed redirects here
   * to paper over it. It also removes the post-build step that used to move
   * files into place, and it keeps relative links inside the content working,
   * since those resolve against a directory.
   */
  trailingSlash: true,

  /**
   * Only affects `next dev`; the export writes finished files and never
   * redirects.
   *
   * With both `basePath` and `trailingSlash` set, the dev server bounces the
   * base root between `/<basePath>/` and `/<basePath>` forever, so the home
   * page cannot be opened locally at all. Turning its trailing-slash redirect
   * off stops the loop. Every link on the site already ends in a slash, so
   * there is nothing left for that redirect to do.
   */
  skipTrailingSlashRedirect: true,

  // The Next image optimiser needs a server; static export can't use it.
  images: { unoptimized: true },

  // Exposed so plain <a href> links can prepend the base path (next/link would
  // do this automatically, but this site uses real navigations -- see lib/site.ts).
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
