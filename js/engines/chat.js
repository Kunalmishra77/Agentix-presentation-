(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  var DEFAULT_DELAY = 900;
  var CH = { whatsapp: "WhatsApp", instagram: "Instagram", web: "Web chat", voice: "Voice", telegram: "Telegram" };

  function reduced() {
    try { return !!(w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch (e) { return false; }
  }

  function create(host, opt) {
    var el = AX.el;
    var threads = (opt.threads || []).map(function (t) {
      return Object.assign({}, t, { messages: (t.messages || []).map(function (m) { return Object.assign({}, m); }) });
    });
    var scripts = opt.scripts || {};
    var cursor = {};            // scripted items consumed per thread
    var token = {};             // play/reply generation per thread, to cancel
    var timers = [];
    var destroyed = false;
    var current = null;
    var composer = opt.composer !== false;

    var list = el("div", { class: "cht-list", role: "list", "aria-label": "Conversations" });
    var conv = el("section", { class: "cht-conv", "aria-label": "Conversation" });
    var side = el("aside", { class: "cht-side", "aria-label": "Details" });
    var root = el("div", { class: "cht" + (opt.side ? " has-side" : "") }, list, conv, opt.side ? side : null);
    host.textContent = "";
    host.appendChild(root);

    var msgsEl = null, chipsEl = null, inputEl = null;

    function thread(id) { return threads.filter(function (t) { return t.id === id; })[0]; }
    function wait(ms) {
      if (!ms) return Promise.resolve();
      return new Promise(function (res) {
        var t = setTimeout(function () { var i = timers.indexOf(t); if (i >= 0) timers.splice(i, 1); res(); }, ms);
        timers.push(t);
      });
    }
    function delayOf(item) { return reduced() ? 0 : (item.delay != null ? item.delay : DEFAULT_DELAY); }

    function drawList() {
      list.textContent = "";
      threads.forEach(function (t) {
        var last = t.messages[t.messages.length - 1];
        list.appendChild(el("button", { type: "button", role: "listitem", class: "cht-thread chan-" + t.channel + (current === t.id ? " on" : ""),
          "data-id": t.id, "aria-current": current === t.id ? "true" : null, on: { click: function () { open(t.id); } } },
          el("span", { class: "cht-av", "aria-hidden": "true" }, (t.name || "?").charAt(0)),
          el("span", { class: "cht-meta" },
            el("span", { class: "cht-name" }, t.name),
            el("span", { class: "cht-prev" }, t.preview || (last && last.text) || "")),
          el("span", { class: "cht-chan" }, CH[t.channel] || t.channel)));
      });
    }

    function bubble(m) {
      var kind = m.from || "ai";
      var node = el("div", { class: "cht-msg from-" + kind },
        kind === "agent" ? el("span", { class: "cht-who" }, "Agent") : null,
        el("span", { class: "cht-text" }, m.text),
        m.at ? el("span", { class: "cht-at" }, m.at) : null);
      return node;
    }
    function scroll() { if (msgsEl) msgsEl.scrollTop = msgsEl.scrollHeight; }
    function clearChips() { if (chipsEl) chipsEl.textContent = ""; }
    function typing(on) {
      if (!msgsEl) return;
      var cur = msgsEl.querySelector(".cht-typing");
      if (!on) { if (cur) cur.parentNode.removeChild(cur); return; }
      if (cur) return;
      msgsEl.appendChild(el("div", { class: "cht-typing", role: "status", "aria-label": "Typing" }, el("i"), el("i"), el("i")));
      scroll();
    }

    function addMsg(t, m) {
      t.messages.push(m);
      if (current === t.id && msgsEl) { typing(false); msgsEl.appendChild(bubble(m)); scroll(); }
      drawList();
      return m;
    }
    function showChips(t, chips) {
      if (current !== t.id || !chipsEl) return;
      chipsEl.textContent = "";
      (chips || []).forEach(function (c) {
        chipsEl.appendChild(el("button", { type: "button", class: "cht-chip", on: { click: function () { send(t.id, c); } } }, c));
      });
    }

    /** Render one scripted item (typing delay for ai/agent), returns Promise. */
    function playItem(t, item, tk) {
      var isBot = item.from === "ai" || item.from === "agent";
      var d = delayOf(item);
      if (current === t.id && isBot && d) typing(true);
      return wait(d).then(function () {
        if (destroyed || token[t.id] !== tk) return false;
        clearChips();
        addMsg(t, { from: item.from, text: item.text, at: item.at });
        if (item.chips && item.chips.length) showChips(t, item.chips);
        if (item.event && opt.onEvent) opt.onEvent(item.event, t);
        return true;
      });
    }

    function play(id) {
      var t = thread(id);
      if (!t) return Promise.resolve();
      open(id);
      var tk = token[id] = (token[id] || 0) + 1;
      var items = scripts[id] || [];
      function next() {
        var i = cursor[id] || 0;
        if (destroyed || token[id] !== tk || i >= items.length) return Promise.resolve();
        cursor[id] = i + 1;
        return playItem(t, items[i], tk).then(function (ok) { return ok ? next() : undefined; });
      }
      return next();
    }

    /** Next scripted AI reply for a user-sent message, else a generic one. */
    function reply(t) {
      var items = scripts[t.id] || [];
      var i = cursor[t.id] || 0;
      if (items[i] && items[i].from === "user") i++;            // the user just typed this line themselves
      var item = items[i];
      while (item && item.from === "user") { i++; item = items[i]; }
      var tk = token[t.id] = (token[t.id] || 0) + 1;
      if (item) { cursor[t.id] = i + 1; }
      else { item = { from: "ai", text: "AI reply (simulated)" }; }
      return playItem(t, item, tk);
    }

    function send(id, text) {
      var t = thread(id);
      text = String(text || "").trim();
      if (!t || !text) return Promise.resolve();
      clearChips();
      addMsg(t, { from: "user", text: text });
      return reply(t);
    }

    function push(id, msg) {
      var t = thread(id);
      if (t) addMsg(t, Object.assign({ from: "ai" }, msg));
    }

    function open(id) {
      var t = thread(id);
      if (!t) return;
      current = id;
      conv.textContent = "";
      conv.className = "cht-conv th-" + (t.channel || "web");
      msgsEl = el("div", { class: "cht-msgs", role: "log", "aria-live": "polite", tabindex: "0" }, t.messages.map(bubble));
      chipsEl = el("div", { class: "cht-chips" });
      conv.appendChild(el("header", { class: "cht-head" },
        el("span", { class: "cht-av", "aria-hidden": "true" }, (t.name || "?").charAt(0)),
        el("span", { class: "cht-title" }, el("strong", {}, t.name), el("small", {}, CH[t.channel] || t.channel))));
      conv.appendChild(msgsEl);
      conv.appendChild(chipsEl);
      if (composer) {
        inputEl = el("input", { class: "cht-input", type: "text", placeholder: "Type a message", "aria-label": "Message",
          on: { keydown: function (e) { if (e.key === "Enter") { e.preventDefault(); submit(); } } } });
        conv.appendChild(el("div", { class: "cht-composer" }, inputEl,
          el("button", { type: "button", class: "cht-send", "aria-label": "Send", on: { click: submit } }, "Send")));
      }
      function submit() { var v = inputEl.value; inputEl.value = ""; send(id, v); }
      if (opt.side) { side.textContent = ""; var n = opt.side(t); if (n) side.appendChild(n); }
      drawList();
      scroll();
    }

    function destroy() {
      destroyed = true;
      timers.forEach(clearTimeout); timers = [];
    }

    drawList();
    if (threads.length) open(threads[0].id);
    AX.mount(host, destroy);
    return { open: open, play: play, push: push, send: send };
  }

  AX.chat = { create: create };
})(window);
