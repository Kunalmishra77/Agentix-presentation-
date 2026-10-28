(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.data = AX.data || {};
  var F = AX.fake;

  var PLATFORMS = [
    { id: "youtube", name: "YouTube", short: "YT", color: "#E11D1D", ratio: "9:16", label: "Shorts", limit: 100, handle: "@lumenlane.studio", followers: 18400 },
    { id: "instagram", name: "Instagram", short: "IG", color: "#C13584", ratio: "4:5", label: "Feed / Reels", limit: 2200, handle: "@lumenlane", followers: 42100 },
    { id: "facebook", name: "Facebook", short: "FB", color: "#1877F2", ratio: "1.91:1", label: "Page post", limit: 63206, handle: "Lumen Lane Studio", followers: 12700 },
    { id: "threads", name: "Threads", short: "TH", color: "#111111", ratio: "4:5", label: "Thread", limit: 500, handle: "@lumenlane", followers: 6900 },
    { id: "linkedin", name: "LinkedIn", short: "IN", color: "#0A66C2", ratio: "1.91:1", label: "Company page", limit: 3000, handle: "Lumen Lane Studio", followers: 5300 },
    { id: "pinterest", name: "Pinterest", short: "PI", color: "#E60023", ratio: "2:3", label: "Pin", limit: 500, handle: "lumenlane", followers: 3100 },
    { id: "x", name: "X", short: "X", color: "#000000", ratio: "16:9", label: "Post", limit: 280, handle: "@lumenlane", followers: 8800 }
  ];

  /* Four sample "images" as self-contained SVG data URIs (no network, no copyrighted assets). */
  function svg(bg1, bg2, shapes, label) {
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + bg1 + '"/><stop offset="1" stop-color="' + bg2 + '"/></linearGradient></defs><rect width="800" height="800" fill="url(#g)"/>' + shapes +
      '<text x="400" y="720" text-anchor="middle" font-family="Arial,sans-serif" font-size="46" font-weight="700" fill="#fff" opacity=".92">' + label + "</text></svg>";
    return "data:image/svg+xml;utf8," + encodeURIComponent(s);
  }
  var MEDIA = [
    { id: "m1", name: "Festive offer", src: svg("#F97316", "#DB2777", '<circle cx="400" cy="340" r="190" fill="#fff" opacity=".18"/><circle cx="400" cy="340" r="110" fill="#fff" opacity=".28"/><path d="M400 200l30 80 85 6-65 55 22 83-72-46-72 46 22-83-65-55 85-6z" fill="#FDE68A"/>', "Festive offer") },
    { id: "m2", name: "Product flat-lay", src: svg("#0EA5E9", "#312E81", '<rect x="170" y="190" width="460" height="330" rx="28" fill="#fff" opacity=".2"/><rect x="250" y="260" width="140" height="200" rx="16" fill="#fff" opacity=".75"/><rect x="420" y="300" width="150" height="160" rx="16" fill="#FDE68A" opacity=".9"/>', "New collection") },
    { id: "m3", name: "Team shoot", src: svg("#10B981", "#065F46", '<circle cx="280" cy="330" r="62" fill="#fff" opacity=".8"/><circle cx="520" cy="330" r="62" fill="#fff" opacity=".8"/><rect x="215" y="410" width="130" height="150" rx="40" fill="#fff" opacity=".6"/><rect x="455" y="410" width="130" height="150" rx="40" fill="#fff" opacity=".6"/>', "Meet the team") },
    { id: "m4", name: "Behind the scenes", src: svg("#8B5CF6", "#1E1B4B", '<rect x="200" y="230" width="400" height="260" rx="22" fill="#000" opacity=".35"/><circle cx="400" cy="360" r="78" fill="#fff" opacity=".85"/><circle cx="400" cy="360" r="38" fill="#8B5CF6"/><rect x="330" y="190" width="140" height="40" rx="10" fill="#fff" opacity=".7"/>', "Behind the scenes") }
  ];

  var TITLES = [
    "Diwali sale teaser reel", "5 ways to style the linen set", "Founder story: why we started", "Customer spotlight: Meera's kitchen", "Weekend flash sale announcement",
    "Behind the scenes at the studio", "How we pack your order", "New arrivals: autumn palette", "Q&A: your shipping questions", "Hiring: social media intern",
    "Monthly roundup: October wins", "Unboxing video: gift hamper", "Tips: caring for handloom fabric", "Poll: favourite colourway?", "Case study: 3x repeat orders",
    "Behind the brand: our weavers", "Festival gifting guide", "Giveaway: win a hamper", "Product demo: reversible throw", "Thank you 40k followers"
  ];
  var STATUSES = ["Published", "Published", "Published", "Queued", "Queued", "Failed", "Retried", "Published"];
  var posts = TITLES.map(function (t, i) {
    var pn = 1 + (i % 4);
    var plats = [];
    for (var k = 0; k < pn; k++) plats.push(PLATFORMS[(i + k * 2) % 7].id);
    var past = i < 11;
    var day = past ? 26 - i : (i - 9);           // past: Oct 26..16 ; future: Nov 2..11 + later
    if (!past && i > 16) day = 14 + (i - 16) * 3;
    var date = past ? "2026-10-" + (day < 10 ? "0" : "") + day : "2026-11-" + (day < 10 ? "0" : "") + day;
    var status = past ? (i === 3 ? "Failed" : i === 6 ? "Retried" : "Published") : "Queued";
    var p = F.person("sp" + i);
    return {
      id: "p" + (101 + i), name: "Post P" + (101 + i) + " · " + (i < 11 ? "published" : "scheduled"), title: t, platforms: plats, date: date, time: ["09:00", "11:30", "13:00", "18:30", "20:00"][i % 5],
      status: status, media: MEDIA[i % 4].id, by: p.name, reach: status === "Published" || status === "Retried" ? F.int("rc" + i, 1200, 48000) : 0,
      error: status === "Failed" ? "Instagram: media container timed out (retry available)" : ""
    };
  });

  var accounts = PLATFORMS.map(function (p, i) { return { plat: p.id, connected: i !== 5, expiring: i === 6 }; });

  function C(id, name, channel, text, reply, preview) {
    return { id: id, name: name, channel: channel, preview: preview || text, messages: [{ from: "user", text: text }], reply: reply };
  }
  var cp = [F.person("cm1").name, F.person("cm2").name, F.person("cm3").name, F.person("cm4").name, F.person("cm5").name, F.person("cm6").name];
  var commentThreads = [
    C("c1", cp[0] + " · Instagram", "instagram", "Love the linen set! Is it available in the olive colour?", "Thank you! Olive is back in stock from Friday. Want us to DM you the link?"),
    C("c2", cp[1] + " · YouTube", "youtube", "How long does shipping take to Pune?", "Orders reach Pune in 3-4 working days. Free shipping above Rs 1,499."),
    C("c3", cp[2] + " · Facebook", "facebook", "Can I get a bulk order for a wedding? Around 60 pieces.", "Yes, we do bulk orders with a 10 percent discount. Our team will message you."),
    C("c4", cp[3] + " · LinkedIn", "linkedin", "Great founder story. Are you hiring for the design team?", "Thanks! We just posted an intern role; applications are open until the 15th."),
    C("c5", cp[4] + " · X", "x", "Product arrived damaged :( order #4417", "So sorry about that. We have DMed you to arrange a free replacement."),
    C("c6", cp[5] + " · Threads", "threads", "Which fabric is best for summer?", "Our handloom cotton is the lightest. Linen blends are great too.")
  ];

  var team = [
    ["Aarav Mehta", "Owner", "aarav@example.in"], ["Ishita Rao", "Editor", "ishita@example.in"], ["Kabir Das", "Approver", "kabir@example.in"],
    ["Nisha Arora", "Editor", "nisha@example.in"], ["Rohan Joshi", "Analyst", "rohan@example.in"], ["Tanya Iyer", "Client (view only)", "tanya@example.in"]
  ].map(function (m, i) { return { id: "u" + i, name: m[0], role: m[1], email: m[2], posts: F.int("tm" + i, 6, 64), last: (i + 1) + "h ago", status: i === 3 ? "Invited" : "Active" }; });

  var labels = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];
  AX.data.socialpush = {
    platforms: PLATFORMS, media: MEDIA, posts: posts, accounts: accounts, commentThreads: commentThreads, team: team, labels: labels,
    reach: PLATFORMS.map(function (p, i) { return { name: p.name, points: F.series("rch" + i, 8, 2000, 24000) }; }).slice(0, 3),
    followersSeries: F.series("fol", 8, 90000, 98000),
    engagement: PLATFORMS.map(function (p, i) { return F.int("eng" + i, 18, 94) / 10; })
  };
})(window);
