# Job Detail Page

Route: `/jobs/[jobId]`

---

## API Calls

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v1/jobs/:jobId` | Job details |
| `POST` | `/api/v1/jobs/:jobId/save` | Save |
| `DELETE` | `/api/v1/jobs/:jobId/save` | Unsave |
| `POST` | `/api/v1/jobs/:jobId/apply-click` | Track apply click |
| `GET` | `/api/v1/jobs/:jobId/similar` | Similar jobs |

---

## Layout

### Header
- Title, company, country, remoteType badge, employmentType, experienceLevel
- Save toggle button
- "지원하기" external link → `applyUrl` + fires `POST /jobs/:jobId/apply-click`

### Description
- Full job description (rendered as pre-wrap or markdown)

### Similar Jobs
- `CursorList` with up to 5 `JobCard` items from `GET /jobs/:jobId/similar`

---

## TanStack Query Cache Keys

```ts
['jobs', jobId]
['jobs', jobId, 'similar']
```
