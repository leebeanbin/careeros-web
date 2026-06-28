# 페이지 라우팅 (Page Routing)

🌐 [English](./routing.md) | **한국어**

> 핵심 기술: Next.js 15 (App Router), TypeScript

---

## 라우트 구조

```
src/app/
├── (public)/
│   ├── page.tsx              → /          랜딩 페이지
│   ├── login/page.tsx        → /login
│   └── signup/page.tsx       → /signup
│
├── (auth)/                   → JWT 미들웨어 가드
│   ├── dashboard/page.tsx    → /dashboard
│   ├── jobs/
│   │   ├── page.tsx          → /jobs          공고 검색
│   │   └── [jobId]/page.tsx  → /jobs/:jobId   공고 상세
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
├── (admin)/                  → ADMIN 역할 필수
│   └── admin/page.tsx        → /admin
│
└── api/
    └── auth/callback/route.ts → /api/auth/callback
```

---

## 인증 미들웨어

`middleware.ts`가 `(auth)` · `(admin)` 라우트를 모두 가로챔.
- HTTP-only 쿠키 `access_token`에서 JWT 읽기
- 만료 시: `POST /api/v1/auth/reissue` → 새 쿠키 발급 → 계속 진행
- 재발급 실패 시: `/login?redirect=<원래 경로>` 리다이렉트
- Admin 라우트: JWT payload에서 `role === 'ADMIN'` 추가 검증

---

## OAuth 콜백 흐름

```
GitHub 인증 인가 → /api/auth/callback?code=xxx
  └── POST /api/v1/github/connect { mode: "oauth", code }
        └── 성공 시 → /github 리다이렉트
```

---

[Wiki 인덱스](README.ko.md) | [상태 관리 ▶](state.ko.md)
