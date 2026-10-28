/* Shared helpers for the landing page (AX.lx). */
(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  var el = AX.el;

  var ACCENT = {
    agents: "#EE6A24", content: "#D2466E", crm: "#3A63D8", health: "#14917F", hospitality: "#B0761C",
    fitness: "#C8442C", platforms: "#6A4BD3", websites: "#0E7490", ecommerce: "#B23E6A", immersive: "#2E6650", delivery: "#0B1F33"
  };

  function mq(q) { return !!(w.matchMedia && w.matchMedia(q).matches); }
  function reduced() { return mq("(prefers-reduced-motion: reduce)"); }
  function finePointer() { return mq("(hover: hover) and (pointer: fine)"); }
  function cat(id) { return (AX.categories || []).filter(function (c) { return c.id === id; })[0]; }
  function inCat(id) { return (AX.projects || []).filter(function (p) { return p.category === id; }); }
  function project(slug) { return (AX.projects || []).filter(function (p) { return p.slug === slug; })[0]; }
  function accent(p) { return ACCENT[p && p.category] || ACCENT.agents; }

  /** <img> for a shot: lazy by default, srcset ready for 800w thumbs, fallback on error. */
  function img(shot, o) {
    o = o || {};
    var set = (shot.thumb ? shot.thumb + " 800w, " : "") + shot.src + " 1600w";
    var i = el("img", {
      src: shot.src, srcset: set, sizes: o.sizes || "(max-width: 768px) 90vw, 45vw",
      alt: o.alt == null ? (shot.caption || "") : o.alt, loading: o.eager ? "eager" : "lazy", decoding: "async",
      class: o.cls || null, draggable: "false"
    });
    if (o.onError) i.addEventListener("error", o.onError);
    return i;
  }

  /** Gradient fallback in the project accent with the product name set large. */
  function fallback(p) {
    return el("div", { class: "media-fallback", style: "--acc:" + accent(p), "aria-hidden": "true" },
      el("span", { class: "mf-mark" }, AX.ui.mark("mf-ax")),
      el("span", { class: "mf-name" }, p.name));
  }

  /** Media box: screenshot(s) when available, otherwise (or on error) the accent fallback. */
  function media(p, o) {
    o = o || {};
    var box = el("div", { class: "media " + (o.cls || ""), style: "--acc:" + accent(p) });
    var shots = (p.shots || []).slice(0, o.max || 1);
    if (!shots.length) { box.classList.add("is-fallback"); box.appendChild(fallback(p)); return box; }
    var failed = false;
    function fail() {
      if (failed) return; failed = true;
      box.classList.add("is-fallback");
      Array.prototype.forEach.call(box.querySelectorAll("img"), function (n) { n.remove(); });
      box.insertBefore(fallback(p), box.firstChild);
    }
    shots.forEach(function (s, i) {
      box.appendChild(img(s, { eager: o.eager && i === 0, alt: i === 0 ? p.name + ": " + (s.caption || "screenshot") : "", cls: "shot-" + i, sizes: o.sizes, onError: fail }));
    });
    return box;
  }

  /** True for clicks the browser should handle itself (new tab/window, middle click). */
  function modified(e) { return !!(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e.button != null && e.button !== 0)); }

  AX.lx = { modified: modified, ACCENT: ACCENT, reduced: reduced, finePointer: finePointer, cat: cat, inCat: inCat, project: project, accent: accent, img: img, media: media, fallback: fallback, mq: mq };
})(window);
