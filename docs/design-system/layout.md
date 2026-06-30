# CareerOS Layout System

CareerOS uses a dark, neutral-first assistant workspace. Layout should feel quiet, readable, and operational rather than decorative.

## App Shell

```
┌──────────────┬────────────────────────────────────┐
│ Sidebar      │ Topbar                             │
│ 230px        ├────────────────────────────────────┤
│ dark rail    │ Page content                       │
│              │ max-width per workflow             │
└──────────────┴────────────────────────────────────┘
```

- Root app surface: `rgb(8,9,10)`.
- Sidebar: `rgb(11,12,13)`.
- Page surfaces: `rgb(13,14,15)` or `rgb(17,18,19)`.
- Borders: `rgba(255,255,255,0.06)`.
- Cards/panels use radius `8px` or less.

## Page Rhythm

- Use `AgentIntro` at the top of complex workflow pages.
- Follow with status strips only when they summarize actionable state.
- Lists should be dense rows, not large marketing cards.
- Sticky headers should remain compact: `48px` high with small controls.

## Responsive Rules

- Main content should use `max-width` and centered gutters where workflows are narrow.
- Dense tables/lists can scroll horizontally only when the data shape requires it.
- Text inside rows must truncate instead of pushing buttons off-screen.

## Auth Pages

Login and signup remain minimal public entry points. They should use the same typography and muted link treatment as the app, without colorful brand-heavy surfaces.
