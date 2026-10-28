"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScripts } = require("../helpers/load");
const M = loadScripts(["js/core/ax.js", "js/demos/max-register.js"]).AX.maxRegister;

test("fy: Indian financial year starts 1 April", () => {
  assert.equal(M.fy("2027-03-31"), "2026-27");
  assert.equal(M.fy("2027-04-01"), "2027-28");
  assert.equal(M.fy("2027-02-01"), "2026-27");
  assert.equal(M.fy("2026-10-27"), "2026-27");
});
test("fy: century rollover keeps two digits", () => {
  assert.equal(M.fy("2099-05-01"), "2099-00");
});
test("receiptNo pads to six digits", () => {
  assert.equal(M.receiptNo("2026-10-27", 123), "MF/2026-27/000123");
  assert.match(M.receiptNo("2027-04-01", 7), /^MF\/\d{4}-\d{2}\/\d{6}$/);
});
