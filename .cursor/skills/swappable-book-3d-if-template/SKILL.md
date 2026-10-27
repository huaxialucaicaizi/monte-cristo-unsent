---
name: swappable-book-3d-if-template
display_name: 可换书3D互动小说模版
description: 可换书3D互动小说模版 — add, edit, or debug a book for this repo's static Three.js first-person interactive-fiction engine (engine in js/engine.js, one book per stories/<slug>/story.js, selected with ?story=<slug>). Use when asked to swap in a new book, add acts/props/interactions/options, or preview a story locally.
---

# 可换书3D互动小说模版

Static, zero-build (no npm, no bundler) Three.js first-person interactive fiction. **One book = one `stories/<slug>/story.js`.** Swapping books means editing data and copy only; the engine stays untouched.

## Engine vs. stories

| Path | Role | Edit when adding a book? |
| --- | --- | --- |
| `index.html` | UI shell; reads `?story=<slug>` (default `monte-cristo`), loads `stories/<slug>/story.js`, then `js/engine.js` | No |
| `js/three.min.js` | Three.js r160, local copy | No |
| `js/engine.js` | Movement, picking, interaction types, act transitions, catalog | No (only for genuinely new mechanics) |
| `stories/<slug>/story.js` | Sets `window.__STORY__ = {…}`: title, acts, props, interactions, catalog | **Yes** |
| `stories/_skeleton/story.js` | One-act placeholder with every field documented in its header comment | Copy it |

Reference books: `stories/monte-cristo/` (five acts, `letter-seal` / `diary` / `wall` / `lock`), `stories/dream-of-red-chamber/` (seven acts, `name` + `toggle`, `room`/`props` as `function(S)`), `stories/pride-and-prejudice/` (two-act minimal).

## Add a new book

1. Copy `stories/_skeleton` to `stories/<slug>` (`<slug>` only letters, digits, `-`, `_`; it must match `[\w-]+`).
2. Edit `stories/<slug>/story.js`: `title`, `start`, each act's `hud` / `fade` / `room` / `props` / `interaction`, and `catalog.template`.
3. To add an act, duplicate an `{id:…}` block in `acts` and give it a unique `id`.
4. Serve and open `http://localhost:8000/?story=<slug>`:

   ```bash
   python3 -m http.server 8000
   ```

   Do not rely on `file://`; the story script is injected dynamically.
5. Add the book's link and act list to `README.md`.

## Field reference

The authoritative, commented field list is the header of `stories/_skeleton/story.js`; the README section 「story.js 必填字段」 summarizes it. Key fields:

| Field | Meaning |
| --- | --- |
| `title` | Book title (start panel and tab title) |
| `acts[]` | Acts, played in order |
| `acts[].id` | Act id; options jump with `next:'<id>'` |
| `acts[].hud` / `fade` | Top-left label / text on the black transition |
| `acts[].room` | `{wall, floor, w, d, spawn:[x,z]}`; may be `function(S){…}` |
| `acts[].props[]` | `box` / `candle` / `text` / `plane` / `cylinder` / `ico` / `spot`; clickable props need an `id` |
| `acts[].interaction` | `type` + `target` (prop id) + `label` + copy + `options` |
| `catalog.template` | Ending catalog; `{choice0}`, `{pain}`, `{ending}`, `{route}`, any `set` key, `{route=x?A:B}` |
| optional | `pageTitle`, `start`, `darkRoute`, `palette`, `ui` |

Interaction types: `letter-seal`, `diary` (`painKey` sets the variable name), `choice` / `map` / `name` / `gazette` (equivalent), `dead-letter` (ends in the catalog).

Option fields: `text`, `record`, `route`, `set`, `ending`, `next`; at most one effect of `toggle`, `wall`, `lock`.

## Rules

- Keep the engine generic: book-specific text belongs in `story.js`, never in `js/engine.js` or `index.html`.
- Every interaction `target` must match a prop `id` in the same act; every `next` must match an act `id` (or `'catalog'`). The engine only `console.warn`s on mismatches, so check the browser console.
- Wall text props sit at `z = -d/2 + 0.12`; table tops are about `y = 0.8`.
- `.nojekyll` must stay so GitHub Pages publishes `_skeleton`.

## Verify

- Load `/?story=<slug>`, click start, and confirm the console has no warnings.
- Walk to each glowing prop (WASD + E, or click) and play through to the catalog.
- For scripted checks, the page exposes `window.__GAME__` = `{state, story, go(actId), hotspots()}`; `go('<act-id>')` jumps to an act and `hotspots()[i].userData.fn()` triggers an interaction.
