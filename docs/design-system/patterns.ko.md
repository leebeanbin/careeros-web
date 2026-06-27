# UI 패턴

> 폼, 피드백, 로딩, 오버레이의 재사용 패턴. 모든 페이지에 일관되게 적용.

---

## 폼 패턴

모든 폼은 **React Hook Form** 사용. 표준 필드 구조:

```tsx
<div className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      이메일
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

규칙:
- 레이블은 항상 인풋 위에 (`mb-1`)
- 에러 메시지는 인풋 아래에 (`mt-1 text-xs text-red-600`)
- 제출 버튼은 `isSubmitting` 동안 인라인 스피너 표시
- 제출 중 모든 필드 비활성화

---

## 버튼 상태

```tsx
// 기본 (Primary)
<button className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white
                   hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">
  저장
</button>

// 보조 (Secondary, 아웃라인)
<button className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700
                   hover:bg-gray-50 disabled:opacity-50">
  취소
</button>

// 위험 (Danger)
<button className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white
                   hover:bg-red-700">
  삭제
</button>
```

버튼 내 로딩 상태:

```tsx
<button disabled={isPending}>
  {isPending ? <Spinner size="sm" /> : '저장'}
</button>
```

---

## 토스트 알림

전역 패턴: Zustand `toastStore` + 루트 레이아웃에 마운트된 `<ToastContainer />`

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

컴포넌트에서 사용:

```ts
const { add } = useToastStore()
add('success', '저장되었습니다.')
add('error', '오류가 발생했습니다.')
```

시각적 변형:
- `success` → green-50 배경, green-800 텍스트, 체크 아이콘
- `error` → red-50 배경, red-800 텍스트, X 아이콘
- `info` → blue-50 배경, blue-800 텍스트, 정보 아이콘

4초 후 자동 닫힘. 위치: 우측 하단, `fixed z-50`.

---

## 로딩 상태

### 스켈레톤 (리스트/상세 페이지)

```tsx
// 카드 스켈레톤 — 리스트 로딩 시 3개 사용
<div className="animate-pulse rounded-lg border border-gray-200 bg-white p-4">
  <div className="h-4 w-3/4 rounded bg-gray-200" />
  <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
</div>
```

### 인라인 스피너 (버튼 액션)

```tsx
// src/components/ui/Spinner.tsx
<svg className="animate-spin h-4 w-4 text-white" ... />
```

크기: `sm` (h-4 w-4), `md` (h-6 w-6), `lg` (h-8 w-8)

### `loading.tsx` (Next.js 라우트 세그먼트)

각 라우트 세그먼트에 `loading.tsx`를 export하면 네비게이션 중 스켈레톤을 자동으로 렌더링.

---

## 빈 상태 (Empty State)

리스트 쿼리가 0개 결과를 반환할 때 사용:

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

## 에러 상태

라우트 레벨: 각 app 세그먼트의 `error.tsx`:

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

인라인 쿼리 에러: `isError`로 감지 → 토스트 표시 (쿼리 실패 시 전체 페이지 에러 렌더링 금지).

---

## 모달

```tsx
// src/components/ui/Modal.tsx
interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}
```

- 네이티브 `<dialog>` 요소 사용 (`showModal()` / `close()`)
- Escape 키로 `onClose` 호출
- 배경 클릭으로 닫힘
- 열려 있는 동안 포커스 트랩

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

## 확인 다이얼로그

`Modal`을 얇게 래핑:

```tsx
// 사용법
const { confirm } = useConfirm()
const ok = await confirm('정말 삭제하시겠습니까?')
if (ok) mutate()
```

앱 루트를 감싸는 `<ConfirmProvider>`로 구현. 사용자가 확인/취소 클릭 시 Promise를 resolve.
