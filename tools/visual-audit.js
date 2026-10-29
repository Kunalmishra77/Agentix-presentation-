"use strict";
// Dev-only visual audit: screenshots the landing and the AppShell demos at several widths and runs layout checks
// (horizontal overflow, clipped text, overlapping text boxes, elements past the viewport).
// Usage: PORT=4520 node tools/visual-audit.js [--only=landing|demos|ext] [--tag=before] [--demos=slug,slug]
// Output: tmp-audit/<tag>/*.png and tmp-audit/<tag>/report.json (tmp-audit/ is not committed).
const fs = require("node:fs");
const path = require("node:path");
const { start } = require("./serve");
const { chromium } = require(process.env.PW || "E:/travel-agency/node_modules/playwright");

const PORT = +process.env.PORT || 4520;
const BASE = "http://127.0.0.1:" + PORT;
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const m = /^--([^=]+)=?(.*)$/.exec(a); return m ? [m[1], m[2] || true] : [a, true]; }));
const TAG = args.tag || "latest";
const OUT = path.resolve(__dirname, "..", "tmp-audit", TAG);
fs.mkdirSync(OUT, { recursive: true });

const LANDING_W = [360, 390, 768, 1024, 1280, 1440, 1920];
const DEMO_W = [390, 768, 1440];
const DEMOS = (args.demos ? String(args.demos).split(",") : ["agentix", "socialflow", "agentix-hims", "umang-hims", "woodpecker-pms", "max-register",
  "voicecrm", "socialpush", "yt-automation", "redux", "yhc", "skinwise"]);
const EXT = [
  ["cairnline", "https://showcase-build-tau.vercel.app/cairnline/"], ["meridian", "https://showcase-build-tau.vercel.app/meridian/"],
  ["saffron", "https://showcase-build-tau.vercel.app/saffron/"], ["aurelune", "https://showcase-build-tau.vercel.app/aurelune/"],
  ["hms-portal", "https://hotelmanagement.aiagentixdev.com/portal"], ["agentix-app", "https://app.aiagentixdev.com/"],
];

/* Runs in the page: returns a list of layout issues inside `rootSel` (default: whole document). */
function checks(rootSel) {
  const issues = [];
  const de = document.documentElement;
  const vw = de.clientWidth;
  if (de.scrollWidth > vw + 1) issues.push({ kind: "h-overflow", detail: "scrollWidth " + de.scrollWidth + " > " + vw });
  const root = rootSel ? document.querySelector(rootSel) : document.body;
  if (!root) return issues;
  const visible = (n) => {
    for (let x = n; x && x.nodeType === 1; x = x.parentElement) {
      const cs = getComputedStyle(x);
      if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) return false;
      if (x.hidden) return false;
      if (cs.clip === "rect(0px, 0px, 0px, 0px)" || (cs.position === "absolute" && x.offsetWidth <= 1 && x.offsetHeight <= 1)) return false; // visually hidden (sr-only)
    }
    const r = n.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const desc = (n) => {
    let s = n.tagName.toLowerCase();
    if (n.id) s += "#" + n.id;
    if (n.classList.length) s += "." + Array.from(n.classList).slice(0, 3).join(".");
    const t = (n.textContent || "").trim().replace(/\s+/g, " ").slice(0, 50);
    return s + (t ? ' "' + t + '"' : "");
  };
  // skip things that are intentionally scrollable, decorative, or offscreen by design
  const inScroller = (n) => {
    for (let x = n.parentElement; x && x !== document.body; x = x.parentElement) {
      const cs = getComputedStyle(x);
      if (/(auto|scroll)/.test(cs.overflowX) && x.scrollWidth > x.clientWidth + 1) return true;
      if (x.matches && x.matches(".fan,.fan-stage,.rail-track,.rail,.posters,.idx-float,[aria-hidden='true'],.sr-only,.ol-stage,.marquee,.dl-track")) return true;
    }
    return false;
  };
  const all = root.querySelectorAll("*");
  const textEls = [];
  for (const n of all) {
    if (n.closest("svg,canvas,iframe,script,style,.sr-only,select,option")) continue;
    if (!visible(n)) continue;
    const cs = getComputedStyle(n);
    const hasText = Array.from(n.childNodes).some((c) => c.nodeType === 3 && c.textContent.trim());
    // clipped text
    if (hasText) {
      const clips = cs.overflowX !== "visible" || cs.overflowY !== "visible" || cs.textOverflow === "ellipsis";
      const isInput = /^(INPUT|TEXTAREA)$/.test(n.tagName);
      if (clips && !isInput) {
        const wide = n.scrollWidth > n.clientWidth + 1, tall = n.scrollHeight > n.clientHeight + 1 && cs.overflowY !== "auto" && cs.overflowY !== "scroll";
        // intended truncation: carries the full text in a title, or is decorative (aria-hidden)
        const intended = n.hasAttribute("title") || n.closest("[title]") || n.closest("[aria-hidden='true']");
        if ((wide || tall) && !intended) issues.push({ kind: "clipped", el: desc(n), detail: (wide ? "w " + n.scrollWidth + ">" + n.clientWidth : "") + (tall ? " h " + n.scrollHeight + ">" + n.clientHeight : "") });
      }
      textEls.push(n);
    }
    // past viewport (horizontal)
    if (!inScroller(n) && cs.position !== "fixed") {
      const r = n.getBoundingClientRect();
      if ((r.right > vw + 1 || r.left < -1) && r.width < vw * 3 && hasText) issues.push({ kind: "past-viewport", el: desc(n), detail: "left " + Math.round(r.left) + " right " + Math.round(r.right) + " vw " + vw });
    }
  }
  // overlapping text boxes among headings/buttons/labels (siblings in the same stacking context, rough)
  const cand = Array.from(root.querySelectorAll("h1,h2,h3,h4,button,a.btn-x,label,.status-chip,.agentix-badge,.tab,.ax-nav-item,.st-btn,.nav-cta,.pc-name,.pc-title"))
    .filter((n) => visible(n) && !n.closest("[aria-hidden='true'],.fan,.idx-float,.ov,.lightbox,#nav,.nav,.preloader"));
  const rects = cand.map((n) => {
    // use the text's own box (range) so padding does not create false positives
    const rg = document.createRange(); rg.selectNodeContents(n);
    const r = rg.getBoundingClientRect();
    return { n, r };
  }).filter((o) => o.r.width > 2 && o.r.height > 2);
  for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      const a = rects[i], b = rects[j];
      if (a.n.contains(b.n) || b.n.contains(a.n)) continue;
      const ox = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
      const oy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
      if (ox > 3 && oy > 3) issues.push({ kind: "overlap", el: desc(a.n), detail: "with " + desc(b.n) + " (" + Math.round(ox) + "x" + Math.round(oy) + ")" });
    }
  }
  // de-duplicate
  const seen = new Set();
  return issues.filter((i) => { const k = i.kind + i.el + i.detail; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 80);
}

async function shot(page, file, full) {
  try { await page.screenshot({ path: path.join(OUT, file), fullPage: !!full, timeout: 90000 }); }
  catch (e) { console.log("screenshot failed", file, String(e.message).slice(0, 120)); }
}

async function landing(browser, report) {
  for (const reduced of [true, false]) {
    for (const w of reduced ? LANDING_W : [390, 1440]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, reducedMotion: reduced ? "reduce" : "no-preference" });
      const page = await ctx.newPage();
      if (!reduced) await page.addInitScript(() => { try { sessionStorage.setItem("ax.preloader.seen", "1"); } catch (e) {} });
      await page.goto(BASE + "/index.html", { waitUntil: "load" });
      await page.waitForFunction(() => document.documentElement.classList.contains("ax-ready"), null, { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(500);
      const name = "landing-" + w + (reduced ? "" : "-motion");
      if (reduced) {
        // Chrome cannot render one full-page image taller than ~16k px, so capture viewport-sized slices instead
        const H = await page.evaluate(() => document.documentElement.scrollHeight);
        const vh = page.viewportSize().height;
        for (let y = 0, k = 0; y < H; y += vh, k++) {
          await page.evaluate((yy) => window.scrollTo(0, yy), y);
          await page.waitForTimeout(250);
          await shot(page, name + "-" + String(k).padStart(2, "0") + ".png");
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        report.push({ page: name, issues: await page.evaluate(checks, null) });
      } else {
        // motion pass: scroll through scenes and take viewport shots
        const H = await page.evaluate(() => document.documentElement.scrollHeight);
        const vh = page.viewportSize().height;
        const all = [];
        let k = 0;
        for (let y = 0; y < H; y += Math.round(vh * 0.9)) {
          await page.evaluate((yy) => { if (window.AX && AX.landing && AX.landing.scrollTo) AX.landing.scrollTo(yy, { immediate: true }); else scrollTo(0, yy); }, y);
          await page.waitForTimeout(450);
          if (k % 2 === 0 || y + vh >= H) await shot(page, name + "-" + String(k).padStart(2, "0") + ".png");
          all.push(...(await page.evaluate(checks, null)).map((i) => Object.assign(i, { y })));
          k++;
          if (k > 60) break;
        }
        const seen = new Set();
        report.push({ page: name, issues: all.filter((i) => { const kk = i.kind + i.el; if (seen.has(kk)) return false; seen.add(kk); return true; }) });
      }
      await ctx.close();
    }
  }
}

async function demos(browser, report) {
  for (const slug of DEMOS) {
    for (const w of DEMO_W) {
      const ctx = await browser.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, reducedMotion: "reduce" });
      const page = await ctx.newPage();
      const errs = [];
      page.on("pageerror", (e) => errs.push(e.message));
      await page.goto(BASE + "/index.html#/demo/" + slug, { waitUntil: "load" });
      await page.waitForSelector("#shell:not([hidden]) .pane, #shell:not([hidden]) .shell-body", { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(400);
      await shot(page, "demo-" + slug + "-" + w + "-overview.png");
      report.push({ page: "demo-" + slug + "-" + w + "-overview", issues: await page.evaluate(checks, "#shell") });
      await page.evaluate((s) => { location.hash = "#/demo/" + s + "/walkthrough"; }, slug);
      await page.waitForSelector("[data-module-ready],[data-module-error]", { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(500);
      const ids = await page.evaluate(() => Array.from(document.querySelectorAll(".ax-nav-item")).map((b) => b.getAttribute("data-id")));
      const cur = await page.evaluate(() => { const m = document.querySelector(".ax-module"); return m && m.getAttribute("data-module"); });
      const others = ids.filter((i) => i !== cur);
      const pick = [cur].concat(others.length > 2 ? [others[Math.floor(others.length / 3)], others[others.length - 1]] : others).filter(Boolean);
      for (const id of pick) {
        if (id !== cur) {
          await page.evaluate(([s, m]) => { location.hash = "#/demo/" + s + "/walkthrough/" + m; }, [slug, id]);
          await page.waitForSelector('.ax-module[data-module="' + id + '"][data-module-ready], .ax-module[data-module="' + id + '"][data-module-error]', { timeout: 15000 }).catch(() => {});
          await page.waitForTimeout(450);
        }
        const name = "demo-" + slug + "-" + w + "-" + id;
        await shot(page, name + ".png");
        report.push({ page: name, issues: await page.evaluate(checks, "#shell") });
      }
      if (errs.length) report.push({ page: "demo-" + slug + "-" + w + "-errors", issues: errs.map((e) => ({ kind: "pageerror", detail: e })) });
      await ctx.close();
    }
  }
}

async function external(browser) {
  for (const [name, url] of EXT) {
    for (const w of [1440, 390]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
      const page = await ctx.newPage();
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
        await page.waitForTimeout(2500);
        await page.screenshot({ path: path.join(OUT, "ext-" + name + "-" + w + ".png") });
        const H = await page.evaluate(() => document.documentElement.scrollHeight);
        for (const f of [0.25, 0.5]) {
          await page.mouse.wheel(0, H * f / 2); await page.waitForTimeout(1500);
          await page.screenshot({ path: path.join(OUT, "ext-" + name + "-" + w + "-s" + Math.round(f * 100) + ".png") });
        }
      } catch (e) { console.log("ext fail", name, e.message); }
      await ctx.close();
    }
  }
}

(async () => {
  const server = await start(PORT);
  const browser = await chromium.launch({ channel: "chrome" });
  const report = [];
  try {
    if (!args.only || args.only === "landing") await landing(browser, report);
    if (!args.only || args.only === "demos") await demos(browser, report);
    if (args.only === "ext") await external(browser);
  } finally {
    await browser.close();
    server.close();
  }
  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 1));
  const total = report.reduce((n, r) => n + r.issues.length, 0);
  const byKind = {};
  report.forEach((r) => r.issues.forEach((i) => { byKind[i.kind] = (byKind[i.kind] || 0) + 1; }));
  console.log("pages:", report.length, "issues:", total, JSON.stringify(byKind), "->", path.relative(process.cwd(), OUT));
})().catch((e) => { console.error(e); process.exit(1); });
