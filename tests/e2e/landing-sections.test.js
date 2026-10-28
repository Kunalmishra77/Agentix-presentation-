"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { openPage } = require("../helpers/browser");

const ready = (page) => page.waitForFunction(() => document.documentElement.classList.contains("ax-ready"), null, { timeout: 15000 });
const visibleSlugs = (page) => page.evaluate(() => Array.from(document.querySelectorAll("#work .pcard[data-demo]"))
  .filter((n) => n.offsetParent !== null).map((n) => n.getAttribute("data-demo")).sort());

test("one card per non-delivery project, each with the Agentix badge and its parts", async () => {
  const { page, errors, close } = await openPage("/index.html");
  try {
    await ready(page);
    const expected = await page.evaluate(() => AX.projects.filter((p) => p.category !== "delivery").length);
    assert.equal(await page.locator("#work .pcard[data-demo]").count(), expected);
    assert.equal(await page.locator("#work .pcard:not(:has(.agentix-badge))").count(), 0);
    assert.equal(await page.locator("#work .pcard:not(:has(.status-chip))").count(), 0);
    assert.equal(await page.locator("#work .pcard:not(:has(.pc-open))").count(), 0);
    assert.equal(await page.locator('#work .pcard img:not([loading="lazy"])').count(), 0, "every card image is lazy");
    assert.equal(await page.locator("#cat-delivery .pcard").count(), 0, "delivery renders as the pipeline strip");
    assert.ok(await page.locator("#cat-delivery .pipe").count() === 1);
    const layouts = await page.evaluate(() => AX.categories.map((c) => document.getElementById("cat-" + c.id).className));
    assert.ok(layouts.every((c, i) => c.includes("cat--")), layouts.join(","));
    const v = await page.evaluate(() => AX.cards.render(AX.projects[0], "poster").matches(".pcard[data-demo=agentix]"));
    assert.equal(v, true);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("search 'hims' leaves exactly the two HIMS cards; Concept filter shows only concept cards", async () => {
  const { page, errors, close } = await openPage("/index.html");
  try {
    await ready(page);
    await page.fill("#q", "hims");
    await page.waitForFunction(() => document.querySelectorAll("#work .pcard:not([hidden])").length === 2);
    assert.deepEqual(await visibleSlugs(page), ["agentix-hims", "umang-hims"]);
    await page.fill("#q", "");
    await page.click('.st-btn[data-status="concept"]');
    const concept = await page.evaluate(() => AX.projects.filter((p) => p.status === "concept" && p.category !== "delivery").length);
    await page.waitForFunction((n) => document.querySelectorAll("#work .pcard:not([hidden])").length === n, concept);
    const statuses = await page.evaluate(() => Array.from(document.querySelectorAll("#work .pcard")).filter((n) => n.offsetParent !== null).map((n) => n.dataset.status));
    assert.equal(statuses.length, concept);
    assert.ok(statuses.every((s) => s === "concept"));
    await page.click('.st-btn[data-status=""]');
    await page.waitForFunction(() => document.querySelectorAll("#work .pcard[hidden]").length === 0);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("open a card mid-page, Esc: scroll restored within 40px and the next pin still works", async () => {
  const { page, errors, close } = await openPage("/index.html");
  try {
    await ready(page);
    await page.evaluate(() => AX.landing.scrollTo("#cat-hospitality", { immediate: true }));
    await page.waitForTimeout(400);
    const card = page.locator('#work .pcard[data-demo="woodpecker-pms"]');
    await card.hover();
    await page.waitForTimeout(300);
    const y0 = await page.evaluate(() => scrollY);
    assert.ok(y0 > 2000, "opened from the middle of the page, y=" + y0);
    await card.click();
    await page.locator("#shell").waitFor({ state: "visible" });
    await page.waitForFunction(() => location.hash === "#/demo/woodpecker-pms");
    await page.waitForTimeout(500);
    await page.keyboard.press("Escape");
    await page.locator("#shell").waitFor({ state: "hidden" });
    await page.waitForTimeout(500);
    const y1 = await page.evaluate(() => scrollY);
    assert.ok(Math.abs(y1 - y0) <= 40, "scroll restored: before " + y0 + " after " + y1);
    // the websites rail (the next pinned section) still pins and scrubs
    const st = await page.evaluate(() => { const s = ScrollTrigger.getById("rail-websites"); return [s.start, s.end]; });
    assert.ok(st[0] > y0, "rail is below the hospitality section");
    await page.evaluate((y) => AX.landing.scrollTo(y, { immediate: true }), (st[0] + st[1]) / 2);
    await page.waitForFunction(() => {
      const s = ScrollTrigger.getById("rail-websites");
      const tr = getComputedStyle(document.querySelector("#cat-websites .rail-track")).transform;
      return s.isActive && tr !== "none" && new DOMMatrix(tr).m41 < -50;
    }, null, { timeout: 4000 });
    const pinTop = await page.evaluate(() => document.querySelector("#cat-websites .rail-pin").getBoundingClientRect().top);
    assert.ok(Math.abs(pinTop) < 2, "rail pinned to the top, top=" + pinTop);
    // The shell lazy-loads js/demos/<slug>.js; demos not built yet 404 (and abort on close). That is not a landing error.
    const own = errors.filter((e) => !/js\/demos\/|Failed to load resource: the server responded with a status of 404/.test(e));
    assert.equal(own.length, 0, own.join("\n"));
  } finally { await close(); }
});

test("footer counters, contact CTA, logo and tagline; control KPIs tick", async () => {
  const { page, errors, close } = await openPage("/index.html");
  try {
    await ready(page);
    await page.evaluate(() => AX.landing.scrollTo("#cat-health", { immediate: true }));
    const kpi = page.locator("#cat-health .kpi-chip .kc-val").first();
    const before = await kpi.innerText();
    await page.waitForFunction((b) => document.querySelector("#cat-health .kpi-chip .kc-val").textContent !== b, before, { timeout: 7000 });
    await page.evaluate(() => AX.landing.scrollTo("#footer", { immediate: true }));
    const live = await page.evaluate(() => AX.projects.filter((p) => p.status === "live").length);
    await page.waitForFunction((l) => {
      const v = Array.from(document.querySelectorAll("#footer .ft-num")).map((n) => n.textContent.trim());
      return v[0] === "50" && v[1] === "11" && v[2] === String(l);
    }, live, { timeout: 6000 });
    const cta = page.locator('#footer a.ft-cta');
    assert.equal(await cta.getAttribute("href"), "https://ai-agentix.com/contact");
    assert.equal(await cta.getAttribute("target"), "_blank");
    assert.match(await page.locator("#footer").innerText(), /AI Applied, Growth Multiplied\./);
    assert.equal(await page.locator("#footer .ax-mark").count() >= 1, true);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("phone 390: no horizontal overflow; the rail scrolls inside its container", async () => {
  const { page, errors, close } = await openPage("/index.html", { width: 390, height: 844 });
  try {
    await ready(page);
    for (const id of ["#cat-agents", "#cat-websites", "#cat-ecommerce", "#cat-delivery", "#footer"]) {
      await page.evaluate((s) => AX.landing.scrollTo(s, { immediate: true }), id);
      await page.waitForTimeout(150);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390, "overflow near " + id);
    }
    const vp = await page.evaluate(() => { const v = document.querySelector("#cat-websites .rail-viewport"); return [v.scrollWidth, v.clientWidth, getComputedStyle(v).overflowX]; });
    assert.ok(vp[0] > vp[1] && vp[2] === "auto", "rail scrolls inside its container: " + vp);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});
