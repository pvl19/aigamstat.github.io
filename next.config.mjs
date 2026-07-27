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

const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const config = {
  // Emits a plain folder of .html files -- no Node server needed at runtime,
  // which is what lets GitHub Pages host it.
  output: 'export',
  basePath,

  // Keep `false` so routes export as `news.html` rather than `news/index.html`.
  // Directory-style URLs (/about/, /jsm2026/) are produced by scripts/postbuild.mjs.
  trailingSlash: false,

  // The Next image optimiser needs a server; static export can't use it.
  images: { unoptimized: true },

  // Exposed so plain <a href> links can prepend the base path (next/link would
  // do this automatically, but this site uses real navigations -- see lib/site.ts).
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

/**
 * Development only. The published site needs none of this, and `output:
 * 'export'` ignores redirects -- so the key is added only under `next dev`,
 * where it also keeps the build free of Next's "will not automatically work
 * with output: export" notice.
 *
 * Why it is needed: with `trailingSlash: false` the export writes the route
 * /join to the file out/join.html, so the published URL ends in .html. The dev
 * server has no such step -- it serves that route at /join and has nothing at
 * /join.html. Every .html link in the navigation is therefore broken locally
 * while being correct once published.
 *
 * Those links fail as 500s rather than 404s, which hides the cause: an
 * unmatched path falls through to a dynamic segment (/join.html to
 * app/[jsmYear], /about/officers/2018.html to app/about/officers/[year]),
 * which then rejects the value as a param missing from generateStaticParams().
 *
 * A redirect rather than a rewrite because a rewrite leaves the request path
 * untouched, so those same dynamic routes still receive "2018.html" as the
 * param and still fail. Redirecting strips the extension before routing.
 *
 * There are no .html files under public/ today. If one is ever added it must be
 * excluded here -- otherwise this redirects it away from itself and it becomes
 * unreachable in development.
 */
if (isDev) {
  /**
   * Stops the dev server redirecting /about/ to /about.
   *
   * The published /about/ is a directory index, so a relative link on it --
   * ./images/photo.jpg, ../../jsm2022/index.html -- resolves against /about/.
   * Strip the trailing slash and the browser treats "about" as a file name and
   * resolves one level too high, so relative images and links break locally
   * while being correct once published. The home page is the visible case: its
   * photo silently 404s.
   */
  config.skipTrailingSlashRedirect = true;

  config.redirects = async () => [
    // Must precede the rule below, or /jsm2022/index.html becomes
    // /jsm2022/index. scripts/postbuild.mjs creates these index files, so
    // content can link to ../../jsm2022/index.html -- correct once published,
    // nonexistent in dev.
    {
      source: '/:path*/index.html',
      destination: '/:path*/',
      permanent: false,
    },
    {
      source: '/:path(.*)\\.html',
      destination: '/:path',
      permanent: false,
    },
  ];
}

export default config;
