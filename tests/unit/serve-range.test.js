"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { start } = require("../../tools/serve");

function get(port, path, headers) {
  return new Promise((resolve, reject) => {
    http.get({ host: "127.0.0.1", port, path, headers }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
    }).on("error", reject);
  });
}

test("dev server honours single Range requests", async () => {
  const s = await start(0);
  const port = s.address().port;
  try {
    const full = await get(port, "/package.json");
    assert.equal(full.status, 200);
    assert.equal(full.headers["accept-ranges"], "bytes");
    const size = full.body.length;

    const part = await get(port, "/package.json", { Range: "bytes=0-9" });
    assert.equal(part.status, 206);
    assert.equal(part.headers["content-range"], "bytes 0-9/" + size);
    assert.equal(part.headers["content-length"], "10");
    assert.deepEqual(part.body, full.body.subarray(0, 10));

    const open = await get(port, "/package.json", { Range: "bytes=5-" });
    assert.equal(open.status, 206);
    assert.equal(open.headers["content-range"], "bytes 5-" + (size - 1) + "/" + size);
    assert.deepEqual(open.body, full.body.subarray(5));

    const suffix = await get(port, "/package.json", { Range: "bytes=-7" });
    assert.equal(suffix.status, 206);
    assert.deepEqual(suffix.body, full.body.subarray(size - 7));

    const clamp = await get(port, "/package.json", { Range: "bytes=0-999999" });
    assert.equal(clamp.status, 206);
    assert.deepEqual(clamp.body, full.body);

    const big = await get(port, "/package.json", { Range: "bytes=-999999" });
    assert.equal(big.status, 206);
    assert.equal(big.headers["content-range"], "bytes 0-" + (size - 1) + "/" + size);
    assert.deepEqual(big.body, full.body);

    const inverted = await get(port, "/package.json", { Range: "bytes=5-2" });
    assert.equal(inverted.status, 200);
    assert.deepEqual(inverted.body, full.body);

    const head = await new Promise((resolve, reject) => {
      http.request({ host: "127.0.0.1", port, path: "/package.json", method: "HEAD", headers: { Range: "bytes=0-3" } }, (res) => {
        let n = 0; res.on("data", (c) => { n += c.length; }); res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, n }));
      }).on("error", reject).end();
    });
    assert.equal(head.status, 206);
    assert.equal(head.headers["content-length"], "4");
    assert.equal(head.n, 0);

    const bad = await get(port, "/package.json", { Range: "bytes=" + (size + 50) + "-" });
    assert.equal(bad.status, 416);
    assert.equal(bad.headers["content-range"], "bytes */" + size);
  } finally { await new Promise((r) => s.close(r)); }
});
