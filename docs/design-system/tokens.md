# Design Tokens

> Source of truth: `src/app/globals.css`
>
> CareerOS uses a **neutral-first dark assistant UI**. Color is secondary; hierarchy should come from surface depth, borders, type size, and font weight.

---

## Typeface

```css
@font-face {
  font-family: "Pretendard Variable";
  font-weight: 45 920;
  font-display: swap;
  src: url("/fonts/PretendardVariable.woff2") format("woff2");
}

:root {
  --font-pretendard: "Pretendard Variable", "Pretendard", ui-sans-serif,
    -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif;
}
```

- Korean UI uses Pretendard Variable.
- Letter spacing is `0`.
- App titles usually use `19px / 560`; body and control text usually use `13px / 400-500`.

---

## Type Scale

```css
:root {
  --text-2xs: 11px;
  --text-xs: 12px;
  --text-sm: 13px;
  --text-md: 14px;
  --text-base: 16px;
  --text-title: 19px;
}
```

| Token | Use |
| --- | --- |
| `--text-2xs` | metadata labels, tiny counters |
| `--text-xs` | badges, captions, row metadata |
| `--text-sm` | app body, buttons, navigation |
| `--text-md` | form values and controls |
| `--text-title` | agent intro titles |

---

## Dark App Palette

`(auth)` and `(admin)` routes use `.dark-app`.

```css
.dark-app {
  --da-bg: rgb(8, 9, 10);
  --da-sidebar: rgb(11, 12, 13);
  --da-surface: rgb(13, 14, 15);
  --da-surface-2: rgb(17, 18, 19);

  --da-border: rgba(255, 255, 255, 0.06);
  --da-border-row: rgba(255, 255, 255, 0.04);

  --da-text: rgba(255, 255, 255, 0.85);
  --da-text-2: rgba(255, 255, 255, 0.5);
  --da-text-3: rgba(255, 255, 255, 0.35);
  --da-text-hint: rgba(255, 255, 255, 0.3);

  --da-control: rgba(255, 255, 255, 0.04);
  --da-control-hover: rgba(255, 255, 255, 0.075);
  --da-control-active: rgba(255, 255, 255, 0.12);

  --da-badge: rgba(255, 255, 255, 0.08);
  --da-badge-text: rgba(255, 255, 255, 0.5);
  --da-focus: rgba(255, 255, 255, 0.22);

  --da-accent: rgb(122, 151, 214);
  --da-accent-dim: rgba(122, 151, 214, 0.14);
  --da-danger: rgb(248, 113, 113);
  --da-danger-dim: rgba(248, 113, 113, 0.14);
}
```

Rules:

- Use `--da-bg`, `--da-surface`, and `--da-surface-2` for the main surface hierarchy.
- Prefer borders over heavy shadows for cards and lists.
- Use muted cobalt only as a small state/detail accent.
- Avoid AI-purple gradients, neon analysis colors, and decorative color fields.
- Agent analysis surfaces should stay close to monochrome.

---

## Landing Palette

`(public)` routes use `.dark-landing`.

```css
.dark-landing {
  --dl-bg: rgb(8, 9, 10);
  --dl-card: rgb(15, 16, 17);
  --dl-panel: rgb(13, 14, 15);
  --dl-text: rgb(247, 248, 248);
  --dl-muted: rgb(138, 143, 152);
  --dl-link: rgb(208, 214, 224);
  --dl-border: rgba(255, 255, 255, 0.06);
  --dl-border-nav: rgba(255, 255, 255, 0.08);
  --dl-accent: rgb(122, 151, 214);
  --dl-accent-soft: rgba(122, 151, 214, 0.16);
  --dl-paper: rgb(238, 240, 244);
  --dl-graphite: rgb(37, 39, 43);
}
```

The landing page should feel like a personal career assistant, not a commercial proof-heavy SaaS page.
It may use more color than the app, but color should look editorial and professional: muted cobalt, paper white, graphite, and warm grays instead of saturated AI purple.

---

## Radius And Shadow

```css
:root {
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  --shadow-popover: 0 18px 60px rgba(0, 0, 0, 0.42);
  --shadow-modal: 0 24px 80px rgba(0, 0, 0, 0.55);
}
```

- Cards and panels default to `8px` or less.
- Modals and popovers may use `12px`.
- Do not wrap page sections in large card containers.

---

## Motion

```css
--ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
```

- Page entrance: `agent-page-in`, 420ms.
- Panel entrance: `agent-reveal`, 520ms.
- Scan shimmer: `agent-shimmer`, only for analysis/loading states.
- Agent motion is disabled when `prefers-reduced-motion: reduce`.

---

## Focus

```css
.ds-focus-ring:focus-visible {
  outline: 1px solid var(--da-focus);
  outline-offset: 2px;
}
```

Use `ds-focus-ring` on custom controls that need visible keyboard focus.
