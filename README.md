# Hikari Index docs

The user documentation for [Hikari Index](https://github.com/hikari-index/hikari-index):
installing, connecting Shoko, using the gallery, and keeping it running.
Published at https://hikari-index.github.io/hikari-index-docs/.

## Writing

Pages are Markdown under `content/`, one file per page, with a `title`
and a `description` at the top. The sidebar order is `src/lib/nav.js`.
Link to another page by its file, relative to the current one
(`[backups](../run/backups.md)`); the build turns that into the page's
address and fails on a link to a page that does not exist. An image whose
paragraph holds nothing else becomes a figure, with its title as the
caption:

```markdown
![What the picture shows](/shots/jobs.avif "The caption, with the film credit.")
```

House style: plain words, US spelling, say what was tested. Real numbers
over adjectives.

## Running it

Node 22 or newer.

```bash
npm install
npm run dev      # http://localhost:5290, live reload, no search
npm run serve    # builds, then serves build/ at http://localhost:5291 with search
```

`npm run build` writes the static site to `build/`. Set `BASE_PATH` to
serve it below a path (`/hikari-index-docs` on GitHub Pages); leave it
empty for a site with its own domain.

## Screenshots

`static/shots/` holds the screenshots, made by `scripts/shots.mjs` from a
running Hikari Index install that holds **only openly licensed films**
(the Blender Studio open films, CC BY). Never point it at a personal
library: whatever the gallery shows ends up in this public repository.

```bash
HIKARI_DOCS_GALLERY=http://localhost:5283 HIKARI_DOCS_PASSWORD=... npm run shots -- jobs review
```

With no names it retakes every shot. It drives a Chromium-based browser
through `puppeteer-core` (set `BROWSER` to its executable; the default is
Microsoft Edge on Windows) and writes AVIF.

## Publishing

`.github/workflows/pages.yml` builds and deploys to GitHub Pages on every
push to `main`.

## Design

The look is the gallery's: `src/app.css` carries the gallery's tokens
(`gallery/src/app.css` in the tool repository) and the same IBM Plex
files (SIL Open Font License, `src/fonts/LICENSE-IBM-Plex.txt`). Keep the
two in step.
