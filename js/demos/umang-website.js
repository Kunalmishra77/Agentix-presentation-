(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.demos = AX.demos || {};
  if (typeof document === "undefined" || !document.getElementById) return;
  var el = AX.el, SLUG = "umang-website", ACCENT = "#B5121B";

  var CSS = [
    '.uw-note{background:#FFF5F5;border:1px solid #F5C6C9;border-radius:10px;padding:10px 14px;font-size:13px;margin-bottom:10px}',
    '.uw-filter{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;align-items:center}',
    '.uw-pill{appearance:none;font:600 12px var(--font-body);padding:6px 14px;border-radius:999px;border:1px solid var(--ax-line);background:#fff;color:var(--ink);cursor:pointer}',
    '.uw-pill[aria-pressed="true"]{background:var(--ax-accent);border-color:var(--ax-accent);color:#fff}',
    '.uw-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}',
    '.uw-doc{background:#fff;border:1px solid var(--ax-line);border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:6px}',
    '.uw-av{width:52px;height:52px;border-radius:50%;background:var(--ax-accent);color:#fff;display:grid;place-items:center;font:700 16px var(--font-display)}',
    '.uw-doc b{font:600 15px var(--font-display)}.uw-doc small{color:var(--ink-3);font-size:12px}',
    '.uw-tag{display:inline-block;font:600 11px var(--font-body);padding:2px 9px;border-radius:999px;background:#FDECEC;color:#8E0F16;align-self:flex-start}',
    '.uw-btn{appearance:none;font:600 13px var(--font-body);padding:8px 16px;border-radius:999px;border:1px solid var(--ax-accent);background:var(--ax-accent);color:#fff;cursor:pointer;margin-top:6px}',
    '.uw-btn.ghost{background:#fff;color:var(--ax-accent)}',
    '.uw-chip{display:inline-block;font:600 11px var(--font-body);padding:2px 9px;border-radius:999px;background:#EEF0F3;color:#475467}',
    '.uw-chip.Booked,.uw-chip.Visited,.uw-chip.Published{background:#DCFCE7;color:#166534}.uw-chip.New,.uw-chip.Draft{background:#FEF3D7;color:#8A5A00}.uw-chip.Lost{background:#FEE9E7;color:#B42318}',
    '.uw-utm{font:500 12px var(--font-mono);color:var(--ink-2)}',
    '.uw-dl{display:grid;grid-template-columns:120px 1fr;gap:8px 12px;margin:0;font-size:14px}.uw-dl dt{color:var(--ink-3);font:600 12px var(--font-mono);text-transform:uppercase}.uw-dl dd{margin:0}',
    '.uw-edit textarea{width:100%;box-sizing:border-box;min-height:110px;padding:10px;border:1px solid var(--ax-line);border-radius:8px;font:400 14px var(--font-body)}',
    '.uw-edit label{display:block;font:600 12px var(--font-mono);text-transform:uppercase;color:var(--ink-3);margin:10px 0 4px}',
    '.uw-ok{background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:12px 14px;margin-top:12px;font-size:14px}'
  ].join("\n");
  function injectCss() {
    if (document.getElementById("uw-css")) return;
    var s = document.createElement("style"); s.id = "uw-css";
    s.textContent = CSS + '\n.ax-app[data-slug="' + SLUG + '"],.demo-scope[data-slug="' + SLUG + '"]{--orange:' + ACCENT + '}';
    document.head.appendChild(s);
  }
  injectCss();
  function scope() {
    return el("div", { class: "demo-scope", "data-slug": SLUG, style: { "--ax-accent": ACCENT, "--ax-line": "rgba(11,31,51,.12)", "--orange": ACCENT } }, Array.prototype.slice.call(arguments));
  }
  function chip(v) { return el("span", { class: "uw-chip " + v }, v); }

  function site(host, ctx) {
    injectCss();
    AX.embed.create(host, AX.embed.optsForSlug(SLUG));
  }

  function doctors(host, ctx) {
    injectCss();
    var d = ctx.data, cur = "All";
    var bar = el("div", { class: "uw-filter", role: "group", "aria-label": "Filter by speciality" });
    var grid = el("div", { class: "uw-grid", "data-count": String(d.doctors.length) });
    var count = el("p", { style: { margin: "0 0 10px", fontSize: "13px", color: "var(--ink-3)" }, "aria-live": "polite" });
    function draw() {
      var list = d.doctors.filter(function (x) { return cur === "All" || x.speciality === cur; });
      Array.prototype.forEach.call(bar.querySelectorAll(".uw-pill"), function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-sp") === cur)); });
      count.textContent = list.length + " of " + d.doctors.length + " doctors" + (cur === "All" ? "" : " in " + cur);
      grid.textContent = ""; grid.setAttribute("data-count", String(list.length));
      list.forEach(function (x) {
        grid.appendChild(el("article", { class: "uw-doc", "data-speciality": x.speciality },
          el("div", { class: "uw-av", "aria-hidden": "true" }, x.initials), el("b", {}, x.name), el("span", { class: "uw-tag" }, x.speciality),
          el("small", {}, x.qualification + " · " + x.experience + " yrs"), el("small", {}, "OPD: " + x.days + ", " + x.time), el("small", {}, x.telemed ? "Video consultation available" : "In-person only"),
          el("button", { type: "button", class: "uw-btn", "data-book": x.id, on: { click: function () { ctx.state.set({ doctor: x.name }); ctx.open("appointment"); } } }, "Book appointment")));
      });
    }
    ["All"].concat(d.specialities).forEach(function (s) {
      bar.appendChild(el("button", { type: "button", class: "uw-pill", "data-sp": s, "aria-pressed": "false", on: { click: function () { cur = s; draw(); } } }, s));
    });
    host.appendChild(el("div", {}, bar, count, grid));
    draw();
  }

  function leadDrawer(r) {
    return scope(el("dl", { class: "uw-dl" },
      el("dt", {}, "Patient"), el("dd", {}, r.name), el("dt", {}, "Phone"), el("dd", {}, r.phone), el("dt", {}, "Email"), el("dd", {}, r.email),
      el("dt", {}, "Concern"), el("dd", {}, r.concern), el("dt", {}, "Doctor"), el("dd", {}, r.doctor), el("dt", {}, "Status"), el("dd", {}, chip(r.status)),
      el("dt", {}, "Source"), el("dd", {}, r.source), el("dt", {}, "utm_medium"), el("dd", {}, el("span", { class: "uw-utm" }, r.utm_medium)),
      el("dt", {}, "utm_campaign"), el("dd", {}, el("span", { class: "uw-utm" }, r.utm_campaign)), el("dt", {}, "Received"), el("dd", {}, r.date)),
      el("div", { style: { display: "flex", gap: "8px", marginTop: "14px" } },
        el("button", { type: "button", class: "uw-btn", on: { click: function () { AX.ui.toast("Simulated — WhatsApp message not sent", { kind: "sim" }); } } }, "WhatsApp patient"),
        el("button", { type: "button", class: "uw-btn ghost", on: { click: function () { AX.ui.toast("Simulated — marked contacted (nothing saved)", { kind: "sim" }); } } }, "Mark contacted")));
  }

  function blockDrawer(r, ctx) {
    var ta = el("textarea", { "aria-label": "Block content" }); ta.value = r.text;
    var st = el("select", { "aria-label": "Status" }, ["Published", "Draft"].map(function (s) { return el("option", { value: s }, s); })); st.value = r.status;
    return scope(el("div", { class: "uw-edit" },
      el("p", { style: { margin: "0 0 4px", color: "var(--ink-3)", fontSize: "13px" } }, r.page + " · " + r.block + " · last edited " + r.updated + " by " + r.editor),
      el("label", {}, "Content"), ta, el("label", {}, "Status"), st,
      el("div", { style: { display: "flex", gap: "8px", marginTop: "14px" } },
        el("button", { type: "button", class: "uw-btn", "data-act": "save", on: { click: function () {
          r.text = ta.value; r.status = st.value; r.updated = "Today";
          AX.ui.toast("Simulated — CMS block updated in this demo only", { kind: "sim" });
        } } }, "Save changes"),
        el("button", { type: "button", class: "uw-btn ghost", on: { click: function () { AX.ui.toast("Simulated — preview opens on the live site", { kind: "sim" }); } } }, "Preview"))));
  }

  AX.demos[SLUG] = {
    brand: { name: "Umang Hospital", accent: ACCENT, logoText: "U" },
    start: "site",
    modules: [
      { id: "site", label: "Live website", icon: "home", group: "Public site", view: { type: "custom", render: site } },
      { id: "doctors", label: "Find a doctor", icon: "users", group: "Public site", view: { type: "custom", render: doctors } },
      { id: "appointment", label: "Book appointment", icon: "calendar", group: "Public site", view: function (ctx) {
        var d = ctx.data, pre = ctx.state.get().doctor;
        var names = d.doctors.map(function (x) { return x.name; });
        if (pre && names.indexOf(pre) > 0) names = [pre].concat(names.filter(function (n) { return n !== pre; }));
        return { type: "form", submit: "Request appointment",
          fields: [{ key: "name", label: "Your name" }, { key: "phone", label: "Mobile number" }, { key: "doctor", label: "Doctor", type: "select", options: names },
            { key: "date", label: "Preferred date", type: "date" }, { key: "concern", label: "What is the concern?", type: "textarea" }],
          onSubmit: function (v, c) {
            var id = "UL-" + (501 + c.data.leads.length);
            c.data.leads.unshift({ id: id, name: v.name || "Walk-in enquirer", phone: v.phone || "+91 98xxx x0000", email: "enquiry@example.in", concern: v.concern || "General enquiry",
              doctor: v.doctor, source: "Direct", utm_campaign: "(none)", utm_medium: "none", status: "New", date: "2026-10-28" });
            return el("div", { class: "uw-ok", "data-lead": id }, "Request received (" + id + "). The hospital team will call to confirm " + (v.date || "a slot") + " with " + v.doctor + ". It now appears in Admin leads.");
          } };
      } },
      { id: "admin-leads", label: "Leads", icon: "table", group: "Admin", view: function (ctx) {
        var d = ctx.data;
        return { type: "table", pageSize: 10, rows: d.leads, qKeys: ["id", "name", "phone", "concern", "doctor"],
          filters: [{ key: "source", label: "source", options: d.sources }, { key: "utm_campaign", label: "campaign", options: d.campaigns }, { key: "utm_medium", label: "medium", options: d.mediums }, { key: "status", label: "status", options: d.statuses }],
          columns: [{ key: "id", label: "Lead", sortable: true }, { key: "name", label: "Patient", sortable: true }, { key: "concern", label: "Concern" }, { key: "source", label: "Source", sortable: true },
            { key: "utm_campaign", label: "UTM campaign", render: function (r) { return el("span", { class: "uw-utm" }, r.utm_campaign); } },
            { key: "utm_medium", label: "Medium", render: function (r) { return el("span", { class: "uw-utm" }, r.utm_medium); } },
            { key: "status", label: "Status", sortable: true, render: function (r) { return chip(r.status); } }, { key: "date", label: "Received", sortable: true }],
          drawer: function (r) { return leadDrawer(r); } };
      } },
      { id: "cms", label: "Content (CMS)", icon: "file", group: "Admin", view: function (ctx) {
        return { type: "table", pageSize: 10, rows: ctx.data.blocks, qKeys: ["page", "block", "text"], filters: [{ key: "status", label: "status", options: ["Published", "Draft"] }],
          columns: [{ key: "page", label: "Page", sortable: true }, { key: "block", label: "Block" }, { key: "text", label: "Content", render: function (r) { return r.text.length > 60 ? r.text.slice(0, 58) + "..." : r.text; } },
            { key: "status", label: "Status", render: function (r) { return chip(r.status); } }, { key: "updated", label: "Updated" }, { key: "editor", label: "Editor" }],
          drawer: function (r, c) { return blockDrawer(r, c); } };
      } }
    ]
  };
})(window);
