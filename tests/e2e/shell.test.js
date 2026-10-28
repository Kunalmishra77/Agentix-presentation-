"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { openPage, serverUrl } = require("../helpers/browser");

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
    await page.click('.shell .tab[data-tab=how]');
    await page.waitForFunction(() => location.hash === "#/demo/agentix/how");
    assert.ok((await page.locator(".shell .flow-step").count()) >= 3);
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => location.hash === "#/");
    // hash is updated synchronously by location.replace; hashchange (which hides the shell) fires later, so wait for the state itself
    await page.locator("#shell").waitFor({ state: "hidden" });
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

test("history: tab switch replaces; Back from tech returns home in one step", async () => {
  const { page, errors, close } = await openPage("/index.html#/");
  try {
    await page.evaluate(() => AX.shell.open("agentix"));
    await page.waitForSelector(".shell .cap-group");
    await page.click(".shell .tab[data-tab=tech]");
    await page.waitForFunction(() => location.hash === "#/demo/agentix/tech");
    await page.goBack();
    await page.waitForFunction(() => location.hash === "#/");
    // hash is updated synchronously by location.replace; hashchange (which hides the shell) fires later, so wait for the state itself
    await page.locator("#shell").waitFor({ state: "hidden" });
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("Esc after opening from home goes back (no extra history entry)", async () => {
  const { page, close } = await openPage("/index.html#/");
  try {
    const before = await page.evaluate(() => history.length);
    await page.evaluate(() => AX.shell.open("agentix"));
    await page.waitForSelector(".shell .cap-group");
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => location.hash === "#/");
    await page.waitForFunction((n) => history.length <= n + 1, before);
    await page.goForward();
    await page.waitForFunction(() => location.hash.startsWith("#/demo"));
  } finally { await close(); }
});

test("stale overlays: lightbox + Back, reopen, one Esc closes shell", async () => {
  const { page, close } = await openPage("/index.html#/");
  try {
    await page.evaluate(() => AX.shell.open("agentix", "screens"));
    await page.click(".shell .shot");
    await page.waitForSelector(".lightbox");
    await page.goBack();
    await page.waitForFunction(() => location.hash === "#/");
    // hash is updated synchronously by location.replace; hashchange (which hides the shell) fires later, so wait for the state itself
    await page.locator("#shell").waitFor({ state: "hidden" });
    await page.evaluate(() => AX.shell.open("agentix"));
    await page.waitForSelector(".shell .cap-group");
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => location.hash === "#/");
    // hash is updated synchronously by location.replace; hashchange (which hides the shell) fires later, so wait for the state itself
    await page.locator("#shell").waitFor({ state: "hidden" });
  } finally { await close(); }
});

test("walkthrough mounts once (loaded and cold)", async () => {
  const stub = () => { window.__m = 0; document.addEventListener("DOMContentLoaded", () => { AX.appShell = { mount(w) { window.__m++; w.textContent = "mounted"; } }; }); };
  // cold: deep link, demo not yet loaded
  let r = await openPage("/index.html#/");
  try {
    await r.page.addInitScript(stub);
    await r.page.goto(serverUrl + "/index.html#/demo/agentix/walkthrough");
    await r.page.reload();
    await r.page.waitForFunction(() => window.__m >= 1);
    await r.page.waitForTimeout(400);
    assert.equal(await r.page.evaluate(() => window.__m), 1);
  } finally { await r.close(); }
  // warm: demo already loaded via overview, then switch tab
  r = await openPage("/index.html#/");
  try {
    await r.page.addInitScript(stub);
    await r.page.reload();
    await r.page.evaluate(() => AX.shell.open("agentix"));
    await r.page.waitForFunction(() => AX.demos && AX.demos.agentix);
    await r.page.click(".shell .tab[data-tab=walkthrough]");
    await r.page.waitForTimeout(400);
    assert.equal(await r.page.evaluate(() => window.__m), 1);
  } finally { await r.close(); }
});

test("a11y: dialog role, focus inside shell, landing inert, focus restored", async () => {
  const { page, close } = await openPage("/index.html#/");
  try {
    await page.evaluate(() => {
      const b = document.createElement("button"); b.id = "opener"; b.textContent = "open";
      document.getElementById("landing").appendChild(b); b.focus();
    });
    await page.evaluate(() => AX.shell.open("agentix"));
    await page.waitForSelector(".shell .cap-group");
    assert.equal(await page.evaluate(() => document.getElementById("shell").contains(document.activeElement)), true);
    assert.equal(await page.getAttribute("#shell", "role"), "dialog");
    assert.equal(await page.getAttribute("#shell", "aria-modal"), "true");
    assert.equal(await page.evaluate(() => document.getElementById("landing").inert), true);
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => location.hash === "#/");
    assert.equal(await page.evaluate(() => document.activeElement.id), "opener");
    assert.equal(await page.evaluate(() => document.getElementById("landing").inert), false);
  } finally { await close(); }
});

test("lightbox close restores focus to the shot", async () => {
  const { page, close } = await openPage("/index.html#/demo/agentix/screens");
  try {
    await page.waitForSelector(".shell .shot");
    await page.focus(".shell .shot");
    await page.keyboard.press("Enter");
    await page.waitForSelector(".lightbox");
    await page.keyboard.press("Escape");
    await page.waitForSelector(".lightbox", { state: "detached" });
    assert.equal(await page.evaluate(() => document.activeElement.classList.contains("shot")), true);
  } finally { await close(); }
});
