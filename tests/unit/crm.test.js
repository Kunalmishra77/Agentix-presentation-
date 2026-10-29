"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScripts } = require("../helpers/load");
const ctx = loadScripts(["js/demos/agentix-crm.js", "js/demos/eurobrass-crm.js"]);
const { crm, eurobrass } = ctx.AX;

test("deadlineKind: red/amber/green with thresholds, done is always green", () => {
  const t = "2026-10-28";
  assert.equal(crm.deadlineKind("2026-10-25", t), "red");
  assert.equal(crm.deadlineKind("2026-10-30", t), "red");
  assert.equal(crm.deadlineKind("2026-11-02", t), "amber");
  assert.equal(crm.deadlineKind("2026-11-20", t), "green");
  assert.equal(crm.deadlineKind("2026-10-25", t, { red: 2, amber: 7 }, "done"), "green");
  assert.equal(crm.deadlineKind("2026-11-02", t, { red: 6, amber: 10 }), "red");
});

test("analyseProposal flags unlimited revisions and missing payment terms, and checks price", () => {
  const r = crm.analyseProposal("Redesign the website and build a booking bot. Unlimited revisions. Delivery ASAP.", 20000);
  assert.ok(r.scope.length >= 1);
  const titles = Array.from(r.risks.map((x) => x.title));
  assert.ok(titles.includes("Unlimited revisions") && titles.includes("Aggressive timeline") && titles.includes("No payment milestones"));
  assert.ok(r.price.estimate > 0 && /below/i.test(r.price.verdict));
  const ok = crm.analyseProposal("Build a site. Payment in 3 milestones.", 9999999);
  assert.ok(/above/i.test(ok.price.verdict));
});

test("draftEmail builds subject and tone from status", () => {
  const m = crm.draftEmail({ client: "Brightleaf Dental", project: "Website", status: "Delayed", note: "Waiting for assets" });
  assert.equal(m.subject, "[Delayed] Website - Brightleaf Dental");
  assert.ok(/delayed/i.test(m.body) && /Waiting for assets/.test(m.body));
});

test("eurobrass quoteTotals: GST 18% rounded to whole rupees", () => {
  const products = [{ id: "a", price: 6400 }, { id: "b", price: 3333 }];
  const t = eurobrass.quoteTotals([{ pid: "a", qty: 2 }, { pid: "b", qty: 3 }], products);
  assert.equal(t.subtotal, 12800 + 9999);
  assert.equal(t.gst, Math.round(22799 * 0.18));
  assert.equal(t.total, t.subtotal + t.gst);
  assert.equal(t.units, 5);
  assert.equal(eurobrass.quoteTotals([], products).total, 0);
});

test("eurobrass stockLevel", () => {
  assert.equal(eurobrass.stockLevel(0, 20), "Out of stock");
  assert.equal(eurobrass.stockLevel(20, 20), "Low stock");
  assert.equal(eurobrass.stockLevel(21, 20), "In stock");
});
