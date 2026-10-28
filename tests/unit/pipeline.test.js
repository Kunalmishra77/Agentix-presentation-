"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScripts } = require("../helpers/load");
const ctx = loadScripts(["js/core/ax.js", "js/engines/pipeline.js"]);
const P = ctx.AX.pipeline;

function init(n) {
  const stages = [];
  for (let i = 1; i <= n; i++) stages.push({ id: "s" + i, status: "waiting" });
  return { stages, cost: 0, cap: 10, log: [] };
}
const st = (s) => s.stages.map((x) => x.status);
const tick = { type: "tick" };

test("three ticks on 3 stages: stage 1 done, stage 2 running", () => {
  let s = init(3);
  s = P.reduce(s, tick); // start s1
  assert.deepEqual(st(s), ["running", "waiting", "waiting"]);
  s = P.reduce(s, tick); // finish s1
  s = P.reduce(s, tick); // start s2
  assert.deepEqual(st(s), ["done", "running", "waiting"]);
});

test("reduce is pure", () => {
  const s = init(2);
  const out = P.reduce(s, tick);
  assert.notEqual(out, s);
  assert.equal(s.stages[0].status, "waiting");
});

test("gate blocks stage 2 after it starts; approve unblocks", () => {
  let s = init(3);
  s = P.reduce(s, { type: "gate", stageId: "s2" });
  s = P.reduce(s, tick); s = P.reduce(s, tick); s = P.reduce(s, tick);
  assert.deepEqual(st(s), ["done", "blocked", "waiting"]);
  s = P.reduce(s, tick);
  assert.deepEqual(st(s), ["done", "blocked", "waiting"], "tick does not pass a gate");
  s = P.reduce(s, { type: "approve" });
  assert.deepEqual(st(s), ["done", "running", "waiting"]);
  s = P.reduce(s, tick);
  assert.deepEqual(st(s), ["done", "done", "waiting"]);
});

test("cost past cap blocks running stage and logs", () => {
  let s = init(2);
  s = P.reduce(s, tick);
  s = P.reduce(s, { type: "cost", amount: 4 });
  assert.equal(s.cost, 4);
  assert.equal(st(s)[0], "running");
  s = P.reduce(s, { type: "cost", amount: 7 });
  assert.equal(st(s)[0], "blocked");
  assert.ok(s.log.includes("Cost ceiling reached"));
});
