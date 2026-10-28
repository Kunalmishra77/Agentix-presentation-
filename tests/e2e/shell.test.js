"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { openPage } = require("../helpers/browser");

test("unknown slug replaces to #/", async () => {
  const { page, errors, close } = await openPage("/index.html#/demo/does-not-exist");
  try {
    await page.waitForFunction(() => location.hash === "#/");
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("tech tab shows stack chips; badge and pill visible", async () => {
  const { page, errors, close } = await openPage("/index.html#/demo/agentix/tech");
  try {
    await page.waitForSelector(".shell .chip-stack");
    assert.ok((await page.locator(".shell .chip-stack").count()) > 3);
    assert.ok(await page.locator(".shell .agentix-badge").first().isVisible());
    assert.ok(await page.getByText("Demo data · Simulated").first().isVisible());
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("overview lists capability grid; tabs switch; Esc closes", async () => {
  const { page, errors, close } = await openPage("/index.html#/demo/agentix");
  try {
    await page.waitForSelector(".shell .cap-group");
    await page.click('.shell [role=tab][data-tab=how]');
    await page.waitForFunction(() => location.hash === "#/demo/agentix/how");
    assert.ok((await page.locator(".shell .flow-step").count()) >= 3);
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => location.hash === "#/");
    assert.equal(await page.locator("#shell").isHidden(), true);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("lightbox: Esc closes lightbox before shell", async () => {
  const { page, errors, close } = await openPage("/index.html#/demo/agentix/screens");
  try {
    await page.waitForSelector(".shell .shot");
    await page.click(".shell .shot");
    await page.waitForSelector(".lightbox");
    await page.keyboard.press("Escape");
    await page.waitForSelector(".lightbox", { state: "detached" });
    assert.match(await page.evaluate(() => location.hash), /demo\/agentix/);
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => location.hash === "#/");
  } finally { await close(); }
});

test("no horizontal overflow at 390", async () => {
  const { page, close } = await openPage("/index.html#/demo/agentix", { width: 390, height: 800 });
  try {
    await page.waitForSelector(".shell .cap-group");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= 390), true);
  } finally { await close(); }
});

test("delivery entry (no demo/embed) shows how-it-works in walkthrough", async () => {
  const { page, errors, close } = await openPage("/index.html#/demo/agentix");
  try {
    const slug = await page.evaluate(() => AX.projects.find((p) => !p.demo && !p.embed).slug);
    await page.evaluate((s) => { location.hash = "#/demo/" + s + "/walkthrough"; }, slug);
    await page.waitForSelector(".shell .flow-step");
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});
