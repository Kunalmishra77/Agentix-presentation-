"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { openPage } = require("../helpers/browser");

async function sweep(slug, opts) {
  const { page, errors, close } = await openPage("/index.html#/demo/" + slug + "/walkthrough", Object.assign({ reducedMotion: true }, opts));
  await page.waitForSelector(".ax-app");
  return { page, errors, close };
}
async function openModule(page, id) {
  if (await page.locator(".ax-menu-btn").isVisible()) {
    if (!(await page.locator(".ax-app.sheet-open").count())) await page.click(".ax-menu-btn");
  }
  await page.click('.ax-nav-item[data-id="' + id + '"]');
  await page.waitForSelector('[data-module-ready][data-module="' + id + '"]');
}
async function setRole(page, role) {
  await page.selectOption(".ax-role select", role);
}
/** Embedded third-party frames are aborted when the module is left; that is not an app error. */
const clean = (errs) => errs.filter((e) => !/ERR_ABORTED/.test(e));
async function walkAll(slug, minModules) {
  const { page, errors, close } = await sweep(slug);
  try {
    const ids = await page.$$eval(".ax-nav-item[data-id]", (n) => n.map((x) => x.getAttribute("data-id")));
    assert.ok(ids.length >= minModules, slug + " has " + ids.length + " modules");
    for (const id of ids) {
      await openModule(page, id);
      const txt = await page.textContent('[data-module-ready][data-module="' + id + '"]');
      assert.ok(txt.trim().length > 40, id + " text length " + txt.trim().length);
      assert.equal(await page.locator("[data-module-error]").count(), 0, id + " rendered without error");
    }
    assert.deepEqual(clean(errors), []);
  } finally { await close(); }
}
const noOverflow = (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

/* ======================= REDUX ======================= */
test("redux: every module renders", () => walkAll("redux", 15));

test("redux: approving the quote in the portal adds a 'Quote approved' WhatsApp row to the outbox, a job and an advance invoice", async () => {
  const { page, errors, close } = await sweep("redux");
  try {
    await openModule(page, "outbox");
    assert.equal(await page.locator('.tbl tbody tr:has-text("Quote approved")').count(), 0);
    await openModule(page, "portal");
    await page.click("[data-approve-quote]");
    await page.waitForSelector("[data-approved]");
    await openModule(page, "outbox");
    await page.waitForSelector('.tbl tbody tr:has-text("Quote approved")');
    const row = page.locator('.tbl tbody tr:has-text("Quote approved"):has-text("WhatsApp")');
    assert.equal(await row.count(), 1);
    assert.match(await row.textContent(), /Hotel Kesar Palace/);
    await openModule(page, "jobs");
    await page.waitForSelector('.bd-col[data-col="scheduled"] .bd-card[data-id="JOB-5209"]');
    await openModule(page, "invoices");
    await page.fill(".tbl-search", "Kesar");
    await page.waitForSelector('.tbl tbody tr:has-text("Advance 50%")');
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test("redux: surveyor app shows 'Offline — 3 items queued' and Sync clears it", async () => {
  const { page, errors, close } = await sweep("redux");
  try {
    await openModule(page, "survey-app");
    assert.match(await page.textContent("[data-sync-banner]"), /Offline — 3 items queued/);
    await page.click("[data-sync]");
    await page.waitForSelector('[data-sync-banner="online"]');
    assert.match(await page.textContent("[data-sync-banner]"), /Online — all synced/);
    await page.waitForSelector(".toast-sim");
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test("redux: quote follows the survey and 18% GST; a 10% discount needs approval before sending", async () => {
  const { page, errors, close } = await sweep("redux");
  try {
    await openModule(page, "quotes");
    const t0 = +(await page.getAttribute("[data-quote-totals]", "data-quote-totals"));
    const expected = await page.evaluate(() => {
      const d = AX.data.redux, lines = [];
      d.survey.bathrooms.forEach((b) => b.fittings.forEach((f) => { const r = d.rc(f.type, f.finish); lines.push({ price: r.redux, market: r.market }); }));
      return AX.redux.quoteTotals(lines, 0).total;
    });
    assert.equal(t0, expected);
    await page.selectOption('select[aria-label="Discount"]', "10");
    await page.waitForSelector("[data-approve-discount]");
    assert.equal(await page.locator("[data-send-quote]").isDisabled(), true);
    const t10 = +(await page.getAttribute("[data-quote-totals]", "data-quote-totals"));
    assert.ok(t10 < t0 * 0.92 && t10 > t0 * 0.88, "10% off: " + t0 + " -> " + t10);
    await page.click("[data-approve-discount]");
    await page.waitForSelector("[data-send-quote]:not([disabled])");
    // switching a fitting to Replace in the surveyor app raises the quote
    await openModule(page, "survey-app");
    await page.click('[data-fit="f1"] [data-rec="Replace"]');
    await openModule(page, "quotes");
    const t2 = +(await page.getAttribute("[data-quote-totals]", "data-quote-totals"));
    assert.ok(t2 > t10, "replace costs more: " + t10 + " -> " + t2);
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test("redux: website enquiry creates a routed lead with an SLA chip and a WhatsApp row", async () => {
  const { page, errors, close } = await sweep("redux");
  try {
    await openModule(page, "leads");
    const before = await page.locator('.bd-col[data-col="new"] .bd-card').count();
    await page.click("[data-add-enquiry]");
    await page.waitForFunction((b) => document.querySelectorAll('.bd-col[data-col="new"] .bd-card').length === b + 1, before);
    const first = page.locator('.bd-col[data-col="new"] .bd-card >> nth=0');
    assert.match(await first.textContent(), /SLA \d+:\d\d left/);
    assert.match(await first.textContent(), /→/);
    // an already breached lead exists
    assert.ok((await page.locator(".rx-sla.late").count()) >= 1);
    await openModule(page, "outbox");
    await page.waitForSelector('.tbl tbody tr:has-text("Enquiry received")');
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test("redux: moving a job on the board logs a WhatsApp job update; 390px fits", async () => {
  const { page, errors, close } = await sweep("redux");
  try {
    await openModule(page, "jobs");
    const id = await page.getAttribute('.bd-col[data-col="scheduled"] .bd-card >> nth=0', "data-id");
    await page.focus('.bd-col[data-col="scheduled"] .bd-card >> nth=0');
    await page.keyboard.press("m");
    await page.click(".bd-menu-item >> text=Dismantled");
    await page.waitForSelector('.bd-col[data-col="dismantled"] .bd-card[data-id="' + id + '"]');
    await openModule(page, "outbox");
    await page.waitForSelector('.tbl tbody tr:has-text("Job update")');
    assert.deepEqual(errors, []);
  } finally { await close(); }
  const m = await sweep("redux", { width: 390, height: 800 });
  try {
    for (const id of ["journey", "leads", "survey-app", "quotes", "portal", "outbox"]) {
      await openModule(m.page, id);
      assert.equal(await noOverflow(m.page), true, id + " fits at 390");
    }
  } finally { await m.close(); }
});
