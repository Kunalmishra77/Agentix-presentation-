# AI Agentix Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A static, single-entry AI Agentix portfolio. It has a showreel-grade interactive landing page covering 49 projects, and every project opens in the same window into a demo: full A-to-Z module simulations with fictional data for products, and live embeds for websites.

**Architecture:**
- Classic `<script>` files share one global namespace, `window.AX`. There is no build step, and the page works from `file://` and from any static host.
- Reusable engines (table, board, chat, flow, pipeline, calendar/tape, store, charts, embed) are composed by a generic **AppShell**. Each product demo is a *module manifest* plus a fictional data file, lazy-loaded when the demo opens.
- The landing page uses GSAP + ScrollTrigger + Lenis.

**Tech Stack:** HTML5, CSS (custom properties), vanilla JS (ES2020, classic scripts), GSAP 3.15 + ScrollTrigger, Lenis 1.3.25 (vendored). Node 22 `node:test` for unit tests. Playwright 1.62 (from `E:/travel-agency/node_modules/playwright`, `channel: "chrome"`) for e2e and screenshot capture.

**Spec:** `docs/portfolio-plan.md` (approved 2026-10-27; §0 holds the review decisions)

## Global Constraints

- No backend, no database, no build step. `index.html` must work from double-click (`file://`) and from static hosting. Use classic scripts only, never `type="module"`.
- Runtime dependencies: only `vendor/gsap.min.js`, `vendor/ScrollTrigger.min.js`, `vendor/lenis.min.js` (copied from `E:/travel-agency/node_modules`). Fonts are self-hosted woff2 in `assets/fonts/`.
- Palette tokens: `--paper:#F6F4EF`, `--ink:#0B1F33`, `--orange:#EE6A24`, `--navy-deep:#071425`. The base theme is light; deep-navy bands only in the "One lead" scene, the Delivery strip and the demo shell chrome. Never all-dark.
- Type: display `Sora` (600/700), body `Inter` (400/500/600), mono `JetBrains Mono` (500).
- Agentix branding everywhere. The logo source is `D:\monum\Downloads\new_agentix_site-v2\new_agentix_site-v2\assets\trs_logo.png`, copied to `assets/brand/agentix-logo.png`. The brain mark is redrawn as inline SVG for the preloader and badges. Every card, demo shell and embed frame shows a **"Built by AGENTiX"** badge.
- Every simulated action calls `AX.ui.toast(text, {kind:"sim"})`. Every demo shell shows the badge text **"Demo data · Simulated"**. Default sim toast copy: **"Simulated — nothing was sent or saved."**
- Fictional data only:
  - people names come from `js/data/fake.js` generators;
  - phones are masked `+91 98xxx x0000`;
  - emails end `@example.in`.
  - Never copy from `.env*`, `hvrs_db.sql`, Woodpecker root CSVs, `.admin-credentials.txt`, or real member/patient/guest records.
  - Real company/client brand names ARE allowed (§0.1). Real hotel/customer names inside Eurobrass seed data are NOT allowed; replace them.
- Status values: `live | active | proto | concept`, labels `Live`, `In development`, `Prototype`, `Concept`.
- Hash routes: `#/` home, `#/demo/<slug>`, `#/demo/<slug>/<tab>`, `#/demo/<slug>/walkthrough/<moduleId>`. Tabs: `overview | walkthrough | how | screens | tech`.
- `prefers-reduced-motion: reduce` disables Lenis, pinning and scrubbing; all content stays visible and static.
- Responsive breakpoints: 390, 768, 1024, 1440. No horizontal page overflow at any of them.
- The landing page's first load must stay under 4 MB (excluding embeds). Demo scripts and data load only when their demo opens.

## Review Focus

1. **Opening from `file://`.** Lazy `AX.load()` script injection and relative embeds must work without a server. Covered by `tests/e2e/file-protocol.test.js` (Task 5).
2. **An embed that is blocked or slow** (X-Frame-Options, offline, a site down). The visitor expects a working preview rather than a blank frame: after 12 s without load, fall back to the screenshot scroller. Covered by `embed.test.js`, "falls back when frame blocked" (Task 7).
3. **A deep link to an unknown slug, tab or module** (a shared link after a rename). Expect a redirect to the nearest valid view, never a crash. Covered by `router.test.js` + `shell.test.js` (Task 5).
4. **Phone width (390 px) inside dense demos** (tape chart, tables, sidebars). Expect the inner container to scroll while the page never scrolls horizontally. Covered by `responsive.test.js` (Task 29).
5. **Returning from a demo to the landing page after pinned ScrollTrigger sections.** Expect the same scroll position, with pins not broken (`ScrollTrigger.refresh()` after restore). Covered by `shell.test.js`, "back restores scroll" (Task 11).

---

## File Structure

```
index.html                         # landing + demo shell mount points; loads core scripts
package.json                       # scripts only (no dependencies)
vendor/gsap.min.js, ScrollTrigger.min.js, lenis.min.js
assets/brand/agentix-logo.png, agentix-mark.svg
assets/fonts/*.woff2
assets/shots/<slug>/<name>.jpg     # captured screenshots (1600w) + <name>@m.jpg (800w)
assets/media/yt/                   # sample keyframes s1–s6.png + one compressed sample.mp4
sites/thames/ sites/santure/ sites/ekatva/   # locally bundled sites (only if framing blocked, Task 3)
css/tokens.css                     # palette, type scale, spacing, radii, shadows
css/landing.css                    # preloader, hero, scenes, index, sections, footer
css/cards.css                      # device/browser/poster cards, badges
css/shell.css                      # demo shell chrome + tabs
css/engines.css                    # all engine styles
css/appshell.css                   # sidebar app layout used inside walkthroughs
js/core/ax.js                      # AX namespace, AX.el(), AX.fmt, AX.load(), AX.state()
js/core/router.js                  # AX.router
js/core/ui.js                      # AX.ui (toast, drawer, modal, badge, agentixBadge)
js/data/fake.js                    # deterministic fictional data generators
js/data/categories.js              # AX.categories
js/data/projects.js                # AX.projects (49 entries)
js/landing/preloader.js, hero.js, onelead.js, index-list.js, sections.js, delivery.js, landing.js
js/shell/shell.js                  # demo shell (tabs, transitions, scroll restore)
js/engines/charts.js, table.js, board.js, chat.js, flow.js, pipeline.js, calendar.js, store.js, embed.js, appshell.js
js/demos/<slug>.js                 # AX.demos[slug] module manifest
js/demos/data/<slug>.js            # AX.data[slug] fictional dataset
tools/serve.js                     # tiny static server (node:http), port 4310
tools/capture.js, tools/capture-list.js   # Playwright screenshots
tools/frame-check.js               # framing headers per URL → tools/frame-report.json
tests/helpers/load.js              # loads classic scripts into a vm context for unit tests
tests/helpers/browser.js           # launches Playwright + serve, collects console/page errors
tests/unit/*.test.js
tests/e2e/*.test.js
```

`package.json` scripts: `"serve": "node tools/serve.js"`, `"test:unit": "node --test tests/unit/"`, `"test:e2e": "node --test --test-concurrency=1 tests/e2e/"`, `"capture": "node tools/capture.js"`, `"frames": "node tools/frame-check.js"`. The `PW` env var overrides the Playwright path (default `E:/travel-agency/node_modules/playwright`).

---

### Task 1: Scaffold, vendor, brand assets, test harness

**Files:**
- Create: `index.html`, `package.json`, `.gitignore`, `vendor/*`, `assets/brand/*`, `assets/fonts/*`, `css/tokens.css`, `js/core/ax.js`, `tools/serve.js`, `tests/helpers/load.js`, `tests/helpers/browser.js`, `tests/unit/ax.test.js`, `tests/e2e/boot.test.js`

**Interfaces:**
- Produces:
  - `window.AX`.
  - `AX.el(tag:string, attrs?:object, ...children:(Node|string)[]) → HTMLElement`. `attrs` supports `class`, `style` (object), `on:{event:fn}`, `data-*`, `html` (innerHTML).
  - `AX.fmt.inr(n:number) → "₹1,19,999"` (Indian grouping), `AX.fmt.num(n) → "12,400"`, `AX.fmt.pct(n) → "12.4%"`, `AX.fmt.date(d:Date|string, style?:"short"|"long") → "27 Oct" | "27 Oct 2026"`, `AX.fmt.time(d) → "5:30 PM"`.
  - `AX.load(src:string) → Promise<void>` (injects a classic `<script>`, resolves on load, caches by src).
  - `AX.state(initial:object) → {get(), set(patch), on(fn) → off}`.
  - `loadScripts(paths:string[]) → globalThis` (test helper; runs files in a `vm` context whose `window === globalThis`, with a minimal `document` stub).
  - `openPage(path:string, {width?, height?, reducedMotion?}) → {page, errors:string[], close()}` (browser helper; serves the repo on port 4310 and collects `console.error`, `pageerror` and failed requests).

- [ ] **Step 1:** `git init`. `.gitignore`: `node_modules/`, `tools/frame-report.json`, `*.log`.
- [ ] **Step 2:** Copy the vendor files from `E:/travel-agency/node_modules/gsap/dist/{gsap.min.js,ScrollTrigger.min.js}` and `E:/travel-agency/node_modules/lenis/dist/lenis.min.js`. Copy the logo. Draw `agentix-mark.svg` (brain outline, stroke paths, `currentColor`) traced from the logo shape. Download the Sora/Inter/JetBrains Mono woff2 latin subsets into `assets/fonts/`.
- [ ] **Step 3: Write failing tests**, `tests/unit/ax.test.js`:
  - `AX.fmt.inr(119999) === "₹1,19,999"`
  - `AX.fmt.inr(2999) === "₹2,999"`
  - `AX.fmt.pct(12.44) === "12.4%"`
  - `AX.state({a:1})`: `set({b:2})` gives `get()` deep-equal `{a:1,b:2}`, and the listener is called once.

  `tests/e2e/boot.test.js`: `openPage("/")` gives `errors.length === 0`, and `typeof window.AX === "object"`.
- [ ] **Step 4:** Run `npm run test:unit`. Expected: FAIL (AX undefined).
- [ ] **Step 5:** Implement `ax.js`, `tokens.css` (all Global Constraints tokens plus `@font-face`), `serve.js` (correct MIME types for .js/.css/.jpg/.png/.svg/.woff2/.mp4/.html), the helpers, and the `index.html` skeleton: `<div id="landing">`, `<div id="shell" hidden>`, `<div id="toasts">`, script tags in dependency order.
- [ ] **Step 6:** Run `npm run test:unit && npm run test:e2e`. Expected: PASS.
- [ ] **Step 7:** Commit `chore: scaffold portfolio, vendor libs, test harness`.

---

### Task 2: Project inventory data

**Files:**
- Create: `js/data/categories.js`, `js/data/projects.js`, `js/data/fake.js`, `tests/unit/projects.test.js`

**Interfaces:**
- Produces:
  - `AX.categories: {id, num:"01", title, statement, layout:"flagship"|"control"|"rail"|"poster"|"pipeline"}[]`.
  - `AX.projects: Project[]`, where `Project = {slug, name, client, category, status, tier:"A"|"B"|"C", year, summary, problem, outcomes:string[], features:{group, items:string[]}[], workflow:{title, desc}[], stack:string[], liveUrl?, embed?:{url, mode:"iframe"|"local"|"scroller"}, shots:{src, caption}[], demo:boolean}`.
  - `AX.fake.person(seed) → {name, phone, email, city}` (deterministic, Indian names, masked phones).
  - `AX.fake.pick(seed, arr)`, `AX.fake.int(seed, min, max)`, `AX.fake.series(seed, n, min, max) → number[]`.

**Categories (exact ids, in order):**
1. `agents` — AI Conversational Agents
2. `content` — Content & Social Automation
3. `crm` — CRM, Sales & Lead Intelligence
4. `health` — Healthcare Systems
5. `hospitality` — Hospitality
6. `fitness` — Fitness
7. `platforms` — Multi-Product Business Platforms
8. `websites` — Business Websites
9. `ecommerce` — E-commerce Experiences
10. `immersive` — Immersive Brand Websites
11. `delivery` — Infrastructure & Delivery

Category layouts:
- `agents`, `content`, `crm`, `platforms`: `flagship`
- `health`, `hospitality`, `fitness`: `control`
- `websites`: `rail`
- `ecommerce`, `immersive`: `poster`
- `delivery`: `pipeline`

**Projects:** one entry for every row in spec §2 (#1–#43, #43a–d, #44 and #45 as `delivery` entries with `demo:false`). That is 49 entries. Slugs:
- **agents, content, crm:** `agentix`, `socialflow`, `voicecrm`, `riya-crm`, `socialpush`, `yt-automation`, `agentix-crm`, `eurobrass-crm`, `leadforge`, `santure-crm`, `ekatva`
- **health, hospitality, fitness, platforms:** `agentix-hims`, `umang-hims`, `umang-website`, `woodpecker-pms`, `max-register`, `max-website`, `fitness-first`, `redux`, `yhc`, `skinwise`, `nri-trust`
- **websites:** `ai-agentix-site`, `dr-shweta-diwan`, `thames-spa`, `eurobrass-site`
- **ecommerce:** `aurelle`, `vara`, `drify`, `fruitivo`, `kanak`, `meridian`, `dewlab`, `melt`, `zipev`, `crumb`
- **immersive:** `movade`, `cairnline`, `saffron`, `aurelune`, `halden`, `irontemple`, `marigold`, `moana`, `coralbay`, `tallow-tape`, `vaskaro`
- **delivery:** `delivery-infra`, `showcase-pipeline`

`summary`, `features`, `workflow` and `stack` copy comes from the spec §2 rows. The `features` groups must list every module named for that project in the spec (the A-to-Z requirement). Concept brands get `status:"concept"` and an `embed.url` of `https://showcase-build-tau.vercel.app/<path>/`; the paths are perfume, drift, moana, travel, aurelle, vara, cairnline, saffron, kanak, halden, zipev, aurelune, dewlab, irontemple, marigold, meridian, melt, plus coralbay, tallow, vaskaro, crumb after Task 4.

- [ ] **Step 1: Write failing tests**, `tests/unit/projects.test.js`:
  - `AX.projects.length === 49`
  - slugs are unique
  - every `category` exists in `AX.categories`
  - every project has non-empty `summary`, `features.length >= 1` and `stack.length >= 1`
  - every `status` is in the allowed set
  - every project with `tier === "A"` has `demo === true`
  - no string anywhere in the data matches `/@(gmail|yahoo|hotmail)\.com|\b[6-9]\d{9}\b|sk-[A-Za-z0-9]{10,}/`
  - `AX.fake.person(7)` deep-equals `AX.fake.person(7)`
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Write the three data files.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit `feat: project inventory and fictional data generators`.

---

### Task 3: Embed feasibility + local site bundles

**Files:**
- Create: `tools/frame-check.js`, `sites/thames/**` (conditional), `sites/santure/**` (conditional), `sites/ekatva/**` (conditional), `sites/_sim.js`
- Modify: `js/data/projects.js` (`embed.mode` per project)

**Interfaces:**
- Produces: `tools/frame-report.json` as `[{url, xfo, frameAncestors, embeddable:boolean}]`, and `sites/_sim.js`, which intercepts every `<form>` submit and every `a[href^="tel:"],a[href^="mailto:"],a[href*="wa.me"]` click and calls `parent.postMessage({ax:"sim", text}, "*")`.
- Consumes: `AX.projects[].embed.url`.

- [ ] **Step 1:** Implement `frame-check.js`. It HEAD/GETs every `embed.url` and `liveUrl` and reads `x-frame-options` and the CSP `frame-ancestors` directive. A URL is `embeddable` when there is no XFO and frame-ancestors is absent or includes `*`.
- [ ] **Step 2:** Run `npm run frames` and inspect the report.
- [ ] **Step 3:** Set each project's `embed.mode` from the report:
  - embeddable → `iframe`
  - not embeddable, with a local source we own → `local`
  - otherwise → `scroller`
  - **Thames:** if not embeddable, copy `D:\monum\Downloads\thameswellnessspa` minus `*.php`, `.user.ini`, `web.config`, `config/`, `class/` into `sites/thames/`, inject `<script src="../_sim.js">` before `</body>` in every `.html`, and set `embed.url` to `sites/thames/index.html`.
  - **Santure / Ekatva:** if the claude.ai artifact is not embeddable, fetch the published files with the Artifact tool (`action:"read"`, `paths` from `scope:"files"`) into `sites/santure/` and `sites/ekatva/`.
- [ ] **Step 4:** Verify with `node tools/serve.js`, then open `/sites/thames/index.html`. Expected: the page renders, and submitting its contact form posts the sim message (check `window.addEventListener("message")` in the console).
- [ ] **Step 5:** Commit `feat: embed feasibility report and local site bundles`.

---

### Task 4: Publish the four unpublished showcase sites (outward-facing; needs your OK at Step 4)

**Files:**
- Modify (outside repo): `E:\showcase-build\{coralbay,tallow,vaskaro,crumb}\`, `E:\showcase-build\index.html`
- Modify: `js/data/projects.js` (embed URLs for `coralbay`, `tallow-tape`, `vaskaro`, `crumb`)

- [ ] **Step 1:** For each pair, run `E:\showcase-tools\add-kit-site.ps1 -Src <src> -Slug <slug>`:
  - `E:\triozen\day-14-coral-bay → coralbay`
  - `day-22-tallow-tape → tallow`
  - `day-23-vaskaro → vaskaro`
  - `day-8-Crumb → crumb`

  Expected: `out/index.html` is produced and copied. Any build failure is fixed in the source site before continuing.
- [ ] **Step 2:** Add the landing cards with `python E:\showcase-tools\add-card.py` for each (same args the tool's usage line documents).
- [ ] **Step 3:** Local check. Serve `E:\showcase-build` and run `node E:\showcase-tools\check-site.js http://localhost:<port>/<slug>/` for each of the 4. Expected: `NO ERRORS`, height > 2000.
- [ ] **Step 4:** **Stop and ask the user to confirm the deploy.** On yes, run `E:\showcase-tools\deploy.sh`. Then run `check-site.js https://showcase-build-tau.vercel.app/<slug>/` for all 21 paths. Expected: `NO ERRORS` for each.
- [ ] **Step 5:** Commit `feat: add Coral Bay, Tallow & Tape, Vaskaro, Crumb embeds`.

---

### Task 5: Core router, UI kit, demo shell

**Files:**
- Create: `js/core/router.js`, `js/core/ui.js`, `js/shell/shell.js`, `css/shell.css`, `tests/unit/router.test.js`, `tests/e2e/shell.test.js`, `tests/e2e/file-protocol.test.js`

**Interfaces:**
- Consumes: `AX.projects`, `AX.load`.
- Produces:
  - `AX.router.parse(hash:string) → {view:"home"} | {view:"demo", slug, tab, module|null}`. An unknown tab maps to `"overview"`.
  - `AX.router.go(path:string)` (sets `location.hash`).
  - `AX.router.start(onRoute:(route)=>void)`.
  - `AX.ui.toast(text, {kind:"sim"|"ok"|"err"} = {kind:"ok"})`.
  - `AX.ui.drawer({title, body:Node, actions?:{label, onClick, primary?}[]}) → {close()}`.
  - `AX.ui.modal({title, body, actions}) → {close()}`.
  - `AX.ui.statusChip(status) → HTMLElement`.
  - `AX.ui.agentixBadge({size:"sm"|"md"}) → HTMLElement` (mark + "Built by AGENTiX").
  - `AX.shell.open(slug, tab, module)`, `AX.shell.close()`.
  - `AX.demos[slug] = {brand:{name, accent, logoText?}, modules:Module[], start?:moduleId}`, loaded lazily from `js/demos/data/<slug>.js` then `js/demos/<slug>.js`.

**Shell layout:**
- Deep-navy top bar: Agentix logo, project name, category, status chip, the **"Demo data · Simulated"** pill, and "← All projects".
- Tabs: Overview · Walkthrough · How it works · Screens · Tech.
- **Overview** renders `summary`, `problem`, `outcomes`, and *all* `features` groups as an A–Z capability grid.
- **How it works** renders `workflow` as a numbered connected diagram.
- **Screens** renders `shots` as a lightbox gallery.
- **Tech** renders `stack` chips.
- **Walkthrough** renders `AX.appShell` when `demo:true`, else `AX.embed` (Tasks 7–8 own those).
- Esc and browser Back close the shell. Opening animates from the clicked card's rect (FLIP).

- [ ] **Step 1: Write failing tests.** In `router.test.js`:
  - `parse("#/")` gives `{view:"home"}`
  - `parse("#/demo/agentix")` gives tab `"overview"`
  - `parse("#/demo/agentix/walkthrough/flows")` gives module `"flows"`
  - `parse("#/demo/agentix/bogus")` gives tab `"overview"`
  - `parse("")` gives home

  In `shell.test.js`:
  - opening `#/demo/does-not-exist` lands on `#/`, with no page errors
  - opening `#/demo/agentix/tech` shows the stack chips
  - pressing Esc returns to `#/`
  - `.shell .agentix-badge` and the text "Demo data · Simulated" are visible

  In `file-protocol.test.js`, load `file:///<repo>/index.html#/demo/agentix`: the shell renders and `AX.demos.agentix` is defined (the lazy load works on file://).
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run. Expected: PASS. (For `agentix`, use a stub demo file until Task 12.)
- [ ] **Step 5:** Commit `feat: router, UI kit and demo shell`.

---

### Task 6: Engines — charts, table, board

**Files:**
- Create: `js/engines/charts.js`, `js/engines/table.js`, `js/engines/board.js`, `css/engines.css`, `tests/unit/table.test.js`, `tests/unit/board.test.js`, `tests/e2e/engines-a.test.js`

**Interfaces:**
- Produces:
  - `AX.charts.line(el, {labels:string[], series:{name, points:number[]}[]})`, `.bar(el, {labels, values, horizontal?})`, `.donut(el, {parts:{label, value}[]})`, `.funnel(el, {steps:{label, value}[]})`, `.gauge(el, {value:0-100, label})`, `.spark(el, points)`, `.kpis(el, {items:{label, value, delta?:number, format?:"inr"|"num"|"pct"}[]})`. All are SVG; they animate in unless reduced motion is on.
  - `AX.table.query(rows, {q?, qKeys?, filters?:{[key]:value}, sort?:{key, dir:"asc"|"desc"}}) → rows` (pure).
  - `AX.table.create(el, {columns:{key, label, render?(row)→Node|string, sortable?}[], rows, qKeys?, filters?:{key, label, options:string[]}[], onRow?(row), actions?:{label, onClick(row)}[], pageSize?=12}) → {setRows(rows), refresh()}`. Below 768 px, rows render as cards.
  - `AX.board.moveCard(cards, id, toCol) → cards` (pure, immutable).
  - `AX.board.create(el, {columns:{id, label, tone?}[], cards:{id, col, title, sub?, tags?:string[], meta?}[], onMove?(card, toCol), onOpen?(card), renderCard?(card)→Node}) → {move(id, col), setCards(cards)}`. Drag uses Pointer Events and works with touch.

- [ ] **Step 1: Write failing tests.** In `table.test.js`:
  - `query(rows, {q:"pri", qKeys:["name"]})` returns only "Priya …" rows
  - `filters:{status:"Hot"}` filters exactly
  - `sort:{key:"value", dir:"desc"}` orders descending

  In `board.test.js`: `moveCard` returns a new array with the card's `col` changed and the original array untouched.

  In `engines-a.test.js` (on a test page `tests/fixtures/engines.html`):
  - typing in the table search reduces the row count
  - dragging a board card from column 1 to column 2 (`page.mouse`) calls `onMove`
  - `.kpis` renders 4 tiles
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit `feat: charts, table and board engines`.

---

### Task 7: Engines — chat, flow, pipeline, calendar/tape, store, embed

**Files:**
- Create: `js/engines/{chat,flow,pipeline,calendar,store,embed}.js`, `tests/unit/{pipeline,calendar,store}.test.js`, `tests/e2e/{engines-b,embed}.test.js`

**Interfaces:**
- Produces:
  - `AX.chat.create(el, {threads:{id, name, channel:"whatsapp"|"instagram"|"web"|"voice"|"telegram", preview?, messages:{from:"user"|"ai"|"agent"|"system", text, at?}[]}[], scripts?:{[threadId]:{from, text, delay?:ms, event?:string, chips?:string[]}[]}, side?(thread)→Node, onEvent?(event, thread), composer?:boolean=true}) → {open(threadId), play(threadId) → Promise, push(threadId, msg)}`.
    - Includes a typing indicator and channel-themed bubbles (WhatsApp green, IG gradient).
    - A message the user sends through the composer gets the next scripted AI reply, or a generic "AI reply (simulated)" when no script remains.
  - `AX.flow.create(el, {nodes:{id, kind:"trigger"|"condition"|"ai"|"action"|"delay"|"end", label, detail?, x, y}[], edges:[from, to, label?][]}) → {run(startId?) → Promise}`.
    - SVG edges; nodes are draggable.
    - `run` lights each node in edge order, with a 600 ms step and an execution log panel.
  - `AX.pipeline.reduce(state, event) → state` (pure). `state = {stages:{id, status:"waiting"|"running"|"done"|"blocked"}[], cost, cap, log:string[]}`. Events:
    - `{type:"tick"}` advances the running stage, else starts the next waiting one;
    - `{type:"gate", stageId}` marks that stage `blocked` until `{type:"approve"}`;
    - `{type:"cost", amount}` adds cost. If `cost > cap`, the running stage goes to `blocked` and the log gets `"Cost ceiling reached"`.
  - `AX.pipeline.create(el, {stages:{id, label, ms, cost?, log?:string[]}[], gate?:stageId, cap?:number, currency?:"$"|"₹"}) → {start(), approve(), reset()}`.
  - `AX.calendar.overlaps(bookings, {unit, start:"YYYY-MM-DD", nights}) → boolean` (pure).
  - `AX.calendar.month(el, {month:"YYYY-MM", events:{id, date, title, tone?}[], onDrop?(id, date), onOpen?(e)})`.
  - `AX.calendar.tape(el, {start:"YYYY-MM-DD", days:14, units:{id, label, group}[], bookings:{id, unit, start, nights, guest, status:"confirmed"|"checked-in"|"hold"|"checked-out"}[], onChange?(b), onOpen?(b)})`.
    - Dragging a booking's right edge extends `nights`; dragging the body moves it.
    - Both moves are rejected with an `err` toast when `overlaps` is true.
  - `AX.store.cartTotals(cart:{id, qty}[], products:{id, price}[], {gstRate?=0.18, shipping?=0, freeOver?, coupon?:{code, pct}}) → {subtotal, discount, gst, shipping, total}` (pure, rounded to whole rupees).
  - `AX.store.create(el, {products:{id, name, price, mrp?, img?, cat, tags?, variants?}[], categories:string[], currency:"₹", checkout:"mock"}) → {cart()}`.
    - Includes a grid, filters, product drawer, cart drawer, and a mock checkout that ends with an order-confirmed screen and a sim toast.
  - `AX.embed.create(el, {url, mode:"iframe"|"local"|"scroller", shots:{src}[], title}) → {setDevice("desktop"|"mobile")}`.
    - A browser-frame toolbar shows the Agentix badge, the URL text, a desktop/mobile toggle and a reload button.
    - On `iframe`/`local`, if there is no `load` within 12 000 ms, it switches to the scroller.
    - The scroller is the full-page screenshot inside the frame, scrolled with wheel/drag.
    - It listens for `message` events with `{ax:"sim"}` and calls `AX.ui.toast(text, {kind:"sim"})`.

- [ ] **Step 1: Write failing tests.** In `pipeline.test.js`:
  - three ticks on a 3-stage state give stage 1 `done` and stage 2 `running`
  - a gate on stage 2 leaves it `blocked` after it starts, and `approve` unblocks it
  - `cost` past `cap` gives `blocked` and the log includes `"Cost ceiling reached"`

  In `calendar.test.js`: `overlaps([{unit:"101", start:"2026-11-01", nights:3}], {unit:"101", start:"2026-11-03", nights:1})` is true; with `start:"2026-11-04"` it is false; a different unit is false.

  In `store.test.js`: `cartTotals([{id:"a", qty:2}], [{id:"a", price:1000}], {gstRate:0.18})` gives `{subtotal:2000, discount:0, gst:360, shipping:0, total:2360}`; with `coupon:{pct:10}`, discount is 200, gst is 324 and total is 2124.

  In `embed.test.js`:
  - an iframe to `about:blank` loads
  - an iframe to a URL whose server returns `X-Frame-Options: DENY` (the serve.js route `/__deny`) shows the scroller within 13 s (**Review Focus 2**)
  - a posted `{ax:"sim"}` message produces a toast

  In `engines-b.test.js`:
  - `chat.play` renders all scripted messages in order and fires `onEvent("booked")`
  - `flow.run` marks all nodes visited
  - dragging a tape booking onto an occupied range shows an error toast and keeps its position
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement, and add the `/__deny` route to `serve.js`.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit `feat: chat, flow, pipeline, calendar, store and embed engines`.

---

### Task 8: AppShell (module manifest renderer)

**Files:**
- Create: `js/engines/appshell.js`, `css/appshell.css`, `tests/e2e/appshell.test.js`, `tests/fixtures/appshell.html` (mounts `AX.appShell` directly with a 3-module fixture and its own `#/m/<id>` hash handling, so the test does not depend on `AX.projects`)

**Interfaces:**
- Consumes: all engines from Tasks 6–7.
- Produces:
  - `AX.appShell.create(el, {brand:{name, accent, logoText?}, modules:Module[], start?, slug, lang?:{options:["en","hi"]}}) → {open(moduleId), ctx}`.
  - `Module = {id, label, icon, group?, role?, view:View}`.
  - `View` is one of:
    - `{type:"dashboard", kpis, charts:{type, title, ...chartOpts}[]}`
    - `{type:"table", ...tableOpts, drawer?(row, ctx)→Node}`
    - `{type:"board", ...boardOpts}`
    - `{type:"chat", ...chatOpts}`
    - `{type:"flow", ...}`
    - `{type:"pipeline", ...}`
    - `{type:"calendar", ...}`
    - `{type:"tape", ...}`
    - `{type:"store", ...}`
    - `{type:"form", fields:{key, label, type:"text"|"select"|"date"|"number"|"textarea"|"toggle", options?}[], submit, onSubmit(values, ctx)→Node|void}`
    - `{type:"custom", render(el, ctx)}`
  - Any opts value may be a function `(ctx) → value`, evaluated on each open.
  - `ctx = {slug, data:AX.data[slug], state:AX.state(...) shared across modules, toast, open(id), lang, t(en, hi)}`.

**Layout:**
- Left sidebar grouped by `group`, plus a role switcher when modules have `role`. Below 768 px it collapses to a bottom sheet menu.
- Top header with a module title and a search box that filters modules.
- Deep links: `#/demo/<slug>/walkthrough/<id>`. An unknown id falls back to `start` (**Review Focus 3**).
- Each mounted module root gets `data-module-ready` after it renders.
- Cross-module state: events emitted from one module (e.g. a chat `booked` event) update `ctx.state`, and a module re-renders from state when opened.

- [ ] **Step 1: Write failing test.** `appshell.test.js` with a fixture demo of 3 modules (dashboard, table, custom):
  - clicking each sidebar item gives `[data-module-ready]` with non-empty text
  - the URL hash updates
  - `appShell.open("nope")` opens the start module
  - at 390 px width the sidebar is hidden and the menu button opens it
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit `feat: AppShell module manifest renderer`.

---

### Task 9: Landing — preloader, nav, hero

**Files:**
- Create: `js/landing/preloader.js`, `js/landing/hero.js`, `js/landing/landing.js`, `css/landing.css`, `tests/e2e/landing-hero.test.js`

**Interfaces:**
- Consumes: `AX.projects`, `AX.categories`, GSAP, ScrollTrigger, Lenis.
- Produces: `AX.landing.init()`, `AX.landing.lenis` (null under reduced motion), and `AX.landing.scrollTo(target)`.

**Preloader:** the brain-mark SVG strokes draw over 1.2 s, the AGENTIX letters stagger in, and the counter counts 0 → `AX.projects.length`. It exits by wiping up. Session-skip: it is shown once per session (`sessionStorage`, guarded in try/catch).

**Nav:** the logo, the category menu (opens the index), a search field that filters cards live by name/client/stack, a status filter (All / Live / In development / Prototype / Concept), and a "Start a project" CTA. The nav goes transparent to blurred paper on scroll.

**Hero (paper background):**
- Headline "AI Applied, Growth Multiplied." uses split-line reveal.
- Subline: "49 products, platforms and websites — built by AI Agentix. Open any of them and try it."
- A 3D-perspective fan of 7 product screenshot cards (agentix, woodpecker-pms, agentix-hims, max-register, socialflow, aurelle, yt-automation) tilts toward the cursor (max 8°). On scroll the hero pins for 120 vh while the fan spreads into a grid and fades.
- CTAs: "Explore the work" (scrolls to the index) and "Watch an agent close a lead" (opens `#/demo/agentix/walkthrough/conversations`).
- A custom cursor dot scales up with the label "Open demo" over any `[data-demo]` element (it is disabled on touch).

- [ ] **Step 1: Write failing tests.**
  - The preloader finishes and `#hero h1` contains "AI Applied" with no errors.
  - With `reducedMotion:"reduce"`, no element has `transform` set by pinning, and the hero grid is visible.
  - Clicking "Watch an agent close a lead" gives a URL hash of `#/demo/agentix/walkthrough/conversations`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit `feat: landing preloader, nav and hero`.

---

### Task 10: Landing — "One lead, every system" scene + category index

**Files:**
- Create: `js/landing/onelead.js`, `js/landing/index-list.js`, `tests/e2e/landing-scenes.test.js`

**"One lead" (deep-navy band, pinned ~400 vh, scrubbed):** six beats, each a mini recreated UI (HTML, fake data) with a caption:
1. A WhatsApp message "Hi, saw your ad — price for the full-body checkup?" (AGENTiX)
2. The AI replies and books, and the lead chip goes Lead → Hot → Booked (AGENTiX CRM)
3. The patient is registered and joins the OPD queue (Umang HIMS)
4. The bill is generated with GST (Woodpecker-style folio styled as hospital billing)
5. A follow-up reel is scheduled to Instagram, YouTube and Facebook (SocialPush)
6. Revenue ticks up on the dashboard (Agentix CRM)

Beat captions name the product and link with `[data-demo]` to its demo. Under reduced motion, the six beats render as a vertical static list.

**Index:** an editorial list `01`–`11` with category title, project count and status mix. Hovering a row floats up to 3 thumbnails of that category following the cursor (pointer devices only). Clicking scrolls to the section.

- [ ] **Step 1: Write failing tests.**
  - Scrolling through the scene makes all 6 beat captions reach `opacity>0.9` at some point, with no errors.
  - Reduced motion shows 6 visible beats without scrolling.
  - The index has 11 rows, and clicking row 05 scrolls `#cat-hospitality` into the viewport.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit `feat: one-lead story scene and category index`.

---

### Task 11: Landing — category sections, cards, delivery strip, footer

**Files:**
- Create: `js/landing/sections.js`, `js/landing/delivery.js`, `css/cards.css`, `tests/e2e/landing-sections.test.js`

**Interfaces:**
- Consumes: `AX.categories[].layout`, `AX.projects`, `AX.router.go`.
- Produces: `AX.cards.render(project, variant:"device"|"browser"|"poster"|"control") → HTMLElement` (with `[data-demo=slug]`).

**Section layouts:**
- **flagship:** sticky left column with the category number, title, statement and project list. The right column holds device-frame cards that rise with 3D settle.
- **control:** split "control room": a big card left, with a live-ticking KPI chip strip (fake numbers, `setInterval` 2.5 s, paused offscreen).
- **rail:** a pinned horizontal rail of browser-frame cards. Their screenshots auto-scroll on hover/in-view.
- **poster:** a masonry wall of tall posters. Hover crossfades 3 screenshots.
- **pipeline:** the delivery strip, an animated SVG path for code → build → Docker/Coolify · Vercel · cPanel/Apache · Supabase → live, with stack logos as text chips.

**Every card:**
- screenshot (`loading="lazy"`, `srcset` 800w/1600w) under a bottom gradient scrim
- a solid text band with name, client, a 1-line summary, a status chip and 3 feature tags
- the Agentix badge
- the "Open demo →" affordance

If an image fails to load, the card shows a gradient fallback in the project accent.

Clicking a card does FLIP into the shell. Closing restores the scroll position via `AX.landing.scrollTo`, then calls `ScrollTrigger.refresh()` (**Review Focus 5**).

**Footer:** animated counters (projects, categories, live in production = count of `status==="live"`), the "Start a project" CTA (to `https://ai-agentix.com/contact`, new tab), the logo and the tagline.

- [ ] **Step 1: Write failing tests.**
  - `[data-demo]` card count equals the number of projects with category ≠ `delivery`.
  - Every card has `.agentix-badge`.
  - The search "hims" leaves exactly the `agentix-hims` and `umang-hims` cards visible; the "Concept" status filter shows only concept cards.
  - Opening a card from the middle of the page and pressing Esc gives a `scrollY` within ±40 px of the original, and the next section's pin still works (**Review Focus 5**).
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit `feat: category sections, project cards and delivery strip`.

---

### Demo tasks (12–27): shared steps

Each demo task creates `js/demos/data/<slug>.js` (all records generated with `AX.fake`, seeded) and `js/demos/<slug>.js` (the module manifest), and adds one block to `tests/e2e/demos.test.js`. Every demo task follows these steps:

- [ ] **Step 1: Write the failing test block.**
  - Open `#/demo/<slug>/walkthrough`, iterate every sidebar module, and assert `[data-module-ready]` has text length > 40 with zero page errors.
  - Then run the task's listed **key interactions** as assertions.
- [ ] **Step 2:** Run `node --test tests/e2e/demos.test.js --test-name-pattern=<slug>`. Expected: FAIL.
- [ ] **Step 3:** Write the data and manifest. Module ids and view types follow the task table exactly. Copy and labels mirror the real product's vocabulary from the spec.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit `feat(demo): <slug>`.

### Task 12: Demo — AGENTiX (`agentix`)
Brand: `AGENTiX`, accent `#EE6A24`. Groups and modules (`id: view`):

- **Workspace:**
  - `dashboard: dashboard`: conversations, leads, bookings, AI-handled %, response time, plus a line chart of 30 days.
  - `conversations: chat`: 8 WhatsApp/IG threads; thread "Ritika S." script ends with event `booked`. The side panel shows the contact, lead temperature and the booking.
  - `crm: board`: columns New · Warm · Hot · Booked · Won · Lost. The `booked` event moves Ritika's card to Booked.
  - `contacts: table`
  - `leads: table`: source filter Meta Lead Ads / Google Ads / WhatsApp / Instagram / Website.
- **Engage:**
  - `campaigns: custom`: 3-step wizard (audience segment → template → schedule), then a delivery stats chart (sent, delivered, read, replied) and a sim toast.
  - `templates: table` with a drawer showing a WhatsApp bubble preview and the approval status.
  - `flows: flow`: "Ad click → AI qualify → [hot?] → book slot / nurture 3-day → handoff".
  - `segments: custom`: a rule builder of chips, with a live count.
  - `winback: form`
  - `referrals: table`
- **Operate:**
  - `bookings: calendar`
  - `tasks: board`
  - `team: table`
  - `knowledge: custom`: a docs list plus an "Ask the agent" sandbox using chat.
- **Grow:**
  - `ai-revenue: dashboard`
  - `copilot: custom`: 6 suggestion cards, each with Apply that fires a sim toast.
  - `google-ads: dashboard`
  - `gbp: custom`: profile card plus reviews, with "Draft AI reply".
  - `local-rank: custom`: a 7×7 rank heatmap grid.
  - `roi: dashboard` with a funnel by channel.
  - `analytics: dashboard`
- **Account:** `billing: custom` (₹2,999/mo plan card, usage meters, invoices table).
- **Admin console** (`role: "Super admin"`):
  - `admin-clients: table`
  - `bot-health: dashboard`
  - `ai-tokens: dashboard`
  - `meta-spend: table`
  - `support: table`

**Key interactions:**
1. Play Ritika's thread, then open crm: her card is in "Booked".
2. `flows`: Run, and all nodes are visited.
3. Campaign wizard to the end: the stats chart renders and the sim toast appears.

### Task 13: Demo — SocialFlow (`socialflow`)
Groups and modules:

- **Inbox:**
  - `inbox: chat`: IG/FB/Telegram threads; the AI reply cites a knowledge-base doc chip.
  - `comment-dm: custom`: a mock IG post; typing comment "PRICE" fires a public reply plus a DM. For a non-follower the DM is a follow-gate message ("Follow us to unlock the price"); toggling "follows" gives the full answer.
- **Automate:**
  - `rules: table`
  - `sequences: pipeline`
  - `flows: flow`
  - `health: dashboard`
- **Business:**
  - `contacts: table`
  - `leads: board`
  - `bookings: calendar`
  - `campaigns: table`
  - `products: store`
  - `orders: table`
  - `influencers: table`
  - `ads: dashboard`
- **Content:**
  - `studio: form`: topic and tone, producing 3 AI caption variants.
  - `calendar: calendar`
  - `approvals: board`: Draft · In review · Approved · Scheduled.
  - `design: custom`: a 1080×1080 canvas with draggable text/sticker layers and colour swatches.
  - `reels: custom`: a timeline of clips with caption track.
- **Growth:**
  - `profile-score: custom`: an animated gauge plus 8 sub-scores.
  - `post-audit: table`: posts ranked by engagement rate.
  - `analytics: dashboard`
  - `knowledge: custom`
- **Settings:**
  - `team: table`
  - `channels: custom`: connect toggles.

**Key interactions:**
1. Comment "PRICE" as a non-follower: the follow-gate DM appears. Toggle "follows": the price DM appears.
2. The Profile Score gauge shows a number.

### Task 14: Demo — VoiceCRM (`voicecrm`)
Modules:
- `dashboard`
- `live-calls: custom`: 3 live call cards streaming transcript lines every 1.2 s, with sentiment chips updating.
- `calls: table` with a drawer: transcript, AI summary, sentiment, Hot/Warm/Cold score, concern, outcome.
- `insights: dashboard`
- `leads: table` with a drawer: pipeline stepper, activity, and a WhatsApp panel where Send fires a sim toast.
- `tasks: board`
- `reports: dashboard`
- `exports: custom`: "Export CSV" downloads a real CSV Blob of the fictional rows.
- `employees: table`

**Key interactions:** the live call transcript grows; Export produces a download event.

### Task 15: Demo — SocialPush (`socialpush`)
Modules:
- `overview: dashboard`
- `accounts: custom`: 7 platform connect cards (YouTube, Instagram, Facebook, Threads, LinkedIn, Pinterest, X) with a fake OAuth modal and a sim toast.
- `composer: custom`:
  - text field, media picker from 4 sample images, platform toggles
  - live per-platform previews (crop ratio per platform: IG 4:5, YT Shorts 9:16, X 16:9)
  - AI caption button
  - Publish now / Schedule
- `posts: table`: status Queued/Publishing/Published/Failed→Retried.
- `calendar: calendar` with drag to reschedule.
- `analytics: dashboard`
- `comments: chat`: unified comments.
- `assistant: chat`
- `team: table`

**Key interactions:** compose, toggle 3 platforms, Schedule: the post appears on the calendar, and in posts its status goes Queued → Publishing → Published within 4 s.

### Task 16: Demo — YT-Automation (`yt-automation`)
Assets: copy `E:\YouTube-Automation\kling3_test\s1.png..s6.png` to `assets/media/yt/`. Make one sample video with ffmpeg from `kling3_test/FINAL_krishna_kling3.mp4`, at 720p, ≤ 6 MB, as `sample.mp4`. If ffmpeg is missing, copy `flow_clips/scene1.mp4` as `sample.mp4` when it is ≤ 6 MB; otherwise show the keyframes as a crossfading slideshow.

Modules:
- `generate: form`: channel, story prompt, language Hindi/English/Hinglish, voice. Submitting opens the pipeline.
- `pipeline: pipeline`:
  - stages Research · Script · Voice · Keyframes · Motion clips · Assembly & captions · Thumbnail & SEO · Human QA · Scheduled
  - `gate: "qa"`, `cap: 4`, currency `$`
  - per-stage cost
- `scenes: custom`: the 6 keyframes grid with prompts.
- `characters: table`: each with a voice.
- `approvals: board`
- `calendar: calendar`
- `library: custom`: video cards; one plays `sample.mp4`.
- `analytics: dashboard`: views, retention, CTR per video.
- `brand: form`
- `prompts: table`
- `api: table`: providers and per-video spend.
- `logs: table`
- `health: dashboard`

**Key interactions:** Generate, and the pipeline reaches "Human QA" as blocked. Approve takes it to "Scheduled". The cost shown is ≤ $4.

### Task 17: Demo — Agentix CRM (`agentix-crm`)
Modules:
- `dashboard`
- `kanban: board`: stories, with deadline badges red/amber/green.
- `clients: table` with a drawer: invoice timeline, communications, stories.
- `leads: table`
- `insights-revenue: dashboard`: revenue vs target line.
- `insights-clients: dashboard`
- `insights-stories: dashboard`
- `insights-completion: dashboard`
- `proposal-ai: form`: paste proposal text; produces a Gemini-style analysis (scope, risks, price check) labelled "AI output (simulated)".
- `status-email: form`: produces a drafted email.
- `announcements: custom`
- `salary: dashboard + table`: incentives.
- `internal: custom`: "Co-founders only" lock with a "Unlock demo" button that reveals the investments table.
- `settings: custom`

**Key interaction:** drag a story to "Done": the dashboard completion % increases.

### Task 18: Demo — Eurobrass CRM (`eurobrass-crm`)
Replace every real customer name with fictional ones, e.g. "Hotel Aranya Grand", "Sarovar Heights" and similar invented names.

Modules:
- `dashboard`
- `leads: board`
- `customers: table`
- `dealers: table`
- `dealer-portal: custom` (dealer's orders, schemes, stock)
- `products: store` (series × finishes, no checkout: `checkout:"quote"` adds to quotation)
- `inventory: table` with a low-stock filter
- `quotations: custom`:
  - builder: customer, add products with qty and finish
  - totals with GST 18%
  - PDF-style preview
  - "Send via WhatsApp/Email" fires a sim toast
  - "Convert to order"
- `orders: table`
- `service: board` with technician assignment
- `employees: table`
- `roles: table`
- `analytics: dashboard`
- `reports: dashboard`
- `audit: table`
- `notifications: custom`

**Key interaction:** build a quote with 2 products, then Convert to order: the order appears in orders.

### Task 19: Demo — Agentix HIMS (`agentix-hims`)
Uses `role` grouping. Roles: Doctor, Nurse, Emergency, Lab, Pharmacy, Admission, OT, Blood bank, Billing & insurance, Admin (COO), Health Secretary, CMO, Patient.

Modules:
- `journey: pipeline`: Triage · OPD consult · Lab · Pharmacy · Billing (AB-PMJAY) · Discharge, for patient "Ramesh K., 58, NSTEMI".
- `doctor: custom`:
  - patient summary with an AI copilot panel (suggested differentials, drug-interaction alert "Clopidogrel + Omeprazole")
  - Rx form, then "Sign" fires a sim toast
- `nurse: table`: vitals with an auto-computed NEWS2 badge. Add `AX.hims.news2(vitals) → number` (pure, standard NEWS2 bands) with a unit test: RR 25, SpO2 91, temp 39.2, SBP 95, HR 115, alert gives 3+3+1+2+2+0 = **11**.
- `emergency: board`: triage colours.
- `lab: table`
- `pharmacy: table`
- `beds: custom`: ward bed grid with occupancy colours.
- `ot: calendar`
- `bloodbank: dashboard`
- `billing: table`: claims with a denial-risk %.
- `coo: dashboard`: roster coverage, revenue, NABH score.
- `secretary: custom`: district ranking table, bar chart, fraud alerts list.
- `cmo: dashboard`: MCH, schemes.
- `patient: custom`: health-story timeline plus an ABHA card.
- `audit: table`

**Key interactions:** the journey reaches Discharge; the nurse table shows NEWS2 for the seeded row; the Secretary view renders ≥ 10 districts.

### Task 20: Demo — Umang Hospital HIMS (`umang-hims`)
Language toggle EN/हिं via `ctx.t`. Modules:
- `register: custom`: a registration form OR an "Talk to Asha" voice-agent chat (chat with channel `voice`, waveform animation). Both create a UHID in `ctx.state`.
- `reception: board`: Registered · Waiting · With nurse · With doctor · Billing · Pharmacy · Done.
- `nurse: form`: vitals.
- `doctor: custom`: consult with Rx and lab orders.
- `billing: custom`: an itemised bill and payment.
- `pharmacy: board`
- `tracker: custom`: the public `/p/<uhid>` visit tracker reflecting `ctx.state` live.
- `reports: dashboard`

**Key interaction:** register a patient, advance them through reception → doctor → pharmacy: the tracker shows "Medicines ready". Toggle हिं and the labels change.

### Task 21: Demo — Woodpecker PMS (`woodpecker-pms`)
Properties: 3 fictional properties ("Woodpecker Residency Hauz Khas", "Woodpecker Suites Gurgaon", "Woodpecker Stays Noida") with 12 units each.

Modules:
- `dashboard`: occupancy, ADR, RevPAR per property, plus arrivals and departures.
- `tape: tape`
- `bookings: table`
- `new-booking: form`: the overlap check via `AX.calendar.overlaps` gives an error toast.
- `checkin: custom`: ID capture placeholder and a Form-C toggle.
- `folio: custom`:
  - lines, "Add POS charge" (pick items), payments, split-stay dues
  - "Generate GST invoice": an invoice preview with CGST/SGST 6%+6% for tariff ≤ ₹7,500 and 9%+9% above
  - add `AX.woodpecker.gstRate(tariff) → 0.12|0.18`, with a unit test at 7500 → 0.12 and 7501 → 0.18
- `housekeeping: board`: Dirty · In progress · Clean · Inspected.
- `maintenance: board`
- `pos: board`: kitchen tickets.
- `inventory: table`
- `laundry: table`
- `guests: table`
- `messages: chat`
- `pricing: custom`: dynamic rate grid with an occupancy-based slider.
- `channels: table`: OTA sync status.
- `finance: dashboard`
- `gst: table`
- `payroll: table`
- `owner: dashboard`: payouts.
- `booking-engine: custom`: a guest-facing booking widget producing a confirmed reservation that appears on the tape.
- `ai: custom`: insight cards.
- `reports: dashboard`
- `audit: table`

**Key interactions:** extending a booking on the tape into a free night works; into an occupied one it is rejected. In the folio, add a POS charge, then Generate invoice: the totals include GST.

### Task 22: Demo — Max Register (`max-register`)
It renders inside a phone frame on desktop and full-bleed on mobile, with a language toggle EN/हिं (Hindi default).

Modules:
- `today: dashboard`: active, came today, fees due this week, overdue, calls to make, birthdays, money this month.
- `members: table`: photo avatars (generated initials), a fee-colour band (green > 7 days, amber ≤ 7, red expired), days left; drawer with profile, plan history, payments, attendance calendar, reminder log.
- `renew: custom`: 3 taps (member, then plan, then payment mode); produces a receipt with a number formatted `MF/2026-27/000123`.
- `new-member: form`
- `calls: board`
- `leads: board`: New → Called → Trial → Joined / Lost, plus a funnel chart.
- `verify: custom`: queue cards with selfie placeholder plus declared date; Approve / Edit / Reject.
- `attendance: custom`
- `kiosk: custom`: face check-in animation, "Namaste, <name>! 12 days left"; an expired member gets a red alert.
- `reminders: custom`: WhatsApp reminder timeline with an "Advance 1 day" button that reveals the next reminder (7 days before, last 3 days, after expiry).
- `messages: table`
- `reports: dashboard`
- `diet: table`
- `bot: chat`
- `gallery: custom`
- `announcements: custom`
- `plans: table`
- `audit: table`

**Key interactions:** renew a member, and the receipt number matches `/^MF\/\d{4}-\d{2}\/\d{6}$/`. Advancing 3 days adds a reminder.

### Task 23: Demo — REDUX (`redux`)
Modules:
- `journey: pipeline`: Enquiry · Assigned (city routing) · Survey · Quote · Customer approval · Job · Invoice · Warranty, for "Hotel Kesar Palace" (fictional).
- `website: custom` (AX.embed of `https://redux-demo-iota.vercel.app/`)
- `leads: board` with SLA countdown chips.
- `inbox: chat`: WhatsApp.
- `survey-app: custom`: a phone frame with a checklist per bathroom, a photo grid and an "Offline — 3 items queued" banner; "Sync" fires a sim toast.
- `quotes: custom`: builder and preview.
- `portal: custom`: customer view where you approve the quote, see a job tracker, invoices and warranty cards.
- `jobs: board`
- `invoices: table`
- `payments: table`
- `campaigns: table`
- `rate-card: table`
- `catalog: table`
- `stock: table`
- `outbox: table`: every simulated WhatsApp/email message logged from other modules via `ctx.state`.

**Key interaction:** approving the quote in the portal makes the outbox gain a "Quote approved" WhatsApp row.

### Task 24: Demo — Your Hair Company (`yhc`)
Roles: Customer, Doctor, Sales, Admin. Modules:
- `site: custom` (embed `https://yourhaircompany.com/`)
- `scan: custom`: assessment of 4 questions, then a "3D scalp scan" animated mesh/grid with progress, then a result (Norwood-style stage, density %).
- `book: custom`: slot picker and a ₹500 mock payment, giving a booking in `ctx.state`.
- `account: custom`: consultations, orders, progress photos timeline, guarantee status.
- `shop: store`
- `doctor-calendar: calendar` (booking appears)
- `consult: custom`: video placeholder, intake summary, Rx form, and "Send plan".
- `patients: table`
- `followups: table`
- `revenue: dashboard`
- `sales-leads: board` (a booking creates a lead)
- `care: pipeline`: the refill WhatsApp sequence.
- `guarantee: table`
- `admin-orders: table`
- `catalog: table`
- `audit: table`

**Key interaction:** book a consult as Customer, switch to Doctor: the booking is on the calendar. Send plan, switch to Sales: the lead exists.

### Task 25: Demo — Skinwise (`skinwise`)
Add `AX.skinwise.recommend(answers:{concern, skinType, sensitivity:boolean, pregnant:boolean, budget}) → {routine:{step, product, why}[], cautions:string[]}` (pure rules). Unit test: `pregnant:true` → no product with `retinoid` or `salicylic` tag in `routine`, and `cautions` includes "Avoid retinoids during pregnancy".

Modules:
- `site: custom` (embed)
- `quiz: custom`: 5 steps, then the routine with caution flags.
- `scan: custom`: photo placeholder, then a scorecard (pigmentation, acne, texture, hydration, 0–100) labelled "Simulated analysis".
- `assistant: chat`: "Dr. Vivek".
- `voice: custom`: mic button, waveform, transcript.
- `products: store`: 12 products.
- `consultation: form`
- `admin-leads: table`
- `admin-orders: table`
- `admin-consults: table`

### Task 26: Demos — Tier B products
One manifest each, with the shared steps, in a single task.
- `riya-crm`:
  - `dashboard`
  - `inbox: chat` (Riya books a trial and fires event `trial`)
  - `leads: table` (the `trial` event sets the outcome to TrialBooked)
  - `insights: dashboard`
  - `tasks: board`
  - `reports: dashboard`
  - `exports: custom`
- `leadforge`:
  - `new: custom`: a sentence input; "Understand this" produces parsed criteria chips.
  - `run: pipeline`: Plan · Discover · Crawl · Normalize · Dedupe.
  - `results: table` of 40 fictional businesses; clicking a cell opens a drawer with source, URL, method and confidence %.
  - `history: table`
  - `admin: table`
- `nri-trust`:
  - `site: custom` (embed when embeddable, else scroller)
  - `assessment: custom`: 8 questions, then a GREEN/ORANGE/RED verdict, a failure matrix, a prioritised playbook, and "Download PDF" that generates a real `.txt`-as-PDF Blob labelled sample.
  - `portal: custom`
  - Add `AX.nri.persona(answers) → "GREEN"|"ORANGE"|"RED"`, with a unit test: no POA + no nominee + property in India gives RED.
- `umang-website`:
  - `site: custom`
  - `doctors: custom`: speciality filter over 12 fictional doctor cards.
  - `appointment: form`
  - `admin-leads: table`: source/UTM filters.
  - `cms: table`: content blocks with an edit drawer.
- `fitness-first`:
  - `site: custom`
  - `plans: custom`: MoM / 3 / 6 / 12-month picker with offer price.
  - `trial: form`: thank-you state.
  - Link to `riya-crm`.
- `max-website`: `site: custom`, `join: custom` (QR onboarding: existing vs new member).
- `ai-agentix-site`: `site: custom`, `assistant: chat` (answers 6 scripted questions and "navigates" by showing a highlighted section card).

**Key interactions:** the `riya-crm` trial event updates the leads table; `leadforge` provenance drawer opens; the NRI unit test passes.

### Task 27: Embed-only entries (Tier C + concept brands)
For every project with `demo:false` and an `embed`:
- the Walkthrough tab renders `AX.embed`;
- the Overview tab lists its signature features from `features`.

Concept brands get the label "Concept brand — designed and built by AI Agentix" in Overview. Santure and Ekatva use their `embed` from Task 3.

- [ ] **Step 1: Write the failing test.** For each of these projects, open `#/demo/<slug>/walkthrough`: within 15 s, either `iframe` load fired or the scroller is shown, with no page errors.
- [ ] Steps 2–5 as in the shared demo steps (commit `feat: embed-only project walkthroughs`).

---

### Task 28: Screenshot capture + wiring

**Files:**
- Create: `tools/capture.js`, `tools/capture-list.js`, `assets/shots/**`
- Modify: `js/data/projects.js` (`shots` arrays)

**Interfaces:**
- Consumes: `openPage`-style Playwright launch, `AX.projects`.
- Produces: `assets/shots/<slug>/{hero,mid,full,m}.jpg` (JPEG q80; `hero`/`mid` 1600×1000 from a 1440×900 viewport at DPR 1.11; `full` full-page capped at 6000 px tall for scrollers; `m` 390×844) and `assets/shots/<slug>/<moduleId>.jpg` for 3–5 key modules of each own demo, captured from our own `#/demo/<slug>/walkthrough/<id>`.

**Capture sources (only these):**
1. Public URLs from the spec (all marketing pages and concept sites).
2. Our own recreated demo modules.
3. Safe demo deployments: `redux-demo-iota.vercel.app` staff screens via its one-click demo personas, `eurobrass-seven.vercel.app/login` via "Continue as Demo User", and `government-hims.vercel.app` via its role picker.

Never log into production apps.

- [ ] **Step 1:** Write `capture-list.js` entries per project (`{slug, url, name, wait?, scrollTo?, clicks?:selector[]}`) and implement `capture.js` (concurrency 4, retries 2, reports failures).
- [ ] **Step 2:** Run `npm run capture`. Expected: every listed shot is written; failures are listed and re-run.
- [ ] **Step 3: Redaction review.** View every captured image that is not a concept-brand or our-own-demo shot. Blur any real phone, email or person name in a contact strip (Playwright `page.addStyleTag` hiding known selectors before capture is preferred over post-blur). Record the review in `docs/shots-review.md` (one line per file: OK / redacted what).
- [ ] **Step 4:** Wire the `shots` arrays. Run `node --test tests/unit/projects.test.js` plus a new assertion that every `shots[].src` file exists. Expected: PASS.
- [ ] **Step 5:** Commit `feat: product screenshots`.

---

### Task 29: Full QA, responsive, performance

**Files:**
- Create: `tests/e2e/responsive.test.js`, `tests/e2e/all-routes.test.js`, `tests/e2e/perf.test.js`, `README.md`

- [ ] **Step 1: Write the tests.**
  - `all-routes`: home plus every `#/demo/<slug>/<tab>` for all 49 slugs × 5 tabs → zero page errors and no failed same-origin requests.
  - `responsive` at 390/768/1024/1440:
    - `document.documentElement.scrollWidth <= innerWidth` on home and on 6 dense demos (woodpecker-pms tape, agentix crm, agentix-hims secretary, max-register members, eurobrass-crm quotations, socialpush composer) (**Review Focus 4**)
    - all text inside cards stays within its card box
  - `perf`: home first load transfers < 4 MB, measured from the Playwright `response` sizes before any interaction.
- [ ] **Step 2:** Run `npm run test:unit && npm run test:e2e`. Fix every failure at its root cause (no skipping or loosening of assertions).
- [ ] **Step 3: Manual visual pass.** Use Playwright screenshots of home at 4 widths and of each Tier A demo's start module. Inspect them for overlap, low contrast text over images, and broken badges. Fix issues.
- [ ] **Step 4:** Write `README.md`: how to open (double-click `index.html` or `npm run serve`), how to run the tests, how to add a project (data entry + optional manifest), and how to recapture screenshots. Deploy note: any static host; `sites/` must ship alongside.
- [ ] **Step 5:** Run the full suite. Expected: all PASS. Commit `test: full QA pass, README`.
