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

  function showFieldError(field, msg) {
    if (!field) return;
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
    if (!field) return;
    field.classList.remove('is-error');
    field.removeAttribute('aria-invalid');
    const errEl = document.getElementById(field.id + '-err');
    if (errEl) {
      errEl.textContent = '';
      errEl.setAttribute('hidden', '');
    }
  }

  if (form) {
    $$('input, select, textarea', form).forEach(field => {
      ['input', 'change'].forEach(evt => {
        field.addEventListener(evt, () => clearFieldError(field));
      });
    });
  }

  window.handleContactSubmit = async function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const cForm = document.getElementById('contact-form');
    const cSuccess = document.getElementById('form-success');
    const errBanner = document.getElementById('form-error-msg');
    if (!cForm) return false;

    if (errBanner) {
      errBanner.textContent = '';
      errBanner.setAttribute('hidden', '');
    }

    const nameEl = document.getElementById('f-name');
    const emailEl = document.getElementById('f-email');
    const serviceSelect = document.getElementById('f-service');
    const messageEl = document.getElementById('f-message');

    let valid = true;

    if (!nameEl || !nameEl.value.trim()) {
      showFieldError(nameEl, 'Please enter your name.');
      if (valid && nameEl) { nameEl.focus(); valid = false; }
    }

    if (!emailEl || !emailEl.value.trim()) {
      showFieldError(emailEl, 'Please enter your email address.');
      if (valid && emailEl) { emailEl.focus(); valid = false; }
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      showFieldError(emailEl, 'Please enter a valid email address.');
      if (valid && emailEl) { emailEl.focus(); valid = false; }
    }

    if (!messageEl || !messageEl.value.trim()) {
      showFieldError(messageEl, 'Please enter a message.');
      if (valid && messageEl) { messageEl.focus(); valid = false; }
    }

    if (!valid) return false;

    const btn = document.getElementById('contact-submit-btn') || cForm.querySelector('button[type="submit"]');
    const btnText = btn ? btn.querySelector('.btn-text') : null;
    if (btn) btn.disabled = true;
    if (btnText) btnText.textContent = 'Sending Message…';

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const service = serviceSelect && serviceSelect.value ? serviceSelect.value : 'General Inquiry';
    const message = messageEl.value.trim();

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('service', service);
      formData.append('message', message);

      const response = await fetch('https://formspree.io/f/mjykyvlo', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Hide form & show success view
        cForm.style.display = 'none';
        if (cSuccess) {
          cSuccess.style.display = 'block';
          cSuccess.classList.add('visible');
          cSuccess.focus();
        }

        // Save lead to LocalStorage backup
        try {
          const leads = JSON.parse(localStorage.getItem('qz_user_leads') || '[]');
          leads.unshift({ name, email, service, message, date: new Date().toISOString() });
          localStorage.setItem('qz_user_leads', JSON.stringify(leads));
        } catch (err) {
          console.warn('LocalStorage lead error:', err);
        }

        cForm.reset();
      } else {
        const data = await response.json().catch(() => ({}));
        let errorMsg = 'Oops! There was a problem submitting your form. Please try again.';
        if (data && data.errors && data.errors.length > 0) {
          errorMsg = data.errors.map(err => err.message).join(', ');
        }
        if (errBanner) {
          errBanner.textContent = errorMsg;
          errBanner.removeAttribute('hidden');
        }
        if (btn) btn.disabled = false;
        if (btnText) btnText.textContent = 'Send Message ↗';
      }
    } catch (error) {
      console.error('Form submission error:', error);
      if (errBanner) {
        errBanner.textContent = 'Network error. Please check your connection or email directly to zakaqmar3@gmail.com';
        errBanner.removeAttribute('hidden');
      }
      if (btn) btn.disabled = false;
      if (btnText) btnText.textContent = 'Send Message ↗';
    }

    return false;
  };

  if (form) {
    form.addEventListener('submit', window.handleContactSubmit);
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
  const countElements = document.querySelectorAll('.stat-num[data-counter-target]');
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

  // 7. Testimonials Interactive Review Modal & Persistence (Formspree)
  const reviewModal = document.getElementById('reviewModal');
  const writeReviewBtn = document.getElementById('writeReviewBtn');
  const closeReviewModalBtn = document.getElementById('closeReviewModal');
  const reviewForm = document.getElementById('submissionReviewForm');
  const reviewStatus = document.getElementById('reviewFormStatus');

  if (writeReviewBtn && reviewModal) {
    writeReviewBtn.addEventListener('click', (e) => {
      if (e) e.preventDefault();
      reviewModal.style.display = 'flex';
      if (reviewStatus) reviewStatus.innerHTML = '';
      if (reviewForm) reviewForm.reset();
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        document.getElementById('reviewerName')?.focus();
      }, 50);
    });
  }

  if (closeReviewModalBtn && reviewModal) {
    closeReviewModalBtn.addEventListener('click', () => {
      reviewModal.style.display = 'none';
      document.body.style.overflow = '';
    });
  }

  if (reviewModal) {
    window.addEventListener('click', (e) => {
      if (e.target === reviewModal) {
        reviewModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && reviewModal.style.display === 'flex') {
        reviewModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  if (reviewForm) {
    reviewForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const submitBtn = document.getElementById('submitReviewBtn');
      if (submitBtn) submitBtn.disabled = true;

      const data = new FormData(reviewForm);
      const name = (data.get('name') || 'Client').trim();
      const email = (data.get('email') || '').trim();
      const rating = parseInt(data.get('rating') || '5', 10);
      const message = (data.get('message') || '').trim();

      if (reviewStatus) {
        reviewStatus.style.color = '#2563eb';
        reviewStatus.innerHTML = 'Submitting your review…';
      }

      fetch(reviewForm.action, {
        method: reviewForm.method || 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
          if (reviewStatus) {
            reviewStatus.style.color = '#10b981';
            reviewStatus.innerHTML = 'Thank you! Your review has been submitted successfully.';
          }

          // Dynamically create and prepend new testimonial card element to the live grid
          const testimonialGrid = document.querySelector('.testimonials__grid') || document.getElementById('testimonials-grid');
          if (testimonialGrid) {
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'CL';
            const starsStr = '★'.repeat(rating);
            const newCard = document.createElement('article');
            newCard.className = 'tcard reveal in-view';
            newCard.style.border = '1.5px solid var(--accent, #2563eb)';
            newCard.style.boxShadow = '0 12px 30px rgba(37, 99, 235, 0.22)';
            newCard.style.animation = 'reviewModalFadeIn 0.4s ease-out';
            newCard.innerHTML = `
              <div class="tcard__header">
                <div class="tcard__stars" aria-label="${rating} out of 5 stars">
                  <span aria-hidden="true">${starsStr}</span>
                </div>
                <span class="tcard__verified">✓ Verified Project</span>
              </div>
              <blockquote class="tcard__quote">
                "${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}"
              </blockquote>
              <div class="tcard__footer">
                <div class="tcard__author">
                  <div class="tcard__avatar" style="background: linear-gradient(135deg, #2563eb, #10B981);" aria-hidden="true">${initials}</div>
                  <div>
                    <div class="tcard__name">${name.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                    <div class="tcard__role">Verified Client</div>
                  </div>
                </div>
                <span class="tcard__service-badge">Client Review</span>
              </div>
            `;
            testimonialGrid.prepend(newCard); // Add to the top of the list
          }

          try {
            const existing = JSON.parse(localStorage.getItem('qz_user_reviews') || '[]');
            existing.unshift({ name, email, rating, message, date: new Date().toISOString() });
            localStorage.setItem('qz_user_reviews', JSON.stringify(existing));
          } catch (err) {
            console.warn('LocalStorage review error:', err);
          }

          reviewForm.reset();
          setTimeout(() => {
            if (reviewModal) reviewModal.style.display = 'none';
            document.body.style.overflow = '';
            if (submitBtn) submitBtn.disabled = false;
          }, 2500);
        } else {
          if (submitBtn) submitBtn.disabled = false;
          response.json().then(resData => {
            if (resData && Object.hasOwn(resData, 'errors')) {
              if (reviewStatus) {
                reviewStatus.style.color = '#ef4444';
                reviewStatus.innerHTML = resData['errors'].map(error => error['message']).join(', ');
              }
            } else {
              if (reviewStatus) {
                reviewStatus.style.color = '#ef4444';
                reviewStatus.innerHTML = 'Oops! There was a problem submitting your review.';
              }
            }
          }).catch(() => {
            if (reviewStatus) {
              reviewStatus.style.color = '#ef4444';
              reviewStatus.innerHTML = 'Oops! There was a problem submitting your review.';
            }
          });
        }
      })
      .catch(error => {
        if (submitBtn) submitBtn.disabled = false;
        if (reviewStatus) {
          reviewStatus.style.color = '#ef4444';
          reviewStatus.innerHTML = 'Oops! There was a problem connecting to the server.';
        }
      });
    });
  }

  // Load persisted user reviews from LocalStorage on load
  try {
    const saved = JSON.parse(localStorage.getItem('qz_user_reviews') || '[]');
    const grid = document.querySelector('.testimonials__grid') || document.getElementById('testimonials-grid');
    if (saved.length > 0 && grid) {
      saved.forEach(review => {
        const initials = review.name ? review.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'CL';
        const starsStr = '★'.repeat(review.rating || 5);
        const card = document.createElement('article');
        card.className = 'tcard reveal in-view';
        card.style.border = '1px solid var(--accent, #2563eb)';
        card.innerHTML = `
          <div class="tcard__header">
            <div class="tcard__stars" aria-label="${review.rating || 5} out of 5 stars">
              <span aria-hidden="true">${starsStr}</span>
            </div>
            <span class="tcard__verified">✓ Verified Project</span>
          </div>
          <blockquote class="tcard__quote">
            "${review.message || ''}"
          </blockquote>
          <div class="tcard__footer">
            <div class="tcard__author">
              <div class="tcard__avatar" style="background: linear-gradient(135deg, #2563eb, #10B981);" aria-hidden="true">${initials}</div>
              <div>
                <div class="tcard__name">${review.name || 'Client'}</div>
                <div class="tcard__role">Verified Client</div>
              </div>
            </div>
            <span class="tcard__service-badge">Client Review</span>
          </div>
        `;
        grid.prepend(card);
      });
    }
  } catch (err) {
    console.warn('LocalStorage review load error:', err);
  }

})();



