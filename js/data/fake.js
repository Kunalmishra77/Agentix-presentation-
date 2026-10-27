(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  var FIRST = ["Aarav", "Vivaan", "Ananya", "Diya", "Kabir", "Ishaan", "Meera", "Riya", "Arjun", "Saanvi", "Rohan", "Kavya", "Aditya", "Nisha", "Karan", "Pooja", "Sahil", "Tanya", "Manav", "Isha", "Neel", "Anika", "Dev", "Simran"];
  var LAST = ["Sharma", "Verma", "Gupta", "Mehta", "Iyer", "Nair", "Kapoor", "Malhotra", "Reddy", "Bansal", "Chauhan", "Joshi", "Khanna", "Bhatia", "Menon", "Saxena", "Arora", "Das", "Rao", "Sethi"];
  var CITIES = ["Delhi", "Gurugram", "Noida", "Mumbai", "Pune", "Bengaluru", "Hyderabad", "Jaipur", "Lucknow", "Chandigarh", "Kolkata", "Ahmedabad"];

  function rng(seed) {
    var a = (Number(seed) || 0) + 0x6D2B79F5;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash(s) {
    var h = 2166136261;
    s = String(s);
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function seedOf(s) { return typeof s === "number" ? s : hash(s); }

  var fake = AX.fake = {};
  fake.pick = function (seed, arr) { return arr[Math.floor(rng(seedOf(seed))() * arr.length)]; };
  fake.int = function (seed, min, max) { return min + Math.floor(rng(seedOf(seed))() * (max - min + 1)); };
  fake.series = function (seed, n, min, max) {
    var r = rng(seedOf(seed)), out = [], v = (min + max) / 2;
    for (var i = 0; i < n; i++) {
      v += (r() - 0.45) * (max - min) * 0.25;
      v = Math.max(min, Math.min(max, v));
      out.push(Math.round(v));
    }
    return out;
  };
  fake.person = function (seed) {
    var r = rng(seedOf(seed));
    var f = FIRST[Math.floor(r() * FIRST.length)], l = LAST[Math.floor(r() * LAST.length)];
    var tail = ("0000" + Math.floor(r() * 10000)).slice(-4);
    return {
      name: f + " " + l,
      phone: "+91 98xxx x" + tail,
      email: (f + "." + l).toLowerCase() + "@example.in",
      city: CITIES[Math.floor(r() * CITIES.length)]
    };
  };
})(window);
