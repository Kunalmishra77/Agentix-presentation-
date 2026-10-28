/* Category index: an editorial list 01-11 with project count and status mix.
   Hovering a row floats up to three thumbnails after the cursor (pointer devices only). */
(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  var el = AX.el;
  var ORDER = ["live", "active", "proto", "concept"];
  var root, float, cache = {};

  function mix(list) {
    var c = {}; list.forEach(function (p) { c[p.status] = (c[p.status] || 0) + 1; });
    var bar = el("span", { class: "idx-mix", "aria-hidden": "true" }, ORDER.filter(function (s) { return c[s]; }).map(function (s) {
      return el("i", { class: "mx-" + s, style: "flex:" + c[s] });
    }));
    var text = ORDER.filter(function (s) { return c[s]; }).map(function (s) { return c[s] + " " + AX.ui.STATUS[s].toLowerCase(); }).join(", ");
    return [bar, el("span", { class: "idx-mixtext" }, text)];
  }

  function build() {
    var rows = (AX.categories || []).map(function (c) {
      var list = AX.lx.inCat(c.id);
      var a = el("a", { class: "idx-row", href: "#cat-" + c.id, "data-num": c.num, "data-cat": c.id },
        el("span", { class: "idx-num" }, c.num),
        el("span", { class: "idx-title" }, c.title),
        el("span", { class: "idx-meta" }, el("span", { class: "idx-count" }, list.length + (list.length === 1 ? " project" : " projects")), mix(list)),
        el("span", { class: "idx-go", "aria-hidden": "true" }));
      a.addEventListener("click", function (e) { e.preventDefault(); AX.landing.scrollTo("#cat-" + c.id); });
      return el("li", null, a);
    });
    root = el("section", { id: "index", class: "index", "aria-labelledby": "idx-h" },
      el("div", { class: "idx-head" },
        el("h2", { id: "idx-h", class: "idx-h" }, "The work, by category"),
        el("p", { class: "idx-lede" }, "Eleven kinds of problems we solve. Pick one to jump to its projects; every card opens a working demo.")),
      el("ol", { class: "idx-list" }, rows));
    return root;
  }

  function thumbs(id) {
    if (cache[id]) return cache[id];
    var list = AX.lx.inCat(id), withShots = list.filter(function (p) { return p.shots && p.shots.length; });
    var pick = (withShots.length ? withShots : list).slice(0, 3);
    cache[id] = pick.map(function (p, i) {
      var t = el("div", { class: "idx-thumb t" + i });
      if (p.shots && p.shots.length) t.appendChild(AX.lx.img(p.shots[0], { alt: "", sizes: "240px" }));
      else t.appendChild(AX.lx.fallback(p));
      return t;
    });
    return cache[id];
  }

  function setup(ctx) {
    var gsap = w.gsap;
    if (!ctx.reduced && gsap) {
      gsap.from(root.querySelectorAll(".idx-row"), {
        "--rule": 0, duration: 1.1, ease: "power3.out", stagger: 0.05,
        scrollTrigger: { trigger: root.querySelector(".idx-list"), start: "top 80%", once: true }
      });
    }
    if (!AX.lx.finePointer()) return;
    float = el("div", { class: "idx-float", "aria-hidden": "true" });
    document.body.appendChild(float);
    var fx = gsap ? gsap.quickTo(float, "x", { duration: ctx.reduced ? 0 : 0.5, ease: "power3.out" }) : null;
    var fy = gsap ? gsap.quickTo(float, "y", { duration: ctx.reduced ? 0 : 0.5, ease: "power3.out" }) : null;
    function move(e) {
      if (fx) { fx(e.clientX); fy(e.clientY); } else float.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px)";
    }
    Array.prototype.forEach.call(root.querySelectorAll(".idx-row"), function (row) {
      row.addEventListener("pointerenter", function (e) {
        if (e.pointerType && e.pointerType !== "mouse") return;
        float.textContent = "";
        thumbs(row.getAttribute("data-cat")).forEach(function (t) { float.appendChild(t); });
        if (gsap) { gsap.set(float, { x: e.clientX, y: e.clientY }); }
        float.classList.add("is-on");
      });
      row.addEventListener("pointermove", move);
      row.addEventListener("pointerleave", function () { float.classList.remove("is-on"); });
    });
    w.addEventListener("scroll", function () { if (float.classList.contains("is-on") && !root.matches(":hover")) float.classList.remove("is-on"); }, { passive: true });
  }

  AX.indexList = { build: build, setup: setup };
})(window);
