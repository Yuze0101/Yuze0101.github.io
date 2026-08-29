# AGENTS.md

A guide for AI agents working in this repository. Read this before editing.

## Project at a glance

This is a personal portfolio + blog built on the **Astro Keel** template. The repo lives at `https://github.com/Yuze0101/yuze0101.github.io` and deploys to GitHub Pages at the user-site root (`https://Yuze0101.github.io`). Authoring and UI copy are mostly in **Simplified Chinese**.

- Stack: Astro 7 (Content Layer API) · TypeScript (strict) · MDX · Pagefind (search) · Shiki (syntax highlighting, dual light/dark) · satori + sharp (build-time OG images) · mermaid (runtime client islands)
- Locales shipped: `en`, `ja`, `zh-CN` (active). Active locale is selected by `SITE.locale` in `src/consts.ts`.
- No client-side framework; the only runtime JS is opt-in and lazy (theme toggle, copy-code, mermaid, giscus, pagefind UI).
- View Transitions (`<ClientRouter />`) are enabled site-wide; scripts must re-run on `astro:after-swap` or use `data-astro-rerun`.

## Commands

All commands are run from the repo root. Node **22.12+** is required (`.nvmrc` pins `22`). Use `nvm use` (or `fnm`/`mise`).

| Command                | What it does                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`          | Dev server on `http://localhost:4321`                                                                                     |
| `npm run build`        | Build static site to `./dist`, then run `pagefind` over `dist` (via `postbuild`) to build the search index                |
| `npm run preview`      | Preview the production build                                                                                              |
| `npm run check`        | `astro check` — type-check `.astro` + TS. Must report 0 errors (a few pre-existing hints are tolerated; see CONTRIBUTING) |
| `npm run format`       | Prettier write (uses `prettier-plugin-astro`)                                                                             |
| `npm run format:check` | Prettier check (runs first in CI)                                                                                         |

CI (`.github/workflows/ci.yml`) runs in this order on PRs and pushes to `main`: `format:check` → `check` → `build`. Fix format issues with `npm run format` rather than by hand.

There is no test runner. CI's `check` + `build` (with the Pagefind postbuild) is the gate.

## Directory layout

````
src/
  consts.ts            # SINGLE source of truth for site identity, nav, social links, Giscus flag
  content.config.ts    # Content Layer API: `works` and `blog` schemas (Zod)
  content/
    blog/              # Markdown/MDX blog posts
    works/             # Markdown/MDX portfolio entries
  i18n/
    en.ts              # Reference dictionary — also defines the `UIStrings` shape
    ja.ts, zh-CN.ts    # Other shipped dictionaries
    index.ts           # `t()`, `formatDate()`, `readingTime()`, `locale`, dictionary lookup
  layouts/
    BaseLayout.astro   # <head>, header, nav, theme toggle, footer, OG/Twitter meta, JSON-LD slot
  components/
    Pagination.astro, SocialLinks.astro, StructuredData.astro,
    CodeCopy.astro     # Client-side; runs on initial + astro:after-swap
    Comments.astro     # Opt-in Giscus; emits zero bytes when disabled
    MermaidLoader.astro # Dynamic import('mermaid') only when ```mermaid blocks exist
  lib/url.ts           # `withBase(path)` — ALWAYS use for internal links
  pages/
    index.astro, about/index.astro, 404.astro
    works/index.astro, works/[slug].astro
    blog/[...page].astro, blog/[slug].astro, blog/tags/[tag]/[...page].astro
    search.astro       # Static Pagefind UI; needs `npm run build` to be useful
    rss.xml.ts         # API route; uses @astrojs/rss, <language> from active locale
    og/[collection]/[slug].png.ts  # Build-time OG images via satori + sharp
  styles/global.css    # Design tokens (OKLCH), typography, layout primitives, dark theme
astro.config.mjs       # site URL, integrations, Shiki dual themes + remark-reading-time plugin
remark-reading-time.mjs # Markdown plugin: injects `minutesRead` (number) into frontmatter
public/                # favicon, og.jpg (site-wide OG fallback)
.github/workflows/     # ci.yml, deploy.yml, links.yml, release.yml
````

## Critical conventions (the things that bite)

### 1. Internal links go through `withBase()`

`src/lib/url.ts` exists for one reason: the configured `base` (`import.meta.env.BASE_URL`). Every internal href — `/blog/`, `/works/foo/`, asset paths in `<link>` — must be wrapped:

```astro
<a href={withBase(`/blog/${post.id}/`)}>{post.data.title}</a>
```

Hard-coded `/blog/` links break every deployment that sets a `base`. The site-wide OG fallback is `/og.jpg`; per-post OG is generated at `/og/blog/<id>.png` and `/og/works/<id>.png`.

Pagination URLs from `paginate()` already include `base`. `Pagination.astro` only normalises a trailing slash — do not pass them through `withBase()` again.

### 2. Everything user-facing routes through the i18n dictionary

The active locale is `SITE.locale` (currently `'zh-CN'`). Every UI string — nav, pagination, buttons, aria, 404 copy, section labels — comes from `src/i18n/<locale>.ts`. The English file (`src/i18n/en.ts`) defines the **shape** (`UIStrings` type); other locales must satisfy it, so a missing key is a compile error.

```astro
---
import { t, formatDate, readingTime } from '../i18n';
---

<h1>{t('blog.title')}</h1>
<time>{formatDate(post.data.publishDate, 'short')}</time>
<span>{readingTime(remarkPluginFrontmatter.minutesRead)}</span>
```

- `t(key, params)` substitutes `{name}` placeholders.
- `formatDate(date, 'long'|'short')` uses `Intl.DateTimeFormat` with the active locale.
- `readingTime(unknown)` defensively handles a stale Content Layer store (passes through a pre-formatted string instead of printing "3 min read min read").
- Placeholder prose on the home and about pages lives in the `.astro` files, not in the dictionary. That copy is authored by hand per site.

To add a locale: copy `en.ts` → `<tag>.ts`, register in `src/i18n/index.ts` `DICTIONARIES`, set `SITE.locale`. Regional variants (e.g. `en-GB`) fall back to the base language's strings while keeping their own date format.

`NavItem` requires **exactly one** of `label` or `labelKey` — built-in nav entries use `labelKey`, custom pages can use a literal `label`.

### 3. View Transitions are on — DOM scripts must re-run

`<ClientRouter />` is in `BaseLayout.astro`. After a soft navigation the new page's HTML is swapped in and `<html data-theme>` is reset by the inline script in `BaseLayout.astro`. Anything that touches the DOM must either:

- listen on `astro:after-swap` (e.g. `CodeCopy.astro`, `MermaidLoader.astro`), **or**
- be an `<script is:inline data-astro-rerun>…</script>` block (used by `search.astro` and `Comments.astro`).

Also note: `Comments.astro` and `search.astro` use an **IIFE** inside the inline script because top-level `const` would clash on re-run. Config flows in via `data-*` attributes because `define:vars` would strip `data-astro-rerun`.

### 4. Zero-JS-by-default is a design rule (CONTRIBUTING.md)

Opt-in runtime widgets must emit nothing when disabled. `Comments.astro` is the canonical example: the `enabled` flag guards the markup, the `<style>`, and the `<script>` alike. Anything you add should follow the same pattern.

### 5. `src/consts.ts` is the only place to add configuration knobs

Per CONTRIBUTING: a user should be able to rebrand the theme without editing `.astro` files. If you need a new toggle, add it here with a doc comment. Current knobs: `SITE` (locale, title, description, rssDescription, ogImage, author, footerText), `SOCIAL_LINKS`, `GISCUS`, `NAV_ITEMS`. Built-in social icons are `github | x | linkedin | rss | email` (inline SVGs in `SocialLinks.astro`).

### 6. Content collections — schemas are strict

`src/content.config.ts` uses Astro 7's Content Layer API with `glob` loaders. Both collections use the pattern `**/[^_]*.{md,mdx}` — files starting with `_` (e.g. `_draft.md`) are ignored.

**Blog frontmatter** (required unless marked optional):

```yaml
title: string
publishDate: YYYY-MM-DD # z.coerce.date
tags: ['a', 'b'] # defaults to []
description: string
draft: false # true hides the post from build output
heroImage: ./hero.png # optional, relative
```

**Works frontmatter**:

```yaml
title: string
description: string
tech: ['React', 'TypeScript']
link: https://… # optional
repo: https://… # optional
thumbnail: ./cover.png # optional
order: 1 # optional — manual sort key on the works index
publishDate: YYYY-MM-DD
```

Sort conventions observed in templates:

- Blog index/pagination/post page: `publishDate` desc, drafts filtered out.
- Works index: `order` asc (missing → `Number.MAX_SAFE_INTEGER`), then `publishDate` desc.
- Home "latest works": `publishDate` desc, then `order` asc, slice(0, 3).
- Related posts: up to 3, ranked by shared-tag count desc, ties by `publishDate` desc.

### 7. Reading time is computed by a remark plugin

`remark-reading-time.mjs` (wired in `astro.config.mjs`) injects a numeric `minutesRead` into each Markdown entry's frontmatter. Templates read it via `remarkPluginFrontmatter.minutesRead` after `render(entry)`, then run it through `readingTime()` → `t('post.readingTime', { minutes })`. Don't compute reading time yourself; don't ship the raw number.

Note: `remarkPluginFrontmatter` is untyped, and the Content Layer store in `node_modules/.astro/` can persist across upgrades — `readingTime()` handles a stale pre-formatted string by passing it through. After dependency bumps that touch the plugin, deleting `.astro/` regenerates the store.

### 8. Prettier owns formatting

- `npm run format` (writes). `prettier-plugin-astro` handles `.astro`.
- `.prettierrc`: single quotes, 100-col lines.
- `.prettierignore` exempts `dist/`, `node_modules/`, `package-lock.json`, `CHANGELOG.md`, and **`src/components/Comments.astro`** (the plugin can't parse its expression-wrapped `<style>` — keep that file tidy by hand).
- For code blocks that must stay verbatim inside posts, wrap with `<!-- prettier-ignore -->`.
- `src/content/` is formatted too — frontmatter quoting is normalised, prose is not rewrapped (`proseWrap: 'preserve'`).

`.gitattributes` forces `eol=lf` everywhere. On Windows clones with `core.autocrlf=true` files get converted and `npm run format:check` fails locally but never in CI — the `.gitattributes` is the workaround.

### 9. Shiki is wired for light/dark CSS variables

`astro.config.mjs` sets `themes: { light, dark }` and `defaultColor: false`, so fenced code emits `--shiki-light` / `--shiki-dark` and `global.css` swaps them per theme. Don't reintroduce `defaultColor: true` without updating CSS to match.

### 10. OG images have hard limits

`src/pages/og/[collection]/[slug].png.ts` uses satori, which **does not support `oklch()`** and **draws missing glyphs as empty boxes**. The hex colours at the top of the file mirror the light-theme tokens in `global.css`. Fonts are Latin-only Fraunces + Public Sans. Consequences:

- `kind` labels stay Latin (`'Blog'`, `'Work'`); they don't go through the dictionary, because a non-Latin `SITE.locale` would render as tofu.
- Post titles in non-Latin scripts hit the same limit. Install e.g. `@fontsource/noto-sans-jp` and point the two `font(...)` calls at it.
- `SITE.title` appears on every OG image and is therefore Latin in this build — change that to a non-Latin script only after swapping in a font that covers it.

### 11. Search is built, not served by a backend

`/search/` loads `pagefind-ui.js` from `/pagefind/`, generated at build by `npm run build`'s `postbuild` (`pagefind --site dist`). On the dev server the index doesn't exist — `search.astro` shows a `search.fallback` message. The Pagefind Default UI strings ("Search", "Clear") are not translated for every language; check yours if it matters.

### 12. RSS language uses `SITE.locale`

`src/pages/rss.xml.ts` puts `locale` into `<language>` directly. Tag pages, blog index, blog post all emit `<html lang>` and `og:locale` (converted `ja-JP` → `ja_JP`) from the same source.

## Things you may be tempted to do — don't

- **Don't** add a `<style>` block to a component without checking whether it should be `is:inline` (Comments.astro's reason is in the file — a bundled `<style>` would ship on disabled builds).
- **Don't** call `withBase()` on `page.url.prev` / `page.url.next` from `paginate()` — they already include `base`.
- **Don't** hand-tune style across lines; run `npm run format`.
- **Don't** introduce `defaultColor: true` to Shiki without also fixing CSS.
- **Don't** edit `src/styles/global.css` to change "the accent colour" — there is one token (`--color-accent`) plus hover/soft variants derived from it; everything else follows. Hover/soft variants derive from it automatically (per README); if a change seems to need editing many lines, you're probably missing the cascade.
- **Don't** push without `npm run format:check && npm run check && npm run build` passing locally. CI runs them in that order.
- **Don't** commit `dist/`, `node_modules/`, `.astro/`, or `.lycheecache` — they're gitignored.

## Quick workflow for common edits

### Add a blog post

1. Create `src/content/blog/<slug>.md` with the frontmatter in §6.
2. Use ` ```mermaid ` code blocks freely — `MermaidLoader.astro` picks them up automatically (matches `pre[data-language="mermaid"]`, not the older `code.language-…` selector).
3. Run `npm run dev` to preview, then `npm run check && npm run build` before pushing.

### Add a works entry

1. Create `src/content/works/<slug>.md` with the frontmatter in §6.
2. Set `order` to control position on the works index; lower numbers come first, ties broken by `publishDate` desc.

### Add a UI string

1. Add the key + English value to `src/i18n/en.ts`. This defines the type — all dictionaries must include it.
2. Add the translation to every other locale (`ja.ts`, `zh-CN.ts`, etc.). The `UIStrings` type will fail the build until you do.
3. Use `t('your.new.key', params?)` in templates.

### Add a new locale

1. Copy `src/i18n/en.ts` → `src/i18n/<tag>.ts` and translate.
2. Import + register in `src/i18n/index.ts` (`DICTIONARIES`), then set `SITE.locale` in `src/consts.ts`.
3. Pagefind's indexer uses `<html lang>` for segmentation, but the Default UI strings are only translated for some languages — verify your locale's coverage.

### Change nav or social links

Edit `NAV_ITEMS` and `SOCIAL_LINKS` in `src/consts.ts`. New social icons require adding a path to the `ICONS` record in `src/components/SocialLinks.astro` and extending the `SocialIcon` union type.

### Enable Giscus comments

Follow README §Comments. All four IDs (`repo`, `repoId`, `categoryId`) plus `enabled: true` are required — `Comments.astro` also guards on the IDs so a half-filled config emits nothing.

## Deployment

`.github/workflows/deploy.yml` runs on push to `main` and on `workflow_dispatch`. It uses `withastro/action@v6`, reading Node version from `.nvmrc`. The repo's `astro.config.mjs` has `site: 'https://Yuze0101.github.io'` and **no `base`** (user-site root). If you add a `base` path, every internal link via `withBase()` keeps working; the OG image route and RSS links also go through it.

`.github/workflows/links.yml` runs **weekly only** (Monday 06:00 UTC) and never on PRs — dead external links are tracked in a single `link-check` issue. `.lycheeignore` lists placeholder/example hosts.

## Useful references in this repo

- `CONTRIBUTING.md` — design rules, PR conventions, release procedure, Conventional Commits subjects.
- `README.md` — user-facing docs (architecture, customization, Lighthouse targets).
- `.editorconfig` — LF line endings, 2-space indent, UTF-8, final newline.
- `astro.config.mjs` — site URL, MDX/sitemap integrations, Shiki dual themes, remark-reading-time plugin.
