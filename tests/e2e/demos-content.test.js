"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { openPage } = require("../helpers/browser");

const MODULES = {
  voicecrm: ["dashboard", "live-calls", "calls", "insights", "leads", "tasks", "reports", "exports", "employees"],
  socialpush: ["overview", "accounts", "composer", "posts", "calendar", "analytics", "comments", "assistant", "team"],
  "yt-automation": ["generate", "pipeline", "scenes", "characters", "approvals", "calendar", "library", "analytics", "brand", "prompts", "api", "logs", "health"],
};

async function openDemo(slug, o) {
  const ctx = await openPage("/index.html#/demo/" + slug + "/walkthrough", Object.assign({ reducedMotion: true }, o));
  await ctx.page.waitForSelector(".ax-app [data-module-ready]", { timeout: 15000 });
  return ctx;
}
async function go(page, id) {
  await page.evaluate(() => { const r = document.querySelector(".ax-app"); r && r.classList.remove("sheet-open"); });
  const sel = '.ax-nav-item[data-id="' + id + '"]';
  if (!(await page.locator(sel).isVisible())) await page.click(".ax-menu-btn");
  await page.click(sel);
  await page.waitForSelector('[data-module-ready][data-module="' + id + '"]', { timeout: 10000 });
}

for (const slug of Object.keys(MODULES)) {
  test(slug + ": every sidebar module renders content with no errors", async () => {
    const { page, errors, close } = await openDemo(slug);
    try {
      const ids = await page.$$eval(".ax-nav-item", (n) => n.map((x) => x.getAttribute("data-id")));
      assert.deepEqual(ids, MODULES[slug]);
      for (const id of ids) {
        await go(page, id);
        const txt = await page.textContent('[data-module-ready][data-module="' + id + '"]');
        assert.ok(txt.trim().length > 40, id + " text length " + txt.trim().length);
        assert.equal(await page.locator("[data-module-error]").count(), 0, id + " errored");
      }
      assert.deepEqual(errors, []);
    } finally { await close(); }
  });
}

test("voicecrm: live call transcripts grow and sentiment chips exist", async () => {
  const { page, close } = await openDemo("voicecrm");
  try {
    await go(page, "live-calls");
    assert.equal(await page.locator(".vc-call").count(), 3);
    const n0 = await page.locator(".vc-line").count();
    await page.waitForFunction((n) => document.querySelectorAll(".vc-line").length >= n + 3, n0, { timeout: 9000 });
    assert.ok(await page.locator(".vc-call .vc-sent").count() >= 3);
  } finally { await close(); }
});

test("voicecrm: call drawer shows transcript, summary, score, outcome", async () => {
  const { page, close } = await openDemo("voicecrm");
  try {
    await go(page, "calls");
    await page.click(".tbl-row");
    await page.waitForSelector(".ov-drawer .vc-transcript");
    const t = await page.textContent(".ov-drawer");
    for (const w of ["AI summary", "Sentiment", "Concern", "Outcome"]) assert.ok(t.includes(w), "drawer has " + w);
    assert.ok(/Hot|Warm|Cold/.test(t));
  } finally { await close(); }
});

test("voicecrm: lead drawer has stepper and WhatsApp send fires a sim toast", async () => {
  const { page, close } = await openDemo("voicecrm");
  try {
    await go(page, "leads");
    await page.click(".tbl-row");
    await page.waitForSelector(".ov-drawer .vc-stepper");
    await page.fill(".ov-drawer .vc-wa-input", "Namaste, following up on your enquiry.");
    await page.click(".ov-drawer .vc-wa-send");
    await page.waitForSelector(".toast-sim");
    assert.ok((await page.textContent(".toast-sim")).includes("WhatsApp"));
    assert.ok((await page.textContent(".ov-drawer .vc-wa-log")).includes("following up"));
  } finally { await close(); }
});

test("voicecrm: Export CSV downloads a real CSV of fictional rows", async () => {
  const { page, close } = await openDemo("voicecrm");
  try {
    await go(page, "exports");
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click(".vc-export")]);
    assert.match(dl.suggestedFilename(), /\.csv$/);
    const fs = require("node:fs");
    const body = fs.readFileSync(await dl.path(), "utf8");
    const lines = body.trim().split(/\r?\n/);
    assert.ok(lines.length > 15, "rows " + lines.length);
    assert.ok(/call_id/.test(lines[0]) && /phone/.test(lines[0]));
    assert.ok(/@example\.in|98xxx/.test(body));
  } finally { await close(); }
});

test("voicecrm: tasks board card moves between columns", async () => {
  const { page, close } = await openDemo("voicecrm");
  try {
    await go(page, "tasks");
    const first = page.locator('.bd-col[data-col="todo"] .bd-card').first();
    const before = await page.locator('.bd-col[data-col="done"] .bd-card').count();
    await first.focus();
    await page.keyboard.press("m");
    await page.click('.bd-menu-item:text("Done")');
    await page.waitForFunction((b) => document.querySelectorAll('.bd-col[data-col="done"] .bd-card').length === b + 1, before);
  } finally { await close(); }
});

test("socialpush: compose, toggle 3 platforms, schedule -> calendar + posts Queued->Publishing->Published", async () => {
  const { page, close } = await openDemo("socialpush");
  try {
    await go(page, "composer");
    await page.fill(".sp-text", "Diwali sale starts tonight - 3 reels, 1 offer. Link in bio!");
    await page.click(".sp-media >> nth=1");
    // default: none selected -> toggle exactly three
    for (const p of ["instagram", "youtube", "x"]) {
      const b = page.locator('.sp-plat[data-plat="' + p + '"]');
      if ((await b.getAttribute("aria-pressed")) !== "true") await b.click();
    }
    await page.waitForSelector('.sp-preview[data-plat="instagram"]');
    await page.waitForSelector('.sp-preview[data-plat="youtube"]');
    await page.waitForSelector('.sp-preview[data-plat="x"]');
    assert.equal(await page.locator(".sp-preview").count(), 3);
    assert.equal(await page.getAttribute('.sp-preview[data-plat="instagram"]', "data-ratio"), "4:5");
    assert.equal(await page.getAttribute('.sp-preview[data-plat="youtube"]', "data-ratio"), "9:16");
    assert.equal(await page.getAttribute('.sp-preview[data-plat="x"]', "data-ratio"), "16:9");
    await page.click(".sp-ai");
    await page.waitForFunction(() => document.querySelector(".sp-text").value.length > 60);
    await page.click(".sp-schedule");
    await page.waitForSelector(".toast-sim");
    await go(page, "calendar");
    await page.waitForSelector('.cal-ev[data-id^="new-"]');
    await go(page, "posts");
    const row = page.locator(".tbl-row", { hasText: "Diwali sale starts tonight" }).first();
    await row.waitFor();
    await page.waitForSelector(".tbl-row:has-text(\"Diwali sale starts tonight\") .sp-status");
    await page.waitForSelector('.tbl-row:has-text("Diwali sale starts tonight") .sp-status[data-status="Publishing"]', { timeout: 4000 });
    await page.waitForSelector('.tbl-row:has-text("Diwali sale starts tonight") .sp-status[data-status="Published"]', { timeout: 4000 });
  } finally { await close(); }
});

test("socialpush: accounts OAuth modal connects a platform; comments + assistant chat respond", async () => {
  const { page, close } = await openDemo("socialpush");
  try {
    await go(page, "accounts");
    assert.equal(await page.locator(".sp-acct").count(), 7);
    await page.click('.sp-acct[data-plat="pinterest"] .sp-connect');
    await page.waitForSelector(".ov-modal");
    await page.click(".ov-modal .sp-oauth-allow");
    await page.waitForSelector(".toast-sim");
    await go(page, "assistant");
    await page.fill(".cht-input", "Draft a LinkedIn post about our new reel");
    await page.click(".cht-send");
    await page.waitForFunction(() => document.querySelectorAll(".cht-msg").length >= 3);
  } finally { await close(); }
});

test("yt-automation: Generate -> pipeline blocks at Human QA; Approve -> Scheduled; cost <= $4", async () => {
  const { page, close } = await openDemo("yt-automation");
  try {
    await go(page, "generate");
    await page.fill("#yt-prompt, .ax-field textarea", "Krishna lifts Govardhan hill to save the village from the storm");
    await page.click(".ax-form button[type=submit]");
    await page.waitForSelector('[data-module="pipeline"] .pl-stage[data-id="qa"].st-blocked', { timeout: 20000 });
    const cost = await page.textContent(".pl-cost strong");
    const m = /\$([\d.]+) \/ \$([\d.]+)/.exec(cost);
    assert.ok(m, "cost text " + cost);
    assert.ok(+m[1] <= 4 && +m[2] <= 4, cost);
    assert.ok((await page.textContent(".pl-stage.st-blocked")).includes("Human QA"));
    await page.click(".pl-approve");
    await page.waitForSelector('.pl-stage[data-id="scheduled"].st-done', { timeout: 10000 });
    await go(page, "calendar");
    await page.waitForSelector(".cal-ev.tone-good, .cal-ev.tone-orange");
  } finally { await close(); }
});

test("yt-automation: scenes grid shows 6 keyframes; library plays sample.mp4", async () => {
  const { page, close } = await openDemo("yt-automation");
  try {
    await go(page, "scenes");
    assert.equal(await page.locator(".yt-scene img").count(), 6);
    await page.waitForFunction(() => [...document.querySelectorAll(".yt-scene img")].every((i) => i.complete && i.naturalWidth > 0));
    await go(page, "library");
    await page.click(".yt-vid.can-play .yt-play");
    await page.waitForSelector("video.yt-player");
    await page.waitForFunction(() => { const v = document.querySelector("video.yt-player"); return v && v.readyState >= 2 && v.duration > 5; }, null, { timeout: 10000 });
    assert.ok((await page.getAttribute("video.yt-player", "src")).endsWith("sample.mp4"));
  } finally { await close(); }
});

test("demos have no horizontal overflow at 390px", async () => {
  for (const slug of Object.keys(MODULES)) {
    const { page, close } = await openDemo(slug, { width: 390, height: 800 });
    try {
      for (const id of MODULES[slug]) {
        await go(page, id);
        const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        assert.ok(over <= 1, slug + "/" + id + " overflow " + over);
      }
    } finally { await close(); }
  }
});
