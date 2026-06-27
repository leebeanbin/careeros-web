# Layout System

> 수치 출처: linear.app 클로닝 실측값 (careeros-view)

---

## 전체 레이아웃 구조

careeros-web은 두 가지 독립된 레이아웃을 사용합니다:

| 레이아웃 | 라우트 | 기준 레퍼런스 |
|---------|--------|-------------|
| **Dark Landing** | `(public)/page.tsx` | linear.app 마케팅 실측 |
| **App Shell** | `(auth)/`, `(admin)/` | linear.app 앱 내부 실측 |
| **Auth Card** | `(public)/login`, `/signup` | vercel.com/login 참고 |

---

## 1. App Shell — `(auth)/layout.tsx`

```
┌──────────────────────────────────────────────────────────┐
│ Topbar                                         🔔  👤    │  h-12 (48px)
├────────────┬─────────────────────────────────────────────┤
│            │                                             │
│  Sidebar   │  Main Content                               │
│  230px     │  flex-1, overflow-y-auto, bg-white          │
│  bg-gray-50│  콘텐츠 padding: 페이지 variant에 따름       │
│            │                                             │
└────────────┴─────────────────────────────────────────────┘
```

### Topbar

```
높이:     h-12 (48px)
배경:     bg-white
하단:     border-b border-gray-200
패딩:     px-4
```

구성:
- **왼쪽:** 페이지 제목 `text-sm font-semibold text-gray-900` 또는 breadcrumb
- **오른쪽:** 알림 벨 + 읽지않은 수 배지 + 유저 아바타 드롭다운

알림 배지:
```tsx
<span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center
                 justify-center rounded-full bg-red-500 text-[10px]
                 font-medium text-white">
  {count > 9 ? '9+' : count}
</span>
```

### Sidebar

```
너비:    w-[230px]          — linear.app 앱 실측
배경:    bg-gray-50         — off-white (흰색보다 살짝 어두움)
우측:    border-r border-gray-200
패딩:    px-2 py-3
```

#### Nav Item
```tsx
// linear.app 앱 실측: h-7(28px), text-[13px], px-2, rounded-md
<Link
  href={href}
  className={`flex h-7 items-center gap-2 rounded-md px-2
    text-[13px] transition-colors duration-[150ms]
    ${isActive
      ? 'bg-gray-200/70 font-medium text-gray-900'
      : 'font-normal text-gray-600 hover:bg-gray-200/50 hover:text-gray-800'
    }`}
>
  <Icon className="h-4 w-4 shrink-0 text-gray-500" />
  <span>{label}</span>
  {badge && (
    <span className="ml-auto text-[11px] text-gray-400">{badge}</span>
  )}
</Link>
```

#### Nav 구성
```
섹션 1 — 메인
  /dashboard        대시보드
  /jobs             채용 공고
  /matches          나의 매칭
  /resume           이력서
  /github           GitHub
  /candidate        경력 그래프
  /advisor          AI 어드바이저

<hr className="my-2 border-gray-200" />

섹션 2 — 설정
  /notifications    알림   [unreadCount 배지]
  /settings         설정
```

### Content Area Variants

| Variant | 클래스 | 페이지 |
|---------|--------|-------|
| Wide | `max-w-[1200px] mx-auto px-5 py-6` | Jobs, Matches |
| Default | `max-w-[900px] mx-auto px-5 py-6` | Dashboard, Advisor, Notifications |
| Narrow | `max-w-[640px] mx-auto px-5 py-6` | Settings, Resume, Candidate |

> `px-5 py-6` = 20px / 24px — linear.app 앱 내부 기준

#### Page Header (각 페이지 최상단)
```tsx
<div className="mb-6 flex items-center justify-between">
  <div>
    <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
    {description && (
      <p className="mt-0.5 text-sm text-gray-500">{description}</p>
    )}
  </div>
  {action}
</div>
```

### Cards

```tsx
// 기본 카드 — linear.app 앱: border + 극소 그림자
<div className="rounded-lg border border-gray-200 bg-white p-4
                shadow-[0_1px_2px_rgba(0,0,0,0.04)]
                transition-all duration-[150ms]
                hover:border-gray-300
                hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_2px_6px_rgba(0,0,0,0.06)]">

// 클릭 가능한 카드 (Link)
<Link className="block rounded-lg border border-gray-200 bg-white p-4
                 transition-all duration-[150ms]
                 hover:border-gray-300
                 hover:shadow-[0_2px_4px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.08)]">
```

### layout.tsx 전체 코드
```tsx
export default function AuthLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-[230px] lg:shrink-0 lg:flex-col
                        lg:border-r lg:border-gray-200 lg:bg-gray-50">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
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

## 2. Dark Landing — `(public)/page.tsx`

linear.app 실측값 기반. 전체 dark mode.

```
배경:       bg-[#08090A]
최대폭:     max-w-[1440px] mx-auto
양쪽 패딩:  px-16 (64px) — linear.app 실측
```

### Landing Nav
```
높이:     h-[73px]          — linear.app 실측
position: fixed top-0
배경:     transparent + backdrop-blur-xl
하단:     border-b border-[rgba(255,255,255,0.08)]
패딩:     px-8 (32px)
z-index:  z-[100]
스크롤:   배경 변화 없음 — 항상 투명
```

```tsx
<header className="fixed top-0 left-0 right-0 z-[100] h-[73px]
                   flex items-center justify-between px-8
                   border-b border-white/[0.08] backdrop-blur-xl">
  <Logo />
  <nav className="flex items-center">
    {navLinks.map(link => (
      <a key={link} className="flex h-[73px] items-center px-3
                               text-[13px] text-[#F7F8F8]
                               transition-opacity duration-[150ms]
                               hover:opacity-70">
        {link}
      </a>
    ))}
  </nav>
  <div className="flex items-center gap-1">
    <a className="text-[13px] text-[#8A8F98] px-3">로그인</a>
    <Link href="/signup" className="flex h-8 items-center rounded-full
                                    bg-[#E5E5E6] px-3 text-[13px]
                                    font-[510] text-[#08090A]">
      시작하기
    </Link>
  </div>
</header>
```

### Landing Hero Section
```
패딩:     pt-[180px] pb-0  (fixed nav 보정 포함)
배경:     bg-[#08090A]
```

타이포그래피 (linear.app 실측):
```tsx
// H1
<h1 className="text-[64px] font-[510] leading-none tracking-[-0.022em]
               text-[#F7F8F8] max-w-[860px] mb-6">
  AI가 찾아주는 커리어 매칭 플랫폼
</h1>

// Subtitle
<p className="text-base font-normal leading-[1.625] text-[#8A8F98]">
  이력서를 올리면 AI가 맞춤 채용 포지션을 매칭합니다.
</p>
```

### Landing Section (반복 섹션)
```
패딩:     py-20 px-16 (80px / 64px — 실측)
구분선:   border-t border-[rgba(255,255,255,0.05)]
```

H2 타이포그래피:
```tsx
<h2 className="text-[48px] font-[510] leading-[52px] tracking-[-0.02em]
               text-[#F7F8F8] max-w-[520px]">
  매칭 점수를 한눈에
</h2>
```

Section 설명 텍스트:
```tsx
<p className="text-base font-normal leading-[26px] text-[#8A8F98] mb-5">
  ...
</p>
```

Feature 카드:
```tsx
// linear.app 실측: bg rgb(15,16,17), border rgba(255,255,255,0.05), radius 8px
<div className="bg-[#0F1011] border border-[rgba(255,255,255,0.05)] rounded-lg
                p-0 overflow-hidden min-h-[560px]">
```

3-column pillar 카드:
```tsx
<div className="grid grid-cols-3 gap-2">
  {pillars.map(p => (
    <div className="bg-[#0F1011] border border-[rgba(255,255,255,0.05)]
                    rounded-lg px-6 pb-7 flex flex-col">
      <div className="h-[220px] flex items-center justify-center mb-4">
        {/* SVG wireframe illustration */}
      </div>
      <h3 className="text-[15px] font-[510] text-[#F7F8F8] mb-2">{p.title}</h3>
      <p className="text-sm font-normal leading-5 text-[#8A8F98]">{p.desc}</p>
    </div>
  ))}
</div>
```

---

## 3. Auth Card — 로그인 / 회원가입

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

## 반응형 브레이크포인트

| 브레이크포인트 | 너비 | 변화 |
|------------|------|------|
| `< md` | 768px 미만 | 사이드바 숨김, 모바일 드로어 |
| `md` | 768px | 사이드바 토글 가능 |
| `≥ lg` | 1024px+ | 사이드바 고정 표시 |
| Landing `md` | 768px | 헤딩 스택, 폰트 축소 (H1 64→36px) |
| Landing `xl` | 1440px | 최대폭 도달 |

---

## Mobile Drawer (앱 모바일)

```tsx
// 오버레이
<div className={`fixed inset-0 z-[40] bg-black/30 lg:hidden
  transition-opacity duration-[200ms]
  ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
  onClick={close}
/>

// 사이드바 패널
<aside className={`fixed left-0 top-0 z-[50] h-full w-[230px]
  bg-gray-50 border-r border-gray-200 lg:hidden
  transition-transform duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)]
  ${open ? 'translate-x-0' : '-translate-x-full'}`}>
  <SidebarContent />
</aside>
```
