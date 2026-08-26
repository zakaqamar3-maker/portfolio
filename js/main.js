/* ============================================================
   MAIN — Qamar Zaka Portfolio
   Navbar · Mobile Menu · Smooth Scroll · Active Links · Form
   ============================================================ */

(function () {
  'use strict';

  /* ── Helpers ───────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ── Navbar scroll ─────────────────────────────────────── */
  const navbar = $('#navbar');
  const SCROLL_THRESHOLD = 60;

  function onScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ── Mobile Menu ───────────────────────────────────────── */
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobile-menu');
  const mobileMenuLinks = $$('.mobile-menu__link', mobileMenu);
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    // Focus first link for accessibility
    const first = mobileMenu.querySelector('.mobile-menu__link');
    if (first) setTimeout(() => first.focus(), 50);
  }

  function closeMenu() {
    menuOpen = false;
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  hamburger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());

  // Close on mobile link click
  mobileMenuLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });

  // Trap focus in menu (basic implementation)
  mobileMenu.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = $$('a, button, [tabindex]:not([tabindex="-1"])', mobileMenu)
      .filter(el => !el.closest('[hidden]'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    }
  });

  /* ── Smooth Scroll with Navbar Offset ──────────────────── */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
      ) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Active Navigation Links ───────────────────────────── */
  const sections = $$('section[id]');
  const navLinks = $$('.navbar__link');
  const mobileNavLinks = $$('.mobile-menu__link');

  function updateActiveNav() {
    const scrollMid = window.scrollY + window.innerHeight / 3;

    let activeSectionId = null;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollMid >= top && scrollMid < bottom) {
        activeSectionId = section.id;
      }
    });

    const updateLinks = (links) => {
      links.forEach(link => {
        const href = link.getAttribute('href');
        const isActive = href === '#' + activeSectionId;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    };

    updateLinks(navLinks);
    updateLinks(mobileNavLinks);
  }

  /* ── Contact Form ──────────────────────────────────────── */
  const form = $('#contact-form');
  const formSuccess = $('#form-success');

  if (form && formSuccess) {
    // Live validation: clear error on change
    $$('input, select, textarea', form).forEach(field => {
      ['input', 'change'].forEach(evt => {
        field.addEventListener(evt, () => clearFieldError(field));
      });
    });

    function showFieldError(field, msg) {
      field.classList.add('is-error');
      field.setAttribute('aria-invalid', 'true');
      const errEl = document.getElementById(field.id + '-err');
      if (errEl) {
        errEl.textContent = msg;
        errEl.removeAttribute('hidden');
        field.setAttribute('aria-describedby', errEl.id);
      }
    }

    function clearFieldError(field) {
      field.classList.remove('is-error');
      field.removeAttribute('aria-invalid');
      const errEl = document.getElementById(field.id + '-err');
      if (errEl) {
        errEl.textContent = '';
        errEl.setAttribute('hidden', '');
      }
    }

    function validateForm() {
      let valid = true;
      const name    = $('#f-name');
      const email   = $('#f-email');
      const message = $('#f-message');

      if (!name.value.trim()) {
        showFieldError(name, 'Please enter your name.');
        if (valid) { name.focus(); valid = false; }
      }

      if (!email.value.trim()) {
        showFieldError(email, 'Please enter your email address.');
        if (valid) { email.focus(); valid = false; }
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        showFieldError(email, 'Please enter a valid email address.');
        if (valid) { email.focus(); valid = false; }
      }

      if (!message.value.trim()) {
        showFieldError(message, 'Please enter a message.');
        if (valid) { message.focus(); valid = false; }
      }

      return valid;
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!validateForm()) return;

      const btn = form.querySelector('[type="submit"]');
      const btnText = btn ? btn.querySelector('.btn-text') : null;
      if (btn) btn.disabled = true;
      if (btnText) btnText.textContent = 'Sending…';

      const name = $('#f-name').value.trim();
      const email = $('#f-email').value.trim();
      const typeSelect = $('#f-type');
      const type = typeSelect ? typeSelect.options[typeSelect.selectedIndex].text : 'General Inquiry';
      const message = $('#f-message').value.trim();

      try {
        const payload = {
          name: name,
          email: email,
          project_type: type,
          message: message,
          _subject: `📩 New Lead from ${name}`,
          _captcha: "false"
        };

        await fetch('https://formsubmit.co/ajax/zakaqmar3@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        // Smoothly hide form and show success message on site
        form.setAttribute('hidden', '');
        if (formSuccess) {
          formSuccess.classList.add('visible');
          formSuccess.focus();
        }
      } catch (err) {
        form.setAttribute('hidden', '');
        if (formSuccess) {
          formSuccess.classList.add('visible');
          formSuccess.focus();
        }
      } finally {
        if (btn) btn.disabled = false;
        if (btnText) btnText.textContent = 'Send Message ↗';
      }
    });
  }

  /* ── Hero Photo 3D Interactive Parallax ────────────────── */
  const heroSection   = $('.hero');
  const photoWrap     = $('#hero-photo-wrap');
  const photoFrame    = $('#hero-photo-frame');
  const decoBox       = $('#hero-deco-box');
  const decoCircle    = $('#hero-deco-circle');
  const floatPill     = $('#hero-float-pill');

  if (heroSection && photoWrap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let targetRx = 0, targetRy = 0;
    let currentRx = 0, currentRy = 0;
    let targetBoxX = 0, targetBoxY = 0;
    let currentBoxX = 0, currentBoxY = 0;
    let isHovered = false;
    let animFrame = null;

    function onMouseMove(e) {
      const rect = photoWrap.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const normX = (e.clientX - centerX) / (window.innerWidth / 2);
      const normY = (e.clientY - centerY) / (window.innerHeight / 2);

      // Clamped degrees
      targetRy = Math.max(-12, Math.min(12, normX * 14));
      targetRx = Math.max(-12, Math.min(12, -normY * 14));

      targetBoxX = normX * 18;
      targetBoxY = normY * 18;

      if (!isHovered) {
        isHovered = true;
        renderParallax();
      }
    }

    function renderParallax() {
      // Smooth lerp (linear interpolation)
      currentRx += (targetRx - currentRx) * 0.12;
      currentRy += (targetRy - currentRy) * 0.12;
      currentBoxX += (targetBoxX - currentBoxX) * 0.12;
      currentBoxY += (targetBoxY - currentBoxY) * 0.12;

      if (photoFrame) {
        photoFrame.style.transform = `perspective(900px) rotateX(${currentRx.toFixed(2)}deg) rotateY(${currentRy.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      }

      if (decoBox) {
        decoBox.style.transform = `translate3d(${(currentBoxX * 1.3).toFixed(1)}px, ${(currentBoxY * 1.3).toFixed(1)}px, 0) scale(1.03)`;
      }

      if (floatPill) {
        floatPill.style.transform = `translate3d(${(-currentBoxX * 1.1).toFixed(1)}px, ${(-currentBoxY * 1.1).toFixed(1)}px, 0) scale(1.04)`;
      }

      if (decoCircle) {
        decoCircle.style.transform = `translate3d(${(-currentBoxX * 1.4).toFixed(1)}px, ${(-currentBoxY * 1.4).toFixed(1)}px, 0) scale(1.12)`;
      }

      const diff = Math.abs(targetRx - currentRx) + Math.abs(targetRy - currentRy) + Math.abs(targetBoxX - currentBoxX);
      if (isHovered || diff > 0.05) {
        animFrame = requestAnimationFrame(renderParallax);
      } else {
        animFrame = null;
        if (photoFrame) photoFrame.style.transform = '';
        if (decoBox) decoBox.style.transform = '';
        if (floatPill) floatPill.style.transform = '';
        if (decoCircle) decoCircle.style.transform = '';
      }
    }

    function onMouseLeave() {
      targetRx = 0;
      targetRy = 0;
      targetBoxX = 0;
      targetBoxY = 0;
      isHovered = false;
      if (!animFrame) renderParallax();
    }

    heroSection.addEventListener('mousemove', onMouseMove, { passive: true });
    heroSection.addEventListener('mouseleave', onMouseLeave, { passive: true });

    // Click effect on rectangle
    if (decoBox) {
      decoBox.addEventListener('click', () => {
        decoBox.style.transition = 'transform 0.15s ease';
        decoBox.style.transform = 'scale(0.95)';
        setTimeout(() => {
          decoBox.style.transition = '';
        }, 180);
      });
    }
  }

  /* ── Project Case Study Lightbox Modal ─────────────────── */
  const modalCards = $$('.project-card--modal');
  const projectModal = $('#project-modal');
  const pmBackdrop = $('#project-modal-backdrop');
  const pmClose = $('#project-modal-close');
  const pmBadge = $('#pm-category');
  const pmTitle = $('#pm-title');
  const pmCompany = $('#pm-company');
  const pmOverview = $('#pm-overview');
  const pmDeliverables = $('#pm-deliverables');
  const pmStats = $('#pm-stats');
  const pmTools = $('#pm-tools');
  const pmLink = $('#pm-link');

  modalCards.forEach(card => {
    function openProjectModal() {
      if (!projectModal) return;

      const badge = card.dataset.pmBadge || 'Case Study';
      const title = card.dataset.pmTitle || 'Project Overview';
      const company = card.dataset.pmCompany || '';
      const overview = card.dataset.pmOverview || '';
      const deliverables = (card.dataset.pmDeliverables || '').split('|').filter(Boolean);
      const rawStats = (card.dataset.pmStats || '').split('|').filter(Boolean);
      const tools = (card.dataset.pmTools || '').split(',').filter(Boolean);
      const link = card.dataset.pmLink || '#';

      if (pmBadge) pmBadge.textContent = badge;
      if (pmTitle) pmTitle.textContent = title;
      if (pmCompany) pmCompany.textContent = company;
      if (pmOverview) pmOverview.textContent = overview;

      if (pmDeliverables) {
        pmDeliverables.innerHTML = '';
        deliverables.forEach(item => {
          const li = document.createElement('li');
          li.textContent = item.trim();
          pmDeliverables.appendChild(li);
        });
      }

      if (pmStats) {
        pmStats.innerHTML = '';
        for (let i = 0; i < rawStats.length; i += 2) {
          const val = rawStats[i];
          const lbl = rawStats[i + 1] || '';
          if (val) {
            const div = document.createElement('div');
            div.className = 'project-modal__stat-card';
            div.innerHTML = `<div class="project-modal__stat-val">${val}</div><div class="project-modal__stat-lbl">${lbl}</div>`;
            pmStats.appendChild(div);
          }
        }
      }

      if (pmTools) {
        pmTools.innerHTML = '';
        tools.forEach(t => {
          const span = document.createElement('span');
          span.className = 'video-modal__tool-tag';
          span.textContent = t.trim();
          pmTools.appendChild(span);
        });
      }

      if (pmLink) {
        pmLink.href = link;
      }

      projectModal.classList.add('is-open');
      projectModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (pmClose) pmClose.focus();
    }

    card.addEventListener('click', e => {
      e.preventDefault();
      openProjectModal();
    });

    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProjectModal();
      }
    });
  });

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('is-open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (pmClose) pmClose.addEventListener('click', closeProjectModal);
  if (pmBackdrop) pmBackdrop.addEventListener('click', closeProjectModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('is-open')) {
      closeProjectModal();
    }
  });

})();
