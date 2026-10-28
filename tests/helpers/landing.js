"use strict";
// Shared waits for the landing e2e tests: poll for stable state instead of sleeping.

/** Landing finished its preloader and init. */
const ready = (page) => page.waitForFunction(() => document.documentElement.classList.contains("ax-ready"), null, { timeout: 15000 });

/**
 * Scroll position unchanged for `ms` and every scrubbed ScrollTrigger animation caught up with its scroll progress.
 * Works with no ScrollTrigger at all (reduced motion).
 */
const settled = (page, ms = 250, timeout = 8000) => page.waitForFunction((hold) => {
  const now = performance.now(), y = Math.round(scrollX * 100000 + scrollY);
  const s = (window.__axSettle = window.__axSettle || { y: NaN, t: now });
  if (s.y !== y) { s.y = y; s.t = now; return false; }
  const all = window.ScrollTrigger ? ScrollTrigger.getAll() : [];
  const caught = all.every((st) => !st.vars.scrub || !st.animation || Math.abs(st.animation.progress() - st.progress) < 0.004);
  if (!caught) { s.t = now; return false; }
  return now - s.t >= hold;
}, ms, { polling: 50, timeout });

/** Effective opacity: own opacity times every ancestor's (opacity is not inherited in getComputedStyle). */
const EFF = "(n) => { let o = 1; for (let x = n; x && x.nodeType === 1; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.visibility === 'hidden' || cs.display === 'none') return 0; o *= +cs.opacity; } return o; }";

module.exports = { ready, settled, EFF };
