# 공통 UI 컴포넌트 명세

> 구현 위치: `src/components/`

컴포넌트 인터페이스 상세: [wiki/components.md](../../wiki/components.md)

---

## MatchScoreBadge (적합도 점수 배지)

```tsx
interface MatchScoreBadgeProps {
  score: number      // 0–100
  stale?: boolean    // true = 재계산 중, 회색 표시
}
```

점수별 색상:

| 구간 | CSS 변수 | Tailwind 클래스 예시 |
|------|---------|------------------|
| 85점 이상 | `--color-match-strong` | `text-green-700 bg-green-100` |
| 70–84점 | `--color-match-good` | `text-lime-700 bg-lime-100` |
| 50–69점 | `--color-match-medium` | `text-amber-700 bg-amber-100` |
| 50점 미만 | `--color-match-weak` | `text-gray-500 bg-gray-100` |

---

## JobCard (채용 공고 카드)

```tsx
interface JobCardProps {
  jobId: string
  title: string
  company: string
  country: string
  remoteType: 'REMOTE' | 'HYBRID' | 'ON_SITE'
  employmentType?: string
  matchScore?: number      // 옵션 — MatchScoreBadge로 표시
  isSaved?: boolean
  postedAt: string         // ISO 8601
  onSave?: () => void
  onUnsave?: () => void
}
```

---

## CursorList (무한 스크롤 래퍼)

```tsx
interface CursorListProps<T> {
  query: UseInfiniteQueryResult<InfiniteData<CursorResponse<T>>>
  renderItem: (item: T) => React.ReactNode
  emptyMessage?: string
  loadingFallback?: React.ReactNode
}
```

`CursorResponse<T>` — 백엔드 응답 구조:
```ts
{ items: T[], nextCursor: string | null, hasNext: boolean }
```

---

## ScoreBreakdownChart (점수 분해 레이더 차트)

```tsx
interface ScoreBreakdownChartProps {
  breakdown: {
    skillScore: number       // 최대 45
    evidenceScore: number    // 최대 25
    roleScore: number        // 최대 15
    preferenceScore: number  // 최대 10
    freshnessScore: number   // 최대 5
  }
}
```

Recharts `RadarChart`로 5축 레이더 그래프 렌더링. 각 점수를 최대 가중치 대비 비율로 정규화.

---

## ResumeUploader (이력서 업로더)

```tsx
interface ResumeUploaderProps {
  onSuccess?: (resumeId: string) => void
  onError?: (message: string) => void
}
```

허용: PDF만, 최대 10MB.
사용 API: `POST /api/v1/resumes` (`multipart/form-data`).
업로드 성공 후: `['resumes']` 캐시 무효화.
