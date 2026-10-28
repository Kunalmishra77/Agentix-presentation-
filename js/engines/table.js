(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};

  function cmp(a, b) {
    if (a == null && b == null) return 0;
    if (a == null) return -1;
    if (b == null) return 1;
    if (typeof a === "number" && typeof b === "number") return a - b;
    return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
  }

  /** Pure: search, filter, sort. Never mutates input. */
  function query(rows, o) {
    o = o || {};
    var out = (rows || []).slice();
    var q = (o.q || "").trim().toLowerCase();
    if (q) {
      var keys = o.qKeys || [];
      out = out.filter(function (r) {
        return keys.some(function (k) { return String(r[k] == null ? "" : r[k]).toLowerCase().indexOf(q) !== -1; });
      });
    }
    var f = o.filters || {};
    Object.keys(f).forEach(function (k) {
      if (f[k] == null || f[k] === "") return;
      out = out.filter(function (r) { return String(r[k]) === String(f[k]); });
    });
    if (o.sort && o.sort.key) {
      var k = o.sort.key, sign = o.sort.dir === "desc" ? -1 : 1;
      out = out.map(function (r, i) { return { r: r, i: i }; })
        .sort(function (a, b) { return sign * cmp(a.r[k], b.r[k]) || a.i - b.i; })
        .map(function (x) { return x.r; });
    }
    return out;
  }

  function create(host, opt) {
    var el = AX.el;
    var cols = opt.columns || [], pageSize = opt.pageSize || 12;
    var st = { rows: opt.rows || [], q: "", filters: {}, sort: null, page: 0 };
    var root = el("div", { class: "tbl-wrap" });
    host.textContent = "";
    host.appendChild(root);

    function cellContent(c, r) {
      var v = c.render ? c.render(r) : r[c.key];
      return v == null ? "" : v;
    }

    function focusSnapshot() {
      var a = document.activeElement;
      if (!a || !root.contains(a)) return null;
      var cl = a.classList;
      if (cl.contains("tbl-search")) return { t: "search" };
      if (cl.contains("tbl-filter")) return { t: "filter", k: a.getAttribute("data-key") };
      if (cl.contains("tbl-prev")) return { t: "prev" };
      if (cl.contains("tbl-next")) return { t: "next" };
      if (cl.contains("tbl-sort")) return { t: "sort", i: [].indexOf.call(root.querySelectorAll(".tbl-sort"), a) };
      return null;
    }
    function restoreFocus(f) {
      if (!f) return;
      var n = null, all, i;
      if (f.t === "search") n = root.querySelector(".tbl-search");
      else if (f.t === "prev") n = root.querySelector(".tbl-prev");
      else if (f.t === "next") n = root.querySelector(".tbl-next");
      else if (f.t === "sort") n = root.querySelectorAll(".tbl-sort")[f.i];
      else if (f.t === "filter") { all = root.querySelectorAll(".tbl-filter"); for (i = 0; i < all.length; i++) if (all[i].getAttribute("data-key") === f.k) n = all[i]; }
      if (n && !n.disabled) {
        n.focus();
        if (f.t === "search") { try { n.setSelectionRange(n.value.length, n.value.length); } catch (e) {} }
      }
    }

    function draw() {
      var list = query(st.rows, { q: st.q, qKeys: opt.qKeys, filters: st.filters, sort: st.sort });
      var pages = Math.max(1, Math.ceil(list.length / pageSize));
      if (st.page >= pages) st.page = pages - 1;
      var start = st.page * pageSize, view = list.slice(start, start + pageSize);
      var focusKey = focusSnapshot();

      var tools = [];
      if (opt.qKeys && opt.qKeys.length) {
        var input = el("input", { class: "tbl-search", type: "search", placeholder: "Search…", "aria-label": "Search",
          on: { input: function (e) { st.q = e.target.value; st.page = 0; draw(); } } });
        input.value = st.q;
        tools.push(input);
      }
      (opt.filters || []).forEach(function (f) {
        var sel = el("select", { class: "tbl-filter", "aria-label": f.label, "data-key": f.key,
          on: { change: function (e) { st.filters[f.key] = e.target.value; st.page = 0; draw(); } } },
          el("option", { value: "" }, "All " + f.label),
          f.options.map(function (o) { return el("option", { value: o }, o); }));
        sel.value = st.filters[f.key] || "";
        tools.push(sel);
      });

      var head = el("tr", null, cols.map(function (c) {
        var sorted = st.sort && st.sort.key === c.key;
        var th = el("th", { scope: "col", "aria-sort": sorted ? (st.sort.dir === "asc" ? "ascending" : "descending") : "none" });
        if (c.sortable) {
          th.appendChild(el("button", { type: "button", class: "tbl-sort", on: { click: function () {
            st.sort = sorted && st.sort.dir === "asc" ? { key: c.key, dir: "desc" } : { key: c.key, dir: "asc" };
            draw();
          } } }, c.label, el("span", { class: "tbl-arrow", "aria-hidden": "true" }, sorted ? (st.sort.dir === "asc" ? "▲" : "▼") : "")));
        } else th.appendChild(document.createTextNode(c.label));
        return th;
      }));
      if (opt.actions && opt.actions.length) head.appendChild(el("th", { scope: "col", class: "tbl-act-h" }, ""));

      var body = view.map(function (r) {
        var tr = el("tr", { class: opt.onRow ? "tbl-row clickable" : "tbl-row",
          tabindex: opt.onRow ? "0" : null,
          on: opt.onRow ? { click: function () { opt.onRow(r); },
            keydown: function (e) { if (e.key === "Enter" && e.target === tr) opt.onRow(r); } } : null });
        cols.forEach(function (c) { tr.appendChild(el("td", { "data-label": c.label }, cellContent(c, r))); });
        if (opt.actions && opt.actions.length) {
          tr.appendChild(el("td", { class: "tbl-actions" }, opt.actions.map(function (a) {
            return el("button", { type: "button", class: "tbl-btn", on: { click: function (e) { e.stopPropagation(); a.onClick(r); } } }, a.label);
          })));
        }
        return tr;
      });

      var from = list.length ? start + 1 : 0, to = Math.min(start + pageSize, list.length);
      var pager = el("div", { class: "tbl-pager" },
        el("span", { class: "tbl-range" }, from + "–" + to + " of " + list.length),
        el("button", { type: "button", class: "tbl-btn tbl-prev", disabled: st.page === 0 ? "" : null,
          on: { click: function () { st.page--; draw(); } } }, "Prev"),
        el("button", { type: "button", class: "tbl-btn tbl-next", disabled: st.page >= pages - 1 ? "" : null,
          on: { click: function () { st.page++; draw(); } } }, "Next"));

      var content = [
        tools.length ? el("div", { class: "tbl-tools" }, tools) : null,
        el("div", { class: "tbl-scroll" }, el("table", { class: "tbl" },
          el("thead", null, head), el("tbody", null, body))),
        list.length ? null : el("div", { class: "tbl-empty" }, "No matching records"),
        pager
      ];
      root.textContent = "";
      content.forEach(function (n) { if (n) root.appendChild(n); });
      restoreFocus(focusKey);
    }

    draw();
    return {
      setRows: function (rows) { st.rows = rows || []; draw(); },
      refresh: draw
    };
  }

  AX.table = { query: query, create: create };
})(window);
