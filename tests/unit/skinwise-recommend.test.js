"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScripts } = require("../helpers/load");
const SW = loadScripts(["js/core/ax.js", "js/demos/skinwise.js"]).AX.skinwise;

const CONCERNS = ["acne", "pigmentation", "dark-circles", "dryness", "ageing", "dullness"];
const SKINS = ["oily", "dry", "combination", "normal"];
const BUDGETS = ["low", "mid", "high"];
const tagsOf = (r) => r.routine.flatMap((x) => x.product.tags);

test("pregnant: no retinoid or salicylic product in any routine, and the caution is shown", () => {
  for (const concern of CONCERNS) for (const skinType of SKINS) for (const budget of BUDGETS) for (const sensitivity of [true, false]) {
    const r = SW.recommend({ concern, skinType, sensitivity, pregnant: true, budget });
    const tags = tagsOf(r);
    assert.ok(!tags.includes("retinoid"), concern + "/" + skinType + " has a retinoid");
    assert.ok(!tags.includes("salicylic"), concern + "/" + skinType + " has salicylic acid");
    assert.ok(r.cautions.includes("Avoid retinoids during pregnancy"), "caution present");
    assert.ok(r.routine.length >= 3, "still a usable routine");
  }
});

test("acne while pregnant swaps the salicylic cleanser for a gentle one and keeps a safe treatment", () => {
  const r = SW.recommend({ concern: "acne", skinType: "oily", sensitivity: false, pregnant: true, budget: "mid" });
  const names = r.routine.map((x) => x.product.name);
  assert.ok(!names.includes("Anti-Acne Cleanser"));
  assert.ok(names.includes("Gentle Hydrating Cleanser"));
  assert.ok(r.routine.some((x) => x.step === "treat"));
});

test("not pregnant: acne on oily skin gets the salicylic Anti-Acne Cleanser, and no pregnancy caution", () => {
  const r = SW.recommend({ concern: "acne", skinType: "oily", sensitivity: false, pregnant: false, budget: "mid" });
  assert.ok(r.routine.some((x) => x.product.name === "Anti-Acne Cleanser"));
  assert.ok(!r.cautions.includes("Avoid retinoids during pregnancy"));
});

test("sensitive skin excludes strong actives and asks for a patch test", () => {
  for (const concern of CONCERNS) {
    const r = SW.recommend({ concern, skinType: "normal", sensitivity: true, pregnant: false, budget: "high" });
    assert.ok(!r.routine.some((x) => x.product.tags.includes("strong")), concern + " has a strong active");
    assert.ok(r.cautions.some((c) => /patch-test/i.test(c)));
  }
});

test("routine is ordered cleanse, treat, moisturise, protect; every item has a reason; always includes sunscreen", () => {
  const r = SW.recommend({ concern: "pigmentation", skinType: "combination", sensitivity: false, pregnant: false, budget: "mid" });
  assert.deepEqual([...r.routine.map((x) => x.step)], ["cleanse", "treat", "moisturise", "protect"]);
  r.routine.forEach((x) => assert.ok(x.why && x.why.length > 10));
  assert.ok(r.routine[3].product.tags.includes("spf"));
});

test("budget: low never costs more than high, and the function is pure", () => {
  const base = { concern: "acne", skinType: "oily", sensitivity: false, pregnant: false };
  const sum = (r) => r.routine.reduce((s, x) => s + x.product.price, 0);
  assert.ok(sum(SW.recommend({ ...base, budget: "low" })) <= sum(SW.recommend({ ...base, budget: "high" })));
  const a = SW.recommend({ ...base, budget: "mid" }), b = SW.recommend({ ...base, budget: "mid" });
  assert.deepEqual(a, b);
});

test("catalogue has 12 products with unique ids", () => {
  assert.equal(SW.products.length, 12);
  assert.equal(new Set(SW.products.map((p) => p.id)).size, 12);
});
