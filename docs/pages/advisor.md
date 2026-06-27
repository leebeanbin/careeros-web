# Advisor Page

Route: `/advisor`

---

## API Calls

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/v1/advisor/report` | Request new AI report |
| `GET` | `/api/v1/advisor/dashboard` | Advisor summary widget |
| `GET` | `/api/v1/advisor/reports` | List all reports (cursor) |
| `GET` | `/api/v1/advisor/reports/:reportId` | Single report detail |

---

## Layout

### Dashboard Widget
- Total reports count, last report date, latest insight snippet
- Data from `GET /advisor/dashboard`

### Request New Report
- "리포트 요청" button → `POST /advisor/report`
- After success: invalidate `['advisor', 'reports']`, show toast

### Reports List
- `CursorList` of past reports
- Each item: `createdAt`, `status` (PENDING / COMPLETED), truncated summary
- Click → `/advisor/reports/[reportId]`

### Report Detail (`/advisor/reports/[reportId]`)
- Full markdown/text content of the AI advisor report
- Data from `GET /advisor/reports/:reportId`

---

## TanStack Query Cache Keys

```ts
['advisor', 'dashboard']
['advisor', 'reports']               // useInfiniteQuery
['advisor', 'reports', reportId]
```
