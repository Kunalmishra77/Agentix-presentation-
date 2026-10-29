"use strict";
const test = require("node:test");
const { before, after } = test;
const assert = require("node:assert/strict");
const { openPage, serverUrl } = require("../helpers/browser");

/** Origin of the topmost stack frame, or null when the frame has no URL (eval/anonymous). */
function topFrameOrigin(stack) {
  const top = String(stack || "").split("\n").filter((l) => /^\s*at /.test(l))[0];   // first frame only
  if (!top) return null;
  const m = /\(?((?:https?|blob|data):[^\s)]*?):\d+:\d+\)?\s*$/.exec(top);
  if (!m) return null;
  if (/^(blob|data):/.test(m[1])) return "ours:" + m[1];   // blob/data scripts are ours, whatever their inner origin
  try { return new URL(m[1]).origin; } catch (e) { return "invalid:" + m[1]; }
}
/** An error is excused only when it originates inside the embedded third-party site (topmost frame on the embed origin). */
function excused(stack, embedOrigin) {
  const o = topFrameOrigin(stack);
  return !!(embedOrigin && o && o === embedOrigin && o !== new URL(serverUrl).origin);
}
/** Returns {list, hook}: pass hook as openPage onPage so errors during page load are counted too. */
function collector(embedUrl) {
  let embedOrigin = null;
  try { embedOrigin = new URL(embedUrl).origin; } catch (e) {}
  const list = [];
  return { list, hook: (page) => page.on("pageerror", (e) => { if (!excused(e.stack, embedOrigin)) list.push(e.message); }) };
}

let keeper;
before(async () => { keeper = await openPage("/index.html"); });
after(async () => { if (keeper) await keeper.close(); });

/* Every project with demo:false and an embed must show its LIVE embed in the Walkthrough. */
async function projectList() {
  const { page, close } = await openPage("/index.html");
  try {
    return await page.evaluate(() => AX.projects.filter((p) => p.demo === false && p.embed).map((p) => ({
      slug: p.slug, name: p.name, status: p.status, mode: p.embed.mode, url: p.embed.url,
      allowed: p.embed.allowedOrigins || null
    })));
  } finally { await close(); }
}

// external requests may fail in CI / offline; only same-origin failures and page errors matter here
const relevant = (errors) => errors.filter((e) => !/requestfailed|ERR_|Failed to load resource|net::|frame-ancestors|X-Frame|Refused to/i.test(e));

test("every embed-only project's Walkthrough renders AX.embed (iframe loaded or scroller shown)", async () => {
  const list = await projectList();
  assert.ok(list.length >= 20, "expected 20+ embed-only projects, got " + list.length);
  for (const p of list) {
    const col = collector(p.url);
    const mineErrs = col.list;
    const { page, errors, close } = await openPage("/index.html", { reducedMotion: "reduce", onPage: col.hook });
    try {
      await page.evaluate((h) => { location.hash = h; }, "#/demo/" + p.slug + "/walkthrough");
      await page.waitForSelector(".emb", { timeout: 15000 });
      await page.waitForFunction(() => {
        const e = document.querySelector(".emb");
        return e && e.getAttribute("data-status") !== "loading";
      }, null, { timeout: 25000 });
      const status = await page.locator(".emb").getAttribute("data-status");
      assert.ok(status === "live" || status === "fallback", p.slug + " status " + status);
      if (status === "live") assert.equal(await page.locator(".emb iframe").count(), 1, p.slug + " iframe");
      else assert.equal(await page.locator(".emb-scroller").count(), 1, p.slug + " scroller");
      // a live third-party iframe runs the client's own scripts; their runtime errors surface as page errors and are not ours
      // our own document must never throw; third-party iframe errors are excluded by stack origin
      const net = relevant(errors).filter((e) => !e.startsWith("pageerror"));
      assert.equal(net.length + mineErrs.length, 0, p.slug + ": " + net.concat(mineErrs).join("\n"));
    } finally { await close(); }
  }
});

test("collector counts own errors, foreign-CDN and blob-script errors; excuses only the embedded site", async () => {
  const col = collector("https://embedded.example.org/");
  const { page, close } = await openPage("/index.html", { onPage: col.hook });
  try {
    await page.evaluate(() => setTimeout(() => { throw new Error("own-error"); }));
    await page.evaluate(() => {
      const b = new Blob(["setTimeout(function(){ throw new Error(\"blob-error\"); })"], { type: "text/javascript" });
      const sc = document.createElement("script"); sc.src = URL.createObjectURL(b); document.head.appendChild(sc);
    });
    await new Promise((r) => setTimeout(r, 700));
    assert.ok(col.list.includes("own-error"), "own error counted: " + col.list);
    assert.ok(col.list.includes("blob-error"), "blob script error counted: " + col.list);
  } finally { await close(); }
  const cdn = "Error: x\n    at f (https://cdn.example.net/lib.js:1:2)";
  const emb = "Error: x\n    at f (https://embedded.example.org/app.js:10:5)\n    at g (http://127.0.0.1/index.html:1:1)";
  assert.equal(excused(cdn, "https://embedded.example.org"), false, "foreign CDN script is not excused");
  assert.equal(excused(emb, "https://embedded.example.org"), true, "embedded-site frame is excused");
  assert.equal(excused("Error: x\n    at <anonymous>:1:1", "https://embedded.example.org"), false, "no URL is not excused");
  assert.equal(excused("Error: x\n    at <anonymous>:1:1\n    at f (https://embedded.example.org/app.js:10:5)", "https://embedded.example.org"), false, "anonymous top frame is counted even with embedded frames below");
  assert.equal(excused("Error: x\n    at f (https://embedded.example.org/app.js:10:5)\n    at <anonymous>:1:1", "https://embedded.example.org"), true, "embedded top frame is excused");
  assert.equal(excused("Error: x\n    at f (blob:https://embedded.example.org/uuid-1:1:1)", "https://embedded.example.org"), false, "blob top frame is counted");
  assert.equal(excused("Error: x\n    at h (http://127.0.0.1:4507/js/a.js:1:1)", "https://embedded.example.org"), false, "our own scripts are not excused");
});

test("hosted-only sites forward allowedOrigins; on localhost they show the scroller", async () => {
  const { page, close } = await openPage("/index.html");
  try {
    const rows = await page.evaluate(() => ["agentix", "woodpecker-pms", "umang-website", "max-website", "yhc", "skinwise"].map((s) => {
      const p = AX.projects.find((x) => x.slug === s);
      const o = AX.embed.optsFor(p);
      return { s, mode: o.mode, ao: o.allowedOrigins, local: AX.embed.originAllowed(location.origin, o.allowedOrigins) };
    }));
    for (const r of rows) {
      assert.equal(r.mode, "iframe", r.s);
      assert.deepEqual(r.ao, ["https://agentix-portfolio.vercel.app", "https://ai-agentix.com", "https://*.ai-agentix.com"], r.s);
      assert.equal(r.local, false, r.s);
    }
    const hosted = await page.evaluate(() => AX.embed.originAllowed("https://agentix-portfolio.vercel.app", AX.projects.find((x) => x.slug === "yhc").embed.allowedOrigins) &&
      AX.embed.originAllowed("https://www.ai-agentix.com", AX.projects.find((x) => x.slug === "yhc").embed.allowedOrigins));
    assert.equal(hosted, true);
  } finally { await close(); }
});

for (const [slug, text] of [["santure-crm", "Santure"], ["ekatva", "Ekatva"]]) {
  test(slug + " local mirror renders interactive content", async () => {
    const { page, errors, close } = await openPage("/index.html#/demo/" + slug + "/walkthrough", { reducedMotion: "reduce" });
    try {
      await page.waitForSelector(".emb iframe", { timeout: 15000 });
      const handle = await page.waitForSelector(".emb iframe");
      const frame = await handle.contentFrame();
      await frame.waitForFunction(() => document.body && document.body.innerText.length > 200, null, { timeout: 20000 });
      const txt = await frame.evaluate(() => document.body.innerText);
      assert.ok(txt.toLowerCase().includes(text.toLowerCase()), slug + " frame text: " + txt.slice(0, 200));
      const clickables = await frame.evaluate(() => document.querySelectorAll("button, a[href], input, [role=button]").length);
      assert.ok(clickables >= 5, slug + " interactive elements: " + clickables);
      await page.waitForFunction(() => document.querySelector(".emb").getAttribute("data-status") === "live");
      // click something for real: first sidebar/nav link or button inside the mirrored app
      const before = await frame.evaluate(() => location.href + "|" + document.body.innerText.length);
      const btn = frame.locator("nav a, aside a, [role=tab], button").nth(2);
      await btn.click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(500);
      const after = await frame.evaluate(() => document.body.innerText.length);
      assert.ok(after > 100, "app still rendering after click (" + before + " -> " + after + ")");
      assert.equal(relevant(errors).length, 0, slug + ": " + relevant(errors).join("\n"));
    } finally { await close(); }
  });
}

test("concept brand overview carries the label; Crumb renamed", async () => {
  const { page, close } = await openPage("/index.html#/demo/crumb", { reducedMotion: "reduce" });
  try {
    await page.waitForSelector(".pane-overview");
    assert.ok((await page.locator(".pane-overview").textContent()).includes("Concept brand — designed and built by AI Agentix"));
    assert.ok((await page.locator(".bar-name").innerText()).includes("Crumb & Co"));
    assert.ok((await page.locator(".cap-group").count()) >= 1);
  } finally { await close(); }
});
