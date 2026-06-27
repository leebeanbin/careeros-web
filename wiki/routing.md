# Page Routing

🌐 **English** | [한국어](./routing.ko.md)

> Tech Stack: Next.js 15 (App Router), TypeScript

---

## Route Layout

```
src/app/
├── (public)/
│   ├── page.tsx              → /          Landing Page
│   ├── login/page.tsx        → /login
│   └── signup/page.tsx       → /signup
│
├── (auth)/                   → JWT middleware guard
│   ├── dashboard/page.tsx    → /dashboard
│   ├── jobs/
│   │   ├── page.tsx          → /jobs          Job Search
│   │   └── [jobId]/page.tsx  → /jobs/:jobId   Job Detail
│   ├── matches/
│   │   ├── page.tsx          → /matches
│   │   └── [matchId]/page.tsx → /matches/:matchId
│   ├── resume/page.tsx       → /resume
│   ├── github/page.tsx       → /github
│   ├── candidate/page.tsx    → /candidate
│   ├── advisor/page.tsx      → /advisor
│   ├── notifications/page.tsx → /notifications
│   └── settings/page.tsx     → /settings
│
├── (admin)/                  → ADMIN role required
│   └── admin/page.tsx        → /admin
│
└── api/
    └── auth/callback/route.ts → /api/auth/callback
```

---

## Authentication Middleware

`middleware.ts` intercepts all `(auth)` and `(admin)` routes.
- Reads JWT from HTTP-only cookie (`access_token`)
- On expiry: `POST /api/v1/auth/reissue` → set new cookie → continue
- On failure: redirect to `/login?redirect=<original-path>`
- Admin routes: additionally verify `role === 'ADMIN'` from JWT payload

---

## OAuth Callback Flow

```
GitHub Authorize → /api/auth/callback?code=xxx
  └── POST /api/v1/github/connect { mode: "oauth", code }
        └── On Success → redirect to /github
```

---

[Wiki Index](README.md) | [State Management ▶](state.md)
