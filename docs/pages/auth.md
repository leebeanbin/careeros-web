# Auth Pages

Routes: `/login`, `/signup`

---

## /login

**API calls:** `POST /api/v1/auth/login`

Form fields:
- `email` (required)
- `password` (required)

Flow:
1. Submit → `POST /auth/login` → sets JWT cookies (HTTP-only)
2. Success → redirect to `/dashboard`
3. 401 → show inline "이메일 또는 비밀번호가 틀렸습니다"

Also shows: "GitHub으로 로그인" button → `GET /api/v1/auth/oauth/github` → GitHub consent → careerOS backend sets JWT cookies → redirect `/dashboard` (entire flow handled server-side, no Next.js callback needed)

Middleware guard: redirect `/login` → `/dashboard` if already authenticated.

---

## /signup

**API calls:** `POST /api/v1/auth/signup`

Form fields:
- `name` (required)
- `email` (required)
- `password` (required, min 8 chars)
- `confirmPassword` (match validation, client-side only)

Flow:
1. Submit → `POST /auth/signup`
2. Success → redirect to `/login` with success toast
3. 409 → "이미 사용 중인 이메일입니다"

---

## Logout

Triggered from the Topbar user dropdown (all authenticated pages).

Flow: `POST /api/v1/auth/logout` → clears cookies → redirect `/login`

---

## Note: Two Separate OAuth Flows

| Flow | Trigger | Redirect |
|------|---------|---------|
| GitHub **로그인** | `/login` page button | `/dashboard` (backend-handled) |
| GitHub **계정 연결** | `/github` page button | `/github` (via `/api/auth/callback` Next.js route) |

See [wiki/routing.md](../../wiki/routing.md) for the connect callback implementation.
