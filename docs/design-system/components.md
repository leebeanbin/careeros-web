# UI Components Spec

> Target folder: `src/components/`
>
> Shared app components default to `.dark-app` tokens. Landing-only components live under `src/components/landing/`.

---

## AgentIntro

Location: `src/components/app/AgentPrimitives.tsx`

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

- Introduces each app page as an AI-assisted reading surface.
- Uses a monochrome/gray tone by default.
- Steps render as small pills and should not introduce heavy color.

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

- Use for repeated cards, analysis boxes, and list containers.
- Default radius is `8px`; default border is `--da-border`.
- Do not nest card-like panels inside other card-like panels.

---

## AgentStatusStrip

```tsx
function AgentStatusStrip({
  items,
}: {
  items: Array<{ label: string; value: string | number; tone?: Tone }>
})
```

- Shows current filters, state, or summary values.
- Tone should read as text luminance, not a full color palette.

---

## Modal

Location: `src/components/ui/Modal.tsx`

```tsx
interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  maxWidth?: number
}
```

- Default background is `--da-surface-2`; border is `--da-border`; shadow is `--shadow-modal`.
- Supports backdrop click and native dialog close.
- Inputs and buttons inside modals should use the same dark tokens.

---

## CursorList

Location: `src/components/ui/CursorList.tsx`

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

States:

- loading: three `CardSkeleton` items
- error: `EmptyState` with error tone
- empty: neutral `EmptyState`
- next page loading: small spinner

API failure must never look like an empty result.

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

- Default marker is `—`.
- Avoid emoji empty states in the app shell.
- Error tone only uses `--da-danger` and `--da-danger-dim`.

---

## Badge / MatchScoreBadge

Location: `src/components/ui/Badge.tsx`

```tsx
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  children: ReactNode
  className?: string
}
```

- Badges use `--da-badge`, `--da-badge-text`, and `--da-border`.
- Success and warning prefer grayscale luminance over saturated green/yellow.
- Error may use red clearly.

---

## Skeleton

Location: `src/components/ui/Skeleton.tsx`

- Skeletons use `--da-surface`, `--da-control`, and `--da-control-active`.
- Do not use white card skeletons in the dark app shell.

---

## JobCard / Row Item

Jobs and matches are row-first, not card-grid-first.

- height: compact `32px`, comfortable `40-44px`
- row divider: `--da-border-row`
- hover: `--da-hover`
- primary text: `--da-text`
- secondary text: `--da-text-2` or `--da-text-3`
