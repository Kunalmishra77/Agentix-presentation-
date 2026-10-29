// Assemble AI_AGENTIX_PROJECT_KNOWLEDGE_BASE.md from docs/kb parts.
// Usage: node docs/kb/build-kb.js   (run from repo root)
const fs = require("fs"), path = require("path");
const root = path.resolve(__dirname, "../..");
global.window = global;
require(path.join(root, "js/core/ax.js"));
require(path.join(root, "js/data/categories.js"));
require(path.join(root, "js/data/projects.js"));
const bySlug = Object.fromEntries(AX.projects.map((p) => [p.slug, p]));
const STATUS = { live: "Live", active: "In development", proto: "Prototype", concept: "Concept" };
const PORTFOLIO = "https://agentix-portfolio.vercel.app/#/demo/";

const used = {};
function anchor(text) {
  let a = text.trim().toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s/g, "-");
  if (used[a] !== undefined) { used[a]++; a = a + "-" + used[a]; } else used[a] = 0;
  return a;
}

const parts = ["part-1-agents-content-crm.md", "part-2-health-hospitality-fitness.md", "part-3-platforms-websites-concepts.md"]
  .map((f) => fs.readFileSync(path.join(__dirname, f), "utf8").replace(/\r\n/g, "\n"));
const head = fs.readFileSync(path.join(__dirname, "_head.md"), "utf8").replace(/\r\n/g, "\n");
const tail = fs.readFileSync(path.join(__dirname, "_tail.md"), "utf8").replace(/\r\n/g, "\n");

// pre-register anchors produced by head (## headings) so numbering matches GitHub
for (const m of head.matchAll(/^#{1,6} (.+)$/gm)) anchor(m[1]);

const body = parts.map((t) => t.replace(/^# .*\n/, "")).join("\n\n");
const toc = [], index = [];
let category = "";
const lines = body.split("\n");
for (let i = 0; i < lines.length; i++) {
  const h = /^(#{2,6}) (.+)$/.exec(lines[i]);
  if (!h) continue;
  const level = h[1].length, title = h[2];
  const a = anchor(title);
  if (level === 2) { category = title; toc.push(`- [${title}](#${a})`); }
  if (level === 3) {
    const win = lines.slice(i + 1, i + 6).join(" ");
    const sm = /\*\*Slug:\*\*\s*`([^`]+)`/.exec(win);
    toc.push(`  - [${title}](#${a})`);
    if (sm) {
      const p = bySlug[sm[1]] || {};
      index.push(`| [${title}](#${a}) | \`${sm[1]}\` | ${category} | ${STATUS[p.status] || "—"} | ${p.liveUrl ? `<${p.liveUrl}>` : "—"} | <${PORTFOLIO}${sm[1]}> |`);
    }
  }
}
for (const m of tail.matchAll(/^(#{2,3}) (.+)$/gm)) {
  const a = anchor(m[2]);
  toc.push((m[1].length === 2 ? "- " : "  - ") + `[${m[2]}](#${a})`);
}

const out = [
  head.trim(),
  "\n## Master project index\n",
  `${index.length} projects. Status values come from the portfolio inventory; the live-site type (production, public site or demo) is in each project's **Links & access** table.\n`,
  "| Project | Slug | Category | Status | Live URL | Portfolio demo (safe, fictional data) |",
  "|---|---|---|---|---|---|",
  ...index,
  "\n## Table of contents\n",
  "- [How the voice agent should use this document](#how-the-voice-agent-should-use-this-document)",
  "- [About AI Agentix (company overview)](#about-ai-agentix-company-overview)",
  "- [Master project index](#master-project-index)",
  ...toc,
  "\n---\n",
  body.trim(),
  "\n" + tail.trim(),
  "",
].join("\n");
fs.writeFileSync(path.join(root, "AI_AGENTIX_PROJECT_KNOWLEDGE_BASE.md"), out);
console.log(`projects in index: ${index.length}; words: ${out.split(/\s+/).length}`);
