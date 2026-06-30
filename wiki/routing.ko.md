# 페이지 라우팅

[English](./routing.md) | 🇰🇷 **한국어**

> 기술 스택: Next.js App Router, TypeScript, `src/proxy.ts`

## 라우트 구조

```
src/app/
├── (public)/                  → /, /login, /signup, /privacy, /terms
├── (auth)/                    → /dashboard, /jobs, /matches, /resume,
│                                /github, /candidate, /roadmap, /cycles,
│                                /advisor, /notifications, /settings
└── (admin)/admin/             → /admin, /admin/users, /admin/jobs, /admin/ai-calls
```

## 인증 Proxy

`src/proxy.ts`가 앱 라우트를 렌더링 전에 보호합니다.

- 인증 라우트는 HTTP-only `access_token` 쿠키가 필요합니다.
- 관리자 라우트는 JWT payload를 디코딩해 `role === 'ADMIN'`을 추가로 확인합니다.
- 토큰이 있는 사용자가 `/login`, `/signup`에 접근하면 `/dashboard`로 이동합니다.
- 토큰 재발급은 `proxy.ts`가 아니라, API 호출이 401을 받은 뒤 `src/lib/api/client.ts`에서 한 번 재시도합니다.

## OAuth 흐름

GitHub 로그인은 백엔드가 담당합니다. 로그인 후 GitHub 계정 연결은 프론트 callback route에서 code를 받은 뒤 백엔드 connect endpoint로 전달합니다.

[위키 인덱스](README.ko.md) | [상태 관리 ▶](state.ko.md)
