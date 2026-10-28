"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScripts } = require("../helpers/load");
const C = loadScripts(["js/core/ax.js", "js/engines/calendar.js"]).AX.calendar;

const b = [{ unit: "101", start: "2026-11-01", nights: 3 }];
test("overlap on a shared night", () => assert.equal(C.overlaps(b, { unit: "101", start: "2026-11-03", nights: 1 }), true));
test("checkout day is free", () => assert.equal(C.overlaps(b, { unit: "101", start: "2026-11-04", nights: 1 }), false));
test("different unit never overlaps", () => assert.equal(C.overlaps(b, { unit: "102", start: "2026-11-01", nights: 3 }), false));
test("month/year boundaries and ignore id", () => {
  const bb = [{ id: "x", unit: "1", start: "2026-12-30", nights: 4 }];
  assert.equal(C.overlaps(bb, { unit: "1", start: "2027-01-02", nights: 1 }), true);
  assert.equal(C.overlaps(bb, { unit: "1", start: "2027-01-03", nights: 1 }), false);
  assert.equal(C.overlaps(bb, { id: "x", unit: "1", start: "2026-12-31", nights: 1 }), false);
});
test("addDays is UTC safe across DST", () => {
  assert.equal(C.addDays("2026-03-28", 3), "2026-03-31");
  assert.equal(C.addDays("2026-10-31", 1), "2026-11-01");
});
