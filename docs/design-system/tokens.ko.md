# 디자인 토큰

> 구현 기준: `src/app/globals.css`
>
> CareerOS의 기본 방향은 **블랙/화이트 중심의 조용한 AI 어시스턴트 UI**입니다. 색상은 상태를 구분할 때만 절제해서 쓰고, 기본 위계는 배경 농도, 보더, 글자 크기와 굵기로 만듭니다.

---

## 폰트

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

- 한글 UI는 Pretendard Variable을 기준으로 합니다.
- 기본 자간은 `0`입니다. 화면 폭에 따라 폰트 크기를 직접 스케일하지 않습니다.
- 앱 내부 제목은 대체로 `19px / 560`, 본문과 설명은 `13px / 400-500`을 기준으로 합니다.

---

## 전역 타입 스케일

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

| 토큰 | 용도 |
| --- | --- |
| `--text-2xs` | 메타 라벨, 작은 카운트 |
| `--text-xs` | 배지, 보조 설명, 리스트 메타 |
| `--text-sm` | 앱 본문, 버튼, 네비게이션 |
| `--text-md` | 입력값, 폼 컨트롤 |
| `--text-title` | 앱 페이지의 agent intro 제목 |

---

## 다크 앱 팔레트

`(auth)`와 `(admin)` 라우트는 `.dark-app`을 사용합니다.

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

원칙:

- 기본 UI는 `--da-bg`, `--da-surface`, `--da-surface-2` 세 단계로 구성합니다.
- 카드와 리스트는 그림자보다 `--da-border`와 `--da-border-row`로 구분합니다.
- muted cobalt는 작은 상태/디테일 accent로만 사용합니다.
- AI 보라색 그라데이션, 네온 분석 색상, 장식적인 컬러 면은 피합니다.
- agent 분석 영역은 거의 흑백/그레이 톤으로 유지합니다.

---

## 랜딩 팔레트

`(public)` 라우트는 `.dark-landing`을 사용합니다.

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

랜딩은 제품 판매보다 “개인 커리어 정리 어시스턴트” 느낌을 우선합니다. 실제 회사명 로고나 과도한 상업적 proof는 사용하지 않습니다.
앱보다 색상을 조금 더 쓸 수 있지만, saturated AI 보라색 대신 muted cobalt, paper white, graphite, warm gray 중심으로 전문적인 편집 디자인처럼 사용합니다.

---

## 반경과 그림자

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

- 일반 카드와 패널은 `8px` 이하를 기본으로 합니다.
- 모달과 팝오버만 `12px`를 허용합니다.
- 페이지 섹션을 큰 카드처럼 감싸지 않습니다.

---

## 모션

```css
--ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
```

- 페이지 진입: `agent-page-in`, 420ms.
- 패널 진입: `agent-reveal`, 520ms.
- 스캐닝 느낌: `agent-shimmer`, 필요한 로딩/분석 상태에만 사용합니다.
- `prefers-reduced-motion: reduce`에서는 agent 애니메이션을 끕니다.

---

## 포커스

```css
.ds-focus-ring:focus-visible {
  outline: 1px solid var(--da-focus);
  outline-offset: 2px;
}
```

키보드 접근성이 필요한 커스텀 버튼, 모달, 컨트롤에는 `ds-focus-ring`을 붙입니다.
