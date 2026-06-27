# Layout System

> Governs the page shell, navigation, and responsive behavior across all `(auth)` routes.

---

## Page Shell

```
┌─────────────────────────────────────────────────────┐
│ Topbar                                    🔔  👤     │  h-14 (56px)
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │  Main Content                            │
│  240px   │  flex-1, overflow-y-auto                 │
│          │  max-w-5xl mx-auto px-6 py-8             │
│          │                                          │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

### Topbar (`src/components/ui/Topbar.tsx`)
- Height: `h-14` (56px), `border-b border-gray-200`
- Left: page title (from route segment) or breadcrumb
- Right: notifications bell (unread count badge) + user avatar dropdown

### Sidebar (`src/components/ui/Sidebar.tsx`)
- Width: `w-60` (240px), `border-r border-gray-200 bg-white`
- Always visible on `lg+`, hidden by default on smaller screens
- Mobile: slide-in drawer triggered by hamburger in Topbar

---

## Sidebar Navigation

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

Active state: `bg-primary-50 text-primary-700 font-medium`
Default state: `text-gray-600 hover:bg-gray-50`

---

## Content Width Variants

Apply to the `<main>` wrapper inside pages:

| Variant | Class | Used in |
|---------|-------|---------|
| Default | `max-w-5xl mx-auto px-6 py-8` | Dashboard, notifications, advisor |
| Wide | `max-w-7xl mx-auto px-6 py-8` | Jobs list, matches list |
| Narrow | `max-w-2xl mx-auto px-6 py-8` | Auth pages, settings, forms |

---

## Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| `sm` | 640px | N/A (mobile-first) |
| `md` | 768px | Sidebar visible via toggle |
| `lg` | 1024px | Sidebar always visible, content expands |
| `xl` | 1280px | Max content width reached for most pages |

---

## (auth)/layout.tsx Structure

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

## (public) Pages (login, signup)

No shell. Centered card layout:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                  ┌─────────────┐                    │
│                  │  Logo       │                    │
│                  │  Form       │                    │  min-h-screen
│                  │  Submit btn │                    │  flex items-center
│                  └─────────────┘                    │  justify-center
│                     max-w-md                        │
└─────────────────────────────────────────────────────┘
```
