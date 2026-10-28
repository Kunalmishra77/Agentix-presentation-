(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.data = AX.data || {};
  var F = AX.fake;

  /* Fictional members + plan list for QR onboarding at the gym door. */
  var members = [];
  var PLAN = ["Monthly", "Quarterly", "Half-yearly", "Yearly"];
  for (var i = 0; i < 12; i++) {
    var p = F.person("maxw-m-" + i);
    members.push({ id: "MF-" + (3100 + i), name: p.name, phone: p.phone, plan: PLAN[F.int("maxw-p-" + i, 0, 3)], expires: "2026-" + ("0" + F.int("maxw-e-" + i, 11, 12)).slice(-2) + "-" + ("0" + F.int("maxw-d-" + i, 1, 28)).slice(-2), visits: F.int("maxw-v-" + i, 8, 74) });
  }
  var plans = [
    { id: "m1", en: "Monthly", hi: "मासिक", price: 1500 },
    { id: "m3", en: "Quarterly", hi: "तिमाही", price: 3900 },
    { id: "m6", en: "Half-yearly", hi: "छमाही", price: 6500 },
    { id: "m12", en: "Yearly", hi: "वार्षिक", price: 10000 }
  ];
  AX.data["max-website"] = { members: members, plans: plans, hours: "5:30 AM - 10:00 PM" };
})(window);
