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

Also shows: "GitHub으로 로그인" button → `GET /api/v1/auth/oauth/github` (initiates OAuth flow)

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

## OAuth Callback

Route: `/auth/callback` (implicit, handled by middleware)

Flow:
```
GET /auth/oauth/github
  → GitHub OAuth consent
  → careerOS backend callback
  → sets JWT cookies
  → redirect /dashboard
```
