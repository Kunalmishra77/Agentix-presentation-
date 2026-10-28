(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};

  AX.el = function (tag, attrs) {
    var n = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === "class") n.className = v;
      else if (k === "style" && typeof v === "object") Object.assign(n.style, v);
      else if (k === "on" && typeof v === "object") Object.keys(v).forEach(function (e) { n.addEventListener(e, v[e]); });
      else if (k === "html") n.innerHTML = v;
      else n.setAttribute(k, v === true ? "" : v);
    });
    (function add(list) {
      for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if (c == null || c === false) continue;
        if (Array.isArray(c)) add(c);
        else n.appendChild(typeof c === "object" ? c : document.createTextNode(String(c)));
      }
    })(Array.prototype.slice.call(arguments, 2));
    return n;
  };

  function group(n, indian) {
    var s = String(Math.abs(Math.round(n)));
    if (s.length <= 3) return s;
    if (!indian) return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + s.slice(-3);
  }
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function toDate(d) { return d instanceof Date ? d : new Date(d); }

  AX.fmt = {
    inr: function (n) { return (n < 0 ? "-" : "") + "₹" + group(n, true); },
    num: function (n) { return (n < 0 ? "-" : "") + group(n, false); },
    pct: function (n) { return (Math.round(n * 10) / 10).toFixed(1) + "%"; },
    date: function (d, style) {
      d = toDate(d);
      var s = d.getDate() + " " + MON[d.getMonth()];
      return style === "long" ? s + " " + d.getFullYear() : s;
    },
    time: function (d) {
      d = toDate(d);
      var h = d.getHours(), m = d.getMinutes();
      return (h % 12 || 12) + ":" + (m < 10 ? "0" : "") + m + " " + (h < 12 ? "AM" : "PM");
    }
  };

  var loaded = {};
  AX.load = function (src) {
    if (loaded[src]) return loaded[src];
    loaded[src] = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = function () { resolve(); };
      s.onerror = function () { delete loaded[src]; reject(new Error("Failed to load " + src)); };
      document.head.appendChild(s);
    });
    return loaded[src];
  };

  AX.state = function (initial) {
    var data = Object.assign({}, initial), subs = [];
    return {
      get: function () { return data; },
      set: function (patch) {
        data = Object.assign({}, data, patch);
        subs.slice().forEach(function (fn) { fn(data); });
      },
      on: function (fn) {
        subs.push(fn);
        return function () { var i = subs.indexOf(fn); if (i >= 0) subs.splice(i, 1); };
      }
    };
  };
})(window);
