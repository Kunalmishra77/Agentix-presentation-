"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { loadScripts, ROOT } = require("../helpers/load");

const ctx = loadScripts(["js/core/ax.js", "js/data/categories.js", "js/data/fake.js", "js/data/projects.js"]);
const AX = ctx.window.AX;
const STATUSES = ["live", "active", "proto", "concept"];

test("50 projects with unique slugs", () => {
  assert.equal(AX.projects.length, 50);
  const slugs = AX.projects.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test("11 categories in order with valid layouts", () => {
  assert.deepEqual(Array.from(AX.categories.map((c) => c.id)), ["agents", "content", "crm", "health", "hospitality", "fitness", "platforms", "websites", "ecommerce", "immersive", "delivery"]);
  for (const c of AX.categories) assert.ok(["flagship", "control", "rail", "poster", "pipeline"].includes(c.layout), c.id);
});

test("project fields are complete and consistent", () => {
  const cats = new Set(AX.categories.map((c) => c.id));
  for (const p of AX.projects) {
    assert.ok(cats.has(p.category), p.slug + " category");
    assert.ok(p.summary && p.summary.length > 0, p.slug + " summary");
    assert.ok(p.problem && p.problem.length > 0, p.slug + " problem");
    assert.ok(p.outcomes.length >= 3, p.slug + " outcomes");
    assert.ok(p.features.length >= 1, p.slug + " features");
    assert.ok(p.workflow.length >= 4 && p.workflow.length <= 7, p.slug + " workflow");
    assert.ok(p.stack.length >= 1, p.slug + " stack");
    assert.ok(STATUSES.includes(p.status), p.slug + " status");
    assert.ok(["A", "B", "C"].includes(p.tier), p.slug + " tier");
    if (p.tier === "A") assert.equal(p.demo, true, p.slug + " tier A demo");
  }
});

test("rulings: delivery, concept embeds, nri-trust, kaaya", () => {
  const by = (s) => AX.projects.find((p) => p.slug === s);
  for (const s of ["delivery-infra", "showcase-pipeline"]) {
    assert.equal(by(s).category, "delivery");
    assert.equal(by(s).demo, false);
    assert.equal(by(s).embed, undefined);
  }
  for (const p of AX.projects.filter((p) => p.status === "concept")) {
    assert.ok(p.embed && p.embed.url.startsWith("https://showcase-build-tau.vercel.app/"), p.slug);
    assert.equal(p.demo, false, p.slug);
  }
  assert.equal(by("drify").embed.url, "https://showcase-build-tau.vercel.app/drift/");
  assert.equal(by("fruitivo").embed.url, "https://showcase-build-tau.vercel.app/perfume/");
  assert.equal(by("movade").embed.url, "https://showcase-build-tau.vercel.app/travel/");
  assert.equal(by("tallow-tape").embed.url, "https://showcase-build-tau.vercel.app/tallow/");
  assert.equal(by("nri-trust").status, "live");
  assert.equal(by("nri-trust").liveUrl, "https://nritrust.co/");
  const k = by("kaaya-eco-resort");
  assert.equal(k.category, "hospitality");
  assert.equal(k.tier, "B");
  assert.equal(k.demo, true);
  assert.equal(k.year, 2026);
  assert.equal(k.embed.url, "https://kaayaecoresort.com/");
});

test("every shots[].src exists on disk", () => {
  for (const p of AX.projects) for (const s of p.shots) {
    assert.ok(s.caption, p.slug + " caption");
    assert.ok(fs.existsSync(path.join(ROOT, s.src)), p.slug + " missing " + s.src);
  }
});

test("no real contact data or secrets anywhere in the data", () => {
  const bad = /@(gmail|yahoo|hotmail)\.com|\b[6-9]\d{9}\b|sk-[A-Za-z0-9]{10,}/;
  const walk = (v, where) => {
    if (typeof v === "string") assert.ok(!bad.test(v), where + ": " + v);
    else if (Array.isArray(v)) v.forEach((x, i) => walk(x, where + "[" + i + "]"));
    else if (v && typeof v === "object") Object.keys(v).forEach((k) => walk(v[k], where + "." + k));
  };
  walk(AX.projects, "projects");
  walk(AX.categories, "categories");
});

test("fake generators are deterministic and masked", () => {
  assert.deepEqual(JSON.parse(JSON.stringify(AX.fake.person(7))), JSON.parse(JSON.stringify(AX.fake.person(7))));
  const p = AX.fake.person(3);
  assert.match(p.phone, /^\+91 98xxx x\d{4}$/);
  assert.match(p.email, /@example\.in$/);
  assert.equal(AX.fake.pick(5, [1, 2, 3]), AX.fake.pick(5, [1, 2, 3]));
  const n = AX.fake.int(9, 10, 20);
  assert.ok(n >= 10 && n <= 20);
  const s = AX.fake.series(2, 8, 5, 50);
  assert.equal(s.length, 8);
  assert.deepEqual(Array.from(s), Array.from(AX.fake.series(2, 8, 5, 50)));
});

test("tier A projects list at least 6 feature items across groups", () => {
  for (const p of AX.projects.filter((p) => p.tier === "A")) {
    const n = p.features.reduce((a, g) => a + g.items.length, 0);
    assert.ok(n >= 6, p.slug + " has " + n);
  }
});
