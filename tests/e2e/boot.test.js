"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { openPage } = require("../helpers/browser");

test("index boots with no errors and exposes window.AX", async () => {
  const { page, errors, close } = await openPage("/");
  try {
    assert.equal(await page.evaluate(() => typeof window.AX), "object");
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await close(); }
});
