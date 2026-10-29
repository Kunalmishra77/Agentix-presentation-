(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  var el = AX.el;

  /* Small lucide-like icon set (24x24, stroke). Unknown names fall back to a generic square. */
  var ICONS = {
    dashboard: '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    table: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>',
    board: '<rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="4" height="8" rx="1"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    flow: '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M9 6h3a3 3 0 0 1 3 3v6"/>',
    pipeline: '<path d="M4 6h16M4 12h10M4 18h6"/><circle cx="19" cy="12" r="2"/>',
    store: '<path d="M3 9l1-5h16l1 5"/><path d="M4 9v11h16V9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/>',
    cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l3 12h11l2-8H6"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/>',
    bed: '<path d="M2 18V6M2 14h20v4M22 14v-2a4 4 0 0 0-4-4h-8v6"/><circle cx="6" cy="11" r="1.5"/>',
    heart: '<path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
    wallet: '<path d="M3 7a2 2 0 0 1 2-2h14v4"/><path d="M3 7v11a2 2 0 0 0 2 2h16V9H5a2 2 0 0 1-2-2z"/><circle cx="17" cy="14.5" r="1"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    form: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M10 21a2 2 0 0 0 4 0"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    flask: '<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9V3"/>',
    box: '<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
    star: '<path d="M12 2l3 6.9 7.5.7-5.7 5 1.7 7.4L12 18l-6.5 4 1.7-7.4-5.7-5 7.5-.7z"/>',
    generic: '<rect x="4" y="4" width="16" height="16" rx="3"/>'
  };
  function icon(name) {
    return el("span", { class: "ax-ico", "aria-hidden": "true",
      html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (Object.prototype.hasOwnProperty.call(ICONS, name) ? ICONS[name] : ICONS.generic) + "</svg>" });
  }

  /* Exact callback keys are passed through untouched; any other top-level function value is evaluated as (ctx) -> value.
     Items inside arrays (charts[], fields[], columns[]...) are NOT function-resolved. */
  var CALLBACK = /^(on[A-Z]\w*|render|renderCard|drawer|drawerTitle|format|validate|filter|sort|match|compare)$/;
  function resolve(view, ctx) {
    if (typeof view === "function") view = view(ctx);
    var out = {};
    Object.keys(view || {}).forEach(function (k) {
      var v = view[k];
      out[k] = (typeof v === "function" && !CALLBACK.test(k)) ? v(ctx) : v;
    });
    return out;
  }
  function strip(o, drop) {
    var r = {};
    Object.keys(o).forEach(function (k) { if (k !== "type" && drop.indexOf(k) < 0) r[k] = o[k]; });
    return r;
  }

  var VIEWS = {};

  VIEWS.dashboard = function (host, v, ctx) {
    var k = v.kpis;
    var kHost = el("div", { class: "ax-kpis" });
    host.appendChild(kHost);
    AX.charts.kpis(kHost, Array.isArray(k) ? { items: k } : (k || { items: [] }));
    var grid = el("div", { class: "ax-charts" });
    host.appendChild(grid);
    (v.charts || []).forEach(function (c) {
      var slot = el("div", { class: "chart-slot" });
      grid.appendChild(el("section", { class: "ax-card" + (c.wide ? " wide" : "") }, el("h3", { class: "ax-card-title" }, c.title || ""), slot));
      var fn = AX.charts[c.type];
      if (fn) fn(slot, c.type === "spark" ? (c.values || c.data || []) : strip(c, ["title", "wide"]));
    });
  };

  VIEWS.table = function (host, v, ctx) {
    var opt = strip(v, ["drawer", "drawerTitle"]);
    if (v.drawer && !opt.onRow) {
      opt.onRow = function (row) {
        var title = typeof v.drawerTitle === "function" ? v.drawerTitle(row, ctx) : (row.name || row.title || row.id || "Details");
        AX.ui.drawer({ title: title, body: v.drawer(row, ctx) });
      };
    }
    AX.table.create(host, opt);
  };

  ["board", "chat", "flow", "pipeline", "store"].forEach(function (t) {
    // the engine instance stays reachable as moduleEl.__axView (e.g. chat.play / chat.push from custom code)
    VIEWS[t] = function (host, v) { host.__axView = AX[t].create(host, strip(v, [])); };
  });
  VIEWS.calendar = function (host, v) { AX.calendar.month(host, strip(v, [])); };
  VIEWS.tape = function (host, v) { AX.calendar.tape(host, strip(v, [])); };
  VIEWS.embed = function (host, v) { AX.embed.create(host, strip(v, [])); };

  VIEWS.form = function (host, v, ctx) {
    var inputs = {}, result = el("div", { class: "ax-form-result", "aria-live": "polite" });
    var form = el("form", { class: "ax-form", novalidate: "" });
    (v.fields || []).forEach(function (f) {
      var inp;
      var id = "axf-" + f.key + "-" + Math.random().toString(36).slice(2, 6);
      if (f.type === "select") {
        inp = el("select", { id: id }, (f.options || []).map(function (o) {
          var val = typeof o === "object" ? o.value : o, lab = typeof o === "object" ? o.label : o;
          return el("option", { value: val }, lab);
        }));
      } else if (f.type === "textarea") inp = el("textarea", { id: id, rows: "3" });
      else if (f.type === "toggle") inp = el("input", { id: id, type: "checkbox", class: "ax-toggle" });
      else inp = el("input", { id: id, type: f.type === "date" ? "date" : f.type === "number" ? "number" : "text" });
      inputs[f.key] = inp;
      form.appendChild(el("div", { class: "ax-field" + (f.type === "toggle" ? " inline" : "") }, el("label", { for: id }, f.label || f.key), inp));
    });
    form.appendChild(el("button", { type: "submit", class: "ax-btn primary" }, v.submit || "Submit"));
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var vals = {};
      (v.fields || []).forEach(function (f) {
        var i = inputs[f.key];
        vals[f.key] = f.type === "toggle" ? i.checked : f.type === "number" ? (i.value === "" ? null : +i.value) : i.value;
      });
      result.textContent = "";
      // onSubmit handlers often raise their own, more specific simulated toast; add the generic one only if none appeared
      var box = document.getElementById("toasts") || document.body, before = box.querySelectorAll(".toast-sim").length;
      var out = v.onSubmit ? v.onSubmit(vals, ctx) : null;
      if (out && out.nodeType) result.appendChild(out);
      if (box.querySelectorAll(".toast-sim").length === before) AX.ui.toast(AX.ui.SIM_DEFAULT, { kind: "sim" });
    });
    host.appendChild(el("div", { class: "ax-form-wrap" }, form, result));
  };

  VIEWS.custom = function (host, v, ctx) { if (v.render) v.render(host, ctx); };

  var COLOR = /^(#[0-9a-f]{3,8}|(rgb|hsl)a?\([\d\s.,%\/-]+\))$/i;
  function safeColor(c) { return typeof c === "string" && COLOR.test(c.trim()) ? c.trim() : "#EE6A24"; }

  function create(host, opt) {
    var slug = opt.slug || "";
    var brand = opt.brand || { name: "App" };
    var all = (opt.modules || []).slice();
    var langOpts = opt.lang && opt.lang.options && opt.lang.options.length ? opt.lang.options : null;
    var hashFor = typeof opt.hash === "function" ? opt.hash : function (id) { return "#/demo/" + slug + "/walkthrough/" + id; };
    var state = AX.state({ role: "All" });
    var currentId = null, curRender = 0, query = "", destroyed = false;

    var ctx = {
      slug: slug,
      data: (AX.data && AX.data[slug]) || {},
      state: state,
      toast: AX.ui.toast,
      lang: langOpts ? langOpts[0] : "en",
      open: function (id) { api.open(id, { rerender: true }); },
      t: function (en, hi) { return ctx.lang === "hi" && hi != null ? hi : en; }
    };

    host.textContent = "";
    var root = el("div", { class: "ax-app", "data-slug": slug, style: { "--ax-accent": safeColor(brand.accent) } });
    host.appendChild(root);

    var nav = el("nav", { class: "ax-nav", "aria-label": "Modules" });
    var roleSel = el("select", { "aria-label": "Role", on: { change: function () { onRole(roleSel.value); } } });
    var roles = [];
    all.forEach(function (m) { if (m.role && roles.indexOf(m.role) < 0) roles.push(m.role); });
    var roleBox = roles.length ? el("label", { class: "ax-role" }, el("span", {}, "Role"), roleSel) : null;
    if (roleBox) ["All"].concat(roles).forEach(function (r) { roleSel.appendChild(el("option", { value: r }, r)); });

    var side = el("aside", { class: "ax-side", id: "ax-side-" + slug },
      el("div", { class: "ax-brand" },
        el("span", { class: "ax-logo", "aria-hidden": "true" }, brand.logoText || (brand.name || "A").charAt(0)),
        el("span", { class: "ax-brand-name" }, brand.name || ""),
        el("i", { class: "ax-dot", "aria-hidden": "true" })),
      roleBox, nav);
    var scrim = el("div", { class: "ax-scrim", on: { click: function () { setSheet(false, menuBtn); } } });
    var menuBtn = el("button", { type: "button", class: "ax-menu-btn", "aria-expanded": "false", "aria-controls": side.id,
      on: { click: function () { setSheet(!root.classList.contains("sheet-open")); } } }, "☰ Modules");
    var title = el("h2", { class: "ax-title", tabindex: "-1" });
    var searchInp = el("input", { type: "search", placeholder: "Search modules", "aria-label": "Search modules",
      on: { input: function () { query = searchInp.value.trim().toLowerCase(); buildNav(); } } });
    var search = el("label", { class: "ax-search" }, searchInp);
    var langBox = null;
    if (langOpts) {
      langBox = el("div", { class: "ax-lang", role: "group", "aria-label": "Language" }, langOpts.map(function (l) {
        return el("button", { type: "button", "data-lang": l, "aria-pressed": String(l === ctx.lang),
          on: { click: function () { setLang(l); } } }, l === "hi" ? "हिं" : l.toUpperCase());
      }));
    }
    var content = el("div", { class: "ax-content", id: "ax-content-" + slug });
    var main = el("main", { class: "ax-main" },
      el("header", { class: "ax-head" }, menuBtn, title, search, langBox), content);
    root.appendChild(side); root.appendChild(scrim); root.appendChild(main);

    function setSheet(on, focusTo) {
      root.classList.toggle("sheet-open", on);
      menuBtn.setAttribute("aria-expanded", String(on));
      main.inert = on;
      if (on) { var first = nav.querySelector(".ax-nav-item"); if (first) first.focus(); }
      else if (focusTo) focusTo.focus({ preventScroll: true });
    }
    root.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.classList.contains("sheet-open")) { e.stopPropagation(); setSheet(false, menuBtn); }
    });
    function visible() {
      var r = state.get().role;
      return all.filter(function (m) { return r === "All" || !m.role || m.role === r; });
    }
    function buildNav() {
      nav.textContent = "";
      var groups = [], byGroup = {};
      visible().forEach(function (m) {
        if (query && labelOf(m).toLowerCase().indexOf(query) < 0) return;
        var g = m.group || "";
        if (!byGroup[g]) { byGroup[g] = []; groups.push(g); }
        byGroup[g].push(m);
      });
      if (!groups.length) nav.appendChild(el("p", { class: "ax-nav-empty" }, "No modules match."));
      groups.forEach(function (g) {
        var sec = el("div", { class: "ax-group" }, g ? el("div", { class: "ax-group-title" }, g) : null);
        byGroup[g].forEach(function (m) {
          var b = el("button", { type: "button", class: "ax-nav-item", "data-id": m.id,
            on: { click: function () { var sheet = root.classList.contains("sheet-open"); api.open(m.id); setSheet(false, sheet ? title : null); } } }, icon(m.icon), el("span", { class: "ax-nav-label" }, labelOf(m)));
          if (m.id === currentId) b.setAttribute("aria-current", "page");
          sec.appendChild(b);
        });
        nav.appendChild(sec);
      });
    }
    function setNavCurrent() {
      Array.prototype.forEach.call(nav.querySelectorAll(".ax-nav-item"), function (b) {
        if (b.getAttribute("data-id") === currentId) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
      });
    }
    function onRole(r) {
      state.set({ role: r });
      buildNav();
      var vis = visible();
      if (vis.length && !vis.some(function (m) { return m.id === currentId; })) api.open(vis[0].id);
    }
    function setLang(l) {
      ctx.lang = l;
      Array.prototype.forEach.call(langBox.querySelectorAll("button"), function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === l));
      });
      buildNav();
      if (currentId) renderModule(currentId);
    }
    function find(id) { return all.filter(function (m) { return m.id === id; })[0]; }
    /* A module label is a string, {en, hi} or (ctx) -> string, so nav and title follow the language toggle. */
    function labelOf(m) {
      var l = m.label;
      if (typeof l === "function") l = l(ctx);
      else if (l && typeof l === "object") l = ctx.t(l.en, l.hi);
      return l == null ? "" : String(l);
    }
    function startId() {
      var s = opt.start && find(opt.start) ? opt.start : null;
      if (!s) { var v = visible(); s = (v[0] || all[0] || {}).id; }
      return s;
    }

    function renderModule(id) {
      var m = find(id), token = ++curRender;
      content.textContent = "";
      var host_ = el("div", { class: "ax-module", "data-module": id });
      content.appendChild(host_);
      title.textContent = m ? labelOf(m) : "";
      var failed = false;
      try {
        var view = resolve(m.view, ctx);
        var fn = VIEWS[view.type];
        if (!fn) throw new Error("Unknown view type: " + view.type);
        fn(host_, view, ctx);
      } catch (e) {
        failed = true;
        host_.appendChild(el("div", { class: "ax-empty" }, "This module could not be rendered."));
        if (w.console) console.warn("[appShell] " + id + ":", e);
      }
      if (token === curRender) host_.setAttribute(failed ? "data-module-error" : "data-module-ready", "");
      content.scrollTop = 0;
    }

    function writeHash(id) {
      var target = hashFor(id);
      if (w.location.hash === target) return;
      if (AX.router && AX.router.go) AX.router.go(target, { replace: true });
      else w.location.replace(w.location.pathname + w.location.search + target);
    }

    var api = {
      ctx: ctx,
      el: root,
      open: function (id, o) {
        if (destroyed) return;
        o = o || {};
        if (!all.length) return;
        var target = find(id) ? id : startId();
        var first = currentId === null;
        var write = !o.noHash && (first ? (id != null && id !== target) : true);
        if (target !== currentId) {
          currentId = target;
          setNavCurrent();
          if (!nav.querySelector('[data-id="' + target + '"]')) buildNav();
          renderModule(target);
        } else if (o.rerender) renderModule(target);
        if (write) writeHash(target);
      },
      destroy: function () { destroyed = true; curRender++; content.textContent = ""; if (root.parentNode) root.parentNode.removeChild(root); }
    };

    root.__axApp = api;
    buildNav();
    if (!all.length) {
      title.textContent = brand.name || "";
      content.appendChild(el("div", { class: "ax-empty" }, "No modules in this demo yet."));
    } else {
      api.open(opt.start, {});
    }
    return api;
  }

  /* Called by js/shell/shell.js renderWalkthrough. */
  function mount(host, p, route) {
    var def = (AX.demos && AX.demos[p.slug]) || null;
    if (!def) { host.appendChild(el("div", { class: "ax-empty" }, "Interactive walkthrough is not available yet.")); return null; }
    var o = Object.assign({}, def, { slug: p.slug, start: (route && route.module) || def.start });
    return create(host, o);
  }

  /* Called by the shell when only the hash changed: reuse the mounted app instead of rebuilding it. */
  function sync(host, p, route) {
    var app = host.querySelector(".ax-app");
    if (!app || !app.__axApp || app.getAttribute("data-slug") !== p.slug) return false;
    if (route && route.module) app.__axApp.open(route.module);
    return true;
  }

  AX.appShell = { create: create, mount: mount, sync: sync, ICONS: ICONS };
})(window);
