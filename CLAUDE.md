# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).

## Architecture — Multi-Page & Dynamic
- Build as a **multi-page app** using one of:
  - **Vanilla JS + HTML:** separate `.html` files per page, shared `nav.js` component injected via JS, `router.js` for client-side hash/history routing.
  - **React (Vite):** React Router v6 for routing, component-based structure, one component per page under `src/pages/`.
- Default to **React + Vite** unless the user specifies otherwise.
- File structure for React projects:

src/
components/   # Shared UI components (Navbar, Footer, etc.)
pages/        # One file per route (Home.jsx, About.jsx, etc.)
hooks/        # Custom React hooks
data/         # Static data, mock APIs, or fetch utilities
App.jsx       # Route definitions
main.jsx      # Entry point

## Dynamic Behavior
- Data should never be hardcoded inline in JSX/HTML. Extract it to:
  - `src/data/*.js` files (for static/mock data), or
  - Custom hooks (`useFetch`, `useData`) for real API calls.
- Use `useState` + `useEffect` for async data loading.
- Show loading and error states for every async operation — no silent failures.
- Animations: use Framer Motion for React, or CSS `@keyframes` + `transition` for vanilla. Animate `transform` and `opacity` only.

## Responsive Design
- Mobile-first: base styles target mobile, use `md:` / `lg:` breakpoints to scale up.
- Test mentally at 375px, 768px, and 1280px widths.
- Navigation: hamburger menu on mobile, full nav on desktop.
- Images: always use `object-cover` with explicit aspect ratios.
- No fixed pixel widths on layout containers — use `max-w-*` + `w-full`.

## Output Defaults
- Tailwind CSS via CDN for vanilla projects; as a Vite plugin for React.
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Fonts via Google Fonts (`<link>` tag or `@import`).
- All shared styles in a single `styles.css` or Tailwind config — no scattered inline styles.

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
- Do not hardcode data inline — always extract to a data layer
- Do not build single-page static HTML unless explicitly asked