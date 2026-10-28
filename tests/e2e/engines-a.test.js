"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { openPage } = require("../helpers/browser");

test("table search reduces rows", async () => {
  const { page, errors, close } = await openPage("/tests/fixtures/engines.html");
  try {
    await page.waitForSelector("#t tbody tr");
    const before = await page.locator("#t tbody tr").count();
    await page.fill("#t .tbl-search", "zzzz");
    assert.equal(await page.locator("#t tbody tr").count(), 0);
    assert.ok(await page.getByText("No matching records").first().isVisible());
    await page.fill("#t .tbl-search", "priya");
    const after = await page.locator("#t tbody tr").count();
    assert.ok(after > 0 && after < before, before + " -> " + after);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("dragging a board card calls onMove", async () => {
  const { page, errors, close } = await openPage("/tests/fixtures/engines.html");
  try {
    await page.waitForSelector("#b .bd-card");
    await page.locator("#b").scrollIntoViewIfNeeded();
    const card = page.locator("#b .bd-col").nth(0).locator(".bd-card").first();
    const target = page.locator("#b .bd-col").nth(1);
    const cb = await card.boundingBox(), tb = await target.boundingBox();
    await page.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2);
    await page.mouse.down();
    await page.mouse.move(cb.x + cb.width / 2 + 20, cb.y + cb.height / 2 + 5, { steps: 3 });
    await page.mouse.move(tb.x + tb.width / 2, tb.y + 40, { steps: 8 });
    await page.mouse.up();
    const moves = await page.evaluate(() => window.__onMove);
    assert.equal(moves.length, 1);
    assert.equal(moves[0].to, "qualified");
    assert.equal(await page.locator("#b .bd-col").nth(1).locator(".bd-card").count(), 3);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("click without drag opens, kpis render 4 tiles, charts render svg", async () => {
  const { page, errors, close } = await openPage("/tests/fixtures/engines.html");
  try {
    await page.waitForSelector("#k .kpi");
    assert.equal(await page.locator("#k .kpi").count(), 4);
    assert.ok((await page.locator("#c svg").count()) >= 5);
    await page.locator("#b .bd-card").first().click();
    assert.equal(await page.evaluate(() => window.__onOpen.length), 1);
    assert.equal(await page.evaluate(() => window.__onMove.length), 0);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("setCards mid-drag cancels the drag cleanly; a new drag still works", async () => {
  const { page, errors, close } = await openPage("/tests/fixtures/engines.html");
  try {
    await page.locator("#b").scrollIntoViewIfNeeded();
    const card = page.locator("#b .bd-col").nth(0).locator(".bd-card").first();
    const cb = await card.boundingBox();
    await page.mouse.move(cb.x + 20, cb.y + 20);
    await page.mouse.down();
    await page.mouse.move(cb.x + 60, cb.y + 40, { steps: 4 });
    assert.equal(await page.locator(".bd-ghost").count(), 1);
    await page.evaluate(() => window.__board.setCards([
      { id: "n1", col: "new", title: "Fresh one" }, { id: "n2", col: "qualified", title: "Fresh two" }]));
    assert.equal(await page.locator(".bd-ghost").count(), 0);
    await page.mouse.up();
    assert.equal(await page.locator(".bd-ghost").count(), 0);
    assert.equal(await page.locator(".bd-col.drop").count(), 0);
    assert.equal(await page.evaluate(() => window.__onMove.length), 0);
    const c2 = await page.locator("#b .bd-col").nth(0).locator(".bd-card").first().boundingBox();
    const tb = await page.locator("#b .bd-col").nth(2).boundingBox();
    await page.mouse.move(c2.x + 20, c2.y + 20);
    await page.mouse.down();
    await page.mouse.move(c2.x + 40, c2.y + 30, { steps: 3 });
    await page.mouse.move(tb.x + tb.width / 2, tb.y + 40, { steps: 8 });
    await page.mouse.up();
    const moves = await page.evaluate(() => window.__onMove);
    assert.deepEqual(moves.map((m) => m.to), ["won"]);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("button inside a card fires its handler, not onOpen", async () => {
  const { page, errors, close } = await openPage("/tests/fixtures/engines.html");
  try {
    await page.locator("#b2 .card-btn").click();
    assert.deepEqual(await page.evaluate(() => window.__btn), ["z1"]);
    assert.equal(await page.evaluate(() => window.__onOpen2.length), 0);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("table keeps focus on sort header and pager after redraw", async () => {
  const { page, errors, close } = await openPage("/tests/fixtures/engines.html");
  try {
    await page.locator("#t .tbl-sort").nth(1).focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.evaluate(() => [].indexOf.call(document.querySelectorAll("#t .tbl-sort"), document.activeElement)), 1);
    await page.locator("#t .tbl-next").focus();
    await page.keyboard.press("Enter");
    assert.ok(await page.evaluate(() => document.activeElement.classList.contains("tbl-next")));
    assert.ok((await page.locator("#t .tbl-range").innerText()).startsWith("13"));
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});

test("chart guards: bad input never yields NaN", async () => {
  const { page, errors, close } = await openPage("/tests/fixtures/engines.html");
  try {
    const out = await page.evaluate(() => {
      const mk = () => document.body.appendChild(document.createElement("div"));
      const hosts = [];
      const run = (fn) => { const h = mk(); fn(h); hosts.push(h); };
      run((h) => AX.charts.gauge(h, { value: undefined, label: "x" }));
      run((h) => AX.charts.gauge(h, { value: NaN, label: "x" }));
      run((h) => AX.charts.funnel(h, { steps: [{ label: "a", value: 0 }, { label: "b", value: 5 }] }));
      run((h) => AX.charts.bar(h, { labels: ["a", "b", "c"], values: [-5, undefined, 10] }));
      run((h) => AX.charts.bar(h, { labels: ["a", "b"], values: [-5, 3], horizontal: true }));
      run((h) => AX.charts.spark(h, [4]));
      run((h) => AX.charts.line(h, { labels: ["a"], series: [{ name: "s", points: [1, 2, 3] }] }));
      return {
        nan: hosts.some((h) => /NaN|undefined|Infinity/.test(h.innerHTML)),
        dot: hosts[5].querySelectorAll("circle").length,
        title: hosts[6].querySelectorAll("title")[2].textContent
      };
    });
    assert.equal(out.nan, false);
    assert.equal(out.dot, 1);
    assert.ok(out.title.includes("3"), out.title);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});
