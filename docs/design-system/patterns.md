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
