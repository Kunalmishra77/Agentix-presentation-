/* Simulation layer for locally bundled client sites shown inside the portfolio's browser frame.
   Nothing is ever sent: forms and tel:/mailto:/wa.me links are intercepted and reported to the parent. */
(function () {
  "use strict";
  function say(text) {
    try { console.info("[AX sim] " + text); } catch (e) { /* ignore */ }
    try { if (window.parent && window.parent !== window) window.parent.postMessage({ ax: "sim", text: text }, "*"); } catch (e) { /* ignore */ }
  }
  document.addEventListener("submit", function (e) {
    e.preventDefault();
    say("Simulated \u2014 form submitted (nothing was sent)");
  }, true);
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    var h = (a.getAttribute("href") || "").toLowerCase();
    if (h.indexOf("tel:") === 0) { e.preventDefault(); say("Simulated \u2014 call link (no call placed)"); }
    else if (h.indexOf("mailto:") === 0) { e.preventDefault(); say("Simulated \u2014 email link (no email opened)"); }
    else if (h.indexOf("wa.me") !== -1) { e.preventDefault(); say("Simulated \u2014 WhatsApp link (no chat opened)"); }
  }, true);
})();
