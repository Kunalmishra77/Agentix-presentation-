(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  var NW = 170, NH = 64, PAD = 24, STEP = 600, THRESHOLD = 6;
  var NS = "http://www.w3.org/2000/svg";
  var KIND = { trigger: "Trigger", condition: "Condition", ai: "AI", action: "Action", delay: "Delay", end: "End" };

  function reduced() {
    try { return !!(w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch (e) { return false; }
  }
  function svg(tag, attrs) {
    var n = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }

  /** Pure: bezier path between node boxes a -> b. */
  function edgePath(a, b) {
    var x1, y1, x2, y2, c1x, c1y, c2x, c2y;
    if (b.x >= a.x + NW - 20) {
      x1 = a.x + NW; y1 = a.y + NH / 2; x2 = b.x; y2 = b.y + NH / 2;
      var dx = Math.max(40, (x2 - x1) / 2);
      c1x = x1 + dx; c1y = y1; c2x = x2 - dx; c2y = y2;
    } else {
      var down = b.y >= a.y;
      x1 = a.x + NW / 2; y1 = down ? a.y + NH : a.y; x2 = b.x + NW / 2; y2 = down ? b.y : b.y + NH;
      var dy = Math.max(40, Math.abs(y2 - y1) / 2) * (down ? 1 : -1);
      c1x = x1; c1y = y1 + dy; c2x = x2; c2y = y2 - dy;
    }
    return { d: "M" + x1 + " " + y1 + " C" + c1x + " " + c1y + " " + c2x + " " + c2y + " " + x2 + " " + y2, mx: (x1 + x2) / 2, my: (y1 + y2) / 2 };
  }

  function create(host, opt) {
    var el = AX.el;
    var nodes = (opt.nodes || []).map(function (n) { return Object.assign({}, n); });
    var edges = (opt.edges || []).map(function (e) { return e.slice(); });
    var timers = [], destroyed = false, runId = 0, dragStop = null;

    var svgEl = svg("svg", { class: "fl-svg", "aria-hidden": "true" });
    var defs = svg("defs");
    var marker = svg("marker", { id: "fl-arrow-" + Math.random().toString(36).slice(2, 7), viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" });
    marker.appendChild(svg("path", { d: "M0 0L10 5L0 10z", class: "fl-arrow" }));
    defs.appendChild(marker); svgEl.appendChild(defs);
    var markerId = marker.getAttribute("id");
    var nodeLayer = el("div", { class: "fl-nodes" });
    var canvas = el("div", { class: "fl-canvas" }, svgEl, nodeLayer);
    var scroll = el("div", { class: "fl-scroll", tabindex: "0", "aria-label": "Flow canvas" }, canvas);
    var logEl = el("ol", { class: "fl-log", "aria-label": "Execution log" });
    var logWrap = el("div", { class: "fl-logwrap" },
      el("div", { class: "fl-logtitle" }, "Execution log"), logEl);
    var runBtn = el("button", { type: "button", class: "btn btn-primary fl-run", on: { click: function () { run(); } } }, "Run flow");
    var root = el("div", { class: "fl" }, el("div", { class: "fl-bar" }, runBtn), scroll, logWrap);
    host.textContent = "";
    host.appendChild(root);

    var nodeEls = {}, edgeEls = [];

    function byId(id) { return nodes.filter(function (n) { return n.id === id; })[0]; }
    function size() {
      var mx = 0, my = 0;
      nodes.forEach(function (n) { mx = Math.max(mx, n.x + NW); my = Math.max(my, n.y + NH); });
      canvas.style.width = (mx + PAD) + "px"; canvas.style.height = (my + PAD) + "px";
      svgEl.setAttribute("width", mx + PAD); svgEl.setAttribute("height", my + PAD);
    }
    function drawEdges() {
      edgeEls.forEach(function (g) { if (g.parentNode) g.parentNode.removeChild(g); });
      edgeEls = edges.map(function (e, i) {
        var a = byId(e[0]), b = byId(e[1]);
        if (!a || !b) return null;
        var p = edgePath(a, b);
        var g = svg("g", { class: "fl-edgeg", "data-from": e[0], "data-to": e[1] });
        g.appendChild(svg("path", { class: "fl-edge", d: p.d, fill: "none", "marker-end": "url(#" + markerId + ")" }));
        if (e[2]) {
          var t = svg("text", { class: "fl-elabel", x: p.mx, y: p.my - 6, "text-anchor": "middle" });
          t.textContent = e[2]; g.appendChild(t);
        }
        svgEl.appendChild(g);
        return g;
      }).filter(Boolean);
    }
    function place(n) { var d = nodeEls[n.id]; d.style.left = n.x + "px"; d.style.top = n.y + "px"; }

    function onDown(e, node, n) {
      if (e.button != null && e.button !== 0) return;
      if (dragStop) dragStop();
      var sx = e.clientX, sy = e.clientY, ox = n.x, oy = n.y, active = false, pid = e.pointerId;
      function stop() {
        document.removeEventListener("pointermove", mv);
        document.removeEventListener("pointerup", up);
        document.removeEventListener("pointercancel", up);
        try { node.releasePointerCapture(pid); } catch (err) {}
        node.classList.remove("dragging");
        dragStop = null;
      }
      function mv(ev) {
        if (ev.pointerId !== pid) return;
        var dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (!active) {
          if (Math.sqrt(dx * dx + dy * dy) < THRESHOLD) return;
          active = true; node.classList.add("dragging");
          try { node.setPointerCapture(pid); } catch (err) {}
        }
        if (ev.cancelable) ev.preventDefault();
        n.x = Math.max(0, ox + dx); n.y = Math.max(0, oy + dy);
        place(n); drawEdges(); size();
      }
      function up(ev) { if (ev.pointerId === pid) stop(); }
      document.addEventListener("pointermove", mv);
      document.addEventListener("pointerup", up);
      document.addEventListener("pointercancel", up);
      dragStop = stop;
    }

    function drawNodes() {
      nodeLayer.textContent = "";
      nodes.forEach(function (n) {
        var d = el("div", { class: "fl-node k-" + n.kind, "data-id": n.id, tabindex: "0",
          "aria-label": (KIND[n.kind] || n.kind) + ": " + n.label,
          on: { pointerdown: function (e) { onDown(e, d, n); } } },
          el("span", { class: "fl-kind" }, KIND[n.kind] || n.kind),
          el("span", { class: "fl-label" }, n.label),
          n.detail ? el("span", { class: "fl-detail" }, n.detail) : null);
        nodeEls[n.id] = d;
        nodeLayer.appendChild(d);
        place(n);
      });
    }

    function later(ms) {
      if (!ms) return Promise.resolve();
      return new Promise(function (res) {
        var t = setTimeout(function () { var i = timers.indexOf(t); if (i >= 0) timers.splice(i, 1); res(); }, ms);
        timers.push(t);
      });
    }

    /** BFS order from start, following edge order. Pure. */
    function order(startId) {
      var seen = {}, out = [], q = [startId];
      seen[startId] = true;
      while (q.length) {
        var id = q.shift(); out.push(id);
        edges.forEach(function (e) { if (e[0] === id && !seen[e[1]] && byId(e[1])) { seen[e[1]] = true; q.push(e[1]); } });
      }
      return out;
    }

    function reset() {
      Object.keys(nodeEls).forEach(function (k) { nodeEls[k].classList.remove("visited", "active"); });
      edgeEls.forEach(function (g) { g.classList.remove("on"); });
      logEl.textContent = "";
    }

    function run(startId) {
      var id = startId;
      if (!id) {
        var trig = nodes.filter(function (n) { return n.kind === "trigger"; })[0];
        id = (trig || nodes[0] || {}).id;
      }
      if (!id || !byId(id)) return Promise.resolve();
      var mine = ++runId;
      timers.forEach(clearTimeout); timers = [];
      reset();
      var ms = reduced() ? 0 : STEP;
      runBtn.disabled = true;
      var seq = order(id), i = 0, prev = null;
      function step() {
        if (destroyed || mine !== runId) return Promise.resolve();
        if (i >= seq.length) { runBtn.disabled = false; logEl.appendChild(el("li", { class: "fl-done" }, "Flow finished")); return Promise.resolve(); }
        var n = byId(seq[i]), d = nodeEls[n.id];
        i++;
        d.classList.add("active");
        edgeEls.forEach(function (g) { if (g.getAttribute("data-to") === n.id && prev !== null) g.classList.add("on"); });
        logEl.appendChild(el("li", {}, "Step " + i + " · " + (KIND[n.kind] || n.kind) + " — " + n.label + (n.detail ? " (" + n.detail + ")" : "")));
        logEl.scrollTop = logEl.scrollHeight;
        prev = n.id;
        return later(ms).then(function () {
          if (destroyed || mine !== runId) return;
          d.classList.remove("active"); d.classList.add("visited");
          return step();
        });
      }
      return step();
    }

    function destroy() {
      destroyed = true;
      timers.forEach(clearTimeout); timers = [];
      if (dragStop) dragStop();
    }

    size(); drawNodes(); drawEdges();
    AX.mount(host, destroy);
    return { run: run, reset: reset };
  }

  AX.flow = { create: create, edgePath: edgePath };
})(window);
