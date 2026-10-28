"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScripts } = require("../helpers/load");

const ctx = loadScripts(["js/core/ax.js", "js/engines/table.js"]);
const rows = [
  { name: "Priya Nair", status: "Hot", value: 300 },
  { name: "Arjun Rao", status: "Cold", value: 900 },
  { name: "Priyanka Das", status: "Hot", value: 100 },
];

test("query searches qKeys case-insensitively", () => {
  const out = ctx.AX.table.query(rows, { q: "pri", qKeys: ["name"] });
  assert.deepEqual(out.map((r) => r.name), ["Priya Nair", "Priyanka Das"]);
});
test("query filters exactly", () => {
  const out = ctx.AX.table.query(rows, { filters: { status: "Hot" } });
  assert.equal(out.length, 2);
  assert.ok(out.every((r) => r.status === "Hot"));
});
test("query sorts descending and does not mutate input", () => {
  const out = ctx.AX.table.query(rows, { sort: { key: "value", dir: "desc" } });
  assert.deepEqual(out.map((r) => r.value), [900, 300, 100]);
  assert.equal(rows[0].value, 300);
});
