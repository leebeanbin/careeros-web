# Page Routing

🌐 **English** | [한국어](./routing.ko.md)

> Tech Stack: Next.js App Router, TypeScript, `src/proxy.ts`

## Route Layout

```
src/app/
├── (public)/                  → /, /login, /signup, /privacy, /terms
├── (auth)/                    → /dashboard, /jobs, /matches, /resume,
│                                /github, /candidate, /roadmap, /cycles,
│                                /advisor, /notifications, /settings
└── (admin)/admin/             → /admin, /admin/users, /admin/jobs, /admin/ai-calls
```

## Auth Proxy

`src/proxy.ts` protects app routes before rendering.

- Auth routes require the `access_token` HTTP-only cookie.
- Admin routes additionally decode the JWT payload and require `role === 'ADMIN'`.
- `/login` and `/signup` redirect to `/dashboard` when a token already exists.
- Token reissue is not performed inside `proxy.ts`; client API calls retry through `src/lib/api/client.ts` after a 401.

## OAuth Flows

GitHub login is owned by the backend. GitHub account connection after login uses the frontend callback route, then calls the backend GitHub connect endpoint.

[Wiki Index](README.md) | [State Management ▶](state.md)
