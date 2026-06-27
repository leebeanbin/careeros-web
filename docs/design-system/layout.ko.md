# 레이아웃 시스템

> `(auth)` 전체 페이지 셸 · 네비게이션 · 반응형 동작을 정의합니다.
>
> **[cloner]** 태그 수치는 linear.app 클론 후 실측값으로 교체 예정.

[English](./layout.md) | 🇰🇷 **한국어**

---

## 페이지 셸

```
┌──────────────────────────────────────────────────────────┐
│ 탑바                                           🔔  👤    │  h-12 (48px) [cloner]
├────────────┬─────────────────────────────────────────────┤
│            │                                             │
│  사이드바   │  메인 콘텐츠                                 │
│  w-[230px] │  flex-1, overflow-y-auto                    │
│  bg-gray-50│  bg-white                                   │
│            │  px-5 py-6 (내부 패딩)                      │
│            │                                             │
└────────────┴─────────────────────────────────────────────┘
```

---

## 탑바 (`src/components/ui/Topbar.tsx`)

```
높이:     h-12 (48px)  [cloner: linear.app 실측]
배경:     bg-white
하단:     border-b border-gray-200
패딩:     px-4
```

- **왼쪽:** 현재 페이지 제목 (`text-sm font-semibold text-gray-900`) 또는 브레드크럼
- **오른쪽:** 알림 벨 (읽지 않은 수 배지) + 유저 아바타 드롭다운

---

## 사이드바 (`src/components/ui/Sidebar.tsx`)

```
너비:    w-[230px]   [cloner: linear.app 실측]
배경:    bg-gray-50
우측:    border-r border-gray-200
패딩:    px-2 py-3
```

### Nav Item 구조

```tsx
// 높이: h-7 (28px), 텍스트: text-[13px]
<Link
  href="/jobs"
  className={`flex h-7 items-center gap-2 rounded-md px-2 text-[13px]
    transition-colors duration-[100ms]
    ${isActive
      ? 'bg-gray-200/70 font-medium text-gray-900'
      : 'font-normal text-gray-600 hover:bg-gray-200/50 hover:text-gray-800'
    }`}
>
  <Icon className="h-4 w-4 shrink-0" />
  {label}
</Link>
```

### Nav 구성

```
섹션 1 (메인)
  /dashboard        대시보드
  /jobs             채용 공고
  /matches          나의 매칭
  /resume           이력서
  /github           GitHub
  /candidate        경력 그래프
  /advisor          AI 어드바이저

─── 구분선 ───

섹션 2 (설정)
  /notifications    알림  [읽지않은 수]
  /settings         설정
```

---

## 콘텐츠 영역

### 너비 Variant

| Variant | 클래스 | 사용 페이지 |
|---------|--------|-----------|
| **Wide** | `max-w-[1200px] mx-auto px-5 py-6` | Jobs, Matches |
| **Default** | `max-w-[900px] mx-auto px-5 py-6` | Dashboard, Advisor, Notifications |
| **Narrow** | `max-w-[640px] mx-auto px-5 py-6` | Settings, Resume, Candidate |

### 페이지 헤더

```tsx
<div className="mb-6 flex items-center justify-between">
  <div>
    <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
    {description && (
      <p className="mt-0.5 text-sm text-gray-500">{description}</p>
    )}
  </div>
  {action && <div>{action}</div>}
</div>
```

---

## 카드

```tsx
// 기본 카드
<div className="rounded-lg border border-gray-200 bg-white p-4
                shadow-[0_1px_2px_rgba(0,0,0,0.04)]
                transition-shadow duration-[150ms]
                hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_2px_6px_rgba(0,0,0,0.06)]">

// 클릭 가능한 카드
<Link className="block rounded-lg border border-gray-200 bg-white p-4
                 transition-all duration-[150ms]
                 hover:border-gray-300
                 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_2px_6px_rgba(0,0,0,0.06)]">
```

---

## 반응형 브레이크포인트

| 브레이크포인트 | 너비 | 사이드바 동작 |
|-------------|------|-------------|
| `< md` | 768px 미만 | 숨김. 햄버거 버튼으로 드로어 열기 |
| `md–lg` | 768–1024px | 토글 가능 (기본 닫힘) |
| `≥ lg` | 1024px 이상 | 항상 표시 |

---

## (auth)/layout.tsx 구조

```tsx
export default function AuthLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <aside className="hidden lg:flex lg:w-[230px] lg:flex-col
                        lg:border-r lg:border-gray-200 lg:bg-gray-50">
        <SidebarContent />
      </aside>
      <MobileDrawer />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  )
}
```

---

## (public) 페이지

```tsx
<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
  <div className="w-full max-w-[400px] rounded-xl bg-white p-8
                  shadow-[0_4px_8px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.12)]">
    <Logo className="mb-6 h-8" />
    {children}
  </div>
</div>
```

---

## (public) 랜딩 페이지 `/`

클로너로 `linear.app` 클론 후 섹션별 수치 반영 예정.

임시 구조:
```
Hero      — 중앙 정렬, max-w-3xl, py-24
Features  — 3열 그리드, max-w-5xl, py-16
CTA       — 배경 색상, py-16
Footer    — max-w-5xl, py-8
```
