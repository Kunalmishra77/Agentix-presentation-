"use strict";
const { start } = require("../../tools/serve");

const PORT = +process.env.AX_PORT || 4310;
const serverUrl = "http://127.0.0.1:" + PORT;
const { chromium } = require(process.env.PW || "E:/travel-agency/node_modules/playwright");

let serverP = null, browserP = null, users = 0;
function ensure() {
  if (!serverP) serverP = start(PORT);
  if (!browserP) browserP = chromium.launch({ channel: "chrome" });
  return Promise.all([serverP, browserP]);
}

async function openPage(path, opts = {}) {
  const [, browser] = await ensure();
  users++;
  const ctx = await browser.newContext({
    viewport: { width: opts.width || 1440, height: opts.height || 900 },
    reducedMotion: opts.reducedMotion ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("requestfailed", (r) => errors.push("requestfailed: " + r.url() + " " + (r.failure() && r.failure().errorText)));
  await page.goto(serverUrl + path, { waitUntil: "load" });
  async function close() {
    await ctx.close();
    if (--users === 0) {
      const [s, b] = await Promise.all([serverP, browserP]);
      serverP = browserP = null;
      await b.close();
      await new Promise((r) => s.close(r));
    }
  }
  return { page, errors, close };
}

module.exports = { openPage, serverUrl };
