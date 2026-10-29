(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  var el = AX.el;
  var escStack = [];
  var SIM_DEFAULT = "Simulated — nothing was sent or saved.";
  var STATUS = { live: "Live", active: "In development", proto: "Prototype", concept: "Concept" };

  /** Register an Esc-closable overlay; node (optional) lets stale entries be detected. */
  function pushEsc(fn, node) {
    var entry = { fn: fn, node: node || null };
    escStack.push(entry);
    return function () { var i = escStack.indexOf(entry); if (i >= 0) escStack.splice(i, 1); };
  }
  function prune() { escStack = escStack.filter(function (e) { return !e.node || e.node.isConnected; }); }
  /** Closes the top-most live overlay; returns true when something was closed. */
  function closeTop() { prune(); var e = escStack[escStack.length - 1]; if (!e) return false; e.fn(); return true; }
  function closeAll() { escStack.slice().reverse().forEach(function (e) { e.fn(); }); escStack = []; }

  function toast(text, opts) {
    var kind = (opts && opts.kind) || "ok";
    var host = document.getElementById("toasts") || document.body;
    var msg = text || (kind === "sim" ? SIM_DEFAULT : "");
    var t = el("div", { class: "toast toast-" + kind },
      el("span", { class: "toast-dot", "aria-hidden": "true" }), el("span", { class: "toast-text" }, msg));
    host.appendChild(t);
    requestAnimationFrame(function () { t.classList.add("in"); });
    setTimeout(function () {
      t.classList.remove("in");
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 260);
    }, 3200);
    return t;
  }

  function overlay(kind, o) {
    var prevFocus = document.activeElement, removeEsc, closed = false;
    var titleId = "ov-" + Math.random().toString(36).slice(2, 8);
    function close() {
      if (closed) return; closed = true;
      removeEsc();
      if (root.parentNode) root.parentNode.removeChild(root);
      if (prevFocus && prevFocus.focus) { try { prevFocus.focus(); } catch (e) {} }
    }
    var head = el("div", { class: "ov-head" }, el("h2", { id: titleId, class: "ov-title" }, o.title || ""),
      el("button", { class: "ov-x", type: "button", "aria-label": "Close", on: { click: close } }, "×"));
    var foot = null;
    if (o.actions && o.actions.length) {
      foot = el("div", { class: "ov-foot" });
      o.actions.forEach(function (a) {
        foot.appendChild(el("button", { type: "button", class: "btn" + (a.primary ? " btn-primary" : ""),
          on: { click: function () { if (a.onClick) a.onClick(); } } }, a.label));
      });
    }
    var panel = el("div", { class: "ov-panel ov-" + kind, role: "dialog", "aria-modal": "true", "aria-labelledby": titleId, tabindex: "-1" },
      head, el("div", { class: "ov-body" }, o.body), foot);
    var root = el("div", { class: "ov ov-root-" + kind }, el("div", { class: "ov-scrim", on: { click: close } }), panel);
    var shell = document.getElementById("shell");
    (shell && !shell.hidden ? shell : document.body).appendChild(root);
    requestAnimationFrame(function () { root.classList.add("in"); panel.focus(); });
    removeEsc = pushEsc(close, root);
    return { close: close, el: panel };
  }

  function statusChip(status) {
    var s = STATUS[status] ? status : "concept";
    return el("span", { class: "status-chip status-" + s }, STATUS[s]);
  }

  /* Brand images, all derived from the official Agentix logo (tools/make-brand-assets.py).
     Paths resolve against this script so fixtures in sub-folders load them too. */
  var BRAND = (function () {
    var cs = document.currentScript, src = cs && cs.src ? cs.src : "";
    var i = src.lastIndexOf("js/core/ui.js");
    return (i >= 0 ? src.slice(0, i) : "") + "assets/brand/";
  })();
  var BRAND_SIZE = { "agentix-mark": [128, 128], "agentix-logo": [480, 201], "agentix-wordmark": [381, 64], "agentix-wordmark-light": [381, 64] };
  function brandImg(name, cls) {
    var sz = BRAND_SIZE[name] || [];
    return el("img", { class: "ax-brand-img " + (cls || ""), src: BRAND + name + ".png", srcset: BRAND + name + ".png 1x, " + BRAND + name + "@2x.png 2x",
      width: sz[0], height: sz[1], alt: "AI Agentix", loading: "lazy", decoding: "async", draggable: "false" });
  }
  /** The original brain mark. */
  function mark(cls) { return el("span", { class: "ax-mark " + (cls || "") }, brandImg("agentix-mark")); }
  /** The original AGENTiX wordmark; {light:true} for navy backgrounds. */
  function wordmark(o) {
    o = o || {};
    return brandImg(o.light ? "agentix-wordmark-light" : "agentix-wordmark", "ax-wordmark " + (o.cls || ""));
  }
  /** The full stacked logo (mark above wordmark). */
  function logo(cls) { return brandImg("agentix-logo", "ax-logo " + (cls || "")); }

  function agentixBadge(o) {
    var size = (o && o.size) === "sm" ? "sm" : "md";
    return el("span", { class: "agentix-badge agentix-badge-" + size }, mark(), el("span", { class: "agentix-badge-text" }, "Built by AGENTiX"));
  }

  AX.ui = {
    toast: toast, statusChip: statusChip, agentixBadge: agentixBadge, mark: mark, wordmark: wordmark, logo: logo, BRAND: BRAND,
    drawer: function (o) { return overlay("drawer", o); },
    modal: function (o) { return overlay("modal", o); },
    pushEsc: pushEsc, closeTop: closeTop, closeAll: closeAll, STATUS: STATUS, SIM_DEFAULT: SIM_DEFAULT
  };
})(window);
