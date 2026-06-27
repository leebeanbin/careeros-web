# Color & Typography Tokens

> Implementation: Tailwind CSS v4 + CSS Custom Properties

---

## Color Palette

```css
:root {
  /* Brand */
  --color-primary-50:  #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;  /* main */
  --color-primary-600: #2563eb;  /* hover */
  --color-primary-700: #1d4ed8;  /* active */

  /* Neutral */
  --color-gray-50:  #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-500: #6b7280;
  --color-gray-700: #374151;
  --color-gray-900: #111827;

  /* Semantic */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error:   #ef4444;
  --color-info:    #3b82f6;

  /* Match score */
  --color-match-strong:  #16a34a;  /* 85+ */
  --color-match-good:    #65a30d;  /* 70–84 */
  --color-match-medium:  #ca8a04;  /* 50–69 */
  --color-match-weak:    #9ca3af;  /* <50 */
}
```

---

## Typography

```css
:root {
  --font-sans: 'Pretendard', 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  --text-xs:   0.75rem;   /* 12px */
  --text-sm:   0.875rem;  /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg:   1.125rem;  /* 18px */
  --text-xl:   1.25rem;   /* 20px */
  --text-2xl:  1.5rem;    /* 24px */
  --text-3xl:  1.875rem;  /* 30px */
}
```

---

## Spacing Scale

Use Tailwind's default spacing scale directly — no custom CSS variables needed.

| Token | Value | Common use |
|-------|-------|-----------|
| `gap-1` / `p-1` | 4px | Tight icon padding |
| `gap-2` / `p-2` | 8px | Inline element spacing |
| `gap-4` / `p-4` | 16px | Card inner padding |
| `gap-6` / `p-6` | 24px | Page section padding |
| `gap-8` / `py-8` | 32px | Page top/bottom padding |
| `gap-16` / `py-16` | 64px | Empty state vertical padding |

---

## Border Radius

```css
:root {
  --radius-sm: 0.25rem;   /* 4px  — badges, tags */
  --radius-md: 0.5rem;    /* 8px  — buttons, inputs */
  --radius-lg: 0.75rem;   /* 12px — cards */
  --radius-xl: 1rem;      /* 16px — modals */
}
```
