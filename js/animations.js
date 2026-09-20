/* ============================================================
   KINETIC & REVEAL ANIMATIONS — Qamar Zaka Portfolio
   Uses IntersectionObserver, spring easing & interactive physics.
   Respects prefers-reduced-motion.
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
  const staggerObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const children = entry.target.querySelectorAll('[data-stagger-child]');
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add('in-view'), i * 80);
        });
        staggerObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.05 }
  );

  document.querySelectorAll('[data-stagger]').forEach(el => staggerObserver.observe(el));

  /* ── Dynamic reveal re-run (after filter changes) ────── */
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

  /* ── Interactive Magnetic & Micro-Tilt Physics (Desktop Only) ─ */
  const isPointerFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (isPointerFine) {
    // 1. Smooth 3D tilt on Hero Photo Frame
    const heroWrap = document.getElementById('hero-photo-wrap');
    if (heroWrap) {
      heroWrap.addEventListener('mousemove', e => {
        const rect = heroWrap.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        heroWrap.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-4px)`;
      });

      heroWrap.addEventListener('mouseleave', () => {
        heroWrap.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
      });
    }

    // 2. Interactive Spotlight on Project Cards
    const interactiveCards = document.querySelectorAll('.project-card, .service-card, .insight-card, .tcard');
    interactiveCards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

})();

