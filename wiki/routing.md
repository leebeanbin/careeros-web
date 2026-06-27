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
│   ├── advisor/
│   │   ├── page.tsx          → /advisor
│   │   └── reports/[reportId]/page.tsx → /advisor/reports/:reportId
│   ├── notifications/page.tsx → /notifications
│   └── settings/page.tsx     → /settings
│
├── (admin)/                  → ADMIN role required
│   └── admin/
│       ├── page.tsx          → /admin          (redirects to /admin/users)
│       ├── users/page.tsx    → /admin/users
│       ├── jobs/page.tsx     → /admin/jobs
│       └── ai-calls/page.tsx → /admin/ai-calls
│
└── api/
    └── auth/callback/route.ts → /api/auth/callback  (GitHub Connect OAuth code exchange)
```

---

## Authentication Middleware

`middleware.ts` intercepts all `(auth)` and `(admin)` routes.
- Reads JWT from HTTP-only cookie (`access_token`)
- On expiry: `POST /api/v1/auth/reissue` → set new cookie → continue
- On failure: redirect to `/login?redirect=<original-path>`
- Admin routes: additionally verify `role === 'ADMIN'` from JWT payload

---

## Two OAuth Flows

### 1. GitHub Login (authentication)
Handled entirely by the careerOS backend — no Next.js callback route needed.
```
"GitHub으로 로그인" button → GET /api/v1/auth/oauth/github
  → GitHub OAuth consent
  → careerOS backend sets JWT cookies
  → redirect to /dashboard
```

### 2. GitHub Connect (link account after login)
Uses the Next.js API route to exchange the OAuth code.
```
"OAuth 연결" button on /github → GitHub OAuth consent
  → GET /api/auth/callback?code=xxx
    └── POST /api/v1/github/connect { mode: "oauth", code }
          → On Success → redirect to /github
```

---

[Wiki Index](README.md) | [State Management ▶](state.md)
