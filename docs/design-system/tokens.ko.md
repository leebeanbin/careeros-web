# 컬러 및 타이포그래피 토큰 정의서

> 기술 사양: Tailwind CSS v4 및 CSS Custom Properties

---

## 컬러 팔레트

```css
:root {
  /* 브랜드 색상 */
  --color-primary-50:  #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;  /* 메인 */
  --color-primary-600: #2563eb;  /* hover */
  --color-primary-700: #1d4ed8;  /* active */

  /* 무채색 */
  --color-gray-50:  #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-500: #6b7280;
  --color-gray-700: #374151;
  --color-gray-900: #111827;

  /* 의미론적 컬러 */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error:   #ef4444;
  --color-info:    #3b82f6;

  /* 매칭 점수 색상 */
  --color-match-strong:  #16a34a;  /* 85점 이상 */
  --color-match-good:    #65a30d;  /* 70-84점 */
  --color-match-medium:  #ca8a04;  /* 50-69점 */
  --color-match-weak:    #9ca3af;  /* 50점 미만 */
}
```

---

## 타이포그래피

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

## 간격 및 모서리 둥글기

```css
:root {
  --radius-sm: 0.25rem;   /* 4px  — 배지, 태그 */
  --radius-md: 0.5rem;    /* 8px  — 버튼, 입력창 */
  --radius-lg: 0.75rem;   /* 12px — 카드 */
  --radius-xl: 1rem;      /* 16px — 모달 */
}
```
