# Navbar Specification

## Overview
- **Target file:** `src/components/Navbar.tsx`
- **Screenshot:** `docs/design-references/` (visible at top of every screenshot)
- **Interaction model:** static (fixed, no scroll behavior changes — bg stays transparent throughout)

## DOM Structure
Fixed `<header>` containing a flex row:
- Left: Linear logo link (SVG) at `/homepage`
- Center: nav links (Product [dropdown], Resources [dropdown], Customers, Pricing, Now, Contact, Docs) — these last two (Docs) are hidden on mobile
- Right: "Open app" button (inverted/outlined), separator `|`, "Log in" link, "Sign up" button (white)

## Computed Styles (exact values from getComputedStyle)

### Header Container
- position: fixed
- top: 0
- left: 0
- right: 0
- height: 73px
- display: flex
- align-items: center
- justify-content: space-between
- padding: 0 32px
- background-color: rgba(0, 0, 0, 0) (transparent)
- backdrop-filter: blur(20px)
- border-bottom: 1px solid rgba(255, 255, 255, 0.08)
- z-index: 100
- color: rgb(247, 248, 248)

### Logo Link
- display: flex
- align-items: center

### Logo SVG
- height: 22px
- viewBox: 0 0 400 100
- fill: currentColor (white)
- The SVG contains the full "Linear" logotype (icon + wordmark as a single path group)

### Nav Links (Product, Resources, Customers, etc.)
- color: rgb(247, 248, 248)
- font-size: 13px
- font-weight: 400
- padding: 0 12px
- height: 73px (full header height, flex centered)
- background: transparent
- no underline
- cursor: pointer
- opacity on hover: 0.7 (approximate)

### "Open app" Button (hidden in primary nav, shown next to Log in on the right)
- background-color: rgb(229, 229, 230)
- color: rgb(8, 9, 10)
- font-size: 13px
- font-weight: 510
- padding: 0 12px
- border-radius: 9999px
- border: 1px solid rgb(229, 229, 230)
- height: 32px
- display: none on mobile (show on desktop)

### Separator
- color: rgba(255, 255, 255, 0.08)
- width: 1px
- height: 20px
- background: rgba(255, 255, 255, 0.2)
- margin: 0 4px

### "Log in" Link
- color: rgb(138, 143, 152)
- font-size: 13px
- font-weight: 400
- padding: 0 12px
- border-radius: 9999px

### "Sign up" Button
- background-color: rgb(229, 229, 230)
- color: rgb(8, 9, 10)
- font-size: 13px
- font-weight: 510
- padding: 0 12px
- border-radius: 9999px
- border: 1px solid rgb(229, 229, 230)
- height: 32px

## States & Behaviors

### Default (all scroll positions)
- Background stays transparent with backdrop-filter: blur(20px) — no change on scroll
- Border-bottom always: 1px solid rgba(255, 255, 255, 0.08)

### Hover on nav links
- opacity: 0.7, transition: opacity 0.15s ease

## Text Content (verbatim)
Nav items (left to right): Product, Resources, Customers, Pricing, Now, Contact
Right side (after separator): Log in, Sign up

Note: "Docs" and "Open app" also appear but may be hidden at smaller breakpoints.

## Assets
- Logo SVG: Use `LinearLogo` from `src/components/icons.tsx`

## Responsive Behavior
- **Desktop (1440px):** Full nav with all links visible
- **Mobile (390px):** Likely shows hamburger / minimal — keep desktop design for now (implement mobile as hidden overflow)
- **Breakpoint:** ~768px

## Implementation Notes
- Use `<header>` element with `position: fixed`
- Add `pt-[73px]` to the page body to compensate for fixed header
- Product and Resources links have dropdown menus — implement as non-functional buttons (no dropdown needed for the clone)
- The header NEVER changes on scroll — it's always transparent with blur
