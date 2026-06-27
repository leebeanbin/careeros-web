# 레이아웃 시스템

> `(auth)` 라우트 전반의 페이지 셸, 네비게이션, 반응형 동작을 정의합니다.

---

## 페이지 셸

```
┌─────────────────────────────────────────────────────┐
│ 탑바                                       🔔  👤    │  h-14 (56px)
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ 사이드바  │  메인 콘텐츠                              │
│  240px   │  flex-1, overflow-y-auto                 │
│          │  max-w-5xl mx-auto px-6 py-8             │
│          │                                          │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

### 탑바 (`src/components/ui/Topbar.tsx`)
- 높이: `h-14` (56px), `border-b border-gray-200`
- 왼쪽: 페이지 제목(라우트 세그먼트) 또는 브레드크럼
- 오른쪽: 알림 벨(읽지 않은 수 배지) + 유저 아바타 드롭다운

### 사이드바 (`src/components/ui/Sidebar.tsx`)
- 너비: `w-60` (240px), `border-r border-gray-200 bg-white`
- `lg+`에서 항상 표시, 더 작은 화면에서 기본 숨김
- 모바일: 탑바의 햄버거 버튼으로 슬라이드 드로어

---

## 사이드바 네비게이션

```
/dashboard        대시보드
/jobs             채용 공고
/matches          나의 매칭
/resume           이력서
/github           GitHub
/candidate        경력 그래프
/advisor          AI 어드바이저
/notifications    알림
─────────────
/settings         설정
```

활성 상태: `bg-primary-50 text-primary-700 font-medium`
기본 상태: `text-gray-600 hover:bg-gray-50`

---

## 콘텐츠 너비 변형

페이지 내 `<main>` 래퍼에 적용:

| 변형 | 클래스 | 사용 위치 |
|------|--------|---------|
| 기본 | `max-w-5xl mx-auto px-6 py-8` | 대시보드, 알림, 어드바이저 |
| 넓음 | `max-w-7xl mx-auto px-6 py-8` | 채용공고 목록, 매칭 목록 |
| 좁음 | `max-w-2xl mx-auto px-6 py-8` | 인증 페이지, 설정, 폼 |

---

## 반응형 브레이크포인트

| 브레이크포인트 | 너비 | 동작 |
|-------------|------|------|
| `sm` | 640px | 해당 없음 (모바일 퍼스트) |
| `md` | 768px | 토글로 사이드바 표시 |
| `lg` | 1024px | 사이드바 항상 표시, 콘텐츠 확장 |
| `xl` | 1280px | 대부분 페이지의 최대 콘텐츠 너비 도달 |

---

## (auth)/layout.tsx 구조

```tsx
export default function AuthLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
```

---

## (public) 페이지 (login, signup)

셸 없음. 가운데 정렬 카드 레이아웃:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                  ┌─────────────┐                    │
│                  │  로고        │                    │
│                  │  폼          │                    │  min-h-screen
│                  │  제출 버튼   │                    │  flex items-center
│                  └─────────────┘                    │  justify-center
│                     max-w-md                        │
└─────────────────────────────────────────────────────┘
```
