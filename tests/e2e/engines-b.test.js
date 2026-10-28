"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { openPage } = require("../helpers/browser");
const URL_ = "/tests/fixtures/engines-b.html";
const RM = { reducedMotion: true };

async function drag(page, from, to, steps) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(from.x + 8, from.y, { steps: 2 });
  await page.mouse.move(to.x, to.y, { steps: steps || 8 });
  await page.mouse.up();
}

test("chat.play renders scripted messages in order and fires onEvent", async () => {
  const { page, errors, close } = await openPage(URL_, RM);
  try {
    await page.evaluate(() => window.__chat.play("t1"));
    const texts = await page.locator("#chat .cht-msg .cht-text").allInnerTexts();
    const idx = ["Hello Priya", "Whitefield", "Shall I book", "Booked for Saturday"].map((s) => texts.findIndex((t) => t.includes(s)));
    assert.ok(idx.every((i) => i >= 0), JSON.stringify(texts));
    assert.deepEqual(idx.slice().sort((a, b) => a - b), idx);
    assert.deepEqual(await page.evaluate(() => window.__events), [{ ev: "booked", thread: "t1" }]);
    assert.equal(await page.locator("#chat .cht-typing").count(), 0);
    assert.ok(await page.locator("#chat .side-probe").isVisible());
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("chat themes, typing indicator, chips and composer", async () => {
  const { page, errors, close } = await openPage(URL_);
  try {
    await page.locator("#chat .cht-thread").nth(0).click();
    await page.waitForFunction(() => getComputedStyle(document.querySelector("#chat .cht-head")).backgroundColor === "rgb(7, 94, 84)");
    await page.locator("#chat .cht-thread").nth(1).click();
    await page.waitForFunction(() => getComputedStyle(document.querySelector("#chat .cht-head")).backgroundImage.indexOf("gradient") >= 0);
    await page.locator("#chat .cht-thread").nth(0).click();
    const played = page.evaluate(() => window.__chat.play("t1"));
    await page.locator("#chat .cht-typing").waitFor();
    assert.equal(await page.locator("#chat .cht-typing i").count(), 3);
    await page.locator("#chat .cht-chip", { hasText: "Whitefield" }).waitFor();
    await page.locator("#chat .cht-chip", { hasText: "Whitefield" }).click();
    await page.locator("#chat .cht-msg.from-user", { hasText: "Whitefield" }).first().waitFor();
    await page.locator("#chat .cht-thread").nth(1).click();
    await page.fill("#chat .cht-input", "Hello there");
    await page.press("#chat .cht-input", "Enter");
    await page.locator("#chat .cht-msg", { hasText: "AI reply (simulated)" }).waitFor({ timeout: 4000 });
    await played;
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("flow.run marks all nodes visited and logs", async () => {
  const { page, errors, close } = await openPage(URL_, RM);
  try {
    assert.equal(await page.locator("#flow .fl-node").count(), 6);
    assert.ok((await page.locator("#flow svg path.fl-edge").count()) >= 6);
    await page.evaluate(() => window.__flow.run());
    assert.equal(await page.locator("#flow .fl-node.visited").count(), 6);
    assert.ok((await page.locator("#flow .fl-log li").count()) >= 6);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("flow node can be dragged", async () => {
  const { page, close } = await openPage(URL_, RM);
  try {
    const n = page.locator("#flow .fl-node").first();
    await n.scrollIntoViewIfNeeded();
    const b0 = await n.boundingBox();
    await page.mouse.move(b0.x + 20, b0.y + 10);
    await page.mouse.down();
    await page.mouse.move(b0.x + 60, b0.y + 40, { steps: 5 });
    await page.mouse.up();
    const b1 = await n.boundingBox();
    assert.ok(Math.abs(b1.x - b0.x - 40) < 3 && Math.abs(b1.y - b0.y - 30) < 3, JSON.stringify([b0, b1]));
  } finally { await close(); }
});

test("pipeline blocks at gate, approve resumes, cost meter updates", async () => {
  const { page, errors, close } = await openPage(URL_, RM);
  try {
    assert.ok((await page.locator("#pipe .pl-cost").innerText()).includes("$0.00 / $5"));
    await page.evaluate(() => window.__pipe.start());
    const btn = page.getByRole("button", { name: "Approve" });
    await btn.waitFor({ timeout: 4000 });
    assert.equal(await page.locator("#pipe .pl-stage.st-blocked").count(), 1);
    await btn.click();
    await page.locator("#pipe .pl-stage.st-done").nth(2).waitFor({ timeout: 4000 });
    assert.ok((await page.locator("#pipe .pl-cost").innerText()).includes("$0.70"));
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("dragging a tape booking onto an occupied range errors and keeps position", async () => {
  const { page, errors, close } = await openPage(URL_, RM);
  try {
    const bar = page.locator('#tape .tp-bar[data-id="b1"]');
    await bar.scrollIntoViewIfNeeded();
    const b = await bar.boundingBox();
    const target = await page.locator('#tape .tp-row[data-unit="102"] .tp-cells').boundingBox();
    const cell = target.width / 14;
    // b1 = unit 101 days 0-1; move to unit 102 day 3 (b2 occupies days 2..4)
    await drag(page, { x: b.x + 10, y: b.y + b.height / 2 }, { x: target.x + cell * 3 + 10, y: target.y + target.height / 2 });
    await page.locator(".toast-err", { hasText: "That room is already booked for those nights" }).first().waitFor();
    await page.locator('#tape .tp-row[data-unit="101"] .tp-bar[data-id="b1"]').waitFor();
    assert.equal(await page.evaluate(() => window.__changes.length), 0);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("tape move to free room and resize right edge call onChange", async () => {
  const { page, errors, close } = await openPage(URL_, RM);
  try {
    const bar = page.locator('#tape .tp-bar[data-id="b1"]');
    await bar.scrollIntoViewIfNeeded();
    const b = await bar.boundingBox();
    const t201 = await page.locator('#tape .tp-row[data-unit="201"] .tp-cells').boundingBox();
    const cell = t201.width / 14;
    await drag(page, { x: b.x + 10, y: b.y + b.height / 2 }, { x: t201.x + cell * 5 + 10, y: t201.y + t201.height / 2 });
    await page.locator('#tape .tp-row[data-unit="201"] .tp-bar[data-id="b1"]').waitFor();
    let ch = await page.evaluate(() => window.__changes);
    assert.equal(ch.length, 1);
    assert.equal(ch[0].unit, "201"); assert.equal(ch[0].start, "2026-11-06"); assert.equal(ch[0].nights, 2);
    const hb = await page.locator('#tape .tp-bar[data-id="b1"] .tp-handle').boundingBox();
    await drag(page, { x: hb.x + hb.width / 2, y: hb.y + hb.height / 2 }, { x: hb.x + hb.width / 2 + cell, y: hb.y + hb.height / 2 }, 5);
    await page.waitForFunction(() => window.__changes.length === 2);
    ch = await page.evaluate(() => window.__changes);
    assert.equal(ch[1].nights, 3); assert.equal(ch[1].start, "2026-11-06");
    await page.locator('#tape .tp-bar[data-id="b2"]').click();
    assert.deepEqual(await page.evaluate(() => window.__opened), ["b2"]);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("month calendar drop calls onDrop", async () => {
  const { page, close } = await openPage(URL_, RM);
  try {
    const ev = page.locator('#month .cal-ev[data-id="e1"]');
    await ev.scrollIntoViewIfNeeded();
    const e = await ev.boundingBox();
    const day = await page.locator('#month .cal-day[data-date="2026-11-12"]').boundingBox();
    await drag(page, { x: e.x + 8, y: e.y + e.height / 2 }, { x: day.x + day.width / 2, y: day.y + day.height / 2 });
    await page.waitForFunction(() => window.__drops.length === 1);
    assert.deepEqual(await page.evaluate(() => window.__drops[0]), { id: "e1", date: "2026-11-12" });
  } finally { await close(); }
});

test("store: filter, product drawer, cart, checkout, confirmation", async () => {
  const { page, errors, close } = await openPage(URL_, RM);
  try {
    assert.equal(await page.locator("#store .st-card").count(), 3);
    await page.locator("#store .st-cat", { hasText: "Textiles" }).click();
    await page.waitForFunction(() => document.querySelectorAll("#store .st-card").length === 1);
    await page.locator("#store .st-cat", { hasText: "All" }).click();
    await page.waitForFunction(() => document.querySelectorAll("#store .st-card").length === 3);
    await page.locator("#store .st-card", { hasText: "Brass Lamp" }).locator(".st-open").click();
    const dr = page.locator(".ov-drawer");
    await dr.waitFor();
    await dr.locator("select").selectOption("Large");
    await dr.getByRole("button", { name: "Add to cart" }).click();
    await page.evaluate(() => AX.ui.closeAll());
    assert.equal(await page.evaluate(() => window.__store.cart().length), 1);
    await page.locator("#store .st-cart-btn").click();
    await page.locator(".ov-drawer").getByText("₹1,416").first().waitFor();
    await page.locator(".ov-drawer").getByRole("button", { name: "Checkout" }).click();
    await page.locator(".ov-drawer .st-in-name").fill("Test Buyer");
    await page.locator(".ov-drawer .st-in-phone").fill("+91 98xxx x0000");
    await page.locator(".ov-drawer .st-in-address").fill("12 Sample Road");
    await page.getByRole("button", { name: "Place order (simulated)" }).click();
    await page.locator(".ov-drawer .st-done").waitFor();
    assert.match(await page.locator(".ov-drawer .st-order-id").innerText(), /AX-\d+/);
    await page.locator(".toast-sim").first().waitFor();
    assert.equal(await page.evaluate(() => window.__store.cart().length), 0);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("store quote mode calls onAdd", async () => {
  const { page, close } = await openPage(URL_, RM);
  try {
    await page.locator("#quote .st-card", { hasText: "Wall Plate" }).locator(".st-open").click();
    await page.getByRole("button", { name: "Add to quotation" }).click();
    assert.deepEqual(await page.evaluate(() => window.__quote), [{ id: "p3", qty: 1 }]);
    assert.equal(await page.locator("#quote .st-cart-btn").count(), 0);
  } finally { await close(); }
});

test("no horizontal page overflow at 390", async () => {
  const { page, close } = await openPage(URL_, { width: 390, height: 800, reducedMotion: true });
  try {
    const o = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert.ok(o <= 0, "overflow " + o);
  } finally { await close(); }
});

test("chat: chip click mid-delay does not drop a scripted item or its event", async () => {
  const { page, errors, close } = await openPage(URL_);
  try {
    await page.evaluate(() => {
      window.__ev2 = [];
      const h = document.createElement("div"); h.id = "chat2"; document.body.appendChild(h);
      window.__c2 = AX.chat.create(h, { threads: [{ id: "q", name: "Q", channel: "web", messages: [] }],
        scripts: { q: [
          { from: "ai", text: "Hello first", delay: 50, chips: ["Go"] },
          { from: "ai", text: "Middle line", delay: 2500 },
          { from: "ai", text: "Booked now", delay: 50, event: "booked" }] },
        onEvent: (ev) => window.__ev2.push(ev) });
      window.__pd = false;
      window.__c2.play("q").then(() => { window.__pd = true; });
    });
    await page.locator("#chat2 .cht-chip", { hasText: "Go" }).click();      // inside the 2.5s delay of "Middle line"
    await page.fill("#chat2 .cht-input", "interjection");
    await page.press("#chat2 .cht-input", "Enter");
    await page.waitForFunction(() => window.__pd === true, null, { timeout: 8000 });
    const texts = await page.locator("#chat2 .cht-msg .cht-text").allInnerTexts();
    const idx = ["Hello first", "Middle line", "Booked now"].map((s) => texts.findIndex((t) => t.includes(s)));
    assert.ok(idx.every((i) => i >= 0) && idx[0] < idx[1] && idx[1] < idx[2], JSON.stringify(texts));
    assert.ok(texts.includes("Go") && texts.includes("interjection"));
    assert.deepEqual(await page.evaluate(() => window.__ev2), ["booked"]);
    assert.equal(errors.length, 0, errors.join(" "));
  } finally { await close(); }
});

test("destroying chat or flow mid-run resolves the pending promises", async () => {
  const { page, close } = await openPage(URL_);
  try {
    const r = await page.evaluate(async () => {
      const h = document.createElement("div"); document.body.appendChild(h);
      const c = AX.chat.create(h, { threads: [{ id: "x", name: "X", channel: "web", messages: [] }],
        scripts: { x: [{ from: "ai", text: "a", delay: 60000 }, { from: "ai", text: "b" }] } });
      const f = document.createElement("div"); document.body.appendChild(f);
      const fl = AX.flow.create(f, { nodes: [{ id: "a", kind: "trigger", label: "A", x: 0, y: 0 }, { id: "b", kind: "end", label: "B", x: 220, y: 0 }], edges: [["a", "b"]] });
      let cd = false, fd = false;
      c.play("x").then(() => { cd = true; });
      fl.run().then(() => { fd = true; });
      await new Promise((r) => setTimeout(r, 50));
      h.__axDestroy(); f.__axDestroy();
      await new Promise((r) => setTimeout(r, 50));
      return { cd, fd, msgs: h.querySelectorAll(".cht-msg").length };
    });
    assert.deepEqual(r, { cd: true, fd: true, msgs: 0 });
  } finally { await close(); }
});

test("pipeline approve keeps a cost-blocked stage's pending log lines", async () => {
  const { page, close } = await openPage(URL_, RM);
  try {
    const lines = await page.evaluate(async () => {
      const h = document.createElement("div"); document.body.appendChild(h);
      const p = AX.pipeline.create(h, { cap: 0.1, stages: [{ id: "a", label: "A", ms: 300, cost: 1, log: ["line-one", "line-two"] }] });
      p.start();
      await new Promise((r) => setTimeout(r, 170));   // cost block at 150ms; line-two still pending (200ms)
      p.approve();
      await new Promise((r) => setTimeout(r, 500));
      return Array.from(h.querySelectorAll(".pl-log li")).map((n) => n.textContent);
    });
    assert.ok(lines.includes("line-one") && lines.includes("line-two"), JSON.stringify(lines));
  } finally { await close(); }
});

test("chat: two rapid sends without play pick distinct scripted replies; event fires once", async () => {
  const { page, errors, close } = await openPage(URL_, RM);
  try {
    const r = await page.evaluate(async () => {
      const ev = [];
      const h = document.createElement("div"); document.body.appendChild(h);
      const c = AX.chat.create(h, { threads: [{ id: "q", name: "Q", channel: "web", messages: [] }],
        scripts: { q: [{ from: "ai", text: "reply-one" }, { from: "ai", text: "reply-two", event: "booked" }, { from: "ai", text: "reply-three" }] },
        onEvent: (e) => ev.push(e) });
      await Promise.all([c.send("q", "hi"), c.send("q", "again")]);
      await c.play("q");
      return { ev, texts: Array.from(h.querySelectorAll(".cht-msg .cht-text")).map((n) => n.textContent) };
    });
    assert.deepEqual(r.ev, ["booked"]);
    assert.equal(r.texts.filter((t) => t === "reply-one").length, 1);
    assert.equal(r.texts.filter((t) => t === "reply-two").length, 1);
    assert.equal(r.texts.filter((t) => t === "reply-three").length, 1);
    assert.equal(errors.length, 0, errors.join(" "));
  } finally { await close(); }
});
