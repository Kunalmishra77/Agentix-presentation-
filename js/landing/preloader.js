/* Landing preloader: the original Agentix brain mark scales in, the wordmark is revealed left to right,
   a counter ticks 0 -> project count, then the curtain wipes up.
   Shown once per session; skipped under reduced motion and on demo deep links. */
(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  var el = AX.el;
  var KEY = "ax.preloader.seen";

  function seen() { try { return w.sessionStorage.getItem(KEY) === "1"; } catch (e) { return false; } }
  function remember() { try { w.sessionStorage.setItem(KEY, "1"); } catch (e) {} }

  /** The original AGENTiX wordmark image (kept as AX.preloader.wordmark for callers). */
  function wordmark(cls, light) { return AX.ui.wordmark({ cls: cls || "", light: !!light }); }

  function run(opts) {
    opts = opts || {};
    var total = (AX.projects || []).length;
    var skip = opts.reduced || seen() || !w.gsap || (AX.router && AX.router.current().view === "demo");
    if (skip) { remember(); return Promise.resolve(false); }
    w.__axPreloaderShown = true;

    var count = el("span", { class: "pl-count", "aria-hidden": "true" }, "00");
    var mark = AX.ui.mark("pl-mark");
    var word = el("span", { class: "pl-word" }, wordmark("pl-word-img"));
    var bar = el("span", { class: "pl-bar", "aria-hidden": "true" }, el("i"));
    var root = el("div", { id: "preloader", class: "preloader", role: "status", "aria-label": "Loading the AI Agentix portfolio" },
      el("div", { class: "pl-inner" },
        mark, word, bar,
        el("div", { class: "pl-meta", "aria-hidden": "true" }, count, el("span", { class: "pl-of" }, " / " + total + " projects"))));
    document.body.appendChild(root);

    return new Promise(function (resolve) {
      var gsap = w.gsap;
      var n = { v: 0 };
      var done = false;
      function finish() {
        if (done) return; done = true;
        remember();
        if (root.parentNode) root.parentNode.removeChild(root);
        resolve(true);
      }
      var tl = gsap.timeline({ onComplete: finish });
      tl.fromTo(mark, { scale: 0.72, opacity: 0, y: 14 }, { scale: 1, opacity: 1, y: 0, duration: 0.9, ease: "expo.out" }, 0)
        .fromTo(word, { clipPath: "inset(0 100% 0 0)", y: 8 }, { clipPath: "inset(0 0% 0 0)", y: 0, duration: 0.8, ease: "power3.inOut" }, 0.3)
        .fromTo(bar.firstChild, { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: "power1.inOut" }, 0.1)
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
