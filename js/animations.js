/* ============================================================
   REVEAL ANIMATIONS — Qamar Zaka Portfolio
   Uses IntersectionObserver. Respects prefers-reduced-motion.
   ============================================================ */

(function () {
  'use strict';

  // Immediately reveal all when motion is reduced
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
    return;
  }

  /* ── Single element observer ─────────────────────────── */
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -32px 0px',
    }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── Staggered group observer ────────────────────────── */
  // Elements inside a [data-stagger] parent are revealed with a delay
  const staggerObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const children = entry.target.querySelectorAll('[data-stagger-child]');
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add('in-view'), i * 90);
        });
        staggerObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.05 }
  );

  document.querySelectorAll('[data-stagger]').forEach(el => staggerObserver.observe(el));

  /* ── Dynamic reveal re-run (after filter changes) ────── */
  // Watch for newly visible elements (e.g., after portfolio filter)
  const mutObserver = new MutationObserver(() => {
    document.querySelectorAll('.reveal:not(.in-view)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        el.classList.add('in-view');
      } else {
        revealObserver.observe(el);
      }
    });
  });

  const grid = document.getElementById('projects-grid');
  if (grid) {
    mutObserver.observe(grid, { attributes: true, subtree: true, attributeFilter: ['class'] });
  }

})();
