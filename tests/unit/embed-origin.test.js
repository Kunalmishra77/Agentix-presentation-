"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScripts } = require("../helpers/load");
const E = loadScripts(["js/core/ax.js", "js/engines/embed.js"]).AX.embed;

test("exact match", () => {
  assert.equal(E.originAllowed("https://ai-agentix.com", ["https://ai-agentix.com"]), true);
  assert.equal(E.originAllowed("https://other.com", ["https://ai-agentix.com"]), false);
});
test("wildcard matches subdomains only, same scheme", () => {
  const p = ["https://*.ai-agentix.com"];
  assert.equal(E.originAllowed("https://demo.ai-agentix.com", p), true);
  assert.equal(E.originAllowed("https://a.b.ai-agentix.com", p), true);
  assert.equal(E.originAllowed("https://ai-agentix.com", p), false);
  assert.equal(E.originAllowed("https://evilai-agentix.com", p), false);
  assert.equal(E.originAllowed("http://demo.ai-agentix.com", p), false);
});
test("lookalike hosts are rejected", () => {
  const p = ["https://*.ai-agentix.com", "https://ai-agentix.com"];
  assert.equal(E.originAllowed("https://evil-ai-agentix.com", p), false);
  assert.equal(E.originAllowed("https://ai-agentix.com.evil.com", p), false);
});
test("file:// origin is the string null", () => {
  assert.equal(E.originAllowed("null", ["https://ai-agentix.com", "https://*.ai-agentix.com"]), false);
  assert.equal(E.originAllowed("null", ["null"]), true);
});
test("http vs https mismatch; ports compared; empty list", () => {
  assert.equal(E.originAllowed("http://x.com", ["https://x.com"]), false);
  assert.equal(E.originAllowed("http://127.0.0.1:4310", ["http://127.0.0.1:4310"]), true);
  assert.equal(E.originAllowed("http://127.0.0.1:4311", ["http://127.0.0.1:4310"]), false);
  assert.equal(E.originAllowed("https://x.com", []), false);
});
