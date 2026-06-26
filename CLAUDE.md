# CLAUDE.md — Soban Attari Website — Governance Rules

## Always Do First
1. **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.
2. **Read the project structure:** `find . -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" \) -not -path "*/node_modules/*" | sort`
3. **Check `brand_assets/`** for all available images, video, and logo files.
4. **Confirm the stack:** read `package.json` — do not assume React or Next.js.
5. **Confirm which CSS file `index.html` actually loads** via its `<link>` tag. Edit ONLY that file.

---

## Project Identity

| Property | Value |
|---|---|
| Site | Soban Attari — Islamic Scholar, Speaker & Educator |
| Live URL | https://sobanattariweb.vercel.app/ |
| Deployment | Vercel (auto-deploys from main branch) |
| Stack | Vanilla HTML + CSS + JS (multi-page) |
| Brand Accent | `#F5C518` (Gold) — used sparingly: labels, CTAs, hover accents, ticker, logo "ATTARI" only |
| Heading Font | Syne 700/800 (Google Fonts) |
| Body Font | Inter 300–900 (Google Fonts) |
| Logo style | Text-based — "SOBAN" (dark on light / white on dark) / "ATTARI" (always `#F5C518`), 2px gold left border |

---

## Reference Design — READ THIS CAREFULLY

The visual design target is **https://www.zeeshanusmani.com/**

> ⚠️ **Critical:** zeeshanusmani.com is NOT an all-dark website. It alternates between **white/light sections** and **dark sections**. The majority of the page uses a **white or off-white background with dark text**. Only the hero, ticker strip, some feature callouts, and the footer are dark. Previous implementations failed because they built an all-dark site — this is wrong.

### Accurate section-by-section background pattern (top to bottom):

| Section | Background | Text Color |
|---|---|---|
| Navbar | Transparent on load → **white** `#ffffff` on scroll | Dark `#1a1a1a` after scroll |
| Hero | **Dark** — fullscreen video with overlay | White |
| Ticker strip | **Dark** `#1a1a1a` | Gold accent text |
| Quote / pull-quote | **White** `#ffffff` | Dark `#1a1a1a` |
| Stats row | **Off-white** `#f7f7f7` | Dark `#1a1a1a` |
| About / Meet section | **White** `#ffffff` | Dark `#1a1a1a` |
| What We Offer | **Off-white** `#f7f7f7` | Dark `#1a1a1a` |
| Social platforms | **Dark** `#111111` | White |
| Lectures gallery | **White** `#ffffff` | Dark `#1a1a1a` |
| Institutions marquee | **White** `#ffffff` | Dark `#1a1a1a` |
| Books carousel | **Off-white** `#f7f7f7` | Dark `#1a1a1a` |
| Courses / Programs | **White** `#ffffff` | Dark `#1a1a1a` |
| Testimonials | **Off-white** `#f7f7f7` | Dark `#1a1a1a` |
| Booking / CTA | **Dark** `#111111` | White |
| Contact | **White** `#ffffff` | Dark `#1a1a1a` |
| Footer | **Near-black** `#080808` | Light muted |

### What gold (`#F5C518`) is used for — and what it is NOT used for:
- ✅ Section eyebrow labels ("MEET SOBAN ATTARI", "PLATFORMS THAT CONNECT")
- ✅ CTA buttons (primary)
- ✅ Hover border on cards
- ✅ Ticker text
- ✅ Logo "ATTARI" word
- ✅ Stat numbers on dark sections
- ✅ Left-border accent on pull-quotes
- ❌ NOT on section headings (h2, h3) — these are dark `#1a1a1a` on light sections, white on dark sections
- ❌ NOT on body text
- ❌ NOT as background for sections

---

## Design System (CSS Variables)

Define these in `:root` in `styles.css`. Never use hardcoded hex values elsewhere — always reference variables.

```css
:root {
  /* ── Section backgrounds — alternating light / dark ── */
  --bg-page:         #ffffff;      /* default page background — WHITE */
  --bg-off-white:    #f7f7f7;      /* alternate light section */
  --bg-dark:         #111111;      /* dark sections */
  --bg-dark-2:       #1a1a1a;      /* elevated surface on dark */
  --bg-dark-3:       #222222;      /* card on dark */
  --bg-footer:       #080808;      /* footer only */

  /* ── Text on LIGHT backgrounds ── */
  --text-heading:    #1a1a1a;      /* h1–h4 on light sections */
  --text-body:       #4a4a4a;      /* paragraphs on light sections */
  --text-muted:      #888888;      /* secondary text on light */

  /* ── Text on DARK backgrounds ── */
  --text-light:      #ffffff;      /* headings on dark sections */
  --text-light-body: #aaaaaa;      /* body text on dark sections */
  --text-light-muted:#666666;      /* secondary on dark */

  /* ── Brand accent (gold) — used sparingly ── */
  --accent:          #F5C518;
  --accent-hover:    #d4a800;
  --accent-dim:      rgba(245, 197, 24, 0.10);

  /* ── Borders ── */
  --border-light:    #e8e8e8;      /* borders on white/off-white sections */
  --border-dark:     #2a2a2a;      /* borders on dark sections */

  /* ── Typography ── */
  --font-display:    'Syne', sans-serif;
  --font-body:       'Inter', sans-serif;

  /* ── Spacing tokens (use only these values) ── */
  --sp-xs:   8px;
  --sp-sm:   16px;
  --sp-md:   24px;
  --sp-lg:   48px;
  --sp-xl:   80px;
  --sp-2xl:  120px;
}
```

### Typography Rules

```css
/* All headings — default (light sections) */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 800;
  color: var(--text-heading);        /* DARK on light sections */
  line-height: 1.05;
  letter-spacing: -0.02em;
}

/* Headings on dark sections — add .on-dark to the section */
.on-dark h1, .on-dark h2, .on-dark h3, .on-dark h4 {
  color: var(--text-light);          /* WHITE on dark sections */
}

/* Body text */
p {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.75;
  color: var(--text-body);           /* Dark grey on light */
}

.on-dark p {
  color: var(--text-light-body);     /* Light grey on dark */
}

/* Section eyebrow labels — always gold */
.label {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--accent);              /* Always gold regardless of section */
}
```

### Section Class Pattern

Every `<section>` in the HTML must have one of these classes to set its background:

```css
.sec-white    { background: var(--bg-page); }
.sec-offwhite { background: var(--bg-off-white); }
.sec-dark     { background: var(--bg-dark); }
.sec-footer   { background: var(--bg-footer); }
```

And pair `.on-dark` with `.sec-dark` and `.sec-footer` to flip text colors:
```html
<section class="sec-dark on-dark" id="social-platforms"> ... </section>
<section class="sec-white" id="about"> ... </section>
```

---

## Architecture — File Rules

```
index.html              # Homepage — DO NOT rename
biography.html          # About page
events.html             # Events listing
blogs.html              # University sessions
programs/
  youth-talks.html
  growth-room.html
  youth-seminar.html
activities/
  blood-camp.html
  flood-relief.html
  plantation.html
brand_assets/           # READ ONLY — never delete or rename files
  VideoHero.mp4
  Logo_white.png
  IMG_*.JPG / DSC_*.JPG
styles.css              # THE ONLY stylesheet — append here, never create new CSS files
main.js                 # THE ONLY script file — append here, never create new JS files
```

- **One `styles.css`** — never create additional CSS files
- **One `main.js`** — never create additional JS files
- **Never leave inline `style=""` color/font attributes on HTML elements** — they override the stylesheet
- **Never leave `<style>` blocks inside HTML files** — all CSS belongs in `styles.css`
- Shared navbar and footer injected via JS so all pages stay in sync

---

## Navbar Behavior

- **On load:** transparent background, logo "SOBAN" in white, nav links in `rgba(255,255,255,0.85)`
- **After 80px scroll:** background → `rgba(255,255,255,0.96)` + `backdrop-filter: blur(20px)` + `box-shadow: 0 1px 0 var(--border-light)`
- **After scroll, logo "SOBAN"** flips to `var(--text-heading)` (dark); "ATTARI" stays gold always
- **After scroll, nav links** flip to `var(--text-body)` (dark)
- **"Book a Session" CTA** stays gold (`var(--accent)`) with black text at all times
- Nav scroll class added via JS: `navbar.classList.toggle('scrolled', window.scrollY > 80)`

---

## Third-Party Integrations — Do Not Break

| Integration | Details |
|---|---|
| **Cal.com** | Username `sobanattari` — inline embed in `#my-cal-inline` div — do not touch the script |
| **Stripe** | `.pay-now-btn` href placeholder — do not remove the element |
| **Google Fonts** | Inter + Syne in `<head>` — do not duplicate or remove |
| **IntersectionObserver** | Already wired — add `animate-on-scroll` class to new sections |

---

## Existing Functionality — Never Break

1. **Terms & Conditions modal** — fires on first "Book a Session" click; checkbox gates the accept button; `sessionStorage` prevents repeat on same visit
2. **Booking form validation** — "What you'd like to discuss" required; phone rejects all-same digits, sequential patterns, values under 7 or over 15 digits
3. **Payment section** — card vs bank transfer toggle; receipt upload required; file size ≤ 5MB
4. **"What We Offer" dropdown** — click-only toggle; hover does nothing; outside click closes; second click closes
5. **Cal.com inline embed** — `#my-cal-inline` container and its `<script>` block must remain intact
6. **Navbar scroll behavior** — transparent → white+blur after 80px (see Navbar Behavior above)
7. **Hero video** — `brand_assets/VideoHero.mp4`, fullscreen background, autoplay muted loop playsinline
8. **Animated headline cycling** — 6 phrases fade in/out every 3s
9. **Ticker/marquee strip** — CSS `@keyframes` only, no JS
10. **Stats counter** — IntersectionObserver triggers count-up on scroll into view
11. **Institutions dual marquee** — two rows scrolling in opposite directions
12. **Mobile hamburger** — full-screen dark overlay, closes on link click or outside tap

---

## Animation Rules

- Animate `transform` and `opacity` ONLY — never `width`, `height`, `top`, `left`, `margin`, `padding`
- Use `IntersectionObserver` for all scroll-triggered animations — never `window.addEventListener('scroll')`
- All ticker/marquee animations use CSS `@keyframes` only
- Counter animations use `requestAnimationFrame`
- Never use `transition-all` — always name the exact properties

```css
/* Scroll entrance — attach to every new section */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.animate-on-scroll.in-view {
  opacity: 1;
  transform: translateY(0);
}
```

---

## Performance Rules

- `loading="lazy"` on all images except hero poster
- Hero video: `preload="metadata"` `playsinline` `muted` `autoplay` `loop`
- Mobile (`max-width: 768px`): hide `<video>`, show poster via CSS `background-image` on `#hero`
- Google Fonts: `display=swap`
- No jQuery — vanilla JS only
- GPU-composited animations only: `transform`, `opacity`

---

## Anti-Generic Guardrails

- Never use Tailwind default palette (indigo, blue, purple) as primary
- Never use `shadow-md` — use layered color-tinted shadows
- Never use the same font for headings and body
- Never use `transition-all`
- Never hardcode content inline in HTML — data goes in a `data/` object in `main.js`
- Never create additional CSS or JS files
- Never delete or rename files in `brand_assets/`
- Always give every interactive element hover + focus-visible + active states

---

## Hard Rules — No Exceptions

1. Do not break any of the 12 existing functionality items listed above
2. Do not add sections or content not explicitly requested
3. Do not use `transition-all`
4. Do not hardcode data inline in HTML
5. Do not create additional CSS or JS files — append only
6. Do not delete or rename anything in `brand_assets/`
7. Do not modify Cal.com, Stripe, or Terms modal logic — only restyle containers
8. Do not use `window.addEventListener('scroll')` for animations
9. Do not leave inline `style=""` color/font attributes in HTML — they override the stylesheet
10. Do not leave `<style>` blocks inside HTML files — all CSS in `styles.css`
11. **Do not build an all-dark site** — the reference alternates light and dark sections; most of the page is white or off-white

---

## Pre-Completion Checklist — Verify All Before Declaring Done

**Visual (check in browser DevTools computed styles, not in the code):**
- [ ] `<body>` computed `background-color` = `rgb(255, 255, 255)` — NOT black
- [ ] `<h2>` in about/stats/courses sections computed `color` = `rgb(26, 26, 26)` — NOT white, NOT gold
- [ ] `<h2>` in booking/social sections computed `color` = `rgb(255, 255, 255)`
- [ ] `<p>` in light sections computed `color` = `rgb(74, 74, 74)` — NOT white
- [ ] `.label` computed `color` = `rgb(245, 197, 24)` — gold eyebrows only
- [ ] No `<style>` blocks remain in any HTML file
- [ ] No inline `style=""` color/font attributes remain on any HTML element
- [ ] Hard reload (`Cmd+Shift+R`) confirms changes are live — not cached

**Functionality:**
- [ ] Navbar transparent on load → white+blur on scroll
- [ ] Hero video plays fullscreen, headline cycles, entrance animation fires
- [ ] Ticker scrolls CSS-only in gold
- [ ] Stats count up on scroll into view
- [ ] Card hover: lift + gold border
- [ ] Terms modal fires on "Book a Session" click; checkbox gates accept; sessionStorage prevents repeat
- [ ] Cal.com embed renders in `#my-cal-inline`
- [ ] Phone validation blocks fake numbers
- [ ] Receipt upload required before form submit
- [ ] Dropdown click-only toggle with outside-close
- [ ] Mobile hamburger opens/closes correctly
- [ ] No console errors
- [ ] Correct at 375px / 768px / 1280px / 1920px
