(function () {
  const nestedPage = /\/(programs|activities)\//.test(window.location.pathname);
  const root = nestedPage ? '../' : '';
  const home = root + 'index.html';
  const about = root + 'biography.html';
  const updates = root + 'updates.html';
  const events = root + 'event.html';

  const nav = document.getElementById('navbar');
  const mobileMenu = document.getElementById('mobile-menu');

  if (nav && mobileMenu) {
    nav.querySelector('.nav-inner').innerHTML = `
      <a href="${home}" class="site-logo" aria-label="Soban Attari Home">
        <span class="logo-mark"><span class="logo-line-1">SOBAN</span><span class="logo-line-2">ATTARI</span></span>
      </a>
      <div class="nav-links" id="nav-links">
        <a href="${home}" data-nav="home">Home</a>
        <a href="${about}" data-nav="about">About</a>
        <a href="${updates}" data-nav="updates"><span class="updates-shine"></span>Updates</a>
        <a href="${events}" data-nav="events">Events</a>
        <a href="${home}#contact">Contact</a>
        <a href="${home}#book-session" class="nav-cta">Book a Session</a>
      </div>
      <button class="nav-hamburger" id="nav-hamburger" onclick="toggleMenu()" aria-label="Open menu" aria-controls="mobile-menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>`;

    mobileMenu.innerHTML = `
      <div class="nav-mobile-header"><span class="nav-mobile-title">Menu</span><button class="nav-mobile-close" type="button" onclick="closeMenu()" aria-label="Close menu">&times;</button></div>
      <a href="${home}" data-nav="home" onclick="closeMenu()">Home</a>
      <a href="${about}" data-nav="about" onclick="closeMenu()">About</a>
      <a href="${updates}" data-nav="updates" onclick="closeMenu()"><span class="updates-shine"></span>Updates</a>
      <a href="${events}" data-nav="events" onclick="closeMenu()">Events</a>
      <a href="${home}#contact" onclick="closeMenu()">Contact</a>
      <a href="${home}#book-session" onclick="closeMenu()">Book a Session</a>`;

    /* ---- active / current link ---- */
    // Match on the last path segment with any trailing slash and the .html
    // extension stripped, so it works for both "/updates.html" (local) and
    // "/updates" (Vercel clean URLs).
    const clean = window.location.pathname.replace(/\/+$/, '');
    const file = clean.slice(clean.lastIndexOf('/') + 1).toLowerCase().replace(/\.html$/, '');
    const PAGE_NAV = {
      '': 'home',
      'index': 'home',
      'biography': 'about',
      'updates': 'updates',
      'event': 'events',
      'events': 'events'
    };
    // programs/* and activities/* roll up to Events;
    // blogs + booking-form fall through to '' => no active link.
    const navKey = nestedPage ? 'events' : (PAGE_NAV[file] || '');
    if (navKey) {
      document.querySelectorAll('[data-nav="' + navKey + '"]').forEach(function (el) {
        el.classList.add('active');
        el.setAttribute('aria-current', 'page');
      });
    }

    /* ---- Mobile drawer: single source of truth for open/close, with a focus
            trap, focus restore, inert page behind it, and auto-close when the
            viewport grows back to desktop. Overrides any per-page copies. ---- */
    (function setupMobileMenu() {
      const backdrop = document.getElementById('mobile-menu-backdrop');
      const hamburger = document.getElementById('nav-hamburger');
      const DESKTOP_BP = 880; // must match the CSS breakpoint
      let lastFocused = null;

      function setPageInert(on) {
        Array.prototype.forEach.call(document.body.children, function (el) {
          if (el === mobileMenu || el === backdrop) return;
          if (on) el.setAttribute('inert', '');
          else el.removeAttribute('inert');
        });
      }

      function trapTab(e) {
        if (e.key === 'Escape') { closeMenu(); return; }
        if (e.key !== 'Tab') return;
        const items = mobileMenu.querySelectorAll('a[href], button:not([disabled])');
        if (!items.length) return;
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }

      function openMenu() {
        if (mobileMenu.classList.contains('open')) return;
        lastFocused = document.activeElement;
        mobileMenu.classList.add('open');
        if (backdrop) backdrop.classList.add('open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');
        setPageInert(true);
        document.addEventListener('keydown', trapTab, true);
        const close = mobileMenu.querySelector('.nav-mobile-close');
        if (close) close.focus();
      }

      function closeMenu() {
        if (!mobileMenu.classList.contains('open')) return;
        mobileMenu.classList.remove('open');
        if (backdrop) backdrop.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
        setPageInert(false);
        document.removeEventListener('keydown', trapTab, true);
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
        else if (hamburger) hamburger.focus();
      }

      function toggleMenu() {
        (mobileMenu.classList.contains('open') ? closeMenu : openMenu)();
      }

      window.toggleMenu = toggleMenu;
      window.closeMenu = closeMenu;

      let resizeTimer;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          if (window.innerWidth > DESKTOP_BP && mobileMenu.classList.contains('open')) closeMenu();
        }, 120);
      });
    })();
  }

  /* ---- Bookings not open yet: every booking CTA (navbar included) shows a
         "coming soon" notice instead of scrolling to the booking form ---- */
  (function setupBookingSoon() {
    let modal = document.getElementById('booking-soon-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'booking-soon-modal';
      modal.className = 'terms-modal-overlay';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'booking-soon-title');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      modal.innerHTML = `
        <div class="terms-modal-box booking-soon-box">
          <div class="terms-modal-header">
            <span class="terms-badge">Bookings</span>
            <h2 id="booking-soon-title">Coming Soon</h2>
            <p class="terms-intro">Session booking isn't open just yet &mdash; it will be available here very shortly. Thank you for your patience.</p>
          </div>
          <div class="terms-modal-footer">
            <a href="${home}#contact" id="booking-soon-contact" class="booking-soon-cta">Contact Us Instead</a>
            <button id="booking-soon-close" class="terms-decline-btn" type="button">Close</button>
          </div>
        </div>`;
      document.body.appendChild(modal);
    }

    const closeBtn = modal.querySelector('#booking-soon-close');
    const contactLink = modal.querySelector('#booking-soon-contact');

    function openModal() {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      modal.setAttribute('aria-hidden', 'false');
      if (closeBtn) closeBtn.focus();
    }
    function closeModal() {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      modal.setAttribute('aria-hidden', 'true');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (contactLink) contactLink.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
    });

    document.querySelectorAll('a[href*="book-session"], .card-cta, [data-book-trigger]').forEach(function (trigger) {
      if (trigger.type === 'submit') return;
      trigger.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
    });
  })();
})();
