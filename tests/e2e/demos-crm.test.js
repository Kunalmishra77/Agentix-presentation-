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
async function go(page, id) {
  if (!(await page.locator('.ax-nav-item[data-id="' + id + '"]').isVisible())) await page.click(".ax-menu-btn");
  await page.click('.ax-nav-item[data-id="' + id + '"]');
  await page.waitForSelector('[data-module-ready][data-module="' + id + '"]');
}
async function walkEveryModule(page, errors) {
  const ids = await page.$$eval(".ax-nav-item", (ns) => ns.map((n) => n.getAttribute("data-id")));
  for (const id of ids) {
    await go(page, id);
    const len = await page.$eval('[data-module="' + id + '"]', (n) => n.textContent.trim().length);
    assert.ok(len > 40, id + " text length " + len);
    assert.equal(await page.locator("[data-module-error]").count(), 0, id + " rendered an error");
  }
  assert.deepEqual(errors, []);
  return ids;
}
async function kpiValue(page, label) {
  return page.locator(".kpi", { hasText: label }).first().locator(".kpi-value").innerText();
}
async function drag(page, fromSel, toSel) {
  const a = await page.locator(fromSel).boundingBox();
  const b = await page.locator(toSel).boundingBox();
  await page.mouse.move(a.x + a.width / 2, a.y + 12);
  await page.mouse.down();
  await page.mouse.move(a.x + a.width / 2 + 20, a.y + 30, { steps: 4 });
  await page.mouse.move(b.x + b.width / 2, b.y + 60, { steps: 8 });
  await page.mouse.up();
}

/* ------------------------------ agentix-crm ------------------------------ */
test("agentix-crm: every module renders", async () => {
  const { page, errors, close } = await openDemo("agentix-crm");
  try {
    const ids = await walkEveryModule(page, errors);
    for (const m of ["dashboard", "kanban", "clients", "leads", "insights-revenue", "insights-clients", "insights-stories", "insights-completion",
      "proposal-ai", "status-email", "announcements", "salary", "internal", "settings"]) assert.ok(ids.includes(m), "module " + m);
  } finally { await close(); }
});

test("agentix-crm: kanban shows red, amber and green deadline badges", async () => {
  const { page, close } = await openDemo("agentix-crm");
  try {
    await go(page, "kanban");
    await page.waitForSelector(".bd-card");
    for (const k of ["red", "amber", "green"]) assert.ok((await page.locator(".bd-card .ac-due." + k).count()) > 0, "badge " + k);
    assert.equal(await page.locator(".bd-col").count(), 4);
  } finally { await close(); }
});

test("agentix-crm: dragging a story to Done raises dashboard completion %", async () => {
  const { page, errors, close } = await openDemo("agentix-crm");
  try {
    const before = parseFloat(await kpiValue(page, "Completion"));
    await go(page, "kanban");
    const doneBefore = +(await page.locator('.bd-col[data-col="done"] .bd-count').innerText());
    const id = await page.locator('.bd-col[data-col="progress"] .bd-card').first().getAttribute("data-id");
    await drag(page, '.bd-col[data-col="progress"] .bd-card[data-id="' + id + '"]', '.bd-col[data-col="done"]');
    await page.waitForFunction((n) => +document.querySelector('.bd-col[data-col="done"] .bd-count').textContent === n + 1, doneBefore);
    await go(page, "dashboard");
    const after = parseFloat(await kpiValue(page, "Completion"));
    assert.ok(after > before, before + " -> " + after);
    assert.equal(after, Math.round(((doneBefore + 1) / 30) * 1000) / 10);
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test("agentix-crm: client drawer has invoice timeline, communications and stories", async () => {
  const { page, close } = await openDemo("agentix-crm");
  try {
    await go(page, "clients");
    await page.locator("#shell tbody tr").first().click();
    await page.locator(".ov-panel .ac-tl li").first().waitFor();
    assert.ok((await page.locator(".ov-panel .ac-tl li").count()) >= 3);
    assert.ok(/communications/i.test(await page.locator(".ov-panel").innerText()));
    assert.ok((await page.locator(".ov-panel .ac-story").count()) >= 1);
  } finally { await close(); }
});

test("agentix-crm: proposal analysis is labelled simulated and has scope, risks, price check", async () => {
  const { page, close } = await openDemo("agentix-crm");
  try {
    await go(page, "proposal-ai");
    await page.fill("textarea", "Scope: redesign website and build a WhatsApp booking bot. Unlimited revisions. Delivery ASAP within 2 weeks. Budget 50000.");
    await page.click(".ax-form button[type=submit]");
    await page.locator(".ac-out").waitFor();
    const t = await page.locator(".ac-out").innerText();
    assert.ok(/AI output \(simulated\)/.test(t));
    for (const s of ["Scope", "Risks", "Price check"]) assert.ok(t.includes(s), s);
    assert.ok(/Unlimited revisions/i.test(t));
  } finally { await close(); }
});

test("agentix-crm: status email draft", async () => {
  const { page, close } = await openDemo("agentix-crm");
  try {
    await go(page, "status-email");
    await page.selectOption("select >> nth=1", "Delayed");
    await page.click(".ax-form button[type=submit]");
    await page.locator(".ac-email").waitFor();
    const t = await page.locator(".ac-email").innerText();
    assert.ok(/Subject:/.test(t) && /delayed/i.test(t), t);
  } finally { await close(); }
});

test("agentix-crm: internal area is locked until Unlock demo", async () => {
  const { page, close } = await openDemo("agentix-crm");
  try {
    await go(page, "internal");
    assert.ok(/Co-founders only/.test(await page.locator('[data-module="internal"]').innerText()));
    assert.equal(await page.locator('[data-module="internal"] tbody tr').count(), 0);
    await page.click('#shell button:has-text("Unlock demo")');
    await page.locator('[data-module="internal"] tbody tr').first().waitFor();
    assert.ok((await page.locator('[data-module="internal"] tbody tr').count()) >= 5);
  } finally { await close(); }
});

test("agentix-crm: salary uses fictional round numbers and incentives", async () => {
  const { page, close } = await openDemo("agentix-crm");
  try {
    await go(page, "salary");
    const t = await page.locator('[data-module="salary"]').innerText();
    assert.ok(/Fictional/.test(t) && /Incentive/.test(t));
    assert.ok(/1,00,000/.test(t));
  } finally { await close(); }
});

test("agentix-crm: mobile has no horizontal overflow on the kanban", async () => {
  const { page, close } = await openDemo("agentix-crm", { width: 390, height: 800 });
  try {
    await go(page, "kanban");
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  } finally { await close(); }
});

test("agentix-crm: drawer primary button uses the brand accent; completion delta is data-driven", async () => {
  const { page, close } = await openDemo("agentix-crm");
  try {
    const delta = await page.locator(".kpi", { hasText: "Completion" }).locator(".kpi-delta").innerText();
    assert.ok(/[0-9]+%/.test(delta), delta);
    await go(page, "leads");
    await page.locator("#shell tbody tr").first().click();
    const bg = await page.locator(".ov-panel .ac-btn.primary").first().evaluate((n) => getComputedStyle(n).backgroundColor);
    assert.equal(bg, "rgb(11, 31, 51)");
  } finally { await close(); }
});

/* ------------------------------ eurobrass-crm ------------------------------ */
test("eurobrass-crm: every module renders", async () => {
  const { page, errors, close } = await openDemo("eurobrass-crm");
  try {
    const ids = await walkEveryModule(page, errors);
    for (const m of ["dashboard", "leads", "customers", "dealers", "dealer-portal", "products", "inventory", "quotations", "orders", "service",
      "employees", "roles", "analytics", "reports", "audit", "notifications"]) assert.ok(ids.includes(m), "module " + m);
  } finally { await close(); }
});

test("eurobrass-crm: no real customer names in the dataset", async () => {
  const { page, close } = await openDemo("eurobrass-crm");
  try {
    const s = await page.evaluate(() => JSON.stringify(AX.data["eurobrass-crm"]));
    for (const bad of ["Westin", "Lalit", "Medanta", "DMRC", "Taj", "Hyatt", "Marriott", "Oberoi", "Sarovar", "Meridian", "Hilton", "Radisson"]) assert.ok(!s.includes(bad), bad);
  } finally { await close(); }
});

test("eurobrass-crm: inventory low-stock filter narrows rows", async () => {
  const { page, close } = await openDemo("eurobrass-crm");
  try {
    await go(page, "inventory");
    await page.waitForSelector("#shell tbody tr");
    const all = await page.locator(".tbl-range").innerText();
    await page.selectOption('select[data-key="level"]', "Low stock");
    await page.waitForFunction((a) => document.querySelector(".tbl-range").textContent !== a, all);
    const rows = await page.locator("#shell tbody tr").count();
    assert.ok(rows >= 3);
    for (const r of await page.locator("#shell tbody tr td[data-label='Level']").allInnerTexts()) assert.ok(/Low stock/.test(r), r);
  } finally { await close(); }
});

test("eurobrass-crm: quotation with 2 products, GST 18%, send toast, convert to order", async () => {
  const { page, errors, close } = await openDemo("eurobrass-crm");
  try {
    await go(page, "quotations");
    await page.waitForSelector("[data-q-customer]");
    const cust = await page.locator("[data-q-customer] option").nth(1).innerText();
    await page.selectOption("[data-q-customer]", { index: 1 });
    const prods = await page.evaluate(() => AX.data["eurobrass-crm"].products.map((p) => ({ id: p.id, price: p.price })));
    const pick = [prods[0], prods[3]];
    const qty = [2, 3];
    for (let i = 0; i < 2; i++) {
      await page.selectOption("[data-q-product]", pick[i].id);
      await page.fill("[data-q-qty]", String(qty[i]));
      await page.click("[data-q-add]");
    }
    assert.equal(await page.locator(".q-line").count(), 2);
    const sub = pick[0].price * 2 + pick[1].price * 3, gst = Math.round(sub * 0.18), total = sub + gst;
    const fmt = (n) => "₹" + String(n).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
    assert.equal(await page.locator("[data-q-gst]").innerText(), fmt(gst));
    assert.equal(await page.locator("[data-q-total]").innerText(), fmt(total));
    assert.ok(/GST \(18%\)/.test(await page.locator(".q-preview").innerText()));

    await page.click("[data-q-whatsapp]");
    await page.locator(".toast-sim", { hasText: "WhatsApp" }).first().waitFor();
    await page.click("[data-q-email]");
    await page.locator(".toast-sim", { hasText: "Email" }).first().waitFor();

    await page.click("[data-q-convert]");
    const orderId = await page.locator("[data-q-converted]").getAttribute("data-order");
    assert.ok(/^ORD-/.test(orderId), orderId);
    await go(page, "orders");
    const row = page.locator("#shell tbody tr", { hasText: orderId });
    await row.waitFor();
    assert.ok((await row.innerText()).includes(cust));
    assert.ok((await row.innerText()).includes(fmt(total)));
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test("eurobrass-crm: catalogue Add to quotation lands in the quotation builder", async () => {
  const { page, close } = await openDemo("eurobrass-crm");
  try {
    await go(page, "products");
    await page.locator(".st-open").first().click();
    await page.locator(".st-add").click();
    await go(page, "quotations");
    await page.locator(".q-line").first().waitFor();
    assert.equal(await page.locator(".q-line").count(), 1);
  } finally { await close(); }
});

test("eurobrass-crm: service ticket assigned to a technician", async () => {
  const { page, close } = await openDemo("eurobrass-crm");
  try {
    await go(page, "service");
    await page.waitForSelector(".bd-card");
    const count = (col) => page.locator('.bd-col[data-col="' + col + '"] .bd-count').innerText().then(Number);
    const open0 = await count("open"), asg0 = await count("assigned");
    const tid = await page.locator('.bd-col[data-col="open"] .bd-card').first().getAttribute("data-id");
    await page.locator('.bd-col[data-col="open"] .bd-card').first().click();
    await page.locator(".ov-panel [data-tech]").waitFor();
    await page.selectOption(".ov-panel [data-tech]", { index: 1 });
    const tech = await page.locator(".ov-panel [data-tech]").inputValue();
    await page.click(".ov-panel [data-assign]");
    await page.locator(".toast-sim").first().waitFor();
    await page.waitForFunction(([c, n]) => +document.querySelector('.bd-col[data-col="' + c + '"] .bd-count').textContent === n, ["assigned", asg0 + 1]);
    assert.equal(await count("open"), open0 - 1);
    assert.ok((await page.locator('.bd-col[data-col="assigned"] .bd-card[data-id="' + tid + '"]').innerText()).includes(tech));
  } finally { await close(); }
});

test("eurobrass-crm: dealer portal shows orders, schemes and stock", async () => {
  const { page, close } = await openDemo("eurobrass-crm");
  try {
    await go(page, "dealer-portal");
    const t = await page.locator('[data-module="dealer-portal"]').innerText();
    for (const s of ["orders", "schemes", "stock"]) assert.ok(t.toLowerCase().includes(s), s);
  } finally { await close(); }
});

test("eurobrass-crm: mobile quotations has no horizontal overflow", async () => {
  const { page, close } = await openDemo("eurobrass-crm", { width: 390, height: 800 });
  try {
    await go(page, "quotations");
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  } finally { await close(); }
});

test("eurobrass-crm: drawer primary button uses the brass accent", async () => {
  const { page, close } = await openDemo("eurobrass-crm");
  try {
    await go(page, "dealers");
    await page.locator("#shell tbody tr").first().click();
    const bg = await page.locator(".ov-panel .eb-btn.primary").first().evaluate((n) => getComputedStyle(n).backgroundColor);
    assert.equal(bg, "rgb(140, 106, 62)");
  } finally { await close(); }
});
