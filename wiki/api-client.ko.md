# API 클라이언트

[English](./api-client.md) | 🇰🇷 **한국어**

백엔드 기본 URL: `http://localhost:8080/api/v1` (개발) / 환경 변수 `NEXT_PUBLIC_API_BASE_URL` (프로덕션).

---

## `src/lib/api/client.ts` — 핵심 Fetch 래퍼

```ts
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T>
```

**토큰 갱신 흐름:**
```
요청 → 401 응답
  → POST /auth/reissue (refresh_token 쿠키 전송)
    → 성공: access_token 쿠키 업데이트, 원래 요청 재시도
    → 실패: 쿠키 초기화, /login 리다이렉트
```

모든 요청은 `credentials: 'include'` 사용 — 브라우저가 HTTP-only 쿠키를 자동으로 전송합니다. JS에서 토큰에 직접 접근하지 않습니다. 미들웨어가 서버 사이드에서 JWT를 읽고, 클라이언트 Zustand 스토어에는 로그인 후 `GET /users/me` 응답으로 `userId`와 `role`만 저장됩니다.

---

## 도메인 파일 (`src/lib/api/`)

| 파일 | 엔드포인트 |
|------|-----------|
| `auth.ts` | signup, login, logout, reissue |
| `jobs.ts` | 검색, 상세, 저장, 저장취소, 지원클릭, 유사공고, 관리자 CRUD, 상태 변경 |
| `matches.ts` | 목록, 상세, 숨기기 |
| `resume.ts` | 업로드, 목록, 상세, 분석, 레이아웃리뷰, 활성설정, 삭제, 다운로드 |
| `github.ts` | 연결 (username/oauth), 프로필, 연결해제, 동기화, 동기화상태, 레포 목록 |
| `candidate.ts` | 경력그래프, 선호도 (조회 + 수정) |
| `advisor.ts` | 리포트요청, 대시보드, 리포트목록, 리포트상세 |
| `notifications.ts` | 목록, 읽음처리, 전체읽음, 삭제 |
| `users.ts` | me (조회/수정/삭제) |
| `admin.ts` | 사용자 목록/상세/역할/상태, 공고 관리, AI 호출 이력 + 통계 |
| `taxonomy.ts` | 스킬, 직무 카테고리 |

---

## 에러 처리

모든 API 에러는 careerOS 응답 봉투를 따릅니다:
```ts
{ status: "ERROR", code: "E002", message: "인증이 필요합니다." }
```

`apiFetch`는 `code`와 `message`를 포함한 타입화된 `ApiError`를 throw합니다. 페이지에서 이를 catch하여 토스트 알림을 표시합니다.

---

[◀ 상태 관리](state.ko.md) | [컴포넌트 ▶](components.ko.md)
