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

  /* ══════════════════════════════════════════════════════════
     INTERACTIVE UX ENHANCEMENTS
     ══════════════════════════════════════════════════════════ */

  // 1. Reading Scroll Progress Bar
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress-bar';
  progressBar.id = 'scroll-progress';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
  }, { passive: true });

  // 2. Interactive Ambient Cursor Glow (Desktop)
  if (window.matchMedia('(hover: hover) and (min-width: 992px)').matches) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function updateCursorGlow() {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      glow.style.transform = `translate3d(${currentX - 190}px, ${currentY - 190}px, 0)`;
      requestAnimationFrame(updateCursorGlow);
    }
    requestAnimationFrame(updateCursorGlow);
  }

  // 3. Smooth Number Counter Animation
  const countElements = document.querySelectorAll('[data-counter-target]');
  if (countElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-counter-target'));
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1600; // ms
        const startTime = performance.now();

        function countStep(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = target * easeOut;
          
          el.textContent = prefix + (decimals > 0 ? currentVal.toFixed(decimals) : Math.round(currentVal)) + suffix;

          if (progress < 1) {
            requestAnimationFrame(countStep);
          } else {
            el.textContent = prefix + (decimals > 0 ? target.toFixed(decimals) : target) + suffix;
          }
        }

        requestAnimationFrame(countStep);
        obs.unobserve(el);
      });
    }, { threshold: 0.2 });

    countElements.forEach(el => counterObserver.observe(el));
  }

  // 4. Interactive 3D Card Tilt on Hover (Smooth GPU Accelerated)
  if (window.matchMedia('(hover: hover) and (min-width: 768px)').matches) {
    const tiltCards = document.querySelectorAll('.project-card, .service-card, .insight-card');
    tiltCards.forEach(card => {
      let isCardHovered = false;
      let cardRaf = null;
      let cardTargetX = 0;
      let cardTargetY = 0;
      let cardCurX = 0;
      let cardCurY = 0;

      function renderCardTilt() {
        cardCurX += (cardTargetX - cardCurX) * 0.12;
        cardCurY += (cardTargetY - cardCurY) * 0.12;
        
        card.style.transform = `perspective(1000px) rotateX(${cardCurX}deg) rotateY(${cardCurY}deg) translateY(-4px)`;

        if (isCardHovered || Math.abs(cardTargetX - cardCurX) > 0.05 || Math.abs(cardTargetY - cardCurY) > 0.05) {
          cardRaf = requestAnimationFrame(renderCardTilt);
        } else {
          card.style.transform = '';
          cardRaf = null;
        }
      }

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        // Tilt range: -6deg to +6deg
        cardTargetX = (0.5 - py) * 8;
        cardTargetY = (px - 0.5) * 8;
        isCardHovered = true;
        if (!cardRaf) cardRaf = requestAnimationFrame(renderCardTilt);
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        isCardHovered = false;
        cardTargetX = 0;
        cardTargetY = 0;
        if (!cardRaf) cardRaf = requestAnimationFrame(renderCardTilt);
      }, { passive: true });
    });
  }

  // 5. Toast Notification System & Copy-to-Clipboard
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.id = 'toast-notification';
  toast.innerHTML = `<span class="toast-notification__icon">✓</span><span id="toast-text">Action completed</span>`;
  document.body.appendChild(toast);

  let toastTimer = null;
  window.showToast = function (msg = 'Copied to clipboard!') {
    const textEl = document.getElementById('toast-text');
    if (textEl) textEl.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  // Add click-to-copy handler on email links with data-copy-email attribute
  document.querySelectorAll('[data-copy-email]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const email = 'zakaqmar3@gmail.com';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
          window.showToast('✓ Email copied: ' + email);
        }).catch(() => {
          window.location.href = 'mailto:' + email;
        });
      } else {
        window.location.href = 'mailto:' + email;
      }
    });
  });

  // 6. Back-to-Top Floating Button
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Scroll back to top');
  backToTop.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>`;
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 420) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

})();


