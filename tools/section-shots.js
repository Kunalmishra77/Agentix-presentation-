"use strict";
// Dev-only: viewport screenshots of the key landing scenes (hero, one-lead, a flagship section, rail, posters, footer)
// at 1440 and 390, for before/after comparisons.
// Usage: node tools/section-shots.js <repoRoot> <outDir> [port]
const path = require("node:path");
const fs = require("node:fs");
const { chromium } = require(process.env.PW || "E:/travel-agency/node_modules/playwright");

const root = path.resolve(process.argv[2] || path.join(__dirname, ".."));
const out = path.resolve(process.argv[3] || "tmp-audit/compare");
const port = +(process.argv[4] || 4524);
const { start } = require(path.join(root, "tools", "serve.js"));
const SCENES = [["hero", "#hero"], ["onelead", "#onelead, .onelead"], ["flagship", "#cat-agents"], ["rail", ".cat--rail"], ["posters", ".cat--poster"], ["footer", "#footer"]];

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const server = await start(port);
  const browser = await chromium.launch({ channel: "chrome" });
  try {
    for (const w of [1440, 390]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, reducedMotion: "reduce" });
      const page = await ctx.newPage();
      await page.goto("http://127.0.0.1:" + port + "/index.html", { waitUntil: "load" });
      await page.waitForFunction(() => document.documentElement.classList.contains("ax-ready"), null, { timeout: 20000 }).catch(() => {});
      for (const [name, sel] of SCENES) {
        const ok = await page.evaluate((s) => { const n = document.querySelector(s); if (!n) return false; window.scrollTo(0, n.getBoundingClientRect().top + scrollY - (s === "#hero" ? 0 : 0)); return true; }, sel);
        if (!ok) continue;
        await page.waitForTimeout(900);
        await page.screenshot({ path: path.join(out, name + "-" + w + ".png") });
      }
      await ctx.close();
    }
  } finally { await browser.close(); server.close(); }
  console.log("saved to", out);
})().catch((e) => { console.error(e); process.exit(1); });
