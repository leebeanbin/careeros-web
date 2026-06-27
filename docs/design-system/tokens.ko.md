# 디자인 토큰

> 구현: Tailwind CSS v4 + CSS Custom Properties (`src/app/globals.css`)
>
> **[cloner]** 태그 수치는 Linear/Discord 클로닝 후 실측값으로 교체 예정.

---

## 컬러 팔레트

```css
:root {
  /* 브랜드 — 클로닝 전 기본값. linear.app 클론 후 accent 컬러 검토 */
  --color-primary-50:  #eef2ff;
  --color-primary-100: #e0e7ff;
  --color-primary-200: #c7d2fe;
  --color-primary-500: #6366f1;  /* indigo-500 — 전문 툴 느낌 */
  --color-primary-600: #4f46e5;  /* hover */
  --color-primary-700: #4338ca;  /* active / pressed */

  /* 무채색 */
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

  /* 의미론적 컬러 */
  --color-success:     #16a34a;
  --color-success-bg:  #f0fdf4;
  --color-warning:     #ca8a04;
  --color-warning-bg:  #fefce8;
  --color-error:       #dc2626;
  --color-error-bg:    #fef2f2;
  --color-info:        #6366f1;
  --color-info-bg:     #eef2ff;

  /* 매칭 점수 */
  --color-match-strong:    #16a34a;  /* 85점 이상 */
  --color-match-strong-bg: #f0fdf4;
  --color-match-good:      #65a30d;  /* 70–84점 */
  --color-match-good-bg:   #f7fee7;
  --color-match-medium:    #ca8a04;  /* 50–69점 */
  --color-match-medium-bg: #fefce8;
  --color-match-weak:      #9ca3af;  /* 50점 미만 */
  --color-match-weak-bg:   #f9fafb;

  /* 서피스 */
  --color-surface:        #ffffff;   /* 카드 / 패널 배경 */
  --color-surface-raised: #ffffff;   /* 모달, 드롭다운 */
  --color-surface-subtle: #f9fafb;   /* 페이지 배경, 사이드바 */
  --color-border:         #e5e7eb;   /* 기본 테두리 */
  --color-border-subtle:  #f3f4f6;   /* 구분선 */
}
```

---

## 타이포그래피

```css
:root {
  --font-sans: 'Pretendard', 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;

  /* 크기 스케일 — [cloner] 실측 후 검토 */
  --text-2xs: 0.6875rem;  /* 11px — 메타데이터, 타임스탬프 */
  --text-xs:  0.75rem;    /* 12px — 레이블, 배지 */
  --text-sm:  0.8125rem;  /* 13px — 사이드바 nav, 테이블 행 (Linear 기준) */
  --text-base:1rem;       /* 16px — 본문, 폼 입력 */
  --text-lg:  1.125rem;   /* 18px — 카드 제목 */
  --text-xl:  1.25rem;    /* 20px — 페이지 헤딩 */
  --text-2xl: 1.5rem;     /* 24px — 섹션 헤딩 */
  --text-3xl: 1.875rem;   /* 30px — 히어로 헤딩 */
  --text-4xl: 2.25rem;    /* 36px — 랜딩 히어로 */

  /* 행간 */
  --leading-tight:  1.25;
  --leading-snug:   1.375;
  --leading-normal: 1.5;
  --leading-relaxed:1.625;

  /* 굵기 */
  --font-normal:  400;
  --font-medium:  500;
  --font-semibold:600;
  --font-bold:    700;
}
```

---

## 간격 스케일

Tailwind 기본 스케일 사용. 자주 쓰는 조합:

| 토큰 | 값 | 용도 |
|------|-----|------|
| `p-1` / `gap-1` | 4px | 아이콘 내부 패딩 |
| `p-1.5` | 6px | 배지 패딩 |
| `p-2` / `gap-2` | 8px | 인라인 요소 간격 |
| `p-3` / `gap-3` | 12px | Nav item 패딩 |
| `p-4` / `gap-4` | 16px | 카드 내부 패딩 |
| `p-5` | 20px | 콘텐츠 영역 패딩 (Linear 기준) |
| `p-6` / `gap-6` | 24px | 페이지 섹션 패딩 |
| `p-8` / `py-8` | 32px | 페이지 상하단 |
| `py-16` | 64px | Empty state |

---

## 보더 반경

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

## 섀도우

Linear 수준의 절제된 섀도우.

```css
:root {
  /* 카드, 인풋 — 거의 보이지 않는 깊이감 */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);

  /* 카드 hover, 선택 항목 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04),
               0 1px 4px rgba(0, 0, 0, 0.06);

  /* 드롭다운, 팝오버 */
  --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.04),
               0 4px 12px rgba(0, 0, 0, 0.08);

  /* 모달 */
  --shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.06),
               0 12px 32px rgba(0, 0, 0, 0.12);

  /* 토스트 */
  --shadow-xl: 0 8px 16px rgba(0, 0, 0, 0.08),
               0 24px 48px rgba(0, 0, 0, 0.16);
}
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

## 트랜지션

```css
:root {
  /* Duration */
  --duration-instant: 50ms;   /* 버튼 색상 */
  --duration-fast:   150ms;   /* 드롭다운, 탭 전환 */
  --duration-normal: 200ms;   /* 모달, 슬라이드 */
  --duration-slow:   300ms;   /* 페이지 전환 */

  /* Easing */
  --ease-out:    cubic-bezier(0, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);  /* 드롭다운, 모달 */
  --ease-in:     cubic-bezier(0.4, 0, 1, 1);     /* 요소 사라질 때 */
}
```
