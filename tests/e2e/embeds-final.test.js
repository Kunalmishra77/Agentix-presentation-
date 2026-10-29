"use strict";
const test = require("node:test");
const { before, after } = test;
const assert = require("node:assert/strict");
const { openPage, serverUrl } = require("../helpers/browser");

/* Collects page errors whose stack points at our own server (third-party iframe errors are not ours). */
function ownErrors(page) {
  const list = [];
  page.on("pageerror", (e) => { const st = String(e.stack || ""); if (!st.includes("http") || st.includes(serverUrl)) list.push(e.message); });
  return list;
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
    const { page, errors, close } = await openPage("/index.html", { reducedMotion: "reduce" });
    const mineErrs = ownErrors(page);
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

test("own-document page errors are caught by the collector", async () => {
  const { page, close } = await openPage("/index.html");
  try {
    const errs = ownErrors(page);
    await page.evaluate(() => setTimeout(() => { throw new Error("own-error"); }));
    await page.waitForFunction(() => true);
    await new Promise((r) => setTimeout(r, 500));
    assert.deepEqual(errs, ["own-error"]);
  } finally { await close(); }
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
