# Astrostatistics Interest Group Homepage

Jekyll site for the ASA Astrostatistics Interest Group.

- **Upstream (production):** <http://astrostat.org/>
- **This fork:** <https://pvl19.github.io/aigamstat.github.io/>

---

## Running the site locally

You need Docker running. Nothing else — no Ruby, no Jekyll, no gems on your machine.

```sh
./serve.sh
```

Then open <http://localhost:4000/aigamstat.github.io/>.

The first run downloads the `ruby:3.1` image and installs the gems (a few
minutes). Gems are cached in a Docker volume called `aigamstat-gems`, so later
runs start in seconds. Edit any `.md` file and Jekyll rebuilds automatically —
refresh the browser to see it.

Use a different port with `PORT=8080 ./serve.sh`.

> **If a style change doesn't show up, hard-refresh** (Cmd-Shift-R). The layout
> links the stylesheet as `style.css?v=<git commit sha>`, so the URL only
> changes when you *commit*. Edit the CSS without committing and your browser
> will happily keep serving its cached copy.

> **Note the URL.** Because `baseurl` is set (see below), the site is served at
> `/aigamstat.github.io/`, *not* at the bare root. <http://localhost:4000/> will
> 404. This is deliberate: it makes local URLs match production exactly, so
> broken paths show up before you deploy.

### Without Docker

If you'd rather run Jekyll natively, you need Ruby 3.x (macOS ships 2.6, which
is too old for the current gems — install a newer one via Homebrew or rbenv):

```sh
bundle install
bundle exec jekyll serve
```

`Gemfile.lock` is intentionally not committed, so it resolves against whatever
Ruby you're using.

---

## How deployment works

There is no build script and no CI workflow. GitHub Pages builds this site
itself: push to `master`, and GitHub runs Jekyll and publishes the result.
Deployment takes a minute or two. Progress and build errors show up under the
repo's **Actions** tab.

To enable it on a fresh fork: **Settings → Pages → Build and deployment**, set
source to *Deploy from a branch*, branch `master`, folder `/ (root)`.

### The `baseurl` setting — read this before renaming anything

GitHub Pages serves a repo at one of two kinds of URL, and which one you get
depends **entirely on the repository's name**:

| Repo name | Served at | `baseurl` needed |
|---|---|---|
| `<username>.github.io` (a *user* page) | `https://<username>.github.io/` | none |
| anything else (a *project* page) | `https://<username>.github.io/<repo>/` | `/<repo>` |

This fork is named `aigamstat.github.io` but lives under the `pvl19` account, so
it is a **project page** — the repo name only coincidentally looks like a user
page. It is served from a subdirectory, which is why `_config.yml` sets:

```yaml
baseurl: /aigamstat.github.io
repository: pvl19/aigamstat.github.io
```

Without `baseurl`, the stylesheet and images resolve to `/assets/...` and
`/images/...` — the account root — and you get an unstyled page with broken
images. `repository` tells the `jekyll-github-metadata` plugin which repo it's
building, which GitHub supplies automatically but a local build cannot infer.

**If you rename or move the repo, update both values to match**, or the
deployed site will break. Renaming it to `pvl19.github.io` would make it a user
page: delete `baseurl` entirely in that case.

### Links in content

Internal links are written relative (`./news.html`, `../jsm2021/index.html`,
`![](./images/foo.jpg)`) and the build rewrites them with `baseurl` applied.
**Don't write root-absolute links** like `/images/foo.jpg` — those skip
`baseurl` and will 404 on a project page. Keep using the `./` and `../` style.

This applies to `assets/css/style.css` too, with an important difference:
Jekyll copies that file verbatim and does **not** rewrite paths inside it. So
`url()` references must be written relative to the stylesheet's own location,
e.g. `url(../../images/AIGpreview.png)` for the header banner. That form
resolves correctly whether or not a `baseurl` is set.

### Custom domains and `CNAME`

The upstream repo has a `CNAME` file containing `astrostat.org`, which binds it
to that domain. This fork **must not** have one: a domain can only be claimed by
a single repository, so a forked `CNAME` makes the fork's Pages deploy fail.
It has been removed here deliberately — don't restore it unless you intend to
point a domain you actually control at this repo.

---

## Making changes

Content lives in Markdown files at the repo root (`index.md`, `news.md`,
`about_us.md`, `join.md`) and in per-year and per-topic directories
(`jsm2026/`, `competition/`, `ASAIP/`, `Library/`).

The site does **not** use the `jekyll-theme-cayman` gem's appearance, despite
`_config.yml` naming it. Both pieces are overridden locally:

- `_layouts/default.html` — the page shell every page renders into
- `assets/css/style.css` — a plain, self-contained stylesheet (not Sass)

Edit those two files to change the look; there is no theme to fight with.

```sh
git add <files>
git commit -m "describe the change"
git push
```

To get to the signup form code on Mailchimp:
Home page → Audience → Signup Forms → Embedded Forms → Classic
