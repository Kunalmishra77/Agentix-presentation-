(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.data = AX.data || {};
  var F = AX.fake;

  var depts = [
    { id: "gm", en: "General Medicine", hi: "सामान्य चिकित्सा", doctor: "Dr. Anil Saxena" },
    { id: "ped", en: "Paediatrics", hi: "बाल रोग", doctor: "Dr. Neha Bhatia" },
    { id: "gyn", en: "Obstetrics & Gynaecology", hi: "स्त्री रोग एवं प्रसूति", doctor: "Dr. Ritu Kapoor" },
    { id: "ortho", en: "Orthopaedics", hi: "अस्थि रोग", doctor: "Dr. Sameer Joshi" },
    { id: "ent", en: "ENT", hi: "कान नाक गला", doctor: "Dr. Faisal Khan" }
  ];

  var complaints = [
    ["Fever and cough, 3 days", "बुखार और खांसी, 3 दिन", "gm"], ["Knee pain on climbing stairs", "सीढ़ियां चढ़ते समय घुटने में दर्द", "ortho"],
    ["Child with loose motions", "बच्चे को दस्त", "ped"], ["Routine antenatal check-up", "प्रसव पूर्व जांच", "gyn"],
    ["Headache and dizziness", "सिरदर्द और चक्कर", "gm"], ["Ear pain, 2 days", "कान में दर्द, 2 दिन", "ent"],
    ["High blood sugar follow-up", "शुगर की जांच", "gm"], ["Back pain after lifting", "वजन उठाने के बाद कमर दर्द", "ortho"]
  ];

  var FEM = ["Ananya", "Diya", "Meera", "Riya", "Saanvi", "Kavya", "Nisha", "Pooja", "Tanya", "Isha", "Anika", "Simran"];
  var STAGES = ["registered", "waiting", "nurse", "doctor", "billing", "pharmacy", "done"];
  var seedStage = ["done", "pharmacy", "billing", "doctor", "doctor", "nurse", "nurse", "waiting", "waiting", "registered"];
  var visits = seedStage.map(function (st, i) {
    var p = F.person("um-p-" + i), c = complaints[i % complaints.length], d = depts.filter(function (x) { return x.id === c[2]; })[0];
    var idx = STAGES.indexOf(st);
    var v = {
      uhid: "UH-26-" + (10210 + i * 3), name: p.name, age: d.id === "ped" ? 5 : 22 + (i * 7) % 48, sex: FEM.indexOf(p.name.split(" ")[0]) >= 0 ? "F" : "M",
      phone: p.phone, complaint: c[0], complaintHi: c[1], dept: d.id, doctor: d.doctor, token: "A-" + (101 + i), stage: st, channel: i % 3 === 0 ? "Asha" : "Form",
      vitals: idx > 2 ? { sys: 118 + (i * 5) % 24, dia: 74 + (i * 3) % 12, pulse: 72 + (i * 4) % 20, temp: Math.round((36.8 + (i % 4) / 10) * 10) / 10, spo2: 97 + (i % 3), weight: 52 + (i * 6) % 30 } : null,
      rx: idx > 3 ? [{ drug: "Paracetamol 500 mg", freq: "1-1-1", days: 3 }, { drug: "Cetirizine 10 mg", freq: "0-0-1", days: 5 }] : [],
      labs: idx > 3 && i % 2 === 0 ? ["CBC"] : [],
      pharm: st === "pharmacy" ? "preparing" : st === "done" ? "collected" : null,
      paid: idx > 4, minutes: 5 + (i * 9) % 55
    };
    return v;
  });

  AX.data["umang-hims"] = {
    depts: depts, complaints: complaints, visits: visits, stages: STAGES,
    nextUhid: 10260,
    drugs: ["Paracetamol 500 mg", "Cetirizine 10 mg", "Azithromycin 500 mg", "Amoxicillin 500 mg", "Pantoprazole 40 mg", "ORS sachet", "Ibuprofen 400 mg", "Metformin 500 mg", "Diclofenac gel", "Vitamin D3 60k"],
    labTests: [{ id: "CBC", en: "CBC", hi: "सीबीसी (खून की जांच)", fee: 350 }, { id: "CRP", en: "CRP", hi: "सीआरपी", fee: 450 }, { id: "FBS", en: "Blood sugar (fasting)", hi: "शुगर (खाली पेट)", fee: 120 }, { id: "XRAY", en: "X-ray", hi: "एक्स-रे", fee: 600 }, { id: "URINE", en: "Urine routine", hi: "पेशाब की जांच", fee: 150 }],
    fees: { consult: 500, drugUnit: 45 },
    hourly: { labels: ["8", "9", "10", "11", "12", "1", "2", "3", "4", "5"], values: F.series("um-hr", 10, 12, 64) },
    week: { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], values: F.series("um-wk", 7, 140, 260) },
    asha: {
      persona: { name: "Kavita Singh", age: 34, sex: "F", phone: "+91 98xxx x4218", complaint: "Fever and cough, 3 days", complaintHi: "बुखार और खांसी, 3 दिन", dept: "gm" },
      en: [
        { from: "ai", text: "Namaste, I'm Asha from Umang Hospital. May I have your full name?" },
        { from: "user", text: "Kavita Singh." },
        { from: "ai", text: "Thank you, Kavita ji. How old are you, and which problem brings you in today?" },
        { from: "user", text: "I'm 34. Fever and cough for three days." },
        { from: "ai", text: "I'm sorry to hear that. I'll book you with General Medicine. Is +91 98xxx x4218 the right number for updates?" },
        { from: "user", text: "Yes, that's correct." },
        { from: "ai", text: "Done. I have registered you. You'll get a message with your UHID and a link to follow your visit.", event: "registered" }
      ],
      hi: [
        { from: "ai", text: "नमस्ते, मैं उमंग हॉस्पिटल से आशा हूं। कृपया अपना पूरा नाम बताइए?" },
        { from: "user", text: "कविता सिंह।" },
        { from: "ai", text: "धन्यवाद कविता जी। आपकी उम्र क्या है और आज क्या तकलीफ़ है?" },
        { from: "user", text: "34 साल। तीन दिन से बुखार और खांसी है।" },
        { from: "ai", text: "सुनकर दुख हुआ। मैं आपको सामान्य चिकित्सा में दिखाने का समय दे रही हूं। क्या +91 98xxx x4218 सही नंबर है?" },
        { from: "user", text: "हां, सही है।" },
        { from: "ai", text: "हो गया। आपका पंजीकरण हो गया है। आपको UHID और विज़िट ट्रैक करने का लिंक संदेश में मिलेगा।", event: "registered" }
      ]
    }
  };
})(window);
