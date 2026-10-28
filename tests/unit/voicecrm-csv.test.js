"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScripts } = require("../helpers/load");

test("voicecrm toCsv quotes commas, quotes and newlines", () => {
  const ctx = loadScripts(["js/core/ax.js", "js/demos/voicecrm.js"]);
  const csv = ctx.AX.voicecrm.toCsv([{ key: "a", label: "A" }, { key: "b", label: "B" }], [{ a: "x,y", b: 'say "hi"' }, { a: 1, b: null }]);
  assert.equal(csv, 'A,B\r\n"x,y","say ""hi"""\r\n1,\r\n');
});

test("voicecrm toCsv guards formula injection but keeps raw phone columns", () => {
  const ctx = loadScripts(["js/core/ax.js", "js/demos/voicecrm.js"]);
  const csv = ctx.AX.voicecrm.toCsv([{ key: "n", label: "N" }, { key: "p", label: "P", raw: true }, { key: "v", label: "V" }],
    [{ n: "=SUM(1)", p: "+91 98xxx x0000", v: -5 }, { n: "@x", p: "x", v: "-2+3" }]);
  assert.equal(csv, "N,P,V\r\n'=SUM(1),+91 98xxx x0000,-5\r\n'@x,x,'-2+3\r\n");
});
