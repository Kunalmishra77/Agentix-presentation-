(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  var DAY = 86400000;
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // ---- pure date helpers (all UTC, ISO "YYYY-MM-DD") ----
  function parse(iso) { var p = String(iso).split("-"); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iso(ms) { var d = new Date(ms); return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()); }
  function addDays(s, n) { return iso(parse(s) + n * DAY); }
  function diffDays(a, b) { return Math.round((parse(b) - parse(a)) / DAY); }

  /** Pure. Bookings occupy [start, start+nights); check-out day is free. A candidate's own id is ignored. */
  function overlaps(bookings, c) {
    var cs = parse(c.start), ce = cs + c.nights * DAY;
    return (bookings || []).some(function (b) {
      if (b.unit !== c.unit) return false;
      if (c.id != null && b.id === c.id) return false;
      var bs = parse(b.start), be = bs + b.nights * DAY;
      return cs < be && bs < ce;
    });
  }

  // ---- pointer tracking: 6px threshold, touch needs a 200ms long-press ----
  var THRESHOLD = 6, LONG_PRESS = 200;
  function track(e, node, h) {
    if (e.button != null && e.button !== 0) return null;
    var touch = e.pointerType === "touch";
    var d = { x: e.clientX, y: e.clientY, pid: e.pointerId, active: false, ready: !touch, timer: null };
    if (touch) d.timer = setTimeout(function () { d.ready = true; }, LONG_PRESS);
    function stop() {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointercancel", cancel);
      document.removeEventListener("touchmove", tm, { passive: false });
      if (d.timer) clearTimeout(d.timer);
      try { node.releasePointerCapture(d.pid); } catch (err) {}
    }
    function move(ev) {
      if (ev.pointerId !== d.pid) return;
      var dx = ev.clientX - d.x, dy = ev.clientY - d.y;
      if (!d.active) {
        if (Math.sqrt(dx * dx + dy * dy) < THRESHOLD) return;
        if (!d.ready) { stop(); if (h.onCancel) h.onCancel(false); return; }
        d.active = true;
        try { node.setPointerCapture(d.pid); } catch (err) {}
        if (h.onStart) h.onStart(ev);
      }
      if (ev.cancelable) ev.preventDefault();
      h.onMove(ev, dx, dy);
    }
    function up(ev) { if (ev.pointerId !== d.pid) return; stop(); h.onEnd(ev, d.active); }
    function cancel(ev) { if (ev.pointerId !== d.pid) return; stop(); if (h.onCancel) h.onCancel(d.active); }
    function tm(ev) { if (d.active && ev.cancelable) ev.preventDefault(); }
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
    document.addEventListener("pointercancel", cancel);
    document.addEventListener("touchmove", tm, { passive: false });
    return stop;
  }

  // ---- month view ----
  function month(host, opt) {
    var el = AX.el;
    var ym = String(opt.month).split("-"), year = +ym[0], mon = +ym[1] - 1;
    var events = (opt.events || []).map(function (e) { return Object.assign({}, e); });
    var root = el("div", { class: "cal" });
    var stopDrag = null;
    host.textContent = "";
    host.appendChild(root);

    function byId(id) { return events.filter(function (e) { return e.id === id; })[0]; }
    function refocus(id) {
      var all = root.querySelectorAll(".cal-ev");
      for (var i = 0; i < all.length; i++) if (all[i].getAttribute("data-id") === String(id)) { all[i].focus(); return; }
    }
    function dayAt(x, y) {
      var n = document.elementFromPoint(x, y);
      while (n && !(n.classList && n.classList.contains("cal-day"))) n = n.parentNode;
      return n && n.classList ? n : null;
    }
    function drop(id, date) {
      var ev = byId(id);
      if (!ev || ev.date === date) return;
      ev.date = date;
      draw();
      refocus(id);
      if (opt.onDrop) opt.onDrop(id, date);
    }
    function onDown(e, node, ev) {
      if (stopDrag) { stopDrag(); stopDrag = null; }
      var ghost = null, over = null, ox = 0, oy = 0;
      function clear() {
        if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost);
        if (over) over.classList.remove("drop");
        node.classList.remove("dragging");
        ghost = over = null;
      }
      stopDrag = track(e, node, {
        onStart: function () {
          var r = node.getBoundingClientRect();
          ox = e.clientX - r.left; oy = e.clientY - r.top;
          ghost = node.cloneNode(true);
          ghost.removeAttribute("data-id");
          ghost.classList.add("cal-ghost");
          ghost.style.width = r.width + "px";
          document.body.appendChild(ghost);
          node.classList.add("dragging");
        },
        onMove: function (p) {
          ghost.style.left = (p.clientX - ox) + "px"; ghost.style.top = (p.clientY - oy) + "px";
          var d = dayAt(p.clientX, p.clientY);
          if (d !== over) { if (over) over.classList.remove("drop"); if (d) d.classList.add("drop"); over = d; }
        },
        onEnd: function (p, active) {
          var target = over; clear(); stopDrag = null;
          if (active) { if (target) drop(ev.id, target.getAttribute("data-date")); }
          else if (opt.onOpen) opt.onOpen(ev);
        },
        onCancel: function () { clear(); stopDrag = null; }
      });
    }

    function draw() {
      if (stopDrag) { stopDrag(); stopDrag = null; }
      root.textContent = "";
      var first = Date.UTC(year, mon, 1);
      var lead = (new Date(first).getUTCDay() + 6) % 7;
      var count = new Date(Date.UTC(year, mon + 1, 0)).getUTCDate();
      var weeks = Math.ceil((lead + count) / 7);
      var cells = [];
      for (var i = 0; i < weeks * 7; i++) {
        var date = iso(first + (i - lead) * DAY);
        var inMonth = i >= lead && i < lead + count;
        var evs = events.filter(function (e) { return e.date === date; });
        cells.push(el("div", { class: "cal-day" + (inMonth ? "" : " out"), "data-date": date },
          el("span", { class: "cal-num" }, String(+date.slice(8))),
          evs.map(function (e) {
            var node = el("div", { class: "cal-ev tone-" + (e.tone || "navy"), tabindex: "0", "data-id": e.id,
              "aria-label": e.title + ", " + date + ". Press Enter to open.",
              on: {
                pointerdown: function (p) { onDown(p, node, e); },
                keydown: function (k) { if (k.key === "Enter" && opt.onOpen) opt.onOpen(e); }
              } }, e.title);
            return node;
          })));
      }
      root.appendChild(el("div", { class: "cal-head" },
        el("button", { type: "button", class: "btn", "aria-label": "Previous month", on: { click: function () { mon--; if (mon < 0) { mon = 11; year--; } draw(); } } }, "‹"),
        el("h3", { class: "cal-title" }, MONTHS[mon] + " " + year),
        el("button", { type: "button", class: "btn", "aria-label": "Next month", on: { click: function () { mon++; if (mon > 11) { mon = 0; year++; } draw(); } } }, "›")));
      root.appendChild(el("div", { class: "cal-grid" },
        DOW.map(function (d) { return el("div", { class: "cal-dow" }, d); }), cells));
    }
    draw();
    AX.mount(host, function () { if (stopDrag) stopDrag(); stopDrag = null; });
    return { setEvents: function (next) { events = (next || []).map(function (e) { return Object.assign({}, e); }); draw(); } };
  }

  // ---- tape chart ----
  function tape(host, opt) {
    var el = AX.el;
    var days = opt.days || 14, start = opt.start;
    var units = opt.units || [];
    var bookings = (opt.bookings || []).map(function (b) { return Object.assign({}, b); });
    var root = el("div", { class: "tp-wrap" });
    var stopDrag = null;
    host.textContent = "";
    host.appendChild(root);

    function byId(id) { return bookings.filter(function (b) { return b.id === id; })[0]; }
    function refocus(id) {
      var all = root.querySelectorAll(".tp-bar");
      for (var i = 0; i < all.length; i++) if (all[i].getAttribute("data-id") === String(id)) { all[i].focus(); return; }
    }
    function commit(b, cand) {
      if (cand.unit === b.unit && cand.start === b.start && cand.nights === b.nights) { draw(); refocus(b.id); return; }
      if (overlaps(bookings, cand)) {
        AX.ui.toast("That room is already booked for those nights", { kind: "err" });
        draw(); refocus(b.id); return;
      }
      var next = Object.assign({}, b, { unit: cand.unit, start: cand.start, nights: cand.nights });
      bookings = bookings.map(function (x) { return x.id === b.id ? next : x; });
      draw(); refocus(b.id);
      if (opt.onChange) opt.onChange(Object.assign({}, next));
    }
    function rowAt(y, fallback) {
      var rows = root.querySelectorAll(".tp-row");
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i].getBoundingClientRect();
        if (y >= r.top && y < r.bottom) return rows[i].getAttribute("data-unit");
      }
      return fallback;
    }

    function onDown(e, bar, b, resize) {
      if (stopDrag) { stopDrag(); stopDrag = null; }
      var cellsEl = bar.parentNode;
      var rect0 = cellsEl.getBoundingClientRect();
      var cell = rect0.width / days;
      var startIdx = diffDays(start, b.start);
      var grabDay = Math.floor((e.clientX - rect0.left) / cell) - startIdx;
      var cand = { id: b.id, unit: b.unit, start: b.start, nights: b.nights };
      var overRow = null;
      function clear() {
        bar.classList.remove("dragging");
        bar.style.transform = ""; bar.style.zIndex = "";
        if (overRow) overRow.classList.remove("drop");
        overRow = null;
      }
      stopDrag = track(e, bar, {
        onStart: function () { bar.classList.add("dragging"); },
        onMove: function (p, dx, dy) {
          if (resize) {
            var n = Math.max(1, b.nights + Math.round(dx / cell));
            cand.nights = n;
            bar.style.width = "calc(" + (n / days * 100) + "% - 4px)";
            return;
          }
          var idx = Math.floor((p.clientX - rect0.left) / cell) - grabDay;
          cand.start = addDays(start, idx);
          cand.unit = rowAt(p.clientY, b.unit);
          bar.style.transform = "translate(" + dx + "px," + dy + "px)";
          var rowEl = root.querySelector('.tp-row[data-unit="' + cand.unit + '"]');
          if (rowEl !== overRow) { if (overRow) overRow.classList.remove("drop"); if (rowEl) rowEl.classList.add("drop"); overRow = rowEl; }
        },
        onEnd: function (p, active) {
          stopDrag = null; clear();
          if (active) commit(b, cand);
          else if (!resize && opt.onOpen) opt.onOpen(Object.assign({}, b));
        },
        onCancel: function () { stopDrag = null; clear(); draw(); }
      });
    }

    function statusLabel(s) { return s === "checked-in" ? "Checked in" : s === "checked-out" ? "Checked out" : s === "hold" ? "Hold" : "Confirmed"; }

    function draw() {
      if (stopDrag) { stopDrag(); stopDrag = null; }
      root.textContent = "";
      var head = [el("div", { class: "tp-label tp-corner" }, "Unit")];
      var dayCells = [];
      for (var i = 0; i < days; i++) {
        var d = addDays(start, i);
        var dt = new Date(parse(d));
        dayCells.push(el("div", { class: "tp-day" + ((dt.getUTCDay() === 0 || dt.getUTCDay() === 6) ? " wknd" : "") },
          el("span", { class: "tp-dow" }, DOW[(dt.getUTCDay() + 6) % 7]), el("span", { class: "tp-dnum" }, String(dt.getUTCDate()))));
      }
      head.push(el("div", { class: "tp-cells tp-days" }, dayCells));
      var rows = [el("div", { class: "tp-row tp-headrow" }, head)];

      var groups = [], seen = {};
      units.forEach(function (u) { if (!seen[u.group]) { seen[u.group] = []; groups.push(u.group); } seen[u.group].push(u); });
      groups.forEach(function (g) {
        rows.push(el("div", { class: "tp-group" }, g || ""));
        seen[g].forEach(function (u) {
          var bars = bookings.filter(function (b) { return b.unit === u.id; }).map(function (b) {
            var s = diffDays(start, b.start), e = s + b.nights;
            if (e <= 0 || s >= days) return null;
            var vs = Math.max(0, s), ve = Math.min(days, e);
            var label = b.guest + " · " + b.nights + (b.nights === 1 ? " night" : " nights");
            var bar = el("div", { class: "tp-bar st-" + b.status, tabindex: "0", "data-id": b.id, role: "button",
              "aria-label": label + ", " + statusLabel(b.status) + ", unit " + u.label + ", from " + b.start + ". Enter to open, arrows move, Shift plus arrows resize.",
              style: { left: "calc(" + (vs / days * 100) + "% + 2px)", width: "calc(" + ((ve - vs) / days * 100) + "% - 4px)" },
              on: {
                pointerdown: function (p) {
                  if (p.target.classList && p.target.classList.contains("tp-handle")) onDown(p, bar, b, true);
                  else onDown(p, bar, b, false);
                },
                keydown: function (k) {
                  if (k.target !== bar) return;
                  if (k.key === "Enter") { if (opt.onOpen) opt.onOpen(Object.assign({}, b)); return; }
                  var dir = k.key === "ArrowRight" ? 1 : k.key === "ArrowLeft" ? -1 : 0;
                  if (!dir) return;
                  k.preventDefault();
                  if (k.shiftKey) commit(b, { id: b.id, unit: b.unit, start: b.start, nights: Math.max(1, b.nights + dir) });
                  else commit(b, { id: b.id, unit: b.unit, start: addDays(b.start, dir), nights: b.nights });
                }
              } },
              el("span", { class: "tp-bar-text" }, label),
              e <= days ? el("span", { class: "tp-handle", "aria-hidden": "true" }) : null);
            return bar;
          });
          var cells = el("div", { class: "tp-cells" }, bars);
          rows.push(el("div", { class: "tp-row", "data-unit": u.id },
            el("div", { class: "tp-label" }, u.label), cells));
        });
      });
      root.appendChild(el("div", { class: "tp", style: { "--tp-days": String(days) } }, el("div", { class: "tp-grid" }, rows)));
      root.appendChild(el("div", { class: "tp-legend" }, ["confirmed", "checked-in", "hold", "checked-out"].map(function (s) {
        return el("span", { class: "tp-key st-" + s }, statusLabel(s));
      })));
    }
    draw();
    AX.mount(host, function () { if (stopDrag) stopDrag(); stopDrag = null; });
    return {
      bookings: function () { return bookings.map(function (b) { return Object.assign({}, b); }); },
      setBookings: function (next) { bookings = (next || []).map(function (b) { return Object.assign({}, b); }); draw(); }
    };
  }

  AX.calendar = { overlaps: overlaps, addDays: addDays, diffDays: diffDays, month: month, tape: tape };
})(window);
