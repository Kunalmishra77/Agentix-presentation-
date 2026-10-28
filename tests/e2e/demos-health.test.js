"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { openPage } = require("../helpers/browser");
const RM = { reducedMotion: true };

async function openDemo(slug, opts) {
  const r = await openPage("/index.html#/demo/" + slug + "/walkthrough", Object.assign({}, RM, opts));
  await r.page.waitForSelector(".ax-app [data-module-ready]", { timeout: 15000 });
  return r;
}

async function walkEveryModule(page, errors) {
  const ids = await page.$$eval(".ax-nav-item", (ns) => ns.map((n) => n.getAttribute("data-id")));
  assert.ok(ids.length >= 7, "modules found: " + ids.join(","));
  for (const id of ids) {
    await page.click('.ax-nav-item[data-id="' + id + '"]');
    await page.waitForSelector('[data-module-ready][data-module="' + id + '"]');
    const len = await page.$eval('[data-module="' + id + '"]', (n) => n.textContent.trim().length);
    assert.ok(len > 40, id + " text length " + len);
    assert.equal(await page.locator("[data-module-error]").count(), 0, id + " rendered an error");
  }
  assert.deepEqual(errors, []);
  return ids;
}

/* ------------------------------ agentix-hims ------------------------------ */
test("agentix-hims: every module renders", async () => {
  const { page, errors, close } = await openDemo("agentix-hims");
  try {
    const ids = await walkEveryModule(page, errors);
    for (const m of ["journey", "doctor", "nurse", "emergency", "lab", "pharmacy", "beds", "ot", "bloodbank", "billing", "coo", "secretary", "cmo", "patient", "audit"]) {
      assert.ok(ids.includes(m), "module " + m);
    }
    assert.ok((await page.locator(".ax-role option").count()) >= 13, "role switcher lists roles");
  } finally { await close(); }
});

test("agentix-hims: journey reaches Discharge after AB-PMJAY approval", async () => {
  const { page, errors, close } = await openDemo("agentix-hims");
  try {
    await page.waitForSelector("[data-journey] .pl-stage");
    await page.click("[data-journey] .btn-primary");
    await page.locator("[data-journey] .pl-approve").waitFor({ timeout: 15000 });
    assert.ok(/Billing/.test(await page.locator('.pl-stage.st-blocked').innerText()));
    await page.click("[data-journey] .pl-approve");
    await page.locator('.pl-stage[data-id="discharge"].st-done').waitFor({ timeout: 15000 });
    assert.equal(await page.locator(".pl-stage.st-done").count(), 6);
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test("agentix-hims: nurse table shows NEWS2 12 for the seeded row and re-scores in the drawer", async () => {
  const { page, close } = await openDemo("agentix-hims");
  try {
    await page.click('.ax-nav-item[data-id="nurse"]');
    await page.waitForSelector('[data-module-ready][data-module="nurse"] tbody tr');
    const row = page.locator("tbody tr", { hasText: "Ramesh K." });
    assert.equal(await row.locator(".news2-badge").getAttribute("data-news2"), "12");
    assert.ok(/Fictional demo data/.test(await page.locator(".hx-note").first().innerText()));
    await row.click();
    await page.locator(".ov-panel .news2-badge").first().waitFor();
    assert.equal(await page.locator(".ov-panel .news2-badge").first().getAttribute("data-news2"), "12");
    await page.fill('.ov-panel input[aria-label="SpO2"]', "97");
    await page.waitForFunction(() => document.querySelector(".ov-panel .news2-badge").getAttribute("data-news2") === "9");
  } finally { await close(); }
});

test("agentix-hims: doctor sees the interaction alert and Sign fires a simulated toast", async () => {
  const { page, close } = await openDemo("agentix-hims");
  try {
    await page.click('.ax-nav-item[data-id="doctor"]');
    await page.waitForSelector("[data-interaction]");
    const t = await page.locator("[data-interaction]").innerText();
    assert.ok(/Clopidogrel/.test(t) && /Omeprazole/.test(t), t);
    await page.click("[data-swap]");
    await page.waitForFunction(() => !document.querySelector("[data-interaction]"));
    await page.click("[data-sign]");
    await page.locator(".toast-sim").first().waitFor();
    assert.ok(/Simulated/.test(await page.locator(".toast-sim").first().innerText()));
  } finally { await close(); }
});

test("agentix-hims: secretary renders at least 10 districts, bar chart and fraud alerts", async () => {
  const { page, close } = await openDemo("agentix-hims");
  try {
    await page.click('.ax-nav-item[data-id="secretary"]');
    await page.waitForSelector('[data-module-ready][data-module="secretary"] [data-secretary-table] tbody tr');
    assert.ok((await page.locator("[data-secretary-table] tbody tr").count()) >= 10);
    assert.ok((await page.locator('[data-module="secretary"] svg rect.ch-bar').count()) >= 10);
    assert.ok((await page.locator("[data-fraud]").count()) >= 3);
  } finally { await close(); }
});

test("agentix-hims: beds grid, emergency board and role switcher", async () => {
  const { page, close } = await openDemo("agentix-hims");
  try {
    await page.click('.ax-nav-item[data-id="beds"]');
    await page.waitForSelector(".hx-bed.vacant");
    const before = await page.locator("[data-occupancy]").innerText();
    await page.locator(".hx-bed.vacant").first().click();
    await page.click(".ov-foot .btn-primary");
    await page.waitForFunction((b) => document.querySelector("[data-occupancy]").textContent !== b, before);
    await page.click('.ax-nav-item[data-id="emergency"]');
    await page.waitForSelector('.bd-col[data-col="esi1"] .bd-card');
    assert.equal(await page.locator(".bd-col").count(), 5);
    await page.selectOption(".ax-role select", "Nurse");
    await page.waitForFunction(() => !document.querySelector('.ax-nav-item[data-id="beds"]'));
  } finally { await close(); }
});

test("agentix-hims: no horizontal overflow at 390px", async () => {
  const { page, errors, close } = await openDemo("agentix-hims", { width: 390, height: 800 });
  try {
    for (const id of ["journey", "doctor", "nurse", "beds", "secretary", "patient"]) {
      await page.evaluate((i) => document.querySelector(".ax-app").__axApp.open(i), id);
      await page.waitForSelector('[data-module-ready][data-module="' + id + '"]');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, id + " overflows");
    }
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

/* ------------------------------ umang-hims ------------------------------ */
test("umang-hims: every module renders", async () => {
  const { page, errors, close } = await openDemo("umang-hims");
  try {
    const ids = await walkEveryModule(page, errors);
    for (const m of ["register", "reception", "nurse", "doctor", "billing", "pharmacy", "tracker", "reports"]) assert.ok(ids.includes(m), "module " + m);
  } finally { await close(); }
});

async function openCard(page, uhid) {
  await page.locator('.bd-card[data-id="' + uhid + '"]').click();
  await page.locator(".ov-foot .btn-primary").waitFor();
}

test("umang-hims: form registration -> reception -> doctor -> pharmacy -> tracker shows Medicines ready", async () => {
  const { page, errors, close } = await openDemo("umang-hims");
  try {
    await page.waitForSelector('[data-module-ready][data-module="register"] form');
    await page.fill("#um-name", "Sunita Mehta");
    await page.fill("#um-age", "46");
    await page.fill("#um-phone", "98xxx x4321");
    await page.click("[data-register-submit]");
    const uhid = (await page.locator("[data-uhid]").first().innerText()).trim();
    assert.match(uhid, /^UH-26-\d{5}$/);
    await page.click('.ax-nav-item[data-id="reception"]');
    await page.waitForSelector('[data-module-ready][data-module="reception"] .bd-card');
    assert.equal(await page.locator('.bd-col[data-col="registered"] .bd-card[data-id="' + uhid + '"]').count(), 1);
    for (const col of ["waiting", "nurse", "doctor", "billing", "pharmacy"]) {
      await openCard(page, uhid);
      await page.click(".ov-foot .btn-primary");
      await page.locator('.bd-col[data-col="' + col + '"] .bd-card[data-id="' + uhid + '"]').waitFor();
    }
    await page.click('.ax-nav-item[data-id="pharmacy"]');
    await page.waitForSelector('[data-module-ready][data-module="pharmacy"] .bd-card');
    for (const col of ["preparing", "ready"]) {
      await openCard(page, uhid);
      await page.click(".ov-foot .btn-primary");
      await page.locator('.bd-col[data-col="' + col + '"] .bd-card[data-id="' + uhid + '"]').waitFor();
    }
    await page.click('.ax-nav-item[data-id="tracker"]');
    await page.waitForSelector('[data-module-ready][data-module="tracker"] [data-tracker-status]');
    await page.selectOption("[data-tracker-select]", uhid);
    await page.waitForFunction(() => /Medicines ready/.test(document.querySelector("[data-tracker-status]").textContent));
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test("umang-hims: Asha voice agent registers a patient with a UHID", async () => {
  const { page, errors, close } = await openDemo("umang-hims");
  try {
    await page.waitForSelector('[data-module-ready][data-module="register"] form');
    await page.click('[data-reg-tab="asha"]');
    await page.waitForSelector(".cht-thread.chan-voice");
    await page.click("[data-asha-start]");
    await page.locator("[data-asha-done] [data-uhid]").waitFor({ timeout: 15000 });
    assert.match((await page.locator("[data-asha-done] [data-uhid]").innerText()).trim(), /^UH-26-\d{5}$/);
    assert.ok((await page.locator(".um-wave i").count()) >= 8, "waveform bars");
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test("umang-hims: nurse vitals and doctor consult complete into billing; language toggle flips labels", async () => {
  const { page, errors, close } = await openDemo("umang-hims");
  try {
    await page.click('.ax-nav-item[data-id="nurse"]');
    await page.waitForSelector('[data-module-ready][data-module="nurse"] form');
    const nums = page.locator(".ax-form input[type=number]");
    for (const [i, v] of [["0", "122"], ["1", "80"], ["2", "78"], ["3", "37.2"], ["4", "98"]].map(([a, b]) => [+a, b])) await nums.nth(i).fill(v);
    await page.click("button[type=submit]");
    await page.locator(".ax-form-result [data-vitals-done]").waitFor();
    await page.click('.ax-nav-item[data-id="doctor"]');
    await page.waitForSelector('[data-module-ready][data-module="doctor"] [data-consult]');
    await page.click("[data-add-rx]");
    await page.click("[data-complete-consult]");
    await page.waitForFunction(() => /Billing|बिलिंग/.test(document.querySelector("[data-consult-done]") ? document.querySelector("[data-consult-done]").textContent : ""));
    await page.click('.ax-nav-item[data-id="billing"]');
    await page.waitForSelector('[data-module-ready][data-module="billing"] [data-bill]');
    await page.click("[data-pay]");
    await page.locator("[data-paid]").waitFor();
    // language
    const before = await page.locator(".ax-title").innerText();
    await page.click('.ax-lang [data-lang="hi"]');
    await page.waitForFunction(() => /[ऀ-ॿ]/.test(document.querySelector(".ax-title").textContent));
    assert.notEqual(await page.locator(".ax-title").innerText(), before);
    assert.ok(/[ऀ-ॿ]/.test(await page.locator('.ax-nav-item[data-id="reception"]').innerText()));
    await page.click('.ax-nav-item[data-id="reception"]');
    await page.waitForSelector('[data-module-ready][data-module="reception"] .bd-col');
    assert.ok(/[ऀ-ॿ]/.test(await page.locator(".bd-col").first().getAttribute("aria-label")));
    await page.click('.ax-lang [data-lang="en"]');
    await page.waitForFunction(() => !/[ऀ-ॿ]/.test(document.querySelector(".ax-title").textContent));
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test("umang-hims: no horizontal overflow at 390px", async () => {
  const { page, errors, close } = await openDemo("umang-hims", { width: 390, height: 800 });
  try {
    for (const id of ["register", "reception", "nurse", "doctor", "billing", "tracker", "reports"]) {
      await page.evaluate((i) => document.querySelector(".ax-app").__axApp.open(i), id);
      await page.waitForSelector('[data-module-ready][data-module="' + id + '"]');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, id + " overflows");
    }
    assert.deepEqual(errors, []);
  } finally { await close(); }
});
