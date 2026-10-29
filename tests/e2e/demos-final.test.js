"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { openPage } = require("../helpers/browser");
const { before, after } = test;

let keeper;
before(async () => { keeper = await openPage("/index.html"); });
after(async () => { if (keeper) await keeper.close(); });

const SLUGS = ["riya-crm", "leadforge", "nri-trust", "umang-website", "fitness-first", "max-website", "ai-agentix-site", "kaaya-eco-resort"];
const SITE_MODULES = new Set(["site"]);
// network failures from third-party embeds are not ours; our own scripts must not throw
const own = (errors) => errors.filter((e) => !/requestfailed|ERR_|Failed to load resource|net::|frame-ancestors|X-Frame|Refused to/i.test(e));

async function open(slug, module) {
  const r = await openPage("/index.html#/demo/" + slug + "/walkthrough" + (module ? "/" + module : ""), { reducedMotion: "reduce" });
  await r.page.waitForSelector(".ax-app [data-module-ready]", { timeout: 15000 });
  return r;
}
async function goto(page, id) {
  await page.locator('.ax-nav-item[data-id="' + id + '"]').click();
  await page.waitForSelector('.ax-module[data-module="' + id + '"][data-module-ready]');
}

for (const slug of SLUGS) {
  test(slug + ": every module renders with content and no errors", async () => {
    const { page, errors, close } = await open(slug);
    try {
      const ids = await page.$$eval(".ax-nav-item", (b) => b.map((x) => x.getAttribute("data-id")));
      assert.ok(ids.length >= 2, "modules: " + ids.join(","));
      const ordered = ids.filter((i) => !SITE_MODULES.has(i)).concat(ids.filter((i) => SITE_MODULES.has(i)));
      for (const id of ordered) {
        await goto(page, id);
        if (SITE_MODULES.has(id) && (await page.locator(".emb").count())) {
          await page.waitForFunction(() => { const e = document.querySelector(".emb"); return e && e.getAttribute("data-status") !== "loading"; }, null, { timeout: 25000 });
        }
        const len = await page.locator('.ax-module[data-module="' + id + '"]').evaluate((n) => n.innerText.trim().length);
        assert.ok(len > 40, slug + "/" + id + " text length " + len);
        assert.equal(await page.locator("[data-module-error]").count(), 0, slug + "/" + id + " errored");
        if (!SITE_MODULES.has(id)) assert.equal(own(errors).length, 0, slug + "/" + id + ": " + own(errors).join("\n"));
      }
    } finally { await close(); }
  });
}

test("riya-crm: Riya books a trial and the lead flips to TrialBooked", async () => {
  const { page, errors, close } = await open("riya-crm", "inbox");
  try {
    const before = await page.evaluate(() => AX.data["riya-crm"].leads.filter((l) => l.outcome === "TrialBooked").length);
    await page.getByRole("button", { name: "Play Riya's conversation" }).click();
    await page.waitForSelector('[data-trial="booked"]', { timeout: 10000 });
    await goto(page, "leads");
    await page.locator(".tbl-search").fill("L-1033");
    const row = page.locator(".tbl-row").first();
    await row.waitFor();
    const txt = await row.innerText();
    assert.ok(txt.includes("L-1033") && txt.includes("TrialBooked"), txt);
    const after = await page.evaluate(() => AX.data["riya-crm"].leads.filter((l) => l.outcome === "TrialBooked").length);
    assert.equal(after, before + 1);
    await goto(page, "dashboard");
    await goto(page, "tasks");
    assert.ok((await page.locator(".ax-module").innerText()).includes("Call after trial"));
    assert.equal(own(errors).length, 0, own(errors).join("\n"));
  } finally { await close(); }
});

test("leadforge: sentence -> criteria chips -> pipeline -> 40 results -> provenance drawer", async () => {
  const { page, errors, close } = await open("leadforge");
  try {
    await page.getByRole("button", { name: "Understand this" }).click();
    await page.waitForSelector(".lf-crit");
    assert.ok((await page.locator(".lf-crit").count()) >= 3);
    const keys = await page.$$eval(".lf-crit", (n) => n.map((x) => x.getAttribute("data-key")));
    assert.ok(keys.includes("category") && keys.includes("location") && keys.includes("website"), keys.join());
    await page.locator('[data-act="run"]').click();
    await page.waitForSelector('.ax-module[data-module="run"][data-module-ready]');
    for (const stage of ["Plan", "Discover", "Crawl", "Normalize", "Dedupe"]) assert.ok((await page.locator(".pl-stages").innerText()).includes(stage), stage);
    await page.waitForSelector('[data-run="complete"]', { timeout: 15000 });
    await goto(page, "results");
    assert.equal(await page.evaluate(() => AX.data.leadforge.rows.length), 40);
    await page.locator('.lf-cell[data-field="phone"]').first().click();
    const drawer = page.locator(".ov-drawer");
    await drawer.waitFor();
    const t = await drawer.innerText();
    for (const k of ["SOURCE", "URL", "METHOD", "CONFIDENCE"]) assert.ok(t.toUpperCase().includes(k), k + " in drawer: " + t);
    assert.ok(/\d+%/.test(t), "confidence percent: " + t);
    assert.equal(own(errors).length, 0, own(errors).join("\n"));
  } finally { await close(); }
});

test("nri-trust: RED verdict, failure matrix, playbook and a real PDF download", async () => {
  const { page, errors, close } = await open("nri-trust", "assessment");
  try {
    const answers = { parentAge: "65_plus", residency: "uae", property: "india", poa: "no", nominee: "no", will: "yes", insurance: "yes", liquidity: "yes" };
    for (const [q, v] of Object.entries(answers)) await page.locator('.nt-opt[data-q="' + q + '"][data-v="' + v + '"]').click();
    await page.waitForSelector('[data-verdict="RED"]');
    assert.ok((await page.locator(".nt-tbl tbody tr").count()) >= 6);
    assert.ok((await page.locator(".nt-play li").count()) >= 3);
    const [dl] = await Promise.all([page.waitForEvent("download"), page.locator('[data-act="pdf"]').click()]);
    assert.ok(/\.pdf$/.test(dl.suggestedFilename()));
    const path = await dl.path();
    const buf = fs.readFileSync(path);
    assert.equal(buf.slice(0, 5).toString("latin1"), "%PDF-");
    assert.ok(buf.toString("latin1").trimEnd().endsWith("%%EOF"));
    // other verdicts
    await page.locator('[data-act="retake"]').click();
    const green = { parentAge: "under_55", residency: "usa", property: "india", poa: "yes", nominee: "yes", will: "yes", insurance: "yes", liquidity: "yes" };
    for (const [q, v] of Object.entries(green)) await page.locator('.nt-opt[data-q="' + q + '"][data-v="' + v + '"]').click();
    await page.waitForSelector('[data-verdict="GREEN"]');
    assert.equal(own(errors).length, 0, own(errors).join("\n"));
  } finally { await close(); }
});

test("umang-website: speciality filter narrows the 12 doctor cards; appointment lands in admin leads", async () => {
  const { page, errors, close } = await open("umang-website");
  try {
    await goto(page, "doctors");
    assert.equal(await page.locator(".uw-doc").count(), 12);
    await page.locator('.uw-pill[data-sp="Cardiology"]').click();
    await page.waitForFunction(() => document.querySelectorAll(".uw-doc").length === 2);
    const sp = await page.$$eval(".uw-doc", (n) => n.map((x) => x.getAttribute("data-speciality")));
    assert.deepEqual(sp, ["Cardiology", "Cardiology"]);
    await page.locator("[data-book]").first().click();
    await page.waitForSelector('.ax-module[data-module="appointment"][data-module-ready]');
    await page.getByLabel("Your name").fill("Test Patient");
    await page.getByLabel("Mobile number").fill("+91 98xxx x1234");
    await page.getByRole("button", { name: "Request appointment" }).click();
    await page.waitForSelector("[data-lead]");
    const id = await page.locator("[data-lead]").getAttribute("data-lead");
    await goto(page, "admin-leads");
    await page.locator(".tbl-search").fill(id);
    assert.ok((await page.locator(".tbl-row").first().innerText()).includes("Test Patient"));
    await page.locator(".tbl-row").first().click();
    assert.ok((await page.locator(".ov-drawer").innerText()).toLowerCase().includes("utm_campaign"));
    assert.equal(own(errors).length, 0, own(errors).join("\n"));
  } finally { await close(); }
});

test("fitness-first: plan picker with offer price and trial form thank-you", async () => {
  const { page, errors, close } = await open("fitness-first");
  try {
    await goto(page, "plans");
    assert.equal(await page.locator(".ff-plan").count(), 4);
    await page.locator('.ff-plan[data-plan="m12"]').click();
    assert.equal(await page.locator(".ff-sum").getAttribute("data-selected"), "m12");
    assert.ok((await page.locator(".ff-sum").innerText()).includes("19,999"));
    await page.locator('[data-act="choose"]').click();
    await page.waitForSelector('.ax-module[data-module="trial"][data-module-ready]');
    await page.getByLabel("Your name").fill("Aarav Test");
    await page.getByLabel("Mobile number").fill("+91 98xxx x0000");
    await page.getByRole("button", { name: "Book my free trial" }).click();
    await page.waitForSelector('[data-state="thank-you"]');
    const t = await page.locator('[data-state="thank-you"]').innerText();
    assert.ok(t.includes("Thank you, Aarav"));
    assert.equal(await page.locator('[data-link="riya-crm"]').getAttribute("href"), "#/demo/riya-crm/walkthrough/inbox");
    assert.equal(own(errors).length, 0, own(errors).join("\n"));
  } finally { await close(); }
});

test("max-website: QR onboarding for a new member and an existing member", async () => {
  const { page, errors, close } = await open("max-website");
  try {
    await goto(page, "join");
    await page.locator('[data-act="scan"]').click();
    await page.locator('[data-mode="existing"]').click();
    await page.locator('[data-act="lookup"]').click();
    await page.waitForSelector('[data-member^="MF-"]');
    await page.locator('[data-act="restart"]').click();
    await page.locator('[data-act="scan"]').click();
    await page.locator('[data-mode="new"]').click();
    await page.locator('.mw-pick[data-plan="m6"]').click();
    await page.getByLabel("Full name").fill("Test Joiner");
    await page.locator('[data-act="pay"]').click();
    await page.waitForSelector('[data-member="new"]');
    assert.ok((await page.locator('[data-member="new"]').innerText()).includes("Test Joiner"));
    await page.getByRole("button", { name: /हिं/ }).click();
    assert.equal(own(errors).length, 0, own(errors).join("\n"));
  } finally { await close(); }
});

test("ai-agentix-site: assistant answers and highlights the matching section", async () => {
  const { page, errors, close } = await open("ai-agentix-site");
  try {
    await goto(page, "assistant");
    assert.equal(await page.locator(".as-chip").count(), 6);
    await page.locator('.as-chip[data-q="q5"]').click();
    await page.waitForSelector('.as-sec.hl[data-section="pricing"]');
    assert.ok((await page.locator(".as-m.bot").last().innerText()).includes("Answered from"));
    await page.getByLabel("Ask the assistant").fill("tell me about chatbots");
    await page.getByRole("button", { name: "Send" }).click();
    await page.waitForSelector('.as-sec.hl[data-section="agents"]');
    assert.equal(own(errors).length, 0, own(errors).join("\n"));
  } finally { await close(); }
});

test("kaaya-eco-resort: blocked dates excluded, booking lands in my-bookings and admin-bookings", async () => {
  const { page, errors, close } = await open("kaaya-eco-resort");
  try {
    await goto(page, "book");
    await page.locator('[data-act="search"]').click();
    await page.waitForSelector(".kz-room");
    assert.equal(await page.locator('.kz-room[data-room="r2"]').getAttribute("data-available"), "false", "r2 is blocked 10-15 Dec");
    assert.ok((await page.locator('.kz-room[data-room="r2"]').innerText()).includes("Blocked: Roof maintenance"));
    assert.equal(await page.locator('.kz-room[data-room="r1"]').getAttribute("data-available"), "true");
    await page.locator('[data-select="r1"]').click();
    await page.locator('[data-act="to-pay"]').click();
    await page.locator('[data-act="pay"]').click();
    await page.waitForSelector("[data-ref]");
    const ref = await page.locator("[data-ref]").getAttribute("data-ref");
    assert.ok(/^KAY-2026-\d{4}$/.test(ref), ref);
    assert.equal(await page.evaluate(() => document.querySelector(".ax-app").__axApp.ctx.state.get().bookings.length), 1);
    await goto(page, "admin-bookings");
    await page.locator(".tbl-search").fill(ref);
    assert.ok((await page.locator(".tbl-row").first().innerText()).includes(ref));
    await goto(page, "my-bookings");
    assert.ok((await page.locator(".ax-module").innerText()).includes(ref));
    // the same room and dates are now taken
    await goto(page, "book");
    await page.locator('[data-act="search"]').click();
    await page.waitForSelector(".kz-room");
    assert.equal(await page.locator('.kz-room[data-room="r1"]').getAttribute("data-available"), "false");
    // blocked dates admin affects the widget
    await goto(page, "admin-blocked");
    await page.locator('[data-act="block"]').click();
    assert.ok((await page.locator(".cal-ev").count()) > 0);
    assert.equal(own(errors).length, 0, own(errors).join("\n"));
  } finally { await close(); }
});
