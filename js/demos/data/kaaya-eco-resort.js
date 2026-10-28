(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.data = AX.data || {};
  var F = AX.fake;
  var DAY = 86400000;
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iso(ms) { var d = new Date(ms); return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()); }
  function add(s, n) { var p = s.split("-"); return iso(Date.UTC(+p[0], +p[1] - 1, +p[2]) + n * DAY); }

  /* Fictional dataset: an eco-resort near Yala with three room types, bookings, blocked dates, reviews, enquiries and gallery. */
  var TYPES = { FAMILY_ROOM: "Family Room", FAMILY_CHALET: "Family Chalet", STANDARD_CHALET: "Standard Chalet" };
  var rooms = [
    { id: "r1", name: "Leopard Family Room", type: "FAMILY_ROOM", price: 148, maxAdults: 3, maxChildren: 2, beds: 2, featured: true, active: true, amenities: ["Air conditioning", "Private veranda", "Safari view", "Breakfast included"] },
    { id: "r2", name: "Sambar Family Room", type: "FAMILY_ROOM", price: 148, maxAdults: 3, maxChildren: 2, beds: 2, featured: false, active: true, amenities: ["Air conditioning", "Garden view", "Breakfast included"] },
    { id: "r3", name: "Kumbuk Family Chalet", type: "FAMILY_CHALET", price: 186, maxAdults: 4, maxChildren: 2, beds: 3, featured: true, active: true, amenities: ["Stand-alone chalet", "Plunge deck", "Air conditioning", "Breakfast included"] },
    { id: "r4", name: "Palu Family Chalet", type: "FAMILY_CHALET", price: 186, maxAdults: 4, maxChildren: 2, beds: 3, featured: false, active: true, amenities: ["Stand-alone chalet", "Forest view", "Air conditioning"] },
    { id: "r5", name: "Mayura Standard Chalet", type: "STANDARD_CHALET", price: 112, maxAdults: 2, maxChildren: 1, beds: 1, featured: false, active: true, amenities: ["Ceiling fan and AC", "Private bath", "Breakfast included"] },
    { id: "r6", name: "Bulbul Standard Chalet", type: "STANDARD_CHALET", price: 112, maxAdults: 2, maxChildren: 1, beds: 1, featured: false, active: false, amenities: ["Ceiling fan and AC", "Private bath"] }
  ];

  var STATUS = ["PENDING", "CONFIRMED", "CONFIRMED", "CONFIRMED", "CHECKED_OUT", "CANCELLED", "CHECKED_IN"];
  var bookings = [];
  for (var i = 0; i < 16; i++) {
    var room = rooms[i % 5], p = F.person("kaaya-g-" + i), nights = F.int("kaaya-n-" + i, 2, 4);
    var start = add("2026-11-01", Math.floor(i / 5) * 14 + (i % 5) * 3);
    bookings.push({ id: "KAY-2026-" + (1001 + i), unit: room.id, roomName: room.name, start: start, nights: nights, checkIn: start, checkOut: add(start, nights),
      adults: F.int("kaaya-a-" + i, 1, room.maxAdults), children: F.int("kaaya-c-" + i, 0, 1), guestName: p.name, guestEmail: p.email, guestPhone: p.phone,
      total: Math.round(nights * room.price * 1.12), status: STATUS[i % STATUS.length], requests: i % 3 === 0 ? "Early safari wake-up call" : "", paid: true });
  }
  bookings[0].guestEmail = "imara.perera@example.in"; bookings[0].guestName = "Imara Perera";
  bookings[5].guestEmail = "imara.perera@example.in"; bookings[5].guestName = "Imara Perera";
  bookings[9].guestEmail = "imara.perera@example.in"; bookings[9].guestName = "Imara Perera";

  var blocked = [
    { id: "BL-1", unit: "r2", start: "2026-12-10", nights: 5, reason: "Roof maintenance" },
    { id: "BL-2", unit: "r4", start: "2026-12-24", nights: 3, reason: "Private function" },
    { id: "BL-3", unit: "r1", start: "2026-11-20", nights: 2, reason: "Deep clean" },
    { id: "BL-4", unit: "r5", start: "2026-12-01", nights: 4, reason: "Staff retreat" }
  ];

  var reviews = [];
  var REV = ["Woke up to elephants by the waterhole. The staff arranged a sunrise safari and packed breakfast.", "Quiet, clean and beautifully built into the forest. Our children loved the chalet deck.", "Great guides and food. The road in is rough but worth it.", "Warm hospitality. Hot water was slow one morning but they fixed it quickly.", "Perfect base for Yala. Booking online was easy and the confirmation was instant.", "A little pricey, but the setting is special and the service genuinely caring."];
  for (var r = 0; r < 12; r++) {
    reviews.push({ id: "RV-" + (r + 1), guest: F.person("kaaya-rv-" + r).name, rating: F.int("kaaya-rt-" + r, 3, 5), title: ["Magical stay", "Family favourite", "Great guides", "Lovely hosts", "Easy booking", "Worth it"][r % 6], comment: REV[r % 6], approved: r % 4 !== 3, date: "2026-10-" + pad(1 + r) });
  }
  var SUBJ = ["Group booking for 14 guests", "Availability for New Year", "Safari add-on pricing", "Honeymoon decor", "Dietary needs", "Airport transfer", "Corporate retreat", "Wedding photoshoot permission"];
  var inquiries = [];
  for (var q = 0; q < 12; q++) {
    var pq = F.person("kaaya-iq-" + q);
    inquiries.push({ id: "IQ-" + (q + 1), name: pq.name, email: pq.email, phone: pq.phone, subject: SUBJ[q % SUBJ.length], message: "Hello, we are planning a visit and would like to know more about " + SUBJ[q % SUBJ.length].toLowerCase() + ". Could you share details and rates?", read: q > 4, date: "2026-10-" + pad(28 - q) });
  }
  var CATS = ["rooms", "safari", "dining", "grounds", "experiences"];
  var gallery = [];
  for (var g = 0; g < 12; g++) gallery.push({ id: "GI-" + (g + 1), category: CATS[g % 5], caption: ["Chalet deck at dawn", "Elephants at the waterhole", "Garden dinner", "Forest trail", "Birdwatching tour", "Family room interior", "Leopard sighting", "Breakfast on the veranda", "Pool and palms", "Sunset lounge", "Bonfire evening", "Village visit"][g], sortOrder: g + 1, active: g !== 10 });

  AX.data["kaaya-eco-resort"] = {
    types: TYPES, rooms: rooms, bookings: bookings, blocked: blocked, reviews: reviews, inquiries: inquiries, gallery: gallery, cats: CATS,
    guest: { name: "Imara Perera", email: "imara.perera@example.in", phone: "+91 98xxx x0000" },
    taxRate: 0.12, currency: "$"
  };
})(window);
