"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScripts } = require("../helpers/load");

test("voicecrm toCsv quotes commas, quotes and newlines", () => {
  const ctx = loadScripts(["js/core/ax.js", "js/demos/voicecrm.js"]);
  const csv = ctx.AX.voicecrm.toCsv([{ key: "a", label: "A" }, { key: "b", label: "B" }], [{ a: "x,y", b: 'say "hi"' }, { a: 1, b: null }]);
  assert.equal(csv, 'A,B\r\n"x,y","say ""hi"""\r\n1,\r\n');
});
