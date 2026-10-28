"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScripts } = require("../helpers/load");
const S = loadScripts(["js/core/ax.js", "js/engines/store.js"]).AX.store;
const prods = [{ id: "a", price: 1000 }];

test("totals without coupon", () => {
  assert.deepEqual(JSON.parse(JSON.stringify(S.cartTotals([{ id: "a", qty: 2 }], prods, { gstRate: 0.18 }))),
    { subtotal: 2000, discount: 0, gst: 360, shipping: 0, total: 2360 });
});
test("totals with 10% coupon", () => {
  const t = S.cartTotals([{ id: "a", qty: 2 }], prods, { gstRate: 0.18, coupon: { code: "X", pct: 10 } });
  assert.equal(t.discount, 200); assert.equal(t.gst, 324); assert.equal(t.total, 2124);
});
test("shipping free over threshold, charged below", () => {
  assert.equal(S.cartTotals([{ id: "a", qty: 1 }], prods, { shipping: 99, freeOver: 1000 }).shipping, 0);
  assert.equal(S.cartTotals([{ id: "a", qty: 1 }], prods, { shipping: 99, freeOver: 1500 }).shipping, 99);
});
test("rounds each component, ignores unknown ids", () => {
  const t = S.cartTotals([{ id: "a", qty: 1 }, { id: "zz", qty: 3 }], [{ id: "a", price: 333 }], { coupon: { pct: 10 } });
  assert.equal(t.subtotal, 333); assert.equal(t.discount, 33); assert.equal(t.gst, 54); assert.equal(t.total, 354);
});
