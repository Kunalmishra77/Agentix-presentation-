(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.data = AX.data || {};
  var F = AX.fake;

  /* All people are fictional (AX.fake, seeded). Ramesh K. is the seeded demo patient. */
  function nm(seed) { return F.person("hx-p-" + seed).name; }
  function uhid(i) { return "AXH-26-" + String(100420 + i * 17); }
  function pick(seed, arr) { return F.pick("hx-" + seed, arr); }
  function int(seed, a, b) { return F.int("hx-" + seed, a, b); }

  /* ---- Nurse vitals (ward round). Row 0 is the seeded NSTEMI patient: NEWS2 chart total = 12 ---- */
  var WARDS = ["CCU", "Medicine A", "Medicine B", "Surgery", "ICU", "Paeds", "Maternity"];
  var vitals = [{
    id: "V0", uhid: "AXH-26-100420", name: "Ramesh K.", age: 58, sex: "M", ward: "CCU", bed: "CCU-04", dx: "NSTEMI",
    rr: 25, spo2: 91, o2: false, temp: 39.2, sbp: 95, hr: 115, avpu: "A", at: "08:10", nurse: "Sr. Meena"
  }];
  var DX = ["Community-acquired pneumonia", "Type 2 DM, DKA resolved", "Post-op laparoscopic cholecystectomy", "Acute gastroenteritis", "COPD exacerbation", "Dengue, day 4", "Cellulitis left leg", "Unstable angina", "Post-partum day 2", "Bronchiolitis", "Acute pancreatitis", "CKD stage 4", "Fracture neck of femur, post-op", "Typhoid fever", "Stroke, right MCA", "UTI with sepsis", "Asthma, acute"];
  var FEM = ["Ananya", "Diya", "Meera", "Riya", "Saanvi", "Kavya", "Nisha", "Pooja", "Tanya", "Isha", "Anika", "Simran"];
  for (var i = 1; i < 18; i++) {
    var sick = i % 5 === 0, mid = i % 4 === 0;
    var p = F.person("hx-p-" + i);
    var age = i % 6 === 0 ? int("age" + i, 3, 11) : int("age" + i, 24, 79);
    vitals.push({
      id: "V" + i, uhid: uhid(i), name: p.name.split(" ")[0] + " " + p.name.split(" ")[1].charAt(0) + ".", age: age,
      sex: FEM.indexOf(p.name.split(" ")[0]) >= 0 ? "F" : "M", ward: WARDS[i % WARDS.length], bed: WARDS[i % WARDS.length].slice(0, 3).toUpperCase() + "-" + ("0" + (5 + (i * 3) % 14)).slice(-2),
      dx: DX[i - 1],
      rr: sick ? int("rr" + i, 22, 27) : mid ? int("rr" + i, 19, 22) : int("rr" + i, 13, 19),
      spo2: sick ? int("sp" + i, 90, 93) : mid ? int("sp" + i, 93, 96) : int("sp" + i, 96, 99),
      o2: i === 10 || i === 15,
      temp: Math.round((sick ? 37.9 + int("t" + i, 0, 14) / 10 : mid ? 37.2 + int("t" + i, 0, 9) / 10 : 36.4 + int("t" + i, 0, 6) / 10) * 10) / 10,
      sbp: sick ? int("sb" + i, 92, 108) : int("sb" + i, 108, 142),
      hr: sick ? int("hr" + i, 104, 124) : mid ? int("hr" + i, 88, 104) : int("hr" + i, 64, 88),
      avpu: i === 15 ? "V" : "A",
      at: ("0" + (6 + (i % 4))).slice(-2) + ":" + ("0" + ((i * 7) % 60)).slice(-2),
      nurse: pick("nurse" + i, ["Sr. Meena", "Sr. Anita", "Sr. Pushpa", "Br. Rajesh"])
    });
  }

  /* ---- Emergency board (AI ESI triage) ---- */
  var emergency = [
    { id: "E1", col: "esi1", title: "Male, 52 - chest pain, diaphoretic", sub: "ECG: ST elevation V1-V4", tags: ["STEMI alert", "Cath lab"], meta: "Arrived 4 min ago · Bay R1" },
    { id: "E2", col: "esi1", title: "Female, 29 - post-partum haemorrhage", sub: "BP 80/50, HR 134", tags: ["Obs & Gynae", "2 units O-neg"], meta: "Arrived 9 min ago · Bay R2" },
    { id: "E3", col: "esi2", title: "Male, 34 - RTA, open femur fracture", sub: "GCS 14, stable airway", tags: ["Ortho", "Trauma"], meta: "Arrived 12 min ago · Bay O1" },
    { id: "E4", col: "esi2", title: "Female, 67 - acute stroke, onset 40 min", sub: "NIHSS 11, FAST positive", tags: ["Stroke code", "CT brain"], meta: "Arrived 18 min ago · Bay O2" },
    { id: "E5", col: "esi2", title: "Child, 6 - severe asthma", sub: "SpO2 89% on room air", tags: ["Paeds", "Nebulised"], meta: "Arrived 22 min ago · Bay O3" },
    { id: "E6", col: "esi3", title: "Male, 45 - abdominal pain, RIF tenderness", sub: "Pain 7/10, afebrile", tags: ["Surgery", "USG ordered"], meta: "Waiting 31 min" },
    { id: "E7", col: "esi3", title: "Female, 38 - fever 4 days, platelets falling", sub: "Dengue NS1 positive", tags: ["Medicine"], meta: "Waiting 40 min" },
    { id: "E8", col: "esi3", title: "Male, 71 - breathlessness on exertion", sub: "SpO2 93%, known COPD", tags: ["Medicine", "ABG"], meta: "Waiting 26 min" },
    { id: "E9", col: "esi4", title: "Male, 23 - laceration, right forearm", sub: "Needs sutures", tags: ["Minor OT"], meta: "Waiting 52 min" },
    { id: "E10", col: "esi4", title: "Female, 31 - vomiting x6, mild dehydration", sub: "ORS started", tags: ["Medicine"], meta: "Waiting 47 min" },
    { id: "E11", col: "esi5", title: "Female, 19 - sore throat, 2 days", sub: "Afebrile, vitals normal", tags: ["OPD fast-track"], meta: "Waiting 66 min" },
    { id: "E12", col: "esi5", title: "Male, 40 - dressing change", sub: "Post-op day 7", tags: ["Dressing room"], meta: "Waiting 58 min" }
  ];

  /* ---- Lab ---- */
  var TESTS = [["Troponin I (hs)", "Immuno", "Critical"], ["CBC with differential", "Hema", ""], ["Serum creatinine", "Biochem", ""], ["Blood culture x2", "Micro", ""], ["HbA1c", "Biochem", ""], ["Urine routine", "Urine", ""], ["Lipid profile", "Biochem", ""], ["Dengue NS1 + IgM", "Immuno", ""], ["PT / INR", "Hema", ""], ["CRP", "Immuno", ""], ["Serum potassium", "Biochem", "Critical"], ["Lactate", "Biochem", "Critical"], ["Widal test", "Immuno", ""], ["Urine culture", "Micro", ""], ["TSH", "Immuno", ""], ["LFT", "Biochem", ""], ["Peripheral smear", "Hema", ""], ["D-dimer", "Hema", ""]];
  var LSTAT = ["Ordered", "Sample collected", "In analysis", "QC hold", "Awaiting verification", "Reported"];
  var lab = TESTS.map(function (t, i) {
    var st = i === 0 ? "Awaiting verification" : LSTAT[(i * 5 + 1) % LSTAT.length];
    var pat = i === 0 ? "Ramesh K." : nm(i + 30).split(" ")[0] + " " + nm(i + 30).split(" ")[1].charAt(0) + ".";
    return {
      id: "LAB-" + (4410 + i), test: t[0], bench: t[1], patient: pat, uhid: i === 0 ? "AXH-26-100420" : uhid(i + 30),
      source: pick("src" + i, ["OPD", "IPD", "ER", "ICU"]), priority: t[2] === "Critical" ? "STAT" : pick("pr" + i, ["Routine", "Routine", "Urgent"]),
      status: st, tat: int("tat" + i, 25, 190), critical: t[2] === "Critical",
      result: i === 0 ? "Troponin I 2.84 ng/mL (ref < 0.04)" : (st === "Reported" || st === "Awaiting verification") ? "Within reference range" : "Pending",
      tech: pick("tech" + i, ["Tech. Alok", "Tech. Sunita", "Tech. Imran"])
    };
  });

  /* ---- Pharmacy ---- */
  var DRUGS = [["Aspirin 150 mg", "Clopidogrel 75 mg", "Atorvastatin 40 mg"], ["Piperacillin-tazobactam 4.5 g IV"], ["Metformin 500 mg", "Glimepiride 1 mg"], ["Pantoprazole 40 mg", "Ondansetron 4 mg"], ["Salbutamol nebules", "Prednisolone 20 mg"], ["Paracetamol 650 mg", "ORS sachets"], ["Enoxaparin 40 mg", "Tramadol 50 mg"], ["Amlodipine 5 mg", "Telmisartan 40 mg"], ["Insulin glargine 10 IU"], ["Ceftriaxone 1 g IV", "Paracetamol IV 1 g"]];
  var PTAGS = ["OPD", "IPD", "OT", "ICU", "Discharge"], PST = ["Queued", "Preparing", "Ready", "Dispensed"];
  var pharmacy = DRUGS.map(function (d, i) {
    var pat = i === 0 ? "Ramesh K." : nm(i + 50).split(" ")[0] + " " + nm(i + 50).split(" ")[1].charAt(0) + ".";
    return {
      id: "RX-" + (7710 + i), patient: pat, uhid: i === 0 ? "AXH-26-100420" : uhid(i + 50), tag: i === 0 ? "Discharge" : PTAGS[i % PTAGS.length],
      items: d, count: d.length, status: i === 0 ? "Queued" : PST[(i + 1) % PST.length], doctor: pick("rxd" + i, ["Dr. Mathur", "Dr. Siddiqui", "Dr. Pandey", "Dr. Rastogi"]),
      alert: i === 0 ? "Clopidogrel + Omeprazole avoided: pantoprazole substituted" : "", age: int("rxa" + i, 6, 74)
    };
  });
  for (var j = 10; j < 16; j++) {
    var dd = DRUGS[j % DRUGS.length];
    pharmacy.push({ id: "RX-" + (7710 + j), patient: nm(j + 50).split(" ")[0] + " " + nm(j + 50).split(" ")[1].charAt(0) + ".", uhid: uhid(j + 50), tag: PTAGS[j % PTAGS.length], items: dd, count: dd.length, status: PST[j % PST.length], doctor: pick("rxd" + j, ["Dr. Mathur", "Dr. Siddiqui", "Dr. Pandey"]), alert: "", age: int("rxa" + j, 8, 70) });
  }

  /* ---- Beds ---- */
  var wardDefs = [["ICU", 10], ["CCU", 8], ["Medicine A", 14], ["Surgery", 12], ["Maternity", 10], ["Paeds", 10]];
  var bedStates = ["occupied", "occupied", "occupied", "vacant", "occupied", "cleaning", "occupied", "reserved", "occupied", "vacant", "occupied", "maintenance"];
  var beds = [];
  wardDefs.forEach(function (wd, wi) {
    for (var b = 1; b <= wd[1]; b++) {
      var s = bedStates[(b * 7 + wi * 5) % bedStates.length];
      if (wd[0] === "CCU" && b === 4) s = "occupied";
      var id = wd[0].replace(/ /g, "").slice(0, 3).toUpperCase() + "-" + ("0" + b).slice(-2);
      beds.push({
        id: id, ward: wd[0], state: s,
        patient: s === "occupied" ? (wd[0] === "CCU" && b === 4 ? "Ramesh K." : nm(wi * 20 + b + 70).split(" ")[0] + " " + nm(wi * 20 + b + 70).split(" ")[1].charAt(0) + ".") : "",
        los: s === "occupied" ? int("los" + wi + b, 1, 9) : 0, news2: s === "occupied" ? (wd[0] === "CCU" && b === 4 ? 12 : int("bn" + wi + b, 0, 6)) : null
      });
    }
  });

  /* ---- OT calendar (Oct 2026) ---- */
  var otCases = [
    ["Lap. cholecystectomy", "OT-1", "orange", "Dr. Pandey"], ["Total knee replacement", "OT-2", "teal", "Dr. Rastogi"], ["CABG x3", "OT-3", "bad", "Dr. Mathur"],
    ["Caesarean section", "OT-4", "good", "Dr. Verma"], ["Hernia repair", "OT-1", "orange", "Dr. Pandey"], ["Cataract (phaco)", "OT-5", "teal", "Dr. Iqbal"],
    ["Appendicectomy", "OT-1", "orange", "Dr. Pandey"], ["PCI - LAD stenting", "Cath lab", "bad", "Dr. Mathur"], ["Hysterectomy", "OT-4", "good", "Dr. Verma"],
    ["Fracture fixation (DHS)", "OT-2", "teal", "Dr. Rastogi"], ["Thyroidectomy", "OT-3", "orange", "Dr. Kulshreshtha"], ["Tonsillectomy", "OT-5", "teal", "Dr. Iqbal"]
  ];
  var ot = otCases.map(function (c, k) {
    var day = 1 + ((k * 5 + 2) % 28);
    return { id: "OT" + k, date: "2026-10-" + ("0" + day).slice(-2), title: c[0] + " · " + c[1], tone: c[2], surgeon: c[3], theatre: c[1], patient: nm(k + 90), checklist: ["WHO checklist", "Consent verified", "Blood cross-match", "Anaesthesia PAC"] };
  });
  ot.push({ id: "OT-R", date: "2026-10-29", title: "PCI - Ramesh K. · Cath lab", tone: "bad", surgeon: "Dr. Mathur", theatre: "Cath lab", patient: "Ramesh K.", checklist: ["WHO checklist", "Consent verified", "Dual antiplatelet loaded", "Renal function"] });

  /* ---- Blood bank ---- */
  var bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  var bloodUnits = [48, 9, 62, 11, 71, 14, 19, 4];

  /* ---- Billing / insurance ---- */
  var SCHEMES = ["AB-PMJAY", "AB-PMJAY", "CGHS", "ESIC", "Cash", "Private TPA", "AB-PMJAY", "State scheme"];
  var PKG = [["Coronary angioplasty (PCI) - 1 stent", 95000], ["Medical management - pneumonia", 18000], ["Lap. cholecystectomy", 28000], ["Normal delivery", 9000], ["Total knee replacement", 120000], ["Dengue management", 14000], ["Caesarean section", 22000], ["Cataract surgery with IOL", 8000], ["Stroke thrombolysis package", 65000], ["Fracture fixation - femur", 52000]];
  var CST = ["Draft", "Pre-auth pending", "Submitted", "Approved", "Denied", "Paid"];
  var claims = [];
  for (var c = 0; c < 20; c++) {
    var pk = c === 0 ? PKG[0] : PKG[c % PKG.length];
    var risk = c === 0 ? 34 : int("risk" + c, 6, 82);
    claims.push({
      id: "CLM-" + (30500 + c * 3), patient: c === 0 ? "Ramesh K." : nm(c + 110).split(" ")[0] + " " + nm(c + 110).split(" ")[1].charAt(0) + ".",
      scheme: c === 0 ? "AB-PMJAY" : SCHEMES[c % SCHEMES.length], pkg: pk[0], amount: pk[1] + (c % 3) * 1500,
      status: c === 0 ? "Pre-auth pending" : CST[(c * 7 + 2) % CST.length], risk: risk,
      reasons: risk > 55 ? ["Discharge summary missing ICD-10 code", "Length of stay exceeds package norm by 2 days", "Implant sticker not attached"] :
        risk > 25 ? ["Pre-auth document older than 72 h", "Investigations not linked to diagnosis"] : ["All mandatory documents attached"],
      submitted: "2026-10-" + ("0" + (3 + (c * 2) % 24)).slice(-2)
    });
  }

  /* ---- Health Secretary: districts (UP) ---- */
  var DISTRICTS = ["Lucknow", "Kanpur Nagar", "Varanasi", "Prayagraj", "Agra", "Meerut", "Gorakhpur", "Ghaziabad", "Bareilly", "Aligarh", "Moradabad", "Jhansi", "Mathura", "Saharanpur", "Azamgarh", "Ayodhya"];
  var districts = DISTRICTS.map(function (d, k) {
    var o = {
      district: d, opd: int("opd" + k, 2200, 9400), occupancy: int("occ" + k, 52, 94), anc: int("anc" + k, 61, 93),
      stockout: int("so" + k, 1, 19), tat: int("tat2" + k, 4, 31), nabh: int("nb" + k, 48, 91)
    };
    o.score = Math.round((o.occupancy * 0.2 + o.anc * 0.3 + (100 - o.stockout * 3) * 0.2 + (100 - o.tat * 2) * 0.1 + o.nabh * 0.2) * 10) / 10;
    return o;
  }).sort(function (a, b) { return b.score - a.score; }).map(function (o, k) { o.rank = k + 1; return o; });
  var fraud = [
    { id: "F1", sev: "High", title: "Duplicate AB-PMJAY claims for the same beneficiary ID", detail: "7 claims in 5 days across 2 empanelled hospitals. Biometric mismatch on 4.", district: "Ghaziabad" },
    { id: "F2", sev: "High", title: "Ghost admission pattern: same-day admit and discharge", detail: "Empanelled Hospital #E-1042: 31 cataract-package claims with identical timestamps.", district: "Agra" },
    { id: "F3", sev: "Medium", title: "Upcoding: medical management billed as ICU package", detail: "Hospital #E-0877: ICU package share 3.1x state mean.", district: "Meerut" },
    { id: "F4", sev: "Medium", title: "Delivery claims above institutional delivery count", detail: "JSY payouts exceed HMIS-reported deliveries by 12% in 2 blocks.", district: "Azamgarh" },
    { id: "F5", sev: "Low", title: "Stock-out reported but drug issue vouchers continue", detail: "Store ledger mismatch for 4 essential drugs at one district store.", district: "Moradabad" }
  ];

  /* ---- CMO ---- */
  var months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  var cmo = {
    months: months, anc: F.series("cmo-anc", 12, 8200, 11800), deliveries: F.series("cmo-del", 12, 5200, 7600),
    immun: [["BCG", 96], ["OPV-3", 91], ["Pentavalent-3", 89], ["Measles-Rubella 1", 87], ["MR 2 / DPT booster", 79], ["Full immunisation", 84]],
    schemes: [["AB-PMJAY", 5240], ["JSY", 3120], ["Janani Suraksha / RBSK", 1480], ["e-Sanjeevani teleconsult", 2210], ["Free drugs / diagnostics", 4150]]
  };

  /* ---- COO ---- */
  var coo = {
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    coverage: [96, 94, 91, 95, 88, 82, 79], revenue: [18.4, 19.1, 17.8, 20.2, 19.6, 14.3, 11.9],
    chapters: [["AAC", 92], ["COP", 88], ["MOM", 84], ["HIC", 90], ["PRE", 86], ["IMS", 81], ["CQI", 78], ["ROM", 89], ["HRM", 87]]
  };

  /* ---- Audit log ---- */
  var ACT = [["Doctor", "Signed prescription", "Rx", "RX-7710"], ["Pharmacy", "Substituted drug (interaction)", "Rx", "RX-7710"], ["Nurse", "Recorded vitals, NEWS2 12", "Vitals", "V0"], ["Nurse", "Escalated to rapid response", "Vitals", "V0"], ["Lab", "Verified troponin result", "Lab", "LAB-4410"], ["Billing", "Submitted AB-PMJAY pre-auth", "Claim", "CLM-30500"], ["Admission", "Allocated bed CCU-04", "Bed", "CCU-04"], ["Blood bank", "Issued 2 units PRBC", "Blood", "BB-2209"], ["Admin", "Changed shift roster", "Roster", "WK-43"], ["Emergency", "Re-triaged ESI 3 to ESI 2", "ER", "E7"], ["OT", "Completed WHO checklist", "OT", "OT3"], ["CMO", "Viewed district MCH report", "Report", "CMO-MCH"]];
  var NABH = ["AAC", "COP", "MOM", "HIC", "PRE", "IMS", "CQI", "ROM", "HRM"];
  var audit = [];
  for (var a = 0; a < 28; a++) {
    var ac = ACT[a % ACT.length];
    audit.push({
      id: "AUD-" + (90100 + a), time: "2026-10-" + ("0" + (28 - Math.floor(a / 8))).slice(-2) + " " + ("0" + (17 - (a % 9))).slice(-2) + ":" + ("0" + ((a * 11) % 60)).slice(-2),
      role: ac[0], action: ac[1], entity: ac[2], ref: ac[3], chapter: NABH[a % NABH.length], user: pick("au" + a, ["u.mathur", "u.meena", "u.pandey", "u.anita", "u.rastogi", "u.sys-ai"]), ai: a % 4 === 0
    });
  }

  /* ---- Patient portal ---- */
  var patient = {
    name: "Ramesh K.", age: 58, abha: "91-2204-8837-5516", abhaAddress: "ramesh.k@abdm", blood: "B+", scheme: "AB-PMJAY",
    timeline: [
      ["2026-10-24", "Chest pain at home, ambulance called (108)", "Ambulance"],
      ["2026-10-24", "Emergency: ECG + hs-Troponin, ESI 2, NSTEMI suspected", "Emergency"],
      ["2026-10-24", "Admitted to CCU bed 04, dual antiplatelet loaded", "Admission"],
      ["2026-10-25", "Echo: EF 48%, mild anterior hypokinesia", "Radiology"],
      ["2026-10-26", "Coronary angiography planned, AB-PMJAY pre-auth submitted", "Billing"],
      ["2026-10-28", "Vitals alert: NEWS2 12, rapid response reviewed", "Nurse"],
      ["2026-10-29", "PCI to LAD scheduled, Cath lab", "OT"]
    ],
    meds: ["Aspirin 150 mg once daily", "Clopidogrel 75 mg once daily", "Atorvastatin 40 mg at night", "Pantoprazole 40 mg before breakfast"],
    reports: ["Troponin I (hs) - 28 Oct", "ECG - 24 Oct", "Echocardiogram - 25 Oct", "Lipid profile - 25 Oct"]
  };

  /* ---- Doctor panel ---- */
  var doctorPatients = [
    { id: "D0", name: "Ramesh K.", age: 58, sex: "M", uhid: "AXH-26-100420", dx: "NSTEMI", cc: "Chest pain 3 h, radiating to left arm", hx: ["Hypertension x 8 y", "Type 2 DM x 5 y", "Smoker 20 pack-years"], allergy: "Penicillin (rash)",
      vit: "BP 95/60 · HR 115 · RR 25 · SpO2 91% · T 39.2 C · NEWS2 12", labs: ["hs-Troponin I 2.84 ng/mL (high)", "Creatinine 1.1 mg/dL", "HbA1c 7.9%"],
      ddx: [["NSTEMI", 78], ["Unstable angina", 12], ["Pulmonary embolism", 6], ["Acute pericarditis", 4]],
      meds: ["Aspirin 150 mg", "Clopidogrel 75 mg", "Atorvastatin 40 mg", "Omeprazole 20 mg"],
      alert: { drugs: ["Clopidogrel", "Omeprazole"], text: "Clopidogrel + Omeprazole: omeprazole inhibits CYP2C19 and can reduce clopidogrel activation. Consider pantoprazole 40 mg." } },
    { id: "D1", name: "Sunita V.", age: 41, sex: "F", uhid: "AXH-26-100437", dx: "Type 2 DM, uncontrolled", cc: "Polyuria, fatigue 2 weeks", hx: ["Obesity BMI 31", "Family history of DM"], allergy: "None known", vit: "BP 132/84 · HR 82 · RR 16 · SpO2 98% · T 36.8 C · NEWS2 0", labs: ["HbA1c 9.4%", "FBS 212 mg/dL", "Urine ketones negative"],
      ddx: [["Type 2 DM", 88], ["LADA", 7], ["Secondary diabetes", 5]], meds: ["Metformin 500 mg", "Glimepiride 1 mg"], alert: { drugs: ["Glimepiride", "Aspirin"], text: "Glimepiride + Aspirin (high dose): possible additive hypoglycaemia. Monitor." } },
    { id: "D2", name: "Kabir S.", age: 7, sex: "M", uhid: "AXH-26-100454", dx: "Bronchiolitis", cc: "Cough, wheeze, fever 3 days", hx: ["Born term", "Immunised to age"], allergy: "None known", vit: "HR 128 · RR 38 · SpO2 94% · T 38.4 C · PEWS 3", labs: ["CRP 14 mg/L", "CXR: hyperinflation"],
      ddx: [["Bronchiolitis", 64], ["Asthma, first episode", 24], ["Pneumonia", 12]], meds: ["Salbutamol nebules", "Paracetamol syrup"], alert: null }
  ];
  var drugList = ["Aspirin 150 mg", "Clopidogrel 75 mg", "Atorvastatin 40 mg", "Omeprazole 20 mg", "Pantoprazole 40 mg", "Metoprolol 25 mg", "Ramipril 2.5 mg", "Enoxaparin 60 mg", "Paracetamol 650 mg", "Metformin 500 mg"];

  AX.data["agentix-hims"] = {
    patient: patient, vitals: vitals, emergency: emergency, lab: lab, pharmacy: pharmacy, beds: beds, ot: ot,
    blood: { groups: bloodGroups, units: bloodUnits, requests: [
      { id: "BB-2209", patient: "Ramesh K.", group: "B+", units: 2, component: "PRBC", status: "Cross-matched", ward: "CCU" },
      { id: "BB-2210", patient: nm(210), group: "O-", units: 4, component: "PRBC", status: "Issued", ward: "Maternity" },
      { id: "BB-2211", patient: nm(211), group: "A+", units: 1, component: "Platelets (SDP)", status: "Requested", ward: "Medicine A" }
    ], expiring: [["O-", 2, "3 days"], ["B-", 1, "5 days"], ["AB-", 1, "2 days"]] },
    claims: claims, districts: districts, fraud: fraud, cmo: cmo, coo: coo, audit: audit, doctorPatients: doctorPatients, drugList: drugList
  };
})(window);
