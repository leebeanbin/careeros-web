# API Client

Backend base URL: `http://localhost:8080/api/v1` (dev) / env var `NEXT_PUBLIC_API_BASE_URL` (prod).

---

## `src/lib/api/client.ts` — Core Fetch Wrapper

```ts
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T>
```

**Token refresh flow:**
```
Request → 401 response
  → POST /auth/reissue (send refresh_token cookie)
    → success: update access_token cookie, retry original request
    → failure: clear cookies, redirect to /login
```

All requests attach `Authorization: Bearer <token>` from the HTTP-only cookie. Token is read server-side in middleware and client-side via a Zustand store hydrated on mount.

---

## Domain Files (`src/lib/api/`)

| File | Endpoints |
|------|-----------|
| `auth.ts` | signup, login, logout, reissue |
| `jobs.ts` | search, detail, save, unsave, apply-click, similar, admin CRUD, status update |
| `matches.ts` | list, detail, hide |
| `resume.ts` | upload, list, detail, analysis, layout-review, set-active, delete, download |
| `github.ts` | connect (username/oauth), profile, disconnect, sync, sync-status, repos, repo-update |
| `candidate.ts` | graph, preferences (get + update) |
| `advisor.ts` | request-report, dashboard, reports, report-detail |
| `notifications.ts` | list, mark-read, mark-all-read, delete |
| `users.ts` | me (get/update/delete) |
| `admin.ts` | user list/detail/role/status, job admin, ai-calls history + stats |
| `taxonomy.ts` | skills, roles |

---

## Error Handling

All API errors follow the careerOS envelope:
```ts
{ status: "ERROR", code: "E002", message: "인증이 필요합니다." }
```

`apiFetch` throws a typed `ApiError` with `code` and `message`. Pages catch and show toast notifications.

---

[◀ State Management](state.md) | [Components ▶](components.md)
