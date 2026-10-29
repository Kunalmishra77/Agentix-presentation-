(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};

  /** Pure. Order: subtotal -> discount -> gst -> shipping -> total; each component rounded to whole rupees. */
  function cartTotals(cart, products, o) {
    o = o || {};
    var gstRate = o.gstRate == null ? 0.18 : o.gstRate;
    var price = {};
    (products || []).forEach(function (p) { price[p.id] = p.price; });
    var sum = 0;
    (cart || []).forEach(function (l) { if (price[l.id] != null) sum += price[l.id] * l.qty; });
    var subtotal = Math.round(sum);
    var discount = o.coupon && o.coupon.pct ? Math.round(subtotal * o.coupon.pct / 100) : 0;
    var net = subtotal - discount;
    var gst = Math.round(net * gstRate);
    var shipping = o.freeOver != null && net >= o.freeOver ? 0 : Math.round(o.shipping || 0);
    return { subtotal: subtotal, discount: discount, gst: gst, shipping: shipping, total: net + gst + shipping };
  }

  function create(host, opt) {
    var el = AX.el;
    var products = opt.products || [];
    var cats = opt.categories || [];
    var quote = opt.checkout === "quote";
    var cur = opt.currency || "₹";
    var coupons = opt.coupons || [{ code: "WELCOME10", pct: 10 }];
    // drawers render outside .ax-app, so carry the demo's slug and accent into them
    var app = host.closest ? host.closest(".ax-app") : null;
    var accent = app ? app.style.getPropertyValue("--ax-accent").trim() : "";
    function scoped(body) {
      if (!app) return body;
      return el("div", { class: "demo-scope", "data-slug": app.getAttribute("data-slug") || "", style: accent ? { "--ax-accent": accent, "--orange": accent } : {} }, body);
    }
    var copt = { gstRate: opt.gstRate, shipping: opt.shipping || 0, freeOver: opt.freeOver };
    var cart = [];
    var coupon = null;
    var cat = "All";
    var cartDrawer = null, cartBody = null;
    var destroyed = false;

    function money(n) { return cur === "₹" ? AX.fmt.inr(n) : cur + AX.fmt.num(n); }
    function prod(id) { return products.filter(function (p) { return p.id === id; })[0]; }
    function totals() { return cartTotals(cart, products, Object.assign({}, copt, { coupon: coupon })); }
    function count() { return cart.reduce(function (s, l) { return s + l.qty; }, 0); }

    var grid = el("div", { class: "st-grid" });
    var cartBtn = quote ? null : el("button", { type: "button", class: "btn st-cart-btn", on: { click: openCart } });
    var filters = el("div", { class: "st-cats", role: "group", "aria-label": "Categories" });
    var root = el("div", { class: "st" }, el("div", { class: "st-bar" }, filters, cartBtn), grid);
    host.textContent = "";
    host.appendChild(root);

    function thumb(p) {
      if (p.img) return el("img", { class: "st-img", src: p.img, alt: p.name, loading: "lazy" });
      return el("div", { class: "st-img st-ph", "aria-hidden": "true" }, p.name.charAt(0));
    }
    function priceNode(p) {
      return el("div", { class: "st-price" },
        el("strong", {}, money(p.price)), p.mrp && p.mrp > p.price ? el("s", {}, money(p.mrp)) : null,
        p.mrp && p.mrp > p.price ? el("span", { class: "st-off" }, Math.round((1 - p.price / p.mrp) * 100) + "% off") : null);
    }

    function drawCats() {
      filters.textContent = "";
      ["All"].concat(cats).forEach(function (c) {
        filters.appendChild(el("button", { type: "button", class: "st-cat" + (cat === c ? " on" : ""), "aria-pressed": cat === c ? "true" : "false",
          on: { click: function () { cat = c; drawCats(); drawGrid(); var b = filters.querySelectorAll(".st-cat"); var i = ["All"].concat(cats).indexOf(c); if (b[i]) b[i].focus(); } } }, c));
      });
    }
    function drawGrid() {
      grid.textContent = "";
      products.filter(function (p) { return cat === "All" || p.cat === cat; }).forEach(function (p) {
        grid.appendChild(el("article", { class: "st-card", "data-id": p.id },
          thumb(p),
          el("div", { class: "st-info" },
            el("h3", { class: "st-name" }, p.name),
            priceNode(p),
            p.tags && p.tags.length ? el("div", { class: "st-tags" }, p.tags.map(function (t) { return el("span", { class: "st-tag" }, t); })) : null),
          el("button", { type: "button", class: "btn st-open", "aria-label": "View " + p.name, on: { click: function () { openProduct(p); } } }, "View")));
      });
    }
    function drawCartBtn() {
      if (!cartBtn) return;
      cartBtn.textContent = "";
      cartBtn.appendChild(document.createTextNode("Cart "));
      cartBtn.appendChild(el("span", { class: "st-count" }, String(count())));
    }

    function addToCart(p, qty, variant) {
      var line = cart.filter(function (l) { return l.id === p.id && (l.variant || "") === (variant || ""); })[0];
      if (line) line.qty += qty; else cart.push({ id: p.id, qty: qty, variant: variant || "" });
      drawCartBtn();
      if (cartBody && cartBody.isConnected) { view = "cart"; renderCart(); }
    }

    function openProduct(p) {
      var qty = 1, variant = (p.variants && p.variants[0]) || "";
      var qtyOut = el("span", { class: "st-qty-n", "aria-live": "polite" }, "1");
      function setQty(n) { qty = Math.max(1, n); qtyOut.textContent = String(qty); }
      var sel = p.variants && p.variants.length ? el("label", { class: "st-field" }, "Variant",
        el("select", { on: { change: function (e) { variant = e.target.value; } } },
          p.variants.map(function (v) { return el("option", { value: v }, v); }))) : null;
      var body = el("div", { class: "st-prod" },
        thumb(p), el("h3", {}, p.name), priceNode(p),
        p.tags && p.tags.length ? el("div", { class: "st-tags" }, p.tags.map(function (t) { return el("span", { class: "st-tag" }, t); })) : null,
        sel,
        el("div", { class: "st-qty" },
          el("button", { type: "button", class: "btn", "aria-label": "Decrease quantity", on: { click: function () { setQty(qty - 1); } } }, "−"),
          qtyOut,
          el("button", { type: "button", class: "btn", "aria-label": "Increase quantity", on: { click: function () { setQty(qty + 1); } } }, "+")),
        el("button", { type: "button", class: "btn btn-primary st-add", on: { click: function () {
          if (quote) {
            if (opt.onAdd) opt.onAdd(p, qty);
            AX.ui.toast("Added to quotation (simulated)", { kind: "sim" });
          } else {
            addToCart(p, qty, variant);
            AX.ui.toast("Added to cart (simulated)", { kind: "sim" });
          }
          dr.close();
        } } }, quote ? "Add to quotation" : "Add to cart"));
      var dr = AX.ui.drawer({ title: p.name, body: scoped(body) });
    }

    // ---- cart + checkout ----
    var view = "cart";
    function openCart() {
      view = "cart";
      cartBody = el("div", { class: "st-cartbody" });
      cartDrawer = AX.ui.drawer({ title: "Your cart", body: scoped(cartBody) });
      renderCart();
    }
    function line(l) {
      var p = prod(l.id);
      if (!p) return null;
      function bump(n) {
        l.qty += n;
        if (l.qty <= 0) cart.splice(cart.indexOf(l), 1);
        drawCartBtn(); renderCart();
      }
      return el("li", { class: "st-line" },
        el("div", { class: "st-line-info" }, el("strong", {}, p.name), l.variant ? el("small", {}, l.variant) : null,
          el("span", {}, money(p.price) + " × " + l.qty)),
        el("div", { class: "st-qty" },
          el("button", { type: "button", class: "btn", "aria-label": "Decrease " + p.name, on: { click: function () { bump(-1); } } }, "−"),
          el("span", { class: "st-qty-n" }, String(l.qty)),
          el("button", { type: "button", class: "btn", "aria-label": "Increase " + p.name, on: { click: function () { bump(1); } } }, "+")));
    }
    function totalsTable() {
      var t = totals();
      function row(k, v, cls) { return el("div", { class: "st-trow" + (cls ? " " + cls : "") }, el("span", {}, k), el("span", {}, v)); }
      return el("div", { class: "st-totals" },
        row("Subtotal", money(t.subtotal)),
        t.discount ? row("Discount (" + coupon.code + ")", "−" + money(t.discount)) : null,
        row("GST", money(t.gst)),
        row("Shipping", t.shipping ? money(t.shipping) : "Free"),
        row("Total", money(t.total), "st-grand"));
    }
    function renderCart() {
      if (!cartBody) return;
      cartBody.textContent = "";
      if (view === "checkout") return renderCheckout();
      if (!cart.length) { cartBody.appendChild(el("p", { class: "st-empty" }, "Your cart is empty.")); return; }
      var code = el("input", { class: "st-in", type: "text", placeholder: "Coupon code", "aria-label": "Coupon code" });
      var msg = el("small", { class: "st-msg", role: "status" }, coupon ? "Applied " + coupon.code : "");
      cartBody.appendChild(el("ul", { class: "st-lines" }, cart.map(line)));
      cartBody.appendChild(el("div", { class: "st-coupon" }, code,
        el("button", { type: "button", class: "btn", on: { click: function () {
          var c = coupons.filter(function (x) { return x.code.toLowerCase() === code.value.trim().toLowerCase(); })[0];
          if (c) { coupon = c; renderCart(); } else { msg.textContent = "Coupon not valid"; }
        } } }, "Apply"), msg));
      cartBody.appendChild(totalsTable());
      cartBody.appendChild(el("button", { type: "button", class: "btn btn-primary st-checkout", on: { click: function () { view = "checkout"; renderCart(); } } }, "Checkout"));
    }
    function renderCheckout() {
      var errs = el("small", { class: "st-err", role: "alert" });
      var f = {
        name: el("input", { class: "st-in st-in-name", type: "text", autocomplete: "off", required: true }),
        phone: el("input", { class: "st-in st-in-phone", type: "tel", autocomplete: "off", required: true }),
        address: el("textarea", { class: "st-in st-in-address", rows: "3", required: true })
      };
      function field(label, node) { return el("label", { class: "st-field" }, label, node); }
      cartBody.appendChild(el("h3", {}, "Delivery details"));
      cartBody.appendChild(field("Name", f.name));
      cartBody.appendChild(field("Phone", f.phone));
      cartBody.appendChild(field("Address", f.address));
      cartBody.appendChild(totalsTable());
      cartBody.appendChild(errs);
      cartBody.appendChild(el("div", { class: "st-actions" },
        el("button", { type: "button", class: "btn", on: { click: function () { view = "cart"; renderCart(); } } }, "Back"),
        el("button", { type: "button", class: "btn btn-primary st-place", on: { click: function () {
          if (!f.name.value.trim() || !f.phone.value.trim() || !f.address.value.trim()) { errs.textContent = "Please fill in name, phone and address."; return; }
          var t = totals();
          var id = "AX-" + (100000 + Math.floor(Math.random() * 900000));
          var lines = cart.map(function (l) { var p = prod(l.id); return { id: l.id, name: p ? p.name : l.id, qty: l.qty }; });
          if (opt.onOrder) opt.onOrder({ id: id, total: t.total, lines: lines, name: f.name.value.trim(), phone: f.phone.value.trim() });
          cart = []; coupon = null; drawCartBtn();
          cartBody.textContent = "";
          cartBody.appendChild(el("div", { class: "st-done" },
            el("div", { class: "st-tick", "aria-hidden": "true" }, "✓"),
            el("h3", {}, "Order confirmed"),
            el("p", {}, "Order ", el("strong", { class: "st-order-id" }, id), " · " + money(t.total)),
            el("p", { class: "st-note" }, "Simulated — no payment was taken and nothing was sent."),
            el("button", { type: "button", class: "btn", on: { click: function () { if (cartDrawer) cartDrawer.close(); } } }, "Continue shopping")));
          AX.ui.toast("Order " + id + " placed (simulated)", { kind: "sim" });
        } } }, "Place order (simulated)")));
    }

    drawCats(); drawGrid(); drawCartBtn();
    AX.mount(host, function () { destroyed = true; if (cartDrawer) cartDrawer.close(); });
    return {
      cart: function () { return cart.map(function (l) { return Object.assign({}, l); }); },
      totals: totals
    };
  }

  AX.store = { cartTotals: cartTotals, create: create };
})(window);
