(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.data = AX.data || {};
  var F = AX.fake;

  /* Fictional dataset: a hospital website - 12 invented doctors, UTM-tagged leads and CMS content blocks. */
  var SPECIALITIES = ["Cardiology", "Orthopaedics", "Gynaecology", "Paediatrics", "Neurology", "General Medicine"];
  var QUAL = { Cardiology: "MD, DM Cardiology", Orthopaedics: "MS Ortho, DNB", Gynaecology: "MD Obstetrics and Gynaecology", Paediatrics: "MD Paediatrics", Neurology: "MD, DM Neurology", "General Medicine": "MD Internal Medicine" };
  var DAYS = ["Mon, Wed, Fri", "Tue, Thu, Sat", "Mon to Sat", "Mon, Tue, Thu", "Wed, Fri, Sat"];
  var TIMES = ["10 AM - 1 PM", "11 AM - 2 PM", "4 PM - 7 PM", "9 AM - 12 PM"];

  var doctors = [];
  for (var i = 0; i < 12; i++) {
    var sp = SPECIALITIES[i % 6];
    doctors.push({ id: "D-" + (i + 1), name: "Dr. " + F.person("umang-dr-" + i).name, speciality: sp, qualification: QUAL[sp],
      experience: F.int("umang-exp-" + i, 6, 28), days: F.pick("umang-day-" + i, DAYS), time: F.pick("umang-time-" + i, TIMES),
      telemed: F.int("umang-tm-" + i, 0, 1) === 1, initials: "" });
    doctors[i].initials = doctors[i].name.replace("Dr. ", "").split(" ").map(function (x) { return x.charAt(0); }).join("");
  }

  var SOURCES = ["Google Ads", "Facebook Ads", "Organic search", "Direct", "WhatsApp", "Practo listing"];
  var CAMPAIGNS = ["cardiac-checkup-oct", "knee-replacement", "maternity-care", "winter-health-pack", "brand-search", "(none)"];
  var MEDIUMS = ["cpc", "paid-social", "organic", "none", "referral"];
  var STATUS = ["New", "Contacted", "Booked", "Visited", "Lost"];
  var leads = [];
  for (var l = 0; l < 30; l++) {
    var p = F.person("umang-lead-" + l), s = SOURCES[F.int("umang-s-" + l, 0, 5)];
    var camp = s === "Google Ads" ? CAMPAIGNS[F.int("umang-c-" + l, 0, 3)] : s === "Facebook Ads" ? CAMPAIGNS[F.int("umang-c2-" + l, 1, 3)] : s === "Organic search" ? "brand-search" : "(none)";
    leads.push({ id: "UL-" + (501 + l), name: p.name, phone: p.phone, email: p.email, concern: F.pick("umang-con-" + l, ["Chest pain checkup", "Knee pain", "Antenatal care", "Child fever", "Migraine", "Full body checkup", "Back pain"]),
      doctor: doctors[F.int("umang-ld-" + l, 0, 11)].name, source: s, utm_campaign: camp, utm_medium: s === "Google Ads" ? "cpc" : s === "Facebook Ads" ? "paid-social" : s === "Organic search" ? "organic" : "none",
      status: STATUS[F.int("umang-st-" + l, 0, 4)], date: "2026-10-" + ("0" + (1 + (l % 27))).slice(-2) });
  }

  var blocks = [
    { id: "B-1", page: "Home", block: "Hero headline", text: "Care you can trust, close to home.", status: "Published", updated: "24 Oct", editor: "Content team" },
    { id: "B-2", page: "Home", block: "Emergency number", text: "24x7 Emergency: 0124-000 0000", status: "Published", updated: "21 Oct", editor: "Admin" },
    { id: "B-3", page: "Cardiology", block: "Department intro", text: "Our cardiac team offers non-invasive diagnostics, angiography and rehabilitation.", status: "Published", updated: "18 Oct", editor: "Content team" },
    { id: "B-4", page: "Health checkups", block: "Winter pack offer", text: "Complete health checkup at a special winter price. Book before 30 November.", status: "Draft", updated: "26 Oct", editor: "Marketing" },
    { id: "B-5", page: "Insurance", block: "Cashless panel list", text: "Cashless treatment is available with major insurers and TPAs. Carry your health card.", status: "Published", updated: "11 Oct", editor: "Admin" },
    { id: "B-6", page: "Telemedicine", block: "How it works", text: "Pick a doctor, choose a slot and consult by video from home.", status: "Published", updated: "03 Oct", editor: "Content team" },
    { id: "B-7", page: "Maternity", block: "Package summary", text: "Normal and caesarean maternity packages with private rooms and lactation support.", status: "Draft", updated: "25 Oct", editor: "Marketing" },
    { id: "B-8", page: "Landing: Google Ads", block: "Form heading", text: "Book your cardiac checkup in 2 minutes", status: "Published", updated: "20 Oct", editor: "Marketing" },
    { id: "B-9", page: "Contact", block: "Visiting hours", text: "OPD: 9 AM to 7 PM. Visitors: 11 AM to 1 PM and 5 PM to 7 PM.", status: "Published", updated: "30 Sep", editor: "Admin" },
    { id: "B-10", page: "Health library", block: "Featured article", text: "Seven signs you should not ignore chest discomfort.", status: "Published", updated: "14 Oct", editor: "Content team" }
  ];

  blocks.forEach(function (b) { b.name = b.page + " — " + b.block; });
  AX.data["umang-website"] = { specialities: SPECIALITIES, doctors: doctors, leads: leads, sources: SOURCES, campaigns: CAMPAIGNS, mediums: MEDIUMS, statuses: STATUS, blocks: blocks };
})(window);
