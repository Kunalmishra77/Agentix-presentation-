"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { openPage } = require("../helpers/browser");

// Effective opacity: own opacity times every ancestor's (opacity is not inherited in getComputedStyle).
const EFF = "(n) => { let o = 1; for (let x = n; x && x.nodeType === 1; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.visibility === 'hidden' || cs.display === 'none') return 0; o *= +cs.opacity; } return o; }";
const ready = (page) => page.waitForFunction(() => document.documentElement.classList.contains("ax-ready"), null, { timeout: 15000 });

test("one-lead scene: scrolling through brings all 6 beat captions to opacity > 0.9", async () => {
  const { page, errors, close } = await openPage("/index.html");
  try {
    await ready(page);
    assert.equal(await page.locator("#onelead .beat-cap").count(), 6);
    const range = await page.evaluate(() => { const st = ScrollTrigger.getById("onelead"); return [st.start, st.end]; });
    assert.ok(range[1] - range[0] > 900 * 3, "pinned for ~400vh, got " + (range[1] - range[0]));
    const max = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i <= 48; i++) {
      const y = range[0] + ((range[1] - range[0]) * i) / 48;
      await page.evaluate((yy) => AX.landing.scrollTo(yy, { immediate: true }), y);
      await page.waitForTimeout(110);
      const ops = await page.evaluate((f) => Array.from(document.querySelectorAll("#onelead .beat-cap")).map((0, eval)(f)), EFF);
      ops.forEach((o, k) => { if (o > max[k]) max[k] = o; });
    }
    max.forEach((m, k) => assert.ok(m > 0.9, "beat " + (k + 1) + " max opacity " + m));
    const demos = await page.locator("#onelead .beat-cap [data-demo]").count();
    assert.ok(demos >= 6, "every caption links to its demo");
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("reduced motion: six beats are a visible static list", async () => {
  const { page, errors, close } = await openPage("/index.html", { reducedMotion: true });
  try {
    await ready(page);
    assert.equal(await page.locator("#onelead.is-static").count(), 1);
    const beats = page.locator("#onelead .beat");
    assert.equal(await beats.count(), 6);
    for (let i = 0; i < 6; i++) {
      assert.equal(await beats.nth(i).isVisible(), true);
      const op = await beats.nth(i).locator(".beat-cap").evaluate((n, f) => (0, eval)(f)(n), EFF);
      assert.ok(op > 0.9, "beat " + (i + 1) + " opacity " + op);
    }
    assert.equal(await page.locator(".pin-spacer").count(), 0);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("index: 11 rows; clicking row 05 scrolls #cat-hospitality into view", async () => {
  const { page, errors, close } = await openPage("/index.html");
  try {
    await ready(page);
    const rows = page.locator("#index .idx-row");
    assert.equal(await rows.count(), 11);
    await page.evaluate(() => AX.landing.scrollTo("#index", { immediate: true }));
    await page.waitForTimeout(300);
    const row5 = page.locator('#index .idx-row[data-num="05"]');
    assert.match(await row5.innerText(), /Hospitality/);
    await row5.click();
    await page.waitForFunction(() => {
      const r = document.getElementById("cat-hospitality").getBoundingClientRect();
      return r.top < innerHeight * 0.5 && r.bottom > 0 && Math.abs(r.top) < 140;
    }, null, { timeout: 6000 });
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("index rows show project count and status mix; thumbnails follow the cursor", async () => {
  const { page, close } = await openPage("/index.html");
  try {
    await ready(page);
    const row = page.locator('#index .idx-row[data-num="01"]');
    assert.match(await row.locator(".idx-count").innerText(), /^4 projects$/);
    assert.ok((await row.locator(".idx-mix i").count()) >= 1);
    await page.evaluate(() => AX.landing.scrollTo("#index", { immediate: true }));
    await page.waitForTimeout(300);
    await row.hover();
    await page.locator(".idx-float.is-on .idx-thumb").first().waitFor({ timeout: 3000 });
    const n = await page.locator(".idx-float img").count();
    assert.ok(n >= 1 && n <= 3, "1-3 thumbnails, got " + n);
  } finally { await close(); }
});
