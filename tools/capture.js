"use strict";
// Screenshot capture: public pages, local mirrors and our own recreated demo modules.
// Usage: PORT=4530 node tools/serve.js &  then  node tools/capture.js [slug...]
// Writes PNGs to .tmp-shots/<slug>/<name>.png (converted to JPEG 1600/800 by tools/shots-to-jpg.py).
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("E:/travel-agency/node_modules/playwright");
const OUT = path.resolve(__dirname, "..", ".tmp-shots");
const LOCAL = "http://127.0.0.1:" + (process.env.PORT || 4530) + "/index.html";
const SHOW = "https://showcase-build-tau.vercel.app/";

const DEMOS = {
  agentix: ["conversations", "crm", "flows"], socialflow: ["inbox", "flows", "comment-dm"],
  voicecrm: ["dashboard", "live-calls", "insights"], "riya-crm": ["dashboard", "inbox", "insights"],
  socialpush: ["composer", "calendar", "analytics"], "yt-automation": ["pipeline", "scenes", "approvals"],
  "agentix-crm": ["dashboard", "kanban", "insights-revenue"], "eurobrass-crm": ["dashboard", "quotations", "orders"],
  leadforge: ["run", "results", "history"], "agentix-hims": ["doctor", "secretary", "journey"],
  "umang-hims": ["doctor", "reception", "billing"], "woodpecker-pms": ["tape", "folio", "dashboard"],
  "max-register": ["today", "kiosk", "members"], redux: ["journey", "quotes", "jobs"],
  yhc: ["scan", "doctor-calendar", "consult"], skinwise: ["quiz", "assistant", "products"],
};
const SITES = {
  "umang-website": "https://www.umanghospitals.in/", "kaaya-eco-resort": "https://kaayaecoresort.com/",
  "max-website": "https://maxfitnessgym.co.in/", "fitness-first": "https://fitnessfirstdwarka.com/",
  "nri-trust": "https://nritrust.co/", "ai-agentix-site": "https://ai-agentix.com/",
  "dr-shweta-diwan": "https://drshwetadiwan.com/", "thames-spa": "https://thameswellnessspa.com/",
  "eurobrass-site": "https://eurobrass-seven.vercel.app/", yhc: "https://yourhaircompany.com/", skinwise: "https://myskinwise.com/",
  santure: "LOCAL:sites/santure/index.html", ekatva: "LOCAL:sites/ekatva/index.html",
  crumb: SHOW + "crumb/", coralbay: SHOW + "coralbay/", "tallow-tape": SHOW + "tallow/", vaskaro: SHOW + "vaskaro/",
};
const SLOW = { "kaaya-eco-resort": 6000, "thames-spa": 11000 };
const CLOSERS = ['button:has-text("Accept")', 'button:has-text("Got it")', 'button:has-text("I agree")', 'button:has-text("Allow all")', 'button:has-text("No thanks")',
  '[aria-label="Close" i]', '[aria-label="Dismiss" i]', 'button[class*="close" i]', '[class*="popup" i] [class*="close" i]', '[class*="modal" i] [class*="close" i]', '.cookie button', '[id*="cookie" i] button'];

async function settle(page) {
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  await page.waitForTimeout(1500);
}
async function dismiss(page) {
  for (let r = 0; r < 2; r++) {
    for (const sel of CLOSERS) {
      const loc = page.locator(sel).first();
      if (await loc.isVisible().catch(() => false)) { await loc.click({ timeout: 1500 }).catch(() => {}); await page.waitForTimeout(300); }
    }
    await page.waitForTimeout(500);
  }
}
async function scrollTo(page, y) {
  for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, y / 12); await page.waitForTimeout(120); }
  await page.evaluate((y) => window.scrollTo(0, y), y).catch(() => {});
  await page.waitForTimeout(1800);
}
async function job(browser, slug, onlyDemo) {
  const dir = path.join(OUT, slug); fs.mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.11 });
  const page = await ctx.newPage();
  try {
    if (SITES[slug] && !onlyDemo) {
      const u = SITES[slug].startsWith("LOCAL:") ? new URL(SITES[slug].slice(6), "http://127.0.0.1:" + (process.env.PORT || 4530) + "/").href : SITES[slug];
      await page.goto(u, { waitUntil: "domcontentloaded", timeout: 40000 });
      await settle(page); await page.waitForTimeout(SLOW[slug] || 0); await dismiss(page);
      await page.screenshot({ path: path.join(dir, "hero.png") });
      await scrollTo(page, 1100); await dismiss(page);
      await page.screenshot({ path: path.join(dir, "mid.png") });
    }
    if (DEMOS[slug] && (onlyDemo || !SITES[slug] || true) && !SITES[slug + "__x"]) {
      if (onlyDemo !== false) for (const m of DEMOS[slug]) {
        await page.goto(LOCAL + "#/demo/" + slug + "/walkthrough/" + m, { waitUntil: "domcontentloaded" });
        await page.waitForSelector("#shell .ax-app [data-module-ready]", { timeout: 20000 }).catch(() => {});
        await page.waitForTimeout(1800);
        if (slug === "agentix" && m === "conversations") { await page.locator("button", { hasText: "Play Ritika" }).first().click().catch(() => {}); await page.waitForTimeout(6000); }
        const box = await page.locator("#shell .ax-app").first().boundingBox();
        const vh = 900;
        await page.screenshot({ path: path.join(dir, m + ".png"), clip: { x: box.x, y: box.y, width: box.width, height: Math.max(300, Math.min(box.height, vh - box.y)) } });
      }
    }
    return null;
  } catch (e) { return slug + ": " + e.message.split("\n")[0]; } finally { await ctx.close(); }
}
(async () => {
  const want = process.argv.slice(2);
  const slugs = Array.from(new Set(Object.keys(DEMOS).concat(Object.keys(SITES)))).filter((s) => !want.length || want.includes(s));
  const browser = await chromium.launch({ channel: "chrome" });
  const fails = []; const queue = slugs.slice();
  await Promise.all([0, 1, 2, 3].map(async () => { while (queue.length) { const s = queue.shift(); let err; for (let t = 0; t < 3; t++) { err = await job(browser, s); if (!err) break; } if (err) fails.push(err); else console.log("ok", s); } }));
  await browser.close();
  console.log(fails.length ? "FAILED:\n" + fails.join("\n") : "all ok");
})();
