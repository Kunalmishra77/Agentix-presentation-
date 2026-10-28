"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { openPage } = require("../helpers/browser");

const ready = (page) => page.waitForFunction(() => document.documentElement.classList.contains("ax-ready"), null, { timeout: 15000 });

test("preloader finishes and the hero headline is shown, with no errors", async () => {
  const { page, errors, close } = await openPage("/index.html");
  try {
    // the preloader may already have finished by the load event on a busy machine, so check the flag it sets
    assert.equal(await page.evaluate(() => window.__axPreloaderShown === true), true, "preloader ran on first visit");
    await ready(page);
    await page.locator("#preloader").waitFor({ state: "detached" });
    assert.match(await page.locator("#hero h1").innerText(), /AI Applied/);
    assert.equal(await page.evaluate(() => AX.landing.lenis !== null), true);
    assert.equal(await page.locator("#hero .fan-card").count(), 7);
    assert.equal(await page.locator("#cursor").count(), 1, "custom cursor on fine pointers");
    const eager = await page.locator('#hero img[loading="eager"]').count();
    assert.ok(eager <= 3, "at most 3 eager hero images, got " + eager);
    assert.match(await page.locator("#hero .hero-sub").innerText(), /^50 products, platforms and websites/);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("preloader is shown only once per session", async () => {
  const { page, close } = await openPage("/index.html");
  try {
    await ready(page);
    await page.reload();
    await ready(page);
    assert.equal(await page.evaluate(() => !!window.__axPreloaderShown), false);
  } finally { await close(); }
});

test("reduced motion: no pinning, no Lenis, hero grid visible", async () => {
  const { page, errors, close } = await openPage("/index.html", { reducedMotion: true });
  try {
    await ready(page);
    assert.equal(await page.evaluate(() => AX.landing.lenis), null);
    assert.equal(await page.locator(".pin-spacer").count(), 0);
    const pinned = await page.evaluate(() => Array.from(document.querySelectorAll("#landing *"))
      .filter((n) => n.style.transform && /translate/.test(n.style.transform) && n.closest(".pin-spacer")).length);
    assert.equal(pinned, 0);
    assert.equal(await page.locator("#hero .fan.is-grid").isVisible(), true);
    const op = await page.evaluate(() => Math.min.apply(null, Array.from(document.querySelectorAll("#hero .fan-card")).map((c) => +getComputedStyle(c).opacity)));
    assert.ok(op > 0.9, "fan cards visible, min opacity " + op);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("'Watch an agent close a lead' opens the AGENTiX conversations walkthrough", async () => {
  const { page, close } = await openPage("/index.html");
  try {
    await ready(page);
    await page.getByRole("link", { name: "Watch an agent close a lead" }).click();
    await page.waitForFunction(() => location.hash === "#/demo/agentix/walkthrough/conversations");
    await page.locator("#shell").waitFor({ state: "visible" });
  } finally { await close(); }
});

test("nav turns into blurred paper once scrolled; no horizontal overflow at 390", async () => {
  const { page, close } = await openPage("/index.html", { width: 390, height: 844 });
  try {
    await ready(page);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= 390), true);
    await page.evaluate(() => AX.landing.scrollTo(600, { immediate: true }));
    await page.locator("#nav.is-scrolled").waitFor();
  } finally { await close(); }
});
