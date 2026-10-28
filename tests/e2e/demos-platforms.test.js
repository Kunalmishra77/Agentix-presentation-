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

/* ======================= YOUR HAIR COMPANY ======================= */
async function takeScan(page, picks) {
  await openModule(page, "scan");
  for (let i = 0; i < 4; i++) {
    await page.waitForSelector('[data-scan-q="' + i + '"]');
    await page.click('[data-opt="' + picks[i] + '"]');
  }
  await page.waitForSelector("[data-scan-result]");
}

test("yhc: every module renders", () => walkAll("yhc", 16));

test("yhc: scan funnel runs 4 questions, a progress mesh, then a stage and density that match the rules", async () => {
  const { page, errors, close } = await sweep("yhc");
  try {
    await takeScan(page, [1, 1, 2, 1]);
    const expected = await page.evaluate(() => AX.yhc.scanResult({ pattern: 1, duration: 1, family: 2, lifestyle: 1 }));
    assert.equal(await page.getAttribute("[data-scan-result]", "data-scan-result"), expected.label);
    assert.equal(+(await page.getAttribute("[data-scan-result]", "data-density")), expected.density);
    assert.match(await page.textContent("[data-scan-result]"), /Simulated analysis/);
    assert.ok(expected.density < 96 && expected.stage >= 2);
    const worse = await page.evaluate(() => AX.yhc.scanResult({ pattern: 3, duration: 2, family: 3, lifestyle: 2 }));
    assert.ok(worse.stage > expected.stage && worse.density < expected.density);
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test("yhc: customer books a ₹500 consult, doctor sees it on the calendar, Send plan creates the sales lead", async () => {
  const { page, errors, close } = await sweep("yhc");
  try {
    await takeScan(page, [1, 1, 2, 1]);
    await page.click("[data-goto-book]");
    await page.waitForSelector('[data-module-ready][data-module="book"]');
    assert.equal(await page.locator("[data-pay]").isDisabled(), true, "pay is disabled until a slot is chosen");
    await page.fill("[data-book-name]", "Kabir Testwala");
    await page.locator(".yh-slot:not([disabled]) >> nth=0").click();
    await page.waitForSelector("[data-pay]:not([disabled])");
    assert.match(await page.textContent("[data-module-ready]"), /₹500/);
    await page.click("[data-pay]");
    await page.waitForSelector("[data-booking-confirmed]");
    const bid = await page.getAttribute("[data-booking-confirmed]", "data-booking-confirmed");
    assert.equal(await page.evaluate((id) => document.querySelector(".ax-app").__axApp.ctx.state.get().yhc.bookings.some((b) => b.id === id && b.name === "Kabir Testwala" && b.paid === 500 && b.scan.label), bid), true);

    await setRole(page, "Doctor");
    await page.click('.ax-nav-item[data-id="doctor-calendar"]');
    await page.waitForSelector('[data-module-ready][data-module="doctor-calendar"]');
    if (!(await page.locator('.cal-ev:has-text("Kabir Testwala")').count())) await page.click("[data-cal-next]");
    await page.waitForSelector('.cal-ev:has-text("Kabir Testwala")');
    await page.click('.cal-ev:has-text("Kabir Testwala")');
    await page.click(".ov-foot >> text=Open consult room");
    await page.waitForSelector('[data-module-ready][data-module="consult"]');
    assert.match(await page.textContent(".yh-card:has-text('Intake summary')"), /Kabir Testwala/);
    await page.click("[data-join]");
    await page.waitForSelector('[data-video="live"]');
    await page.click("[data-send-plan]");
    await page.waitForSelector(".toast-err");
    await page.check('[data-med="mnx"]');
    await page.check('[data-med="bio"]');
    await page.click("[data-send-plan]");
    await page.waitForSelector("[data-send-plan][disabled]");
    assert.match(await page.textContent('[data-module-ready][data-module="consult"]'), /Plan delivered/);

    await setRole(page, "Sales");
    await page.click('.ax-nav-item[data-id="sales-leads"]');
    await page.waitForSelector('.bd-col[data-col="plan"] .bd-card:has-text("Kabir Testwala")');
    assert.equal(await page.locator('.bd-col[data-col="booked"] .bd-card:has-text("Kabir Testwala")').count(), 0);

    await setRole(page, "Doctor");
    await page.click('.ax-nav-item[data-id="patients"]');
    await page.fill(".tbl-search", "Kabir");
    await page.waitForSelector('.tbl tbody tr:has-text("Kabir Testwala")');
    await setRole(page, "Admin");
    await page.click('.ax-nav-item[data-id="audit"]');
    await page.waitForSelector('.tbl tbody tr:has-text("Prescription signed")');
    await setRole(page, "Customer");
    await page.click('.ax-nav-item[data-id="account"]');
    await page.waitForSelector("[data-plan]");
    assert.match(await page.textContent("[data-plan]"), /Minoxidil/);
    assert.deepEqual(clean(errors), []);
  } finally { await close(); }
});

test("yhc: role switcher limits the sidebar to that role's modules", async () => {
  const { page, close } = await sweep("yhc");
  try {
    await setRole(page, "Doctor");
    const ids = await page.$$eval(".ax-nav-item[data-id]", (n) => n.map((x) => x.getAttribute("data-id")));
    assert.deepEqual(ids.sort(), ["consult", "doctor-calendar", "followups", "patients", "revenue"]);
    await setRole(page, "Sales");
    assert.deepEqual((await page.$$eval(".ax-nav-item[data-id]", (n) => n.map((x) => x.getAttribute("data-id")))).sort(), ["care", "sales-leads"]);
  } finally { await close(); }
});

test("yhc: refill care sequence pauses for customer confirmation and continues on Approve; a follow-up can be closed", async () => {
  const { page, close } = await sweep("yhc");
  try {
    await openModule(page, "care");
    await page.click(".pl-actions button:has-text(\"Start\")");
    await page.waitForSelector(".pl-approve", { timeout: 20000 });
    assert.match(await page.textContent(".pl-stage.st-blocked"), /Day 28/);
    await page.click(".pl-approve");
    await page.waitForFunction(() => document.querySelectorAll(".pl-stage.st-done").length === 6, null, { timeout: 20000 });
    await openModule(page, "followups");
    const before = await page.locator('.tbl tbody tr:has(.yh-pill.info)').count();
    assert.ok(before > 0);
    await page.click('.tbl tbody tr:has(.yh-pill.info) >> nth=0 >> text=Mark done');
    await page.waitForFunction((n) => document.querySelectorAll('.tbl tbody tr .yh-pill.info').length === n - 1, before);
  } finally { await close(); }
});

test("yhc: 390px fits", async () => {
  const m = await sweep("yhc", { width: 390, height: 800 });
  try {
    for (const id of ["scan", "book", "account", "consult", "doctor-calendar", "sales-leads"]) {
      await openModule(m.page, id);
      assert.equal(await noOverflow(m.page), true, id + " fits at 390");
    }
  } finally { await m.close(); }
});
