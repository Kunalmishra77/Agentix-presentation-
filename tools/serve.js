"use strict";
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml",
  ".woff2": "font/woff2", ".mp4": "video/mp4", ".webp": "image/webp", ".ico": "image/x-icon",
};

/** Single byte range: returns {start,end}, "bad" when unsatisfiable, or null to ignore the header. */
function parseRange(header, size) {
  const m = /^bytes=(\d*)-(\d*)$/.exec(String(header).trim());
  if (!m || (m[1] === "" && m[2] === "")) return null;
  let start, end;
  if (m[1] === "") { const n = Number(m[2]); if (n === 0) return "bad"; start = Math.max(0, size - n); end = size - 1; }
  else { start = Number(m[1]); end = m[2] === "" ? size - 1 : Math.min(Number(m[2]), size - 1); }
  if (start >= size || start > end) return "bad";
  return { start, end };
}

function createServer() {
  return http.createServer((req, res) => {
    let rel;
    try { rel = decodeURIComponent(new URL(req.url, "http://x").pathname); }
    catch { res.writeHead(400); return res.end("Bad request"); }
    if (rel === "/__deny") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "X-Frame-Options": "DENY", "Cache-Control": "no-cache" });
      return res.end("<!doctype html><title>denied</title><p>This page refuses to be framed.</p>");
    }
    if (rel === "/__hang") { // test helper: answers late so embed timeouts can be exercised
      setTimeout(() => { if (!res.writableEnded) { res.writeHead(200, { "Content-Type": "text/html" }); res.end("<p>late</p>"); } }, 2500);
      return;
    }
    if (rel.endsWith("/")) rel += "index.html";
    const file = path.join(ROOT, rel);
    if (file !== ROOT && !file.startsWith(ROOT + path.sep)) { res.writeHead(403); return res.end("Forbidden"); }
    fs.stat(file, (err, st) => {
      if (err || !st.isFile()) { res.writeHead(404, { "Content-Type": "text/plain" }); return res.end("Not found"); }
      const base = {
        "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
        "Cache-Control": "no-cache", "Accept-Ranges": "bytes",
      };
      const range = req.headers.range ? parseRange(req.headers.range, st.size) : null;
      if (range === "bad") {
        res.writeHead(416, { ...base, "Content-Range": "bytes */" + st.size });
        return res.end();
      }
      if (range) {
        res.writeHead(206, { ...base, "Content-Range": `bytes ${range.start}-${range.end}/${st.size}`, "Content-Length": range.end - range.start + 1 });
        return fs.createReadStream(file, { start: range.start, end: range.end }).pipe(res);
      }
      res.writeHead(200, { ...base, "Content-Length": st.size });
      fs.createReadStream(file).pipe(res);
    });
  });
}

function start(port = 4310) {
  return new Promise((resolve, reject) => {
    const s = createServer();
    s.once("error", reject);
    s.listen(port, "127.0.0.1", () => resolve(s));
  });
}

module.exports = { createServer, start };
if (require.main === module) {
  const port = Number(process.env.PORT) || 4310;
  start(port).then(() => console.log("http://127.0.0.1:" + port + "/"));
}
