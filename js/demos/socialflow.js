/* SocialFlow demo: Instagram automation platform. Fictional data only (see js/demos/data/socialflow.js). */
(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.demos = AX.demos || {};
  var el = AX.el, fmt = AX.fmt;
  var ACCENT = "#C13584";

  function scope(css, slug) {
    var pre = '.ax-app[data-slug="' + slug + '"] ';
    return css.replace(/(^|[{}])\s*([^{}@]+?)\s*\{/g, function (m, b, sel) {
      if (sel.indexOf(".ax-app") === 0) return m;
      return b + sel.split(",").map(function (s) { return pre + s.trim() + "," + pre.replace(".ax-app", ".demo-scope") + s.trim(); }).join(",") + "{";
    });
  }
  var CSS = [
    ".ax-app[data-slug=socialflow] .ax-logo{background:linear-gradient(45deg,#F58529,#DD2A7B 55%,#8134AF)}",
    ".sf-pill{display:inline-block;font:600 11px var(--font-body);padding:2px 9px;border-radius:999px;background:rgba(11,31,51,.08);color:#2b3a4b;white-space:nowrap}",
    ".sf-pill.good{background:#dff3e6;color:#17663b}.sf-pill.warn{background:#fdf0d2;color:#7a4e00}.sf-pill.bad{background:#fbe0de;color:#9c1f19}.sf-pill.info{background:#dcebfb;color:#164a85}.sf-pill.brand{background:#f9e0ee;color:#8f1d5f}",
    ".sf-kv{display:grid;grid-template-columns:110px 1fr;gap:8px 12px;margin:0 0 16px;font-size:14px}.sf-kv dt{color:var(--ink-3);font:500 12px var(--font-mono)}.sf-kv dd{margin:0;overflow-wrap:anywhere}",
    ".sf-card{background:#fff;border:1px solid var(--ax-line);border-radius:12px;padding:16px;min-width:0}.sf-card h3{margin:0 0 8px;font:600 14px var(--font-display)}",
    ".sf-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}.sf-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.sf-gap{margin-top:16px}.sf-muted{color:var(--ink-3);font-size:13px}",
    ".sf-btn{appearance:none;font:600 13px var(--font-body);padding:9px 16px;border-radius:999px;border:1px solid var(--ax-line);background:#fff;color:var(--ink);cursor:pointer}.sf-btn.primary{background:var(--ax-accent);border-color:var(--ax-accent);color:#fff}.sf-btn:disabled{opacity:.5;cursor:default}",
    ".sf-input,.sf-sel{font:400 14px var(--font-body);padding:8px 12px;border:1px solid var(--ax-line);border-radius:8px;background:#fff;color:var(--ink);max-width:100%}",
    ".kb-chip{display:inline-block;margin-top:6px;font:600 11px var(--font-mono);padding:3px 8px;border-radius:99px;background:#f9e0ee;color:#8f1d5f;border:1px solid #efb7d6}",
    ".sf-ig{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:16px}@media(max-width:860px){.sf-ig{grid-template-columns:minmax(0,1fr)}}",
    ".sf-post-img{aspect-ratio:1;border-radius:8px;background:linear-gradient(135deg,#F58529,#DD2A7B 55%,#8134AF);display:grid;place-items:center;color:#fff;font:700 28px var(--font-display);text-align:center;padding:16px}",
    ".sf-comment{padding:8px 0;font-size:14px;border-bottom:1px solid var(--ax-line)}.sf-comment b{margin-right:6px}.sf-comment.brand{padding-left:16px;color:var(--ink-2)}",
    ".sf-phone{background:#f4f4f6;border-radius:18px;padding:12px;min-height:260px;display:flex;flex-direction:column;gap:8px}.sf-phone h4{margin:0 0 4px;font:600 13px var(--font-display)}",
    ".dm-msg{background:#fff;border-radius:14px 14px 14px 4px;padding:9px 12px;font-size:14px;max-width:92%;box-shadow:0 1px 2px rgba(0,0,0,.1)}.dm-msg.gate{background:#fff4de}",
    ".sf-canvas-wrap{display:grid;grid-template-columns:minmax(0,480px) minmax(0,1fr);gap:16px}@media(max-width:860px){.sf-canvas-wrap{grid-template-columns:minmax(0,1fr)}}",
    ".sf-canvas{position:relative;aspect-ratio:1;width:100%;border-radius:8px;overflow:hidden;border:1px solid var(--ax-line);touch-action:none;user-select:none}",
    ".sf-layer{position:absolute;transform:translate(-50%,-50%);cursor:grab;white-space:nowrap;font-family:var(--font-display);font-weight:700;padding:2px 6px;border:1px dashed transparent;touch-action:none}.sf-layer.sel{border-color:#fff;outline:2px solid rgba(0,0,0,.35)}.sf-layer.sticker{background:#fff;color:#C13584!important;border-radius:999px;padding:4px 12px;box-shadow:0 2px 6px rgba(0,0,0,.25)}",
    ".sf-sw{width:28px;height:28px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px var(--ax-line);cursor:pointer;padding:0}",
    ".sf-tl{display:flex;gap:4px;overflow-x:auto;padding:8px 0}.sf-clip{flex:none;height:56px;border-radius:8px;color:#fff;font:600 12px var(--font-body);padding:6px 8px;border:2px solid transparent;cursor:pointer;text-align:left;appearance:none}.sf-clip.sel{border-color:var(--ink)}",
    ".sf-track{position:relative;height:30px;border-radius:6px;background:rgba(11,31,51,.06);margin-top:4px}.sf-track i{position:absolute;top:0;bottom:0;border-left:2px solid var(--ax-accent);width:0}",
    ".sf-cap{display:flex;gap:8px;align-items:center;margin-top:6px}",
    ".sub-score{margin:6px 0}.sub-score .m{height:8px;border-radius:99px;background:rgba(11,31,51,.08);overflow:hidden}.sub-score .m i{display:block;height:100%;background:var(--ax-accent);border-radius:99px;transition:width .8s}",
    ".cap-variant{background:#fff;border:1px solid var(--ax-line);border-radius:10px;padding:12px;margin-top:10px}.cap-variant p{margin:0 0 6px;white-space:pre-wrap}",
    ".sf-tog{display:flex;justify-content:space-between;align-items:center;gap:12px}.sf-tog input{width:40px;height:22px;accent-color:var(--ax-accent)}"
  ].join("");
  (function () { if (document.getElementById("sf-demo-css")) return; var s = document.createElement("style"); s.id = "sf-demo-css"; s.textContent = scope(CSS, "socialflow"); document.head.appendChild(s); })();

  var TONE = { Live: "good", Paused: "warn", Draft: "info", Sent: "good", Running: "good", Scheduled: "info", Paid: "good", Shipped: "info", Delivered: "good", "COD pending": "warn", Refunded: "bad",
    Active: "good", Invited: "warn", Shortlisted: "info", Contacted: "info", Negotiating: "warn", Completed: "good", "Opted in": "good", Pending: "warn", Yes: "good", No: "warn", Connected: "good", "Not connected": "info" };
  function pill(text, tone) { return el("span", { class: "sf-pill " + (tone || TONE[text] || "") }, text); }
  function kv(pairs) { var dl = el("dl", { class: "sf-kv" }); pairs.forEach(function (p) { dl.appendChild(el("dt", {}, p[0])); dl.appendChild(el("dd", {}, p[1])); }); return dl; }
  function col(key, label, sortable, render) { var c = { key: key, label: label }; if (sortable !== false) c.sortable = true; if (render) c.render = render; return c; }
  function pillCol(key, label) { return col(key, label, true, function (r) { return pill(r[key]); }); }
  function simToast(ctx, text) { ctx.toast(text || "Simulated — nothing was sent or saved.", { kind: "sim" }); }
  function sum(a) { return a.reduce(function (s, x) { return s + x; }, 0); }
  function dash(kpis, charts) { return { type: "dashboard", kpis: kpis, charts: charts }; }

  function kbDecorate(root) {
    function run() {
      Array.prototype.forEach.call(root.querySelectorAll(".cht-msg.from-ai:not([data-kb]), .cht-msg.from-agent:not([data-kb])"), function (m) {
        m.setAttribute("data-kb", "1");
        var t = m.querySelector(".cht-text");
        if (!t) return;
        var i = t.textContent.indexOf("||kb:");
        if (i < 0) return;
        var name = t.textContent.slice(i + 5);
        t.textContent = t.textContent.slice(0, i).trim();
        m.appendChild(el("span", { class: "kb-chip" }, "Source: " + name));
      });
    }
    run();
    new MutationObserver(run).observe(root, { childList: true, subtree: true });
  }
  function matchDoc(q, docs) {
    q = q.toLowerCase();
    var best = null, bs = 0;
    docs.forEach(function (d) {
      var s = 0;
      (d.name + " " + d.answer).toLowerCase().split(/[^a-z0-9₹]+/).filter(function (x) { return x.length > 3; }).forEach(function (wd) { if (q.indexOf(wd) >= 0) s++; });
      if (s > bs) { bs = s; best = d; }
    });
    return best;
  }
  /* Chat with an own composer: answers from the knowledge base and cites the doc. */
  function kbChat(host, ctx, threads, suggestions, openId) {
    var chatHost = el("div");
    var api = AX.chat.create(chatHost, { composer: false, threads: threads });
    kbDecorate(chatHost);
    if (openId) api.open(openId);
    var input = el("input", { class: "sf-input", placeholder: "Reply as the AI agent, or type a customer question…", "aria-label": "Message", style: { flex: "1" } });
    var cur = openId || threads[0].id;
    chatHost.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest(".cht-thread"); if (b) cur = b.getAttribute("data-id"); });
    function ask(q) {
      q = String(q || input.value).trim(); if (!q) return; input.value = "";
      api.push(cur, { from: "user", text: q });
      var doc = matchDoc(q, ctx.data.docs);
      setTimeout(function () {
        api.push(cur, { from: "ai", text: doc ? doc.answer + "||kb:" + doc.name : "I could not find that in the knowledge base, so I have passed this to a teammate." });
      }, 250);
    }
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); ask(); } });
    host.appendChild(chatHost);
    host.appendChild(el("div", { class: "sf-row sf-gap" }, input, el("button", { type: "button", class: "sf-btn primary", on: { click: function () { ask(); } } }, "Send")));
    host.appendChild(el("div", { class: "sf-row sf-gap" }, suggestions.map(function (q) { return el("button", { type: "button", class: "sf-btn sf-q", on: { click: function () { ask(q); } } }, q); })));
    return api;
  }

  var modules = [];
  function tint() { var a = document.querySelector('.ax-app[data-slug="socialflow"]'); if (a) a.style.setProperty("--orange", ACCENT); }
  function wrapView(v) {
    if (v && typeof v.drawer === "function" && !v.__wrapped) {
      var d = v.drawer;
      v = Object.assign({}, v, { __wrapped: true, drawer: function (r, c) { return el("div", { class: "demo-scope", "data-slug": "socialflow", style: { "--ax-accent": ACCENT, "--ax-line": "rgba(11,31,51,.12)", "--orange": ACCENT } }, d(r, c)); } });
    }
    return v;
  }
  function M(group, id, label, icon, view) {
    modules.push({ id: id, label: label, icon: icon, group: group, view: function (ctx) { tint(); return wrapView(typeof view === "function" ? view(ctx) : view); } });
  }

  /* ---------------- Inbox ---------------- */
  M("Inbox", "inbox", "Unified inbox", "chat", {
    type: "custom",
    render: function (host, ctx) {
      host.appendChild(el("p", { class: "sf-muted" }, "Instagram, Facebook and Telegram DMs in one place. AI replies cite the knowledge-base document they used."));
      kbChat(host, ctx, ctx.data.threads, ["How much is the Glow Combo?", "Do you ship to Pune?", "What is your return policy?"]);
    }
  });

  M("Inbox", "comment-dm", "Comment to DM", "mail", {
    type: "custom",
    render: function (host, ctx) {
      var comments = el("div"), phone = el("div", { class: "sf-phone" });
      var state = { pending: false };
      var follows = el("input", { type: "checkbox", "data-field": "follows", id: "sf-follows", class: "ax-toggle" });
      var inp = el("input", { class: "sf-input", "data-field": "comment", value: "PRICE", "aria-label": "Comment", style: { flex: "1" } });
      var FULL = "Here you go: Starter pack ₹999, Glow Combo ₹1,499, Pro Kit ₹2,799. Shipping is free above ₹999. Reply BUY to get your link.";
      function addDm(text, cls) { phone.appendChild(el("div", { class: "dm-msg " + (cls || "") }, text)); }
      function post() {
        var text = inp.value.trim(); if (!text) return;
        comments.appendChild(el("div", { class: "sf-comment" }, el("b", {}, "you"), text));
        var kw = text.toUpperCase();
        if (kw.indexOf("PRICE") >= 0) {
          comments.appendChild(el("div", { class: "sf-comment brand" }, el("b", {}, "@glowlab.demo"), "Thanks! Check your DMs for the price."));
          if (follows.checked) { addDm(FULL); state.pending = false; }
          else { addDm("Hey! Follow us to unlock the price. Tap follow, then come back here.", "gate"); state.pending = true; }
        } else if (kw.indexOf("INFO") >= 0 || kw.indexOf("LINK") >= 0) {
          comments.appendChild(el("div", { class: "sf-comment brand" }, el("b", {}, "@glowlab.demo"), "Sent you the details in DM."));
          addDm("Here is the product page and brochure link (simulated).");
        } else {
          comments.appendChild(el("div", { class: "sf-comment brand" }, el("span", { class: "sf-muted" }, "No automation rule matched this comment.")));
        }
        inp.value = "";
        simToast(ctx, "Simulated — no real comment or DM was sent");
      }
      follows.addEventListener("change", function () {
        if (follows.checked && state.pending) { addDm(FULL); state.pending = false; }
      });
      phone.appendChild(el("h4", {}, "Direct messages · you"));
      host.appendChild(el("div", { class: "sf-ig" },
        el("div", { class: "sf-card" },
          el("div", { class: "sf-row", style: { marginBottom: "8px" } }, el("strong", {}, "@glowlab.demo"), pill("Rule: PRICE", "brand")),
          el("div", { class: "sf-post-img" }, "Glow Serum\ncomment PRICE"),
          el("p", { style: { fontSize: "14px" } }, "Our bestselling Glow Serum is back. Comment PRICE and we will DM you the offer."),
          comments,
          el("div", { class: "sf-row sf-gap" }, inp, el("button", { type: "button", class: "sf-btn primary", "data-action": "post-comment", on: { click: post } }, "Post comment")),
          el("label", { class: "sf-row sf-gap", for: "sf-follows" }, follows, el("span", {}, "This viewer follows @glowlab.demo"))),
        el("div", { class: "sf-card" }, el("h3", {}, "What the viewer receives"), phone,
          el("p", { class: "sf-muted" }, "Non-followers get a follow-gate message. Tick the follow box to release the full answer."))));
    }
  });

  /* ---------------- Automate ---------------- */
  M("Automate", "rules", "Automation rules", "settings", function (ctx) {
    return {
      type: "table", rows: ctx.data.rules, qKeys: ["keyword", "action", "trigger"], pageSize: 10,
      filters: [{ key: "status", label: "status", options: ["Live", "Paused", "Draft"] }, { key: "trigger", label: "trigger", options: ["Comment keyword", "Story reply", "Story mention", "New follower", "DM keyword", "Broadcast reply"] }],
      columns: [col("keyword", "Keyword / event"), col("trigger", "Trigger"), col("action", "Action"), pillCol("status", "Status"), col("fired", "Fired (30d)")],
      drawer: function (r) {
        return el("div", {}, kv([["Trigger", r.trigger], ["Action", r.action], ["Status", pill(r.status)], ["Fired (30d)", fmt.num(r.fired)]]),
          el("div", { class: "sf-row" }, el("button", { type: "button", class: "sf-btn primary", on: { click: function () { simToast(ctx, "Simulated — rule not changed"); } } }, r.status === "Live" ? "Pause rule" : "Activate rule"),
            el("button", { type: "button", class: "sf-btn", on: { click: function () { simToast(ctx, "Simulated — nothing was sent"); } } }, "Send test DM")));
      }
    };
  });

  M("Automate", "sequences", "Sequences", "pipeline", {
    type: "pipeline", currency: "₹",
    stages: [
      { id: "welcome", label: "Welcome DM (instant)", ms: 1800, log: ["Resolved contact handle", "Sent welcome DM (simulated)"] },
      { id: "wait", label: "Wait 1 day", ms: 1800, log: ["Waiting for reply window"] },
      { id: "offer", label: "Offer DM with 10% code", ms: 1800, log: ["Personalised code GLOW10", "Sent offer DM (simulated)"] },
      { id: "follow", label: "Follow-up if no reply (day 3)", ms: 1800, log: ["Checked 24 h messaging window", "Sent reminder (simulated)"] }
    ],
    gate: "offer"
  });

  M("Automate", "flows", "Flows", "flow", {
    type: "flow",
    nodes: [
      { id: "s1", kind: "trigger", label: "Story reply", detail: "Any story", x: 0, y: 70 },
      { id: "s2", kind: "ai", label: "AI intent check", detail: "Buy · ask · other", x: 220, y: 70 },
      { id: "s3", kind: "condition", label: "Wants to buy?", detail: "Intent score", x: 440, y: 70 },
      { id: "s4", kind: "action", label: "Product carousel DM", detail: "Top 3 items", x: 680, y: 0 },
      { id: "s5", kind: "ai", label: "Answer from KB", detail: "Cite source doc", x: 680, y: 140 },
      { id: "s6", kind: "action", label: "Send payment link", detail: "UPI + cards", x: 920, y: 0 },
      { id: "s7", kind: "end", label: "Handoff if unresolved", detail: "Assign agent", x: 920, y: 140 }
    ],
    edges: [["s1", "s2"], ["s2", "s3"], ["s3", "s4", "yes"], ["s3", "s5", "no"], ["s4", "s6"], ["s5", "s7"]]
  });

  M("Automate", "health", "Account health", "heart", function (ctx) {
    return dash([
      { label: "Messaging window left", value: "71%" }, { label: "API rate limit used", value: "38%" }, { label: "Token expires in", value: "47 days" }, { label: "Delivery rate", value: "98.2%", delta: 1 }
    ], [
      { type: "line", title: "DMs sent per day", wide: true, labels: ctx.data.days, series: [{ name: "DMs sent", points: ctx.data.series.dms }] },
      { type: "gauge", title: "Hourly rate-limit usage", value: 38, label: "of 200 DM/hour" },
      { type: "donut", title: "Message failures (7d)", parts: [{ label: "Outside 24h window", value: 9 }, { label: "User blocked", value: 4 }, { label: "Rate limited", value: 2 }] }
    ]);
  });

  /* ---------------- Business ---------------- */
  M("Business", "contacts", "Contacts", "users", function (ctx) {
    return {
      type: "table", rows: ctx.data.contacts, qKeys: ["name", "handle", "city"], pageSize: 12,
      filters: [{ key: "channel", label: "channel", options: ["Instagram", "Facebook", "Telegram"] }, { key: "tag", label: "tag", options: ["Customer", "Lead", "Influencer", "Follower"] }],
      columns: [col("name", "Name"), col("handle", "Handle", false), col("channel", "Channel"), col("tag", "Tag"), col("followers", "Followers", true, function (r) { return fmt.num(r.followers); }), pillCol("follows", "Follows us"), col("last", "Last seen", false)],
      drawer: function (r) { return kv([["Handle", r.handle], ["City", r.city], ["Channel", r.channel], ["Tag", r.tag], ["Followers", fmt.num(r.followers)], ["Follows us", pill(r.follows)], ["Consent", pill(r.optin)], ["Last seen", r.last]]); }
    };
  });

  M("Business", "leads", "Leads", "board", function (ctx) {
    return {
      type: "board", cards: ctx.data.leads,
      columns: [{ id: "new", label: "New" }, { id: "qualified", label: "Qualified" }, { id: "negotiating", label: "Negotiating", tone: "orange" }, { id: "won", label: "Won", tone: "good" }, { id: "lost", label: "Lost", tone: "bad" }],
      onMove: function (c, to) { ctx.toast("Simulated — lead moved to " + to, { kind: "sim" }); }
    };
  });

  M("Business", "bookings", "Bookings", "calendar", function (ctx) {
    return { type: "calendar", month: "2026-11", events: ctx.data.bookings, onDrop: function () { simToast(ctx, "Simulated — reminder DM not sent"); } };
  });

  M("Business", "campaigns", "Campaigns", "mail", function (ctx) {
    return {
      type: "table", rows: ctx.data.campaigns, qKeys: ["name", "type"], pageSize: 10,
      filters: [{ key: "status", label: "status", options: ["Sent", "Running", "Scheduled", "Draft"] }, { key: "type", label: "type", options: ["Broadcast", "Automation", "Story", "Comment trigger"] }],
      columns: [col("name", "Campaign"), col("type", "Type"), pillCol("status", "Status"), col("sent", "Sent", true, function (r) { return fmt.num(r.sent); }), col("delivered", "Delivered", true, function (r) { return fmt.num(r.delivered); }), col("replies", "Replies", true, function (r) { return fmt.num(r.replies); })],
      drawer: function (r) {
        return el("div", {}, kv([["Type", r.type], ["Status", pill(r.status)], ["Sent", fmt.num(r.sent)], ["Delivered", fmt.num(r.delivered)], ["Replies", fmt.num(r.replies)], ["Reply rate", r.sent ? fmt.pct(r.replies / r.sent * 100) : "n/a"]]),
          el("button", { type: "button", class: "sf-btn primary", on: { click: function () { simToast(ctx, "Simulated — campaign not sent"); } } }, r.status === "Draft" ? "Send campaign" : "Duplicate campaign"));
      }
    };
  });

  M("Business", "products", "Products", "store", function (ctx) {
    return { type: "store", products: ctx.data.products, categories: ["Skincare", "Haircare", "Combos", "Makeup"], currency: "₹", gstRate: 0.18, shipping: 49, freeOver: 999 };
  });

  M("Business", "orders", "Orders", "cart", function (ctx) {
    return {
      type: "table", rows: ctx.data.orders, qKeys: ["id", "customer", "item"], pageSize: 12,
      filters: [{ key: "status", label: "status", options: ["Paid", "Shipped", "Delivered", "COD pending", "Refunded"] }, { key: "via", label: "source", options: ["Comment PRICE", "Story reply", "DM", "Bio link"] }],
      columns: [col("id", "Order"), col("customer", "Customer"), col("item", "Item"), col("amount", "Amount", true, function (r) { return fmt.inr(r.amount); }), pillCol("status", "Status"), col("via", "Came via"), col("date", "Date")],
      drawer: function (r) {
        return el("div", {}, kv([["Customer", r.customer], ["City", r.city], ["Item", r.item], ["Amount", fmt.inr(r.amount)], ["Status", pill(r.status)], ["Came via", r.via]]),
          el("button", { type: "button", class: "sf-btn primary", on: { click: function () { simToast(ctx, "Simulated — tracking DM not sent"); } } }, "Send tracking update"));
      }
    };
  });

  M("Business", "influencers", "Influencers", "star", function (ctx) {
    return {
      type: "table", rows: ctx.data.influencers, qKeys: ["name", "handle", "niche"], pageSize: 10,
      filters: [{ key: "niche", label: "niche", options: ["Beauty", "Lifestyle", "Fitness", "Food", "Fashion"] }, { key: "status", label: "status", options: ["Shortlisted", "Contacted", "Negotiating", "Live", "Completed"] }],
      columns: [col("name", "Creator"), col("handle", "Handle", false), col("niche", "Niche"), col("followers", "Followers", true, function (r) { return fmt.num(r.followers); }), col("er", "Eng. rate", true, function (r) { return r.er + "%"; }), col("fee", "Fee", true, function (r) { return fmt.inr(r.fee); }), pillCol("status", "Status")],
      drawer: function (r) {
        return el("div", {}, kv([["Handle", r.handle], ["Niche", r.niche], ["Followers", fmt.num(r.followers)], ["Engagement", r.er + "%"], ["Typical fee", fmt.inr(r.fee)], ["Status", pill(r.status)]]),
          el("button", { type: "button", class: "sf-btn primary", on: { click: function () { simToast(ctx, "Simulated — outreach DM not sent"); } } }, "Send collab DM"));
      }
    };
  });

  M("Business", "ads", "Ads", "chart", function (ctx) {
    var s = ctx.data.series;
    return dash([
      { label: "Ad spend (30d)", value: "₹" + fmt.num(sum(s.spend)), delta: 7 }, { label: "Click-to-DM conversations", value: 3180, format: "num", delta: 19 },
      { label: "Cost per conversation", value: "₹14", delta: -12 }, { label: "Orders from ads", value: 241, format: "num", delta: 15 }
    ], [
      { type: "line", title: "Daily ad spend (₹)", wide: true, labels: ctx.data.days, series: [{ name: "Spend", points: s.spend }] },
      { type: "bar", title: "Conversations by ad set", horizontal: true, labels: ["Serum reel", "Combo carousel", "Story poll", "Lookalike 1%", "Retargeting"], values: [1020, 780, 540, 460, 380] },
      { type: "funnel", title: "Click to order", steps: [{ label: "Clicks", value: 9400 }, { label: "DM started", value: 3180 }, { label: "Qualified", value: 1210 }, { label: "Ordered", value: 241 }] }
    ]);
  });

  /* ---------------- Content ---------------- */
  var CAPTIONS = {
    Playful: ["Plot twist: {t} just made your day better. Tap, treat, repeat!", "Your daily dose of joy is here: {t}. Tell us your favourite way to use it!", "Not us obsessing over {t} again. Okay, you try it and tell us we're wrong."],
    Professional: ["Introducing {t}: developed with care, designed for everyday results. Learn more via the link in bio.", "{t} is now available. Here is what makes it different, and why customers keep coming back.", "Quality you can rely on. Discover {t} and see the difference in two weeks."],
    Luxe: ["Indulge in {t}. A quiet luxury for those who notice the details.", "Refined. Considered. {t} - crafted for rituals worth savouring.", "Elevate the everyday with {t}. Limited pieces, lasting impression."],
    Urgent: ["Only a few left: {t}. Comment SHOP and we will DM you the link now.", "Today only: {t} at our best price. Offer ends at midnight!", "Last call for {t}. Don't scroll past - grab yours before it sells out."]
  };
  M("Content", "studio", "AI studio", "flask", function (ctx) {
    return {
      type: "form", submit: "Generate captions",
      fields: [
        { key: "topic", label: "Topic", type: "text" },
        { key: "tone", label: "Tone", type: "select", options: ["Playful", "Professional", "Luxe", "Urgent"] },
        { key: "goal", label: "Goal", type: "select", options: ["Sales", "Awareness", "Engagement"] }
      ],
      onSubmit: function (v) {
        var topic = v.topic && v.topic.trim() ? v.topic.trim() : "the Glow Serum";
        var tags = { Sales: "#shopnow #offer", Awareness: "#newlaunch #brand", Engagement: "#community #yourturn" }[v.goal] || "#instagood";
        var wrap = el("div", {}, el("h3", { style: { font: "600 14px var(--font-display)" } }, "3 caption variants"));
        (CAPTIONS[v.tone] || CAPTIONS.Playful).forEach(function (t, i) {
          wrap.appendChild(el("div", { class: "cap-variant" }, el("p", {}, t.replace("{t}", topic) + "\n" + tags),
            el("div", { class: "sf-row" }, el("span", { class: "sf-pill brand" }, "Variant " + (i + 1)),
              el("button", { type: "button", class: "sf-btn", on: { click: function () { simToast(ctx, "Simulated — copied nothing to clipboard"); } } }, "Copy"),
              el("button", { type: "button", class: "sf-btn primary", on: { click: function () { simToast(ctx, "Simulated — sent to approvals"); } } }, "Send to approvals"))));
        });
        return wrap;
      }
    };
  });

  M("Content", "calendar", "Content calendar", "calendar", function (ctx) {
    return { type: "calendar", month: "2026-11", events: ctx.data.events, onDrop: function () { simToast(ctx, "Simulated — post rescheduled (nothing published)"); } };
  });

  M("Content", "approvals", "Approvals", "board", function (ctx) {
    return {
      type: "board", cards: ctx.data.approvals,
      columns: [{ id: "draft", label: "Draft" }, { id: "review", label: "In review", tone: "orange" }, { id: "approved", label: "Approved", tone: "good" }, { id: "scheduled", label: "Scheduled" }],
      onMove: function (c, to) { ctx.toast("Simulated — " + c.title + " moved to " + to, { kind: "sim" }); }
    };
  });

  M("Content", "design", "Design canvas", "dashboard", {
    type: "custom",
    render: function (host, ctx) {
      var bg = "#C13584", layers = [
        { id: "l1", type: "text", text: "Diwali Sale", x: 50, y: 38, color: "#ffffff", size: 7 },
        { id: "l2", type: "text", text: "Up to 40% off", x: 50, y: 56, color: "#ffffff", size: 4 },
        { id: "l3", type: "sticker", text: "NEW", x: 80, y: 14, color: "#C13584", size: 3 }
      ], sel = "l1", seq = 4, target = "text";
      var SW = ["#C13584", "#8134AF", "#F58529", "#0B1F33", "#1F9E8F", "#ffffff"];
      var canvas = el("div", { class: "sf-canvas", "aria-label": "1080 by 1080 design canvas" });
      var panel = el("div", { class: "sf-card" });
      host.appendChild(el("div", { class: "sf-canvas-wrap" }, el("div", {}, canvas, el("div", { class: "sf-muted" }, "1080 × 1080 · drag layers to move them")), panel));
      function byId(id) { return layers.filter(function (l) { return l.id === id; })[0]; }
      function draw() {
        canvas.textContent = ""; canvas.style.background = bg;
        layers.forEach(function (l) {
          var n = el("div", { class: "sf-layer " + l.type + (l.id === sel ? " sel" : ""), "data-layer": l.id, style: { left: l.x + "%", top: l.y + "%", color: l.color, fontSize: (l.size * 0.9) + "cqw" } }, l.text);
          n.style.fontSize = "calc(" + l.size + " * min(1vw, 6px) + 8px)";
          n.addEventListener("pointerdown", function (e) {
            sel = l.id; var rect = canvas.getBoundingClientRect(); n.setPointerCapture(e.pointerId);
            function mv(ev) { l.x = Math.max(0, Math.min(100, (ev.clientX - rect.left) / rect.width * 100)); l.y = Math.max(0, Math.min(100, (ev.clientY - rect.top) / rect.height * 100)); n.style.left = l.x + "%"; n.style.top = l.y + "%"; }
            function up() { n.removeEventListener("pointermove", mv); n.removeEventListener("pointerup", up); drawPanel(); draw(); }
            n.addEventListener("pointermove", mv); n.addEventListener("pointerup", up);
          });
          canvas.appendChild(n);
        });
      }
      function drawPanel() {
        panel.textContent = "";
        var l = byId(sel);
        panel.appendChild(el("h3", {}, "Layers"));
        panel.appendChild(el("div", { class: "sf-row" },
          el("button", { type: "button", class: "sf-btn", "data-action": "add-text", on: { click: function () { var id = "l" + (seq++); layers.push({ id: id, type: "text", text: "New text", x: 50, y: 75, color: "#ffffff", size: 5 }); sel = id; draw(); drawPanel(); } } }, "Add text"),
          ["SALE", "NEW", "50% OFF"].map(function (s) { return el("button", { type: "button", class: "sf-btn", on: { click: function () { var id = "l" + (seq++); layers.push({ id: id, type: "sticker", text: s, x: 25, y: 85, color: "#C13584", size: 3 }); sel = id; draw(); drawPanel(); } } }, "+ " + s); })));
        if (l) {
          panel.appendChild(el("div", { class: "sf-row sf-gap" }, el("input", { class: "sf-input", value: l.text, "aria-label": "Layer text", style: { flex: "1" }, on: { input: function (e) { l.text = e.target.value; var nn = canvas.querySelector('[data-layer="' + l.id + '"]'); if (nn) nn.textContent = l.text; } } }),
            el("button", { type: "button", class: "sf-btn", on: { click: function () { layers = layers.filter(function (x) { return x.id !== l.id; }); sel = layers.length ? layers[0].id : null; draw(); drawPanel(); } } }, "Delete")));
        }
        panel.appendChild(el("div", { class: "sf-row sf-gap" }, el("label", { class: "sf-muted" }, "Colour for"),
          el("select", { class: "sf-sel", "aria-label": "Colour target", on: { change: function (e) { target = e.target.value; } } }, el("option", { value: "text" }, "Selected layer"), el("option", { value: "bg" }, "Background"))));
        panel.appendChild(el("div", { class: "sf-row sf-gap" }, SW.map(function (c) {
          return el("button", { type: "button", class: "sf-sw", "aria-label": "Colour " + c, style: { background: c }, on: { click: function () { if (target === "bg") bg = c; else if (byId(sel)) byId(sel).color = c; draw(); } } });
        })));
        panel.appendChild(el("div", { class: "sf-row sf-gap" }, el("button", { type: "button", class: "sf-btn primary", on: { click: function () { simToast(ctx, "Simulated — nothing exported or posted"); } } }, "Export PNG")));
      }
      draw(); drawPanel();
    }
  });

  M("Content", "reels", "Reels editor", "chart", {
    type: "custom",
    render: function (host, ctx) {
      var clips = [
        { id: "k1", name: "Hook", dur: 3, color: "#C13584", cap: "Stop scrolling!" }, { id: "k2", name: "Product shot", dur: 5, color: "#8134AF", cap: "Meet the Glow Serum" },
        { id: "k3", name: "Texture close-up", dur: 4, color: "#F58529", cap: "Lightweight, absorbs fast" }, { id: "k4", name: "Result", dur: 6, color: "#1F9E8F", cap: "Glow in 14 days" }, { id: "k5", name: "CTA", dur: 3, color: "#0B1F33", cap: "Comment SHOP for the link" }
      ], sel = "k1", pos = 0, timer = null;
      var tl = el("div", { class: "sf-tl", role: "list", "aria-label": "Clip timeline" }), track = el("div", { class: "sf-track" }, el("i")), editor = el("div", { class: "sf-card sf-gap" });
      var info = el("div", { class: "sf-muted" });
      var playBtn = el("button", { type: "button", class: "sf-btn primary", "data-action": "play-reel" }, "Play preview");
      host.appendChild(el("div", { class: "sf-card" }, el("div", { class: "sf-row" }, playBtn, info), tl, el("div", { class: "sf-muted" }, "Caption track"), track, editor));
      function total() { return clips.reduce(function (s, c) { return s + c.dur; }, 0); }
      function draw() {
        tl.textContent = "";
        clips.forEach(function (c, i) {
          tl.appendChild(el("button", { type: "button", role: "listitem", class: "sf-clip" + (c.id === sel ? " sel" : ""), style: { background: c.color, width: Math.max(80, c.dur * 26) + "px" }, on: { click: function () { sel = c.id; draw(); } } }, c.name, el("div", {}, c.dur + "s")));
        });
        info.textContent = "Total " + total() + "s · " + clips.length + " clips";
        track.querySelectorAll("b").forEach(function (b) { b.remove(); });
        var acc = 0;
        clips.forEach(function (c) { var b = el("b", { style: { position: "absolute", left: (acc / total() * 100) + "%", width: (c.dur / total() * 100) + "%", top: 0, bottom: 0, fontSize: "10px", padding: "4px", overflow: "hidden", whiteSpace: "nowrap", borderRight: "1px solid rgba(11,31,51,.2)", fontWeight: 500 } }, c.cap); track.appendChild(b); acc += c.dur; });
        var c = clips.filter(function (x) { return x.id === sel; })[0];
        editor.textContent = "";
        if (!c) return;
        var idx = clips.indexOf(c);
        editor.appendChild(el("h3", {}, "Clip: " + c.name));
        editor.appendChild(el("div", { class: "sf-cap" }, el("input", { class: "sf-input", value: c.cap, "aria-label": "Caption", style: { flex: "1" }, on: { input: function (e) { c.cap = e.target.value; var bs = track.querySelectorAll("b"); if (bs[idx]) bs[idx].textContent = c.cap; } } })));
        editor.appendChild(el("div", { class: "sf-row sf-gap" },
          el("button", { type: "button", class: "sf-btn", disabled: idx === 0 ? "" : null, on: { click: function () { clips.splice(idx, 1); clips.splice(idx - 1, 0, c); draw(); } } }, "Move earlier"),
          el("button", { type: "button", class: "sf-btn", disabled: idx === clips.length - 1 ? "" : null, on: { click: function () { clips.splice(idx, 1); clips.splice(idx + 1, 0, c); draw(); } } }, "Move later"),
          el("button", { type: "button", class: "sf-btn", on: { click: function () { c.dur = Math.min(10, c.dur + 1); draw(); } } }, "+1s"),
          el("button", { type: "button", class: "sf-btn", on: { click: function () { c.dur = Math.max(1, c.dur - 1); draw(); } } }, "-1s"),
          el("button", { type: "button", class: "sf-btn primary", on: { click: function () { simToast(ctx, "Simulated — reel not rendered or posted"); } } }, "Export reel")));
      }
      playBtn.addEventListener("click", function () {
        if (timer) { clearInterval(timer); timer = null; }
        pos = 0; var head = track.querySelector("i");
        timer = setInterval(function () {
          if (!host.isConnected) { clearInterval(timer); return; }
          pos += 0.2; var pct = Math.min(100, pos / total() * 100); head.style.left = pct + "%";
          var acc = 0; clips.forEach(function (c) { if (pos >= acc && pos < acc + c.dur) sel = c.id; acc += c.dur; });
          if (pos >= total()) { clearInterval(timer); timer = null; draw(); }
        }, 100);
      });
      draw();
    }
  });

  /* ---------------- Growth ---------------- */
  M("Growth", "profile-score", "Profile score", "heart", {
    type: "custom",
    render: function (host, ctx) {
      var NAMES = ["Bio clarity", "Posting consistency", "Engagement rate", "Hashtag mix", "Reels share", "Story usage", "Response time", "Link in bio"];
      var scan = 0, box = el("div");
      host.appendChild(box);
      function draw() {
        var subs = NAMES.map(function (n, i) { return AX.fake.int("sf-ps-" + scan + "-" + i, 52, 96); });
        var total = Math.round(sum(subs) / subs.length);
        box.textContent = "";
        var gHost = el("div", { class: "sf-card" }, el("h3", {}, "Profile score"));
        var slot = el("div"); gHost.appendChild(slot);
        AX.charts.gauge(slot, { value: total, label: total >= 80 ? "Strong profile" : "Room to grow" });
        gHost.appendChild(el("div", { class: "sf-row sf-gap" }, el("button", { type: "button", class: "sf-btn primary", "data-action": "rescan", on: { click: function () { scan++; draw(); } } }, "Re-scan profile"), el("span", { class: "sf-muted" }, "Last scan: just now")));
        var list = el("div", { class: "sf-card" }, el("h3", {}, "8 sub-scores"));
        NAMES.forEach(function (n, i) {
          var bar = el("i", { style: { width: "0%" } });
          list.appendChild(el("div", { class: "sub-score" }, el("div", { class: "sf-row", style: { justifyContent: "space-between" } }, el("span", {}, n), el("b", {}, String(subs[i]))), el("div", { class: "m" }, bar)));
          setTimeout(function () { bar.style.width = subs[i] + "%"; }, 30);
        });
        var low = NAMES[subs.indexOf(Math.min.apply(null, subs))];
        box.appendChild(el("div", { class: "sf-grid" }, gHost, list));
        box.appendChild(el("p", { class: "sf-muted sf-gap" }, "Biggest opportunity: improve " + low.toLowerCase() + ". Fix it and your score could rise by about " + (100 - total > 12 ? 6 : 3) + " points."));
      }
      draw();
    }
  });

  M("Growth", "post-audit", "Post audit", "chart", function (ctx) {
    var rows = ctx.data.posts.map(function (p, i) { return Object.assign({ rank: i + 1 }, p); });
    return {
      type: "table", rows: rows, qKeys: ["title", "type"], pageSize: 10,
      filters: [{ key: "type", label: "type", options: ["Reel", "Carousel", "Image", "Story"] }],
      columns: [col("rank", "#"), col("title", "Post"), col("type", "Type"), col("reach", "Reach", true, function (r) { return fmt.num(r.reach); }), col("likes", "Likes"), col("comments", "Comments"), col("saves", "Saves"), col("er", "Eng. rate", true, function (r) { return r.er + "%"; })],
      drawer: function (r) {
        return el("div", {}, kv([["Type", r.type], ["Posted", r.posted], ["Reach", fmt.num(r.reach)], ["Likes", String(r.likes)], ["Comments", String(r.comments)], ["Saves", String(r.saves)], ["Engagement rate", r.er + "%"]]),
          el("p", { class: "sf-muted" }, r.er > 8 ? "Top performer: repurpose this format and hook next week." : "Below average: try a stronger first-3-second hook and a clearer call to action."));
      }
    };
  });

  M("Growth", "analytics", "Analytics", "chart", function (ctx) {
    var s = ctx.data.series;
    return dash([
      { label: "Followers", value: s.followers[s.followers.length - 1], format: "num", delta: 4 }, { label: "Reach (30d)", value: sum(s.reach), format: "num", delta: 12 },
      { label: "DM conversations", value: sum(s.dms), format: "num", delta: 17 }, { label: "Orders via Instagram", value: sum(s.orders), format: "num", delta: 9 }
    ], [
      { type: "line", title: "Followers and reach trend", wide: true, labels: ctx.data.days, series: [{ name: "Followers", points: s.followers }] },
      { type: "bar", title: "Reach by content type (k)", labels: ["Reels", "Carousels", "Images", "Stories"], values: [58, 31, 18, 40] },
      { type: "donut", title: "Where DMs come from", parts: [{ label: "Comment triggers", value: 46 }, { label: "Story replies", value: 28 }, { label: "Ads", value: 18 }, { label: "Profile", value: 8 }] },
      { type: "funnel", title: "DM to order", steps: [{ label: "DMs", value: 3180 }, { label: "Leads", value: 1210 }, { label: "Orders", value: 241 }] }
    ]);
  });

  M("Growth", "knowledge", "Knowledge base", "file", {
    type: "custom",
    render: function (host, ctx) {
      var list = el("div", { class: "sf-card" }, el("h3", {}, "Documents the AI can cite"),
        ctx.data.docs.map(function (x) { return el("div", { class: "sf-row", style: { justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--ax-line)" } }, el("span", {}, x.name), el("span", { class: "sf-muted" }, x.pages + " p · " + x.updated)); }),
        el("button", { type: "button", class: "sf-btn sf-gap", on: { click: function () { simToast(ctx, "Simulated — nothing was uploaded"); } } }, "Upload document"));
      var ask = el("div", { class: "sf-card" }, el("h3", {}, "Test the agent"));
      host.appendChild(el("div", { class: "sf-grid" }, list, ask));
      kbChat(ask, ctx, [{ id: "kb", name: "Sandbox", channel: "web", preview: "Ask a question", messages: [{ from: "ai", text: "Ask anything the documents cover. I answer only from the knowledge base." }] }], ["How much is the Pro Kit?", "Can I get cash on delivery?", "Do you work with influencers?"]);
    }
  });

  /* ---------------- Settings ---------------- */
  M("Settings", "team", "Team", "users", function (ctx) {
    return {
      type: "table", rows: ctx.data.team, qKeys: ["name", "role", "email"], pageSize: 10,
      columns: [col("name", "Name"), col("role", "Role"), col("email", "Email", false), pillCol("status", "Status"), col("replies", "Replies (30d)")],
      drawer: function (r) {
        return el("div", {}, kv([["Email", r.email], ["Role", r.role], ["Status", pill(r.status)], ["Replies (30d)", String(r.replies)]]),
          el("button", { type: "button", class: "sf-btn", on: { click: function () { simToast(ctx, "Simulated — invite not sent"); } } }, "Change role"));
      }
    };
  });

  M("Settings", "channels", "Channels", "phone", {
    type: "custom",
    render: function (host, ctx) {
      var CH = [["Instagram", "@glowlab.demo", true], ["Facebook Messenger", "Glow Lab Page", true], ["Telegram", "@glowlab_bot", true], ["WhatsApp", "+91 98xxx x0000", false], ["Website chat widget", "glowlab.example.in", false], ["Email", "hello@example.in", false]];
      var grid = el("div", { class: "sf-grid" });
      CH.forEach(function (c) {
        var cb = el("input", { type: "checkbox", "aria-label": "Connect " + c[0], class: "ax-toggle" });
        cb.checked = c[2];
        var st = el("span", {}, pill(c[2] ? "Connected" : "Not connected"));
        cb.addEventListener("change", function () { st.textContent = ""; st.appendChild(pill(cb.checked ? "Connected" : "Not connected")); simToast(ctx, "Simulated — " + c[0] + " connection not changed"); });
        grid.appendChild(el("div", { class: "sf-card sf-tog" }, el("div", {}, el("strong", {}, c[0]), el("div", { class: "sf-muted" }, c[1]), st), cb));
      });
      host.appendChild(grid);
    }
  });

  AX.demos.socialflow = { brand: { name: "SocialFlow", accent: ACCENT, logoText: "S" }, start: "inbox", modules: modules };
})(window);
