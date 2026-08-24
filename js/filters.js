/* ============================================================
   PORTFOLIO FILTER — Qamar Zaka Portfolio
   ============================================================ */

(function () {
  'use strict';

  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  let current = 'all';

  function filter(category) {
    current = category;

    projectCards.forEach(card => {
      const cat  = card.dataset.category || '';
      const show = category === 'all' || cat === category;
      card.classList.toggle('filtered-out', !show);
    });

    // Announce to screen readers
    const visibleCount = [...projectCards].filter(c => !c.classList.contains('filtered-out')).length;
    announce(`Showing ${visibleCount} project${visibleCount !== 1 ? 's' : ''}`);
  }

  // Live region for screen-reader announcements
  function announce(msg) {
    let region = document.getElementById('filter-announce');
    if (!region) {
      region = document.createElement('div');
      region.id = 'filter-announce';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      region.className = 'sr-only';
      document.body.appendChild(region);
    }
    region.textContent = '';
    // Timeout ensures the DOM update triggers the announcement
    setTimeout(() => { region.textContent = msg; }, 50);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update ARIA and visual active state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      filter(btn.dataset.filter);
    });

    // Keyboard: arrow key navigation between filter tabs
    btn.addEventListener('keydown', e => {
      const all  = [...filterBtns];
      const idx  = all.indexOf(e.currentTarget);
      let next   = -1;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        next = (idx + 1) % all.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        next = (idx - 1 + all.length) % all.length;
      } else if (e.key === 'Home') {
        next = 0;
      } else if (e.key === 'End') {
        next = all.length - 1;
      }

      if (next >= 0) {
        e.preventDefault();
        all[next].focus();
        all[next].click();
      }
    });
  });

  // Init
  filter('all');

})();
