# Jobs Page

Route: `/jobs`

---

## API Calls

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v1/jobs` | Paginated job list (cursor) |
| `POST` | `/api/v1/jobs/:jobId/save` | Save job |
| `DELETE` | `/api/v1/jobs/:jobId/save` | Unsave job |

---

## Filter Options

Query params for `GET /jobs`:

| Param | Type | Values |
|-------|------|--------|
| `keyword` | string | free text |
| `country` | string | e.g. `KR`, `US` |
| `roleCategory` | string | `BACKEND`, `FRONTEND`, `DATA`, `AI`, `DEVOPS` |
| `remoteType` | string | `REMOTE`, `HYBRID`, `ON_SITE` |
| `employmentType` | string | `FULL_TIME`, `PART_TIME`, `CONTRACT` |
| `experienceLevel` | string | `ENTRY`, `MID`, `SENIOR` |
| `cursor` | string | pagination cursor |
| `size` | number | default 20 |

---

## Layout

- Filter bar at top (collapsible on mobile)
- `CursorList` with `JobCard` items
- Each `JobCard` has save/unsave toggle
- Infinite scroll via `IntersectionObserver`

---

## TanStack Query Cache Keys

```ts
['jobs', filters]                   // useInfiniteQuery
['jobs', jobId, 'saved']            // per-job saved state
```
