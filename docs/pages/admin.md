# Admin Pages

Routes: `/admin/*` — requires `ROLE_ADMIN`

---

## User Management (`/admin/users`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v1/users?status=ACTIVE` | List users with filter |
| `GET` | `/api/v1/users?keyword=...` | Search users |
| `GET` | `/api/v1/users/:targetUserId` | User detail |
| `PATCH` | `/api/v1/users/:targetUserId/role` | Change role |
| `PATCH` | `/api/v1/users/:targetUserId/status` | Change status |

Layout:
- Search bar (keyword filter)
- Status tab filter: ALL / ACTIVE / DEACTIVATED
- Table: `name`, `email`, `role`, `status`, `createdAt`
- Row actions: change role (`ADMIN` / `USER`), deactivate / activate

---

## Job Management (`/admin/jobs`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v1/jobs/admin` | All jobs (admin view) |
| `POST` | `/api/v1/jobs` | Create job |
| `PATCH` | `/api/v1/jobs/:jobId/status` | Change job status |

Create job form fields:
- `title`, `companyName`, `description`, `applyUrl` (required)
- `country`, `roleCategory`, `remoteType`, `employmentType`, `experienceLevel`

Job status values: `ACTIVE`, `CLOSED`, `DRAFT`

---

## AI Call History (`/admin/ai-calls`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v1/admin/ai-calls` | All AI call logs |
| `GET` | `/api/v1/admin/ai-calls?useCase=...&success=...` | Filtered |
| `GET` | `/api/v1/admin/ai-calls/stats` | Aggregate stats |

Layout:
- Stats cards: total calls, success rate, avg latency
- Filter bar: `useCase` (RESUME_EXTRACTION / MATCH_SCORING / etc.), `success` (true/false)
- Table: `useCase`, `model`, `latencyMs`, `success`, `createdAt`, `error` (if failed)

---

## TanStack Query Cache Keys

```ts
['admin', 'users', filters]
['admin', 'users', userId]
['admin', 'jobs']
['admin', 'ai-calls', filters]
['admin', 'ai-calls', 'stats']
```
