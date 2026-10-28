"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScripts } = require("../helpers/load");
const ctx = loadScripts(["js/demos/agentix-hims.js"]);
const H = ctx.AX.hims;

const NORMAL = { rr: 16, spo2: 98, o2: false, temp: 36.8, sbp: 120, hr: 72, avpu: "A" };

test("normal vitals score 0", () => assert.equal(H.news2(NORMAL), 0));

test("seeded NSTEMI patient: official NEWS2 chart gives 12 (brief said 11)", () => {
  const v = { rr: 25, spo2: 91, temp: 39.2, sbp: 95, hr: 115, avpu: "A" };
  const d = H.news2Detail(v);
  // RR>=25 =3, SpO2<=91 =3, temp>=39.1 =2, SBP 91-100 =2, HR 111-130 =2, alert =0, air =0
  assert.deepEqual(JSON.parse(JSON.stringify(d.parts)), { rr: 3, spo2: 3, o2: 0, sbp: 2, hr: 2, avpu: 0, temp: 2 });
  assert.equal(H.news2(v), 12);
  assert.equal(d.level, "high");
});

test("temperature bands", () => {
  const t = (temp) => H.news2Detail({ ...NORMAL, temp }).parts.temp;
  assert.equal(t(35.0), 3); assert.equal(t(35.5), 1); assert.equal(t(36.1), 0); assert.equal(t(38.0), 0);
  assert.equal(t(38.5), 1); assert.equal(t(39.0), 1); assert.equal(t(39.1), 2);
});

test("respiratory rate, SpO2, SBP, HR bands", () => {
  const p = (o) => H.news2Detail({ ...NORMAL, ...o }).parts;
  assert.equal(p({ rr: 8 }).rr, 3); assert.equal(p({ rr: 9 }).rr, 1); assert.equal(p({ rr: 20 }).rr, 0); assert.equal(p({ rr: 21 }).rr, 2); assert.equal(p({ rr: 24 }).rr, 2);
  assert.equal(p({ spo2: 92 }).spo2, 2); assert.equal(p({ spo2: 94 }).spo2, 1); assert.equal(p({ spo2: 96 }).spo2, 0);
  assert.equal(p({ sbp: 90 }).sbp, 3); assert.equal(p({ sbp: 110 }).sbp, 1); assert.equal(p({ sbp: 111 }).sbp, 0); assert.equal(p({ sbp: 220 }).sbp, 3);
  assert.equal(p({ hr: 40 }).hr, 3); assert.equal(p({ hr: 50 }).hr, 1); assert.equal(p({ hr: 90 }).hr, 0); assert.equal(p({ hr: 91 }).hr, 1); assert.equal(p({ hr: 131 }).hr, 3);
});

test("oxygen and consciousness add points; clinical bands", () => {
  assert.equal(H.news2({ ...NORMAL, o2: true }), 2);
  assert.equal(H.news2({ ...NORMAL, avpu: "V" }), 3);
  assert.equal(H.news2Detail({ ...NORMAL, rr: 8 }).level, "low-medium");
  assert.equal(H.news2Detail({ ...NORMAL, rr: 22, hr: 95, sbp: 105, spo2: 94, temp: 38.5 }).level, "medium");
});
