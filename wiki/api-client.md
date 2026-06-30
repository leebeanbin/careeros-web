# API Client

Backend base URL comes from `NEXT_PUBLIC_API_BASE_URL`, defaulting to `http://localhost:8080/api/v1` in development.

## Core Wrapper

`src/lib/api/client.ts` exposes `apiFetch<T>(path, options)`.

- Sends `credentials: 'include'` for HTTP-only auth cookies.
- Adds JSON `Content-Type` unless the body is `FormData`.
- Unwraps `{ data }` envelopes when present.
- Throws `ApiError(code, message)` for non-2xx responses.
- On the first 401, calls `POST /auth/reissue`, then retries the original request once.
- If reissue fails in the browser, redirects to `/login`.

## Contract Boundary

Domain modules in `src/lib/api/*` call backend endpoints. Backend DTO drift is handled in `src/lib/api/adapters.ts`, not inside pages.

Cursor responses normalize to:

```ts
{
  content: T[]
  nextCursor: string | null
  hasNext: boolean
  totalElements?: number
  totalCount?: number
}
```

[◀ State Management](state.md) | [Components ▶](components.md)
