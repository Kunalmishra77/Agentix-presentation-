"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScripts } = require("../helpers/load");

const g = loadScripts(["js/core/ax.js"]);

test("fmt.inr uses Indian grouping", () => {
  assert.equal(g.AX.fmt.inr(119999), "₹1,19,999");
  assert.equal(g.AX.fmt.inr(2999), "₹2,999");
});

test("fmt.pct", () => {
  assert.equal(g.AX.fmt.pct(12.44), "12.4%");
});

test("state set/get/on", () => {
  const s = g.AX.state({ a: 1 });
  let calls = 0;
  s.on(() => { calls++; });
  s.set({ b: 2 });
  assert.deepEqual(JSON.parse(JSON.stringify(s.get())), { a: 1, b: 2 });
  assert.equal(calls, 1);
});
