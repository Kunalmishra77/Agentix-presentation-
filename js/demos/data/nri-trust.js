(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.data = AX.data || {};

  /* Fictional dataset: an NRI family risk assessment (8 questions), playbook library and portal content. */
  var QUESTIONS = [
    { id: "parentAge", cat: "Coordination", q: "How old is the parent or elder relative you support in India?", help: "The age band sets how urgent the planning is.",
      options: [{ v: "under_55", l: "Under 55" }, { v: "55_65", l: "55 to 65" }, { v: "65_plus", l: "65 or above" }] },
    { id: "residency", cat: "Coordination", q: "Where do you live now?", help: "Used to pick the right tax and remittance guidance.",
      options: [{ v: "usa", l: "United States" }, { v: "uk", l: "United Kingdom" }, { v: "uae", l: "UAE / Gulf" }, { v: "other", l: "Canada / Australia / elsewhere" }] },
    { id: "property", cat: "Asset", q: "Does your family hold property or land in India?", help: "Flats, plots, ancestral property or farmland.",
      options: [{ v: "india", l: "Yes, property in India" }, { v: "none", l: "No property in India" }] },
    { id: "poa", cat: "Legal", q: "Is a Power of Attorney (POA) in place for someone in India who can act for you?", help: "A registered POA lets a trusted person handle banks, property and paperwork.",
      options: [{ v: "yes", l: "Yes, registered" }, { v: "no", l: "No POA" }] },
    { id: "nominee", cat: "Asset", q: "Do all bank accounts, FDs and investments in India have an up-to-date nominee?", help: "A missing nominee delays access to funds by months.",
      options: [{ v: "yes", l: "Yes, all nominated" }, { v: "no", l: "No, or not sure" }] },
    { id: "will", cat: "Legal", q: "Is there a valid Will covering your family's Indian assets?", help: "Without a Will, succession follows personal law and court process.",
      options: [{ v: "yes", l: "Yes, registered Will" }, { v: "no", l: "No Will" }] },
    { id: "insurance", cat: "Health", q: "Does your parent have adequate health insurance with cashless cover?", help: "Medical emergencies are the most common trigger for a financial crisis.",
      options: [{ v: "yes", l: "Yes, cashless cover" }, { v: "no", l: "No or inadequate" }] },
    { id: "liquidity", cat: "Health", q: "Can someone in India access emergency funds within 24 hours?", help: "Hospital deposits cannot wait for a remittance.",
      options: [{ v: "yes", l: "Yes" }, { v: "no", l: "No" }] }
  ];

  var DOCS = [
    { id: "d1", name: "Passport and OCI copies", status: "Received", date: "12 Sep" },
    { id: "d2", name: "Property title deed (Dwarka flat)", status: "Under review", date: "18 Sep" },
    { id: "d3", name: "Bank nomination forms", status: "Requested", date: "-" },
    { id: "d4", name: "Draft Power of Attorney", status: "Ready to sign", date: "02 Oct" },
    { id: "d5", name: "Health insurance policy schedule", status: "Received", date: "21 Sep" }
  ];
  var MESSAGES = [
    { from: "Advisor", text: "Welcome. I've reviewed your assessment. The POA draft is ready for your signature this week.", at: "Mon 10:14" },
    { from: "You", text: "Thanks. Can the signing happen at the consulate in my city?", at: "Mon 10:31" },
    { from: "Advisor", text: "Yes, we'll book a slot and share the exact steps.", at: "Mon 10:40" }
  ];

  AX.data["nri-trust"] = { questions: QUESTIONS, docs: DOCS, messages: MESSAGES, client: { name: "Anika Menon", city: "Dubai", since: "2026" } };
})(window);
