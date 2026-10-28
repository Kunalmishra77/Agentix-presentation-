(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.demos = AX.demos || {};
  var el = AX.el;
  var CSS = [
    ".sp-pill{display:inline-block;font:600 10px var(--font-mono);padding:2px 7px;border-radius:6px;color:#fff;margin-right:3px}",
    ".sp-status{display:inline-block;font:600 11px var(--font-body);padding:2px 10px;border-radius:999px;white-space:nowrap}",
    ".sp-status[data-status=Queued]{background:#E6EEF9;color:#26467A}.sp-status[data-status=Publishing]{background:#FEF3D7;color:#8A5A00}",
    ".sp-status[data-status=Published]{background:#DDF5E7;color:#116B3A}.sp-status[data-status=Failed]{background:#FEE9E7;color:#B42318}.sp-status[data-status=Retried]{background:#EDE7FB;color:#5B3AA8}",
    ".sp-accts{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px}",
    ".sp-acct{background:#fff;border:1px solid var(--ax-line);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:8px}",
    ".sp-logo{width:40px;height:40px;border-radius:10px;color:#fff;display:grid;place-items:center;font:700 14px var(--font-display)}",
    ".sp-acct h3{margin:0;font:600 15px var(--font-display)}.sp-acct small{color:var(--ink-3);font-size:12px}",
    ".sp-ok{color:#116B3A;font:600 12px var(--font-body)}.sp-warn{color:#8A5A00;font:600 12px var(--font-body)}.sp-off{color:var(--ink-3);font:600 12px var(--font-body)}",
    ".sp-btn{appearance:none;font:600 13px var(--font-body);padding:8px 16px;border-radius:999px;border:1px solid var(--ax-accent);background:var(--ax-accent);color:#fff;cursor:pointer}",
    ".sp-btn.ghost{background:#fff;color:var(--ax-accent)}.sp-btn:disabled{opacity:.5}",
    ".sp-comp{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:18px;align-items:start}",
    "@media (max-width:900px){.sp-comp{grid-template-columns:minmax(0,1fr)}}",
    ".sp-panel{background:#fff;border:1px solid var(--ax-line);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:12px;min-width:0}",
    ".sp-panel h4{margin:0;font:600 12px var(--font-mono);text-transform:uppercase;letter-spacing:.06em;color:var(--ink-3)}",
    ".sp-text{width:100%;min-height:110px;resize:vertical;padding:10px 12px;border:1px solid var(--ax-line);border-radius:10px;font:400 14px/1.45 var(--font-body);background:#FBFAF7}",
    ".sp-medias{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}",
    ".sp-media{appearance:none;border:2px solid transparent;border-radius:10px;padding:0;overflow:hidden;cursor:pointer;aspect-ratio:1;background:#eee}",
    ".sp-media img{width:100%;height:100%;object-fit:cover;display:block}.sp-media[aria-pressed=true]{border-color:var(--ax-accent)}",
    ".sp-plats{display:flex;flex-wrap:wrap;gap:8px}",
    ".sp-plat{appearance:none;display:inline-flex;align-items:center;gap:6px;padding:6px 12px 6px 6px;border-radius:999px;border:1px solid var(--ax-line);background:#fff;font:600 12px var(--font-body);cursor:pointer;color:var(--ink-2)}",
    ".sp-plat i{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;color:#fff;font:700 9px var(--font-mono);font-style:normal}",
    ".sp-plat[aria-pressed=true]{border-color:var(--ax-accent);background:color-mix(in srgb,var(--ax-accent) 10%,#fff);color:var(--ink)}",
    ".sp-plat:disabled{opacity:.45;cursor:not-allowed}",
    ".sp-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}.sp-row input[type=date],.sp-row input[type=time]{padding:7px 10px;border:1px solid var(--ax-line);border-radius:8px;font:400 13px var(--font-body)}",
    ".sp-previews{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px}",
    ".sp-preview{border:1px solid var(--ax-line);border-radius:12px;overflow:hidden;background:#fff;display:flex;flex-direction:column;min-width:0}",
    ".sp-pv-h{display:flex;align-items:center;gap:8px;padding:8px 10px;font:600 12px var(--font-body)}.sp-pv-h small{margin-left:auto;font:500 10px var(--font-mono);color:var(--ink-3)}",
    ".sp-pv-media{width:100%;background:#eee;overflow:hidden;max-height:300px}.sp-pv-media img{width:100%;height:100%;object-fit:cover;display:block}",
    ".sp-pv-t{padding:8px 10px;font-size:12px;line-height:1.4;word-break:break-word}.sp-pv-t.over{color:#B42318}.sp-pv-c{padding:0 10px 8px;font:500 10px var(--font-mono);color:var(--ink-3)}",
    ".sp-empty{padding:24px;text-align:center;color:var(--ink-3);font-size:13px;border:1px dashed var(--ax-line);border-radius:10px}",
    ".sp-oauth{display:flex;flex-direction:column;gap:12px;font-size:14px}.sp-oauth ul{margin:0;padding-left:18px;color:var(--ink-2)}"
  ].join("\n");
  function injectCss() {
    if (document.getElementById("sp-css")) return;
    var s = document.createElement("style"); s.id = "sp-css"; s.textContent = CSS; document.head.appendChild(s);
  }
  function P(ctx, id) { return ctx.data.platforms.filter(function (p) { return p.id === id; })[0]; }
  function M(ctx, id) { return ctx.data.media.filter(function (m) { return m.id === id; })[0]; }
  function pill(p) { return el("span", { class: "sp-pill", style: { background: p.color }, title: p.name }, p.short); }
  function statusChip(s) { return el("span", { class: "sp-status", "data-status": s }, s); }

  /* Shared mutable state: posts live in ctx.state so composer, posts, calendar and overview agree. */
  function posts(ctx) {
    var s = ctx.state.get();
    if (!s.posts) { ctx.state.set({ posts: ctx.data.posts.map(function (p) { return Object.assign({}, p, { platforms: p.platforms.slice() }); }), seq: 1 }); s = ctx.state.get(); }
    return s.posts;
  }
  function accounts(ctx) {
    var s = ctx.state.get();
    if (!s.accounts) { ctx.state.set({ accounts: ctx.data.accounts.map(function (a) { return Object.assign({}, a); }) }); s = ctx.state.get(); }
    return s.accounts;
  }
  function refreshPosts() {
    var inp = document.querySelector('[data-module="posts"] .tbl-search');
    if (inp) inp.dispatchEvent(new Event("input"));
  }
  function track(post, plan) {
    plan.forEach(function (st) { setTimeout(function () { post.status = st[1]; if (st[1] === "Published") post.reach = 1800 + post.platforms.length * 950; refreshPosts(); }, st[0]); });
  }

  function accountsView(host, ctx) {
    injectCss();
    var grid = el("div", { class: "sp-accts" });
    host.appendChild(grid);
    function draw() {
      grid.textContent = "";
      var acc = accounts(ctx);
      ctx.data.platforms.forEach(function (p, i) {
        var a = acc[i];
        grid.appendChild(el("article", { class: "sp-acct", "data-plat": p.id },
          el("div", { class: "sp-logo", style: { background: p.color } }, p.short),
          el("h3", {}, p.name), el("small", {}, p.label + " · " + (a.connected ? p.handle : "no account linked")),
          a.connected ? (a.expiring ? el("span", { class: "sp-warn" }, "Token expires in 3 days") : el("span", { class: "sp-ok" }, "Connected · " + AX.fmt.num(p.followers) + " followers")) : el("span", { class: "sp-off" }, "Not connected"),
          el("button", { type: "button", class: "sp-btn sp-connect" + (a.connected && !a.expiring ? " ghost" : ""), on: { click: function () { oauth(p, a); } } },
            a.connected ? (a.expiring ? "Reconnect" : "Manage") : "Connect " + p.name)));
      });
    }
    function oauth(p, a) {
      var m = AX.ui.modal({ title: "Connect " + p.name,
        body: el("div", { class: "sp-oauth" },
          el("div", { class: "sp-logo", style: { background: p.color } }, p.short),
          el("p", { style: { margin: 0 } }, el("b", {}, "SocialPush"), " wants to access your " + p.name + " account (fictional consent screen)."),
          el("ul", {}, el("li", {}, "Publish posts and media on your behalf"), el("li", {}, "Read comments and basic analytics"), el("li", {}, "Refresh access automatically")),
          el("div", { class: "sp-row" },
            el("button", { type: "button", class: "sp-btn sp-oauth-allow", on: { click: function () { a.connected = true; a.expiring = false; m.close(); draw(); AX.ui.toast("Simulated — " + p.name + " connected, no real login happened", { kind: "sim" }); } } }, "Allow"),
            el("button", { type: "button", class: "sp-btn ghost", on: { click: function () { m.close(); } } }, "Cancel"))) });
    }
    draw();
  }

  var CAPTIONS = [
    "Big news from the studio: {t} Swipe through for the details, tag a friend who needs this, and tap the link in bio to shop. #LumenLane #HandmadeInIndia",
    "{t} We poured weeks into this one and cannot wait for you to see it. Drop a comment and tell us what you think. #SmallBusiness #MadeWithLove"
  ];
  function composerView(host, ctx) {
    injectCss();
    var st = { media: "m1", plats: {}, ai: 0 };
    var acc = accounts(ctx);
    var ta = el("textarea", { class: "sp-text", "aria-label": "Post text", placeholder: "Write once, publish everywhere..." });
    var mediaBox = el("div", { class: "sp-medias", role: "group", "aria-label": "Media" });
    var platBox = el("div", { class: "sp-plats", role: "group", "aria-label": "Platforms" });
    var prevBox = el("div", { class: "sp-previews", "aria-live": "polite" });
    var dateInp = el("input", { type: "date", "aria-label": "Date" }); dateInp.value = "2026-11-14";
    var timeInp = el("input", { type: "time", "aria-label": "Time" }); timeInp.value = "10:00";
    function drawMedia() {
      mediaBox.textContent = "";
      ctx.data.media.forEach(function (m) {
        mediaBox.appendChild(el("button", { type: "button", class: "sp-media", "data-media": m.id, "aria-pressed": String(st.media === m.id), title: m.name, "aria-label": m.name,
          on: { click: function () { st.media = m.id; drawMedia(); drawPrev(); } } }, el("img", { src: m.src, alt: m.name })));
      });
    }
    function drawPlats() {
      platBox.textContent = "";
      ctx.data.platforms.forEach(function (p, i) {
        var on = !!st.plats[p.id], dis = !acc[i].connected;
        platBox.appendChild(el("button", { type: "button", class: "sp-plat", "data-plat": p.id, "aria-pressed": String(on), disabled: dis ? "" : null, title: dis ? p.name + " is not connected" : p.name,
          on: { click: function () { st.plats[p.id] = !st.plats[p.id]; drawPlats(); drawPrev(); } } }, el("i", { style: { background: p.color } }, p.short), p.name));
      });
    }
    function drawPrev() {
      prevBox.textContent = "";
      var sel = ctx.data.platforms.filter(function (p) { return st.plats[p.id]; });
      if (!sel.length) { prevBox.appendChild(el("div", { class: "sp-empty" }, "Toggle a platform to see how the post will look there.")); return; }
      var m = M(ctx, st.media), txt = ta.value || "Your caption appears here...";
      sel.forEach(function (p) {
        var rr = p.ratio.split(":"), ar = rr[0] + " / " + rr[1];
        var over = ta.value.length > p.limit;
        prevBox.appendChild(el("div", { class: "sp-preview", "data-plat": p.id, "data-ratio": p.ratio },
          el("div", { class: "sp-pv-h" }, pill(p), p.handle.length > 18 ? p.name : p.handle, el("small", {}, p.ratio + " · " + p.label)),
          el("div", { class: "sp-pv-media", style: { aspectRatio: ar } }, el("img", { src: m.src, alt: "" })),
          el("div", { class: "sp-pv-t" + (over ? " over" : "") }, txt.length > 140 ? txt.slice(0, 140) + "…" : txt),
          el("div", { class: "sp-pv-c" }, ta.value.length + " / " + AX.fmt.num(p.limit) + (over ? " · too long, will be trimmed" : ""))));
      });
    }
    ta.addEventListener("input", drawPrev);
    function create(now) {
      var sel = ctx.data.platforms.filter(function (p) { return st.plats[p.id]; });
      var text = ta.value.trim();
      if (!text) { AX.ui.toast("Write something first", { kind: "err" }); return; }
      if (!sel.length) { AX.ui.toast("Pick at least one platform", { kind: "err" }); return; }
      var list = posts(ctx), seq = ctx.state.get().seq || 1;
      ctx.state.set({ seq: seq + 1 });
      var post = { id: "new-" + seq, name: "Post NEW-" + seq + " · just now", title: text, platforms: sel.map(function (p) { return p.id; }), date: now ? "2026-10-28" : dateInp.value || "2026-11-14",
        time: now ? "now" : timeInp.value || "10:00", status: "Queued", media: st.media, by: "You (demo)", reach: 0, error: "" };
      list.unshift(post);
      track(post, now ? [[800, "Publishing"], [2400, "Published"]] : [[1600, "Publishing"], [3600, "Published"]]);
      AX.ui.toast(now ? "Simulated — publishing to " + sel.length + " platforms, nothing was sent" : "Simulated — scheduled for " + post.date + ", nothing was sent", { kind: "sim" });
      ta.value = ""; drawPrev();
    }
    var aiBtn = el("button", { type: "button", class: "sp-btn ghost sp-ai", on: { click: function () {
      var topic = ta.value.trim().replace(/[.!?]+$/, "") || "We have something new";
      ta.value = CAPTIONS[st.ai++ % CAPTIONS.length].replace("{t}", topic + ".");
      drawPrev();
      AX.ui.toast("Simulated — AI caption written from a template", { kind: "sim" });
    } } }, "AI caption");
    host.appendChild(el("div", { class: "sp-comp" },
      el("div", { class: "sp-panel" }, el("h4", {}, "Compose"), ta,
        el("div", { class: "sp-row" }, aiBtn),
        el("h4", {}, "Media"), mediaBox, el("h4", {}, "Platforms"), platBox,
        el("h4", {}, "When"), el("div", { class: "sp-row" }, dateInp, timeInp),
        el("div", { class: "sp-row" },
          el("button", { type: "button", class: "sp-btn ghost sp-publish", on: { click: function () { create(true); } } }, "Publish now"),
          el("button", { type: "button", class: "sp-btn sp-schedule", on: { click: function () { create(false); } } }, "Schedule"))),
      el("div", { class: "sp-panel" }, el("h4", {}, "Live previews"), prevBox)));
    drawMedia(); drawPlats(); drawPrev();
  }

  function postDrawer(r, ctx) {
    var m = M(ctx, r.media);
    return el("div", {},
      el("div", { class: "sp-row", style: { marginBottom: "12px" } }, statusChip(r.status), el("span", {}, r.date + " " + r.time + " · by " + r.by)),
      el("img", { src: m.src, alt: m.name, style: { width: "100%", maxHeight: "240px", objectFit: "cover", borderRadius: "10px", marginBottom: "12px" } }),
      el("p", { style: { margin: "0 0 12px" } }, r.title),
      el("h4", { style: { margin: "0 0 6px", font: "600 12px var(--font-mono)", color: "var(--ink-3)", textTransform: "uppercase" } }, "Per-platform result"),
      el("ul", { style: { margin: 0, paddingLeft: "18px", lineHeight: 1.8 } }, r.platforms.map(function (id) {
        var p = P(ctx, id);
        return el("li", {}, p.name + " — " + (r.status === "Failed" && id === r.platforms[0] ? "failed" : r.status === "Published" || r.status === "Retried" ? "live" : r.status.toLowerCase()));
      })),
      r.error ? el("p", { style: { color: "#B42318", fontSize: "13px" } }, r.error) : null);
  }

  var TONE = { Published: "good", Queued: "teal", Publishing: "orange", Failed: "bad", Retried: "orange" };

  w.AX.demos.socialpush = {
    brand: { name: "SocialPush", accent: "#0EA5E9", logoText: "S" },
    start: "overview",
    modules: [
      { id: "overview", label: "Overview", icon: "dashboard", group: "Publish", view: function (ctx) {
        injectCss();
        var d = ctx.data, list = posts(ctx);
        var by = {}; list.forEach(function (p) { p.platforms.forEach(function (id) { by[id] = (by[id] || 0) + 1; }); });
        return { type: "dashboard",
          kpis: [{ label: "Posts this month", value: list.length, delta: 11, format: "num" }, { label: "Scheduled", value: list.filter(function (p) { return p.status === "Queued"; }).length, format: "num" },
            { label: "Total followers", value: d.platforms.reduce(function (a, p) { return a + p.followers; }, 0), delta: 4, format: "num" }, { label: "Avg engagement", value: "4.6%", delta: 6 }],
          charts: [
            { type: "line", title: "Followers across platforms", wide: true, labels: d.labels, series: [{ name: "Followers", points: d.followersSeries }] },
            { type: "bar", title: "Posts by platform", labels: d.platforms.map(function (p) { return p.short; }), values: d.platforms.map(function (p) { return by[p.id] || 0; }) },
            { type: "donut", title: "Publishing status", parts: ["Published", "Queued", "Failed", "Retried"].map(function (s) { return { label: s, value: list.filter(function (p) { return p.status === s; }).length }; }) }
          ] };
      } },
      { id: "accounts", label: "Accounts", icon: "users", group: "Publish", view: { type: "custom", render: accountsView } },
      { id: "composer", label: "Composer", icon: "form", group: "Publish", view: { type: "custom", render: composerView } },
      { id: "posts", label: "Posts", icon: "table", group: "Publish", view: function (ctx) {
        injectCss();
        return { type: "table", pageSize: 10, rows: posts(ctx), qKeys: ["title", "by", "date"],
          filters: [{ key: "status", label: "status", options: ["Queued", "Publishing", "Published", "Failed", "Retried"] }],
          columns: [
            { key: "title", label: "Post", sortable: true, render: function (r) { return r.title.length > 54 ? r.title.slice(0, 54) + "…" : r.title; } },
            { key: "platforms", label: "Platforms", render: function (r) { return el("span", {}, r.platforms.map(function (id) { return pill(P(ctx, id)); })); } },
            { key: "date", label: "Scheduled", sortable: true, render: function (r) { return r.date + " " + r.time; } },
            { key: "status", label: "Status", sortable: true, render: function (r) { return statusChip(r.status); } },
            { key: "reach", label: "Reach", sortable: true, render: function (r) { return r.reach ? AX.fmt.num(r.reach) : "—"; } }],
          actions: [{ label: "Retry", onClick: function (r) {
            if (r.status !== "Failed") { AX.ui.toast("Simulated — only failed posts can be retried", { kind: "sim" }); return; }
            r.status = "Retried"; r.error = ""; refreshPosts();
            setTimeout(function () { r.status = "Published"; r.reach = 2400; refreshPosts(); }, 1500);
            AX.ui.toast("Simulated — retry queued, nothing was sent", { kind: "sim" });
          } }],
          drawer: function (r, c) { return postDrawer(r, c); } };
      } },
      { id: "calendar", label: "Calendar", icon: "calendar", group: "Publish", view: function (ctx) {
        return { type: "calendar", month: "2026-11",
          events: posts(ctx).map(function (p) { return { id: p.id, title: p.platforms.map(function (id) { return P(ctx, id).short; }).join("·") + " " + (p.title.length > 22 ? p.title.slice(0, 22) + "…" : p.title), date: p.date, tone: TONE[p.status] || "navy" }; }),
          onDrop: function (id, date) {
            var p = posts(ctx).filter(function (x) { return x.id === id; })[0];
            if (p) p.date = date;
            AX.ui.toast("Simulated — rescheduled to " + date + ", nothing was saved", { kind: "sim" });
          },
          onOpen: function (ev) {
            var p = posts(ctx).filter(function (x) { return x.id === ev.id; })[0];
            if (p) AX.ui.drawer({ title: p.id.toUpperCase() + " · " + p.date, body: postDrawer(p, ctx) });
          } };
      } },
      { id: "analytics", label: "Analytics", icon: "chart", group: "Grow", view: function (ctx) {
        var d = ctx.data;
        return { type: "dashboard",
          kpis: [{ label: "Reach (30d)", value: 482300, delta: 13, format: "num" }, { label: "Impressions", value: 1204500, delta: 9, format: "num" }, { label: "Link clicks", value: 8420, delta: 21, format: "num" }, { label: "Best time", value: "7–9 PM" }],
          charts: [
            { type: "line", title: "Reach by platform (weekly)", wide: true, labels: d.labels, series: d.reach },
            { type: "bar", title: "Engagement rate % by platform", labels: d.platforms.map(function (p) { return p.short; }), values: d.engagement },
            { type: "bar", title: "Top posts by reach", horizontal: true, labels: ["Diwali teaser", "Founder story", "Gift hamper", "Weavers", "Giveaway"], values: [48200, 39400, 31800, 27600, 22100] }
          ] };
      } },
      { id: "comments", label: "Comments", icon: "chat", group: "Grow", view: function (ctx) {
        var scripts = {};
        ctx.data.commentThreads.forEach(function (t) { scripts[t.id] = [{ from: "ai", text: "Suggested reply: " + t.reply, delay: 500 }]; });
        return { type: "chat", threads: ctx.data.commentThreads, scripts: scripts };
      } },
      { id: "assistant", label: "AI assistant", icon: "star", group: "Grow", view: function () {
        return { type: "chat",
          threads: [{ id: "a1", name: "SocialPush AI", channel: "web", preview: "Ask me to draft, repurpose or schedule", messages: [{ from: "ai", text: "Hi! I can draft captions, repurpose a post for each platform, or suggest the best time to publish. What do you need?" }] }],
          scripts: { a1: [
            { from: "ai", text: "Here is a draft: \"New drop alert! Our autumn palette is live. Tap the link in bio to shop before it sells out. #LumenLane\"", chips: ["Make it shorter", "Repurpose for LinkedIn", "Best time to post"], delay: 500 },
            { from: "ai", text: "For LinkedIn I would lead with the story: \"Why we chose handloom for our autumn range\", then end with a question. Your audience engages most Tuesday 9 AM.", delay: 500 },
            { from: "ai", text: "Based on the last 30 days, 7 to 9 PM IST gets 38 percent more engagement on Instagram and Threads.", delay: 500 }] } };
      } },
      { id: "team", label: "Team", icon: "settings", group: "Workspace", view: function (ctx) {
        return { type: "table", pageSize: 10, rows: ctx.data.team, qKeys: ["name", "role", "email"],
          filters: [{ key: "role", label: "role", options: ["Owner", "Editor", "Approver", "Analyst", "Client (view only)"] }],
          columns: [{ key: "name", label: "Name", sortable: true }, { key: "role", label: "Role" }, { key: "email", label: "Email" }, { key: "posts", label: "Posts", sortable: true }, { key: "last", label: "Last active" }, { key: "status", label: "Status" }],
          drawer: function (r) {
            return el("div", { style: { lineHeight: 1.7 } }, el("p", {}, r.role + " · " + r.status), el("p", {}, r.email), el("p", {}, r.posts + " posts created · last active " + r.last),
              el("p", { style: { color: "var(--ink-3)", fontSize: "13px" } }, r.role === "Approver" ? "Posts from Editors wait for this person's approval before they are queued." : "Can compose and schedule posts on connected accounts."));
          } };
      } }
    ]
  };
})(window);
