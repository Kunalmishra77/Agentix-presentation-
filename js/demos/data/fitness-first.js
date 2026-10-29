(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.data = AX.data || {};
  var F = AX.fake;

  /* Fictional content for a premium Dwarka gym site: programs, trainers (invented) and membership plans with offer prices. */
  var programs = [
    { id: "pump", name: "Barbell Strength", blurb: "Barbell strength workout for all-round toning.", mins: 60, level: "All levels" },
    { id: "combat", name: "Combat Cardio", blurb: "Martial-arts inspired cardio, punches and kicks.", mins: 55, level: "Intermediate" },
    { id: "rpm", name: "Indoor Cycling", blurb: "Indoor cycling, rhythm-led hills and sprints.", mins: 45, level: "All levels" },
    { id: "grit", name: "HIIT 30", blurb: "High-intensity interval training in 30 minutes.", mins: 30, level: "Advanced" },
    { id: "shbam", name: "Dance Cardio", blurb: "Dance cardio that feels like a party.", mins: 45, level: "Beginner" },
    { id: "balance", name: "Stretch and Balance", blurb: "Yoga, tai chi and pilates for flexibility.", mins: 60, level: "All levels" }
  ];
  var trainers = [];
  var SPEC = ["Strength and conditioning", "Weight loss coaching", "Group class instructor", "Rehab and mobility"];
  for (var i = 0; i < 4; i++) {
    var n = F.person("ff-trainer-" + i).name;
    trainers.push({ id: "tr" + i, name: n, speciality: SPEC[i], years: F.int("ff-ty-" + i, 4, 12), initials: n.split(" ").map(function (x) { return x.charAt(0); }).join("") });
  }
  var plans = [
    { id: "mom", label: "Month on month", months: 1, base: 3500, offer: 2999, perks: ["Gym floor access", "Group classes", "Locker"] },
    { id: "m3", label: "3 months", months: 3, base: 10500, offer: 7999, perks: ["All Month-on-month perks", "1 trainer orientation", "Diet consult"] },
    { id: "m6", label: "6 months", months: 6, base: 21000, offer: 12999, perks: ["All 3-month perks", "2 PT sessions", "Body composition scan"] },
    { id: "m12", label: "12 months", months: 12, base: 42000, offer: 19999, perks: ["All 6-month perks", "4 PT sessions", "Freeze up to 30 days", "Guest passes"] }
  ];
  AX.data["fitness-first"] = { programs: programs, trainers: trainers, plans: plans, goals: ["Weight loss", "Muscle gain", "General fitness", "Group classes", "Personal training"], times: ["Morning (6-10 AM)", "Midday (10 AM-4 PM)", "Evening (4-9 PM)"] };
})(window);
