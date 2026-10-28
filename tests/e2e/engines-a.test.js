"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { openPage } = require("../helpers/browser");

test("table search reduces rows", async () => {
  const { page, errors, close } = await openPage("/tests/fixtures/engines.html");
  try {
    await page.waitForSelector("#t tbody tr");
    const before = await page.locator("#t tbody tr").count();
    await page.fill("#t .tbl-search", "zzzz");
    assert.equal(await page.locator("#t tbody tr").count(), 0);
    assert.ok(await page.getByText("No matching records").first().isVisible());
    await page.fill("#t .tbl-search", "priya");
    const after = await page.locator("#t tbody tr").count();
    assert.ok(after > 0 && after < before, before + " -> " + after);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("dragging a board card calls onMove", async () => {
  const { page, errors, close } = await openPage("/tests/fixtures/engines.html");
  try {
    await page.waitForSelector("#b .bd-card");
    await page.locator("#b").scrollIntoViewIfNeeded();
    const card = page.locator("#b .bd-col").nth(0).locator(".bd-card").first();
    const target = page.locator("#b .bd-col").nth(1);
    const cb = await card.boundingBox(), tb = await target.boundingBox();
    await page.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2);
    await page.mouse.down();
    await page.mouse.move(cb.x + cb.width / 2 + 20, cb.y + cb.height / 2 + 5, { steps: 3 });
    await page.mouse.move(tb.x + tb.width / 2, tb.y + 40, { steps: 8 });
    await page.mouse.up();
    const moves = await page.evaluate(() => window.__onMove);
    assert.equal(moves.length, 1);
    assert.equal(moves[0].to, "qualified");
    assert.equal(await page.locator("#b .bd-col").nth(1).locator(".bd-card").count(), 3);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("click without drag opens, kpis render 4 tiles, charts render svg", async () => {
  const { page, errors, close } = await openPage("/tests/fixtures/engines.html");
  try {
    await page.waitForSelector("#k .kpi");
    assert.equal(await page.locator("#k .kpi").count(), 4);
    assert.ok((await page.locator("#c svg").count()) >= 5);
    await page.locator("#b .bd-card").first().click();
    assert.equal(await page.evaluate(() => window.__onOpen.length), 1);
    assert.equal(await page.evaluate(() => window.__onMove.length), 0);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});
