# 공통 UI 컴포넌트 명세

> 구현 위치: `src/components/`
>
> 모든 앱 내부 공통 컴포넌트는 `.dark-app` 토큰을 기본값으로 삼습니다. 랜딩 전용 컴포넌트는 `src/components/landing/`에 분리합니다.

---

## AgentIntro

위치: `src/components/app/AgentPrimitives.tsx`

```tsx
interface AgentIntroProps {
  eyebrow?: string
  title: string
  description: string
  steps?: string[]
  action?: ReactNode
  style?: CSSProperties
}
```

- 페이지 첫 화면에서 현재 화면을 “AI agent가 읽고 있는 상태”로 소개합니다.
- 기본 톤은 흑백/그레이입니다.
- steps는 작은 pill로 렌더링하고, 과도한 색상 구분을 넣지 않습니다.

---

## AgentPanel

```tsx
interface AgentPanelProps {
  children: ReactNode
  delay?: number
  style?: CSSProperties
  className?: string
}
```

- 반복 카드, 분석 박스, 리스트 컨테이너에 사용합니다.
- 기본 radius는 `8px`, border는 `--da-border`입니다.
- 내부에 또 다른 카드형 섹션을 중첩하지 않습니다.

---

## AgentStatusStrip

```tsx
function AgentStatusStrip({
  items,
}: {
  items: Array<{ label: string; value: string | number; tone?: Tone }>
})
```

- 화면의 현재 필터/상태/요약 수치를 보여줍니다.
- `tone`은 색상 팔레트가 아니라 텍스트 명도 차이에 가깝게 사용합니다.

---

## Modal

위치: `src/components/ui/Modal.tsx`

```tsx
interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  maxWidth?: number
}
```

- 기본 배경은 `--da-surface-2`, border는 `--da-border`, shadow는 `--shadow-modal`.
- backdrop click과 native dialog close를 모두 지원합니다.
- 입력/버튼은 각 화면에서 같은 dark token을 사용해야 합니다.

---

## CursorList

위치: `src/components/ui/CursorList.tsx`

```tsx
interface CursorListProps<T> {
  queryKey: unknown[]
  fetcher: (cursor?: string) => Promise<CursorPage<T>>
  renderItem: (item: T, index: number) => ReactNode
  emptyTitle?: string
  emptyDescription?: string
  errorTitle?: string
  errorDescription?: string
  className?: string
}
```

상태:

- loading: `CardSkeleton` 3개
- error: `EmptyState`의 error tone
- empty: neutral `EmptyState`
- next page loading: 작은 spinner

API 실패를 빈 결과처럼 보여주면 안 됩니다.

---

## EmptyState

```tsx
interface EmptyStateProps {
  marker?: string
  title: string
  description?: string
  action?: { label: string; href: string }
  tone?: 'neutral' | 'error'
}
```

- 기본 marker는 `—`입니다.
- emoji 기반 빈 상태는 사용하지 않습니다.
- error tone은 `--da-danger`와 `--da-danger-dim`만 사용합니다.

---

## Badge / MatchScoreBadge

위치: `src/components/ui/Badge.tsx`

```tsx
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  children: ReactNode
  className?: string
}
```

- 배지는 `--da-badge`, `--da-badge-text`, `--da-border`를 기본으로 합니다.
- success/warning은 강한 초록/노랑 대신 그레이 명도 차이를 우선합니다.
- error만 붉은색을 명확히 사용합니다.

---

## Skeleton

위치: `src/components/ui/Skeleton.tsx`

- skeleton은 `--da-surface`, `--da-control`, `--da-control-active`를 사용합니다.
- 흰색 카드 skeleton은 사용하지 않습니다.

---

## JobCard / Row Item

공고와 매칭 리스트는 카드 그리드보다 row 중심입니다.

- 높이: compact `32px`, comfortable `40-44px`
- row 구분선: `--da-border-row`
- hover: `--da-hover`
- 주요 텍스트: `--da-text`
- 보조 텍스트: `--da-text-2` 또는 `--da-text-3`
