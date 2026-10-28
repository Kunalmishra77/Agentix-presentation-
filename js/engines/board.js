(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};

  /** Pure, immutable. */
  function moveCard(cards, id, toCol) {
    return cards.map(function (c) { return c.id === id ? Object.assign({}, c, { col: toCol }) : c; });
  }

  var THRESHOLD = 6;

  function create(host, opt) {
    var el = AX.el;
    var cols = opt.columns || [];
    var cards = (opt.cards || []).slice();
    var root = el("div", { class: "bd" });
    host.textContent = "";
    host.appendChild(root);
    var drag = null, menu = null;

    function byId(id) { return cards.filter(function (c) { return c.id === id; })[0]; }

    function doMove(id, col) {
      var cur = byId(id);
      if (!cur || String(cur.col) === String(col)) return;
      cards = moveCard(cards, id, col);
      draw();
      if (opt.onMove) opt.onMove(byId(id), col);
    }

    function closeMenu() { if (menu && menu.parentNode) menu.parentNode.removeChild(menu); menu = null; }

    function refocus(id) {
      var all = root.querySelectorAll(".bd-card");
      for (var i = 0; i < all.length; i++) if (all[i].getAttribute("data-id") === String(id)) { all[i].focus(); return; }
    }

    function openMenu(cardEl, card) {
      closeMenu();
      menu = el("div", { class: "bd-menu", role: "menu", "aria-label": "Move to" },
        cols.filter(function (c) { return String(c.id) !== String(card.col); }).map(function (c) {
          return el("button", { type: "button", role: "menuitem", class: "bd-menu-item", on: { click: function (e) {
            e.stopPropagation(); closeMenu(); doMove(card.id, c.id); refocus(card.id);
          } } }, c.label);
        }));
      menu.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { e.stopPropagation(); closeMenu(); cardEl.focus(); }
      });
      cardEl.appendChild(menu);
      var first = menu.querySelector("button"); if (first) first.focus();
    }

    function colAt(x, y) {
      var n = document.elementFromPoint(x, y);
      while (n && !(n.classList && n.classList.contains("bd-col"))) n = n.parentNode;
      return n && n.classList ? n : null;
    }

    var LONG_PRESS = 200;
    function cleanupDrag(d) {
      document.removeEventListener("pointermove", onMoveP);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onCancel);
      document.removeEventListener("touchmove", onTouchMove, { passive: false });
      if (d.timer) clearTimeout(d.timer);
      try { d.el.releasePointerCapture(d.pid); } catch (err) {}
      if (d.ghost && d.ghost.parentNode) d.ghost.parentNode.removeChild(d.ghost);
      if (d.over) d.over.classList.remove("drop");
      d.el.classList.remove("dragging");
    }
    function cancelDrag() { if (!drag) return; var d = drag; drag = null; cleanupDrag(d); }

    function onTouchMove(e) { if (drag && drag.active && e.cancelable) e.preventDefault(); }

    function onDown(e, cardEl, card) {
      if (e.button != null && e.button !== 0) return;
      if (e.target.closest && e.target.closest("button,a,input,select,textarea,.bd-menu")) return;
      closeMenu();
      cancelDrag();
      var touch = e.pointerType === "touch";
      drag = { id: card.id, el: cardEl, x: e.clientX, y: e.clientY, pid: e.pointerId, active: false, ghost: null, over: null, touch: touch, ready: !touch, timer: null };
      if (touch) { var d0 = drag; d0.timer = setTimeout(function () { d0.ready = true; }, LONG_PRESS); }
      document.addEventListener("pointermove", onMoveP);
      document.addEventListener("pointerup", onUp);
      document.addEventListener("pointercancel", onCancel);
      document.addEventListener("touchmove", onTouchMove, { passive: false });
    }
    function onMoveP(e) {
      if (!drag || e.pointerId !== drag.pid) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.active) {
        if (Math.sqrt(dx * dx + dy * dy) < THRESHOLD) return;
        if (!drag.ready) { cancelDrag(); return; } // touch moved before long-press: let the page scroll
        drag.active = true;
        try { drag.el.setPointerCapture(drag.pid); } catch (err) {}
        var r = drag.el.getBoundingClientRect();
        drag.ox = drag.x - r.left; drag.oy = drag.y - r.top;
        drag.ghost = drag.el.cloneNode(true);
        drag.ghost.removeAttribute("data-id");
        drag.ghost.classList.add("bd-ghost");
        drag.ghost.style.width = r.width + "px";
        document.body.appendChild(drag.ghost);
        drag.el.classList.add("dragging");
      }
      if (e.cancelable) e.preventDefault();
      drag.ghost.style.left = (e.clientX - drag.ox) + "px";
      drag.ghost.style.top = (e.clientY - drag.oy) + "px";
      var over = colAt(e.clientX, e.clientY);
      if (over !== drag.over) {
        if (drag.over) drag.over.classList.remove("drop");
        if (over) over.classList.add("drop");
        drag.over = over;
      }
    }
    function onCancel(e) { if (drag && e.pointerId === drag.pid) cancelDrag(); }
    function onUp(e) {
      if (!drag || e.pointerId !== drag.pid) return;
      var d = drag; drag = null;
      var over = d.over;
      cleanupDrag(d);
      if (d.active) {
        if (over) doMove(d.id, over.getAttribute("data-col"));
      } else if (opt.onOpen) {
        var c = byId(d.id); if (c) opt.onOpen(c);
      }
    }

    function defaultCard(card) {
      return [
        el("div", { class: "bd-title" }, card.title),
        card.sub ? el("div", { class: "bd-sub" }, card.sub) : null,
        card.tags && card.tags.length ? el("div", { class: "bd-tags" }, card.tags.map(function (t) { return el("span", { class: "bd-tag" }, t); })) : null,
        card.meta != null ? el("div", { class: "bd-meta" }, card.meta) : null
      ];
    }

    function draw() {
      cancelDrag();
      closeMenu();
      root.textContent = "";
      cols.forEach(function (col) {
        var list = cards.filter(function (c) { return String(c.col) === String(col.id); });
        var body = el("div", { class: "bd-body" }, list.map(function (card) {
          var cardEl = el("div", { class: "bd-card", tabindex: "0", "data-id": card.id,
            "aria-label": card.title + ". Press Enter to open, M to move.",
            on: {
              pointerdown: function (e) { onDown(e, cardEl, card); },
              keydown: function (e) {
                if (e.target !== cardEl) return;
                if (e.key === "Enter") { if (opt.onOpen) opt.onOpen(card); }
                else if (e.key === "m" || e.key === "M") { e.preventDefault(); openMenu(cardEl, card); }
              }
            } });
          var inner = opt.renderCard ? opt.renderCard(card) : defaultCard(card);
          [].concat(inner).forEach(function (n) { if (n != null && n !== false) cardEl.appendChild(typeof n === "object" ? n : document.createTextNode(String(n))); });
          return cardEl;
        }));
        root.appendChild(el("section", { class: "bd-col" + (col.tone ? " tone-" + col.tone : ""), "data-col": col.id, "aria-label": col.label },
          el("header", { class: "bd-head" },
            el("span", { class: "bd-label" }, col.label),
            el("span", { class: "bd-count" }, String(list.length))),
          body));
      });
    }

    draw();
    return {
      move: function (id, col) { doMove(id, col); },
      setCards: function (next) { cards = (next || []).slice(); draw(); }
    };
  }

  AX.board = { moveCard: moveCard, create: create };
})(window);
