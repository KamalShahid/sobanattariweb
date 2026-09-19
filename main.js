(function () {
  // Absolute clean URLs (Vercel rewrites map these to the underlying .html
  // files) — they work identically no matter how deep the current page is,
  // so there's no more "root"/relative-path calculation needed.
  const home = '/';
  const about = '/soban-attari-biography/';
  const updates = '/updates/';
  const projects = '/activities/';
  const videos = '/videos/';
  const books = '/books/';

  // Small pulsing live-dot next to "Updates" — desktop nav, every page,
  // same treatment as the home page (the old hand-drawn circle is retired).
  const updatesScribble = '';
  const updatesDot = `<span class="updates-dot" aria-hidden="true"></span>`;

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
        <a href="${updates}" data-nav="updates"><span class="updates-shine"></span>Updates${updatesDot}${updatesScribble}</a>
        <a href="${projects}" data-nav="projects">Projects</a>
        <a href="${videos}" data-nav="videos">Videos</a>
        <a href="${books}" data-nav="books">Books</a>
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
      <a href="${projects}" data-nav="projects" onclick="closeMenu()">Projects</a>
      <a href="${videos}" data-nav="videos" onclick="closeMenu()">Videos</a>
      <a href="${books}" data-nav="books" onclick="closeMenu()">Books</a>
      <a href="${home}#contact" onclick="closeMenu()">Contact</a>
      <a href="${home}#book-session" onclick="closeMenu()">Book a Session</a>`;

    /* ---- active / current link ---- */
    // Read the first path segment. Works for clean URLs ("/programs/x/" ->
    // "programs") and still degrades safely for a raw "/programs/x.html"
    // fallback during local file testing.
    const segments = window.location.pathname.split('/').filter(Boolean);
    const first = (segments[0] || '').toLowerCase().replace(/\.html$/, '');
    const PAGE_NAV = {
      '': 'home',
      'soban-attari-biography': 'about',
      'updates': 'updates',
      'activities': 'projects',
      'programs': 'projects',
      'events': 'updates',
      'videos': 'videos',
      'books': 'books',
      // local .html fallback (pre-rewrite / file:// testing)
      'index': 'home',
      'biography': 'about',
      'projects': 'projects'
    };
    const navKey = PAGE_NAV[first] || '';
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

  /* ---- Booking: every booking CTA (navbar included) opens a chooser
         (1:1 / University / Corporate / Youth Talks group), then a native
         form built from FORMS[<id>] that posts to the matching Google Form
         via a hidden iframe. Options without their own form fall back to
         the One-to-One form. ---- */
  (function setupBooking() {
    const OPTIONS = [
      { id: 'one-to-one',  title: 'One-to-One Session',       desc: 'A paid personal online session with Soban Attari.' },
      { id: 'university',   title: 'University Session',        desc: 'Invite Soban Attari to speak at your campus or society.' },
      { id: 'corporate',    title: 'Corporate Session',         desc: 'A talk or workshop for your team or organisation.' },
      { id: 'youth-group',  title: 'Youth Talks Group Session', desc: 'Book a Youth Talks style session for your group.' }
    ];

    /* field.kind: text | email | tel | date | time | select | textarea
       field.check: name | email | phone | text  (extra validation beyond "required") */
    const FORMS = {
      'one-to-one': {
        action: 'https://docs.google.com/forms/d/e/1FAIpQLScgs8tYa3ih_t6iC1ZjNbtOTYLrJKthN3mX3L8H5ch5Hd_htw/formResponse',
        fields: [
          { name: 'entry.474397519',  label: 'Full Name',       kind: 'text',  autocomplete: 'name',  check: 'name' },
          { name: 'entry.430388368',  label: 'Email',           kind: 'email', autocomplete: 'email', check: 'email' },
          { name: 'entry.1365511573', label: 'WhatsApp Number', kind: 'tel',   autocomplete: 'tel',   check: 'phone' },
          { name: 'entry.444132048',  label: 'Preferred Date',  kind: 'date',  half: true },
          { name: 'entry.984370154',  label: 'Preferred Time',  kind: 'time',  half: true }
        ]
      },
      'university': {
        action: 'https://docs.google.com/forms/d/e/1FAIpQLSfA16JXHUDRU_GrBwjn_gQp3OiRgXUBWdFTyIU9nVQCr2-ZCg/formResponse',
        fields: [
          { name: 'entry.1084234991', label: 'Your Name',                   kind: 'text',   autocomplete: 'name',  check: 'name' },
          { name: 'entry.180916188',  label: 'Email',                       kind: 'email',  autocomplete: 'email', check: 'email' },
          { name: 'entry.886310530',  label: 'WhatsApp Number',             kind: 'tel',    autocomplete: 'tel',   check: 'phone' },
          { name: 'entry.299105240',  label: 'Your role',                   kind: 'select', options: ['Society Lead', 'Faculty', 'Admin'] },
          { name: 'entry.956061366',  label: 'Expected audience size',      kind: 'text',   check: 'text' },
          { name: 'entry.1345041974', label: 'Proposed date(s)',            kind: 'text',   check: 'text' },
          { name: 'entry.1808993501', label: 'Topic / theme & any details', kind: 'textarea', check: 'text' }
        ]
      },
      'corporate': {
        action: 'https://docs.google.com/forms/d/e/1FAIpQLSfSkLigjhbe-Lasd5v0ftMmyQOx2I3LOLFec5ScCOW5H5euVw/formResponse',
        fields: [
          { name: 'entry.672648595',  label: 'Contact Name',                kind: 'text',   autocomplete: 'name',  check: 'name' },
          { name: 'entry.820955327',  label: 'Email',                       kind: 'email',  autocomplete: 'email', check: 'email' },
          { name: 'entry.103974396',  label: 'Phone / WhatsApp',            kind: 'tel',    autocomplete: 'tel',   check: 'phone' },
          { name: 'entry.2123676530', label: 'Company / Organization',      kind: 'text',   check: 'text' },
          { name: 'entry.719016055',  label: 'Your Designation',            kind: 'text',   check: 'text' },
          { name: 'entry.1719159630', label: 'City',                        kind: 'text',   check: 'text' },
          { name: 'entry.820433303',  label: 'Session Type',                kind: 'select', options: ['Keynote', 'workshop', 'panel', 'other'] },
          { name: 'entry.1850332378', label: 'Expected audience size',      kind: 'text',   check: 'text' },
          { name: 'entry.518091250',  label: 'Preferred date',              kind: 'date' },
          { name: 'entry.370510058',  label: 'Objective / topic & details', kind: 'textarea', check: 'text' }
        ]
      },
      'youth-group': {
        action: 'https://docs.google.com/forms/d/e/1FAIpQLSeZCmpWuw64dzdBz8y3dcL_CZTq0yak0lFXmj-gtZnyzSefGQ/formResponse',
        fields: [
          { name: 'entry.464004741',  label: 'Your Name',             kind: 'text',   autocomplete: 'name',  check: 'name' },
          { name: 'entry.746265906',  label: 'Email',                 kind: 'email',  autocomplete: 'email', check: 'email' },
          { name: 'entry.2036819655', label: 'WhatsApp Number',       kind: 'tel',    autocomplete: 'tel',   check: 'phone' },
          { name: 'entry.884998797',  label: 'City / Area',           kind: 'text',   check: 'text' },
          { name: 'entry.835475021',  label: 'Venue Type',            kind: 'select', options: ['Seminar Hall', 'Masjid'], other: true },
          { name: 'entry.1768645202', label: 'Approx. Audience Size', kind: 'text',   check: 'text' },
          { name: 'entry.671465251',  label: 'Preferred Date',        kind: 'date',   half: true },
          { name: 'entry.138177531',  label: 'Preferred Time',        kind: 'time',   half: true }
        ]
      }
    };
    function formConfig(id) { return FORMS[id] || FORMS['one-to-one']; }

    const checks = {
      name:  function (v) { return v.trim().length >= 2; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
      phone: function (v) { var d = v.replace(/\D/g, ''); return d.length >= 7 && d.length <= 15 && !/^(\d)\1+$/.test(d); },
      text:  function (v) { return v.trim().length >= 1; }
    };
    function esc(s) {
      return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
    }
    function msgFor(f) {
      if (f.kind === 'email') return 'Enter a valid email address.';
      if (f.kind === 'tel') return 'Enter a valid number (7&ndash;15 digits).';
      if (f.kind === 'date') return 'Pick a date.';
      if (f.kind === 'time') return 'Pick a time.';
      if (f.kind === 'select') return 'Please choose an option.';
      return 'This field is required.';
    }

    let modal = document.getElementById('booking-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'booking-modal';
      modal.className = 'terms-modal-overlay';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'bk-title');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      modal.innerHTML = `
        <div class="terms-modal-box bk-box">
          <button type="button" class="bk-close" aria-label="Close">&times;</button>

          <div class="bk-view bk-view-choose">
            <div class="terms-modal-header">
              <span class="terms-badge">Book</span>
              <h2 id="bk-title">Book a Session</h2>
              <p class="terms-intro">Choose the format that fits.</p>
            </div>
            <div class="bk-options">
              ${OPTIONS.map(function (o) { return `
                <label class="bk-option">
                  <input type="radio" name="bk-type" value="${o.id}">
                  <span class="bk-option-main"><b>${o.title}</b><small>${o.desc}</small></span>
                  <span class="bk-option-tick" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                </label>`; }).join('')}
            </div>
            <div class="terms-modal-footer">
              <button type="button" class="bk-continue terms-accept-btn" disabled>Continue</button>
            </div>
          </div>

          <div class="bk-view bk-view-form" hidden>
            <div class="terms-modal-header">
              <button type="button" class="bk-back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>Back</button>
              <span class="terms-badge">Booking</span>
              <h2 class="bk-form-title">Booking</h2>
            </div>
            <div class="bk-form-body">
              <form class="bk-form" method="POST" target="bk-hidden-iframe" novalidate>
                <div class="bk-fields"></div>
                <input type="hidden" name="fvv" value="1">
                <input type="hidden" name="pageHistory" value="0">
                <button type="submit" class="fos-submit bk-submit">
                  <span class="label-send">Submit Booking Request</span>
                  <span class="spinner" aria-hidden="true"></span>
                </button>
                <p class="bk-note">Your details go only to the Soban Attari team.</p>
              </form>
              <div class="fos-success bk-success" hidden>
                <div class="check"><svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></div>
                <h3>Request received</h3>
                <p>Thank you. The Soban Attari team will reach out on WhatsApp to confirm.</p>
              </div>
            </div>
          </div>
        </div>
        <iframe class="bk-hidden-iframe" name="bk-hidden-iframe" title="Form response target" tabindex="-1" aria-hidden="true"></iframe>`;
      document.body.appendChild(modal);
    }

    const box = modal.querySelector('.bk-box');
    const viewChoose = modal.querySelector('.bk-view-choose');
    const viewForm = modal.querySelector('.bk-view-form');
    const closeBtn = modal.querySelector('.bk-close');
    const backBtn = modal.querySelector('.bk-back');
    const continueBtn = modal.querySelector('.bk-continue');
    const formTitle = modal.querySelector('.bk-form-title');
    const form = modal.querySelector('.bk-form');
    const fieldsWrap = modal.querySelector('.bk-fields');
    const submitBtn = modal.querySelector('.bk-submit');
    const frame = modal.querySelector('.bk-hidden-iframe');
    const successPanel = modal.querySelector('.bk-success');
    let lastFocused = null, submitting = false, done = false, fallbackTimer = null;

    function fieldControl(fEl) { return fEl.querySelector('input, select, textarea'); }
    function validateField(fEl) {
      let ok;
      if (fEl.dataset.other === '1') {
        const sel = fEl.querySelector('select');
        const other = fEl.querySelector('.bk-other');
        if (!sel.value) ok = false;
        else if (sel.value === '__other_option__') ok = other.value.trim().length >= 1;
        else ok = true;
      } else {
        const ctrl = fieldControl(fEl);
        const check = fEl.dataset.check;
        ok = (check && checks[check]) ? checks[check](ctrl.value) : !!ctrl.value;
      }
      fEl.classList.toggle('has-error', !ok);
      return ok;
    }
    function setHidden(name, v) { const h = form.querySelector('input[name="' + name + '"][data-dt="1"]'); if (h) h.value = v; }

    function buildForm(id) {
      const cfg = formConfig(id);
      form.setAttribute('action', cfg.action);
      Array.prototype.forEach.call(form.querySelectorAll('input[data-dt="1"]'), function (h) { h.remove(); });

      let html = '', pending = null;
      cfg.fields.forEach(function (f, i) {
        const fid = 'bk-f-' + i;
        let control;
        if (f.kind === 'textarea') {
          control = '<textarea id="' + fid + '" name="' + esc(f.name) + '" required></textarea>';
        } else if (f.kind === 'select') {
          control = '<select id="' + fid + '" name="' + esc(f.name) + '" required><option value="" disabled selected>Select&hellip;</option>' +
            f.options.map(function (o) { return '<option value="' + esc(o) + '">' + esc(o) + '</option>'; }).join('') +
            (f.other ? '<option value="__other_option__">Other</option>' : '') + '</select>';
          if (f.other) {
            control += '<input type="text" class="bk-other" name="' + esc(f.name) + '.other_option_response" placeholder="Please specify" aria-label="Other, please specify" hidden disabled>';
          }
        } else if (f.kind === 'date' || f.kind === 'time') {
          control = '<input type="' + f.kind + '" id="' + fid + '" required>';
        } else {
          const type = f.kind === 'email' ? 'email' : (f.kind === 'tel' ? 'tel' : 'text');
          control = '<input type="' + type + '" id="' + fid + '" name="' + esc(f.name) + '"' +
            (f.autocomplete ? ' autocomplete="' + f.autocomplete + '"' : '') +
            (f.kind === 'tel' ? ' inputmode="tel"' : '') + ' required>';
        }
        const block = '<div class="bk-field" data-kind="' + f.kind + '"' +
          (f.check ? ' data-check="' + f.check + '"' : '') +
          (f.other ? ' data-other="1"' : '') +
          ((f.kind === 'date' || f.kind === 'time') ? ' data-dtname="' + esc(f.name) + '"' : '') + '>' +
          '<label class="field-label" for="' + fid + '">' + esc(f.label) + '</label>' + control +
          '<div class="bk-field-msg">' + msgFor(f) + '</div></div>';
        if (f.half) {
          if (pending) { html += '<div class="bk-row">' + pending + block + '</div>'; pending = null; }
          else pending = block;
        } else {
          if (pending) { html += '<div class="bk-row">' + pending + '</div>'; pending = null; }
          html += block;
        }
      });
      if (pending) html += '<div class="bk-row">' + pending + '</div>';
      fieldsWrap.innerHTML = html;

      cfg.fields.forEach(function (f) {
        if (f.kind === 'date') ['_year', '_month', '_day'].forEach(function (s) { addDtHidden(f.name + s); });
        else if (f.kind === 'time') ['_hour', '_minute'].forEach(function (s) { addDtHidden(f.name + s); });
      });

      fieldsWrap.querySelectorAll('.bk-field').forEach(function (fEl) {
        fEl.querySelectorAll('input, select, textarea').forEach(function (ctrl) {
          ctrl.addEventListener('blur', function () { validateField(fEl); });
          ['input', 'change'].forEach(function (ev) {
            ctrl.addEventListener(ev, function () { if (fEl.classList.contains('has-error')) validateField(fEl); });
          });
        });
      });

      fieldsWrap.querySelectorAll('.bk-field[data-other="1"]').forEach(function (fEl) {
        const sel = fEl.querySelector('select');
        const other = fEl.querySelector('.bk-other');
        sel.addEventListener('change', function () {
          const isOther = sel.value === '__other_option__';
          other.hidden = !isOther;
          other.disabled = !isOther;
          if (!isOther) other.value = '';
          if (isOther) other.focus();
        });
      });
    }
    function addDtHidden(name) {
      const h = document.createElement('input');
      h.type = 'hidden'; h.name = name; h.setAttribute('data-dt', '1');
      form.insertBefore(h, submitBtn);
    }

    function openModal() {
      lastFocused = document.activeElement;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      modal.setAttribute('aria-hidden', 'false');
      showChoose();
    }
    /* open straight to one option's form, skipping the chooser */
    function openModalTo(id) {
      if (!OPTIONS.filter(function (o) { return o.id === id; })[0]) { openModal(); return; }
      lastFocused = document.activeElement;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      modal.setAttribute('aria-hidden', 'false');
      const radio = modal.querySelector('input[name="bk-type"][value="' + id + '"]');
      if (radio) { radio.checked = true; radio.dispatchEvent(new Event('change')); }
      goToOption(id);
    }
    function closeModal() {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      modal.setAttribute('aria-hidden', 'true');
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }
    function showChoose() {
      viewForm.hidden = true; viewChoose.hidden = false;
      if (box) box.scrollTop = 0;
      if (closeBtn) closeBtn.focus();
    }
    function showForm() {
      viewChoose.hidden = true; viewForm.hidden = false;
      if (box) box.scrollTop = 0;
      const first = fieldsWrap.querySelector('input, select, textarea');
      if (first) first.focus();
    }

    modal.querySelectorAll('input[name="bk-type"]').forEach(function (inp) {
      inp.addEventListener('change', function () {
        modal.querySelectorAll('.bk-option').forEach(function (l) {
          l.classList.toggle('is-selected', l.querySelector('input').checked);
        });
        continueBtn.disabled = !modal.querySelector('input[name="bk-type"]:checked');
      });
    });

    function goToOption(id) {
      const opt = OPTIONS.filter(function (o) { return o.id === id; })[0];
      formTitle.textContent = opt ? opt.title : 'Booking';
      submitting = false; done = false; clearTimeout(fallbackTimer);
      form.classList.remove('is-submitting');
      form.hidden = false;
      if (backBtn) backBtn.hidden = false;
      successPanel.hidden = true; successPanel.classList.remove('show');
      buildForm(id);
      showForm();
    }

    continueBtn.addEventListener('click', function () {
      const sel = modal.querySelector('input[name="bk-type"]:checked');
      if (!sel) return;
      goToOption(sel.value);
    });

    if (backBtn) backBtn.addEventListener('click', showChoose);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    /* deliberately no backdrop-click close — only the × button (or Esc) dismisses it */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
    });

    function showSuccess() {
      if (done) return;
      done = true;
      clearTimeout(fallbackTimer);
      form.classList.remove('is-submitting');
      form.hidden = true;
      if (backBtn) backBtn.hidden = true;   /* submitted — no going back to the chooser */
      successPanel.hidden = false;
      void successPanel.offsetWidth;
      successPanel.classList.add('show');
      if (closeBtn) closeBtn.focus();
    }

    form.addEventListener('submit', function (e) {
      let firstBad = null;
      fieldsWrap.querySelectorAll('.bk-field').forEach(function (fEl) {
        if (!validateField(fEl) && !firstBad) firstBad = fieldControl(fEl);
      });
      if (firstBad) { e.preventDefault(); if (firstBad.focus) firstBad.focus(); return; }

      fieldsWrap.querySelectorAll('.bk-field[data-dtname]').forEach(function (fEl) {
        const base = fEl.dataset.dtname;
        const val = fieldControl(fEl).value || '';
        if (fEl.dataset.kind === 'date') {
          const p = val.split('-'); // YYYY-MM-DD
          setHidden(base + '_year', p[0] || '');
          setHidden(base + '_month', p[1] ? String(Number(p[1])) : '');
          setHidden(base + '_day', p[2] ? String(Number(p[2])) : '');
        } else {
          const p = val.split(':'); // HH:MM
          setHidden(base + '_hour', p[0] ? String(Number(p[0])) : '');
          setHidden(base + '_minute', p[1] ? String(Number(p[1])) : '');
        }
      });

      submitting = true;
      form.classList.add('is-submitting');
      fallbackTimer = setTimeout(showSuccess, 2600);
      /* native submit proceeds into the hidden iframe */
    });

    if (frame) frame.addEventListener('load', function () { if (submitting) showSuccess(); });

    /* delegated so every "book a session / invite for an event" CTA opens the
       chooser — current or added later, on any page. A trigger with
       data-book-option="<id>" opens straight to that option's form. */
    document.addEventListener('click', function (e) {
      const trigger = e.target.closest('a[href*="book-session"], .card-cta, [data-book-trigger], [data-book-option]');
      if (!trigger || trigger.type === 'submit' || modal.contains(trigger)) return;
      e.preventDefault();
      const opt = trigger.getAttribute('data-book-option');
      if (opt) openModalTo(opt);
      else openModal();
    });
  })();

  /* ---- Combined platform cards (homepage) — a single tile shows a
     platform's total audience; clicking it opens a popup listing each
     of that platform's individual accounts. Shared by YouTube & Instagram. ---- */
  function setupChannelsPopup(cfg) {
    const trigger = document.getElementById(cfg.triggerId);
    if (!trigger) return;

    let modal, lastFocused;

    function build() {
      modal = document.createElement('div');
      modal.id = cfg.modalId;
      modal.className = 'terms-modal-overlay';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', cfg.modalId + '-title');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      modal.innerHTML = `
        <div class="terms-modal-box channels-modal-box">
          <button type="button" class="bk-close" aria-label="Close">&times;</button>
          <div class="terms-modal-header">
            <span class="terms-badge">${cfg.badge}</span>
            <h2 id="${cfg.modalId}-title">${cfg.title}</h2>
            <p class="terms-intro">${cfg.intro}</p>
          </div>
          <div class="channels-list">
            ${cfg.channels.map(function (c) { return `
            <a class="channels-row" href="${c.href}" target="_blank" rel="noopener">
              <span class="channels-icon">${c.icon || cfg.icon}</span>
              <span class="channels-info"><b>${c.name}</b><small>${c.count} followers</small></span>
              <span class="channels-arrow" aria-hidden="true">&rarr;</span>
            </a>`; }).join('')}
          </div>
        </div>`;
      document.body.appendChild(modal);

      modal.querySelector('.bk-close').addEventListener('click', closeModal);
      modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
      });
    }

    function openModal() {
      if (!modal) build();
      lastFocused = document.activeElement;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      modal.setAttribute('aria-hidden', 'false');
      modal.querySelector('.bk-close').focus();
    }
    function closeModal() {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      modal.setAttribute('aria-hidden', 'true');
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    trigger.addEventListener('click', openModal);
  }

  const YT_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28"><path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>';
  setupChannelsPopup({
    triggerId: 'yt-combined-card',
    modalId: 'yt-modal',
    badge: 'YouTube',
    title: 'Our YouTube Channels',
    intro: 'Three channels, one mission &mdash; pick where to watch.',
    icon: YT_ICON,
    channels: [
      { name: 'Soban Attari', count: '1M', href: 'https://www.youtube.com/@SobanAttari26' },
      { name: 'Soban Attari Shorts', count: '140K', href: 'https://www.youtube.com/@sobanattarishorts26' },
      { name: 'Soban Attari Speeches', count: '69K', href: 'https://www.youtube.com/@SobanAttariSpeeches26' }
    ]
  });

  const IG_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28"><defs><radialGradient id="ig-grad-modal" cx="30%" cy="107%" r="150%"><stop offset="0%" stop-color="#fdf497"/><stop offset="5%" stop-color="#fdf497"/><stop offset="45%" stop-color="#fd5949"/><stop offset="60%" stop-color="#d6249f"/><stop offset="90%" stop-color="#285AEB"/></radialGradient></defs><path fill="url(#ig-grad-modal)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>';
  setupChannelsPopup({
    triggerId: 'ig-combined-card',
    modalId: 'ig-modal',
    badge: 'Instagram',
    title: 'Our Instagram Accounts',
    intro: 'Two accounts, one mission &mdash; pick where to follow.',
    icon: IG_ICON,
    channels: [
      { name: 'Soban Attari', count: '545K', href: 'https://www.instagram.com/sobanattari26/' },
      { name: 'Youth Talk', count: '24.3K', href: 'https://www.instagram.com/youthtalk.official/' }
    ]
  });
})();
