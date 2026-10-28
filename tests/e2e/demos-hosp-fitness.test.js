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
    assert.deepEqual(errors, []);
  } finally { await close(); }
}

/* ---------------- Woodpecker PMS ---------------- */
test("woodpecker-pms: every module renders", () => walkAll("woodpecker-pms", 23));

test("woodpecker-pms: tape extend into a free night works, into an occupied one is rejected", async () => {
  const { page, errors, close } = await sweep("woodpecker-pms");
  try {
    await openModule(page, "tape");
    const bar = '.tp-bar[data-id="WP-10002"]';
    await page.waitForSelector(bar);
    assert.match(await page.textContent(bar + " .tp-bar-text"), /2 nights/);
    await page.focus(bar);
    await page.keyboard.press("Shift+ArrowRight");
    await page.waitForFunction((s) => /3 nights/.test(document.querySelector(s + " .tp-bar-text").textContent), bar);
    await page.focus(bar);
    await page.keyboard.press("Shift+ArrowRight");
    await page.waitForSelector(".toast-err");
    assert.match(await page.textContent(".toast-err"), /already booked/);
    assert.match(await page.textContent(bar + " .tp-bar-text"), /3 nights/);
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test("woodpecker-pms: new booking overlap gives an error toast", async () => {
  const { page, close } = await sweep("woodpecker-pms");
  try {
    await openModule(page, "new-booking");
    const today = await page.evaluate(() => AX.data["woodpecker-pms"].today);
    const start = await page.evaluate((t) => AX.calendar.addDays(t, 2), today); // inside WP-10002 on HK-101
    await page.fill('.ax-form input[type="text"] >> nth=0', "Test Guest");
    await page.selectOption(".ax-form select >> nth=0", "HK-101");
    await page.fill('.ax-form input[type="date"]', start);
    await page.fill('.ax-form input[type="number"]', "1");
    await page.click('.ax-form button[type="submit"]');
    await page.waitForSelector(".toast-err");
    assert.match(await page.textContent(".ax-form-result"), /not free/);
  } finally { await close(); }
});

test("woodpecker-pms: folio POS charge then GST invoice totals include GST", async () => {
  const { page, errors, close } = await sweep("woodpecker-pms");
  try {
    await openModule(page, "folio");
    const before = +(await page.getAttribute("[data-folio-total]", "data-folio-total"));
    await page.click("text=Add POS charge");
    await page.click("[data-pos-menu] li:has-text('Chicken Biryani') button");
    await page.click(".ov-foot >> text=Done");
    await page.waitForFunction((b) => +document.querySelector("[data-folio-total]").getAttribute("data-folio-total") > b, before);
    const after = +(await page.getAttribute("[data-folio-total]", "data-folio-total"));
    assert.ok(after >= before + 380, "POS 380 + tax added: " + before + " -> " + after);
    await page.click("text=Generate GST invoice");
    await page.waitForSelector("[data-invoice]");
    const txt = await page.textContent("[data-invoice]");
    assert.match(txt, /CGST @ 6%/);
    assert.match(txt, /SGST @ 6%/);
    assert.equal(+(await page.getAttribute("[data-invoice-total]", "data-invoice-total")), after);
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test("woodpecker-pms: booking engine reservation appears on the tape", async () => {
  const { page, errors, close } = await sweep("woodpecker-pms");
  try {
    await openModule(page, "booking-engine");
    await page.click("[data-be-rooms] li >> nth=0 >> button");
    await page.fill('input[aria-label="Guest name"]', "Zoya Engine");
    await page.click("text=Confirm & pay");
    await page.waitForSelector("[data-be-confirmed]");
    await openModule(page, "tape");
    await page.waitForSelector('.tp-bar:has-text("Zoya Engine")');
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test("woodpecker-pms: 390px has no horizontal overflow", async () => {
  const { page, close } = await sweep("woodpecker-pms", { width: 390, height: 800 });
  try {
    for (const id of ["dashboard", "folio", "pricing", "tape"]) {
      await openModule(page, id);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, id + " fits");
    }
  } finally { await close(); }
});

/* ---------------- Max Register ---------------- */
test("max-register: every module renders, Hindi is the default", async () => {
  const { page, close } = await sweep("max-register");
  try {
    assert.equal(await page.getAttribute('.ax-lang [data-lang="hi"]', "aria-pressed"), "true");
  } finally { await close(); }
  await walkAll("max-register", 18);
});

test("max-register: renew in 3 taps produces a receipt number MF/YYYY-YY/NNNNNN", async () => {
  const { page, errors, close } = await sweep("max-register");
  try {
    await openModule(page, "renew");
    const st = () => page.evaluate((id) => { const a = document.querySelector(".ax-app").__axApp.ctx; const m = a.state.get().mx.members.find((x) => x.id === id); return Math.round((Date.parse(m.paidTill) - Date.parse(a.data.today)) / 86400000); }, mid);
    const mid = await page.getAttribute("[data-member] >> nth=0", "data-member");
    const leftBefore = await st();
    assert.ok(leftBefore < 0, "first listed member is the most overdue: " + leftBefore);
    await page.click("[data-member] >> nth=0");
    await page.click("[data-plan] >> nth=1");
    await page.click('[data-mode="UPI"]');
    await page.waitForSelector("[data-receipt-no]");
    const no = (await page.textContent("[data-receipt-no]")).trim();
    assert.match(no, /^MF\/\d{4}-\d{2}\/\d{6}$/);
    assert.equal(no.slice(-6), "000123");
    const leftAfter = await st();
    assert.ok(leftAfter > leftBefore && leftAfter > 7, "days left increased into the green band: " + leftBefore + " -> " + leftAfter);
    const name = await page.evaluate((id) => document.querySelector(".ax-app").__axApp.ctx.state.get().mx.members.find((x) => x.id === id).name, mid);
    await openModule(page, "members");
    await page.fill(".tbl-search", name);
    await page.waitForSelector(".tbl tbody tr .mx-band.green");
    assert.equal(await page.locator(".tbl tbody tr .mx-band.red").count(), 0);
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test("max-register: advancing 3 days adds a WhatsApp reminder", async () => {
  const { page, close } = await sweep("max-register");
  try {
    await openModule(page, "reminders");
    const before = await page.locator('[data-rem="sent"]').count();
    for (let i = 0; i < 3; i++) await page.click("text=1 दिन आगे बढ़ाएँ");
    await page.waitForFunction((b) => document.querySelectorAll('[data-rem="sent"]').length > b, before);
    const sent = await page.locator('[data-rem="sent"]').allTextContents();
    assert.equal(sent.length, before + 1);
    assert.match(sent[sent.length - 1], /7 दिन पहले/);
    assert.ok(!sent.some((t) => /आखिरी 3 दिन/.test(t)), "last-3-days reminder not yet due");
  } finally { await close(); }
});

test("max-register: kiosk greets a valid member and alerts for an expired one", async () => {
  const { page, close } = await sweep("max-register");
  try {
    await page.click('.ax-lang [data-lang="en"]');
    await openModule(page, "kiosk");
    await page.click("[data-kiosk-scan]");
    await page.waitForSelector('[data-kiosk-result="good"]');
    assert.match(await page.textContent("[data-kiosk-result]"), /Namaste, \w+! 12 days left/);
    const expired = await page.evaluate(() => AX.data["max-register"].members[6].id);
    await page.selectOption('select[aria-label="Who is at the door"]', expired);
    await page.click("[data-kiosk-scan]");
    await page.waitForSelector('[data-kiosk-result="expired"]');
    assert.ok(await page.locator(".mx-result.bad").isVisible());
  } finally { await close(); }
});

test("max-register: leads board moves update the funnel; verify queue approves", async () => {
  const { page, close } = await sweep("max-register");
  try {
    await openModule(page, "leads");
    await page.waitForSelector("[data-funnel] svg");
    const before = await page.textContent("[data-funnel]");
    await page.focus('.bd-card[data-id="L-501"]');
    await page.keyboard.press("m");
    await page.click(".bd-menu-item >> text=जॉइन");
    await page.waitForFunction((b) => document.querySelector("[data-funnel]").textContent !== b, before);
    await page.waitForSelector('.bd-col[data-col="joined"] .bd-card[data-id="L-501"]');
    assert.equal(await page.locator('.bd-col[data-col="new"] .bd-card[data-id="L-501"]').count(), 0);
    await openModule(page, "verify");
    const n = await page.locator("[data-vcard]").count();
    await page.click("[data-vcard] >> nth=0 >> text=मंज़ूर");
    await page.waitForFunction((c) => document.querySelectorAll("[data-vcard]").length === c - 1, n);
  } finally { await close(); }
});

test("max-register: phone frame on desktop, full-bleed at 390 without overflow", async () => {
  const d = await sweep("max-register");
  try {
    const w = await d.page.evaluate(() => document.querySelector(".ax-app").getBoundingClientRect().width);
    assert.ok(w < 460, "desktop frame width " + w);
  } finally { await d.close(); }
  const m = await sweep("max-register", { width: 390, height: 800 });
  try {
    for (const id of ["today", "members", "renew", "leads", "kiosk"]) {
      await openModule(m.page, id);
      assert.equal(await m.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, id + " fits");
    }
  } finally { await m.close(); }
});

test("woodpecker-pms: tariff above 7,500 invoices at 9% + 9% and tax arithmetic adds up", async () => {
  const { page, errors, close } = await sweep("woodpecker-pms");
  try {
    const b = await page.evaluate(() => AX.data["woodpecker-pms"].bookings.find((x) => x.status === "checked-in" && x.tariff > 7500));
    assert.ok(b, "demo has an in-house booking above the 7,500 slab");
    await openModule(page, "folio");
    await page.selectOption('select[aria-label="In-house guest"]', b.id);
    await page.click("text=Add POS charge");
    await page.click("[data-pos-menu] li:has-text('Chicken Biryani') button");
    await page.click(".ov-foot >> text=Done");
    await page.click("text=Generate GST invoice");
    await page.waitForSelector("[data-invoice]");
    const txt = await page.textContent("[data-invoice]");
    assert.match(txt, /CGST @ 9%/);
    assert.match(txt, /SGST @ 9%/);
    const total = +(await page.getAttribute("[data-invoice-total]", "data-invoice-total"));
    const room = b.tariff * b.nights, pos = 380;
    const expectedTax = Math.round(room * 0.18) + Math.round(pos * 0.05);
    assert.equal(total - (room + pos), expectedTax, "invoice tax = room x 18% + POS x 5%");
    assert.deepEqual(errors, []);
  } finally { await close(); }
});
