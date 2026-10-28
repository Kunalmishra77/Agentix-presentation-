(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  var DEFAULT_TIMEOUT = 12000;
  var CAPTION = "Preview — live site opens in the hosted portfolio";

  function sameOriginHttp(url) {
    try {
      if (!/^https?:$/.test(w.location.protocol)) return false;
      var u = new URL(url, w.location.href);
      if (u.protocol === "about:") return true;
      return u.origin === w.location.origin;
    } catch (e) { return false; }
  }

  /** True when a loaded same-origin frame actually rendered a document (Chrome swaps blocked frames for an opaque error page). */
  function frameRendered(frame) {
    try {
      var doc = frame.contentDocument;
      if (!doc || !doc.documentElement) return false;
      if (/^chrome-error:/.test(String(doc.URL))) return false;
      return true;
    } catch (e) { return false; }
  }

  function create(host, opt) {
    var el = AX.el;
    var timeoutMs = opt.timeoutMs == null ? DEFAULT_TIMEOUT : opt.timeoutMs;
    var mode = opt.mode || "iframe";
    var status = "loading";           // loading | live | fallback
    var device = opt.device === "mobile" ? "mobile" : "desktop";
    var timer = null, frame = null, destroyed = false, dragStop = null;

    var view = el("div", { class: "emb-view" });
    var stage = el("div", { class: "emb-stage" }, view);
    var btnD = el("button", { type: "button", class: "emb-tog", "aria-pressed": "true", on: { click: function () { setDevice("desktop"); } } }, "Desktop");
    var btnM = el("button", { type: "button", class: "emb-tog", "aria-pressed": "false", on: { click: function () { setDevice("mobile"); } } }, "Mobile");
    var reloadBtn = el("button", { type: "button", class: "emb-reload", "aria-label": "Reload", title: "Reload", on: { click: function () { load(); } } }, "↻");
    var bar = el("div", { class: "emb-bar" },
      el("span", { class: "emb-dots", "aria-hidden": "true" }, el("i"), el("i"), el("i")),
      el("span", { class: "emb-url", title: opt.url }, opt.url || ""),
      el("span", { class: "emb-togs", role: "group", "aria-label": "Device" }, btnD, btnM),
      reloadBtn,
      opt.external && opt.url ? el("a", { class: "emb-open", href: opt.url, target: "_blank", rel: "noopener" }, "Open live ↗") : null,
      AX.ui.agentixBadge({ size: "sm" }));
    var root = el("div", { class: "emb", "data-status": status }, bar, stage);
    host.textContent = "";
    host.appendChild(root);

    function setStatus(s) { status = s; root.setAttribute("data-status", s); }
    function clearTimer() { if (timer) { clearTimeout(timer); timer = null; } }
    function removeFrame() {
      if (frame) { frame.onload = null; if (frame.parentNode) frame.parentNode.removeChild(frame); frame = null; }
    }
    function setDevice(d) {
      device = d === "mobile" ? "mobile" : "desktop";
      view.classList.toggle("mobile", device === "mobile");
      btnD.setAttribute("aria-pressed", device === "desktop" ? "true" : "false");
      btnM.setAttribute("aria-pressed", device === "mobile" ? "true" : "false");
    }

    function showScroller() {
      clearTimer(); removeFrame();
      setStatus("fallback");
      view.textContent = "";
      var strip = el("div", { class: "emb-scroller", tabindex: "0", role: "region", "aria-label": (opt.title || "Site") + " preview, scroll to read" },
        (opt.shots && opt.shots.length)
          ? opt.shots.map(function (s) { return el("img", { src: s.src, alt: (opt.title || "Site") + " preview", loading: "lazy", draggable: "false" }); })
          : el("div", { class: "emb-noshot" }, "No preview available"));
      view.appendChild(strip);
      view.appendChild(el("div", { class: "emb-caption" }, CAPTION));
      // drag-to-scroll (mouse / pen; touch scrolls natively)
      strip.addEventListener("pointerdown", function (e) {
        if (e.pointerType === "touch" || (e.button != null && e.button !== 0)) return;
        var y0 = e.clientY, s0 = strip.scrollTop, pid = e.pointerId, moved = false;
        function mv(ev) {
          if (ev.pointerId !== pid) return;
          if (!moved && Math.abs(ev.clientY - y0) < 4) return;
          if (!moved) { moved = true; strip.classList.add("grabbing"); try { strip.setPointerCapture(pid); } catch (err) {} }
          strip.scrollTop = s0 - (ev.clientY - y0);
        }
        function end(ev) {
          if (ev.pointerId !== pid) return;
          document.removeEventListener("pointermove", mv);
          document.removeEventListener("pointerup", end);
          document.removeEventListener("pointercancel", end);
          strip.classList.remove("grabbing");
          try { strip.releasePointerCapture(pid); } catch (err) {}
          dragStop = null;
        }
        document.addEventListener("pointermove", mv);
        document.addEventListener("pointerup", end);
        document.addEventListener("pointercancel", end);
        dragStop = function () { end({ pointerId: pid }); };
      });
    }

    function load() {
      clearTimer(); removeFrame();
      if (mode === "scroller" || !opt.url) { showScroller(); return; }
      setStatus("loading");
      view.textContent = "";
      frame = el("iframe", { class: "emb-frame", title: opt.title || "Embedded site", loading: "lazy",
        referrerpolicy: "no-referrer-when-downgrade", allow: "camera; fullscreen", src: opt.url });
      var mine = frame;
      mine.onload = function () {
        if (destroyed || frame !== mine) return;
        // same-origin frames can be inspected; cross-origin loads are trusted (headers pre-checked at build time)
        if (sameOriginHttp(opt.url) && !frameRendered(mine)) { showScroller(); return; }
        clearTimer(); setStatus("live");
      };
      view.appendChild(frame);
      timer = setTimeout(function () { timer = null; if (!destroyed && status === "loading") showScroller(); }, timeoutMs);
    }

    function onMessage(e) {
      if (destroyed || !frame || e.source !== frame.contentWindow) return;
      var d = e.data;
      if (d && d.ax === "sim") AX.ui.toast(typeof d.text === "string" && d.text ? d.text : AX.ui.SIM_DEFAULT, { kind: "sim" });
    }
    w.addEventListener("message", onMessage);

    function destroy() {
      destroyed = true; clearTimer();
      w.removeEventListener("message", onMessage);
      if (dragStop) dragStop();
      removeFrame();
    }

    setDevice(device);
    load();
    AX.mount(host, destroy);
    return { setDevice: setDevice, reload: load, status: function () { return status; } };
  }

  AX.embed = { create: create, CAPTION: CAPTION };
})(window);
