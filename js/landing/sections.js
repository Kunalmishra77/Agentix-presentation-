/* Category sections and project cards. Each category layout is different:
   flagship (sticky story + device cards), control (control room + live KPI chips),
   rail (pinned horizontal rail of browser frames), poster (masonry wall). Delivery is in delivery.js. */
(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  var el = AX.el;
  var root, cards = [], sections = [], tickers = [];

  /* ---------------- cards ---------------- */
  function host(url) { try { return new URL(url).host.replace(/^www\./, ""); } catch (e) { return ""; } }
  function tags(p) { return (p.features || []).slice(0, 3).map(function (f) { return el("span", { class: "pc-tag" }, f.group); }); }

  function chrome(p, variant) {
    if (variant === "browser") {
      return el("div", { class: "pc-chrome pc-chrome--browser", "aria-hidden": "true" }, el("i"), el("i"), el("i"),
        el("span", { class: "pc-url" }, host(p.liveUrl) || p.slug + ".app"));
    }
    if (variant === "device" || variant === "control") {
      return el("div", { class: "pc-chrome pc-chrome--app", "aria-hidden": "true" }, AX.ui.mark("pc-chrome-mark"), el("span", null, p.name), el("span", { class: "pc-live" }));
    }
    return null;
  }

  function mediaFor(p, variant) {
    var sizes = variant === "poster" ? "(max-width: 768px) 50vw, 24vw" : variant === "browser" ? "(max-width: 768px) 86vw, 40vw" : "(max-width: 768px) 92vw, 46vw";
    var m = AX.lx.media(p, { max: variant === "device" || variant === "control" ? 1 : 2, sizes: sizes, cls: "pc-media pc-media--" + variant });
    var imgs = m.querySelectorAll("img");
    if (variant === "poster" && imgs.length) {
      // third frame: the first screen again, framed lower and closer (same URL, no extra request)
      var f3 = AX.lx.img(p.shots[0], { alt: "", cls: "shot-2", sizes: sizes });
      f3.addEventListener("error", function () { f3.remove(); });
      m.appendChild(f3);
      m.classList.add("frames-" + m.querySelectorAll("img").length);
    }
    if (variant === "browser" && imgs.length) {
      var strip = el("div", { class: "pc-strip" });
      Array.prototype.forEach.call(imgs, function (i) { strip.appendChild(i); });
      m.appendChild(strip);
      m.classList.add("strip-" + imgs.length);
    }
    m.appendChild(el("span", { class: "pc-scrim", "aria-hidden": "true" }));
    m.appendChild(el("span", { class: "pc-badge" }, AX.ui.agentixBadge({ size: "sm" })));
    return m;
  }

  /** AX.cards.render(project, "device"|"browser"|"poster"|"control") -> <a.pcard data-demo=slug> */
  function render(p, variant) {
    variant = ["device", "browser", "poster", "control"].indexOf(variant) >= 0 ? variant : "device";
    var media = mediaFor(p, variant);
    var a = el("a", { class: "pcard pcard--" + variant, href: "#/demo/" + p.slug, "data-demo": p.slug, "data-status": p.status, "data-cat": p.category,
      "aria-label": p.name + ", " + p.client + ". Open demo" },
      el("div", { class: "pc-frame" }, chrome(p, variant), media),
      el("div", { class: "pc-band" },
        el("div", { class: "pc-top" }, el("h3", { class: "pc-name" }, p.name), AX.ui.statusChip(p.status)),
        el("p", { class: "pc-client" }, p.client),
        el("p", { class: "pc-sum" }, p.summary),
        el("div", { class: "pc-foot" }, el("div", { class: "pc-tags" }, tags(p)), el("span", { class: "pc-open" }, "Open demo →"))));
    a.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      AX.shell.open(p.slug, "overview", null, a.querySelector(".pc-frame").getBoundingClientRect());
    });
    return a;
  }

  /* ---------------- section layouts ---------------- */
  function head(c, list, extra) {
    return el("header", { class: "cat-head" },
      el("span", { class: "cat-num" }, c.num),
      el("h2", { class: "cat-title" }, c.title),
      el("p", { class: "cat-statement" }, c.statement),
      el("p", { class: "cat-count" }, list.length + (list.length === 1 ? " project" : " projects")),
      extra || null);
  }

  function flagship(c, list) {
    var cs = list.map(function (p, i) { var k = render(p, "device"); if (i === 0) k.classList.add("is-lead"); return k; });
    var names = el("ol", { class: "cat-names" }, list.map(function (p, i) {
      return el("li", { "data-for": p.slug }, el("button", { type: "button", on: { click: function () { AX.landing.scrollTo(cs[i], { offset: -110 }); } } }, p.name));
    }));
    return { node: [el("div", { class: "cat-side" }, head(c, list, names)), el("div", { class: "cat-cards" }, cs)], cards: cs };
  }

  var KPIS = {
    health: [["OPD visits today", 1284, "num"], ["Avg wait", 14, "min"], ["Beds occupied", 87, "pct"], ["Lab turnaround", 3.2, "hrs"]],
    hospitality: [["Occupancy", 82, "pct"], ["ADR", 6450, "inr"], ["RevPAR", 5289, "inr"], ["Check-ins today", 37, "num"]],
    fitness: [["Active members", 1126, "num"], ["Renewals due", 48, "num"], ["Check-ins today", 312, "num"], ["Leads this week", 64, "num"]]
  };
  function fmtK(v, kind) {
    if (kind === "inr") return AX.fmt.inr(v);
    if (kind === "pct") return Math.round(v) + "%";
    if (kind === "min") return Math.round(v) + " min";
    if (kind === "hrs") return v.toFixed(1) + " h";
    return AX.fmt.num(v);
  }
  function kpiStrip(id, reduced) {
    var defs = KPIS[id] || KPIS.health;
    var items = defs.map(function (d, i) {
      var hist = AX.fake ? AX.fake.series(id + i, 14, d[1] * 0.85, d[1] * 1.05) : [d[1]];
      hist[hist.length - 1] = d[1];
      var val = el("b", { class: "kc-val" }, fmtK(d[1], d[2]));
      var spark = el("span", { class: "kc-spark" });
      if (AX.charts && AX.charts.spark) AX.charts.spark(spark, hist);
      return { d: d, v: d[1], hist: hist, val: val, spark: spark, node: el("div", { class: "kpi-chip" }, el("small", { class: "kc-label" }, d[0]), val, spark) };
    });
    var strip = el("div", { class: "kpi-strip", "aria-label": "Live demo metrics (simulated)" },
      el("span", { class: "kpi-live" }, el("i"), "Live, simulated"), items.map(function (x) { return x.node; }));
    if (!reduced) {
      var t = { strip: strip, timer: null, on: false };
      t.tick = function () {
        items.forEach(function (x) {
          var step = x.d[2] === "hrs" ? 0.1 : x.d[2] === "pct" || x.d[2] === "min" ? 1 : Math.max(1, Math.round(x.d[1] * 0.004));
          var dir = Math.random() < 0.62 ? 1 : -1;
          if (x.d[0] === "Avg wait" || x.d[0] === "Lab turnaround") dir = -dir;
          x.v = Math.max(0, x.v + dir * step * (1 + Math.floor(Math.random() * 3)));
          if (x.d[2] === "pct") x.v = Math.min(99, x.v);
          x.hist.push(x.v); x.hist.shift();
          x.val.textContent = fmtK(x.v, x.d[2]);
          x.node.classList.remove("flash"); void x.node.offsetWidth; x.node.classList.add("flash");
          if (AX.charts && AX.charts.spark) AX.charts.spark(x.spark, x.hist);
        });
      };
      tickers.push(t);
    }
    return strip;
  }

  function control(c, list, ctx) {
    var big = render(list[0], "control");
    var rest = list.slice(1).map(function (p) { return render(p, "device"); });
    return { node: [head(c, list, kpiStrip(c.id, ctx.reduced)), el("div", { class: "ctl-grid" }, el("div", { class: "ctl-main" }, big), el("div", { class: "ctl-side" }, rest))], cards: [big].concat(rest) };
  }

  function rail(c, list) {
    var cs = list.map(function (p) { return render(p, "browser"); });
    var track = el("div", { class: "rail-track" }, cs);
    return { node: el("div", { class: "rail-pin" }, head(c, list, el("p", { class: "rail-hint", "aria-hidden": "true" }, "Scroll to move along the rail")), el("div", { class: "rail-viewport", tabindex: "0", "aria-label": c.title + " projects" }, track)), cards: cs };
  }

  function poster(c, list) {
    var cs = list.map(function (p, i) { var k = render(p, "poster"); k.classList.add("tall-" + (i % 3)); return k; });
    return { node: [head(c, list), el("div", { class: "poster-wall" }, cs)], cards: cs };
  }

  var LAYOUTS = { flagship: flagship, control: control, rail: rail, poster: poster };

  function build(ctx) {
    cards = []; sections = []; tickers = [];
    root = el("div", { id: "work", class: "work" });
    (AX.categories || []).forEach(function (c) {
      var list = AX.lx.inCat(c.id);
      if (c.layout === "pipeline") {
        var strip = AX.delivery && AX.delivery.strip ? AX.delivery.strip(c, list, ctx) : el("section", { id: "cat-" + c.id, class: "cat cat--pipeline" }, head(c, list));
        root.appendChild(strip);
        return;
      }
      var fn = LAYOUTS[c.layout] || flagship, out = fn(c, list, ctx);
      var sec = el("section", { id: "cat-" + c.id, class: "cat cat--" + (LAYOUTS[c.layout] ? c.layout : "flagship"), "data-cat": c.id, "aria-labelledby": "h-" + c.id }, out.node);
      sec.querySelector(".cat-title").id = "h-" + c.id;
      root.appendChild(sec);
      sections.push({ sec: sec, cat: c, cards: out.cards });
      cards = cards.concat(out.cards);
    });
    return root;
  }

  /* ---------------- motion ---------------- */
  function setup(ctx) {
    var gsap = w.gsap, ST = w.ScrollTrigger;
    var io = "IntersectionObserver" in w ? new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        var t = e.target.__ticker;
        if (t) {
          if (e.isIntersecting && !t.timer) t.timer = setInterval(t.tick, 2500);
          else if (!e.isIntersecting && t.timer) { clearInterval(t.timer); t.timer = null; }
          return;
        }
        e.target.classList.toggle("in-view", e.isIntersecting);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.35 }) : null;
    tickers.forEach(function (t) { t.strip.__ticker = t; if (io) io.observe(t.strip); });
    if (ctx.reduced || !gsap || !ST) return;
    // browser-frame screenshots scroll while in view
    cards.forEach(function (k) { if (k.classList.contains("pcard--browser") && io) io.observe(k); });

    var mm = gsap.matchMedia();
    sections.forEach(function (s) {
      var lay = s.cat.layout;
      if (lay === "flagship") {
        s.cards.forEach(function (k) {
          gsap.fromTo(k.querySelector(".pc-frame"), { rotationX: 16, y: 90, transformPerspective: 1400, transformOrigin: "50% 100%" },
            { rotationX: 0, y: 0, ease: "power2.out", scrollTrigger: { trigger: k, start: "top bottom", end: "top 62%", scrub: 0.6 } });
        });
      }
      if (lay === "control") {
        var main = s.sec.querySelector(".ctl-main .pc-frame");
        gsap.fromTo(main, { clipPath: "inset(12% 8% 12% 8% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 18px)", ease: "none",
          scrollTrigger: { trigger: s.sec.querySelector(".ctl-grid"), start: "top 90%", end: "top 45%", scrub: 0.5 } });
      }
      if (lay === "rail") {
        var pin = s.sec.querySelector(".rail-pin"), track = s.sec.querySelector(".rail-track"), vp = s.sec.querySelector(".rail-viewport");
        mm.add("(min-width: 768px)", function () {
          var dist = function () { return Math.max(0, track.scrollWidth - vp.clientWidth); };
          gsap.to(track, { x: function () { return -dist(); }, ease: "none",
            scrollTrigger: { id: "rail-" + s.cat.id, trigger: pin, start: "top top", end: function () { return "+=" + Math.max(1, dist()); },
              pin: true, scrub: 0.6, invalidateOnRefresh: true } });
        });
      }
      if (lay === "poster") {
        var cols = s.sec.querySelectorAll(".pcard");
        Array.prototype.forEach.call(cols, function (k, i) {
          gsap.fromTo(k, { y: 40 + (i % 4) * 24 }, { y: 0, ease: "none", scrollTrigger: { trigger: k, start: "top bottom", end: "top 55%", scrub: 0.8 } });
        });
      }
    });
  }

  /* ---------------- filter (search + status) ---------------- */
  function norm(s) { return String(s || "").toLowerCase(); }
  function filter(state) {
    var q = norm(state.q).trim(), status = state.status || "";
    var active = !!(q || status), shown = 0;
    sections.forEach(function (s) {
      var n = 0;
      s.cards.forEach(function (k) {
        var p = AX.lx.project(k.getAttribute("data-demo"));
        var hay = norm(p.name) + " " + norm(p.client) + " " + norm(s.cat.title);
        var ok = (!q || hay.indexOf(q) >= 0) && (!status || p.status === status);
        k.hidden = !ok;
        var li = s.sec.querySelector('.cat-names li[data-for="' + p.slug + '"]'); if (li) li.hidden = !ok;
        if (ok) n++;
      });
      s.sec.hidden = active && n === 0;
      var cnt = s.sec.querySelector(".cat-count");
      if (cnt) cnt.textContent = active ? n + " of " + s.cards.length + " shown" : s.cards.length + (s.cards.length === 1 ? " project" : " projects");
      shown += n;
    });
    return { shown: shown, total: cards.length };
  }

  AX.cards = { render: render };
  AX.sections = { build: build, setup: setup, filter: filter };
})(window);
