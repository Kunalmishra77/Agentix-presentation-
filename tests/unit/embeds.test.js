"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { loadScripts, ROOT } = require("../helpers/load");

const ctx = loadScripts(["js/core/ax.js", "js/data/categories.js", "js/data/fake.js", "js/data/projects.js"]);
const projects = Array.from(ctx.window.AX.projects);

test("embed modes are valid", () => {
  for (const p of projects.filter((x) => x.embed)) {
    assert.ok(["iframe", "local", "scroller"].includes(p.embed.mode), p.slug + " mode " + p.embed.mode);
    assert.ok(p.embed.url, p.slug + " url");
  }
});

test("local embeds point to existing files", () => {
  for (const p of projects.filter((x) => x.embed && x.embed.mode === "local")) {
    assert.ok(fs.existsSync(path.join(ROOT, p.embed.url)), p.slug + " missing " + p.embed.url);
  }
});

test("non-demo, non-delivery projects have an embed", () => {
  for (const p of projects.filter((x) => x.demo === false && x.category !== "delivery")) {
    assert.ok(p.embed, p.slug + " needs embed");
  }
});
