(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  var TABS = ["overview", "walkthrough", "how", "screens", "tech"];
  var subs = [], listening = false;

  function parse(hash) {
    var h = String(hash || "").replace(/^#/, "");
    var parts = h.split("/").filter(Boolean);
    if (parts[0] !== "demo" || !parts[1]) return { view: "home" };
    try {
      var tab = TABS.indexOf(parts[2]) >= 0 ? parts[2] : "overview";
      var mod = tab === "walkthrough" && parts[3] ? decodeURIComponent(parts[3]) : null;
      return { view: "demo", slug: decodeURIComponent(parts[1]), tab: tab, module: mod };
    } catch (e) {
      return { view: "home" };
    }
  }

  function current() { return parse(w.location.hash); }
  function fire() { var r = current(); subs.slice().forEach(function (fn) { fn(r); }); }

  function go(path, opts) {
    var target = path.charAt(0) === "#" ? path : "#" + path;
    if (opts && opts.replace) {
      w.location.replace(w.location.pathname + w.location.search + target);
    } else {
      w.location.hash = target;
    }
  }

  function start(onRoute) {
    subs.push(onRoute);
    if (!listening) { listening = true; w.addEventListener("hashchange", fire); }
    onRoute(current());
  }

  AX.router = { parse: parse, current: current, go: go, start: start, TABS: TABS };
})(window);
