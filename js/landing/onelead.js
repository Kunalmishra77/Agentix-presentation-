/* "One lead, every system": a deep-navy band pinned for ~400vh. One fictional enquiry travels
   through six products, each beat a small recreated UI. Reduced motion: a static vertical list. */
(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  var el = AX.el;
  var root, beats = [], rail;

  function first(name) { return String(name).split(" ")[0]; }

  function bubble(cls, text, meta) {
    return el("div", { class: "ol-bub " + cls }, el("span", { class: "ol-bub-t" }, text), meta ? el("span", { class: "ol-bub-m" }, meta) : null);
  }

  function phone(person, body) {
    return el("div", { class: "ol-phone" },
      el("div", { class: "ol-wa-head" }, el("span", { class: "ol-ava" }, "U"),
        el("span", { class: "ol-wa-who" }, el("b", null, "Umang Hospital"), el("small", null, "AGENTiX agent, online"))),
      el("div", { class: "ol-wa-body" }, body));
  }

  function ui1(p) {
    return phone(p, [
      el("div", { class: "ol-day" }, "Today"),
      bubble("in u1-msg", "Hi, saw your ad — price for the full-body checkup?", "9:41"),
      el("div", { class: "ol-typing u1-typing", "aria-label": "Agent is typing" }, el("i"), el("i"), el("i"))
    ]);
  }

  function ui2(p) {
    var chip = el("span", { class: "ol-chip" },
      el("span", { class: "ol-chip-s s-lead" }, "Lead"), el("span", { class: "ol-chip-s s-hot" }, "Hot"), el("span", { class: "ol-chip-s s-booked" }, "Booked"));
    var card = el("div", { class: "ol-kcard u2-card" }, el("b", null, p.name), el("small", null, p.phone), chip);
    return el("div", { class: "ol-split" },
      phone(p, [
        bubble("out u2-a", "The Full Body Checkup is ₹2,499 for 72 tests. Tomorrow at 8:30 or 10:00 am?", "9:41"),
        bubble("in u2-b", "8:30 please", "9:42"),
        bubble("out u2-c", "Booked for tomorrow, 8:30 am. Please come fasting.", "9:42")
      ]),
      el("div", { class: "ol-kanban" },
        el("div", { class: "ol-kcols" }, ["Lead", "Hot", "Booked"].map(function (c) { return el("div", { class: "ol-kcol" }, el("span", null, c)); })),
        card));
  }

  function ui3(p) {
    var rows = [["11", "Rakesh Yadav", "Vitals"], ["12", "Sunita Bansal", "Consult"], ["13", "Arjun Mehra", "Waiting"]];
    if (AX.fake) rows = rows.map(function (r, i) { return [r[0], AX.fake.person("queue" + i).name, r[2]]; });
    return el("div", { class: "ol-app ol-hims" },
      el("div", { class: "ol-app-bar" }, el("b", null, "Umang HIMS"), el("span", null, "Reception, OPD")),
      el("div", { class: "ol-reg u3-reg" },
        el("div", { class: "ol-reg-id" }, el("small", null, "UHID"), el("b", null, "UMG-2611-0142")),
        el("div", null, el("b", null, p.name), el("small", null, "34 F, Full Body Checkup")),
        el("span", { class: "ol-ok" }, "Registered")),
      el("ol", { class: "ol-queue" },
        rows.map(function (r) { return el("li", null, el("span", { class: "q-tok" }, r[0]), el("span", { class: "q-name" }, r[1]), el("span", { class: "q-st" }, r[2])); }),
        el("li", { class: "is-new u3-new" }, el("span", { class: "q-tok" }, "14"), el("span", { class: "q-name" }, p.name), el("span", { class: "q-st" }, "Joined OPD queue"))));
  }

  function ui4(p) {
    var lines = [["Full Body Checkup, 72 tests", "₹2,117.80"], ["CGST 9%", "₹190.60"], ["SGST 9%", "₹190.60"]];
    return el("div", { class: "ol-app ol-folio" },
      el("div", { class: "ol-app-bar" }, el("b", null, "Billing folio"), el("span", null, "INV/26-27/0918")),
      el("div", { class: "ol-folio-to" }, el("small", null, "Bill to"), el("b", null, p.name), el("small", null, "GSTIN not applicable, individual")),
      el("table", { class: "ol-lines" }, el("tbody", null, lines.map(function (l) {
        return el("tr", { class: "u4-line" }, el("td", null, l[0]), el("td", null, l[1]));
      }), el("tr", { class: "ol-total u4-line" }, el("td", null, "Total"), el("td", null, "₹2,499.00")))),
      el("span", { class: "ol-stamp u4-stamp" }, "Paid by UPI"));
  }

  function ui5() {
    var plats = [["Instagram", "Reel"], ["YouTube", "Short"], ["Facebook", "Reel"]];
    return el("div", { class: "ol-app ol-push" },
      el("div", { class: "ol-app-bar" }, el("b", null, "SocialPush"), el("span", null, "Composer")),
      el("div", { class: "ol-post" },
        el("div", { class: "ol-reel", "aria-hidden": "true" }, el("span", null, "5 signs it's time for a full-body checkup")),
        el("ul", { class: "ol-plats" }, plats.map(function (x) {
          return el("li", { class: "u5-plat" }, el("b", null, x[0]), el("small", null, x[1]),
            el("span", { class: "ol-pst" }, el("span", { class: "pst-q" }, "Queued"), el("span", { class: "pst-s" }, "Scheduled, Sat 10:00")));
        }))));
  }

  function ui6() {
    var pts = [12, 14, 13, 17, 16, 19, 21, 20, 24, 27, 26, 31];
    var d = pts.map(function (v, i) { return (i ? "L" : "M") + (i * (200 / 11)).toFixed(1) + " " + (60 - v * 1.6).toFixed(1); }).join(" ");
    var svg = el("span", { class: "ol-spark", html: '<svg viewBox="0 0 200 64" preserveAspectRatio="none" aria-hidden="true"><path class="u6-line" d="' + d + '" pathLength="1"/></svg>' });
    return el("div", { class: "ol-app ol-dash" },
      el("div", { class: "ol-app-bar" }, el("b", null, "Agentix CRM"), el("span", null, "Revenue, this month")),
      el("div", { class: "ol-rev" }, el("small", null, "Revenue"), el("b", { class: "u6-num" }, "₹4,14,799"), el("span", { class: "ol-up" }, "+₹2,499 just now")),
      svg,
      el("div", { class: "ol-mini" },
        el("div", null, el("small", null, "Leads today"), el("b", null, "38")),
        el("div", null, el("small", null, "Booked"), el("b", null, "12")),
        el("div", null, el("small", null, "Reply time"), el("b", null, "0.8 s"))));
  }

  function beatData(p) {
    var f = first(p.name);
    return [
      { slug: "agentix", product: "AGENTiX", title: "A WhatsApp message arrives",
        text: f + " sees a hospital ad and asks about the price on WhatsApp. The AGENTiX agent picks it up straight away.", ui: ui1(p) },
      { slug: "agentix", product: "AGENTiX CRM", title: "The AI replies and books",
        text: "The agent quotes the package, offers two slots and books one. The lead card heats up from Lead to Hot to Booked.", ui: ui2(p) },
      { slug: "umang-hims", product: "Umang HIMS", title: "Registered and in the OPD queue",
        text: "At the desk, " + f + " is already registered with a UHID and joins the OPD queue as token 14.", ui: ui3(p) },
      { slug: "woodpecker-pms", product: "Woodpecker folio billing", title: "The bill is generated with GST",
        text: "The same folio engine that runs our hotel PMS raises the invoice, splits CGST and SGST and records the UPI payment.", ui: ui4(p) },
      { slug: "socialpush", product: "SocialPush", title: "A follow-up reel is scheduled",
        text: "A health-tips reel for people like " + f + " is queued once and scheduled to Instagram, YouTube and Facebook.", ui: ui5(p) },
      { slug: "agentix-crm", product: "Agentix CRM", title: "Revenue ticks up",
        text: "The booking lands on the dashboard. Revenue moves by ₹2,499, and nobody had to copy a thing between systems.", ui: ui6(p) }
    ];
  }

  function build(ctx) {
    var p = AX.fake ? AX.fake.person("one-lead-priya") : { name: "Priya Sharma", phone: "+91 98xxx x0000" };
    var data = beatData(p);
    beats = data.map(function (b, i) {
      var link = el("a", { class: "beat-link", href: "#/demo/" + b.slug, "data-demo": b.slug, on: { click: function (e) {
        e.preventDefault(); AX.shell.open(b.slug, "overview", null, e.currentTarget.closest(".beat").querySelector(".beat-ui").getBoundingClientRect());
      } } }, "Open the " + b.product + " demo");
      return el("article", { class: "beat", "data-beat": String(i + 1) },
        el("div", { class: "beat-cap" },
          el("span", { class: "beat-step" }, el("b", null, String(i + 1)), " of 6, ", b.product),
          el("h3", { class: "beat-title" }, b.title),
          el("p", { class: "beat-text" }, b.text),
          link),
        el("div", { class: "beat-ui" }, b.ui));
    });
    rail = el("ol", { class: "ol-rail", "aria-hidden": "true" }, data.map(function (b, i) {
      return el("li", { class: "ol-node" + (i === 0 ? " is-on" : "") }, el("i"), el("span", null, b.product));
    }), el("span", { class: "ol-fill" }));
    root = el("section", { id: "onelead", class: "onelead" + (ctx.reduced ? " is-static" : ""), "aria-labelledby": "ol-h" },
      el("div", { class: "ol-pin" },
        el("header", { class: "ol-head" },
          el("h2", { id: "ol-h", class: "ol-h" }, "One lead, every system"),
          el("p", { class: "ol-lede" }, "Follow one fictional enquiry, " + p.name + ", through six of our products. Nothing here is copied by hand.")),
        el("div", { class: "ol-stage" }, beats),
        rail));
    return root;
  }

  function setup(ctx) {
    var gsap = w.gsap;
    if (ctx.reduced || !gsap) return;
    var q = function (b, s) { return b.querySelectorAll(s); };
    var nodes = rail.querySelectorAll(".ol-node");
    beats.forEach(function (b, i) { if (i) gsap.set(b, { autoAlpha: 0 }); });
    // hidden starting states for the inner micro-animations
    gsap.set(q(beats[0], ".u1-msg"), { autoAlpha: 0, y: 16 });
    gsap.set(q(beats[1], ".u2-a, .u2-b, .u2-c"), { autoAlpha: 0, y: 14 });
    gsap.set(q(beats[1], ".s-hot, .s-booked"), { autoAlpha: 0 });
    gsap.set(q(beats[2], ".u3-new"), { autoAlpha: 0, x: 40 });
    gsap.set(q(beats[2], ".u3-reg"), { autoAlpha: 0, y: 14 });
    gsap.set(q(beats[3], ".u4-line"), { autoAlpha: 0, x: -14 });
    gsap.set(q(beats[3], ".u4-stamp"), { autoAlpha: 0, scale: 1.6, rotation: -14 });
    gsap.set(q(beats[4], ".pst-s"), { autoAlpha: 0 });
    gsap.set(q(beats[5], ".u6-line"), { strokeDasharray: 1, strokeDashoffset: 1 });

    var tl = gsap.timeline({
      defaults: { ease: "power2.out", duration: 0.2 },
      scrollTrigger: {
        id: "onelead", trigger: root, start: "top top", end: "+=400%", pin: root.querySelector(".ol-pin"), scrub: 0.5,
        onUpdate: function (st) {
          var k = Math.min(5, Math.floor(st.progress * 6 * 0.999 + 0.0001));
          Array.prototype.forEach.call(nodes, function (n, j) { n.classList.toggle("is-on", j <= k); n.classList.toggle("is-now", j === k); });
        }
      }
    });
    tl.to(rail.querySelector(".ol-fill"), { scaleX: 1, duration: 6, ease: "none" }, 0);
    beats.forEach(function (b, i) {
      var t = i;
      if (i) tl.fromTo(b, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.18 }, t);
      if (i < beats.length - 1) tl.to(b, { autoAlpha: 0, y: -40, duration: 0.15, ease: "power1.in" }, t + 0.85);
    });
    var B = beats;
    tl.to(q(B[0], ".u1-msg"), { autoAlpha: 1, y: 0 }, 0.05)
      .to(q(B[0], ".u1-typing"), { autoAlpha: 0.35, duration: 0.1 }, 0.6)
      .to(q(B[1], ".u2-a"), { autoAlpha: 1, y: 0 }, 1.18)
      .to(q(B[1], ".u2-b"), { autoAlpha: 1, y: 0 }, 1.35)
      .to(q(B[1], ".u2-c"), { autoAlpha: 1, y: 0 }, 1.5)
      .to(q(B[1], ".u2-card"), { xPercent: 100, duration: 0.12 }, 1.33)
      .to(q(B[1], ".s-lead"), { autoAlpha: 0, duration: 0.05 }, 1.33)
      .to(q(B[1], ".s-hot"), { autoAlpha: 1, duration: 0.05 }, 1.35)
      .to(q(B[1], ".u2-card"), { xPercent: 200, duration: 0.12 }, 1.55)
      .to(q(B[1], ".s-hot"), { autoAlpha: 0, duration: 0.05 }, 1.55)
      .to(q(B[1], ".s-booked"), { autoAlpha: 1, duration: 0.05 }, 1.57)
      .to(q(B[2], ".u3-reg"), { autoAlpha: 1, y: 0 }, 2.15)
      .to(q(B[2], ".u3-new"), { autoAlpha: 1, x: 0 }, 2.4)
      .to(q(B[3], ".u4-line"), { autoAlpha: 1, x: 0, stagger: 0.08 }, 3.15)
      .to(q(B[3], ".u4-stamp"), { autoAlpha: 1, scale: 1, rotation: -8, ease: "back.out(2)", duration: 0.15 }, 3.55)
      .to(q(B[4], ".pst-q"), { autoAlpha: 0, duration: 0.05, stagger: 0.1 }, 4.3)
      .to(q(B[4], ".pst-s"), { autoAlpha: 1, duration: 0.05, stagger: 0.1 }, 4.32)
      .to(q(B[5], ".u6-line"), { strokeDashoffset: 0, duration: 0.5, ease: "none" }, 5.1);
    var num = q(B[5], ".u6-num")[0], val = { v: 412300 };
    tl.fromTo(val, { v: 412300 }, { v: 414799, duration: 0.4, ease: "none", onUpdate: function () { num.textContent = AX.fmt.inr(val.v); } }, 5.25);
    tl.to({}, { duration: 0.15 }, 5.85); // hold the last beat before unpinning
  }

  AX.onelead = { build: build, setup: setup };
})(window);
