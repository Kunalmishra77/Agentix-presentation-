"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { openPage } = require("../helpers/browser");

async function walkAll(slug, minModules, opts) {
  const { page, errors, close } = await openPage("/index.html#/demo/" + slug + "/walkthrough", Object.assign({ reducedMotion: true }, opts));
  try {
    await page.waitForSelector("[data-module-ready]", { timeout: 15000 });
    if (opts && opts.width && opts.width < 500) {
      // mobile: open the sheet and visit a few modules, checking overflow each time
      const ids = await page.$$eval(".ax-nav-item", (b) => b.map((x) => x.getAttribute("data-id")));
      for (const id of ids.slice(0, 6)) {
        await page.evaluate((i) => document.querySelector('.ax-nav-item[data-id="' + i + '"]').click(), id);
        await page.waitForSelector('[data-module-ready][data-module="' + id + '"]');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, slug + "/" + id + " overflows at 390");
      }
      return { page, errors, close, ids };
    }
    const ids = await page.$$eval(".ax-nav-item", (b) => b.map((x) => x.getAttribute("data-id")));
    assert.ok(ids.length >= minModules, slug + " has " + ids.length + " modules");
    for (const id of ids) {
      await page.click('.ax-nav-item[data-id="' + id + '"]');
      await page.waitForSelector('[data-module-ready][data-module="' + id + '"]');
      const len = (await page.textContent('[data-module-ready][data-module="' + id + '"]')).trim().length;
      assert.ok(len > 40, slug + "/" + id + " text length " + len);
      assert.equal(await page.locator("[data-module-error]").count(), 0, slug + "/" + id + " errored");
    }
    return { page, errors, close, ids };
  } catch (e) { await close(); throw e; }
}

test("agentix: every module renders, Ritika booking flows to CRM, flow runs, campaign wizard", async () => {
  const { page, errors, close, ids } = await walkAll("agentix", 28);
  try {
    for (const id of ["dashboard", "conversations", "crm", "contacts", "leads", "campaigns", "templates", "flows", "segments", "winback", "referrals", "bookings", "tasks", "team", "knowledge", "ai-revenue", "copilot", "google-ads", "gbp", "local-rank", "roi", "analytics", "billing", "admin-clients", "bot-health", "ai-tokens", "meta-spend", "support"]) {
      assert.ok(ids.includes(id), "module " + id);
    }
    // 1. Ritika thread -> booked -> CRM
    await page.click('.ax-nav-item[data-id="conversations"]');
    await page.waitForSelector('[data-module-ready][data-module="conversations"] .cht-thread');
    await page.click('.cht-thread:has-text("Ritika S.")');
    await page.click('[data-action="play-thread"]');
    await page.waitForSelector('.cht-side :text("Booked")', { timeout: 10000 });
    await page.click('.ax-nav-item[data-id="crm"]');
    await page.waitForSelector('[data-module-ready][data-module="crm"] .bd-col[data-col="booked"] .bd-card:has-text("Ritika S.")');
    // 2. flows: run visits all nodes
    await page.click('.ax-nav-item[data-id="flows"]');
    await page.waitForSelector('[data-module-ready][data-module="flows"] .fl-run');
    const total = await page.locator(".fl-node").count();
    await page.click(".fl-run");
    await page.waitForFunction((n) => document.querySelectorAll(".fl-node.visited").length === n, total);
    // 3. campaign wizard
    await page.click('.ax-nav-item[data-id="campaigns"]');
    await page.waitForSelector('[data-module-ready][data-module="campaigns"] [data-action="wiz-next"]');
    await page.click('[data-action="wiz-next"]');
    await page.click('[data-action="wiz-next"]');
    await page.click('[data-action="wiz-launch"]');
    await page.waitForSelector(".camp-stats svg");
    await page.waitForSelector(".toast-sim");
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test("agentix at 390px has no horizontal overflow", async () => {
  const { page, close } = await walkAll("agentix", 0, { width: 390, height: 800 });
  await close();
});

test("socialflow: every module renders, follow-gate comment DM, profile score", async () => {
  const { page, errors, close, ids } = await walkAll("socialflow", 25);
  try {
    for (const id of ["inbox", "comment-dm", "rules", "sequences", "flows", "health", "contacts", "leads", "bookings", "campaigns", "products", "orders", "influencers", "ads", "studio", "calendar", "approvals", "design", "reels", "profile-score", "post-audit", "analytics", "knowledge", "team", "channels"]) {
      assert.ok(ids.includes(id), "module " + id);
    }
    await page.click('.ax-nav-item[data-id="inbox"]');
    await page.waitForSelector('[data-module-ready][data-module="inbox"] .cht-thread');
    await page.click(".sf-q");
    await page.waitForSelector(".kb-chip");
    await page.click('.ax-nav-item[data-id="comment-dm"]');
    await page.waitForSelector('[data-module-ready][data-module="comment-dm"] [data-action="post-comment"]');
    await page.fill("[data-field=comment]", "PRICE");
    await page.click('[data-action="post-comment"]');
    await page.waitForSelector(':text("Follow us to unlock the price")');
    await page.check("[data-field=follows]");
    await page.waitForSelector(".dm-msg:has-text('₹')");
    await page.click('.ax-nav-item[data-id="studio"]');
    await page.waitForSelector('[data-module-ready][data-module="studio"] form');
    await page.click("button[type=submit]");
    await page.waitForFunction(() => document.querySelectorAll(".cap-variant").length === 3);
    await page.click('.ax-nav-item[data-id="profile-score"]');
    await page.waitForSelector('[data-module-ready][data-module="profile-score"] svg');
    const g = await page.textContent('[data-module="profile-score"] .ch-center');
    assert.match(g, /\d+%/);
    assert.equal(await page.locator("[data-module=profile-score] .sub-score").count(), 8);
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test("socialflow at 390px has no horizontal overflow", async () => {
  const { page, close } = await walkAll("socialflow", 0, { width: 390, height: 800 });
  await close();
});
