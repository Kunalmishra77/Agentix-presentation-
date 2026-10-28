(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  var NS = "http://www.w3.org/2000/svg";
  var COLORS = ["var(--orange)", "var(--ink)", "var(--teal, #1F9E8F)", "#9AA7B5", "#F5A57A"];

  /** SVG element helper. Attributes and text only; never innerHTML. */
  function S(tag, attrs) {
    var n = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { if (attrs[k] != null) n.setAttribute(k, attrs[k]); });
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c == null || c === false) continue;
      n.appendChild(typeof c === "object" ? c : document.createTextNode(String(c)));
    }
    return n;
  }
  function num0(v) { v = Number(v); return isFinite(v) && v > 0 ? v : 0; }
  function tip(text) { return S("title", null, text); }
  function mount(host, svg) { host.textContent = ""; host.appendChild(svg); return svg; }
  function root(vw, vh, label) {
    return S("svg", { viewBox: "0 0 " + vw + " " + vh, width: "100%", class: "ch", role: "img", "aria-label": label || "Chart", preserveAspectRatio: "xMidYMid meet" });
  }
  function text(x, y, str, anchor, cls) {
    return S("text", { x: x, y: y, "text-anchor": anchor || "middle", class: "ch-axis" + (cls ? " " + cls : "") }, str);
  }
  function niceMax(v) {
    if (v <= 0) return 1;
    var p = Math.pow(10, Math.floor(Math.log(v) / Math.LN10)), m = v / p;
    return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p;
  }
  function short(n) {
    var a = Math.abs(n);
    if (a >= 1e7) return +(n / 1e7).toFixed(1) + "Cr";
    if (a >= 1e5) return +(n / 1e5).toFixed(1) + "L";
    if (a >= 1e3) return +(n / 1e3).toFixed(1) + "k";
    return String(+n.toFixed(1));
  }
  function grid(svg, L, T, R, B, max, ticks) {
    for (var i = 0; i <= ticks; i++) {
      var v = max * i / ticks, y = B - (B - T) * i / ticks;
      svg.appendChild(S("line", { x1: L, x2: R, y1: y, y2: y, class: "ch-grid" }));
      svg.appendChild(text(L - 8, y + 3, short(v), "end"));
    }
  }

  function line(host, d) {
    var VW = 600, VH = 260, L = 44, R = 584, T = 16, B = 224, labels = d.labels || [];
    var all = []; d.series.forEach(function (s) { all = all.concat(s.points); });
    var max = niceMax(Math.max.apply(null, all.concat([1])));
    var svg = root(VW, VH, "Line chart");
    grid(svg, L, T, R, B, max, 4);
    var n = labels.length, step = n > 1 ? (R - L) / (n - 1) : 0;
    function X(i) { return n > 1 ? L + step * i : (L + R) / 2; }
    function Y(v) { return B - (B - T) * v / max; }
    var every = Math.ceil(n / 8);
    labels.forEach(function (lb, i) { if (i % every === 0) svg.appendChild(text(X(i), B + 18, lb)); });
    d.series.forEach(function (s, si) {
      var col = COLORS[si % COLORS.length];
      var pts = s.points.map(function (v, i) { return [X(i), Y(v)]; });
      var path = pts.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" ");
      if (si === 0 && pts.length > 1) {
        svg.appendChild(S("path", { d: path + " L" + pts[pts.length - 1][0].toFixed(1) + " " + B + " L" + pts[0][0].toFixed(1) + " " + B + " Z", fill: col, class: "ch-area" }));
      }
      svg.appendChild(S("path", { d: path, fill: "none", stroke: col, "stroke-width": 2.5, "stroke-linecap": "round", "stroke-linejoin": "round", pathLength: 1, class: "ch-line" }));
      pts.forEach(function (p, i) {
        svg.appendChild(S("circle", { cx: p[0], cy: p[1], r: 4, fill: col, class: "ch-dot" }, tip(s.name + " · " + (labels[i] != null ? labels[i] : i + 1) + ": " + AX.fmt.num(s.points[i]))));
      });
    });
    if (d.series.length > 1) legend(svg, d.series.map(function (s, i) { return [s.name, COLORS[i % COLORS.length]]; }), VW, VH);
    mount(host, svg);
  }

  function legend(svg, items, VW, VH) {
    var x = 44;
    items.forEach(function (it) {
      svg.appendChild(S("rect", { x: x, y: VH - 14, width: 10, height: 10, rx: 2, fill: it[1] }));
      svg.appendChild(text(x + 15, VH - 5, it[0], "start"));
      x += 30 + it[0].length * 6.5;
    });
  }

  function bar(host, d) {
    var labels = d.labels || [], vals = (d.values || []).map(num0), max = niceMax(Math.max.apply(null, vals.concat([1])));
    var svg;
    if (d.horizontal) {
      var rowH = 34, VH = Math.max(120, labels.length * rowH + 30), L = 110, R = 560;
      svg = root(600, VH, "Bar chart");
      labels.forEach(function (lb, i) {
        var y = 10 + i * rowH, bw = (R - L) * vals[i] / max;
        svg.appendChild(text(L - 8, y + 17, lb, "end"));
        svg.appendChild(S("rect", { x: L, y: y + 4, width: Math.max(bw, 1), height: 20, rx: 4, fill: COLORS[0], class: "ch-bar ch-bar-h" }, tip(lb + ": " + AX.fmt.num(vals[i]))));
        svg.appendChild(text(L + bw + 6, y + 18, short(vals[i]), "start"));
      });
    } else {
      var VW = 600, T = 16, B = 224, L2 = 44, R2 = 584;
      svg = root(VW, 260, "Bar chart");
      grid(svg, L2, T, R2, B, max, 4);
      var n = labels.length, slot = (R2 - L2) / Math.max(n, 1), bw2 = Math.min(48, slot * 0.6);
      labels.forEach(function (lb, i) {
        var h = (B - T) * vals[i] / max, x = L2 + slot * i + (slot - bw2) / 2;
        svg.appendChild(S("rect", { x: x, y: B - h, width: bw2, height: h, rx: 4, fill: COLORS[0], class: "ch-bar", style: "transform-origin:" + (x + bw2 / 2) + "px " + B + "px" }, tip(lb + ": " + AX.fmt.num(vals[i]))));
        svg.appendChild(text(x + bw2 / 2, B + 18, lb));
      });
    }
    mount(host, svg);
  }

  function arc(cx, cy, r0, r1, a0, a1) {
    function p(r, a) { return (cx + r * Math.cos(a)).toFixed(2) + " " + (cy + r * Math.sin(a)).toFixed(2); }
    var large = a1 - a0 > Math.PI ? 1 : 0;
    return "M" + p(r1, a0) + " A" + r1 + " " + r1 + " 0 " + large + " 1 " + p(r1, a1) +
      " L" + p(r0, a1) + " A" + r0 + " " + r0 + " 0 " + large + " 0 " + p(r0, a0) + " Z";
  }

  function donut(host, d) {
    var parts = d.parts || [], total = parts.reduce(function (s, p) { return s + p.value; }, 0) || 1;
    var svg = root(420, 220, "Donut chart"), a = -Math.PI / 2, cx = 110, cy = 110;
    parts.forEach(function (p, i) {
      var sweep = p.value / total * Math.PI * 2;
      if (sweep >= Math.PI * 2 - 1e-6) sweep = Math.PI * 2 - 0.001;
      svg.appendChild(S("path", { d: arc(cx, cy, 62, 100, a, a + sweep), fill: COLORS[i % COLORS.length], class: "ch-slice", style: "animation-delay:" + (i * 90) + "ms" },
        tip(p.label + ": " + AX.fmt.num(p.value) + " (" + AX.fmt.pct(p.value / total * 100) + ")")));
      a += sweep;
    });
    svg.appendChild(S("text", { x: cx, y: cy + 6, "text-anchor": "middle", class: "ch-center" }, AX.fmt.num(total)));
    parts.forEach(function (p, i) {
      var y = 40 + i * 26;
      svg.appendChild(S("rect", { x: 240, y: y - 9, width: 11, height: 11, rx: 2, fill: COLORS[i % COLORS.length] }));
      svg.appendChild(text(258, y, p.label + " · " + AX.fmt.num(p.value), "start"));
    });
    mount(host, svg);
  }

  function funnel(host, d) {
    var steps = d.steps || [], max = Math.max.apply(null, steps.map(function (s) { return s.value; }).concat([1]));
    var rowH = 46, VH = steps.length * rowH + 10, svg = root(600, VH, "Funnel chart");
    steps.forEach(function (s, i) {
      var wd = 420 * s.value / max, y = 5 + i * rowH, x = 130 + (420 - wd) / 2;
      var conv = i && steps[i - 1].value > 0 ? " · " + AX.fmt.pct(s.value / steps[i - 1].value * 100) + " of previous" : "";
      svg.appendChild(text(122, y + 24, s.label, "end"));
      svg.appendChild(S("rect", { x: x, y: y, width: Math.max(wd, 2), height: rowH - 10, rx: 4, fill: i === 0 ? COLORS[1] : COLORS[0], class: "ch-bar ch-bar-h", style: "opacity:" + (1 - i * 0.12).toFixed(2) },
        tip(s.label + ": " + AX.fmt.num(s.value) + conv)));
      svg.appendChild(S("text", { x: 340, y: y + 24, "text-anchor": "middle", class: "ch-axis ch-on-bar" }, AX.fmt.num(s.value)));
    });
    mount(host, svg);
  }

  function gauge(host, d) {
    var v = Math.max(0, Math.min(100, num0(d.value))), svg = root(240, 150, "Gauge " + v + "%");
    var cx = 120, cy = 120;
    svg.appendChild(S("path", { d: arc(cx, cy, 70, 100, Math.PI, Math.PI * 2), class: "ch-track" }));
    svg.appendChild(S("path", { d: arc(cx, cy, 70, 100, Math.PI, Math.PI + Math.PI * Math.max(v, 0.5) / 100), fill: COLORS[0], class: "ch-slice" }, tip((d.label || "Value") + ": " + v + "%")));
    svg.appendChild(S("text", { x: cx, y: cy - 8, "text-anchor": "middle", class: "ch-center" }, Math.round(v) + "%"));
    svg.appendChild(text(cx, cy + 14, d.label || ""));
    mount(host, svg);
  }

  function spark(host, pts) {
    var VW = 120, VH = 36, max = Math.max.apply(null, pts), min = Math.min.apply(null, pts), rng = max - min || 1;
    pts = (pts || []).map(num0);
    var svg = root(VW, VH, "Sparkline"); svg.setAttribute("class", "ch ch-spark");
    var step = pts.length > 1 ? (VW - 4) / (pts.length - 1) : 0;
    var path = pts.map(function (v, i) { return (i ? "L" : "M") + (2 + i * step).toFixed(1) + " " + (VH - 4 - (VH - 8) * (v - min) / rng).toFixed(1); }).join(" ");
    if (pts.length === 1) svg.appendChild(S("circle", { cx: VW / 2, cy: VH / 2, r: 3, fill: COLORS[0], class: "ch-dot" }));
    else if (pts.length) svg.appendChild(S("path", { d: path, fill: "none", stroke: COLORS[0], "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round", pathLength: 1, class: "ch-line" }));
    mount(host, svg);
  }

  function kpis(host, d) {
    var el = AX.el;
    host.textContent = "";
    host.appendChild(el("div", { class: "kpis" }, (d.items || []).map(function (it) {
      var f = it.format && AX.fmt[it.format];
      var val = typeof it.value === "number" && f ? f(it.value) : String(it.value);
      var delta = null;
      if (typeof it.delta === "number") {
        var up = it.delta >= 0;
        delta = el("div", { class: "kpi-delta " + (up ? "up" : "down") }, (up ? "▲ " : "▼ ") + Math.abs(it.delta) + "%");
      }
      return el("div", { class: "kpi" },
        el("div", { class: "kpi-label" }, it.label),
        el("div", { class: "kpi-value" }, val), delta);
    })));
  }

  AX.charts = { line: line, bar: bar, donut: donut, funnel: funnel, gauge: gauge, spark: spark, kpis: kpis };
})(window);
