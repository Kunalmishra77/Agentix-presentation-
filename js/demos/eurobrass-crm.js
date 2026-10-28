(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.demos = AX.demos || {};
  AX.eurobrass = AX.eurobrass || {};
  var SLUG = "eurobrass-crm";
  var GST = 0.18;

  /* ============ pure helpers (no DOM) ============ */
  /** lines: [{pid, qty}], products: [{id, price}]. Each component rounded to whole rupees. */
  function quoteTotals(lines, products) {
    var price = {};
    (products || []).forEach(function (p) { price[p.id] = p.price; });
    var sub = 0, units = 0;
    (lines || []).forEach(function (l) { if (price[l.pid] != null) { sub += price[l.pid] * l.qty; units += l.qty; } });
    var gst = Math.round(sub * GST);
    return { subtotal: sub, gst: gst, total: sub + gst, units: units };
  }
  function stockLevel(onHand, reorder) { return onHand <= 0 ? "Out of stock" : onHand <= reorder ? "Low stock" : "In stock"; }
  AX.eurobrass.quoteTotals = quoteTotals;
  AX.eurobrass.stockLevel = stockLevel;
  AX.eurobrass.GST = GST;

  if (typeof document === "undefined" || !AX.el) return;   /* unit-test context stops here */

  /* ============ scoped styles ============ */
  var RULES = [
    "&{--orange:#8C6A3E}",
    ".eb-grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr))}",
    ".eb-card{background:#fff;border:1px solid rgba(11,31,51,.12);border-radius:12px;padding:16px;min-width:0}",
    ".eb-card h3{margin:0 0 10px;font:600 .92rem var(--font-display)}",
    ".eb-pill{display:inline-block;font:600 .72rem var(--font-body);padding:2px 9px;border-radius:999px;background:rgba(11,31,51,.08);color:#334;white-space:nowrap}",
    ".eb-pill.good{background:rgba(15,122,61,.12);color:#0F7A3D}.eb-pill.warn{background:rgba(224,168,0,.32);color:#7A5B00}.eb-pill.bad{background:rgba(192,50,43,.14);color:#A32620}.eb-pill.brass{background:rgba(140,106,62,.16);color:#6B4F2A}",
    ".eb-kv{display:grid;grid-template-columns:110px minmax(0,1fr);gap:6px 12px;font-size:.85rem;margin:0}.eb-kv dt{color:#5a6676;font:500 .72rem var(--font-mono);text-transform:uppercase}.eb-kv dd{margin:0;overflow-wrap:anywhere}",
    ".eb-h{margin:18px 0 8px;font:600 .8rem var(--font-mono);text-transform:uppercase;color:#5a6676}",
    ".eb-btn{appearance:none;font:600 .85rem var(--font-body);padding:9px 16px;border-radius:999px;border:1px solid rgba(11,31,51,.2);background:#fff;color:#0B1F33;cursor:pointer}.eb-btn.primary{background:#8C6A3E;border-color:#8C6A3E;color:#fff}.eb-btn.dark{background:#0B1F33;border-color:#0B1F33;color:#fff}.eb-btn[disabled]{opacity:.5;cursor:default}",
    ".eb-in,.eb-f select,.eb-f input{font:400 .86rem var(--font-body);padding:8px 10px;border:1px solid rgba(11,31,51,.2);border-radius:8px;background:#fff;width:100%;box-sizing:border-box;min-width:0}",
    ".eb-f{display:grid;gap:4px;font:500 .74rem var(--font-mono);color:#5a6676}",
    ".eb-row{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}",
    ".eb-bar{height:8px;border-radius:99px;background:rgba(11,31,51,.1);overflow:hidden}.eb-bar i{display:block;height:100%;background:#8C6A3E;border-radius:99px}",
    ".q-wrap{display:grid;gap:16px;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);align-items:start}",
    ".q-add{display:grid;gap:10px;grid-template-columns:minmax(0,1fr) 80px}.q-add .wide{grid-column:1/-1}",
    ".q-line{display:grid;grid-template-columns:minmax(0,1fr) 110px 64px auto;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid rgba(11,31,51,.08);font-size:.84rem}",
    ".q-line strong{overflow-wrap:anywhere}.q-line .x{appearance:none;border:0;background:none;font-size:1.2rem;color:#5a6676;cursor:pointer}",
    ".q-preview{background:#fff;border:1px solid rgba(11,31,51,.18);box-shadow:0 8px 24px rgba(11,31,51,.08);border-radius:6px;padding:22px;min-width:0;font-size:.82rem}",
    ".q-preview .lh{display:flex;justify-content:space-between;gap:12px;border-bottom:3px solid #8C6A3E;padding-bottom:10px;margin-bottom:12px;flex-wrap:wrap}",
    ".q-preview .brand{font:700 1.25rem var(--font-display);letter-spacing:.14em;color:#8C6A3E}",
    ".q-preview table{width:100%;border-collapse:collapse;margin:10px 0}.q-preview th{text-align:left;font:600 .7rem var(--font-mono);text-transform:uppercase;color:#5a6676;border-bottom:1px solid rgba(11,31,51,.2);padding:6px 4px}.q-preview td{padding:6px 4px;border-bottom:1px solid rgba(11,31,51,.07);vertical-align:top}.q-preview td.r,.q-preview th.r{text-align:right}",
    ".q-preview .tot{margin-left:auto;width:min(100%,260px);display:grid;gap:4px}.q-preview .tot div{display:flex;justify-content:space-between}.q-preview .tot .g{font:700 1rem var(--font-display);border-top:2px solid #0B1F33;padding-top:6px;margin-top:4px}",
    ".q-preview .terms{margin-top:14px;color:#5a6676;font-size:.74rem}",
    ".q-ok{background:rgba(15,122,61,.1);border:1px solid rgba(15,122,61,.4);border-radius:10px;padding:12px 14px;display:grid;gap:8px;margin-bottom:12px}",
    ".eb-note{font:500 .75rem var(--font-mono);color:#5a6676;background:rgba(140,106,62,.1);border:1px dashed rgba(140,106,62,.5);border-radius:8px;padding:6px 10px;margin-bottom:12px}",
    ".eb-sw{display:inline-block;width:12px;height:12px;border-radius:50%;border:1px solid rgba(11,31,51,.3);vertical-align:-1px;margin-right:5px}",
    ".eb-notif{display:flex;gap:12px;align-items:flex-start;padding:12px 14px;background:#fff;border:1px solid rgba(11,31,51,.1);border-radius:10px;margin-bottom:8px;font-size:.88rem}.eb-notif.unread{border-left:4px solid #8C6A3E}.eb-notif small{display:block;color:#5a6676;font:500 .72rem var(--font-mono);margin-top:2px}",
    ".eb-perm{width:100%;border-collapse:collapse;font-size:.82rem}.eb-perm th,.eb-perm td{padding:5px 6px;border-bottom:1px solid rgba(11,31,51,.08);text-align:center}.eb-perm th:first-child,.eb-perm td:first-child{text-align:left}",
    ".eb-chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}.eb-chips button[aria-pressed=true]{background:#8C6A3E;color:#fff;border-color:#8C6A3E}",
    "@media(max-width:860px){.q-wrap{grid-template-columns:minmax(0,1fr)}.q-line{grid-template-columns:minmax(0,1fr) 90px 56px auto}}"
  ];
  function scopeCss() {
    var pre = ['.ax-app[data-slug="' + SLUG + '"]', '.demo-scope[data-slug="' + SLUG + '"]'];
    function sc(css) {
      return css.replace(/([^{}]+)\{([^{}]*)\}/g, function (m, sels, body) {
        return sels.split(",").map(function (s) {
          s = s.trim();
          return s === "&" ? pre[0] + "," + pre[1] : pre.map(function (p) { return p + " " + s; }).join(",");
        }).join(",") + "{" + body + "}";
      });
    }
    var media = [], base = RULES.join("\n").replace(/(@media[^{]*)\{((?:[^{}]*\{[^{}]*\})*)\}/g, function (m, h, inner) { media.push(h + "{" + sc(inner) + "}"); return ""; });
    return sc(base) + "\n" + media.join("\n") + '\n@media(min-width:768px){.ax-app[data-slug="' + SLUG + '"] .bd-col{flex:1 1 0;min-width:130px}}';
  }
  function ensureCss() {
    if (document.getElementById(SLUG + "-css")) return;
    var s = document.createElement("style");
    s.id = SLUG + "-css"; s.textContent = scopeCss(); document.head.appendChild(s);
  }

  /* ============ shared helpers ============ */
  function E() { return AX.el.apply(null, arguments); }
  function D(ctx) { return ctx.data; }
  function scope(children) { ensureCss(); return E("div", { class: "demo-scope", "data-slug": SLUG }, children); }
  function inr(n) { return AX.fmt.inr(n); }
  function pill(text, kind) { return E("span", { class: "eb-pill " + (kind || "") }, text); }
  function kv(pairs) {
    var dl = E("dl", { class: "eb-kv" });
    pairs.forEach(function (p) { dl.appendChild(E("dt", {}, p[0])); dl.appendChild(E("dd", {}, p[1])); });
    return dl;
  }
  function sim(t) { AX.ui.toast(t, { kind: "sim" }); }
  function S(ctx) { return ctx.state.get(); }
  function allOrders(ctx) { return (S(ctx).newOrders || []).concat(D(ctx).orders); }
  function tickets(ctx) {
    if (!S(ctx).tickets) ctx.state.set({ tickets: D(ctx).tickets.map(function (t) { return Object.assign({}, t); }) });
    return S(ctx).tickets;
  }
  function logAudit(ctx, user, action, module, record) {
    ctx.state.set({ auditExtra: [{ id: "AUD-X" + ((S(ctx).auditExtra || []).length + 1), at: D(ctx).today + " 11:" + ("0" + (S(ctx).auditExtra || []).length).slice(-2), user: user, action: action, module: module, record: record, ip: "10.0.0.x" }].concat(S(ctx).auditExtra || []) });
  }
  function notify(ctx, kind, text) {
    ctx.state.set({ notifExtra: [{ id: "nx" + ((S(ctx).notifExtra || []).length + 1), kind: kind, text: text, at: "just now", read: false }].concat(S(ctx).notifExtra || []) });
  }
  function orderKind(s) { return s === "Delivered" ? "good" : s === "Dispatched" ? "brass" : s === "In Production" ? "warn" : ""; }
  function payKind(s) { return s === "Paid" ? "good" : s === "Partially Paid" ? "warn" : "bad"; }
  /* Inline SVG product illustration tinted by the first finish (no external images). */
  var FIN_HEX = { "Chrome": "#C8CCCE", "Matte Black": "#2A2A2A", "Brushed Nickel": "#8C8477", "Antique Bronze": "#6B4A2E", "Rose Gold": "#B76E79" };
  function swatchImg(p) {
    var c = FIN_HEX[p.variants[0]] || "#C8CCCE", art;
    if (p.cat === "Showers") art = '<circle cx="100" cy="46" r="34" fill="' + c + '"/><rect x="96" y="80" width="8" height="70" rx="4" fill="' + c + '"/><g stroke="' + c + '" stroke-width="2" opacity=".5"><path d="M76 96v22M92 100v26M108 100v26M124 96v22"/></g>';
    else if (p.cat === "Accessories") art = '<rect x="40" y="60" width="120" height="10" rx="5" fill="' + c + '"/><rect x="48" y="50" width="10" height="30" rx="3" fill="' + c + '"/><rect x="142" y="50" width="10" height="30" rx="3" fill="' + c + '"/><rect x="40" y="96" width="120" height="10" rx="5" fill="' + c + '"/>';
    else art = '<path d="M60 112h20V74c0-14 10-22 26-22h38v14h-34c-6 0-10 3-10 9v37h20v14H60z" fill="' + c + '"/><rect x="132" y="66" width="12" height="30" rx="4" fill="' + c + '" opacity=".8"/>';
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6F1E9"/><stop offset="1" stop-color="#E7DDCD"/></linearGradient></defs><rect width="200" height="160" fill="url(#g)"/>' + art + "</svg>";
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }
  function product(ctx, id) { return D(ctx).products.filter(function (p) { return p.id === id; })[0]; }
  function quote(ctx) { return S(ctx).quote || { customerId: "", lines: [], status: "Draft" }; }
  function setQuote(ctx, q) { ctx.state.set({ quote: q }); }

  var mods = [];

  /* ---- dashboard ---- */
  mods.push({ id: "dashboard", label: "Dashboard", icon: "dashboard", group: "Overview", view: function (ctx) {
    ensureCss();
    var d = D(ctx), orders = allOrders(ctx), low = d.inventory.filter(function (x) { return x.level !== "In stock"; }).length;
    var openT = tickets(ctx).filter(function (t) { return t.col !== "resolved"; }).length;
    var s = d.sales, last = s.actual.length - 1;
    return {
      type: "dashboard",
      kpis: [{ label: "Open leads", value: d.leads.filter(function (l) { return l.col !== "won"; }).length }, { label: "Orders", value: orders.length },
        { label: "Revenue (Oct)", value: s.actual[last], format: "inr", delta: Math.round((s.actual[last] / s.actual[last - 1] - 1) * 100) },
        { label: "Open service tickets", value: openT }],
      charts: [
        { type: "line", title: "Sales vs target (₹)", wide: true, labels: s.labels, series: [{ name: "Actual", points: s.actual }, { name: "Target", points: s.target }] },
        { type: "donut", title: "Orders by status", parts: ["Confirmed", "In Production", "Dispatched", "Delivered"].map(function (st) { return { label: st, value: orders.filter(function (o) { return o.status === st; }).length }; }) },
        { type: "funnel", title: "Lead pipeline", steps: d.leadStages.map(function (st, i) { return { label: st.label, value: d.leads.filter(function (l) { return d.leadStages.map(function (x) { return x.id; }).indexOf(l.col) >= i; }).length }; }) }
      ]
    };
  } });

  /* ---- leads board ---- */
  mods.push({ id: "leads", label: "Leads", icon: "board", group: "Sales", view: function (ctx) {
    ensureCss();
    var d = D(ctx);
    return {
      type: "board", columns: d.leadStages,
      cards: d.leads.map(function (l) { return { id: l.id, col: l.col, title: l.company, sub: l.contact + " · " + l.city, tags: [l.source], meta: "Est. " + inr(l.value) }; }),
      onMove: function (card, col) { var st = d.leadStages.filter(function (x) { return x.id === col; })[0]; sim("Simulated — " + card.title + " moved to " + st.label + " (not saved)."); },
      onOpen: function (card) {
        AX.ui.drawer({ title: card.title, body: scope([kv([["Lead", card.id], ["Contact", card.sub], ["Source", card.tags[0]], ["Estimate", card.meta.replace("Est. ", "")]]),
          E("div", { class: "eb-row", style: { marginTop: "16px" } }, E("button", { type: "button", class: "eb-btn primary", on: { click: function () { ctx.open("quotations"); } } }, "Create quotation"),
            E("button", { type: "button", class: "eb-btn", on: { click: function () { sim("Simulated — call not placed."); } } }, "Log call"))]) });
      }
    };
  } });

  /* ---- customers ---- */
  mods.push({ id: "customers", label: "Customers", icon: "users", group: "Sales", view: function (ctx) {
    ensureCss();
    var d = D(ctx);
    return {
      type: "table", pageSize: 10, qKeys: ["name", "contact", "city"],
      filters: [{ key: "type", label: "Type", options: ["Hotel", "Hospital", "Builder", "Architect", "Residential", "Commercial", "Institution"] }],
      columns: [{ key: "name", label: "Customer", sortable: true }, { key: "type", label: "Type", render: function (r) { return pill(r.type, "brass"); } }, { key: "contact", label: "Contact" }, { key: "city", label: "City", sortable: true }, { key: "since", label: "Since", sortable: true }],
      rows: d.customers,
      drawer: function (row) {
        var os = allOrders(ctx).filter(function (o) { return o.customer === row.name; });
        return scope([kv([["Contact", row.contact], ["Email", row.email], ["Phone", row.phone], ["GSTIN", row.gst], ["City", row.city]]),
          E("div", { class: "eb-h" }, "Orders (" + os.length + ")"),
          os.length ? os.map(function (o) { return E("div", { class: "eb-row", style: { padding: "6px 0", borderBottom: "1px solid rgba(11,31,51,.08)" } }, E("span", {}, o.id), pill(o.status, orderKind(o.status)), E("strong", {}, inr(o.amount))); }) : E("p", {}, "No orders yet.")]);
      }
    };
  } });

  /* ---- dealers ---- */
  mods.push({ id: "dealers", label: "Dealers", icon: "store", group: "Dealers", view: function (ctx) {
    ensureCss();
    var d = D(ctx);
    return {
      type: "table", pageSize: 10, qKeys: ["name", "owner", "city"],
      filters: [{ key: "tier", label: "Tier", options: ["Gold", "Silver", "Bronze"] }],
      columns: [{ key: "name", label: "Dealer", sortable: true }, { key: "tier", label: "Tier", render: function (r) { return pill(r.tier, r.tier === "Gold" ? "warn" : "brass"); } }, { key: "city", label: "City" },
        { key: "ytd", label: "YTD sales", sortable: true, render: function (r) { return inr(r.ytd); } }, { key: "outstanding", label: "Outstanding", sortable: true, render: function (r) { return inr(r.outstanding); } }],
      rows: d.dealers,
      drawer: function (row) {
        var pct = Math.round(row.outstanding / row.creditLimit * 100);
        return scope([kv([["Owner", row.owner], ["Phone", row.phone], ["Email", row.email], ["Tier", row.tier], ["Credit limit", inr(row.creditLimit)], ["Outstanding", inr(row.outstanding)]]),
          E("div", { class: "eb-h" }, "Credit used " + pct + "%"), E("div", { class: "eb-bar" }, E("i", { style: { width: Math.min(100, pct) + "%" } })),
          E("button", { type: "button", class: "eb-btn primary", style: { marginTop: "16px" }, on: { click: function () { sim("Simulated — dealer-portal invite not sent."); } } }, "Invite to dealer portal")]);
      }
    };
  } });

  /* ---- dealer portal ---- */
  mods.push({ id: "dealer-portal", label: "Dealer portal", icon: "home", group: "Dealers", view: { type: "custom", render: function (host, ctx) {
    ensureCss();
    var d = D(ctx), cur = S(ctx).dealerId || d.dealers[0].id;
    var out = E("div", {});
    var sel = E("select", { "data-dealer": "", "aria-label": "Dealer", class: "eb-in", style: { maxWidth: "320px" }, on: { change: function () { cur = sel.value; ctx.state.set({ dealerId: cur }); draw(); } } },
      d.dealers.map(function (x) { return E("option", { value: x.id }, x.name); }));
    sel.value = cur;
    host.appendChild(scope([E("div", { class: "eb-note" }, "Dealer's own view of the portal: orders, schemes and available stock."), E("div", { class: "eb-f", style: { marginBottom: "14px" } }, "Signed in as", sel), out]));
    function draw() {
      out.textContent = "";
      var dl = d.dealers.filter(function (x) { return x.id === cur; })[0], os = allOrders(ctx).filter(function (o) { return o.dealerId === cur; });
      var kp = E("div", {}), ordersBox = E("div", { class: "eb-card", style: { marginTop: "16px" } }, E("h3", {}, "Orders"));
      var tb = E("div", {}); ordersBox.appendChild(tb);
      out.appendChild(kp);
      AX.charts.kpis(kp, { items: [{ label: "Credit limit", value: dl.creditLimit, format: "inr" }, { label: "Outstanding", value: dl.outstanding, format: "inr" }, { label: "YTD purchases", value: dl.ytd, format: "inr" }, { label: "Orders", value: os.length }].map(lakhify) });
      out.appendChild(ordersBox);
      AX.table.create(tb, { pageSize: 5, columns: [{ key: "id", label: "Order" }, { key: "date", label: "Date" }, { key: "amount", label: "Amount", render: function (r) { return inr(r.amount); } },
        { key: "status", label: "Status", render: function (r) { return pill(r.status, orderKind(r.status)); } }], rows: os });
      var sc = E("div", { class: "eb-grid", style: { marginTop: "16px" } }, d.schemes.map(function (s, i) {
        var prog = Math.min(100, Math.max(12, Math.round(i === 1 ? 60 : dl.ytd / (s.target * 3) * 100)));
        return E("div", { class: "eb-card" }, E("h3", {}, "Scheme · " + s.name), E("p", { style: { fontSize: ".84rem", margin: "0 0 10px" } }, s.detail), E("div", { class: "eb-bar" }, E("i", { style: { width: prog + "%" } })), E("small", {}, prog + "% towards the target"));
      }));
      out.appendChild(E("h3", { class: "eb-h" }, "Schemes")); out.appendChild(sc);
      var stock = d.inventory.slice(0, 8);
      var stBox = E("div", { class: "eb-card" }, E("h3", {}, "Stock"));
      stock.forEach(function (x) {
        stBox.appendChild(E("div", { class: "eb-row", style: { padding: "6px 0", borderBottom: "1px solid rgba(11,31,51,.08)", fontSize: ".85rem" } }, E("span", {}, x.sku + " · " + x.name), pill(x.level + " (" + x.onHand + ")", x.level === "In stock" ? "good" : x.level === "Low stock" ? "warn" : "bad"),
          E("button", { type: "button", class: "eb-btn", on: { click: function () { sim("Simulated — dealer order for " + x.sku + " not placed."); } } }, "Order")));
      });
      out.appendChild(E("h3", { class: "eb-h" }, "Available stock")); out.appendChild(stBox);
    }
    draw();
  } } });

  /* ---- products store ---- */
  mods.push({ id: "products", label: "Products", icon: "box", group: "Catalogue", view: function (ctx) {
    ensureCss();
    var d = D(ctx);
    return {
      type: "store", checkout: "quote", gstRate: GST, products: d.products.map(function (p) { return { id: p.id, name: p.sku + " · " + p.name, price: p.price, cat: p.cat, tags: [p.series].concat(p.variants.slice(0, 2)), variants: p.variants, img: swatchImg(p) }; }),
      categories: ["Taps & Mixers", "Showers", "Accessories"],
      onAdd: function (p, qty) {
        var q = quote(ctx), pr = product(ctx, p.id), line = q.lines.filter(function (l) { return l.pid === p.id; })[0];
        var lines = line ? q.lines.map(function (l) { return l.pid === p.id ? Object.assign({}, l, { qty: l.qty + qty }) : l; }) : q.lines.concat([{ pid: p.id, qty: qty, finish: pr.variants[0] }]);
        setQuote(ctx, Object.assign({}, q, { lines: lines, converted: null }));
      }
    };
  } });

  /* ---- inventory ---- */
  mods.push({ id: "inventory", label: "Inventory", icon: "table", group: "Catalogue", view: function (ctx) {
    ensureCss();
    var d = D(ctx);
    return {
      type: "table", pageSize: 12, qKeys: ["sku", "name", "series"],
      filters: [{ key: "level", label: "Level", options: ["In stock", "Low stock", "Out of stock"] }, { key: "warehouse", label: "Warehouse", options: ["Delhi HQ", "Mumbai DC", "Bengaluru DC", "Kolkata DC"] }],
      columns: [{ key: "sku", label: "SKU", sortable: true }, { key: "name", label: "Product" }, { key: "warehouse", label: "Warehouse" }, { key: "onHand", label: "On hand", sortable: true }, { key: "reserved", label: "Reserved" }, { key: "reorder", label: "Reorder at" },
        { key: "level", label: "Level", render: function (r) { return pill(r.level, r.level === "In stock" ? "good" : r.level === "Low stock" ? "warn" : "bad"); } }],
      rows: d.inventory,
      drawer: function (row) {
        return scope([kv([["SKU", row.sku], ["Product", row.name], ["Series", row.series], ["Warehouse", row.warehouse], ["On hand", String(row.onHand)], ["Reserved", String(row.reserved)], ["Reorder level", String(row.reorder)]]),
          E("button", { type: "button", class: "eb-btn primary", style: { marginTop: "16px" }, on: { click: function () { sim("Simulated — purchase request for " + row.sku + " not raised."); } } }, "Raise purchase request")]);
      }
    };
  } });

  /* ---- quotations builder ---- */
  mods.push({ id: "quotations", label: "Quotations", icon: "file", group: "Sales", view: { type: "custom", render: function (host, ctx) {
    ensureCss();
    var d = D(ctx), pid = d.products[0].id, qty = 1, finishSel = null;
    var left = E("div", { class: "eb-card" }), right = E("div", {}), hist = E("div", { class: "eb-card", style: { marginTop: "16px" } }, E("h3", {}, "Recent quotations")), histTb = E("div", {});
    hist.appendChild(histTb);
    host.appendChild(scope([E("div", { class: "q-wrap" }, left, right), hist]));
    AX.table.create(histTb, { pageSize: 5, qKeys: ["id", "customer"], columns: [{ key: "id", label: "Quote" }, { key: "customer", label: "Customer" }, { key: "amount", label: "Total", render: function (r) { return inr(r.amount); } },
      { key: "status", label: "Status", render: function (r) { return pill(r.status, r.status === "Approved" || r.status === "Converted" ? "good" : r.status === "Rejected" ? "bad" : r.status === "Sent" ? "brass" : ""); } }], rows: d.quotations,
      onRow: function (r) { AX.ui.drawer({ title: r.id, body: scope(kv([["Customer", r.customer], ["Product", r.product], ["Quantity", String(r.qty)], ["Total (incl. GST)", inr(r.amount)], ["Date", r.date], ["Status", r.status]])) }); } });

    function seq() { return S(ctx).quoteSeq || 0; }
    function draw() {
      var q = quote(ctx), t = quoteTotals(q.lines.map(function (l) { return { pid: l.pid, qty: l.qty }; }), d.products);
      var cust = d.customers.filter(function (c) { return c.id === q.customerId; })[0];
      var no = "QT-2026-" + (130 + seq());
      /* builder */
      left.textContent = "";
      var custSel = E("select", { "data-q-customer": "", "aria-label": "Customer", on: { change: function () { setQuote(ctx, Object.assign({}, quote(ctx), { customerId: custSel.value })); draw(); } } },
        [E("option", { value: "" }, "Select customer…")].concat(d.customers.map(function (c) { return E("option", { value: c.id }, c.name); })));
      custSel.value = q.customerId;
      var prodSel = E("select", { "data-q-product": "", "aria-label": "Product", on: { change: function () { pid = prodSel.value; draw(); } } },
        d.products.map(function (p) { return E("option", { value: p.id }, p.sku + " · " + p.name + " · " + inr(p.price)); }));
      prodSel.value = pid;
      var qtyIn = E("input", { "data-q-qty": "", type: "number", min: "1", value: String(qty), "aria-label": "Quantity", on: { input: function () { qty = Math.max(1, parseInt(qtyIn.value, 10) || 1); } } });
      finishSel = E("select", { "data-q-finish": "", "aria-label": "Finish" }, product(ctx, pid).variants.map(function (v) { return E("option", { value: v }, v); }));
      left.appendChild(E("h3", {}, "Quotation builder"));
      left.appendChild(E("div", { class: "q-add" },
        E("label", { class: "eb-f wide" }, "Customer", custSel),
        E("label", { class: "eb-f wide" }, "Product", prodSel),
        E("label", { class: "eb-f" }, "Finish", finishSel), E("label", { class: "eb-f" }, "Qty", qtyIn),
        E("button", { type: "button", class: "eb-btn primary wide", "data-q-add": "", on: { click: function () {
          var cur = quote(ctx), pr = product(ctx, pid), fin = finishSel.value, ex = cur.lines.filter(function (l) { return l.pid === pid && l.finish === fin; })[0];
          setQuote(ctx, Object.assign({}, cur, { converted: null, lines: ex ? cur.lines.map(function (l) { return l === ex ? Object.assign({}, l, { qty: l.qty + qty }) : l; }) : cur.lines.concat([{ pid: pid, qty: qty, finish: fin }]) }));
          qty = 1; draw();
        } } }, "Add line")));
      var list = E("div", { style: { marginTop: "12px" } });
      if (!q.lines.length) list.appendChild(E("p", { style: { color: "#5a6676", fontSize: ".86rem" } }, "No lines yet. Add products here or from the Products catalogue."));
      q.lines.forEach(function (l, idx) {
        var pr = product(ctx, l.pid);
        var fs = E("select", { "aria-label": "Finish for " + pr.name, on: { change: function () { var c = quote(ctx); setQuote(ctx, Object.assign({}, c, { lines: c.lines.map(function (x, k) { return k === idx ? Object.assign({}, x, { finish: fs.value }) : x; }) })); draw(); } } }, pr.variants.map(function (v) { return E("option", { value: v }, v); }));
        fs.value = l.finish;
        var qi = E("input", { type: "number", min: "1", value: String(l.qty), "aria-label": "Quantity for " + pr.name, on: { change: function () { var c = quote(ctx), n = Math.max(1, parseInt(qi.value, 10) || 1); setQuote(ctx, Object.assign({}, c, { lines: c.lines.map(function (x, k) { return k === idx ? Object.assign({}, x, { qty: n }) : x; }) })); draw(); } } });
        list.appendChild(E("div", { class: "q-line" }, E("strong", {}, pr.name), fs, qi, E("button", { type: "button", class: "x", "aria-label": "Remove line", on: { click: function () { var c = quote(ctx); setQuote(ctx, Object.assign({}, c, { lines: c.lines.filter(function (x, k) { return k !== idx; }) })); draw(); } } }, "×")));
      });
      left.appendChild(list);

      /* preview */
      right.textContent = "";
      if (q.converted) {
        right.appendChild(E("div", { class: "q-ok", "data-q-converted": "", "data-order": q.converted }, E("strong", {}, "Converted to order " + q.converted), E("span", {}, "The order now appears in Orders."),
          E("div", { class: "eb-row", style: { justifyContent: "flex-start" } }, E("button", { type: "button", class: "eb-btn dark", on: { click: function () { ctx.open("orders"); } } }, "View orders"),
            E("button", { type: "button", class: "eb-btn", on: { click: function () { setQuote(ctx, { customerId: "", lines: [], status: "Draft" }); draw(); } } }, "New quotation"))));
      }
      var rows = q.lines.map(function (l, i) {
        var pr = product(ctx, l.pid);
        return E("tr", {}, E("td", {}, String(i + 1)), E("td", {}, pr.name, E("div", { style: { color: "#5a6676", fontSize: ".72rem" } }, pr.sku + " · " + l.finish)), E("td", { class: "r" }, String(l.qty)), E("td", { class: "r" }, inr(pr.price)), E("td", { class: "r" }, inr(pr.price * l.qty)));
      });
      right.appendChild(E("div", { class: "q-preview" },
        E("div", { class: "lh" }, E("div", {}, E("div", { class: "brand" }, "EUROBRASS"), E("div", { style: { color: "#5a6676" } }, "Premium bath fittings · Delhi")),
          E("div", { style: { textAlign: "right" } }, E("strong", {}, "QUOTATION"), E("div", {}, no), E("div", {}, d.today), pill(q.status || "Draft", q.status === "Sent" ? "brass" : ""))),
        E("div", {}, E("strong", {}, "Bill to: "), cust ? cust.name + ", " + cust.city : "— select a customer —"),
        E("table", {}, E("thead", {}, E("tr", {}, E("th", {}, "#"), E("th", {}, "Item"), E("th", { class: "r" }, "Qty"), E("th", { class: "r" }, "Rate"), E("th", { class: "r" }, "Amount"))),
          E("tbody", {}, rows.length ? rows : E("tr", {}, E("td", { colspan: "5", style: { color: "#5a6676" } }, "No items yet")))),
        E("div", { class: "tot" }, E("div", {}, E("span", {}, "Subtotal"), E("span", { "data-q-subtotal": "" }, inr(t.subtotal))),
          E("div", {}, E("span", {}, "GST (18%)"), E("span", { "data-q-gst": "" }, inr(t.gst))),
          E("div", { class: "g" }, E("span", {}, "Total"), E("span", { "data-q-total": "" }, inr(t.total)))),
        E("div", { class: "terms" }, "Prices in INR. Valid for 15 days. Delivery 2-3 weeks from order confirmation. Payment: 50% advance, balance before dispatch.")));
      var can = q.lines.length > 0 && cust;
      function send(kind) {
        if (!can) { sim("Simulated — pick a customer and add at least one line first."); return; }
        setQuote(ctx, Object.assign({}, quote(ctx), { status: "Sent" }));
        sim("Simulated — " + kind + " not sent. Quotation " + no + " to " + cust.name + " (" + inr(t.total) + ").");
        logAudit(ctx, d.employees[2].name, "Sent", "Quotations", no + " via " + kind);
        draw();
      }
      right.appendChild(E("div", { class: "eb-row", style: { marginTop: "12px", justifyContent: "flex-start" } },
        E("button", { type: "button", class: "eb-btn dark", "data-q-whatsapp": "", on: { click: function () { send("WhatsApp"); } } }, "Send via WhatsApp"),
        E("button", { type: "button", class: "eb-btn dark", "data-q-email": "", on: { click: function () { send("Email"); } } }, "Send via Email"),
        E("button", { type: "button", class: "eb-btn primary", "data-q-convert": "", on: { click: function () {
          if (!can) { sim("Simulated — pick a customer and add at least one line first."); return; }
          var n = (S(ctx).orderSeq || 0) + 1, id = "ORD-2026-" + (1100 + n), cur = quote(ctx);
          var order = { id: id, customer: cust.name, dealerId: null, date: d.today, items: t.units, amount: t.total, status: "Confirmed", payment: "Unpaid", fromQuote: no,
            lines: cur.lines.map(function (l) { var pr = product(ctx, l.pid); return { name: pr.name + " (" + l.finish + ")", qty: l.qty, amount: pr.price * l.qty }; }) };
          ctx.state.set({ newOrders: [order].concat(S(ctx).newOrders || []), orderSeq: n, quoteSeq: seq() + 1 });
          logAudit(ctx, d.employees[2].name, "Converted", "Quotations", no + " to " + id);
          notify(ctx, "Order", "Quotation " + no + " converted to order " + id + " for " + cust.name + ".");
          setQuote(ctx, { customerId: cur.customerId, lines: [], status: "Draft", converted: id });
          sim("Simulated — order " + id + " created in this demo only.");
          draw();
        } } }, "Convert to order")));
    }
    draw();
  } } });

  /* ---- orders ---- */
  mods.push({ id: "orders", label: "Orders", icon: "cart", group: "Sales", view: function (ctx) {
    ensureCss();
    return {
      type: "table", pageSize: 12, qKeys: ["id", "customer"],
      filters: [{ key: "status", label: "Status", options: ["Confirmed", "In Production", "Dispatched", "Delivered"] }, { key: "payment", label: "Payment", options: ["Paid", "Partially Paid", "Unpaid"] }],
      columns: [{ key: "id", label: "Order", sortable: true }, { key: "customer", label: "Customer", sortable: true }, { key: "date", label: "Date", sortable: true }, { key: "items", label: "Units" },
        { key: "amount", label: "Amount", sortable: true, render: function (r) { return inr(r.amount); } },
        { key: "status", label: "Status", render: function (r) { return pill(r.status, orderKind(r.status)); } }, { key: "payment", label: "Payment", render: function (r) { return pill(r.payment, payKind(r.payment)); } }],
      rows: allOrders(ctx),
      drawer: function (row) {
        return scope([kv([["Order", row.id], ["Customer", row.customer], ["Date", row.date], ["Status", row.status], ["Payment", row.payment], ["From quote", row.fromQuote || "—"]]),
          E("div", { class: "eb-h" }, "Items"), row.lines.map(function (l) { return E("div", { class: "eb-row", style: { padding: "6px 0", borderBottom: "1px solid rgba(11,31,51,.08)", fontSize: ".85rem" } }, E("span", {}, l.name + " × " + l.qty), E("strong", {}, inr(l.amount))); }),
          E("div", { class: "eb-row", style: { marginTop: "12px" } }, E("span", {}, "Total incl. 18% GST"), E("strong", {}, inr(row.amount))),
          E("button", { type: "button", class: "eb-btn primary", style: { marginTop: "14px" }, on: { click: function () { sim("Simulated — status not advanced."); } } }, "Advance status")]);
      }
    };
  } });

  /* ---- service board with technician assignment ---- */
  mods.push({ id: "service", label: "Service", icon: "settings", group: "After-sales", view: { type: "custom", render: function (host, ctx) {
    ensureCss();
    var d = D(ctx), cols = [{ id: "open", label: "Open" }, { id: "assigned", label: "Assigned" }, { id: "progress", label: "In Progress" }, { id: "resolved", label: "Resolved", tone: "good" }];
    var wrap = E("div", {}); host.appendChild(scope(wrap));
    var board = null;
    function cards() { return tickets(ctx).map(function (t) { return { id: t.id, col: t.col, title: t.title, sub: t.customer + " · " + t.product, tags: [t.priority].concat(t.tech ? [t.tech] : ["Unassigned"]), meta: t.id + " · raised " + t.raised }; }); }
    function sync(card, col) { ctx.state.set({ tickets: tickets(ctx).map(function (t) { return t.id === card.id ? Object.assign({}, t, { col: col }) : t; }) }); }
    board = AX.board.create(wrap, { columns: cols, cards: cards(), onMove: sync, onOpen: function (card) {
      var t = tickets(ctx).filter(function (x) { return x.id === card.id; })[0];
      var sel = E("select", { "data-tech": "", class: "eb-in", "aria-label": "Technician" }, [E("option", { value: "" }, "Select technician…")].concat(d.technicians.map(function (n) { return E("option", { value: n }, n); })));
      sel.value = t.tech || "";
      var dr = AX.ui.drawer({ title: t.id, body: scope([kv([["Issue", t.title], ["Customer", t.customer], ["Product", t.product], ["Priority", t.priority], ["Status", t.col], ["Technician", t.tech || "Unassigned"]]),
        E("div", { class: "eb-h" }, "Assign technician"), E("label", { class: "eb-f" }, "Technician", sel),
        E("button", { type: "button", class: "eb-btn primary", "data-assign": "", style: { marginTop: "12px" }, on: { click: function () {
          if (!sel.value) { sim("Simulated — choose a technician first."); return; }
          ctx.state.set({ tickets: tickets(ctx).map(function (x) { return x.id === t.id ? Object.assign({}, x, { tech: sel.value, col: x.col === "open" ? "assigned" : x.col }) : x; }) });
          board.setCards(cards());
          logAudit(ctx, d.employees[4].name, "Assigned", "Service", t.id + " to " + sel.value);
          sim("Simulated — " + sel.value + " notified for " + t.id + " (nothing sent).");
          dr.close();
        } } }, "Assign technician")]) });
    } });
  } } });

  /* ---- employees / roles / audit ---- */
  mods.push({ id: "employees", label: "Employees", icon: "users", group: "Admin", view: function (ctx) {
    ensureCss();
    var d = D(ctx);
    return {
      type: "table", pageSize: 10, qKeys: ["name", "role", "city"],
      filters: [{ key: "role", label: "Role", options: d.roles.map(function (r) { return r.name; }) }, { key: "status", label: "Status", options: ["Active", "On leave"] }],
      columns: [{ key: "name", label: "Employee", sortable: true }, { key: "role", label: "Role" }, { key: "dept", label: "Department" }, { key: "city", label: "City" }, { key: "status", label: "Status", render: function (r) { return pill(r.status, r.status === "Active" ? "good" : "warn"); } }],
      rows: d.employees,
      drawer: function (row) { return scope(kv([["Employee ID", row.id], ["Role", row.role], ["Department", row.dept], ["Email", row.email], ["Phone", row.phone], ["City", row.city], ["Joined", String(row.joined)]])); }
    };
  } });

  mods.push({ id: "roles", label: "Roles", icon: "wallet", group: "Admin", view: function (ctx) {
    ensureCss();
    return {
      type: "table", pageSize: 10,
      columns: [{ key: "name", label: "Role", sortable: true }, { key: "users", label: "Users", sortable: true }, { key: "description", label: "Description" }],
      rows: D(ctx).roles,
      drawer: function (row) {
        function tick(b) { return b ? "✓" : "–"; }
        return scope([E("p", { style: { fontSize: ".86rem" } }, row.description), E("table", { class: "eb-perm" }, E("thead", {}, E("tr", {}, ["Module", "View", "Create", "Edit", "Delete"].map(function (h) { return E("th", {}, h); }))),
          E("tbody", {}, row.perms.map(function (p) { return E("tr", {}, E("td", {}, p.module), E("td", {}, tick(p.view)), E("td", {}, tick(p.create)), E("td", {}, tick(p.edit)), E("td", {}, tick(p.remove))); })))]);
      }
    };
  } });

  mods.push({ id: "audit", label: "Audit log", icon: "file", group: "Admin", view: function (ctx) {
    ensureCss();
    var d = D(ctx);
    return {
      type: "table", pageSize: 12, qKeys: ["user", "action", "record"],
      filters: [{ key: "module", label: "Module", options: ["Quotations", "Leads", "Service", "Inventory", "Auth", "Reports", "Dealers", "Orders", "Employees"] }, { key: "action", label: "Action", options: ["Created", "Updated", "Converted", "Assigned", "Sent", "Stock adjusted", "Login", "Exported", "Changed role"] }],
      columns: [{ key: "at", label: "When", sortable: true }, { key: "user", label: "User" }, { key: "action", label: "Action" }, { key: "module", label: "Module" }, { key: "record", label: "Record" }, { key: "ip", label: "IP" }],
      rows: (S(ctx).auditExtra || []).concat(d.audit)
    };
  } });

  /* ---- analytics / reports ---- */
  mods.push({ id: "analytics", label: "Analytics", icon: "chart", group: "Insights", view: function (ctx) {
    var d = D(ctx), orders = allOrders(ctx), tot = orders.reduce(function (a, o) { return a + o.amount; }, 0);
    var bySeries = d.series.map(function (s) { return { label: s.name, value: d.products.filter(function (p) { return p.series === s.name; }).reduce(function (a, p) { return a + p.price * (3 + (p.id.charCodeAt(2) % 7)); }, 0) }; });
    return {
      type: "dashboard",
      kpis: [{ label: "Order value", value: tot, format: "inr" }, { label: "Avg order", value: Math.round(tot / orders.length), format: "inr" }, { label: "Customers", value: d.customers.length }, { label: "Dealers", value: d.dealers.length }],
      charts: [
        { type: "bar", title: "Sales by series (₹)", labels: bySeries.map(function (x) { return x.label; }), values: bySeries.map(function (x) { return x.value; }), wide: true },
        { type: "donut", title: "Customers by type", parts: ["Hotel", "Hospital", "Builder", "Architect", "Residential"].map(function (t) { return { label: t, value: d.customers.filter(function (c) { return c.type === t; }).length }; }) },
        { type: "bar", title: "Top dealers by YTD (₹)", horizontal: true, labels: d.dealers.slice(0, 5).map(function (x) { return x.name.split(" ")[0]; }), values: d.dealers.slice(0, 5).map(function (x) { return x.ytd; }) },
        { type: "gauge", title: "Quote-to-order conversion", value: Math.round(d.quotations.filter(function (q) { return q.status === "Converted" || q.status === "Approved"; }).length / d.quotations.length * 100), label: "Converted" }
      ]
    };
  } });

  mods.push({ id: "reports", label: "Reports", icon: "chart", group: "Insights", view: function (ctx) {
    var d = D(ctx), s = d.sales, t = tickets(ctx);
    var stockValue = d.inventory.reduce(function (a, x) { return a + x.onHand * d.products.filter(function (p) { return p.id === x.id; })[0].dealerPrice; }, 0);
    return {
      type: "dashboard",
      kpis: [{ label: "Inventory value", value: stockValue, format: "inr" }, { label: "Resolved tickets", value: t.filter(function (x) { return x.col === "resolved"; }).length }, { label: "Open tickets", value: t.filter(function (x) { return x.col !== "resolved"; }).length },
        { label: "Sales attainment", value: s.actual.reduce(function (a, b) { return a + b; }, 0) / s.target.reduce(function (a, b) { return a + b; }, 0) * 100, format: "pct" }],
      charts: [
        { type: "line", title: "Monthly sales report (₹)", wide: true, labels: s.labels, series: [{ name: "Actual", points: s.actual }, { name: "Target", points: s.target }] },
        { type: "bar", title: "Tickets by priority", labels: ["High", "Medium", "Low"], values: ["High", "Medium", "Low"].map(function (p) { return t.filter(function (x) { return x.priority === p; }).length; }) },
        { type: "donut", title: "Stock health", parts: ["In stock", "Low stock", "Out of stock"].map(function (l) { return { label: l, value: d.inventory.filter(function (x) { return x.level === l; }).length }; }) }
      ]
    };
  } });

  /* ---- notifications ---- */
  mods.push({ id: "notifications", label: "Notifications", icon: "bell", group: "Admin", view: { type: "custom", render: function (host, ctx) {
    ensureCss();
    var all = (S(ctx).notifExtra || []).concat(D(ctx).notifications.map(function (n) { return Object.assign({}, n); })), filter = "all";
    var list = E("div", {}), chips = E("div", { class: "eb-chips" });
    host.appendChild(scope([chips, list]));
    function draw() {
      chips.textContent = ""; list.textContent = "";
      [["all", "All"], ["unread", "Unread (" + all.filter(function (n) { return !n.read; }).length + ")"]].forEach(function (c) {
        chips.appendChild(E("button", { type: "button", class: "eb-btn", "aria-pressed": String(filter === c[0]), on: { click: function () { filter = c[0]; draw(); } } }, c[1]));
      });
      chips.appendChild(E("button", { type: "button", class: "eb-btn", on: { click: function () { all.forEach(function (n) { n.read = true; }); draw(); } } }, "Mark all read"));
      all.filter(function (n) { return filter === "all" || !n.read; }).forEach(function (n) {
        list.appendChild(E("div", { class: "eb-notif" + (n.read ? "" : " unread"), on: { click: function () { n.read = true; draw(); } } }, pill(n.kind, "brass"), E("div", {}, n.text, E("small", {}, n.at))));
      });
    }
    draw();
  } } });


  /* Compact rupee KPIs ("₹7.9L") so large figures never wrap inside a narrow card. */
  function lakhify(it) {
    if (it.format !== "inr" || typeof it.value !== "number" || it.value < 100000) return it;
    var v = it.value, s = v >= 1e7 ? "₹" + (v / 1e7).toFixed(2) + " Cr" : "₹" + (v / 1e5).toFixed(1) + " L";
    return Object.assign({}, it, { value: s, format: null });
  }
  mods.forEach(function (m) {
    if (typeof m.view !== "function") return;
    var v = m.view;
    m.view = function (ctx) { var r = v(ctx); if (r && r.kpis && r.kpis.map) r.kpis = r.kpis.map(lakhify); return r; };
  });

  AX.demos[SLUG] = {
    brand: { name: "Eurobrass CRM", accent: "#8C6A3E", logoText: "E" },
    start: "dashboard",
    modules: mods
  };
})(window);
