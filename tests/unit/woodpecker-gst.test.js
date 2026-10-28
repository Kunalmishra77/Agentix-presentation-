"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScripts } = require("../helpers/load");
const W = loadScripts(["js/core/ax.js", "js/demos/woodpecker-pms.js"]).AX.woodpecker;

test("gstRate: 12% up to and including Rs 7,500", () => {
  assert.equal(W.gstRate(7500), 0.12);
  assert.equal(W.gstRate(3600), 0.12);
});
test("gstRate: 18% above Rs 7,500", () => {
  assert.equal(W.gstRate(7501), 0.18);
  assert.equal(W.gstRate(9800), 0.18);
});
