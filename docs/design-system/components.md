# UI Components Spec

> Target folder: `src/components/`

Full component interface docs: [wiki/components.md](../../wiki/components.md)

---

## MatchScoreBadge

```tsx
interface MatchScoreBadgeProps {
  score: number      // 0–100
  stale?: boolean    // true = recalculating, show gray
}
```

Score → color mapping:

| Range | CSS Variable | Tailwind class equivalent |
|-------|-------------|--------------------------|
| 85+ | `--color-match-strong` | `text-green-700 bg-green-100` |
| 70–84 | `--color-match-good` | `text-lime-700 bg-lime-100` |
| 50–69 | `--color-match-medium` | `text-amber-700 bg-amber-100` |
| <50 | `--color-match-weak` | `text-gray-500 bg-gray-100` |

---

## JobCard

```tsx
interface JobCardProps {
  jobId: string
  title: string
  company: string
  country: string
  remoteType: 'REMOTE' | 'HYBRID' | 'ON_SITE'
  employmentType?: string
  matchScore?: number      // optional — shown as MatchScoreBadge
  isSaved?: boolean
  postedAt: string         // ISO 8601
  onSave?: () => void
  onUnsave?: () => void
}
```

---

## CursorList

```tsx
interface CursorListProps<T> {
  query: UseInfiniteQueryResult<InfiniteData<CursorResponse<T>>>
  renderItem: (item: T) => React.ReactNode
  emptyMessage?: string
  loadingFallback?: React.ReactNode
}
```

`CursorResponse<T>` matches the careerOS backend envelope:
```ts
{ items: T[], nextCursor: string | null, hasNext: boolean }
```

---

## ScoreBreakdownChart

```tsx
interface ScoreBreakdownChartProps {
  breakdown: {
    skillScore: number       // max 45
    evidenceScore: number    // max 25
    roleScore: number        // max 15
    preferenceScore: number  // max 10
    freshnessScore: number   // max 5
  }
}
```

Renders a `RadarChart` from Recharts with 5 axes. Normalize each score to percentage of its max weight for the radar.

---

## ResumeUploader

```tsx
interface ResumeUploaderProps {
  onSuccess?: (resumeId: string) => void
  onError?: (message: string) => void
}
```

Accepts: PDF only, max 10MB.
Uses: `POST /api/v1/resumes` with `multipart/form-data`.
After upload: invalidates `['resumes']` TanStack Query cache.
