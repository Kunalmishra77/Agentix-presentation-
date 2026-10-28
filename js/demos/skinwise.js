/* Skinwise demo: skin-concern D2C (rules-based quiz with safety cautions, photo scan scorecard, "Dr. Vivek" assistant, store, consultation, admin).
   The voice agent was removed from the real product, so there is deliberately no voice module here. Fictional data only. */
(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.demos = AX.demos || {};
  var SLUG = "skinwise", ACCENT = "#C2410C";

  /* ---------- catalogue (12 products) and pure rules ---------- */
  var PRODUCTS = [
    { id: "sw-01", name: "Anti-Acne Cleanser", step: "cleanse", cat: "Cleanse", concerns: ["acne"], skins: ["oily", "combination"], tags: ["salicylic", "strong"], price: 449, mrp: 549, why: "Salicylic acid clears pores and controls breakouts" },
    { id: "sw-02", name: "Gentle Hydrating Cleanser", step: "cleanse", cat: "Cleanse", concerns: ["acne", "pigmentation", "dark-circles", "dryness", "ageing", "dullness"], skins: ["dry", "normal", "combination", "oily"], tags: ["gentle", "fragrance-free"], price: 349, mrp: 429, why: "Removes dirt without stripping the skin barrier" },
    { id: "sw-03", name: "Depigmentation Cleanser", step: "cleanse", cat: "Cleanse", concerns: ["pigmentation", "dullness"], skins: ["normal", "dry", "combination", "oily"], tags: ["brightening", "gentle"], price: 499, mrp: 599, why: "Mild brightening cleanse that preps skin for treatment" },
    { id: "sw-04", name: "Acne Gel", step: "treat", cat: "Treat", concerns: ["acne"], skins: ["oily", "combination", "normal"], tags: ["niacinamide", "oil-control"], price: 599, mrp: 749, why: "Niacinamide calms redness and reduces oil and new spots" },
    { id: "sw-05", name: "Azelaic Acid 10% Gel", step: "treat", cat: "Treat", concerns: ["acne", "pigmentation"], skins: ["oily", "combination", "normal", "dry"], tags: ["azelaic", "pregnancy-ok"], price: 699, mrp: 849, why: "Azelaic acid fades marks and settles breakouts and is commonly used in pregnancy" },
    { id: "sw-06", name: "Night Retinol Serum", step: "treat", cat: "Treat", concerns: ["ageing", "pigmentation", "acne"], skins: ["normal", "combination", "oily"], tags: ["retinoid", "strong", "night"], price: 899, mrp: 1099, why: "Retinol speeds cell turnover to smooth texture and fade marks" },
    { id: "sw-07", name: "Skin Lightening Gel", step: "treat", cat: "Treat", concerns: ["pigmentation"], skins: ["oily", "combination", "normal", "dry"], tags: ["vitamin-c", "brightening"], price: 749, mrp: 899, why: "Vitamin C evens tone and fades dark spots" },
    { id: "sw-08", name: "Eye-Lyte Cream", step: "treat", cat: "Treat", concerns: ["dark-circles"], skins: ["oily", "combination", "normal", "dry"], tags: ["caffeine", "peptide"], price: 649, mrp: 799, why: "Caffeine and peptides de-puff and brighten the under-eye area" },
    { id: "sw-09", name: "Hyaluronic Hydrating Serum", step: "treat", cat: "Treat", concerns: ["dryness", "dullness", "ageing"], skins: ["dry", "normal", "combination"], tags: ["hyaluronic", "gentle"], price: 799, mrp: 949, why: "Hyaluronic acid pulls water into the skin for a plumper, brighter look" },
    { id: "sw-10", name: "Barrier Repair Moisturiser", step: "moisturise", cat: "Moisturise", concerns: ["dryness", "ageing", "dullness", "pigmentation", "dark-circles", "acne"], skins: ["dry", "normal", "combination"], tags: ["ceramide", "fragrance-free"], price: 549, mrp: 649, why: "Ceramides rebuild the barrier and lock in moisture" },
    { id: "sw-11", name: "Oil-Free Gel Moisturiser", step: "moisturise", cat: "Moisturise", concerns: ["acne", "dullness", "pigmentation", "dark-circles", "dryness", "ageing"], skins: ["oily", "combination"], tags: ["oil-free"], price: 449, mrp: 549, why: "Light gel hydration that will not clog pores" },
    { id: "sw-12", name: "Daily Sunscreen SPF 50", step: "protect", cat: "Protect", concerns: ["acne", "pigmentation", "dark-circles", "dryness", "ageing", "dullness"], skins: ["oily", "dry", "combination", "normal"], tags: ["spf", "mineral"], price: 599, mrp: 699, why: "Broad-spectrum SPF 50 protects against UV that darkens marks and ages skin" }
  ];
  var STEPS = ["cleanse", "treat", "moisturise", "protect"];
  function has(p, tag) { return p.tags.indexOf(tag) >= 0; }

  /** Pure rules. answers: {concern, skinType, sensitivity:boolean, pregnant:boolean, budget:"low"|"mid"|"high"} -> {routine:[{step, product, why, tags}], cautions:[string]} */
  function recommend(answers) {
    var a = answers || {};
    var concern = a.concern || "acne", skin = a.skinType || "normal", budget = a.budget || "mid";
    var sens = !!a.sensitivity, preg = !!a.pregnant;
    var cautions = [];
    if (preg) {
      cautions.push("Avoid retinoids during pregnancy");
      cautions.push("Avoid salicylic acid peels and strong salicylic products during pregnancy; ask your doctor first");
    }
    if (sens) cautions.push("Patch-test every new product on your inner arm for 24 hours before using it on the face");
    if (concern === "pigmentation") cautions.push("Pigmentation fades only with daily sunscreen; reapply every 3 to 4 hours outdoors");
    if (concern === "dark-circles") cautions.push("Sudden or one-sided dark circles can have medical causes; see a doctor if they change quickly");
    function banned(p) {
      if (preg && (has(p, "retinoid") || has(p, "salicylic"))) return true;
      if (sens && has(p, "strong")) return true;
      return false;
    }
    function score(p) {
      var s = 0;
      if (p.concerns.indexOf(concern) >= 0) s += p.concerns.length === 1 ? 4 : 3;
      if (p.skins.indexOf(skin) >= 0) s += 2;
      if (p.step === "moisturise" && skin === "oily" && has(p, "oil-free")) s += 2;
      if (p.step === "moisturise" && skin === "dry" && has(p, "ceramide")) s += 2;
      return s;
    }
    var routine = [];
    STEPS.forEach(function (step) {
      var pool = PRODUCTS.filter(function (p) {
        if (p.step !== step || banned(p)) return false;
        if (step === "treat") return p.concerns.indexOf(concern) >= 0;
        if (step === "cleanse") return p.concerns.indexOf(concern) >= 0 && (p.skins.indexOf(skin) >= 0 || has(p, "gentle"));
        return true;
      });
      if (!pool.length) return;
      pool = pool.map(function (p, i) { return { p: p, s: score(p), i: i }; });
      pool.sort(function (x, y) {
        if (y.s !== x.s) return y.s - x.s;
        if (budget === "low") return x.p.price - y.p.price || x.i - y.i;
        if (budget === "high") return y.p.price - x.p.price || x.i - y.i;
        return Math.abs(x.p.price - 600) - Math.abs(y.p.price - 600) || x.i - y.i;
      });
      var pick = pool[0].p;
      routine.push({ step: step, product: pick, tags: pick.tags.slice(), why: pick.why + " (" + skin + " skin, " + concern.replace("-", " ") + ")." });
    });
    if (routine.some(function (r) { return has(r.product, "strong"); })) cautions.push("Strong actives can sting at first: start every other night and always use sunscreen the next morning");
    return { routine: routine, cautions: cautions };
  }
  AX.skinwise = { recommend: recommend, products: PRODUCTS, STEPS: STEPS };

  /* ---------- styles ---------- */
  function scope(css) {
    var pre = '.ax-app[data-slug="' + SLUG + '"] ', dpre = '.demo-scope[data-slug="' + SLUG + '"] ';
    return css.replace(/(^|[{}])\s*([^{}@]+?)\s*\{/g, function (m, b, sel) {
      if (sel.indexOf(".ax-app") === 0) return m;
      return b + sel.split(",").map(function (s) { return pre + s.trim() + "," + dpre + s.trim(); }).join(",") + "{";
    });
  }
  var CSS = scope([
    ".sk-card{background:#fff;border:1px solid var(--ax-line);border-radius:14px;padding:18px;min-width:0}.sk-card h3{margin:0 0 10px;font:600 14px var(--font-display)}",
    ".sk-btn{appearance:none;font:600 13px var(--font-body);padding:10px 18px;border-radius:999px;border:1px solid var(--ax-line);background:#fff;color:var(--ink);cursor:pointer}.sk-btn.primary{background:var(--ax-accent);border-color:var(--ax-accent);color:#fff}.sk-btn:disabled{opacity:.45;cursor:default}.sk-btn.sm{padding:5px 12px;font-size:12px}",
    ".sk-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.sk-gap{margin-top:14px}.sk-muted{color:var(--ink-3);font-size:13px}",
    ".sk-pill{display:inline-block;font:600 11px var(--font-body);padding:2px 9px;border-radius:999px;background:rgba(11,31,51,.08);color:#2b3a4b;white-space:nowrap}.sk-pill.good{background:#dff3e6;color:#17663b}.sk-pill.warn{background:#fdf0d2;color:#7a4e00}.sk-pill.bad{background:#fbe0de;color:#9c1f19}.sk-pill.info{background:#dcebfb;color:#164a85}",
    ".sk-kv{display:grid;grid-template-columns:120px 1fr;gap:8px 12px;margin:0 0 14px;font-size:14px}.sk-kv dt{color:var(--ink-3);font:500 12px var(--font-mono)}.sk-kv dd{margin:0;overflow-wrap:anywhere}",
    ".sk-steps{display:flex;gap:6px;margin-bottom:14px}.sk-steps span{flex:1;height:5px;border-radius:3px;background:rgba(11,31,51,.1)}.sk-steps span.on{background:var(--ax-accent)}",
    ".sk-opt{appearance:none;width:100%;text-align:left;padding:12px 14px;margin-top:8px;border:1.5px solid var(--ax-line);border-radius:12px;background:#fff;cursor:pointer;font:500 14px var(--font-body);color:var(--ink)}.sk-opt:hover,.sk-opt:focus-visible{border-color:var(--ax-accent);background:#FFF4EC}",
    ".sk-q{font:600 18px var(--font-display);margin:0 0 4px}",
    ".sk-caution{display:flex;gap:10px;align-items:flex-start;background:#FFF1E6;border:1px solid #F5C9A6;border-left:4px solid var(--ax-accent);border-radius:10px;padding:10px 12px;font-size:13px;margin-top:8px}",
    ".sk-caution b{color:#9A3412}",
    ".sk-step{display:grid;grid-template-columns:90px minmax(0,1fr) auto;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid var(--ax-line)}.sk-step .st{font:600 11px var(--font-mono);text-transform:uppercase;color:var(--ink-3)}.sk-step b{display:block;font-size:14px}.sk-step small{color:var(--ink-3);font-size:12px}",
    "@media(max-width:560px){.sk-step{grid-template-columns:minmax(0,1fr) auto}.sk-step .st{grid-column:1 / -1}}",
    ".sk-photo{aspect-ratio:3/4;border-radius:16px;background:linear-gradient(160deg,#f2d3bd,#d9a889);display:grid;place-items:center;color:#7a4a2e;font:600 13px var(--font-body);text-align:center;padding:12px;position:relative;overflow:hidden}.sk-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}",
    ".sk-scanline{position:absolute;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,#fff,transparent);box-shadow:0 0 14px #fff;top:0}",
    "@media (prefers-reduced-motion:no-preference){.sk-photo.scanning .sk-scanline{animation:skscan 1.2s ease-in-out infinite alternate}@keyframes skscan{from{top:6%}to{top:94%}}}",
    ".sk-grid2{display:grid;grid-template-columns:minmax(0,300px) minmax(0,1fr);gap:20px}@media(max-width:760px){.sk-grid2{grid-template-columns:minmax(0,1fr)}}",
    ".sk-score{margin:12px 0}.sk-score .l{display:flex;justify-content:space-between;font:600 13px var(--font-body);margin-bottom:4px}.sk-score .m{height:10px;border-radius:99px;background:rgba(11,31,51,.1);overflow:hidden}.sk-score .m i{display:block;height:100%;border-radius:99px;background:var(--ax-accent)}",
    ".sk-badge{display:inline-block;font:700 11px var(--font-mono);letter-spacing:.06em;text-transform:uppercase;color:#9A3412;background:#FFE7D5;border-radius:6px;padding:3px 8px}",
    ".sk-chat-in{display:flex;gap:8px;margin-top:10px}.sk-in{font:400 14px var(--font-body);padding:9px 12px;border:1px solid var(--ax-line);border-radius:999px;background:#fff;color:var(--ink);flex:1;min-width:0}",
    ".sk-sugg{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}",
    ".sk-solo .cht{grid-template-columns:minmax(0,1fr)}.sk-solo .cht-list{display:none}",
    ".ax-app[data-slug=skinwise] .bd{overflow-x:auto}"
  ].join("\n"));
  var ROOTCSS = '.ax-app[data-slug="skinwise"]{--orange:' + ACCENT + ';--ax-accent:' + ACCENT + '}.demo-scope[data-slug="skinwise"]{--orange:' + ACCENT + ';--ax-accent:' + ACCENT + ';--ax-line:rgba(11,31,51,.12)}';
  try {
    if (typeof document !== "undefined" && document.head && !(document.getElementById && document.getElementById("skinwise-css"))) {
      var st = document.createElement("style"); st.id = "skinwise-css"; st.textContent = ROOTCSS + "\n" + CSS; document.head.appendChild(st);
    }
  } catch (e) { /* non-DOM loader */ }

  /* ---------- DOM helpers (only used inside module renderers) ---------- */
  function h() { return AX.el.apply(null, arguments); }
  function inr(n) { return AX.fmt.inr(Math.round(n)); }
  function sim(text) { AX.ui.toast(text || AX.ui.SIM_DEFAULT, { kind: "sim" }); }
  function btn(label, fn, cls, attrs) { return h("button", Object.assign({ type: "button", class: "sk-btn " + (cls || ""), on: { click: fn } }, attrs || {}), label); }
  function pill(text, tone) { return h("span", { class: "sk-pill " + (tone || "") }, text); }
  function card(title, body) { return h("section", { class: "sk-card" }, title ? h("h3", {}, title) : null, body); }
  function dl(pairs) { var d = h("dl", { class: "sk-kv" }); pairs.forEach(function (p) { d.appendChild(h("dt", {}, p[0])); d.appendChild(h("dd", {}, p[1] == null ? "" : p[1])); }); return d; }
  function drawer(title, body, actions) { return AX.ui.drawer({ title: title, body: h("div", { class: "demo-scope", "data-slug": SLUG }, body), actions: actions }); }
  var TONE = { New: "info", Contacted: "warn", Booked: "info", Converted: "good", Delivered: "good", Shipped: "info", Packed: "info", Paid: "info", Requested: "warn", Confirmed: "info", Completed: "good" };
  function statusPill(s) { return pill(s, TONE[s] || ""); }
  function reduced() { try { return !!(w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch (e) { return false; } }

  /* ---------- state ---------- */
  var seq = 0;
  function K(ctx) {
    if (!ctx.state.get().sw) {
      var d = ctx.data;
      ctx.state.set({ sw: { leads: d.leads.map(function (x) { return Object.assign({}, x); }), orders: d.orders.map(function (x) { return Object.assign({}, x); }), consults: d.consults.map(function (x) { return Object.assign({}, x); }), quiz: null, scan: null, scanLead: false } });
    }
    return ctx.state.get().sw;
  }
  var CONCERN_LABEL = { "acne": "Acne and breakouts", "pigmentation": "Pigmentation and dark spots", "dark-circles": "Dark circles", "dryness": "Dryness", "ageing": "Fine lines and ageing", "dullness": "Dullness" };
  function addLead(ctx, l) { var s = K(ctx); var row = Object.assign({ id: "SL-n" + (++seq), date: ctx.data.today, status: "New", pregnant: "No", skin: "Normal" }, l); s.leads.unshift(row); return row; }

  /* ---------- modules ---------- */
  var modules = [];
  function M(role, id, label, icon, view) { modules.push({ id: id, label: label, icon: icon, group: role === "Admin" ? "Admin" : "Shopper", role: role, view: view }); }

  M("Customer", "site", "Website", "home", {
    type: "custom",
    render: function (host) {
      AX.embed.create(host, { url: "https://myskinwise.com/", title: "Skinwise", external: true,
        allowedOrigins: ["https://agentix-portfolio.vercel.app", "https://ai-agentix.com", "https://*.ai-agentix.com"],
        shots: [{ src: "assets/shots/skinwise/hero.png" }] });
    }
  });

  /* ----- quiz ----- */
  var QUIZ = [
    { key: "concern", q: "What is your main skin concern?", opts: [["acne", "Acne and breakouts"], ["pigmentation", "Pigmentation and dark spots"], ["dark-circles", "Dark circles"], ["dryness", "Dryness"], ["ageing", "Fine lines and ageing"], ["dullness", "Dullness"]] },
    { key: "skinType", q: "How does your skin feel by midday?", opts: [["oily", "Oily and shiny"], ["dry", "Tight or flaky"], ["combination", "Oily T-zone, dry cheeks"], ["normal", "Comfortable"]] },
    { key: "sensitivity", q: "Does your skin sting or redden easily?", opts: [[true, "Yes, it is sensitive"], [false, "No, it tolerates most products"]] },
    { key: "pregnant", q: "Are you pregnant, trying to conceive or breastfeeding?", opts: [[true, "Yes"], [false, "No"]] },
    { key: "budget", q: "What is your budget per product?", opts: [["low", "Keep it affordable"], ["mid", "Around ₹600"], ["high", "Best results, any price"]] }
  ];
  M("Customer", "quiz", "Skin quiz", "form", {
    type: "custom",
    render: function (host, ctx) {
      var s = K(ctx), answers = {}, step = 0;
      var root = h("div", { class: "sk-card" });
      host.appendChild(root);
      function ask() {
        root.textContent = "";
        var qn = QUIZ[step];
        root.appendChild(h("div", { class: "sk-steps" }, QUIZ.map(function (_, i) { return h("span", { class: i <= step ? "on" : "" }); })));
        root.appendChild(h("p", { class: "sk-muted" }, "Question " + (step + 1) + " of 5"));
        root.appendChild(h("p", { class: "sk-q", "data-quiz-q": String(step) }, qn.q));
        qn.opts.forEach(function (o) {
          root.appendChild(h("button", { type: "button", class: "sk-opt", "data-val": String(o[0]), on: { click: function () {
            answers[qn.key] = o[0];
            if (step < QUIZ.length - 1) { step++; ask(); } else finish();
          } } }, o[1]));
        });
        if (step) root.appendChild(h("div", { class: "sk-gap" }, btn("Back", function () { step--; ask(); }, "sm")));
      }
      function finish() {
        var rec = recommend(answers);
        s.quiz = { answers: answers, rec: rec };
        var total = rec.routine.reduce(function (t, r) { return t + r.product.price; }, 0);
        addLead(ctx, { name: ctx.data.leads[0].name.split(" ")[0] + " (quiz visitor)", phone: "+91 98xxx x" + (1000 + (++seq)), email: "visitor@example.in", concern: CONCERN_LABEL[answers.concern], source: "Quiz", skin: answers.skinType, pregnant: answers.pregnant ? "Yes" : "No" });
        root.textContent = "";
        root.appendChild(h("div", { "data-quiz-result": "" },
          h("h3", {}, "Your routine for " + CONCERN_LABEL[answers.concern].toLowerCase()),
          h("div", {}, rec.routine.map(function (r) {
            return h("div", { class: "sk-step", "data-routine-step": r.step },
              h("span", { class: "st" }, r.step), h("span", {}, h("b", {}, r.product.name), h("small", {}, r.why)), h("span", {}, inr(r.product.price)));
          })),
          rec.cautions.length ? h("div", { class: "sk-gap", "data-cautions": "" }, rec.cautions.map(function (c) { return h("div", { class: "sk-caution" }, h("b", {}, "Caution"), h("span", {}, c)); })) : null,
          h("div", { class: "sk-row sk-gap" },
            btn("Order this routine · " + inr(total), function () { orderRoutine(ctx, rec, total); }, "primary", { "data-order-routine": "" }),
            btn("Talk to a doctor", function () { ctx.open("consultation"); }),
            btn("Retake quiz", function () { answers = {}; step = 0; ask(); }))));
      }
      ask();
    }
  });
  function orderRoutine(ctx, rec, total) {
    var s = K(ctx), gross = Math.round(total * 1.18) + (total >= 799 ? 0 : 49);
    s.orders.unshift({ id: "SO-n" + (++seq), customer: "Quiz visitor (demo)", phone: "+91 98xxx x0000", items: rec.routine.map(function (r) { return r.product.name; }).join(", "), count: rec.routine.length, total: gross, date: ctx.data.today, pay: "UPI", status: "Paid", city: "Delhi" });
    sim("Simulated — payment not taken, order " + "SO-n" + seq + " logged for admin");
  }

  /* ----- photo scan ----- */
  var SAMPLES = ["Sample photo A", "Sample photo B", "Sample photo C"];
  M("Customer", "scan", "AI skin scan", "flask", {
    type: "custom",
    render: function (host, ctx) {
      var s = K(ctx), sel = 0, fileUrl = null, tmr = null, alive = true;
      var root = h("div", { class: "sk-grid2" });
      host.appendChild(root);
      AX.mount(host, function () { alive = false; if (tmr) clearTimeout(tmr); if (fileUrl) { try { URL.revokeObjectURL(fileUrl); } catch (e) { /* ignore */ } } });
      function scores(seed) {
        var F = AX.fake, v = { pigmentation: F.int(seed + "p", 38, 82), acne: F.int(seed + "a", 35, 85), texture: F.int(seed + "t", 40, 88), hydration: F.int(seed + "h", 30, 80) };
        v.overall = Math.round((v.pigmentation + v.acne + v.texture + v.hydration) / 4);
        return v;
      }
      function draw(phase) {
        root.textContent = "";
        var photo = h("div", { class: "sk-photo" + (phase === "scanning" ? " scanning" : "") },
          fileUrl ? h("img", { src: fileUrl, alt: "Your photo" }) : null,
          fileUrl ? null : h("span", {}, SAMPLES[sel] + "\nface placeholder"), phase === "scanning" ? h("i", { class: "sk-scanline" }) : null);
        var picker = h("div", { class: "sk-row sk-gap", role: "group", "aria-label": "Sample photo" }, SAMPLES.map(function (n, i) { return btn(n.replace("Sample photo ", ""), function () { sel = i; fileUrl = null; draw("idle"); }, "sm" + (sel === i && !fileUrl ? " primary" : ""), { "data-sample": String(i) }); }));
        var file = h("input", { type: "file", accept: "image/*", "aria-label": "Upload a photo", on: { change: function (e) { var f = e.target.files && e.target.files[0]; if (f) { fileUrl = URL.createObjectURL(f); sel = f.size % 3; draw("idle"); } } } });
        var left = h("div", {}, photo, picker, h("p", { class: "sk-muted" }, "Photos stay in your browser in this demo."), file);
        var right;
        if (phase === "scanning") right = card("Analysing...", h("p", { class: "sk-muted", "data-scanning": "" }, "Checking pigmentation, acne, texture and hydration."));
        else if (phase === "done") {
          var sc = scores(fileUrl ? "up" + sel : "smp" + sel), worst = ["pigmentation", "acne", "texture", "hydration"].sort(function (a, b) { return sc[a] - sc[b]; })[0];
          var concernKey = worst === "acne" ? "acne" : worst === "pigmentation" ? "pigmentation" : worst === "hydration" ? "dryness" : "dullness";
          if (!s.scanLead) { s.scanLead = true; addLead(ctx, { name: "Scan visitor (demo)", phone: "+91 98xxx x" + (2000 + (++seq)), email: "scan@example.in", concern: CONCERN_LABEL[concernKey], source: "Photo scan" }); }
          s.scan = sc;
          right = card("Skin scorecard", h("div", { "data-scorecard": String(sc.overall) },
            h("span", { class: "sk-badge" }, "Simulated analysis"),
            [["Pigmentation", sc.pigmentation], ["Acne", sc.acne], ["Texture", sc.texture], ["Hydration", sc.hydration]].map(function (r) {
              return h("div", { class: "sk-score", "data-metric": r[0].toLowerCase() }, h("div", { class: "l" }, h("span", {}, r[0]), h("span", {}, r[1] + "/100")), h("div", { class: "m" }, h("i", { style: { width: r[1] + "%" } })));
            }),
            h("p", { class: "sk-muted" }, "Overall " + sc.overall + "/100. Focus area: " + worst + ". This is an illustrative score, not a medical diagnosis."),
            h("div", { class: "sk-row" }, btn("Build my routine", function () { ctx.open("quiz"); }, "primary"), btn("Scan again", function () { draw("idle"); }))));
        } else right = card("AI photo scan", h("div", {}, h("p", {}, "Pick a sample photo (or upload one) and run the scan to get a 0 to 100 scorecard for pigmentation, acne, texture and hydration."), btn("Analyse photo", function () {
          draw("scanning");
          tmr = setTimeout(function () { if (alive) draw("done"); }, reduced() ? 30 : 1800);
        }, "primary", { "data-analyse": "" }), h("p", { class: "sk-muted sk-gap" }, "Simulated analysis - results are illustrative.")));
        root.appendChild(left); root.appendChild(right);
      }
      draw("idle");
    }
  });

  /* ----- Dr. Vivek assistant ----- */
  var KB = [
    { k: ["pregnan", "breastfeed"], a: "In pregnancy avoid retinoids (retinol, adapalene) and strong salicylic acid. Gentle cleansing, azelaic acid, hyaluronic acid, ceramide moisturiser and a mineral SPF are usually fine. Please confirm with your gynaecologist or book a consultation." },
    { k: ["acne", "pimple", "breakout"], a: "For acne: a salicylic cleanser at night, a niacinamide gel on spots, an oil-free moisturiser and SPF 50 in the morning. Do not pick spots. If you see painful cysts or scarring, a dermatologist consult helps." },
    { k: ["pigment", "dark spot", "marks", "melasma"], a: "Pigmentation needs patience: vitamin C or azelaic acid, a gentle cleanser and daily SPF 50. Expect 8 to 12 weeks. Sun exposure undoes the progress, so sunscreen is the real treatment." },
    { k: ["dark circle", "under eye", "under-eye"], a: "Dark circles come from genetics, sleep, allergies or thin skin. A caffeine and peptide eye cream helps puffiness; sunscreen helps pigment. If they appeared suddenly, check with a doctor." },
    { k: ["retinol", "retinoid"], a: "Start retinol twice a week at night, pea-sized amount, on dry skin, and always wear sunscreen next morning. Not for pregnancy or very sensitive skin." },
    { k: ["sunscreen", "spf"], a: "Use SPF 50 broad-spectrum every morning, about two finger-lengths for face and neck, and reapply every 3 to 4 hours outdoors." },
    { k: ["dry", "flaky"], a: "For dry skin: a gentle cleanser, hyaluronic serum on damp skin and a ceramide moisturiser to lock it in. Avoid hot water and harsh scrubs." },
    { k: ["price", "cost", "cheap", "budget"], a: "The full four-step routine is usually between ₹1,800 and ₹2,600. The quiz picks the best product per step for your budget." },
    { k: ["consult", "doctor", "appointment"], a: "You can book a video or phone consultation from the Consultation page. Share your concern and any medicines you take and the doctor will personalise your plan." }
  ];
  var SUGGEST = ["Is retinol safe in pregnancy?", "How do I treat acne?", "How to fade dark spots?", "Which sunscreen should I use?", "How much does a routine cost?"];
  function answerFor(text) {
    var t = text.toLowerCase();
    for (var i = 0; i < KB.length; i++) for (var j = 0; j < KB[i].k.length; j++) if (t.indexOf(KB[i].k[j]) >= 0) return KB[i].a;
    return "I can help with acne, pigmentation, dark circles, dryness and routines. Tell me your skin type and concern, or take the 5-question quiz for a personalised routine with safety cautions.";
  }
  M("Customer", "assistant", "Dr. Vivek assistant", "chat", {
    type: "custom",
    render: function (host) {
      var chatHost = h("div", { class: "sk-solo" }), api;
      api = AX.chat.create(chatHost, { composer: false, threads: [{ id: "vivek", name: "Dr. Vivek", channel: "web", preview: "Ask about your skin",
        messages: [{ from: "ai", text: "Hi, I am Dr. Vivek, Skinwise's skin assistant. Ask me about acne, pigmentation, dark circles, dryness or products. I give general guidance, not a diagnosis." }] }] });
      var input = h("input", { class: "sk-in", type: "text", placeholder: "Ask Dr. Vivek...", "aria-label": "Message Dr. Vivek", "data-assistant-input": "" });
      function ask(text) {
        text = String(text || "").trim();
        if (!text) return;
        api.push("vivek", { from: "user", text: text });
        setTimeout(function () { api.push("vivek", { from: "ai", text: answerFor(text) }); }, reduced() ? 0 : 700);
        input.value = "";
      }
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); ask(input.value); } });
      host.appendChild(chatHost);
      host.appendChild(h("div", { class: "sk-chat-in" }, input, btn("Send", function () { ask(input.value); }, "primary", { "data-assistant-send": "" })));
      host.appendChild(h("div", { class: "sk-sugg" }, SUGGEST.map(function (q) { return btn(q, function () { ask(q); }, "sm"); })));
    }
  });

  /* ----- store ----- */
  M("Customer", "products", "Products", "store", {
    type: "store", products: PRODUCTS.map(function (p) { return { id: p.id, name: p.name, price: p.price, mrp: p.mrp, cat: p.cat, tags: p.tags.filter(function (t) { return ["salicylic", "retinoid", "spf", "fragrance-free", "gentle", "pregnancy-ok"].indexOf(t) >= 0; }) }; }),
    categories: ["Cleanse", "Treat", "Moisturise", "Protect"], gstRate: 0.18, shipping: 49, freeOver: 799, coupons: [{ code: "SKIN10", pct: 10 }]
  });

  /* ----- consultation form ----- */
  M("Customer", "consultation", "Consultation", "form", function (ctx) {
    return { type: "form", submit: "Request consultation",
      fields: [{ key: "name", label: "Full name", type: "text" }, { key: "phone", label: "Mobile number", type: "text" },
        { key: "concern", label: "Main concern", type: "select", options: ["Acne and breakouts", "Pigmentation and dark spots", "Dark circles", "Dryness", "Fine lines and ageing", "Dullness"] },
        { key: "mode", label: "Mode", type: "select", options: ["Video call", "Phone call"] }, { key: "date", label: "Preferred date", type: "date" },
        { key: "pregnant", label: "I am pregnant or breastfeeding", type: "toggle" }, { key: "note", label: "Anything the doctor should know", type: "textarea" }],
      onSubmit: function (v, c) {
        var s = K(c), id = "SC-n" + (++seq);
        var name = (v.name || "").trim() || "Demo customer";
        s.consults.unshift({ id: id, name: name, phone: v.phone || "+91 98xxx x0000", concern: v.concern, mode: v.mode, date: v.date || c.data.today, slot: "11:30", pregnant: v.pregnant ? "Yes" : "No", status: "Requested", note: v.note || "" });
        addLead(c, { name: name, phone: v.phone || "+91 98xxx x0000", email: "consult@example.in", concern: v.concern, source: "Consultation form", pregnant: v.pregnant ? "Yes" : "No" });
        return h("div", { class: "sk-card", "data-consult-confirmed": id, style: { marginTop: "12px" } },
          h("b", {}, "Request received, " + name.split(" ")[0] + "."), h("p", { class: "sk-muted" }, "Reference " + id + " · " + v.mode + " on " + (v.date || c.data.today) + ". A Skinwise doctor will confirm by WhatsApp."),
          v.pregnant ? h("div", { class: "sk-caution" }, h("b", {}, "Noted"), h("span", {}, "Your doctor will avoid retinoids and strong acids in your plan.")) : null);
      } };
  });

  /* ----- admin ----- */
  M("Admin", "admin-leads", "Leads", "users", {
    type: "custom",
    render: function (host, ctx) {
      var s = K(ctx), tbl;
      function rows() { return s.leads.map(function (r) { return Object.assign({}, r); }); }
      tbl = AX.table.create(host, { columns: [{ key: "id", label: "Lead", sortable: true }, { key: "name", label: "Name", sortable: true }, { key: "concern", label: "Concern" }, { key: "source", label: "Source" }, { key: "pregnant", label: "Pregnant" }, { key: "date", label: "Date", sortable: true }, { key: "status", label: "Status", render: function (r) { return statusPill(r.status); } }],
        rows: rows(), qKeys: ["name", "id", "concern"], filters: [{ key: "source", label: "source", options: ["Quiz", "Photo scan", "Dr. Vivek chat", "Consultation form", "Instagram"] }, { key: "status", label: "status", options: ["New", "Contacted", "Booked", "Converted"] }], pageSize: 10,
        actions: [{ label: "Mark contacted", onClick: function (r) { var l = s.leads.filter(function (x) { return x.id === r.id; })[0]; if (l && l.status === "New") l.status = "Contacted"; tbl.setRows(rows()); sim("Simulated — WhatsApp follow-up not sent"); } }],
        onRow: function (r) { drawer(r.name, dl([["Lead", r.id], ["Phone", r.phone], ["Email", r.email], ["Concern", r.concern], ["Skin type", r.skin], ["Pregnant", r.pregnant], ["Source", r.source], ["Status", r.status]])); } });
    }
  });
  M("Admin", "admin-orders", "Orders", "cart", {
    type: "custom",
    render: function (host, ctx) {
      var s = K(ctx), tbl;
      function rows() { return s.orders.map(function (r) { return Object.assign({ name: r.id }, r); }); }
      tbl = AX.table.create(host, { columns: [{ key: "id", label: "Order", sortable: true }, { key: "customer", label: "Customer", sortable: true }, { key: "items", label: "Items", render: function (r) { return r.count + " item" + (r.count > 1 ? "s" : ""); } }, { key: "total", label: "Total", sortable: true, render: function (r) { return inr(r.total); } }, { key: "pay", label: "Pay" }, { key: "date", label: "Date", sortable: true }, { key: "status", label: "Status", render: function (r) { return statusPill(r.status); } }],
        rows: rows(), qKeys: ["id", "customer", "items"], filters: [{ key: "status", label: "status", options: ["Paid", "Packed", "Shipped", "Delivered"] }, { key: "pay", label: "pay", options: ["UPI", "Card", "COD"] }], pageSize: 10,
        actions: [{ label: "Advance", onClick: function (r) { var flow = ["Paid", "Packed", "Shipped", "Delivered"], o = s.orders.filter(function (x) { return x.id === r.id; })[0], i = flow.indexOf(o.status); if (i >= 0 && i < 3) { o.status = flow[i + 1]; tbl.setRows(rows()); sim("Simulated — customer notified on WhatsApp"); } } }],
        onRow: function (r) { drawer(r.id, dl([["Customer", r.customer + " · " + r.city], ["Items", r.items], ["Total", inr(r.total) + " incl. GST"], ["Payment", r.pay], ["Date", r.date], ["Status", r.status]])); } });
    }
  });
  M("Admin", "admin-consults", "Consultations", "phone", {
    type: "custom",
    render: function (host, ctx) {
      var s = K(ctx), tbl;
      function rows() { return s.consults.map(function (r) { return Object.assign({ name: r.name }, r); }); }
      tbl = AX.table.create(host, { columns: [{ key: "id", label: "ID", sortable: true }, { key: "name", label: "Customer", sortable: true }, { key: "concern", label: "Concern" }, { key: "mode", label: "Mode" }, { key: "date", label: "Date", sortable: true }, { key: "pregnant", label: "Pregnant" }, { key: "status", label: "Status", render: function (r) { return statusPill(r.status); } }],
        rows: rows(), qKeys: ["name", "id", "concern"], filters: [{ key: "status", label: "status", options: ["Requested", "Confirmed", "Completed"] }, { key: "mode", label: "mode", options: ["Video call", "Phone call"] }], pageSize: 10,
        actions: [{ label: "Confirm", onClick: function (r) { var c = s.consults.filter(function (x) { return x.id === r.id; })[0]; if (c && c.status === "Requested") c.status = "Confirmed"; tbl.setRows(rows()); sim("Simulated — confirmation WhatsApp not sent"); } }],
        onRow: function (r) { drawer(r.name, dl([["Consult", r.id], ["Phone", r.phone], ["Concern", r.concern], ["Mode", r.mode], ["When", r.date + " " + r.slot], ["Pregnant / breastfeeding", r.pregnant + (r.pregnant === "Yes" ? " - avoid retinoids and strong acids" : "")], ["Note", r.note], ["Status", r.status]])); } });
    }
  });

  AX.demos[SLUG] = { brand: { name: "Skinwise", accent: ACCENT, logoText: "S" }, start: "quiz", modules: modules };
})(window);
