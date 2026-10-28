"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScripts } = require("../helpers/load");

const ctx = loadScripts(["js/core/ax.js", "js/data/fake.js", "js/demos/nri-trust.js"]);
const nri = ctx.window.AX.nri;

test("no POA + no nominee + property in India is RED", () => {
  assert.equal(nri.persona({ poa: "no", nominee: "no", property: "india" }), "RED");
  assert.equal(nri.persona({ poa: "no", nominee: "no", property: "india", will: "yes", insurance: "yes", liquidity: "yes", parentAge: "under_55" }), "RED");
});

test("fully covered family is GREEN", () => {
  assert.equal(nri.persona({ parentAge: "under_55", property: "india", poa: "yes", nominee: "yes", will: "yes", insurance: "yes", liquidity: "yes" }), "GREEN");
  assert.equal(nri.persona({}), "GREEN");
});

test("partial gaps are ORANGE; many gaps become RED", () => {
  assert.equal(nri.persona({ poa: "yes", nominee: "yes", property: "none", will: "no", insurance: "no" }), "ORANGE");
  assert.equal(nri.persona({ poa: "no", nominee: "yes", property: "none", will: "no", insurance: "no", liquidity: "no", parentAge: "65_plus" }), "RED");
});

test("matrix and playbook are consistent with the answers", () => {
  const a = { poa: "no", nominee: "no", property: "india", will: "yes", insurance: "yes", liquidity: "yes", parentAge: "65_plus" };
  const m = nri.matrix(a);
  assert.equal(m.find((r) => r.check === "Power of Attorney").status, "Fail");
  assert.equal(m.find((r) => r.check === "Will").status, "Pass");
  const pb = nri.playbook(a);
  assert.equal(pb[0].priority, "P1");
  assert.ok(pb.every((x, i, arr) => !i || arr[i - 1].priority <= x.priority));
  assert.ok(pb.some((x) => x.id === "review"));
});

test("pdf() builds a structurally valid single-page PDF", () => {
  const text = nri.pdf("Title (with) parens \\ and ₹", ["line one", "x".repeat(200)]);
  assert.ok(text.startsWith("%PDF-1.4\n"));
  assert.ok(text.trimEnd().endsWith("%%EOF"));
  const startxref = +/startxref\n(\d+)\n/.exec(text)[1];
  assert.equal(text.slice(startxref, startxref + 4), "xref");
  const entries = [...text.slice(startxref).matchAll(/^(\d{10}) 00000 n $/gm)].map((m) => +m[1]);
  assert.equal(entries.length, 5);
  entries.forEach((off, i) => assert.equal(text.slice(off, off + String(i + 1).length + 6), (i + 1) + " 0 obj"));
  const len = +/\/Length (\d+)/.exec(text)[1];
  const body = text.slice(text.indexOf("stream\n") + 7, text.indexOf("endstream"));
  assert.equal(body.length, len);
  assert.ok(/\/Count 1/.test(text));
});
