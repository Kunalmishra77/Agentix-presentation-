"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require(process.env.PW || "E:/travel-agency/node_modules/playwright");

test("shell + lazy demo load work on file://", async () => {
  const url = pathToFileURL(path.resolve(__dirname, "..", "..", "index.html")).href + "#/demo/agentix";
  assert.match(url, /^file:\/\/\//);
  const browser = await chromium.launch({ channel: "chrome" });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(url);
    await page.waitForSelector(".shell .cap-group");
    await page.waitForFunction(() => window.AX && AX.demos && AX.demos.agentix);
    assert.equal(errors.length, 0, errors.join("\n"));
  } finally { await browser.close(); }
});
