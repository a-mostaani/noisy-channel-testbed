# Noisy-Channel Booking Testbed: project site

Quarto website. The home page is the interactive system map; each segment gets its own page under `segments/`.

## Preview locally

```bash
# install Quarto from https://quarto.org/docs/get-started/ (or: pip install quarto-cli)
quarto preview
```

## Publish on GitHub Pages (one-time setup)

1. Push this folder to a new public GitHub repo, e.g. `noisy-channel-testbed`.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` now rebuilds and deploys the site to `https://<you>.github.io/noisy-channel-testbed/`.
4. Optional: custom domain under **Settings → Pages → Custom domain**, plus a CNAME record at your DNS provider.

## When a segment ships

1. `assets/map.js`: set the blocks' `st` to `"live"`, add `page:` if they have a page, update `UPDATED`.
2. `segments/<name>.qmd`: fill in the page (copy `booking-api.qmd` as a template for a new segment).
3. `changelog.qmd`: move the row to the top with its release date and a Live pill.
4. `_quarto.yml`: add the new segment to the navbar.

## Layout

```
_quarto.yml            site config and navbar
theme.scss             palette and fonts (shared by every page)
index.qmd              home: embeds the map
assets/map.css         map styles (all classes prefixed tb-)
assets/map.js          map data and behaviour; statuses at the top
segments/booking-api.qmd
changelog.qmd
.github/workflows/publish.yml
```
