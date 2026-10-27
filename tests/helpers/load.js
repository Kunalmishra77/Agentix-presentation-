"use strict";
const vm = require("node:vm");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..", "..");

function stubNode(tag) {
  return {
    tagName: String(tag).toUpperCase(), children: [], style: {}, attributes: {},
    appendChild(c) { this.children.push(c); return c; },
    setAttribute(k, v) { this.attributes[k] = v; },
    addEventListener() {}, removeEventListener() {},
  };
}

/** Run classic scripts in a vm context where window === globalThis. */
function loadScripts(paths) {
  const ctx = vm.createContext({ console, setTimeout, clearTimeout });
  ctx.window = ctx;
  ctx.document = {
    createElement: stubNode,
    createTextNode: (t) => ({ nodeType: 3, textContent: String(t) }),
    head: stubNode("head"), body: stubNode("body"), documentElement: stubNode("html"),
    querySelector: () => null, querySelectorAll: () => [],
    addEventListener() {}, removeEventListener() {},
  };
  ctx.navigator = { userAgent: "node" };
  for (const p of paths) {
    const abs = path.isAbsolute(p) ? p : path.join(ROOT, p);
    vm.runInContext(fs.readFileSync(abs, "utf8"), ctx, { filename: abs });
  }
  return ctx;
}

module.exports = { loadScripts, ROOT };
