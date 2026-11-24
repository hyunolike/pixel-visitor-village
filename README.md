# Pixel Visitor Village

**English** | [한국어](README.ko.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

**Turn today's blog visitor count into a lively little pixel village.**

A web widget for Tistory blogs that creates one pixel character for each visitor counted today. Characters walk and rest around a large tree, with Christmas and four seasonal themes to choose from.

[Explore the village](https://pixel-visitor-village.pages.dev/) | [Install on Tistory](https://pixel-visitor-village.pages.dev/install.html) | [Embed snippet](examples/tistory-snippet.html)

[![Animated preview of a pixel village filling with characters as the visitor count grows](docs/assets/intro-preview.gif)](https://pixel-visitor-village.pages.dev/#intro-film)

**20-second introduction** — The GIF plays in the README. Click it to open the video section of the demo. [Poster](public/media/intro-poster.jpg) | [MP4](public/media/intro.mp4) | [Production and music credits](docs/features/visitor-village/intro-media.md)

*Created with Claude Code's brag skill using the project's village artwork and movement code. The 24 visitors in the video are a demo value. The video is available on the live site and is a fixed render from before the scenery update.*

> The redesigned installation helper supports Korean, English, Japanese, and Simplified Chinese, with a live seasonal preview. The update is live on Cloudflare Pages and has passed public-site checks. The main demo, introduction video, and technical documents remain in Korean. Translated READMEs are linked above.

[Features](#features) | [Seasonal villages](#seasonal-villages) | [Tistory installation](#tistory-installation) | [How it works](#how-it-works) | [Configuration](#widget-configuration) | [Visitor notices](#visitor-notices-and-optional-refresh) | [Development](#local-development) | [Docs](#documentation-and-assets)

## Features

- **One character per visitor** — Accepts 0–5,000 visitors. Characters walk around the tree, avoid its trunk, and take breaks.
- **Five tree themes** — Choose Christmas, spring, summer, autumn, or winter. Switching themes preserves the visitor count and character positions.
- **Embed with HTML** — Uses a `<visitor-village>` Web Component, Shadow DOM for style isolation, and PixiJS for rendering.
- **Motion while visible** — Pauses in hidden tabs and outside the viewport. Respects the system's reduced motion preference and manual pause.
- **Fits into your blog** — A responsive, bounded canvas that lets readers use article links and scroll on mobile.

There are **eight 20×28px character designs**, with distinct outfits and expressions, front/side/back views, four-frame walk cycles, and blinking. The updated characters are available on the live site. See the [enlarged sprite sheet](docs/assets/characters-v2.png) and [village screenshot](docs/assets/village-characters-v2.png).

The seasonal screenshots below are local captures of the updated scenery. The same scenery assets are also available on the live site.

## Seasonal villages

**Christmas** is the default theme, regardless of the date. Use the demo's tree customization panel (나무 꾸미기) to switch themes.

The updated scenery includes tiled roofs, window frames, shop awnings, stone paths, and benches. Flowers, fruit, fallen leaves, and snow distinguish the seasons. Houses and props are sorted in front of or behind characters by foot position. See the [tree and scenery sheet](docs/assets/environment-v2.png) for details.

<table>
  <tr><th>Spring</th><th>Summer</th></tr>
  <tr>
    <td><img src="docs/assets/village-spring.png" alt="Spring village with a pink flowering tree and petals" width="480"></td>
    <td><img src="docs/assets/village-summer.png" alt="Summer village with a large leafy green tree" width="480"></td>
  </tr>
  <tr><th>Autumn</th><th>Winter</th></tr>
  <tr>
    <td><img src="docs/assets/village-autumn.png" alt="Autumn village with orange foliage and fallen leaves" width="480"></td>
    <td><img src="docs/assets/village-winter.png" alt="Snow-covered winter village with a frosted tree" width="480"></td>
  </tr>
</table>

## Tistory installation

1. Open the [installation helper](https://pixel-visitor-village.pages.dev/install.html), enter your blog URL, choose a starting theme, and copy the code.
2. Back up your current skin. In Tistory administration, open **꾸미기 → 스킨 편집 → HTML 편집** (Appearance → Edit skin → Edit HTML).
3. Paste the code where the village should appear and save. Check the visitor count and mobile layout on your actual blog.

The helper generates an embed snippet and a link to your blog's administration page. **The blog owner must paste the code into the skin once.**

For manual installation, use:

```html
<script
  type="module"
  src="https://pixel-visitor-village.pages.dev/widget/visitor-village.js"
></script>

<visitor-village
  count="[##_count_today_##]"
  season="christmas"
  style="display: block; width: 100%; height: 420px;"
></visitor-village>
```

Tistory replaces `[##_count_today_##]` with today's visitor count **inside the skin HTML**. Placing it in an external JavaScript file or a regular blog post is unsupported. If the placeholder remains on the published page, check its location in the skin. If you use Tistory's automatic mobile skin, check whether it needs a separate installation.

Public deployment and loading the widget from another origin have been verified. **Installation in an actual Tistory account's skin still needs verification.** See the [deployment and installation guide (Korean)](docs/features/visitor-village/deployment.md).

## How it works

The widget reads the visitor count supplied when Tistory renders the page. No separate visitor tracking server or database is required.

```mermaid
flowchart TD
    T["Tistory skin HTML<br/>Today's visitor count"] -->|count attribute| W["visitor-village<br/>Validation and lifecycle"]
    V["Cloudflare Pages static hosting<br/>visitor-village.js"] -->|ES module| W
    W --> M["VillageModel<br/>Character count and movement"]
    M --> R["PixiJS renderer<br/>WebGL village"]
    A["Seasonal pixel art<br/>Tree PNG and Canvas artwork"] --> R
    R --> C["Canvas inside Shadow DOM<br/>Bounded area in the blog"]
```

| Responsibility | Technology and source |
| --- | --- |
| Embedding and style isolation | Web Components, Shadow DOM — [visitor-village.ts](src/visitor-village.ts) |
| Input validation and movement | TypeScript — [model.ts](src/model.ts) |
| Rendering | PixiJS 8, WebGL — [renderer.ts](src/renderer.ts) |
| Tree artwork | Christmas PNG and original Canvas pixel art — [art.ts](src/art.ts), [themes.ts](src/themes.ts) |
| Scenery and layout | Shared atlases for ground, houses, and props — [environment.ts](src/environment.ts), [environment-layout.ts](src/environment-layout.ts), [pixel-art.ts](src/pixel-art.ts) |
| Characters and motion | Original RGBA pixel frames and shared atlas — [characters.ts](src/characters.ts), [character-motion.ts](src/character-motion.ts) |
| Installation snippets | URL normalization and code generation in the browser — [install-model.ts](src/install-model.ts) |
| Build and hosting | Vite, Cloudflare Pages — [vite.widget.config.ts](vite.widget.config.ts), [wrangler.jsonc](wrangler.jsonc), [_headers](public/_headers) |

<details>
<summary>Repository layout</summary>

```text
pixel-visitor-village/
├── README.md / README.ko.md / README.ja.md / README.zh-CN.md
├── index.html / install.html   # Demo and installation helper
├── src/                       # Widget, model, renderer, artwork, and helper
├── tests/widget.spec.ts        # Browser integration checks
├── examples/                  # Tistory embed snippet
├── public/embed-example.html  # Standalone embedding example
├── public/_headers / 404.html # Pages headers and missing-page handling
├── wrangler.jsonc             # Pages project and output settings
├── assets/concepts/           # Original tree concepts and generation notes
└── docs/
    ├── assets/                # Screenshots of the actual widget
    └── features/visitor-village/ # Spec, design, tasks, and review records
```

</details>

## Widget configuration

| Attribute | Default | Behavior |
| --- | --- | --- |
| `count` | `0` | Integer from 0 to 5,000; valid comma formatting such as `1,234` is accepted. Invalid or out-of-range input reports an error and preserves the last valid state. |
| `season` | `christmas` | `christmas`, `spring`, `summer`, `autumn`, or `winter`. Invalid input preserves the current season. |
| `paused` | Absent | Its presence pauses animation, including `paused="false"`. Remove the attribute to resume. |
| `glow` | Enabled | Set `glow="false"` to disable the Christmas tree's glow effect. Bulb colors painted into the image remain. |
| `refresh-interval` | `0` | Optional checking interval in seconds: `0` disables it; integers from `60` to `3600` enable it. Invalid values preserve the last valid setting. |

## Visitor notices and optional refresh

A small wooden sign drops into the village to show today's count. An increase shows the difference, such as “Today 13 (+3)” (the widget currently uses Korean labels). Repeated values do not replay the sign, and a new Korean calendar day does not count as an arrival. Clicking anywhere in the village opens the project repository in a new tab; keyboard navigation and mobile scrolling remain available.

Automatic checking is **off by default**. Add `refresh-interval="60"` to the existing tag, or select the one-minute option in the installation helper. Use `refresh-interval="0"` to disable it. The widget reads the current blog origin's home-page HTML while visible. That page must contain at least one widget with a valid count, and all widget counts on that page must agree. It does not execute the fetched page's scripts or load its images. Visible widgets in the same document share one request; failures preserve the last valid village and retry less often.

This checks the daily aggregate periodically, rather than receiving individual arrival events. Tistory's aggregation delay and the effect of repeated HTML requests on its statistics have **not been verified**. Enable checking only with that limitation in mind. The sign, link, and refresh option are available in the published widget. Existing installations may retain the previous module for up to five minutes.


<details>
<summary>JavaScript API and events</summary>

`visitorCount`, `season`, `ready`, and `motionReduced` are read-only. `getVisitors()` returns a copy of the `{ id, x, y }` array.

| Event | `detail` |
| --- | --- |
| `village-ready` | `{ count, season, paused }` |
| `village-change` | `{ count, season, paused }` |
| `village-error` | `{ attribute, message }` |

Events use `bubbles: true` and `composed: true`. The reported `paused` state includes the reduced motion preference. See the [public API contract (Korean)](docs/features/visitor-village/design.md#첫-버전-공개-계약).

</details>

## Local development

Use **Node.js 22.12+**, **pnpm 10**, and **Google Chrome** for browser checks.

```bash
pnpm install
pnpm dev --port 5174
```

Development URL: <http://127.0.0.1:5174/>

```bash
pnpm test       # Unit tests for input, models, and installation snippets
pnpm typecheck  # TypeScript checks
pnpm build     # Typecheck, then build the demo and standalone widget
pnpm test:e2e  # Check the built output in Chrome
pnpm preview   # http://127.0.0.1:4178/
```

The build writes the demo and installation helper to `dist/`, and the standalone ES module to `dist/widget/visitor-village.js`. The module includes PixiJS, internal styles, and the tree image. Open `/embed-example.html` on the preview server to check embedding on a separate page.

Browser tests run installed Chrome in headless mode; mobile checks use emulation. Install Chrome or adjust `channel` in [playwright.config.ts](playwright.config.ts) for another browser setup.

For self-hosting, serve over HTTPS and allow cross-origin loading of the widget module. The `public/_headers` file adds CORS and five-minute cache/revalidation headers to `/widget/*`. Deployment uses Wrangler Direct Upload; automatic deployment from GitHub is not configured. See the [deployment guide (Korean)](docs/features/visitor-village/deployment.md) for configuration and verification records.

## Current scope

- **Visitor count:** Uses today's count supplied when the page opens. Characters do not represent concurrent users or individual identities.
- **Rendering:** Requires WebGL; a Canvas 2D fallback renderer is not implemented.
- **Tree customization:** Supports seasonal themes and Christmas glow control. Christmas decorations are part of a single PNG and cannot be edited individually.
- **Verification:** Public deployment and cross-origin embedding have been checked. Actual Tistory skin installation and testing on physical mobile devices remain.
- **License:** A distribution license for this repository has not yet been selected.

## Documentation and assets

The detailed documents linked here are in Korean.

| Document | Contents |
| --- | --- |
| [Requirements](docs/features/visitor-village/spec.md) | Feature scope and acceptance criteria |
| [Design](docs/features/visitor-village/design.md) | Architecture and public contracts |
| [Implementation plan](docs/features/visitor-village/implementation-plan.md) / [Progress](docs/features/visitor-village/tasks.md) | Work sequence and remaining tasks |
| [Deployment and installation](docs/features/visitor-village/deployment.md) | Cloudflare Pages configuration and installation checks |
| [Independent reviews](docs/features/visitor-village/reviews/) | Code and installation flow review records |
| [Tree concepts and generation notes](assets/concepts/README.md) | AI-generated Christmas tree concepts and prompts |
| [Introduction video credits](docs/features/visitor-village/intro-media.md) | Claude Code brag production, video details, and music license |
| [Screenshot notes](docs/assets/README.md) | Sources and capture conditions for README images |

The production Christmas tree image is [src/assets/christmas-tree.png](src/assets/christmas-tree.png). Other seasonal trees are drawn in `src/art.ts`, scenery in `src/environment.ts`, and updated characters in `src/characters.ts`. No external game assets are used.

## Square frames and Christmas guests

The widget and demo use square corners. In the Christmas theme, an original pixel Santa or Rudolph occasionally appears for 5–8 seconds, then disappears. Only one decorative guest appears at a time; these guests never change the actual visitor count. Their clock pauses offscreen, in hidden tabs, or during manual pause. Reduced motion and other seasons hide them.

Nearby characters occasionally stop, face each other, wave, and exchange a tiny icon balloon before walking again. Up to three pairs interact at once (one on small screens). These are decorative reactions, independent of real visitor identities. Pausing freezes the interaction; reduced motion disables it.

These additions are available in the published widget.

## README references

- [Day.js](https://github.com/iamkun/dayjs#readme): English default with language links at the top.
- [Mermaid](https://github.com/mermaid-js/mermaid#readme): Separate translated READMEs with a route back to English.
- [PixiJS](https://github.com/pixijs/pixijs#readme): Introduction and features followed by setup and usage.
- [dotLottie Web](https://github.com/LottieFiles/dotlottie-web#readme): Prominent demo links, quick start, and links to detailed documentation.

These references informed the document structure. Screenshots and product descriptions come from this project's implementation.
