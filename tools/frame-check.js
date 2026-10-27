"use strict";
// Checks whether each project's embed/live URL can be shown in an iframe.
// Output: tools/frame-report.json  [{url, status, finalUrl, xfo, frameAncestors, embeddable, error?}]
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

function loadProjects() {
  const win = {};
  const ctx = vm.createContext({ window: win, console });
  for (const f of ["js/core/ax.js", "js/data/categories.js", "js/data/fake.js", "js/data/projects.js"]) {
    const p = path.join(ROOT, f);
    if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, "utf8"), ctx, { filename: f });
  }
  return win.AX.projects;
}

function frameAncestors(csp) {
  if (!csp) return null;
  for (const part of csp.split(",").join(";").split(";")) {
    const t = part.trim().split(/\s+/);
    if (t[0] && t[0].toLowerCase() === "frame-ancestors") return t.slice(1).join(" ");
  }
  return null; // e.g. upgrade-insecure-requests alone: no restriction
}

function evaluate(xfo, fa) {
  if (xfo) return false;
  if (fa === null) return true;
  return fa.split(/\s+/).includes("*");
}

async function check(url) {
  const rec = { url, status: null, finalUrl: null, xfo: null, frameAncestors: null, embeddable: false };
  try {
    const res = await fetch(url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(20000), headers: { "User-Agent": UA, Accept: "text/html,*/*" } });
    rec.status = res.status;
    rec.finalUrl = res.url;
    rec.xfo = res.headers.get("x-frame-options");
    rec.frameAncestors = frameAncestors(res.headers.get("content-security-policy"));
    rec.embeddable = res.status < 400 && evaluate(rec.xfo, rec.frameAncestors);
    try { await res.body.cancel(); } catch (e) { /* ignore */ }
  } catch (e) {
    rec.error = String(e && e.message || e);
  }
  return rec;
}

async function main() {
  const urls = new Set();
  for (const p of loadProjects()) {
    if (p.liveUrl) urls.add(p.liveUrl);
    if (p.embed && p.embed.url && /^https?:/.test(p.embed.url)) urls.add(p.embed.url);
  }
  const list = [...urls];
  const out = [];
  const queue = list.slice();
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (queue.length) out.push(await check(queue.shift()));
  }));
  out.sort((a, b) => list.indexOf(a.url) - list.indexOf(b.url));
  fs.writeFileSync(path.join(__dirname, "frame-report.json"), JSON.stringify(out, null, 2));
  for (const r of out) console.log((r.embeddable ? "OK  " : "NO  ") + r.url + "  " + (r.status || r.error) + (r.xfo ? " XFO=" + r.xfo : "") + (r.frameAncestors ? " FA=" + r.frameAncestors : ""));
}
main();
