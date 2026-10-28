"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { openPage } = require("../helpers/browser");

test("iframe to about:blank loads and stays live", async () => {
  const { page, errors, close } = await openPage("/tests/fixtures/embed.html?url=about:blank");
  try {
    await page.waitForFunction(() => window.__emb && window.__emb.status() === "live");
    assert.equal(await page.locator(".emb iframe").count(), 1);
    assert.equal(await page.locator(".emb-scroller").count(), 0);
    const f = page.locator(".emb iframe");
    assert.equal(await f.getAttribute("loading"), "lazy");
    assert.equal(await f.getAttribute("referrerpolicy"), "no-referrer-when-downgrade");
    assert.equal(await f.getAttribute("allow"), "camera; fullscreen");
    assert.ok((await page.locator(".emb .emb-url").innerText()).includes("about:blank"));
    assert.ok((await page.locator(".emb .agentix-badge").count()) >= 1);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("X-Frame-Options DENY falls back to scroller within 13s (default timeout)", async () => {
  const { page, close } = await openPage("/tests/fixtures/embed.html?url=" + encodeURIComponent("/__deny"));
  try {
    await page.locator(".emb-scroller").waitFor({ state: "visible", timeout: 13000 });
    assert.ok(await page.getByText("Preview — live site opens in the hosted portfolio").first().isVisible());
    assert.equal(await page.evaluate(() => window.__emb.status()), "fallback");
  } finally { await close(); }
});

test("no load before timeoutMs falls back to scroller", async () => {
  const { page, close } = await openPage("/tests/fixtures/embed.html?timeout=700&url=" + encodeURIComponent("/__hang"));
  try {
    await page.locator(".emb-scroller").waitFor({ state: "visible", timeout: 5000 });
  } finally { await close(); }
});

test("sim message from own iframe toasts; from elsewhere does not", async () => {
  const { page, errors, close } = await openPage("/tests/fixtures/embed.html?url=about:blank");
  try {
    await page.waitForFunction(() => window.__emb.status() === "live");
    await page.evaluate(() => window.postMessage({ ax: "sim", text: "from parent" }, "*"));
    await page.waitForTimeout(200);
    assert.equal(await page.locator(".toast-sim").count(), 0);
    const frame = page.frames().find((f) => f !== page.mainFrame());
    await frame.evaluate(() => parent.postMessage({ ax: "sim", text: "Simulated — form submitted" }, "*"));
    await page.locator(".toast-sim").first().waitFor();
    assert.ok((await page.locator(".toast-sim").first().innerText()).includes("form submitted"));
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("device toggle switches to 390px frame; external link opens in new tab", async () => {
  const { page, close } = await openPage("/tests/fixtures/embed.html?url=about:blank&external=1");
  try {
    await page.getByRole("button", { name: "Mobile" }).click();
    await page.waitForFunction(() => Math.round(document.querySelector(".emb-view").getBoundingClientRect().width) === 390);
    await page.getByRole("button", { name: "Desktop" }).click();
    await page.waitForFunction(() => document.querySelector(".emb-view").getBoundingClientRect().width > 390);
    const a = page.locator(".emb a.emb-open");
    assert.equal(await a.getAttribute("target"), "_blank");
    assert.equal(await a.getAttribute("rel"), "noopener");
  } finally { await close(); }
});

test("re-create on same host and removal clean up: one toast per message, none after removal", async () => {
  const { page, close } = await openPage("/tests/fixtures/embed.html?url=about:blank");
  try {
    await page.waitForFunction(() => window.__emb.status() === "live");
    await page.evaluate(() => { window.__emb = AX.embed.create(document.getElementById("e"), { url: "about:blank", title: "x" }); });
    await page.waitForFunction(() => window.__emb.status() === "live");
    const frames = page.frames().filter((f) => f !== page.mainFrame());
    assert.equal(frames.length, 1);
    await frames[0].evaluate(() => parent.postMessage({ ax: "sim", text: "once" }, "*"));
    await page.locator(".toast-sim").first().waitFor();
    await page.waitForTimeout(150);
    assert.equal(await page.locator(".toast-sim").count(), 1);
    await page.evaluate(() => document.getElementById("e").remove());
    await page.waitForTimeout(100);
    assert.equal(await page.evaluate(() => document.querySelectorAll(".emb").length), 0);
  } finally { await close(); }
});
