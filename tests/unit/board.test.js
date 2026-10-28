"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScripts } = require("../helpers/load");

const ctx = loadScripts(["js/core/ax.js", "js/engines/board.js"]);

test("moveCard returns new array, original untouched", () => {
  const cards = [{ id: "a", col: "new" }, { id: "b", col: "new" }];
  const out = ctx.AX.board.moveCard(cards, "a", "won");
  assert.notEqual(out, cards);
  assert.equal(out[0].col, "won");
  assert.equal(out[1].col, "new");
  assert.equal(cards[0].col, "new");
});
