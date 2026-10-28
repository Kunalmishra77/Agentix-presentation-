"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScripts } = require("../helpers/load");
const ctx = loadScripts(["js/core/ax.js", "js/core/router.js"]);
const p = (h) => JSON.parse(JSON.stringify(ctx.AX.router.parse(h)));

test("home", () => {
  assert.deepEqual(p("#/"), { view: "home" });
  assert.deepEqual(p(""), { view: "home" });
  assert.deepEqual(p("#"), { view: "home" });
});
test("demo defaults to overview", () => {
  assert.deepEqual(p("#/demo/agentix"), { view: "demo", slug: "agentix", tab: "overview", module: null });
});
test("walkthrough module", () => {
  assert.deepEqual(p("#/demo/agentix/walkthrough/flows"), { view: "demo", slug: "agentix", tab: "walkthrough", module: "flows" });
});
test("unknown tab maps to overview", () => {
  assert.equal(p("#/demo/agentix/bogus").tab, "overview");
});
test("known tabs", () => {
  ["overview", "walkthrough", "how", "screens", "tech"].forEach((t) => assert.equal(p("#/demo/x/" + t).tab, t));
});
