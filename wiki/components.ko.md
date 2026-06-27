# 핵심 컴포넌트

[English](./components.md) | 🇰🇷 **한국어**

위치: `src/components/`

---

## MatchScoreBadge (적합도 점수 배지)

매칭 컬러 토큰을 사용하는 색상 코드화된 점수 배지.

```tsx
<MatchScoreBadge score={87} stale={false} />
// → 녹색 배지 "87"

<MatchScoreBadge score={72} stale={true} />
// → 회색 배지 "72 (재계산 중...)"
```

| 점수 | 색상 | 레이블 |
|------|------|--------|
| 85점 이상 | `#16a34a` 녹색 | Strong Match |
| 70–84점 | `#65a30d` 라임 | Good Match |
| 50–69점 | `#ca8a04` 앰버 | Partial Match |
| 50점 미만 | `#9ca3af` 회색 | Weak Match |

**사용 위치:** `JobCard`, `/jobs/:jobId`, `/matches`, `/matches/:matchId`

---

## JobCard (채용 공고 카드)

채용 공고 요약 카드.

```tsx
<JobCard
  jobId="job-xyz"
  title="백엔드 엔지니어"
  company="Acme Corp"
  country="KR"
  remoteType="HYBRID"
  matchScore={87}
  isSaved={false}
  postedAt="2026-06-20T00:00:00Z"
  onSave={() => {}}
/>
```

**사용 위치:** `/jobs`, `/jobs/[jobId]/similar`, `/dashboard`

---

## CursorList (무한 스크롤 래퍼)

`useInfiniteQuery` + `IntersectionObserver`를 사용하는 무한 스크롤 래퍼.

```tsx
<CursorList
  query={jobsInfiniteQuery}
  renderItem={(job) => <JobCard {...job} />}
  emptyMessage="결과가 없습니다."
/>
```

센티넬 div가 뷰포트에 진입하면 자동으로 `fetchNextPage()`를 호출합니다.

**사용 위치:** `/jobs`, `/matches`, `/notifications`, `/resume`, `/advisor`

---

## ScoreBreakdownChart (점수 분해 레이더 차트)

5개 매칭 가중치 요소를 보여주는 레이더 차트 (Recharts `RadarChart`).

```tsx
<ScoreBreakdownChart breakdown={{
  skillScore: 42,
  evidenceScore: 18.5,
  roleScore: 10,
  preferenceScore: 9,
  freshnessScore: 7.9
}} />
```

**사용 위치:** `/matches/:matchId`

---

## ResumeUploader (이력서 업로더)

드래그 앤 드롭 PDF 업로더.

- 최대 10MB, PDF만 허용
- 업로드 진행 바 표시
- 성공 시: `['resumes']` 쿼리 무효화
- 실패 시: 에러 토스트 표시

```tsx
<ResumeUploader onSuccess={(resumeId) => router.push('/resume')} />
```

**사용 위치:** `/resume`

---

[◀ API 클라이언트](api-client.ko.md) | [Wiki 인덱스](README.ko.md)
