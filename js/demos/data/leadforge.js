(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.data = AX.data || {};
  var F = AX.fake;

  /* Fictional dataset: LeadForge turns a plain-English sentence into researched leads with per-field provenance. */
  var PRE = ["Smile", "Bright", "Pearl", "Dental", "Care", "Apex", "Oral", "Prime", "Glow", "Urban", "Orbit", "Metro", "Sunrise", "Elite", "Nova", "Classic"];
  var MID = ["Craft", "Arch", "Point", "Studio", "Hub", "Plus", "Zone", "Care", "Line", "Works"];
  var SUF = ["Dental Clinic", "Dental Studio", "Dental Care", "Dental Centre", "Dentistry"];
  var AREAS = ["Dwarka", "Rohini", "Saket", "Lajpat Nagar", "Karol Bagh", "Janakpuri", "Pitampura", "Vasant Kunj", "Mayur Vihar", "Greater Kailash", "Rajouri Garden", "Preet Vihar"];
  var SOURCES = [
    { id: "maps", name: "Map listing", urlBase: "https://maps.example.in/place/" },
    { id: "site", name: "Business website", urlBase: "https://" },
    { id: "dir", name: "Local directory", urlBase: "https://directory.example.in/biz/" },
    { id: "reg", name: "Public registry", urlBase: "https://registry.example.in/entry/" }
  ];
  var METHODS = ["Structured data (JSON-LD)", "HTML parse", "LLM extraction", "Regex on contact page", "Listing API"];

  function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

  var rows = [], seen = {};
  for (var i = 0; rows.length < 40; i++) {
    var nm = F.pick("lf-pre-" + i, PRE) + " " + F.pick("lf-mid-" + i, MID) + " " + F.pick("lf-suf-" + i, SUF);
    if (seen[nm]) continue; seen[nm] = true;
    var k = rows.length, p = F.person("lf-p-" + i), sl = slug(nm), area = F.pick("lf-area-" + i, AREAS);
    var fields = {};
    ["phone", "email", "website", "address", "rating"].forEach(function (f, fi) {
      var src = SOURCES[F.int("lf-src-" + k + f, 0, 3)];
      var conf = F.int("lf-conf-" + k + f, f === "rating" ? 70 : 62, 99);
      fields[f] = {
        source: src.name, url: src.id === "site" ? "https://" + sl + ".example.in/contact" : src.urlBase + sl,
        method: METHODS[F.int("lf-meth-" + k + f, 0, 4)], confidence: conf, fetched: "2026-10-" + (10 + (k + fi) % 14)
      };
    });
    rows.push({
      id: "B-" + (2001 + k), name: nm, area: area, city: "Delhi", phone: p.phone, email: sl.split("-")[0] + "@" + sl + ".example.in",
      website: sl + ".example.in", address: F.int("lf-no-" + k, 4, 318) + ", " + area + ", Delhi", rating: (F.int("lf-r-" + k, 32, 50) / 10).toFixed(1),
      confidence: Math.round(["phone", "email", "website", "address", "rating"].reduce(function (a, f) { return a + fields[f].confidence; }, 0) / 5), fields: fields
    });
  }

  var history = [];
  var Q = ["dental clinics in Delhi with a website", "physiotherapy centres in Gurugram", "boutique gyms in Pune with Instagram", "pediatric clinics in Noida", "yoga studios in Bengaluru", "diagnostic labs in Jaipur", "wedding photographers in Lucknow", "coaching institutes in Kota with 100+ students"];
  for (var h = 0; h < 12; h++) {
    history.push({ id: "RUN-" + (140 - h), query: Q[h % Q.length], results: F.int("lf-hr-" + h, 24, 180), cost: "$" + (F.int("lf-hc-" + h, 22, 140) / 100).toFixed(2),
      status: h === 3 ? "Needs review" : h === 7 ? "Failed (rate limit)" : "Complete", when: "2026-10-" + (27 - h), owner: F.person("lf-ho-" + h).name });
  }
  var admin = [];
  var ROLES = ["Owner", "Analyst", "Analyst", "Viewer"];
  for (var a = 0; a < 10; a++) {
    var pe = F.person("lf-adm-" + a);
    admin.push({ id: "U-" + (a + 1), name: pe.name, email: pe.email, role: ROLES[a % 4], runs: F.int("lf-ar-" + a, 3, 64), credits: F.int("lf-ac-" + a, 40, 900), status: a === 7 ? "Invited" : "Active" });
  }

  AX.data.leadforge = { rows: rows, history: history, admin: admin, sources: SOURCES, methods: METHODS };
})(window);
