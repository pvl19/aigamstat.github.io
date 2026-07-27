# Astrostatistics Interest Group Homepage

A React site built with Next.js, deployed to GitHub Pages. Page content is
plain Markdown so it can be edited without touching any React.

**Live site:** <http://astrostat.org/>

---

## Running the site locally

Requires [Node.js](https://nodejs.org) 20 or newer.

```sh
npm install     # first time only
npm run dev
```

Then open **<http://localhost:3000>**.

Edits to anything under `content/` appear immediately — no restart, no rebuild.

> **If `basePath` is set** in [`next.config.mjs`](next.config.mjs), the dev
> server mirrors it so local and published paths match — open
> `http://localhost:3000/<basePath>` instead, and the bare root will 404. See
> *The `basePath` setting* below.

To reproduce exactly what gets published:

```sh
npm run build   # writes the finished site to out/
```

### The dev server is slower than the real site

`next dev` compiles each page the first time you open it, so the first visit to
a page takes roughly half a second and feels sluggish. That is the compiler, not
the site. The published pages are pre-built HTML and load in a few milliseconds,
and `npm run build` is the way to check real performance.

### Local URLs differ from published ones

The export adds `.html` and creates the directory index files, so several URL
shapes exist only *after* a build. Without help the dev server therefore breaks
on links that are perfectly correct in production:

| Written in content | Published | Bare dev server |
|---|---|---|
| `./join.html` | `/join.html` | route is `/join` — **500** |
| `../../jsm2022/index.html` | `/jsm2022/index.html` | created by postbuild — **404** |
| `./images/photo.jpg` on `/about/` | resolves against `/about/` | dev serves `/about`, so it resolves against `/` — **404** |

The last one is the subtlest: with the trailing slash stripped, a browser treats
`about` as a file name and resolves every relative link one level too high. On
the home page that silently breaks the photo.

The `.html` cases fail as a confusing *500* rather than a 404, because the path
falls through to a dynamic route which rejects it as an unknown param.

[`next.config.mjs`](next.config.mjs) fixes all three for development only, via
`skipTrailingSlashRedirect` and two redirects — see the comments there. None of
it is included in the build, so the published site is byte-for-byte unaffected.

One consequence: the address bar drops the `.html` locally. That is expected.

If you add content, prefer relative links (`./join.html`, `../../jsm2022/`) as
the existing pages do; they work in both places.

### Dependencies and `npm audit`

**Never run `npm audit fix --force` on this project.** npm treats any version
outside an advisory's affected range as a "fix", including older ones — asked to
patch a Next.js dependency it will happily install `next@9.3.3`, six major
versions backwards, which breaks the build completely.

When an advisory appears in a package Next depends on, pin the patched version
in the `overrides` block of `package.json` instead. That repoints the transitive
dependency without touching Next itself:

```json
"overrides": {
  "postcss": "^8.5.23",
  "sharp": "^0.35.3"
}
```

Then `rm -rf node_modules package-lock.json && npm install`, and check
`npm audit` reports zero. Run `npm run build` afterwards — an override forces a
version the parent package never tested against, so the build is the proof it
worked.

Worth keeping in perspective: everything here is a **build-time** dependency.
The published site is static HTML, CSS and images on GitHub Pages, with no
server running any of this. The CSS these tools process is the site's own, not
attacker-supplied.

---

## Editing content

Every page is a Markdown file under `content/`, laid out to mirror its URL:

| URL | File |
|---|---|
| `/` | `content/index.md` |
| `/news.html` | `content/news.md` |
| `/contact.html` | `content/contact.md` |
| `/about/charter.html` | `content/about/charter.md` |
| `/about/officers/2021.html` | `content/about/officers/2021.md` |
| `/competition/winners/2022.html` | `content/competition/winners/2022.md` |
| `/jsm2026/` | `content/jsm2026/index.md` |

Ordinary Markdown, plus inline HTML where the original pages used it
(`<p style="text-align: center;">`, `<br>`, `<sup>`). Links between pages are
relative (`./join.html`, `../../jsm2022/index.html`) and images live in
`public/images/`.

Two conveniences carried over from the old site are handled automatically at
build time, so you do not need to write them:

- **Links to other websites** get `target="_blank"` plus a hidden "(opens in a
  new tab)" note for screen readers.
- **Heading anchors** (`#session-401`) are generated from heading text.

### Adding a page

Create the Markdown file, then add a matching route under `app/`. Routes are
three lines — copy `app/join/page.tsx` and change the two constants.

### Session cards

A listing page can render its `###` sections as a grid of cards instead of a run
of headings — the JSM 2026 page does. Mark the heading they sit under, and give
any section that should stand out a style:

```markdown
## Astrostatistics sessions at JSM {: .cards}

### Astrostatistics Interest Group: Student Paper Award {: .featured}
### AIG Business Meeting {: .meeting}
### Contributed Poster Presentations                      <- plain card
```

`{: .x}` is kramdown's inline attribute list, the syntax this content already
used under Jekyll. Anything above the first `###` renders normally and appears
before the grid. Within a card: the `###` is the title, each paragraph is a
detail line (time, room, organisers), and list items are the talks, with any
nested item beneath them treated as the presenter.

Two columns from 640px up, one below. `.featured` spans the full width. A page
without `{: .cards}` is unaffected, so the older JSM pages render as before.
Styling lives in the session-card block of [`app/globals.css`](app/globals.css);
the transform is [`lib/sessionCards.ts`](lib/sessionCards.ts).

### Adding a year

Just add the file. Navigation menus are built by reading `content/`, so:

- `content/about/officers/2027.md` → appears in **Past Officers**
- `content/competition/winners/2027.md` → appears in **Previous Winners**
- `content/jsm2027/index.md` → becomes the current JSM, older years move into
  **Past Years**, and the main "JSM" nav button repoints automatically

The year pages themselves need no route file — `app/[jsmYear]`,
`app/about/officers/[year]` and `app/competition/winners/[year]` generate one
page per file found.

---

## How deployment works

Push to `master` and [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
builds the site and publishes it. Progress and failures appear under the repo's
**Actions** tab. A failed build leaves the currently published site untouched.

This requires **Settings → Pages → Source** to be set to **GitHub Actions**
(not "Deploy from a branch" — that mode only knows how to run Jekyll).

### The `basePath` setting

`basePath` in [`next.config.mjs`](next.config.mjs) is the equivalent of Jekyll's
old `baseurl`, and it has to match how GitHub Pages serves the repository:

| How the repo is served | `basePath` |
|---|---|
| From a custom domain, or as `<account>.github.io` | `''` (empty) |
| As a project page at `<account>.github.io/<repo>/` | `'/<repo>'` |

The production site runs on a custom domain and is served from the root, so it
needs no `basePath`. A copy deployed to `<account>.github.io/<repo>/` — a test
deployment, for example — must set it, or every stylesheet, image and link will
resolve one level too high and the site will come out unstyled.

**This is the only value that needs changing when the site moves.**

### URLs are deliberately preserved

The site keeps the exact URLs it had under Jekyll, including `.html` endings and
directory-style paths, so existing links and bookmarks still work.

Next normally exports the route `/competition` as `competition.html`, but the
canonical URL is `/competition/`. [`scripts/postbuild.mjs`](scripts/postbuild.mjs)
moves those files into place after the build, deriving the list from every
`content/*/index.md`. Nothing to maintain by hand.

Officers and Charter are top-level items in the navigation but keep their
original `/about/...` URLs, so links and bookmarks made before the restructure
still resolve. The nav hierarchy and the URL structure differ there on purpose.

Navigation uses plain `<a href>` rather than `next/link`, so every click is a
real page load at the exact published path. On a site this size the difference
is imperceptible, and it keeps URLs unambiguous.

---

## How the code is organised

```
app/            routes — each is a thin wrapper naming a URL and a content file
components/     SiteHeader, SectionNav, YearDropdown, ContentPage, SiteFooter
lib/            markdown pipeline, navigation model, URL helpers
content/        the Markdown pages
public/         images and PDFs
scripts/        post-build URL fixups
```

Navigation lives only in `components/`:

- **Global row**, every page: Home · Officers · Charter · Student Paper
  Competition · JSM · News · Contact.
- **Join AIG** is not in that row. It is the site's call to action, so it sits
  as a solid button in the header on every page (`SiteHeader`).
- **Section row**, chosen from the page's URL: Competition and JSM each get a
  year menu. It renders at the top of the page content rather than as a third
  bar in the header, so it reads as belonging to the page. Every other section
  is a single page and gets no row.

### Styling

Tailwind CSS. Design tokens are declared in the `@theme` block at the top of
[`app/globals.css`](app/globals.css); the styling for Markdown-generated content
is the plain CSS `.prose` block below it.

The two brand colours are sampled from the AIG mark. **The mark's green
(`#9EC54C`) is only 1.99:1 against white and must never be used for text** — it
is for rules and accents. The `-dark` variants are the text-safe versions.

### Accessibility

The build is checked for: a `lang` attribute, landmark elements, a skip link as
the first focusable element, `aria-current` on the active nav item, alt text on
images, no duplicate ids, and AA colour contrast.

Dropdown menus are native `<details>`/`<summary>` elements, so they are keyboard
operable and exposed correctly to screen readers. A small script adds the one
thing `<details>` does not do by itself — closing when you click away or press
Escape, returning focus to the button. Opening and closing still work with
JavaScript disabled.

One known gap, inherited from the original content: **heading levels skip** on
several JSM pages (`#` followed by `####`). Correcting them means renumbering
headings in the Markdown, which changes how those documents are structured.
