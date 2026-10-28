/* SocialFlow demo dataset. Every record is fictional and generated with AX.fake (seeded, deterministic). */
(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.data = AX.data || {};
  var F = AX.fake;
  function P(i) { return F.person("sf-" + i); }
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function days(n) {
    var out = [], d = new Date(Date.UTC(2026, 9, 28));
    for (var i = n - 1; i >= 0; i--) { var x = new Date(d.getTime() - i * 86400000); out.push(x.getUTCDate() + " " + MON[x.getUTCMonth()]); }
    return out;
  }
  function handle(p) { return "@" + p.name.toLowerCase().replace(/[^a-z]+/g, "_"); }

  var CHANNELS = ["Instagram", "Facebook", "Telegram"];
  var contacts = [];
  for (var i = 0; i < 30; i++) {
    var p = P(i);
    contacts.push({ id: "c" + i, name: p.name, handle: handle(p), city: p.city, channel: F.pick("ch" + i, CHANNELS),
      followers: F.int("fl" + i, 120, 18000), tag: F.pick("tg" + i, ["Customer", "Lead", "Influencer", "Follower"]),
      follows: F.pick("fw" + i, ["Yes", "Yes", "No"]), last: F.int("la" + i, 0, 30) + "d ago", optin: F.pick("op" + i, ["Opted in", "Opted in", "Pending"]) });
  }

  var rules = [
    ["PRICE", "Comment keyword", "Public reply + DM (follow-gate)", "Live", 412], ["INFO", "Comment keyword", "DM with brochure", "Live", 188],
    ["LINK", "Comment keyword", "DM with product link", "Live", 241], ["Story reply", "Story reply", "AI answer from knowledge base", "Live", 530],
    ["@mention", "Story mention", "Thank-you DM + 10% code", "Live", 97], ["DEMO", "Comment keyword", "Booking link DM", "Paused", 64],
    ["New follower", "New follower", "Welcome DM", "Live", 305], ["Refund", "DM keyword", "Handoff to human", "Live", 22],
    ["SIZE", "Comment keyword", "Size guide DM", "Live", 138], ["Live reminder", "Broadcast reply", "Reminder sequence", "Draft", 0]
  ].map(function (r, n) { return { id: "r" + n, keyword: r[0], trigger: r[1], action: r[2], status: r[3], fired: r[4] }; });

  var threads = [
    { id: "i1", name: "Aarav Sharma", channel: "instagram", preview: "What is the price of the combo?",
      messages: [{ from: "user", text: "What is the price of the combo?", at: "11:02" }, { from: "ai", text: "The Glow Combo is ₹1,499 with free shipping above ₹999. Want the link?||kb:Pricing and plans.pdf", at: "11:02" }] },
    { id: "i2", name: "Ananya Iyer", channel: "instagram", preview: "Do you deliver to Pune?",
      messages: [{ from: "user", text: "Do you deliver to Pune?", at: "10:20" }, { from: "ai", text: "Yes, we ship pan-India in 3 to 5 days. Pune orders usually arrive in 3.||kb:Shipping policy.docx", at: "10:20" }] },
    { id: "f1", name: "Kabir Mehta", channel: "facebook", preview: "Can I return the product?",
      messages: [{ from: "user", text: "Can I return the product?", at: "Yesterday" }, { from: "ai", text: "Returns are accepted within 7 days if unused and in original packaging.||kb:Returns and refunds.pdf", at: "Yesterday" }] },
    { id: "t1", name: "Meera Kapoor", channel: "telegram", preview: "Any bulk discount?",
      messages: [{ from: "user", text: "Any bulk discount?", at: "Mon" }, { from: "agent", text: "For 10+ units we offer 12% off. Sending you a quote.", at: "Mon" }] },
    { id: "i3", name: "Riya Chauhan", channel: "instagram", preview: "Loved the reel! Where to buy?",
      messages: [{ from: "user", text: "Loved the reel! Where to buy?", at: "Mon" }, { from: "ai", text: "Thank you! Here is the shop link in our bio. Shall I DM you the product page?", at: "Mon" }] },
    { id: "i4", name: "Dev Khanna", channel: "instagram", preview: "Is COD available?",
      messages: [{ from: "user", text: "Is COD available?", at: "Sun" }, { from: "ai", text: "Cash on delivery is available for orders under ₹5,000 (₹49 handling).||kb:Shipping policy.docx", at: "Sun" }] }
  ];

  var docs = [
    { id: "d1", name: "Pricing and plans.pdf", pages: 4, updated: "10 Oct", answer: "Starter pack is ₹999, the Glow Combo is ₹1,499 and the Pro Kit is ₹2,799. Shipping is free above ₹999." },
    { id: "d2", name: "Shipping policy.docx", pages: 2, updated: "18 Oct", answer: "We ship pan-India in 3 to 5 working days. Cash on delivery is available under ₹5,000 with a ₹49 handling fee." },
    { id: "d3", name: "Returns and refunds.pdf", pages: 3, updated: "02 Sep", answer: "Returns are accepted within 7 days if unused and in original packaging. Refunds reach your account in 5 to 7 days." },
    { id: "d4", name: "Product care guide.md", pages: 1, updated: "21 Sep", answer: "Store in a cool, dry place. Patch test before first use and avoid contact with eyes." },
    { id: "d5", name: "Collab and influencer brief.pdf", pages: 5, updated: "05 Oct", answer: "We collaborate with creators above 10k followers and 3% engagement. Share your media kit and we reply within 2 days." }
  ];

  var leads = [
    ["Aarav Sharma", "Glow Combo", "new"], ["Ishaan Gupta", "Pro Kit", "new"], ["Tanya Bhatia", "Starter pack", "new"], ["Neel Das", "Glow Combo", "qualified"],
    ["Saanvi Rao", "Pro Kit", "qualified"], ["Rohan Joshi", "Bulk order x20", "negotiating"], ["Kavya Nair", "Glow Combo", "negotiating"], ["Karan Verma", "Starter pack", "won"],
    ["Diya Arora", "Pro Kit", "won"], ["Manav Sethi", "Glow Combo", "lost"], ["Anika Reddy", "Starter pack", "qualified"]
  ].map(function (r, n) { return { id: "ld" + n, title: r[0], sub: r[1], col: r[2], tags: [F.pick("lt" + n, CHANNELS)], meta: "₹" + F.int("lv" + n, 9, 80) * 100 }; });

  var campaigns = [
    ["Diwali giveaway DM blast", "Broadcast", "Sent", 4200, 3900, 1210], ["New follower welcome", "Automation", "Running", 1800, 1760, 640], ["Story poll: pick the shade", "Story", "Sent", 2600, 2410, 880],
    ["Abandoned cart nudge", "Automation", "Running", 940, 910, 302], ["Pro Kit launch teaser", "Broadcast", "Scheduled", 5100, 0, 0], ["Reel: how to use serum", "Comment trigger", "Running", 3300, 3100, 1040],
    ["Win-back 60 days", "Broadcast", "Draft", 0, 0, 0], ["Black Friday early access", "Broadcast", "Scheduled", 6200, 0, 0]
  ].map(function (c, n) { return { id: "cm" + n, name: c[0], type: c[1], status: c[2], sent: c[3], delivered: c[4], replies: c[5] }; });

  var products = [
    ["Glow Serum 30ml", 799, 999, "Skincare", ["Bestseller"], ["30ml", "50ml"]], ["Vitamin C Cleanser", 449, 599, "Skincare", ["New"], null], ["Sunscreen SPF 50", 549, 649, "Skincare", [], null],
    ["Hair Growth Oil", 599, 799, "Haircare", ["Bestseller"], ["100ml", "200ml"]], ["Argan Shampoo", 399, 499, "Haircare", [], null], ["Glow Combo", 1499, 1999, "Combos", ["Free shipping"], null],
    ["Pro Kit", 2799, 3499, "Combos", ["Limited"], null], ["Lip Balm Trio", 299, 399, "Makeup", [], ["Berry", "Rose", "Plain"]], ["Kajal Pencil", 249, 299, "Makeup", ["New"], null]
  ].map(function (r, n) { return { id: "p" + n, name: r[0], price: r[1], mrp: r[2], category: r[3], tags: r[4], variants: r[5] || undefined }; });

  var orders = [];
  for (var o = 0; o < 24; o++) {
    var op = P(80 + o);
    orders.push({ id: "SF-" + (5100 + o), customer: op.name, city: op.city, item: F.pick("oi" + o, products).name, amount: F.int("oa" + o, 3, 36) * 100 + 99,
      status: F.pick("os" + o, ["Paid", "Paid", "Shipped", "Delivered", "COD pending", "Refunded"]), via: F.pick("ov" + o, ["Comment PRICE", "Story reply", "DM", "Bio link"]), date: (1 + F.int("od" + o, 0, 27)) + " Oct" });
  }

  var influencers = [];
  for (var n2 = 0; n2 < 16; n2++) {
    var ip = P(140 + n2);
    influencers.push({ id: "in" + n2, name: ip.name, handle: handle(ip), niche: F.pick("in" + n2, ["Beauty", "Lifestyle", "Fitness", "Food", "Fashion"]), followers: F.int("if" + n2, 12, 480) * 1000,
      er: (F.int("ie" + n2, 18, 74) / 10), fee: F.int("ife" + n2, 5, 90) * 1000, status: F.pick("is" + n2, ["Shortlisted", "Contacted", "Negotiating", "Live", "Completed"]) });
  }

  var types = ["Reel", "Carousel", "Image", "Story"];
  var posts = [];
  for (var q = 0; q < 20; q++) {
    var reach = F.int("pr" + q, 8, 90) * 100, likes = Math.round(reach * F.int("pl" + q, 5, 16) / 100), cm = F.int("pc" + q, 3, 90), sv = F.int("ps" + q, 4, 160);
    posts.push({ id: "po" + q, title: F.pick("pt" + q, ["How to use the Glow Serum", "Customer review: 30 days", "Diwali gift guide", "Behind the scenes", "Hair-care myths busted", "Combo unboxing", "3 steps to glowing skin", "Team picks", "Festive offer reminder", "FAQ: sensitive skin"]) + " #" + (q + 1),
      type: F.pick("pty" + q, types), reach: reach, likes: likes, comments: cm, saves: sv, er: Math.round((likes + cm + sv) / reach * 1000) / 10, posted: (1 + q) + " Oct" });
  }
  posts.sort(function (a, b) { return b.er - a.er; });

  var approvals = [
    ["Diwali offer carousel", "draft"], ["Reel: serum routine", "draft"], ["Founder story post", "review"], ["Customer review collage", "review"], ["Black Friday teaser", "review"],
    ["Hair-care myths", "approved"], ["Team picks", "approved"], ["New follower welcome story", "scheduled"], ["Combo launch reel", "scheduled"]
  ].map(function (r, n) { return { id: "ap" + n, title: r[0], col: r[1], sub: F.pick("aps" + n, ["Meera", "Rohit", "Isha"]), tags: [F.pick("apt" + n, ["Reel", "Carousel", "Story"])], meta: (3 + n) + " Nov" }; });

  var events = [
    { id: "e1", title: "Reel: serum routine", date: "2026-11-02", tone: "orange" }, { id: "e2", title: "Carousel: Diwali picks", date: "2026-11-03", tone: "teal" },
    { id: "e3", title: "Story poll", date: "2026-11-04", tone: "navy" }, { id: "e4", title: "Founder story", date: "2026-11-06", tone: "good" },
    { id: "e5", title: "Reel: unboxing", date: "2026-11-08", tone: "orange" }, { id: "e6", title: "Giveaway post", date: "2026-11-10", tone: "bad" },
    { id: "e7", title: "Customer review", date: "2026-11-12", tone: "teal" }, { id: "e8", title: "Black Friday teaser", date: "2026-11-15", tone: "navy" },
    { id: "e9", title: "Live Q and A", date: "2026-11-19", tone: "good" }
  ];
  var bookings = [
    { id: "bk1", title: "10:00 Aarav · Skin consult", date: "2026-11-03", tone: "teal" }, { id: "bk2", title: "12:30 Ishaan · Demo call", date: "2026-11-04", tone: "orange" },
    { id: "bk3", title: "15:00 Tanya · Styling", date: "2026-11-05", tone: "navy" }, { id: "bk4", title: "11:00 Neel · Consult", date: "2026-11-07", tone: "good" },
    { id: "bk5", title: "16:30 Saanvi · Demo call", date: "2026-11-10", tone: "teal" }, { id: "bk6", title: "10:30 Rohan · Bulk order call", date: "2026-11-12", tone: "orange" }
  ];

  var team = [
    ["Meera Kapoor", "Admin"], ["Rohit Menon", "Content manager"], ["Isha Bhatia", "Designer"], ["Aditya Sethi", "Support agent"], ["Pooja Joshi", "Analyst"], ["Neel Reddy", "Support agent"]
  ].map(function (t, n) { return { id: "tm" + n, name: t[0], role: t[1], email: t[0].toLowerCase().replace(/ /g, ".") + "@example.in", status: F.pick("tms" + n, ["Active", "Active", "Invited"]), replies: F.int("tmr" + n, 20, 400) }; });

  AX.data.socialflow = {
    days: days(30), contacts: contacts, rules: rules, threads: threads, docs: docs, leads: leads, campaigns: campaigns, products: products, orders: orders,
    influencers: influencers, posts: posts, approvals: approvals, events: events, bookings: bookings, team: team,
    series: {
      followers: F.series("sf-fol", 30, 12400, 13900), reach: F.series("sf-reach", 30, 4000, 12000), dms: F.series("sf-dm", 30, 80, 340), orders: F.series("sf-ord", 30, 4, 28),
      spend: F.series("sf-sp", 30, 400, 1500), sent: F.series("sf-sent", 30, 60, 300)
    }
  };
})(window);
