# Core Components

Location: `src/components/`

---

## MatchScoreBadge

Color-coded score badge using the match color tokens.

```tsx
<MatchScoreBadge score={87} stale={false} />
// → Green badge "87"

<MatchScoreBadge score={72} stale={true} />
// → Gray badge "72 (Recalculating...)"
```

| Score | Color | Label |
|-------|-------|-------|
| 85+ | `#16a34a` green | Strong Match |
| 70–84 | `#65a30d` lime | Good Match |
| 50–69 | `#ca8a04` amber | Partial Match |
| <50 | `#9ca3af` gray | Weak Match |

**Used in:** `JobCard`, `/jobs/:jobId`, `/matches`, `/matches/:matchId`

---

## JobCard

Job listing summary card.

```tsx
<JobCard
  jobId="job-xyz"
  title="Backend Engineer"
  company="Acme Corp"
  country="KR"
  remoteType="HYBRID"
  matchScore={87}
  isSaved={false}
  postedAt="2026-06-20T00:00:00Z"
  onSave={() => {}}
/>
```

**Used in:** `/jobs`, `/jobs/saved`, `/dashboard`

---

## CursorList

Infinite scroll wrapper — uses `useInfiniteQuery` + `IntersectionObserver`.

```tsx
<CursorList
  query={jobsInfiniteQuery}
  renderItem={(job) => <JobCard {...job} />}
  emptyMessage="No results found."
/>
```

Automatically calls `fetchNextPage()` when the sentinel div enters the viewport.

**Used in:** `/jobs`, `/matches`, `/notifications`, `/resume`, `/advisor`

---

## ScoreBreakdownChart

Radar chart (Recharts `RadarChart`) showing 5 match weight components.

```tsx
<ScoreBreakdownChart breakdown={{
  skillScore: 42,
  evidenceScore: 18.5,
  roleScore: 10,
  preferenceScore: 9,
  freshnessScore: 7.9
}} />
```

**Used in:** `/matches/:matchId`

---

## ResumeUploader

Drag-and-drop PDF uploader.

- Max 10MB, PDF only
- Shows upload progress bar
- On success: invalidates `['resumes']` query
- On error: shows error toast

```tsx
<ResumeUploader onSuccess={(resumeId) => router.push(`/resume`)} />
```

**Used in:** `/resume`

---

[◀ API Client](api-client.md) | [Wiki Index](README.md)
