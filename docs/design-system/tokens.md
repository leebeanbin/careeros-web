# Design Tokens

> Implementation: Tailwind CSS v4 + CSS Custom Properties (`src/app/globals.css`)
>
> 수치 출처: linear.app 클로닝 실측값 (careeros-view 레포)

---

## Color Palette

### Light Mode — App Routes `(auth)/`, `(admin)/`

```css
:root {
  /* Brand — linear.app 실측 accent: rgb(99,102,241) = #6366f1 */
  --color-primary-50:  #eef2ff;
  --color-primary-100: #e0e7ff;
  --color-primary-200: #c7d2fe;
  --color-primary-500: #6366f1;   /* indigo-500 — linear.app 실측값과 일치 */
  --color-primary-600: #4f46e5;   /* hover */
  --color-primary-700: #4338ca;   /* active / pressed */

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
  --color-success:     #16a34a;   /* linear: rgb(34,197,94) → 더 진한 값 유지 */
  --color-success-bg:  #f0fdf4;
  --color-warning:     #ca8a04;   /* linear: rgb(234,179,8) */
  --color-warning-bg:  #fefce8;
  --color-error:       #dc2626;   /* linear: rgb(220,38,38) — 동일 */
  --color-error-bg:    #fef2f2;
  --color-info:        #6366f1;
  --color-info-bg:     #eef2ff;

  /* Match score */
  --color-match-strong:    #16a34a;
  --color-match-strong-bg: #f0fdf4;
  --color-match-good:      #65a30d;
  --color-match-good-bg:   #f7fee7;
  --color-match-medium:    #ca8a04;
  --color-match-medium-bg: #fefce8;
  --color-match-weak:      #9ca3af;
  --color-match-weak-bg:   #f9fafb;

  /* Surface (light mode) */
  --color-surface:        #ffffff;
  --color-surface-raised: #ffffff;
  --color-surface-subtle: #f9fafb;   /* sidebar bg */
  --color-border:         #e5e7eb;
  --color-border-subtle:  #f3f4f6;
}
```

### Dark Mode — Landing Page `/` only

```css
/* 전체 dark bg에 적용. (public)/page.tsx 전용 */
.dark-landing {
  /* linear.app 실측값 */
  --color-dark-bg:          rgb(8, 9, 10);       /* #08090A — 페이지 배경 */
  --color-dark-card:        rgb(15, 16, 17);     /* #0F1011 — 카드/사이드바 배경 */
  --color-dark-panel:       rgb(13, 14, 15);     /* #0D0E0F — 내부 패널 */
  --color-dark-text:        rgb(247, 248, 248);  /* #F7F8F8 — 주요 텍스트 */
  --color-dark-text-muted:  rgb(138, 143, 152);  /* #8A8F98 — 보조 텍스트 */
  --color-dark-text-link:   rgb(208, 214, 224);  /* #D0D6E0 — 링크/강조 */
  --color-dark-border:      rgba(255, 255, 255, 0.06);
  --color-dark-border-nav:  rgba(255, 255, 255, 0.08);
  --color-dark-hover:       rgba(255, 255, 255, 0.05);
}
```

---

## Typography

```css
:root {
  /* linear.app 실측: Inter Variable (가변 폰트) */
  --font-sans: 'Inter Variable', 'Inter', 'Pretendard', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Size scale — linear.app 실측 */
  --text-2xs: 0.6875rem;   /* 11px — badge 내부, issue ID */
  --text-xs:  0.75rem;     /* 12px — date(mono), 레이블 */
  --text-sm:  0.8125rem;   /* 13px — nav link, 버튼, body small */
  --text-base:1rem;        /* 16px — body, 설명문 */
  --text-lg:  0.9375rem;   /* 15px — 카드 제목 H3 */
  --text-xl:  1.25rem;     /* 20px — 페이지 헤딩 (앱) */
  --text-2xl: 2rem;        /* 32px — 인용문 */
  --text-3xl: 3rem;        /* 48px — H2 섹션 헤딩 */
  --text-4xl: 4rem;        /* 64px — H1 hero (linear.app 실측) */

  /* Font weight — Inter Variable 지원값 */
  --font-normal:  400;
  --font-medium:  500;
  --font-510:     510;   /* linear.app 전용 semi-medium — Inter Variable만 지원 */
  --font-semibold:600;
  --font-bold:    700;

  /* Line height — linear.app 실측 */
  --leading-hero:    1;       /* H1: font-size와 동일 (64px / 64px) */
  --leading-h2:      1.0833;  /* H2: 52px / 48px */
  --leading-h3:      1.4667;  /* H3: 22px / 15px */
  --leading-body:    1.625;   /* body: 26px / 16px */
  --leading-small:   1.4286;  /* small: 20px / 14px */
  --leading-normal:  1.5;

  /* Letter spacing — linear.app 실측 */
  --tracking-h1: -0.022em;   /* -1.408px at 64px */
  --tracking-h2: -0.02em;    /* -0.96px at 48px */
  --tracking-tight: -0.01em;
  --tracking-normal: 0;
}
```

---

## Spacing Scale

```
linear.app 실측 기준:
- 섹션 내부 padding: 80px 상하 / 64px 좌우 (1440px 레이아웃)
- 콘텐츠 최대 폭: 1440px
- 앱 콘텐츠 padding: 20px 좌우 (--px-5)
```

| Token | px | 용도 |
|-------|-----|------|
| `p-1` | 4px | 아이콘 내부 패딩 |
| `p-1.5` | 6px | 배지 패딩 |
| `p-2` | 8px | 인라인 요소 |
| `p-3` | 12px | nav item 패딩 |
| `p-4` | 16px | 카드 내부 |
| `p-5` | 20px | 앱 콘텐츠 영역 (Linear 앱 기준) |
| `p-6` | 24px | 카드 header 패딩 |
| `p-7` | 28px | 카드 하단 패딩 (linear.app: `pb-28px`) |
| `p-8` | 32px | 모달 내부 |
| `p-12` | 48px | 섹션 내 요소 간격 |
| `p-16` | 64px | 랜딩 섹션 좌우 패딩 |
| `p-20` | 80px | 랜딩 섹션 상하 패딩 |

---

## Border Radius

```css
:root {
  /* linear.app 실측 */
  --radius-xs:   3px;     /* 작은 배지 */
  --radius-sm:   4px;     /* 배지, 태그, label badge */
  --radius-md:   6px;     /* 버튼, 입력창 (앱) */
  --radius-lg:   8px;     /* 카드, 드롭다운 */
  --radius-xl:   12px;    /* 앱 모달, 모크업 창 상단 */
  --radius-2xl:  16px;    /* 큰 모달 */
  --radius-full: 9999px;  /* pill 버튼 — linear.app 버튼 전체 */
}
```

---

## Shadows

```css
:root {
  /* linear.app은 거의 섀도우 없이 border로 구분. 앱 내 컴포넌트 기준 */
  --shadow-xs:  0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 4px rgba(0, 0, 0, 0.06);
  --shadow-md:  0 2px 4px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg:  0 4px 8px rgba(0, 0, 0, 0.06), 0 12px 32px rgba(0, 0, 0, 0.12);
  --shadow-xl:  0 8px 16px rgba(0, 0, 0, 0.08), 0 24px 48px rgba(0, 0, 0, 0.16);

  /* 랜딩 nav: 섀도우 없음, blur로 대체 */
  --shadow-nav-blur: backdrop-filter: blur(20px);
}
```

---

## Z-Index

```css
:root {
  /* linear.app nav z-index: 100 — 우리는 더 단순하게 */
  --z-base:            0;
  --z-raised:          1;
  --z-sidebar:        10;
  --z-topbar:         20;
  --z-dropdown:       30;
  --z-tooltip:        35;
  --z-modal-backdrop: 40;
  --z-modal:          50;
  --z-toast:          60;
}
```

---

## Transitions

```css
:root {
  /* linear.app 실측: nav hover opacity 0.15s ease */
  --duration-instant: 50ms;
  --duration-fast:    150ms;   /* 버튼 hover, nav 링크 — linear.app 실측 */
  --duration-normal:  200ms;   /* 드롭다운, 탭 */
  --duration-slow:    300ms;   /* 사이드바 슬라이드 */

  --ease-out:    cubic-bezier(0, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in:     cubic-bezier(0.4, 0, 1, 1);
}
```
