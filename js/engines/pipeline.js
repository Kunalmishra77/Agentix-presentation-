(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};

  function clone(s) {
    return {
      stages: s.stages.map(function (x) { return Object.assign({}, x); }),
      cost: s.cost || 0, cap: s.cap, log: (s.log || []).slice(), gates: (s.gates || []).slice()
    };
  }
  function find(s, status) { for (var i = 0; i < s.stages.length; i++) if (s.stages[i].status === status) return s.stages[i]; return null; }
  function byId(s, id) { for (var i = 0; i < s.stages.length; i++) if (s.stages[i].id === id) return s.stages[i]; return null; }
  function gateAt(s, id) { return s.gates.indexOf(id) >= 0; }

  /** Pure. tick | gate{stageId} | approve | cost{amount}. */
  function reduce(state, ev) {
    var s = clone(state), st;
    if (ev.type === "tick") {
      if (find(s, "blocked")) return s;
      st = find(s, "running");
      if (st) { st.status = "done"; s.log.push(st.id + " done"); return s; }
      st = find(s, "waiting");
      if (!st) return s;
      if (gateAt(s, st.id)) { st.status = "blocked"; st.reason = "gate"; s.log.push("Waiting for approval: " + st.id); }
      else { st.status = "running"; delete st.reason; s.log.push(st.id + " started"); }
    } else if (ev.type === "gate") {
      if (!gateAt(s, ev.stageId)) s.gates.push(ev.stageId);
      st = byId(s, ev.stageId);
      if (st && st.status === "running") { st.status = "blocked"; st.reason = "gate"; s.log.push("Waiting for approval: " + st.id); }
    } else if (ev.type === "approve") {
      st = find(s, "blocked");
      if (!st) return s;
      s.gates = s.gates.filter(function (g) { return g !== st.id; });
      if (st.reason === "cost") { s.cap = Math.max(s.cap || 0, s.cost) * 2; s.log.push("Cost ceiling raised by approver"); }
      st.status = "running"; delete st.reason;
      s.log.push("Approved: " + st.id);
    } else if (ev.type === "cost") {
      s.cost = Math.round((s.cost + (ev.amount || 0)) * 1e6) / 1e6;
      st = find(s, "running");
      if (st && s.cap != null && s.cost > s.cap) { st.status = "blocked"; st.reason = "cost"; s.log.push("Cost ceiling reached"); }
    }
    return s;
  }

  function money(cur, n) { return cur + n.toFixed(2); }
  function capText(cur, n) { return cur + String(+Number(n).toFixed(2)); }

  function create(host, opt) {
    var el = AX.el, cur = opt.currency || "$";
    var meta = {};
    var stages = opt.stages || [];
    stages.forEach(function (s) { meta[s.id] = s; });
    var timers = [], state, uiLog, destroyed = false, running = false, emitted = {}, endTimer = null;

    function initial() {
      var s = { stages: stages.map(function (x) { return { id: x.id, status: "waiting" }; }), cost: 0, cap: opt.cap == null ? null : opt.cap, log: [], gates: [] };
      if (opt.gate) s = reduce(s, { type: "gate", stageId: opt.gate });
      s.log = [];
      return s;
    }
    function later(fn, ms) { var t = setTimeout(function () { var i = timers.indexOf(t); if (i >= 0) timers.splice(i, 1); fn(); }, ms); timers.push(t); return t; }
    function clearTimers() { timers.forEach(clearTimeout); timers = []; }

    var root = el("div", { class: "pl" });
    host.textContent = "";
    host.appendChild(root);

    function dispatch(ev) {
      var before = state.log.length;
      state = reduce(state, ev);
      for (var i = before; i < state.log.length; i++) addLog(state.log[i]);
    }
    function addLog(text) {
      if (!uiLog) return;
      uiLog.appendChild(el("li", {}, text));
      uiLog.scrollTop = uiLog.scrollHeight;
    }

    function draw() {
      root.textContent = "";
      var cost = el("div", { class: "pl-cost", "aria-live": "polite" }, "Cost ", el("strong", {}, money(cur, state.cost) + " / " + (state.cap == null ? "—" : capText(cur, state.cap))));
      var head = el("div", { class: "pl-head" }, cost,
        el("div", { class: "pl-actions" },
          state.stages.some(function (x) { return x.status !== "waiting"; }) ? null : el("button", { type: "button", class: "btn btn-primary", on: { click: start } }, "Start"),
          el("button", { type: "button", class: "btn", on: { click: reset } }, "Reset")));
      var list = el("ol", { class: "pl-stages" }, state.stages.map(function (x) {
        var m = meta[x.id];
        var appr = x.status === "blocked"
          ? el("button", { type: "button", class: "btn btn-primary pl-approve", on: { click: approve } }, "Approve") : null;
        return el("li", { class: "pl-stage st-" + x.status, "data-id": x.id },
          el("span", { class: "pl-dot", "aria-hidden": "true" }),
          el("div", { class: "pl-body" },
            el("div", { class: "pl-label" }, m.label),
            el("div", { class: "pl-state" }, x.status === "blocked" ? (x.reason === "cost" ? "Blocked — cost ceiling reached" : "Waiting for approval") : x.status),
            el("div", { class: "pl-bar" }, el("i", { style: x.status === "running" ? { transitionDuration: (m.ms || 0) + "ms" } : {} }))),
          appr);
      }));
      uiLog = el("ul", { class: "pl-log", "aria-label": "Pipeline log" }, state.log.map(function (t) { return el("li", {}, t); }));
      root.appendChild(head); root.appendChild(list); root.appendChild(uiLog);
      uiLog.scrollTop = uiLog.scrollHeight;
      // trigger progress bar fill after paint
      var bars = root.querySelectorAll(".st-running .pl-bar i");
      if (bars.length) requestAnimationFrame(function () { requestAnimationFrame(function () { for (var i = 0; i < bars.length; i++) bars[i].classList.add("go"); }); });
    }

    function step() {
      if (destroyed) return;
      var run = find(state, "running");
      if (run) {
        var m = meta[run.id];
        var ms = m.ms || 0;
        if (!emitted[run.id]) {
          emitted[run.id] = true;
          if (m.cost) later(function () {
            var was = find(state, "running");
            dispatch({ type: "cost", amount: m.cost });
            if (was && !find(state, "running")) { running = false; draw(); return; }
            var strong = root.querySelector(".pl-cost strong");
            if (strong) strong.textContent = money(cur, state.cost) + " / " + (state.cap == null ? "—" : capText(cur, state.cap));
          }, ms / 2);
          (m.log || []).forEach(function (line, i) { later(function () { addLog(line); state.log.push(line); }, ms * (i + 1) / (m.log.length + 1)); });
        }
        endTimer = later(function () {
          endTimer = null;
          if (find(state, "running") !== null && find(state, "running").id === run.id) { dispatch({ type: "tick" }); draw(); step(); }
        }, ms);
        return;
      }
      if (find(state, "blocked")) { running = false; draw(); return; }
      if (find(state, "waiting")) { dispatch({ type: "tick" }); draw(); if (find(state, "blocked")) { running = false; draw(); return; } step(); return; }
      running = false; draw();
    }
    function start() {
      if (destroyed || running) return;
      if (!find(state, "waiting") && !find(state, "running")) return;
      running = true; clearTimers(); draw(); step();
    }
    function approve() {
      if (destroyed || !find(state, "blocked")) return;
      if (endTimer) { clearTimeout(endTimer); var k = timers.indexOf(endTimer); if (k >= 0) timers.splice(k, 1); endTimer = null; }
      dispatch({ type: "approve" }); running = true; draw(); step();
    }
    function reset() {
      clearTimers(); running = false; emitted = {}; state = initial(); draw();
    }
    function destroy() { destroyed = true; clearTimers(); }

    state = initial();
    draw();
    AX.mount(host, destroy);
    return { start: start, approve: approve, reset: reset, state: function () { return state; } };
  }

  AX.pipeline = { reduce: reduce, create: create };
})(window);
