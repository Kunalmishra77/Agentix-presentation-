(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.demos = AX.demos || {};
  var SLUG = "umang-hims";

  var CSS = [
    ".um-note{font:500 .75rem var(--font-mono);color:var(--ink-3);background:rgba(181,18,27,.06);border:1px dashed rgba(181,18,27,.3);border-radius:8px;padding:6px 10px}",
    ".um-card{background:#fff;border:1px solid var(--ax-line,rgba(11,31,51,.12));border-radius:12px;padding:16px;min-width:0}",
    ".um-card h3{margin:0 0 10px;font:600 .9rem var(--font-display);color:var(--ink-2)}",
    ".um-tabs{display:inline-flex;border:1px solid var(--ax-line,rgba(11,31,51,.14));border-radius:999px;overflow:hidden;align-self:flex-start}",
    ".um-tabs button{appearance:none;border:0;background:transparent;padding:8px 16px;font:600 .85rem var(--font-body);color:var(--ink-2);cursor:pointer}.um-tabs button[aria-pressed=true]{background:var(--ax-accent);color:#fff}",
    ".um-grid{display:grid;gap:16px;grid-template-columns:minmax(0,1fr) minmax(0,1fr)}@media(max-width:900px){.um-grid{grid-template-columns:minmax(0,1fr)}}",
    ".um-form{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}.um-form .full{grid-column:1/-1}",
    ".um-form label,.um-lbl{display:flex;flex-direction:column;gap:4px;font:500 .72rem var(--font-mono);color:var(--ink-3)}",
    ".um-in,.um-form input,.um-form select,.um-form textarea,.um-lbl select,.um-lbl input{font:400 .88rem var(--font-body);padding:9px 11px;border:1px solid var(--ax-line,rgba(11,31,51,.14));border-radius:8px;background:#FBFAF7;color:var(--ink);min-width:0;width:100%}",
    ".um-btn{appearance:none;font:600 .85rem var(--font-body);padding:10px 18px;border-radius:999px;border:1px solid var(--ax-line,rgba(11,31,51,.14));background:#fff;color:var(--ink);cursor:pointer}.um-btn.primary{background:var(--ax-accent);border-color:var(--ax-accent);color:#fff}.um-btn[disabled]{opacity:.55;cursor:default}",
    ".um-row{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end}",
    ".um-done{border:1px solid #0F7A3D;background:rgba(15,122,61,.07);border-radius:12px;padding:14px;display:grid;gap:8px}.um-done .uh{font:700 1.4rem var(--font-mono);letter-spacing:.04em;color:#0F7A3D}",
    ".um-wave{display:flex;align-items:center;gap:3px;height:54px;padding:0 12px;background:#FBFAF7;border:1px solid var(--ax-line,rgba(11,31,51,.12));border-radius:12px}",
    ".um-wave i{flex:1;max-width:7px;height:var(--h);border-radius:99px;background:rgba(181,18,27,.35);transform-origin:center}",
    ".um-wave.live i{background:var(--ax-accent);animation:umwave .9s ease-in-out infinite;animation-delay:var(--d)}",
    "@keyframes umwave{0%,100%{transform:scaleY(.35)}50%{transform:scaleY(1.15)}}",
    "@media(prefers-reduced-motion:reduce){.um-wave.live i{animation:none}}",
    ".um-table{width:100%;border-collapse:collapse;font-size:.88rem}.um-table td,.um-table th{padding:8px 6px;border-bottom:1px solid var(--ax-line,rgba(11,31,51,.1));text-align:left}.um-table td:last-child,.um-table th:last-child{text-align:right}.um-table tfoot td{font-weight:700;border-bottom:0}",
    ".um-rx{list-style:none;margin:10px 0;padding:0;display:grid;gap:6px}.um-rx li{display:flex;justify-content:space-between;gap:8px;font-size:.86rem;padding:8px 10px;background:#FBFAF7;border:1px solid var(--ax-line,rgba(11,31,51,.1));border-radius:8px}.um-rx button{appearance:none;border:0;background:none;cursor:pointer;color:var(--ink-3);font-size:1.1rem}",
    ".um-phone{max-width:430px;margin:0 auto;width:100%;background:#fff;border:1px solid var(--ax-line,rgba(11,31,51,.2));border-radius:24px;box-shadow:var(--shadow-2);overflow:hidden}",
    ".um-url{font:500 .72rem var(--font-mono);background:#F1EFEA;padding:8px 14px;color:var(--ink-3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    ".um-track{padding:18px;display:grid;gap:14px}.um-status{font:700 1.15rem var(--font-display);line-height:1.3}.um-status.ok{color:#0F7A3D}",
    ".um-steps{list-style:none;margin:0;padding:0 0 0 14px;border-left:2px solid rgba(11,31,51,.12);display:grid;gap:12px}.um-steps li{position:relative;font-size:.9rem;color:var(--ink-3)}.um-steps li::before{content:'';position:absolute;left:-21px;top:4px;width:12px;height:12px;border-radius:50%;background:#fff;border:2px solid rgba(11,31,51,.25)}.um-steps li.done{color:var(--ink)}.um-steps li.done::before{background:#0F7A3D;border-color:#0F7A3D}.um-steps li.now{color:var(--ink);font-weight:700}.um-steps li.now::before{background:var(--ax-accent);border-color:var(--ax-accent);box-shadow:0 0 0 4px rgba(181,18,27,.18)}",
    ".um-chip{display:inline-block;font:600 .75rem var(--font-body);padding:2px 9px;border-radius:999px;background:rgba(11,31,51,.08);color:var(--ink-2)}",
    ".um-bill-items{margin:0 0 12px}"
  ].join("\n");
  function ensureCss() {
    if (typeof document === "undefined" || document.getElementById("um-css")) return;
    var s = document.createElement("style"); s.id = "um-css"; s.textContent = CSS; document.head.appendChild(s);
  }
  function E() { return AX.el.apply(null, arguments); }

  /* ---------- i18n ---------- */
  var NAV = {
    register: ["Registration", "पंजीकरण"], reception: ["Reception queue", "रिसेप्शन कतार"], nurse: ["Nurse vitals", "नर्स: वाइटल्स"], doctor: ["Doctor consult", "डॉक्टर परामर्श"],
    billing: ["Billing", "बिलिंग"], pharmacy: ["Pharmacy", "फ़ार्मेसी"], tracker: ["Visit tracker", "विज़िट ट्रैकर"], reports: ["Reports", "रिपोर्ट"]
  };
  var STAGE = {
    registered: ["Registered", "पंजीकृत"], waiting: ["Waiting", "प्रतीक्षा में"], nurse: ["With nurse", "नर्स के पास"], doctor: ["With doctor", "डॉक्टर के पास"],
    billing: ["Billing", "बिलिंग"], pharmacy: ["Pharmacy", "फ़ार्मेसी"], done: ["Done", "पूर्ण"]
  };
  var PH = { queued: ["Queued", "कतार में"], preparing: ["Preparing", "तैयार हो रहा है"], ready: ["Ready", "तैयार"], collected: ["Collected", "ले लिया"] };
  function T(ctx, pair) { return ctx.t(pair[0], pair[1]); }
  function noteText(ctx) { return ctx.t("Fictional demo data — not medical advice", "काल्पनिक डेमो डेटा — चिकित्सीय सलाह नहीं"); }
  function note(ctx) { return E("div", { class: "um-note" }, noteText(ctx)); }
  function noteSoon(ctx) {
    ensureCss();
    var m = document.querySelector(".ax-module");   /* host captured synchronously at render time */
    setTimeout(function () {
      if (m && m.isConnected && !m.querySelector(":scope > .um-note")) m.insertBefore(note(ctx), m.firstChild);
    }, 0);
  }
  /* Module titles and nav labels follow the language toggle (the shell only knows the English label). */
  function relabel(ctx, id) {
    ensureCss();
    var root = document.querySelector('.ax-app[data-slug="' + SLUG + '"]');
    if (!root) return;
    Object.keys(NAV).forEach(function (k) {
      var n = root.querySelector('.ax-nav-item[data-id="' + k + '"] .ax-nav-label');
      if (n) n.textContent = T(ctx, NAV[k]);
    });
    var t = root.querySelector(".ax-title");
    if (t && id) t.textContent = T(ctx, NAV[id]);
  }

  /* ---------- shared visit state (ctx.state) ---------- */
  function ensure(ctx) {
    var s = ctx.state.get();
    if (!s.visits) {
      ctx.state.set({ visits: JSON.parse(JSON.stringify(ctx.data.visits)), nextUhid: ctx.data.nextUhid });
    }
    return ctx.state.get().visits;
  }
  function find(ctx, uhid) { return ensure(ctx).filter(function (v) { return v.uhid === uhid; })[0]; }
  function patch(ctx, uhid, p) {
    var vs = ensure(ctx).map(function (v) { return v.uhid === uhid ? Object.assign({}, v, p) : v; });
    ctx.state.set({ visits: vs });
  }
  function setStage(ctx, uhid, stage) {
    var v = find(ctx, uhid), p = { stage: stage, minutes: 0 };
    if (!v) return;
    if (stage === "pharmacy" && !v.pharm) p.pharm = "queued";
    if (stage === "done" && v.pharm) p.pharm = "collected";
    patch(ctx, uhid, p);
  }
  function createVisit(ctx, d) {
    ensure(ctx);
    var s = ctx.state.get(), uhid = "UH-26-" + s.nextUhid;
    var dept = ctx.data.depts.filter(function (x) { return x.id === d.dept; })[0] || ctx.data.depts[0];
    var v = {
      uhid: uhid, name: d.name, age: d.age, sex: d.sex, phone: d.phone, complaint: d.complaint, complaintHi: d.complaintHi || d.complaint, dept: dept.id, doctor: dept.doctor,
      token: "A-" + (101 + s.visits.length), stage: "registered", channel: d.channel, vitals: null, rx: [], labs: [], pharm: null, paid: false, minutes: 0
    };
    ctx.state.set({ visits: s.visits.concat([v]), nextUhid: s.nextUhid + 1, lastUhid: uhid });
    return v;
  }
  function deptName(ctx, id) { var d = ctx.data.depts.filter(function (x) { return x.id === id; })[0]; return d ? ctx.t(d.en, d.hi) : id; }
  function complaintOf(ctx, v) { return ctx.t(v.complaint, v.complaintHi); }
  function kv(pairs) {
    var dl = E("dl", { style: { display: "grid", gridTemplateColumns: "120px minmax(0,1fr)", gap: "6px 12px", margin: 0, fontSize: ".88rem" } });
    pairs.forEach(function (p) { dl.appendChild(E("dt", { style: { color: "var(--ink-3)", font: "500 .72rem var(--font-mono)", textTransform: "uppercase", paddingTop: "2px" } }, p[0])); dl.appendChild(E("dd", { style: { margin: 0, overflowWrap: "anywhere" } }, p[1])); });
    return dl;
  }
  function sim(text) { AX.ui.toast(text, { kind: "sim" }); }
  function fee(ctx, v) {
    var items = [{ label: ctx.t("Consultation fee", "परामर्श शुल्क"), amt: ctx.data.fees.consult }];
    (v.labs || []).forEach(function (id) {
      var t = ctx.data.labTests.filter(function (x) { return x.id === id; })[0];
      if (t) items.push({ label: ctx.t("Lab: ", "जांच: ") + ctx.t(t.en, t.hi), amt: t.fee });
    });
    (v.rx || []).forEach(function (r) { items.push({ label: ctx.t("Medicine: ", "दवा: ") + r.drug + " x " + r.days + ctx.t(" d", " दिन"), amt: ctx.data.fees.drugUnit * r.days }); });
    var total = items.reduce(function (a, b) { return a + b.amt; }, 0);
    return { items: items, total: total };
  }
  function pickPatient(ctx, stage, id) {
    var vs = ensure(ctx);
    return find(ctx, id) || vs.filter(function (v) { return v.stage === stage; })[0] || vs[0];
  }
  function visitSelect(ctx, attr, stage, current, onChange) {
    var vs = ensure(ctx).slice().sort(function (a, b) { return (b.stage === stage) - (a.stage === stage); });
    var sel = E("select", { "aria-label": ctx.t("Patient", "मरीज़"), on: { change: function () { onChange(sel.value); } } }, vs.map(function (v) {
      return E("option", { value: v.uhid }, v.name + " · " + v.uhid + " · " + T(ctx, STAGE[v.stage]));
    }));
    sel.setAttribute(attr, ""); sel.value = current;
    return sel;
  }

  /* move a board card through the board engine's own keyboard menu (the AppShell does not expose the board handle) */
  function boardMove(uhid, label) {
    var card = document.querySelector('.ax-module .bd-card[data-id="' + uhid + '"]');
    if (!card) return;
    card.dispatchEvent(new KeyboardEvent("keydown", { key: "m", bubbles: true }));
    var items = card.querySelectorAll(".bd-menu-item");
    for (var i = 0; i < items.length; i++) if (items[i].textContent === label) { items[i].click(); return; }
  }

  var mods = [];

  /* ---- Register: form or Asha voice agent ---- */
  mods.push({ id: "register", label: NAV.register[0], icon: "form", group: "Front desk", view: {
    type: "custom", render: function (el, ctx) {
      ensureCss(); ensure(ctx); relabel(ctx, "register");
      var tab = ctx.state.get().regTab || "form";
      var root = E("div", { style: { display: "grid", gap: "16px" } });
      el.appendChild(root);
      function doneCard(v, attr) {
        var c = E("div", { class: "um-done", "data-asha-done": attr ? "" : null },
          E("strong", {}, ctx.t("Registered. Your UHID is", "पंजीकरण हो गया। आपका UHID है")),
          E("div", { class: "uh", "data-uhid": "" }, v.uhid),
          E("div", {}, v.name + " · " + deptName(ctx, v.dept) + " · " + v.doctor + " · " + ctx.t("Token ", "टोकन ") + v.token),
          E("div", { class: "um-row" },
            E("button", { type: "button", class: "um-btn primary", on: { click: function () { ctx.open("reception"); } } }, ctx.t("Open reception queue", "रिसेप्शन कतार खोलें")),
            E("button", { type: "button", class: "um-btn", on: { click: function () { ctx.state.set({ lastUhid: v.uhid }); ctx.open("tracker"); } } }, ctx.t("Open visit tracker", "विज़िट ट्रैकर खोलें"))));
        return c;
      }
      function draw() {
        root.textContent = "";
        root.appendChild(note(ctx));
        root.appendChild(E("div", { class: "um-tabs", role: "group", "aria-label": ctx.t("Registration mode", "पंजीकरण का तरीका") },
          E("button", { type: "button", "data-reg-tab": "form", "aria-pressed": String(tab === "form"), on: { click: function () { tab = "form"; ctx.state.set({ regTab: tab }); draw(); } } }, ctx.t("Registration form", "पंजीकरण फ़ॉर्म")),
          E("button", { type: "button", "data-reg-tab": "asha", "aria-pressed": String(tab === "asha"), on: { click: function () { tab = "asha"; ctx.state.set({ regTab: tab }); draw(); } } }, ctx.t("Talk to Asha", "आशा से बात करें"))));
        if (tab === "form") drawForm(); else drawAsha();
      }
      function drawForm() {
        var out = E("div");
        var name = E("input", { id: "um-name", type: "text", autocomplete: "off" });
        var age = E("input", { id: "um-age", type: "number", min: "0", max: "110" });
        var phone = E("input", { id: "um-phone", type: "text", placeholder: "+91 98xxx x0000" });
        var sex = E("select", { id: "um-sex" }, [["F", ctx.t("Female", "महिला")], ["M", ctx.t("Male", "पुरुष")], ["O", ctx.t("Other", "अन्य")]].map(function (o) { return E("option", { value: o[0] }, o[1]); }));
        var cmp = E("select", { id: "um-complaint" }, ctx.data.complaints.map(function (c, i) { return E("option", { value: String(i) }, ctx.t(c[0], c[1])); }));
        var err = E("div", { style: { color: "#C0322B", fontSize: ".85rem" }, role: "alert" });
        var form = E("form", { class: "um-card", novalidate: "" },
          E("h3", {}, ctx.t("New OPD registration", "नया ओपीडी पंजीकरण")),
          E("div", { class: "um-form" },
            E("label", {}, ctx.t("Full name", "पूरा नाम"), name), E("label", {}, ctx.t("Age", "उम्र"), age), E("label", {}, ctx.t("Sex", "लिंग"), sex),
            E("label", {}, ctx.t("Mobile number", "मोबाइल नंबर"), phone),
            E("label", { class: "full" }, ctx.t("Reason for visit", "आने का कारण"), cmp),
            E("div", { class: "full" }, err, E("button", { type: "submit", class: "um-btn primary", "data-register-submit": "" }, ctx.t("Register patient", "मरीज़ पंजीकृत करें")))), out);
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          if (!name.value.trim()) { err.textContent = ctx.t("Please enter the patient's name.", "कृपया मरीज़ का नाम लिखें।"); return; }
          err.textContent = "";
          var c = ctx.data.complaints[+cmp.value];
          var v = createVisit(ctx, { name: name.value.trim(), age: +age.value || 30, sex: sex.value, phone: phone.value || "+91 98xxx x0000", complaint: c[0], complaintHi: c[1], dept: c[2], channel: "Form" });
          out.textContent = ""; out.appendChild(doneCard(v));
          sim(ctx.t("Simulated — SMS with UHID not sent.", "सिमुलेशन — UHID वाला SMS नहीं भेजा गया।"));
        });
        root.appendChild(form);
      }
      function drawAsha() {
        var bars = []; for (var i = 0; i < 28; i++) bars.push(E("i", { style: { "--h": (18 + ((i * 37) % 70)) + "%", "--d": ((i * 53) % 700) + "ms" } }));
        var wave = E("div", { class: "um-wave", "aria-hidden": "true" }, bars);
        var chatHost = E("div", { style: { minHeight: "360px" } });
        var result = E("div");
        var start = E("button", { type: "button", class: "um-btn primary", "data-asha-start": "" }, ctx.t("Start call with Asha", "आशा के साथ कॉल शुरू करें"));
        var A = ctx.data.asha, chat, created = null;
        root.appendChild(E("div", { class: "um-card" },
          E("h3", {}, ctx.t("Asha — voice registration agent", "आशा — वॉइस पंजीकरण एजेंट")),
          E("p", { style: { margin: "0 0 12px", fontSize: ".88rem", color: "var(--ink-2)" } }, ctx.t("Asha talks to the patient in Hindi or English, fills the registration and issues a UHID. This is a scripted simulation.", "आशा मरीज़ से हिंदी या अंग्रेज़ी में बात करके पंजीकरण भरती है और UHID देती है। यह एक स्क्रिप्टेड सिमुलेशन है।")),
          wave, E("div", { class: "um-row", style: { margin: "12px 0" } }, start), chatHost, result));
        chat = AX.chat.create(chatHost, {
          composer: false,
          threads: [{ id: "asha", name: "Asha", channel: "voice", preview: ctx.t("Voice registration", "वॉइस पंजीकरण"), messages: [] }],
          scripts: { asha: ctx.lang === "hi" ? A.hi : A.en },
          onEvent: function (ev) {
            if (ev !== "registered" || created) return;
            var p = A.persona;
            created = createVisit(ctx, { name: p.name, age: p.age, sex: p.sex, phone: p.phone, complaint: p.complaint, complaintHi: p.complaintHi, dept: p.dept, channel: "Asha" });
            result.textContent = ""; result.appendChild(doneCard(created, true));
            sim(ctx.t("Simulated — SMS with UHID not sent.", "सिमुलेशन — UHID वाला SMS नहीं भेजा गया।"));
          }
        });
        start.addEventListener("click", function () {
          start.disabled = true; wave.classList.add("live");
          chat.play("asha").then(function () { wave.classList.remove("live"); });
        });
      }
      draw();
    } } });

  /* ---- Reception board ---- */
  var STAGES = ["registered", "waiting", "nurse", "doctor", "billing", "pharmacy", "done"];
  mods.push({ id: "reception", label: NAV.reception[0], icon: "board", group: "Front desk", view: function (ctx) {
    relabel(ctx, "reception"); noteSoon(ctx);
    return {
      type: "board",
      columns: STAGES.map(function (s) { return { id: s, label: T(ctx, STAGE[s]), tone: s === "done" ? "good" : s === "billing" ? "hot" : undefined }; }),
      cards: ensure(ctx).map(function (v) {
        return { id: v.uhid, col: v.stage, title: v.name + ", " + v.age + v.sex, sub: complaintOf(ctx, v), tags: [deptName(ctx, v.dept), v.token], meta: v.uhid + " · " + v.minutes + ctx.t(" min", " मिनट") };
      }),
      onMove: function (card, col) { setStage(ctx, card.id, col); sim(ctx.t("Simulated — visit moved to ", "सिमुलेशन — विज़िट भेजी गई: ") + T(ctx, STAGE[col]) + "."); },
      onOpen: function (card) {
        var v = find(ctx, card.id); if (!v) return;
        var i = STAGES.indexOf(v.stage), next = STAGES[i + 1];
        var h = AX.ui.drawer({
          title: v.name + " · " + v.uhid,
          body: E("div", { style: { display: "grid", gap: "12px" } }, note(ctx), kv([
            [ctx.t("Patient", "मरीज़"), v.name + ", " + v.age + " " + v.sex], [ctx.t("Phone", "फ़ोन"), v.phone], [ctx.t("Reason", "कारण"), complaintOf(ctx, v)],
            [ctx.t("Department", "विभाग"), deptName(ctx, v.dept) + " · " + v.doctor], [ctx.t("Token", "टोकन"), v.token], [ctx.t("Registered via", "पंजीकरण"), v.channel],
            [ctx.t("Stage", "चरण"), T(ctx, STAGE[v.stage])]])),
          actions: next ? [{ label: ctx.t("Move to ", "भेजें: ") + T(ctx, STAGE[next]), primary: true, onClick: function () { h.close(); boardMove(v.uhid, T(ctx, STAGE[next])); } }] : []
        });
      }
    };
  } });

  /* ---- Nurse vitals form ---- */
  mods.push({ id: "nurse", label: NAV.nurse[0], icon: "heart", group: "Clinical", view: function (ctx) {
    relabel(ctx, "nurse"); noteSoon(ctx);
    var vs = ensure(ctx).slice().sort(function (a, b) { return (b.stage === "nurse") - (a.stage === "nurse"); });
    return {
      type: "form",
      fields: [
        { key: "uhid", label: ctx.t("Patient", "मरीज़"), type: "select", options: vs.map(function (v) { return { value: v.uhid, label: v.name + " · " + v.uhid + " · " + T(ctx, STAGE[v.stage]) }; }) },
        { key: "sys", label: ctx.t("BP systolic (mmHg)", "ब्लड प्रेशर ऊपर (mmHg)"), type: "number" }, { key: "dia", label: ctx.t("BP diastolic (mmHg)", "ब्लड प्रेशर नीचे (mmHg)"), type: "number" },
        { key: "pulse", label: ctx.t("Pulse (/min)", "नब्ज़ (प्रति मिनट)"), type: "number" }, { key: "temp", label: ctx.t("Temperature (°C)", "तापमान (°C)"), type: "number" },
        { key: "spo2", label: "SpO2 (%)", type: "number" }, { key: "weight", label: ctx.t("Weight (kg)", "वज़न (किलो)"), type: "number" },
        { key: "notes", label: ctx.t("Nurse notes", "नर्स के नोट्स"), type: "textarea" }
      ],
      submit: ctx.t("Save vitals", "वाइटल्स सहेजें"),
      onSubmit: function (v) {
        var vis = find(ctx, v.uhid);
        if (!vis || v.sys == null || v.pulse == null || v.temp == null || v.spo2 == null) {
          return E("div", { style: { color: "#C0322B" }, role: "alert" }, ctx.t("Enter BP, pulse, temperature and SpO2.", "BP, नब्ज़, तापमान और SpO2 भरें।"));
        }
        var flags = [];
        if (v.temp >= 38) flags.push(ctx.t("Fever", "बुखार"));
        if (v.spo2 < 94) flags.push(ctx.t("Low oxygen", "ऑक्सीजन कम"));
        if (v.sys >= 140 || v.dia >= 90) flags.push(ctx.t("High BP", "उच्च रक्तचाप"));
        if (v.pulse > 100) flags.push(ctx.t("Fast pulse", "तेज़ नब्ज़"));
        var p = { vitals: { sys: v.sys, dia: v.dia, pulse: v.pulse, temp: v.temp, spo2: v.spo2, weight: v.weight, notes: v.notes } };
        if (["registered", "waiting", "nurse"].indexOf(vis.stage) >= 0) { p.stage = "doctor"; p.minutes = 0; }
        patch(ctx, v.uhid, p);
        return E("div", { class: "um-done", "data-vitals-done": "" },
          E("strong", {}, ctx.t("Vitals saved for ", "वाइटल्स सहेजे गए: ") + vis.name),
          E("div", {}, "BP " + v.sys + "/" + (v.dia == null ? "-" : v.dia) + " · " + ctx.t("Pulse ", "नब्ज़ ") + v.pulse + " · " + v.temp + "°C · SpO2 " + v.spo2 + "%"),
          E("div", {}, flags.length ? ctx.t("Flags: ", "संकेत: ") + flags.join(", ") : ctx.t("All readings in the expected range.", "सभी रीडिंग सामान्य हैं।")),
          p.stage ? E("div", {}, ctx.t("Visit moved to the doctor's queue.", "विज़िट डॉक्टर की कतार में भेज दी गई।")) : null);
      }
    };
  } });

  /* ---- Doctor consult ---- */
  mods.push({ id: "doctor", label: NAV.doctor[0], icon: "users", group: "Clinical", view: {
    type: "custom", render: function (el, ctx) {
      ensureCss(); ensure(ctx); relabel(ctx, "doctor");
      var sel = (pickPatient(ctx, "doctor", ctx.state.get().docSel) || {}).uhid, rx = [], labs = {}, dx = "", doneMsg = null;
      var root = E("div", { style: { display: "grid", gap: "16px" } });
      el.appendChild(root);
      function draw() {
        root.textContent = "";
        root.appendChild(note(ctx));
        var v = find(ctx, sel);
        root.appendChild(E("label", { class: "um-lbl" }, ctx.t("Patient queue", "मरीज़ कतार"), visitSelect(ctx, "data-consult-select", "doctor", sel, function (id) { sel = id; rx = []; labs = {}; dx = ""; doneMsg = null; ctx.state.set({ docSel: id }); draw(); })));
        if (doneMsg) root.appendChild(E("div", { class: "um-done", "data-consult-done": "" }, doneMsg));
        if (!v) return;
        var vit = v.vitals;
        var summary = E("div", { class: "um-card" }, E("h3", {}, ctx.t("Patient summary", "मरीज़ का सारांश")), kv([
          [ctx.t("Patient", "मरीज़"), v.name + ", " + v.age + " " + v.sex + " · " + v.uhid], [ctx.t("Complaint", "शिकायत"), complaintOf(ctx, v)],
          [ctx.t("Stage", "चरण"), T(ctx, STAGE[v.stage])],
          [ctx.t("Vitals", "वाइटल्स"), vit ? "BP " + vit.sys + "/" + vit.dia + " · " + ctx.t("Pulse ", "नब्ज़ ") + vit.pulse + " · " + vit.temp + "°C · SpO2 " + vit.spo2 + "%" : ctx.t("Not recorded yet", "अभी दर्ज नहीं")]]));
        var dxIn = E("input", { class: "um-in", type: "text", value: dx, placeholder: ctx.t("e.g. Viral fever", "जैसे: वायरल बुखार"), "aria-label": ctx.t("Diagnosis", "निदान"), on: { input: function (e) { dx = e.target.value; } } });
        var drug = E("select", { class: "um-in", "aria-label": ctx.t("Drug", "दवा") }, ctx.data.drugs.map(function (d) { return E("option", { value: d }, d); }));
        var freq = E("select", { class: "um-in", "aria-label": ctx.t("Frequency", "कितनी बार") }, ["1-0-1", "1-1-1", "0-0-1", "1-0-0", "SOS"].map(function (f) { return E("option", { value: f }, f); }));
        var days = E("input", { class: "um-in", type: "number", value: "3", min: "1", max: "30", "aria-label": ctx.t("Days", "दिन") });
        var consult = E("div", { class: "um-card", "data-consult": "" }, E("h3", {}, ctx.t("Consultation, prescription and orders", "परामर्श, पर्चा और जांच")),
          E("label", { class: "um-lbl" }, ctx.t("Diagnosis", "निदान"), dxIn),
          E("div", { class: "um-form", style: { marginTop: "12px" } }, E("label", {}, ctx.t("Drug", "दवा"), drug), E("label", {}, ctx.t("Frequency", "कितनी बार"), freq), E("label", {}, ctx.t("Days", "दिन"), days),
            E("div", { style: { alignSelf: "end" } }, E("button", { type: "button", class: "um-btn", "data-add-rx": "", on: { click: function () { rx.push({ drug: drug.value, freq: freq.value, days: +days.value || 1 }); draw(); } } }, ctx.t("Add to Rx", "पर्चे में जोड़ें")))),
          E("ul", { class: "um-rx", "aria-label": "Rx" }, rx.length ? rx.map(function (r, i) {
            return E("li", {}, E("span", {}, r.drug + " · " + r.freq + " · " + r.days + ctx.t(" days", " दिन")), E("button", { type: "button", "aria-label": ctx.t("Remove", "हटाएं"), on: { click: function () { rx.splice(i, 1); draw(); } } }, "×"));
          }) : [E("li", {}, E("span", { style: { color: "var(--ink-3)" } }, ctx.t("No medicines added yet.", "अभी कोई दवा नहीं जोड़ी गई।")))]),
          E("div", { style: { fontWeight: 600, fontSize: ".85rem", margin: "6px 0" } }, ctx.t("Lab orders", "जांच के आदेश")),
          E("div", { class: "um-row" }, ctx.data.labTests.map(function (t) {
            var cb = E("input", { type: "checkbox", id: "um-lab-" + t.id, style: { width: "auto" }, on: { change: function (e) { labs[t.id] = e.target.checked; } } });
            cb.checked = !!labs[t.id];
            return E("label", { class: "um-lbl", style: { flexDirection: "row", alignItems: "center", gap: "6px", font: "500 .85rem var(--font-body)", color: "var(--ink)" } }, cb, ctx.t(t.en, t.hi));
          })),
          E("div", { class: "um-row", style: { marginTop: "14px" } }, E("button", { type: "button", class: "um-btn primary", "data-complete-consult": "", on: { click: complete } }, ctx.t("Complete consult", "परामर्श पूरा करें"))));
        root.appendChild(E("div", { class: "um-grid" }, summary, consult));
      }
      function complete() {
        var v = find(ctx, sel); if (!v) return;
        var ordered = Object.keys(labs).filter(function (k) { return labs[k]; });
        patch(ctx, sel, { rx: rx.slice(), labs: ordered, dx: dx, stage: "billing", minutes: 0 });
        doneMsg = ctx.t("Consult saved for ", "परामर्श सहेजा गया: ") + v.name + ctx.t(". The visit moved to Billing.", "। विज़िट बिलिंग में भेज दी गई।");
        rx = []; labs = {}; dx = "";
        sel = (pickPatient(ctx, "doctor") || {}).uhid;
        sim(ctx.t("Simulated — prescription and lab orders not sent.", "सिमुलेशन — पर्चा और जांच के आदेश नहीं भेजे गए।"));
        draw();
      }
      draw();
    } } });

  /* ---- Billing ---- */
  mods.push({ id: "billing", label: NAV.billing[0], icon: "wallet", group: "Billing & pharmacy", view: {
    type: "custom", render: function (el, ctx) {
      ensureCss(); ensure(ctx); relabel(ctx, "billing");
      var sel = (pickPatient(ctx, "billing", ctx.state.get().billSel) || {}).uhid, mode = "UPI";
      var root = E("div", { style: { display: "grid", gap: "16px" } });
      el.appendChild(root);
      function draw() {
        root.textContent = "";
        root.appendChild(note(ctx));
        var v = find(ctx, sel);
        root.appendChild(E("label", { class: "um-lbl" }, ctx.t("Patient", "मरीज़"), visitSelect(ctx, "data-bill-select", "billing", sel, function (id) { sel = id; ctx.state.set({ billSel: id }); draw(); })));
        if (!v) return;
        var b = fee(ctx, v), paidNow = v.paid;
        var modeSel = E("select", { class: "um-in", "aria-label": ctx.t("Payment mode", "भुगतान का तरीका"), on: { change: function (e) { mode = e.target.value; } } }, [["UPI", "UPI"], ["Cash", ctx.t("Cash", "नकद")], ["Card", ctx.t("Card", "कार्ड")]].map(function (o) { return E("option", { value: o[0] }, o[1]); }));
        modeSel.value = mode;
        var table = E("table", { class: "um-table um-bill-items" },
          E("thead", {}, E("tr", {}, E("th", {}, ctx.t("Item", "विवरण")), E("th", {}, ctx.t("Amount", "राशि")))),
          E("tbody", {}, b.items.map(function (i) { return E("tr", {}, E("td", {}, i.label), E("td", {}, AX.fmt.inr(i.amt))); })),
          E("tfoot", {}, E("tr", {}, E("td", {}, ctx.t("Total", "कुल")), E("td", { "data-total": "" }, AX.fmt.inr(b.total)))));
        var pay = E("div", { class: "um-row" }, E("label", { class: "um-lbl" }, ctx.t("Payment mode", "भुगतान का तरीका"), modeSel),
          E("button", { type: "button", class: "um-btn primary", "data-pay": "", disabled: paidNow ? "" : null, on: { click: function () {
            patch(ctx, sel, { paid: true, payMode: mode, stage: ["billing"].indexOf(v.stage) >= 0 ? "pharmacy" : v.stage, pharm: v.pharm || "queued", minutes: 0 });
            sim(ctx.t("Simulated — payment not collected; nothing was saved.", "सिमुलेशन — भुगतान नहीं लिया गया; कुछ सहेजा नहीं गया।"));
            draw();
          } } }, paidNow ? ctx.t("Paid", "भुगतान हो गया") : ctx.t("Collect payment", "भुगतान लें")));
        var receipt = paidNow ? E("div", { class: "um-done", "data-paid": "" }, E("strong", {}, ctx.t("Payment received", "भुगतान प्राप्त")),
          E("div", {}, AX.fmt.inr(b.total) + " · " + (v.payMode || mode) + " · " + ctx.t("Receipt ", "रसीद ") + "R-" + v.uhid.slice(-5)),
          E("div", {}, ctx.t("Prescription sent to pharmacy.", "पर्चा फ़ार्मेसी को भेज दिया गया।"))) : null;
        root.appendChild(E("div", { class: "um-card", "data-bill": "" }, E("h3", {}, ctx.t("Bill for ", "बिल: ") + v.name + " · " + v.uhid), table, pay, receipt));
      }
      draw();
    } } });

  /* ---- Pharmacy board ---- */
  var PCOLS = ["queued", "preparing", "ready", "collected"];
  mods.push({ id: "pharmacy", label: NAV.pharmacy[0], icon: "box", group: "Billing & pharmacy", view: function (ctx) {
    relabel(ctx, "pharmacy"); noteSoon(ctx);
    return {
      type: "board",
      columns: PCOLS.map(function (c) { return { id: c, label: T(ctx, PH[c]), tone: c === "ready" ? "good" : undefined }; }),
      cards: ensure(ctx).filter(function (v) { return v.pharm; }).map(function (v) {
        return { id: v.uhid, col: v.pharm, title: v.name, sub: (v.rx.length || 0) + ctx.t(" medicines", " दवाएं"), tags: [v.token], meta: v.uhid };
      }),
      onMove: function (card, col) {
        var v = find(ctx, card.id), p = { pharm: col };
        if (col === "collected") p.stage = "done"; else if (v && v.stage === "done") p.stage = "pharmacy";
        patch(ctx, card.id, p);
        sim(ctx.t("Simulated — pharmacy status set to ", "सिमुलेशन — फ़ार्मेसी स्थिति: ") + T(ctx, PH[col]) + ".");
      },
      onOpen: function (card) {
        var v = find(ctx, card.id); if (!v) return;
        var next = PCOLS[PCOLS.indexOf(v.pharm) + 1];
        var h = AX.ui.drawer({
          title: v.name + " · " + v.uhid,
          body: E("div", { style: { display: "grid", gap: "12px" } }, note(ctx),
            E("strong", {}, ctx.t("Prescription", "पर्चा")),
            E("ul", { class: "um-rx" }, v.rx.length ? v.rx.map(function (r) { return E("li", {}, E("span", {}, r.drug + " · " + r.freq + " · " + r.days + ctx.t(" days", " दिन"))); }) : [E("li", {}, E("span", {}, ctx.t("No medicines recorded.", "कोई दवा दर्ज नहीं।")))]),
            kv([[ctx.t("Status", "स्थिति"), T(ctx, PH[v.pharm])], [ctx.t("Paid", "भुगतान"), v.paid ? ctx.t("Yes", "हां") : ctx.t("No", "नहीं")]])),
          actions: next ? [{ label: ctx.t("Mark ", "चिह्नित करें: ") + T(ctx, PH[next]), primary: true, onClick: function () { h.close(); boardMove(v.uhid, T(ctx, PH[next])); } }] : []
        });
      }
    };
  } });

  /* ---- Public visit tracker (/p/<uhid>) ---- */
  mods.push({ id: "tracker", label: NAV.tracker[0], icon: "pipeline", group: "Patient", view: {
    type: "custom", render: function (el, ctx) {
      ensureCss(); ensure(ctx); relabel(ctx, "tracker");
      var sel = ctx.state.get().lastUhid || (ensure(ctx)[0] || {}).uhid;
      el.appendChild(note(ctx));
      var holder = E("div", { style: { display: "grid", gap: "14px" } });
      el.appendChild(holder);
      function statusOf(v) {
        var q = ensure(ctx).filter(function (x) { return x.stage === v.stage && x.uhid !== v.uhid; }).length;
        switch (v.stage) {
          case "registered": return [ctx.t("You are registered. Please take a seat; we will call your token.", "आपका पंजीकरण हो गया है। कृपया बैठें, आपका टोकन बुलाया जाएगा।"), false];
          case "waiting": return [ctx.t("You are in the waiting area. About " + q + " patients ahead of you.", "आप प्रतीक्षा क्षेत्र में हैं। आपसे पहले लगभग " + q + " मरीज़ हैं।"), false];
          case "nurse": return [ctx.t("The nurse is checking your vitals.", "नर्स आपके वाइटल्स जांच रही हैं।"), false];
          case "doctor": return [ctx.t("You are with the doctor.", "आप डॉक्टर के पास हैं।"), false];
          case "billing": return [ctx.t("Please go to the billing counter.", "कृपया बिलिंग काउंटर पर जाएं।"), false];
          case "pharmacy":
            if (v.pharm === "ready") return [ctx.t("Medicines ready — please collect them at counter 2.", "दवाइयां तैयार हैं — कृपया काउंटर 2 से लें।"), true];
            if (v.pharm === "collected") return [ctx.t("Medicines collected. Take care!", "दवाइयां ले ली गईं। ध्यान रखें!"), true];
            return [ctx.t("The pharmacy is preparing your medicines.", "फ़ार्मेसी आपकी दवाइयां तैयार कर रही है।"), false];
          default: return [ctx.t("Visit complete. Wishing you a speedy recovery.", "विज़िट पूरी हुई। आप जल्दी स्वस्थ हों।"), true];
        }
      }
      function draw() {
        holder.textContent = "";
        var vs = ensure(ctx), v = find(ctx, sel) || vs[0];
        if (!v) return;
        var picker = E("select", { class: "um-in", "data-tracker-select": "", "aria-label": ctx.t("Choose visit", "विज़िट चुनें"), on: { change: function (e) { sel = e.target.value; draw(); } } },
          vs.map(function (x) { return E("option", { value: x.uhid }, x.name + " · " + x.uhid); }));
        picker.value = v.uhid;
        var st = statusOf(v), idx = STAGES.indexOf(v.stage);
        var steps = [["registered", ctx.t("Registered", "पंजीकृत")], ["waiting", ctx.t("Waiting", "प्रतीक्षा")], ["nurse", ctx.t("Vitals check", "वाइटल्स जांच")], ["doctor", ctx.t("Doctor consultation", "डॉक्टर परामर्श")],
          ["billing", ctx.t("Billing", "बिलिंग")], ["pharmacy", v.pharm === "ready" || v.pharm === "collected" ? ctx.t("Medicines ready", "दवाइयां तैयार") : ctx.t("Pharmacy", "फ़ार्मेसी")], ["done", ctx.t("Done", "पूर्ण")]];
        holder.appendChild(E("label", { class: "um-lbl", style: { maxWidth: "430px", margin: "0 auto", width: "100%" } }, ctx.t("Demo: choose a visit to follow", "डेमो: ट्रैक करने के लिए विज़िट चुनें"), picker));
        holder.appendChild(E("div", { class: "um-phone" },
          E("div", { class: "um-url" }, "track.umang-demo/p/" + v.uhid),
          E("div", { class: "um-track" },
            E("div", {}, E("strong", {}, v.name), E("div", { style: { fontSize: ".8rem", color: "var(--ink-3)" } }, v.uhid + " · " + ctx.t("Token ", "टोकन ") + v.token + " · " + deptName(ctx, v.dept))),
            E("div", { class: "um-status" + (st[1] ? " ok" : ""), "data-tracker-status": "", "aria-live": "polite" }, st[0]),
            E("ol", { class: "um-steps", "aria-label": ctx.t("Visit progress", "विज़िट की प्रगति") }, steps.map(function (s, i) {
              var cls = i < idx || v.stage === "done" ? "done" : i === idx ? "now" : "";
              if (s[0] === "pharmacy" && (v.pharm === "ready")) cls = "now";
              return E("li", { class: cls }, s[1]);
            })),
            E("div", { style: { fontSize: ".75rem", color: "var(--ink-3)" } }, ctx.t("This page updates by itself — no login needed.", "यह पेज अपने आप अपडेट होता है — लॉगिन की ज़रूरत नहीं।")))));
      }
      var off = ctx.state.on(function (s) { if (s.visits) draw(); });
      AX.mount(el, off);
      draw();
    } } });

  /* ---- Reports ---- */
  mods.push({ id: "reports", label: NAV.reports[0], icon: "chart", group: "Admin", view: function (ctx) {
    relabel(ctx, "reports"); noteSoon(ctx);
    var vs = ensure(ctx), open = vs.filter(function (v) { return v.stage !== "done"; }).length, paid = vs.filter(function (v) { return v.paid; }).length;
    return {
      type: "dashboard",
      kpis: [
        { label: ctx.t("Registered today", "आज के पंजीकरण"), value: vs.length + 94, format: "num", delta: 6 },
        { label: ctx.t("In the queue now", "अभी कतार में"), value: open },
        { label: ctx.t("Avg. wait (min)", "औसत प्रतीक्षा (मिनट)"), value: 19, delta: -8 },
        { label: ctx.t("Collections", "वसूली"), value: 41200 + paid * 1100, format: "inr", delta: 4 }
      ],
      charts: [
        { type: "bar", title: ctx.t("Patients by hour", "घंटे के अनुसार मरीज़"), labels: ctx.data.hourly.labels, values: ctx.data.hourly.values },
        { type: "donut", title: ctx.t("By department", "विभाग के अनुसार"), parts: ctx.data.depts.map(function (d, i) { return { label: ctx.t(d.en, d.hi), value: [88, 46, 39, 31, 22][i] }; }) },
        { type: "line", title: ctx.t("OPD this week", "इस सप्ताह ओपीडी"), wide: true, labels: ctx.data.week.labels, series: [{ name: ctx.t("Visits", "विज़िट"), points: ctx.data.week.values }] }
      ]
    };
  } });

  AX.demos[SLUG] = { brand: { name: "Umang Hospital", accent: "#B5121B", logoText: "U" }, start: "register", lang: { options: ["en", "hi"] }, modules: mods };
})(window);
