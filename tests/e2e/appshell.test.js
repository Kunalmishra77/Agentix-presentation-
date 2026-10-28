"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { openPage } = require("../helpers/browser");
const URL_ = "/tests/fixtures/appshell.html";
const READY = "[data-module-ready]";

test("sidebar items render modules and update the hash", async () => {
  const { page, errors, close } = await openPage(URL_);
  try {
    await page.waitForSelector(READY);
    for (const id of ["table", "custom", "dashboard"]) {
      await page.click('.ax-nav-item[data-id="' + id + '"]');
      await page.waitForSelector('[data-module-ready][data-module="' + id + '"]');
      const txt = await page.textContent(READY);
      assert.ok(txt.trim().length > 0, id + " has text");
      await page.waitForFunction((i) => location.hash === "#/m/" + i, id);
      assert.equal(await page.locator(READY).count(), 1, "previous module root removed");
    }
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test("table row opens drawer, dashboard has kpis and chart", async () => {
  const { page, close } = await openPage(URL_);
  try {
    await page.waitForSelector('[data-module-ready][data-module="dashboard"] .kpis');
    assert.ok(await page.locator('[data-module="dashboard"] svg').count() > 0);
    await page.click('.ax-nav-item[data-id="table"]');
    await page.click(".tbl-wrap tbody tr");
    await page.waitForSelector(".fx-drawer");
  } finally { await close(); }
});

test("open(unknown) falls back to start module and fixes the hash", async () => {
  const { page, close } = await openPage(URL_ + "#/m/nope");
  try {
    await page.waitForSelector('[data-module-ready][data-module="dashboard"]');
    await page.evaluate(() => window.__app.open("table"));
    await page.waitForSelector('[data-module-ready][data-module="table"]');
    await page.evaluate(() => window.__app.open("nope"));
    await page.waitForSelector('[data-module-ready][data-module="dashboard"]');
    await page.waitForFunction(() => location.hash === "#/m/dashboard");
  } finally { await close(); }
});

test("language toggle re-renders and role switcher filters modules", async () => {
  const { page, close } = await openPage(URL_);
  try {
    await page.click('.ax-nav-item[data-id="custom"]');
    await page.waitForSelector(".fx-custom");
    assert.equal(await page.textContent(".fx-custom"), "Hello custom");
    await page.click('.ax-lang [data-lang="hi"]');
    await page.waitForFunction(() => document.querySelector(".fx-custom") && document.querySelector(".fx-custom").textContent === "नमस्ते");
    await page.selectOption(".ax-role select", "Sales");
    await page.waitForSelector('.ax-nav-item[data-id="table"]');
    await page.selectOption(".ax-role select", "Ops");
    await page.waitForFunction(() => !document.querySelector('.ax-nav-item[data-id="table"]'));
    await page.fill(".ax-search input", "dash");
    await page.waitForFunction(() => document.querySelectorAll(".ax-nav-item").length === 1);
  } finally { await close(); }
});

test("at 390px the sidebar is hidden and the menu button opens it", async () => {
  const { page, close } = await openPage(URL_, { width: 390, height: 800 });
  try {
    await page.waitForSelector(READY);
    assert.equal(await page.locator(".ax-side").isVisible(), false);
    await page.click(".ax-menu-btn");
    await page.waitForFunction(() => { const r = document.querySelector(".ax-side").getBoundingClientRect(); return r.width > 0 && r.top < innerHeight - 50; });
    await page.click('.ax-nav-item[data-id="custom"]');
    await page.waitForSelector('[data-module-ready][data-module="custom"]');
    await page.waitForFunction(() => !document.querySelector(".ax-side").getBoundingClientRect().width);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  } finally { await close(); }
});
