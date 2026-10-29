"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { openPage } = require("../helpers/browser");
const { ready } = require("../helpers/landing");

/** Waits until the image has loaded, then reports its src and natural width. */
const loaded = (page, sel) => page.waitForFunction((s) => {
  const i = document.querySelector(s);
  return i && i.complete && i.naturalWidth > 0 ? { src: i.getAttribute("src"), w: i.naturalWidth, alt: i.alt } : null;
}, sel, { timeout: 10000 }).then((h) => h.jsonValue());

test("no custom cursor: no cursor element and the normal pointer", async () => {
  const { page, errors, close } = await openPage("/index.html");
  try {
    await ready(page);
    await page.mouse.move(400, 400);
    assert.equal(await page.locator("#cursor, .cursor, .cursor-label").count(), 0);
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).cursor), "auto");
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("nav, footer and shell use the original Agentix logo images, loaded", async () => {
  const { page, errors, close } = await openPage("/index.html", { reducedMotion: true });
  try {
    await ready(page);
    const nav = await loaded(page, "#nav .nav-mark img");
    assert.match(nav.src, /assets\/brand\/agentix-mark\.png$/);
    const word = await loaded(page, "#nav img.nav-word");
    assert.match(word.src, /assets\/brand\/agentix-wordmark\.png$/);
    await page.evaluate(() => document.getElementById("footer").scrollIntoView());
    const foot = await loaded(page, "#footer .ft-mark img");
    assert.match(foot.src, /assets\/brand\/agentix-logo\.png$/);
    assert.equal(await page.locator("svg.ax-mark, .ax-mark svg").count(), 0, "no redrawn SVG mark left");
    await page.evaluate(() => AX.router.go("#/demo/agentix"));
    await page.locator("#shell").waitFor({ state: "visible" });
    const bar = await loaded(page, ".shell-bar .bar-mark img");
    assert.match(bar.src, /assets\/brand\/agentix-mark\.png$/);
    const light = await loaded(page, ".shell-bar img.bar-word");
    assert.match(light.src, /assets\/brand\/agentix-wordmark-light\.png$/);
    const alts = await page.evaluate(() => [...document.querySelectorAll("img.ax-brand-img")].map((i) => i.alt));
    assert.ok(alts.length > 0 && alts.every((a) => a === "AI Agentix"), "every brand image has alt=AI Agentix");
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

for (const width of [360, 768, 1024]) {
  test("landing has no horizontal overflow at " + width + "px", async () => {
    const { page, close } = await openPage("/index.html", { width, height: 900, reducedMotion: true });
    try {
      await ready(page);
      const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      assert.ok(o.sw <= o.cw, "scrollWidth " + o.sw + " > clientWidth " + o.cw);
    } finally { await close(); }
  });
}
