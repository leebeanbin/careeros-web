# UI Patterns

> Reusable patterns for forms, feedback, loading, and overlays. Apply consistently across all pages.

---

## Form Pattern

All forms use **React Hook Form**. Standard field structure:

```tsx
<div className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Email
    </label>
    <input
      {...register('email', { required: true })}
      type="email"
      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-primary-500
                 disabled:bg-gray-100"
    />
    {errors.email && (
      <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
    )}
  </div>
</div>
```

Rules:
- Label always above input (`mb-1`)
- Error message below input (`mt-1 text-xs text-red-600`)
- Submit button shows inline spinner while `isSubmitting`
- Disabled state on all fields while submitting

---

## Button States

```tsx
// Primary
<button className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white
                   hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">
  저장
</button>

// Secondary (outline)
<button className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700
                   hover:bg-gray-50 disabled:opacity-50">
  취소
</button>

// Danger
<button className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white
                   hover:bg-red-700">
  삭제
</button>
```

Loading state inside button:

```tsx
<button disabled={isPending}>
  {isPending ? <Spinner size="sm" /> : '저장'}
</button>
```

---

## Toast Notifications

Global pattern: Zustand `toastStore` + `<ToastContainer />` mounted in root layout.

```ts
// src/stores/toastStore.ts
interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

interface ToastStore {
  toasts: Toast[]
  add: (type: Toast['type'], message: string) => void
  remove: (id: string) => void
}
```

Usage in any component:

```ts
const { add } = useToastStore()
add('success', '저장되었습니다.')
add('error', '오류가 발생했습니다.')
```

Visual variants:
- `success` → green-50 bg, green-800 text, checkmark icon
- `error` → red-50 bg, red-800 text, X icon
- `info` → blue-50 bg, blue-800 text, info icon

Auto-dismiss after 4 seconds. Position: bottom-right, `fixed z-50`.

---

## Loading States

### Skeleton (list / detail pages)

```tsx
// Card skeleton — use 3x for list loading
<div className="animate-pulse rounded-lg border border-gray-200 bg-white p-4">
  <div className="h-4 w-3/4 rounded bg-gray-200" />
  <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
</div>
```

### Inline Spinner (button actions)

```tsx
// src/components/ui/Spinner.tsx
<svg className="animate-spin h-4 w-4 text-white" ... />
```

Sizes: `sm` (h-4 w-4), `md` (h-6 w-6), `lg` (h-8 w-8)

### `loading.tsx` (Next.js route segment)

Each route segment can export `loading.tsx` → renders skeleton automatically during navigation.

---

## Empty State

Used when a list query returns 0 items:

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <p className="text-4xl">📭</p>
  <p className="mt-3 text-sm font-medium text-gray-900">결과가 없습니다</p>
  <p className="mt-1 text-sm text-gray-500">{description}</p>
  {action && (
    <Link href={action.href} className="mt-4 text-sm text-primary-600 hover:underline">
      {action.label}
    </Link>
  )}
</div>
```

---

## Error State

Route-level: `error.tsx` in each app segment:

```tsx
'use client'
export default function Error({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <p className="text-sm text-red-600">{error.message}</p>
      <button onClick={reset} className="mt-4 text-sm text-primary-600">
        다시 시도
      </button>
    </div>
  )
}
```

Inline query errors: catch via `isError` + show toast (do not render full-page error for query failures).

---

## Modal

```tsx
// src/components/ui/Modal.tsx
interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}
```

- Uses native `<dialog>` element with `showModal()` / `close()`
- Escape key closes via `onClose`
- Backdrop click closes
- Focus trapped inside while open

```tsx
<Modal open={isOpen} onClose={() => setIsOpen(false)} title="확인">
  <p>정말 삭제하시겠습니까?</p>
  <div className="mt-4 flex gap-2 justify-end">
    <button onClick={onClose}>취소</button>
    <button onClick={handleConfirm} className="text-red-600">삭제</button>
  </div>
</Modal>
```

---

## Confirm Dialog

Thin wrapper over `Modal`:

```tsx
// usage
const { confirm } = useConfirm()
const ok = await confirm('정말 삭제하시겠습니까?')
if (ok) mutate()
```

Implemented as a `<ConfirmProvider>` wrapping the app root, resolves a Promise when the user clicks confirm or cancel.

---

## Tabs

Used in: matches page (전체/숨김), admin pages (status filters).

```tsx
// Controlled by URL search param or local state
const tabs = [
  { label: '전체', value: 'all' },
  { label: '숨김', value: 'hidden' },
]

<div className="flex border-b border-gray-200">
  {tabs.map(tab => (
    <button
      key={tab.value}
      onClick={() => setActive(tab.value)}
      className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px
        ${active === tab.value
          ? 'border-primary-600 text-primary-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'}`}
    >
      {tab.label}
    </button>
  ))}
</div>
```

---

## Badge (Generic)

Used for: remoteType, employmentType, notification type, role, status.

```tsx
// variants: default | success | warning | error | info
<span className="inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium
                 bg-gray-100 text-gray-700">
  HYBRID
</span>

// variant colors
// success  → bg-green-100 text-green-700
// warning  → bg-amber-100 text-amber-700
// error    → bg-red-100 text-red-700
// info     → bg-blue-100 text-blue-700
```

`MatchScoreBadge` is a specialized badge — see [components.md](./components.md) for its score-color logic.

---

## Table

Used in: resume list, admin user table, admin job table, AI call history.

```tsx
<div className="overflow-x-auto rounded-lg border border-gray-200">
  <table className="min-w-full divide-y divide-gray-200 text-sm">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-4 py-3 text-left font-medium text-gray-500">파일명</th>
        <th className="px-4 py-3 text-left font-medium text-gray-500">업로드일</th>
        <th className="px-4 py-3" />
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100 bg-white">
      {rows.map(row => (
        <tr key={row.id} className="hover:bg-gray-50">
          <td className="px-4 py-3 text-gray-900">{row.name}</td>
          <td className="px-4 py-3 text-gray-500">{row.date}</td>
          <td className="px-4 py-3 text-right">{/* actions */}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

---

## Filter Bar

Used in: jobs page (6 filters), admin pages.

```tsx
// Collapsible on mobile via toggle state; always visible on lg+
<div className="flex flex-wrap gap-3 rounded-lg border border-gray-200 bg-white p-4">
  <input
    placeholder="키워드 검색"
    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm w-48"
  />
  <select className="rounded-md border border-gray-300 px-3 py-1.5 text-sm">
    <option value="">직무 유형</option>
    ...
  </select>
  <button onClick={clearFilters}
    className="text-sm text-gray-500 hover:text-gray-700">
    초기화
  </button>
</div>
```

Filter state lives in URL search params (`useSearchParams` + `router.push`), not component state — so filters survive page refresh and are shareable.

---

## Select / Multi-Select

Single select:
```tsx
<select
  {...register('remoteType')}
  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-primary-500"
>
  <option value="">선택</option>
  <option value="REMOTE">원격 근무</option>
  <option value="HYBRID">하이브리드</option>
  <option value="ON_SITE">오프사이트</option>
</select>
```

Multi-select (e.g. `preferredCountries`): use a checkbox group, not `<select multiple>`:
```tsx
{options.map(opt => (
  <label key={opt} className="flex items-center gap-2 text-sm">
    <input type="checkbox" value={opt} {...register('preferredCountries')} />
    {opt}
  </label>
))}
```

---

## Progress Bar

Used in: ResumeUploader (upload progress).

```tsx
<div className="h-1.5 w-full rounded-full bg-gray-200">
  <div
    className="h-1.5 rounded-full bg-primary-600 transition-all duration-300"
    style={{ width: `${progress}%` }}
  />
</div>
```

`progress` is a number 0–100 from the `XMLHttpRequest.upload.onprogress` event (or `fetch` with a custom stream reader).

---

## Stats Card

Used in: admin AI calls page (total calls, success rate, avg latency).

```tsx
<div className="rounded-lg border border-gray-200 bg-white p-5">
  <p className="text-sm font-medium text-gray-500">{label}</p>
  <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
  {trend && <p className="mt-1 text-xs text-gray-400">{trend}</p>}
</div>
```

Render 3 per row with `grid grid-cols-3 gap-4`.

---

## User Dropdown (Topbar)

Triggered by avatar click in the Topbar.

```tsx
// Simple absolute-positioned panel — no external library
<div className="relative">
  <button onClick={toggle}>
    <img src={avatarUrl} className="h-8 w-8 rounded-full" />
  </button>
  {open && (
    <div className="absolute right-0 mt-2 w-44 rounded-lg border border-gray-200
                    bg-white shadow-lg z-50">
      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
        {userName}
      </div>
      <Link href="/settings" className="block px-4 py-2 text-sm hover:bg-gray-50">
        설정
      </Link>
      <button onClick={logout}
        className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
        로그아웃
      </button>
    </div>
  )}
</div>
```

Logout: `POST /api/v1/auth/logout` → clear cookies → redirect `/login`. Close dropdown on outside click (`useEffect` with `mousedown` listener).
