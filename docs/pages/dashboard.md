# Dashboard Page

Route: `/dashboard`

---

## API Calls

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v1/matches?size=5` | Recent top matches |
| `GET` | `/api/v1/notifications?size=5&unreadOnly=true` | Unread notifications |
| `GET` | `/api/v1/advisor/dashboard` | AI advisor summary |

---

## Widgets

### Match Summary
- Shows top 5 matches as `JobCard` with `MatchScoreBadge`
- "더 보기" link → `/matches`

### Notifications
- Shows 5 unread notifications
- "전체 보기" link → `/notifications`

### Advisor Dashboard
- Displays `AdvisorDashboardResponse` from `GET /advisor/dashboard`
- Fields: `totalReports`, `lastReportAt`, `recentInsight`
- "리포트 보기" link → `/advisor`

---

## TanStack Query Cache Keys

```ts
['matches', { size: 5 }]
['notifications', { size: 5, unreadOnly: true }]
['advisor', 'dashboard']
```
