# Match Detail Page

Route: `/matches/[matchId]`

---

## API Calls

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v1/matches/:matchId` | Match details + breakdown |
| `PATCH` | `/api/v1/matches/:matchId/hide` | Hide match |

---

## Layout

### Header
- Job title, company, total score as `MatchScoreBadge`
- "숨기기" button

### Score Breakdown
- `ScoreBreakdownChart` with 5 radar axes:
  - `skillScore` (max 45)
  - `evidenceScore` (max 25)
  - `roleScore` (max 15)
  - `preferenceScore` (max 10)
  - `freshnessScore` (max 5)
- Score breakdown table (label + score + max):

| 항목 | 점수 | 최대 |
|------|------|------|
| 기술 스택 | skillScore | 45 |
| 프로젝트 근거 | evidenceScore | 25 |
| 직무 일치 | roleScore | 15 |
| 지원 선호도 | preferenceScore | 10 |
| 경력 최신성 | freshnessScore | 5 |

### AI 코멘트
- `aiComment` field from match response (free text)

---

## TanStack Query Cache Keys

```ts
['matches', matchId]
```
