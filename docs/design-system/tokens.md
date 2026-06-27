# Design Tokens

> Implementation: Tailwind CSS v4 + CSS Custom Properties (`src/app/globals.css`)
>
> **Note:** 수치가 `[cloner]` 태그로 표시된 항목은 Linear/Discord 클로닝 후 실측값으로 교체 예정.

---

## Color Palette

```css
:root {
  /* Brand — 클로닝 전 기본값. linear.app 클론 후 accent 컬러 검토 */
  --color-primary-50:  #eef2ff;
  --color-primary-100: #e0e7ff;
  --color-primary-200: #c7d2fe;
  --color-primary-500: #6366f1;  /* indigo-500 — professional tool feel */
  --color-primary-600: #4f46e5;  /* hover */
  --color-primary-700: #4338ca;  /* active / pressed */

  /* Neutral */
  --color-gray-50:  #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;

  /* Semantic */
  --color-success:     #16a34a;
  --color-success-bg:  #f0fdf4;
  --color-warning:     #ca8a04;
  --color-warning-bg:  #fefce8;
  --color-error:       #dc2626;
  --color-error-bg:    #fef2f2;
  --color-info:        #6366f1;
  --color-info-bg:     #eef2ff;

  /* Match score */
  --color-match-strong:    #16a34a;  /* 85+ */
  --color-match-strong-bg: #f0fdf4;
  --color-match-good:      #65a30d;  /* 70–84 */
  --color-match-good-bg:   #f7fee7;
  --color-match-medium:    #ca8a04;  /* 50–69 */
  --color-match-medium-bg: #fefce8;
  --color-match-weak:      #9ca3af;  /* <50 */
  --color-match-weak-bg:   #f9fafb;

  /* Surface */
  --color-surface:        #ffffff;   /* card / panel background */
  --color-surface-raised: #ffffff;   /* modal, dropdown */
  --color-surface-subtle: #f9fafb;   /* page background, sidebar */
  --color-border:         #e5e7eb;   /* default border */
  --color-border-subtle:  #f3f4f6;   /* dividers */
}
```

---

## Typography

```css
:root {
  --font-sans: 'Pretendard', 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;

  /* Size scale — [cloner] 실측 후 검토 */
  --text-2xs: 0.6875rem;  /* 11px — metadata, timestamps */
  --text-xs:  0.75rem;    /* 12px — labels, badges */
  --text-sm:  0.8125rem;  /* 13px — sidebar nav, table rows (Linear baseline) */
  --text-base:1rem;       /* 16px — body, form inputs */
  --text-lg:  1.125rem;   /* 18px — card titles */
  --text-xl:  1.25rem;    /* 20px — page headings */
  --text-2xl: 1.5rem;     /* 24px — section headings */
  --text-3xl: 1.875rem;   /* 30px — hero headings */
  --text-4xl: 2.25rem;    /* 36px — landing hero */

  /* Line height */
  --leading-tight:  1.25;
  --leading-snug:   1.375;
  --leading-normal: 1.5;
  --leading-relaxed:1.625;

  /* Font weight */
  --font-normal:  400;
  --font-medium:  500;
  --font-semibold:600;
  --font-bold:    700;
}
```

---

## Spacing Scale

Tailwind 기본 스케일 사용. 자주 쓰는 조합:

| Token | Value | 용도 |
|-------|-------|------|
| `p-1` / `gap-1` | 4px | 아이콘 내부 padding |
| `p-1.5` | 6px | 배지 padding |
| `p-2` / `gap-2` | 8px | 인라인 요소 간격 |
| `p-3` / `gap-3` | 12px | Nav item padding |
| `p-4` / `gap-4` | 16px | 카드 내부 padding |
| `p-5` | 20px | 콘텐츠 영역 padding (Linear 기준) |
| `p-6` / `gap-6` | 24px | 페이지 섹션 패딩 |
| `p-8` / `py-8` | 32px | 페이지 상하단 |
| `py-16` | 64px | Empty state |

---

## Border Radius

```css
:root {
  --radius-xs: 0.1875rem;  /* 3px  — 아주 작은 배지 */
  --radius-sm: 0.25rem;    /* 4px  — 배지, 태그 */
  --radius-md: 0.375rem;   /* 6px  — 버튼, 입력창 (Linear 기준) */
  --radius-lg: 0.5rem;     /* 8px  — 카드 */
  --radius-xl: 0.75rem;    /* 12px — 패널, 드롭다운 */
  --radius-2xl:1rem;       /* 16px — 모달 */
  --radius-full:9999px;    /* 완전한 pill — 알림 배지 */
}
```

---

## Shadows

Linear 수준의 극도로 절제된 섀도우. `[cloner]` 태그 항목은 실측 후 교체.

```css
:root {
  /* 카드, 인풋 — 거의 보이지 않는 깊이감 */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);

  /* 카드 hover, 선택된 항목 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04),
               0 1px 4px rgba(0, 0, 0, 0.06);

  /* 드롭다운, 팝오버 */
  --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.04),
               0 4px 12px rgba(0, 0, 0, 0.08);   /* [cloner] linear.app 드롭다운 */

  /* 모달 */
  --shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.06),
               0 12px 32px rgba(0, 0, 0, 0.12);

  /* 토스트 */
  --shadow-xl: 0 8px 16px rgba(0, 0, 0, 0.08),
               0 24px 48px rgba(0, 0, 0, 0.16);
}
```

Tailwind 클래스로 사용:
```tsx
// globals.css에 등록 후
<div className="shadow-card">    // --shadow-xs
<div className="shadow-dropdown"> // --shadow-md
<div className="shadow-modal">   // --shadow-lg
```

---

## Z-Index

```css
:root {
  --z-base:           0;
  --z-raised:         1;   /* 카드 hover */
  --z-sidebar:       10;
  --z-topbar:        20;
  --z-dropdown:      30;
  --z-tooltip:       35;
  --z-modal-backdrop:40;
  --z-modal:         50;
  --z-toast:         60;
}
```

---

## Transitions

```css
:root {
  /* Duration */
  --duration-instant: 50ms;   /* 즉각 반응 — 버튼 색상 */
  --duration-fast:   150ms;   /* 드롭다운 열기, 탭 전환 */
  --duration-normal: 200ms;   /* 모달 열기, 슬라이드 */
  --duration-slow:   300ms;   /* 페이지 전환, 복잡한 애니메이션 */

  /* Easing */
  --ease-out:     cubic-bezier(0, 0, 0.2, 1);       /* 표준 ease-out */
  --ease-spring:  cubic-bezier(0.16, 1, 0.3, 1);    /* ease-out-expo — 드롭다운, 모달 */
  --ease-in:      cubic-bezier(0.4, 0, 1, 1);       /* 요소 사라질 때 */
}
```

표준 transition 클래스 조합:
```tsx
// 버튼 hover
className="transition-colors duration-[150ms] ease-out"

// 드롭다운
className="transition-[opacity,transform] duration-[200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"

// 사이드바 슬라이드 (모바일)
className="transition-transform duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
```
