/* Landing preloader: brain mark draws, wordmark settles, counter ticks 0 -> project count, then wipes up.
   Shown once per session; skipped under reduced motion and on demo deep links. */
(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  var el = AX.el;
  var KEY = "ax.preloader.seen";

  function seen() { try { return w.sessionStorage.getItem(KEY) === "1"; } catch (e) { return false; } }
  function remember() { try { w.sessionStorage.setItem(KEY, "1"); } catch (e) {} }

  function wordmark(cls) {
    // AGENTiX with the orange A and i, matching the logo
    return el("span", { class: cls || "wordmark", "aria-label": "AGENTiX" },
      "AGENTiX".split("").map(function (ch, i) {
        return el("span", { class: "wm-ch" + (i === 0 || ch === "i" ? " wm-accent" : ""), "aria-hidden": "true" }, ch);
      }));
  }

  function run(opts) {
    opts = opts || {};
    var total = (AX.projects || []).length;
    var skip = opts.reduced || seen() || !w.gsap || (AX.router && AX.router.current().view === "demo");
    if (skip) { remember(); return Promise.resolve(false); }
    w.__axPreloaderShown = true;

    var count = el("span", { class: "pl-count", "aria-hidden": "true" }, "00");
    var mark = AX.ui.mark("pl-mark");
    var root = el("div", { id: "preloader", class: "preloader", role: "status", "aria-label": "Loading the AI Agentix portfolio" },
      el("div", { class: "pl-inner" },
        mark,
        wordmark("wordmark pl-word"),
        el("div", { class: "pl-meta", "aria-hidden": "true" }, count, el("span", { class: "pl-of" }, " / " + total + " projects"))));
    document.body.appendChild(root);

    return new Promise(function (resolve) {
      var gsap = w.gsap;
      var paths = mark.querySelectorAll("path");
      Array.prototype.forEach.call(paths, function (p) {
        var len = p.getTotalLength ? p.getTotalLength() : 200;
        p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
      });
      var n = { v: 0 };
      var done = false;
      function finish() {
        if (done) return; done = true;
        remember();
        if (root.parentNode) root.parentNode.removeChild(root);
        resolve(true);
      }
      var tl = gsap.timeline({ onComplete: finish });
      tl.to(paths, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut", stagger: 0.06 }, 0)
        .from(root.querySelectorAll(".wm-ch"), { yPercent: 110, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.05 }, 0.35)
        .to(n, { v: total, duration: 1.3, ease: "power1.inOut", onUpdate: function () {
          count.textContent = String(Math.round(n.v)).padStart(2, "0");
        } }, 0.1)
        .to(root.querySelector(".pl-inner"), { yPercent: -30, opacity: 0, duration: 0.45, ease: "power2.in" }, 1.55)
        .to(root, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "power4.inOut" }, 1.7);
      // Safety net if the tab is backgrounded and rAF stalls.
      setTimeout(function () { tl.progress(1); finish(); }, 6000);
    });
  }

  AX.preloader = { run: run, wordmark: wordmark };
})(window);
