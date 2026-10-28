(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.demos = AX.demos || {};

  /** Pure: best FAQ for a user question by keyword overlap (null when nothing matches). */
  function match(text, faqs) {
    var t = String(text || "").toLowerCase(), best = null, bestScore = 0;
    (faqs || []).forEach(function (f) {
      var s = 0;
      f.keys.forEach(function (k) { if (t.indexOf(k) >= 0) s += k.length > 4 ? 2 : 1; });
      if (t === f.q.toLowerCase()) s += 10;
      if (s > bestScore) { bestScore = s; best = f; }
    });
    return best;
  }
  AX.agentixSite = { match: match };

  if (typeof document === "undefined" || !document.getElementById) return;
  var el = AX.el, SLUG = "ai-agentix-site", ACCENT = "#EE6A24";

  var CSS = [
    '.as-wrap{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;align-items:start}',
    '@media (max-width:900px){.as-wrap{grid-template-columns:minmax(0,1fr)}}',
    '.as-chat,.as-page{background:#fff;border:1px solid var(--ax-line);border-radius:14px;min-width:0;display:flex;flex-direction:column}',
    '.as-head{padding:12px 14px;border-bottom:1px solid var(--ax-line);font:600 13px var(--font-body);display:flex;gap:8px;align-items:center}',
    '.as-head i{width:8px;height:8px;border-radius:50%;background:#22C55E}',
    '.as-msgs{padding:14px;display:flex;flex-direction:column;gap:10px;height:340px;overflow:auto;background:#FBFAF7}',
    '.as-m{max-width:88%;padding:9px 13px;border-radius:14px;font-size:14px;line-height:1.45}',
    '.as-m.bot{background:color-mix(in srgb,var(--ax-accent) 12%,#fff);align-self:flex-start;border-bottom-left-radius:4px}',
    '.as-m.me{background:#fff;border:1px solid var(--ax-line);align-self:flex-end;border-bottom-right-radius:4px}',
    '.as-m small{display:block;margin-top:6px;font:600 11px var(--font-mono);color:var(--ink-3)}',
    '.as-chips{display:flex;gap:6px;flex-wrap:wrap;padding:10px 14px;border-top:1px solid var(--ax-line)}',
    '.as-chip{appearance:none;font:500 12px var(--font-body);padding:6px 12px;border-radius:999px;border:1px solid var(--ax-line);background:#fff;cursor:pointer;color:var(--ink)}',
    '.as-chip:hover,.as-chip:focus-visible{border-color:var(--ax-accent);color:var(--ax-accent)}',
    '.as-comp{display:flex;gap:8px;padding:10px 14px;border-top:1px solid var(--ax-line)}.as-comp input{flex:1;min-width:0;padding:9px 12px;border:1px solid var(--ax-line);border-radius:999px;font:400 14px var(--font-body)}',
    '.as-send{appearance:none;font:600 13px var(--font-body);padding:8px 16px;border-radius:999px;border:1px solid var(--ax-accent);background:var(--ax-accent);color:#fff;cursor:pointer}',
    '.as-pagebody{padding:14px;display:flex;flex-direction:column;gap:10px;height:340px;overflow:auto;scroll-behavior:smooth}',
    '.as-sec{border:1.5px solid var(--ax-line);border-radius:12px;padding:12px 14px;background:#fff;transition:box-shadow .3s,border-color .3s}',
    '.as-sec h4{margin:0 0 4px;font:600 15px var(--font-display)}.as-sec p{margin:0 0 6px;font-size:13px;color:var(--ink-3)}.as-sec ul{margin:0;padding-left:18px;font-size:13px}',
    '.as-sec.hl{border-color:var(--ax-accent);box-shadow:0 0 0 4px color-mix(in srgb,var(--ax-accent) 22%,transparent);background:#FFF8F3}',
    '.as-nav{margin-left:auto;font:600 11px var(--font-mono);color:var(--ink-3)}',
    '.as-typing{align-self:flex-start;font:500 12px var(--font-mono);color:var(--ink-3)}'
  ].join("\n");
  function injectCss() {
    if (document.getElementById("as-css")) return;
    var s = document.createElement("style"); s.id = "as-css";
    s.textContent = CSS + '\n.ax-app[data-slug="' + SLUG + '"],.demo-scope[data-slug="' + SLUG + '"]{--orange:' + ACCENT + '}';
    document.head.appendChild(s);
  }
  injectCss();

  function reduced() { try { return w.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } }

  function site(host, ctx) {
    injectCss();
    AX.embed.create(host, AX.embed.optsForSlug(SLUG));
  }

  function assistant(host, ctx) {
    injectCss();
    var d = ctx.data, busy = false, timers = [];
    var msgs = el("div", { class: "as-msgs", role: "log", "aria-live": "polite" });
    var page = el("div", { class: "as-pagebody" });
    var navLab = el("span", { class: "as-nav" }, "Viewing: top of page");
    var secEls = {};
    d.sections.forEach(function (s) {
      var n = el("section", { class: "as-sec", "data-section": s.id }, el("h4", {}, s.title), el("p", {}, s.blurb), el("ul", {}, s.items.map(function (i) { return el("li", {}, i); })));
      secEls[s.id] = n; page.appendChild(n);
    });
    var input = el("input", { type: "text", "aria-label": "Ask the assistant", placeholder: "Ask about services, pricing, work...", on: { keydown: function (e) { if (e.key === "Enter") { e.preventDefault(); ask(input.value); } } } });
    var chips = el("div", { class: "as-chips" }, d.faqs.map(function (f) { return el("button", { type: "button", class: "as-chip", "data-q": f.id, on: { click: function () { ask(f.q); } } }, f.q); }));
    function say(cls, text, src) {
      var m = el("div", { class: "as-m " + cls }, text, src ? el("small", {}, "Answered from: " + src) : null);
      msgs.appendChild(m); msgs.scrollTop = msgs.scrollHeight; return m;
    }
    function navigate(id) {
      Object.keys(secEls).forEach(function (k) { secEls[k].classList.toggle("hl", k === id); });
      var n = secEls[id];
      if (n) { page.scrollTop = Math.max(0, n.offsetTop - page.offsetTop - 8); navLab.textContent = "Viewing: " + n.querySelector("h4").textContent; page.setAttribute("data-highlight", id); }
    }
    function ask(text) {
      text = String(text || "").trim();
      if (!text || busy) return;
      input.value = ""; say("me", text);
      busy = true;
      var typing = el("div", { class: "as-typing" }, "Assistant is searching site content...");
      msgs.appendChild(typing); msgs.scrollTop = msgs.scrollHeight;
      var f = match(text, d.faqs);
      var t = setTimeout(function () {
        if (typing.parentNode) typing.parentNode.removeChild(typing);
        if (f) {
          var sec = d.sections.filter(function (s) { return s.id === f.section; })[0];
          say("bot", f.a, sec.title + " section");
          navigate(f.section);
        } else say("bot", "I can answer questions about our services, work, process, AI agents, pricing and contact details. Try one of the suggestions below.");
        busy = false;
      }, reduced() ? 0 : 700);
      timers.push(t);
    }
    say("bot", "Hi, I'm the AI Agentix assistant. I answer from this site's content and take you to the right section. What would you like to know?");
    host.appendChild(el("div", { class: "as-wrap" },
      el("div", { class: "as-chat" }, el("div", { class: "as-head" }, el("i"), "AI Agentix assistant"), msgs, chips,
        el("div", { class: "as-comp" }, input, el("button", { type: "button", class: "as-send", on: { click: function () { ask(input.value); } } }, "Send"))),
      el("div", { class: "as-page" }, el("div", { class: "as-head" }, "ai-agentix.com", navLab), page)));
    AX.mount(host, function () { timers.forEach(clearTimeout); });
  }

  AX.demos[SLUG] = {
    brand: { name: "AI Agentix", accent: ACCENT, logoText: "A" },
    start: "site",
    modules: [
      { id: "site", label: "Live website", icon: "home", group: "Website", view: { type: "custom", render: site } },
      { id: "assistant", label: "Site assistant", icon: "chat", group: "Website", view: { type: "custom", render: assistant } }
    ]
  };
})(window);
