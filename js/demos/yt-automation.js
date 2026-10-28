(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.demos = AX.demos || {};
  var el = AX.el;
  var VIDEO_SRC = "assets/media/yt/sample.mp4";

  var CSS = [
    ".yt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:16px}",
    ".yt-scene,.yt-vid{background:#fff;border:1px solid var(--ax-line);border-radius:12px;overflow:hidden;display:flex;flex-direction:column;min-width:0}",
    ".yt-scene img{width:100%;aspect-ratio:2/3;object-fit:cover;display:block;background:#222}",
    ".yt-body{padding:12px 14px;display:flex;flex-direction:column;gap:6px;font-size:12.5px;line-height:1.45}",
    ".yt-body h3{margin:0;font:600 14px var(--font-display)}",
    ".yt-tag{font:600 10px var(--font-mono);color:var(--ax-accent);text-transform:uppercase;letter-spacing:.06em}",
    ".yt-k{font:600 10px var(--font-mono);color:var(--ink-3);text-transform:uppercase;margin-top:4px}",
    ".yt-body p{margin:0;color:var(--ink-2)}",
    ".yt-btn{appearance:none;font:600 13px var(--font-body);padding:8px 14px;border-radius:999px;border:1px solid var(--ax-accent);background:var(--ax-accent);color:#fff;cursor:pointer}",
    ".yt-btn.ghost{background:#fff;color:var(--ax-accent)}",
    ".yt-poster{position:relative;aspect-ratio:9/16;background:#111;overflow:hidden}",
    ".yt-poster img,.yt-poster video{width:100%;height:100%;object-fit:cover;display:block}",
    ".yt-play{position:absolute;inset:0;margin:auto;width:56px;height:56px;border-radius:50%;border:0;background:rgba(255,255,255,.92);color:var(--ax-accent);font-size:22px;cursor:pointer;box-shadow:0 4px 18px rgba(0,0,0,.35)}",
    ".yt-badge{position:absolute;top:8px;left:8px;background:rgba(0,0,0,.65);color:#fff;font:600 10px var(--font-mono);padding:3px 8px;border-radius:999px}",
    ".yt-st{display:inline-block;font:600 11px var(--font-body);padding:2px 10px;border-radius:999px;background:#E6EEF9;color:#26467A}",
    ".yt-st.Published{background:#DDF5E7;color:#116B3A}.yt-st.Scheduled{background:#FDE4EA;color:#B0123A}.yt-st.Rendering{background:#FEF3D7;color:#8A5A00}.yt-st.Operational{background:#DDF5E7;color:#116B3A}.yt-st.Degraded{background:#FEF3D7;color:#8A5A00}.yt-st.ERROR{background:#FEE9E7;color:#B42318}.yt-st.WARN{background:#FEF3D7;color:#8A5A00}",
    ".yt-draw img{width:100%;max-height:320px;object-fit:cover;border-radius:10px;margin-bottom:12px}.yt-draw p{margin:0 0 10px;line-height:1.5;font-size:14px}.yt-draw h4{margin:0 0 4px;font:600 11px var(--font-mono);text-transform:uppercase;color:var(--ink-3)}",
    ".yt-note{font-size:13px;color:var(--ink-3);margin:0 0 12px}",
    ".yt-res{background:#fff;border:1px solid var(--ax-line);border-radius:12px;padding:14px;font-size:14px}"
  ].join("\n");
  function injectCss() {
    if (document.getElementById("yt-css")) return;
    var s = document.createElement("style"); s.id = "yt-css"; s.textContent = CSS; document.head.appendChild(s);
  }
  function st(s) { return el("span", { class: "yt-st " + s }, s); }
  function money(n) { return "$" + n.toFixed(2); }
  function kv(k, v) { return [el("h4", {}, k), el("p", {}, v)]; }

  var STAGES = [
    { id: "research", label: "Research · $0.02", ms: 700, cost: 0.02, log: ["Scanning public-domain angles", "Picked Govardhan (hook score 0.91)"] },
    { id: "script", label: "Script · $0.05", ms: 800, cost: 0.05, log: ["Drafting 6-beat script", "Moral line added"] },
    { id: "voice", label: "Voice · $0.18", ms: 900, cost: 0.18, log: ["Synthesizing narration (cloned voice)", "Aligned word timings"] },
    { id: "keyframes", label: "Keyframes · $0.42", ms: 900, cost: 0.42, log: ["Rendering 6 keyframes", "Character look locked to reference"] },
    { id: "motion", label: "Motion clips · $2.40", ms: 1500, cost: 2.4, log: ["Kling v3: 6 image-to-video clips", "Clip 4 retried once"] },
    { id: "assembly", label: "Assembly & captions · $0.10", ms: 900, cost: 0.1, log: ["Muxing clips + narration", "Burning captions"] },
    { id: "thumb", label: "Thumbnail & SEO · $0.06", ms: 700, cost: 0.06, log: ["Thumbnail A/B drafted", "Title, description, tags ready"] },
    { id: "qa", label: "Human QA", ms: 600, log: ["Reviewer approved"] },
    { id: "scheduled", label: "Scheduled", ms: 600, log: ["Upload queued for 3 Nov, 6:30 PM IST"] }
  ];

  function scenesView(host, ctx) {
    injectCss();
    host.appendChild(el("p", { class: "yt-note" }, "Six keyframes for “Govardhan” — each keyframe is generated first, then animated into a motion clip. Real renders from the pipeline."));
    host.appendChild(el("div", { class: "yt-grid" }, ctx.data.scenes.map(function (s) {
      return el("article", { class: "yt-scene", "data-scene": s.id },
        el("img", { src: s.img, alt: "Keyframe " + s.n + ": " + s.title, loading: "lazy" }),
        el("div", { class: "yt-body" }, el("span", { class: "yt-tag" }, "Scene " + s.n), el("h3", {}, s.title),
          el("div", { class: "yt-k" }, "Keyframe prompt"), el("p", {}, s.prompt),
          el("div", { class: "yt-k" }, "Motion"), el("p", {}, s.motion),
          el("div", { class: "yt-k" }, "Caption"), el("p", {}, s.caption),
          el("button", { type: "button", class: "yt-btn ghost", on: { click: function () { AX.ui.toast("Simulated — keyframe not regenerated ($0.07 saved)", { kind: "sim" }); } } }, "Regenerate · $0.07")));
    })));
  }

  function libraryView(host, ctx) {
    injectCss();
    host.appendChild(el("p", { class: "yt-note" }, "Finished videos. The first card plays a real render (muted)."));
    var grid = el("div", { class: "yt-grid" });
    ctx.data.videos.forEach(function (v) {
      var poster = el("div", { class: "yt-poster" }, el("img", { src: v.poster, alt: "" }), el("span", { class: "yt-badge" }, "9:16 · 36s"));
      if (v.playable) {
        poster.appendChild(el("button", { type: "button", class: "yt-play", "aria-label": "Play " + v.title, on: { click: function () {
          poster.textContent = "";
          var vid = el("video", { class: "yt-player", src: VIDEO_SRC, controls: "", muted: "", loop: "", playsinline: "", autoplay: "", poster: v.poster, preload: "auto" });
          vid.muted = true;
          poster.appendChild(vid);
          var p = vid.play(); if (p && p.catch) p.catch(function () {});
        } } }, "▶"));
      }
      grid.appendChild(el("article", { class: "yt-vid" + (v.playable ? " can-play" : ""), "data-id": v.id }, poster,
        el("div", { class: "yt-body" }, el("h3", {}, v.title), el("div", {}, st(v.status)), el("p", {}, v.channel + " · $" + v.cost + " to make"),
          v.playable ? null : el("button", { type: "button", class: "yt-btn ghost", on: { click: function () { AX.ui.toast("Simulated — preview not available in this demo", { kind: "sim" }); } } }, "Preview"))));
    });
    host.appendChild(grid);
  }

  function installApprove(ctx) {
    if (ctx.__ytApprove) return;
    ctx.__ytApprove = true;
    var h = function (e) {
      var b = e.target && e.target.closest && e.target.closest(".pl-approve");
      if (!b) return;
      if (!document.querySelector('.ax-app[data-slug="yt-automation"]')) { document.removeEventListener("click", h, true); ctx.__ytApprove = false; return; }
      ctx.state.set({ approved: true });
      AX.ui.toast("Simulated — approved; upload would be scheduled for 3 Nov, 6:30 PM", { kind: "sim" });
    };
    document.addEventListener("click", h, true);
  }

  AX.demos["yt-automation"] = {
    brand: { name: "YT-Automation", accent: "#E11D48", logoText: "Y" },
    start: "generate",
    modules: [
      { id: "generate", label: "Generate", icon: "star", group: "Create", view: function (ctx) {
        injectCss();
        var d = ctx.data;
        return { type: "form", submit: "Generate video",
          fields: [
            { key: "channel", label: "Channel", type: "select", options: d.channels },
            { key: "prompt", label: "Story prompt", type: "textarea" },
            { key: "language", label: "Language", type: "select", options: ["Hindi", "English", "Hinglish"] },
            { key: "voice", label: "Voice", type: "select", options: d.voices },
            { key: "ceiling", label: "Cost ceiling ($)", type: "number" }
          ],
          onSubmit: function (v, c) {
            c.state.set({ job: v, approved: false });
            c.open("pipeline");
            var go = document.querySelector('[data-module="pipeline"] .pl-head .btn-primary');
            if (go) go.click();
            return null;
          } };
      } },
      { id: "pipeline", label: "Pipeline", icon: "pipeline", group: "Create", view: function (ctx) {
        installApprove(ctx);
        return { type: "pipeline", stages: STAGES, gate: "qa", cap: 4, currency: "$" };
      } },
      { id: "scenes", label: "Scenes", icon: "board", group: "Create", view: { type: "custom", render: scenesView } },
      { id: "characters", label: "Characters", icon: "users", group: "Create", view: function (ctx) {
        injectCss();
        return { type: "table", rows: ctx.data.characters, qKeys: ["name", "role", "voice"],
          columns: [{ key: "name", label: "Character", sortable: true }, { key: "role", label: "Role" }, { key: "voice", label: "Voice", sortable: true }, { key: "lang", label: "Language" }, { key: "scenes", label: "Scenes" }],
          drawer: function (r) {
            return el("div", { class: "yt-draw" }, el("img", { src: r.img, alt: r.name }), kv("Look", r.look), kv("Voice", r.voice + " (" + r.lang + ")"), kv("Appears in scenes", r.scenes),
              el("button", { type: "button", class: "yt-btn", on: { click: function () { AX.ui.toast("Simulated — voice sample not played", { kind: "sim" }); } } }, "Play voice sample"));
          } };
      } },
      { id: "approvals", label: "Approvals", icon: "board", group: "Publish", view: function (ctx) {
        var cards = ctx.data.approvals.map(function (c) { return Object.assign({}, c); });
        if (ctx.state.get().approved) cards.unshift({ id: "ap-new", col: "approved", title: "Govardhan (new render)", sub: (ctx.state.get().job || {}).channel || "Katha Kids (Hindi)", tags: ["Scheduled"], meta: "Goes live 3 Nov, 6:30 PM" });
        return { type: "board",
          columns: [{ id: "review", label: "Needs review" }, { id: "changes", label: "Changes requested", tone: "bad" }, { id: "approved", label: "Approved", tone: "good" }],
          cards: cards,
          onMove: function (card, col) { AX.ui.toast("Simulated — " + card.title + " moved to " + col + " (nothing saved)", { kind: "sim" }); } };
      } },
      { id: "calendar", label: "Calendar", icon: "calendar", group: "Publish", view: function (ctx) {
        var ev = [
          { id: "e1", title: "Govardhan · Shorts", date: "2026-11-03", tone: "good" }, { id: "e2", title: "Ganesha and the mango", date: "2026-11-06", tone: "orange" },
          { id: "e3", title: "Birbal's riddle", date: "2026-11-09", tone: "orange" }, { id: "e4", title: "Hanuman part 2", date: "2026-11-12", tone: "teal" },
          { id: "e5", title: "Diwali special", date: "2026-11-14", tone: "teal" }, { id: "e6", title: "Tenali Rama #2", date: "2026-11-18", tone: "teal" }
        ];
        if (ctx.state.get().approved) ev.push({ id: "e-new", title: "New: " + String((ctx.state.get().job || {}).prompt || "Govardhan story").slice(0, 20), date: "2026-11-04", tone: "good" });
        return { type: "calendar", month: "2026-11", events: ev,
          onDrop: function (id, date) { AX.ui.toast("Simulated — publish date moved to " + date + " (nothing saved)", { kind: "sim" }); } };
      } },
      { id: "library", label: "Library", icon: "file", group: "Publish", view: { type: "custom", render: libraryView } },
      { id: "analytics", label: "Analytics", icon: "chart", group: "Grow", view: function (ctx) {
        var d = ctx.data, pub = d.videos.filter(function (v) { return v.views > 0; });
        return { type: "dashboard",
          kpis: [{ label: "Views (30d)", value: pub.reduce(function (a, v) { return a + v.views; }, 0), delta: 18, format: "num" }, { label: "Avg retention", value: "57%", delta: 3 }, { label: "Avg CTR", value: "7.8%", delta: 5 }, { label: "Subscribers", value: 24800, delta: 9, format: "num" }],
          charts: [
            { type: "bar", title: "Views per video", horizontal: true, wide: true, labels: pub.map(function (v) { return v.title.slice(0, 14); }), values: pub.map(function (v) { return v.views; }) },
            { type: "line", title: "Audience retention (% by 5 s)", labels: ["0s", "5s", "10s", "15s", "20s", "25s", "30s", "36s"], series: [{ name: "Retention", points: d.retentionCurve }] },
            { type: "bar", title: "CTR % per video", labels: pub.map(function (v, i) { return "V" + (i + 1); }), values: pub.map(function (v) { return v.ctr; }) }
          ] };
      } },
      { id: "brand", label: "Brand kit", icon: "settings", group: "Setup", view: function (ctx) {
        return { type: "form", submit: "Save brand kit",
          fields: [{ key: "name", label: "Channel name", type: "text" }, { key: "tone", label: "Narration tone", type: "select", options: ["Warm storyteller", "Playful", "Epic and serious"] },
            { key: "palette", label: "Colour palette", type: "text" }, { key: "intro", label: "Outro line", type: "textarea" }, { key: "captions", label: "Burn captions", type: "toggle" }],
          onSubmit: function (v) { return el("div", { class: "yt-res" }, "Brand kit for “" + (v.name || "your channel") + "” saved in this demo only — tone: " + v.tone + (v.captions ? ", captions on." : ", captions off.")); } };
      } },
      { id: "prompts", label: "Prompt library", icon: "file", group: "Setup", view: function (ctx) {
        return { type: "table", rows: ctx.data.prompts, qKeys: ["name", "key", "text"],
          columns: [{ key: "name", label: "Stage", sortable: true }, { key: "key", label: "Template" }, { key: "version", label: "Version" }, { key: "tokens", label: "Avg tokens", sortable: true }, { key: "cost", label: "Cost / run", sortable: true, render: function (r) { return money(r.cost); } }],
          drawer: function (r) { return el("div", { class: "yt-draw" }, kv("Template", r.key), kv("Prompt", r.text), kv("Updated", r.updated + " · avg " + r.tokens + " tokens · " + money(r.cost) + " per run")); } };
      } },
      { id: "api", label: "API & spend", icon: "wallet", group: "Operate", view: function (ctx) {
        var total = ctx.data.api.reduce(function (a, r) { return a + r.spend; }, 0);
        return { type: "table", rows: ctx.data.api, qKeys: ["provider", "use"],
          filters: [{ key: "status", label: "status", options: ["Operational", "Degraded"] }],
          columns: [{ key: "provider", label: "Provider", sortable: true }, { key: "use", label: "Used for" }, { key: "calls", label: "Calls / video", sortable: true }, { key: "spend", label: "Spend / video (total " + money(total) + ")", sortable: true, render: function (r) { return r.spendText; } }, { key: "status", label: "Status", render: function (r) { return st(r.status); } }],
          drawer: function (r) { return el("div", { class: "yt-draw" }, kv("Provider", r.provider), kv("Used for", r.use), kv("Per-video spend", r.spendText + " across " + r.calls + " calls"), kv("Hard ceiling", "Pipeline stops and asks for approval if a video would exceed $4.00")); } };
      } },
      { id: "logs", label: "Logs", icon: "file", group: "Operate", view: function (ctx) {
        return { type: "table", pageSize: 10, rows: ctx.data.logs, qKeys: ["message", "stage", "job"],
          filters: [{ key: "level", label: "level", options: ["INFO", "WARN", "ERROR"] }, { key: "stage", label: "stage", options: ["research", "script", "voice", "keyframes", "motion", "assembly", "qa", "publish", "cost"] }],
          columns: [{ key: "at", label: "Time", sortable: true }, { key: "level", label: "Level", render: function (r) { return st(r.level); } }, { key: "stage", label: "Stage" }, { key: "job", label: "Job" }, { key: "message", label: "Message" }],
          drawer: function (r) { return el("div", { class: "yt-draw" }, kv("Time", r.at), kv("Job / stage", r.job + " · " + r.stage), kv("Message", r.message)); } };
      } },
      { id: "health", label: "System health", icon: "heart", group: "Operate", view: function (ctx) {
        return { type: "dashboard",
          kpis: [{ label: "Queue depth", value: 2, format: "num" }, { label: "Success rate (7d)", value: "94%", delta: 2 }, { label: "Avg time to QA", value: "8m 40s", delta: -6 }, { label: "Avg cost / video", value: "$3.14", delta: -3 }],
          charts: [
            { type: "line", title: "Cost per video ($, last 12)", wide: true, labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], series: [{ name: "Cost $", points: ctx.data.costSeries }] },
            { type: "gauge", title: "Render success", value: 94, label: "Success" },
            { type: "bar", title: "Failures by stage (7d)", labels: ["Research", "Voice", "Keyframes", "Motion", "Upload"], values: [0, 1, 1, 4, 1] }
          ] };
      } }
    ]
  };
})(window);
