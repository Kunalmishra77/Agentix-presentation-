# AI Agentix — Portfolio

A single-page, interactive portfolio of every AI Agentix project and product (49 projects in 11 categories). Each project card opens an in-page demo with tabs for Overview, Walkthrough, How it works, Screens and Tech.

Everything in the demos is fictional sample data. No action in a demo reaches a real system: WhatsApp messages, posts, payments and bookings are simulated in the browser and marked as simulated.

## Run it locally

The site is plain HTML, CSS and JavaScript. It has no build step and no dependencies at runtime.

```sh
npm run serve                 # http://127.0.0.1:4310/
PORT=8090 node tools/serve.js # any other port
```

You can also open `index.html` straight from disk (`file://`). Everything works except the two locally mirrored sites (Santure and Ekatva), which need http.

## Project layout

| Path | What it holds |
|---|---|
| `index.html` | The page. Scripts are classic scripts on the global `window.AX`. |
| `js/core/` | `ax.js` (namespace, `AX.mount`), `router.js` (hash routes), `ui.js` (toasts, drawers, modals). |
| `js/data/` | `projects.js` (all project cards) and `categories.js`. |
| `js/landing/` | Landing page sections and scroll scenes (GSAP, ScrollTrigger, Lenis in `vendor/`). |
| `js/shell/shell.js` | The demo overlay and its five tabs. |
| `js/engines/` | Reusable demo engines: charts, table, board, chat, flow, pipeline, calendar, store, embed, appshell. |
| `js/demos/<slug>.js` | One demo per product: a module manifest rendered by the AppShell. Loaded on demand. |
| `js/demos/data/<slug>.js` | That demo's fictional data. |
| `sites/` | Local mirrors of two prototype sites, plus `_sim.js`, which marks their actions as simulated. |
| `assets/shots/<slug>/` | Card and gallery screenshots: `<name>.jpg` at 1600 px wide, `<name>@800.jpg` thumbnails. |
| `assets/brand/` | The Agentix logo, mark, wordmark and favicon. |
| `css/` | Design tokens, landing, cards, shell, engines and appshell styles. |

Routes:
- `#/` is the landing page.
- `#/demo/<slug>/<tab>` opens a demo. The tab is `overview`, `walkthrough`, `how`, `screens` or `tech`.
- `#/demo/<slug>/walkthrough/<moduleId>` opens one module of a demo.

## Adding or changing a project

1. Add or edit the entry in `js/data/projects.js`.
2. Put at least two screenshots in `assets/shots/<slug>/`. Each file must stay under 600 KB, and the whole folder under 12 MB. `tools/capture.js` captures pages and `tools/shots-to-jpg.py` converts the captures to JPEG.
3. For an interactive demo, add `js/demos/data/<slug>.js` (sets `AX.data[slug]`) and `js/demos/<slug>.js` (sets `AX.demos[slug]`). Use only invented names, numbers and messages.
4. Run the tests.

## Tests

```sh
npm run test:unit               # node:test, no browser
AX_PORT=4541 npm run test:e2e   # Playwright against a local server on AX_PORT
node tools/visual-audit.js      # layout audit: overflow, clipped text, overlaps
npm run frames                  # checks which live sites allow framing
```

The e2e tests need Google Chrome installed (Playwright runs with `channel: "chrome"`) and the `playwright` package. Set `PW` to its path; the default is `E:/travel-agency/node_modules/playwright`. Give each parallel run its own `AX_PORT` so the servers don't collide.

## Live embeds

Some demos frame the client's real public site. Those sites send `Content-Security-Policy: frame-ancestors` that allows only:

- `https://agentix-portfolio.vercel.app`
- `https://ai-agentix.com`
- `https://*.ai-agentix.com`

Login and admin routes on those sites still refuse framing. If the portfolio is hosted anywhere else, the embeds fall back to screenshots. To allow a new host, add it to the client site's `PORTFOLIO_FRAME_ANCESTORS` setting and to `allowedOrigins` in the demo.

## Deploy

The portfolio deploys as a static site to the Vercel project `agentix-portfolio`, which serves it at https://agentix-portfolio.vercel.app.

```sh
vercel deploy --prod
```

`.vercelignore` keeps tests, tools, docs and the knowledge base out of the public deployment.

## Related documents

- `docs/portfolio-plan.md` holds the inventory and the approved decisions.
- `AI_AGENTIX_PROJECT_KNOWLEDGE_BASE.md` is the knowledge base for the voice agent. To regenerate it from `docs/kb/`, run `node docs/kb/build-kb.js`.
- `docs/shots-review.md` has one review line for each screenshot.
