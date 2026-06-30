# API 클라이언트

백엔드 기본 URL은 `NEXT_PUBLIC_API_BASE_URL`을 사용하며, 개발 기본값은 `http://localhost:8080/api/v1`입니다.

## Core Wrapper

`src/lib/api/client.ts`는 `apiFetch<T>(path, options)`를 제공합니다.

- HTTP-only 인증 쿠키를 위해 `credentials: 'include'`를 사용합니다.
- `FormData`가 아니면 JSON `Content-Type`을 추가합니다.
- `{ data }` envelope가 있으면 내부 값을 반환합니다.
- 실패 응답은 `ApiError(code, message)`로 던집니다.
- 첫 401 응답에서는 `POST /auth/reissue`를 호출한 뒤 원래 요청을 한 번 재시도합니다.
- 재발급 실패 시 브라우저에서는 `/login`으로 이동합니다.

## 계약 경계

도메인 API 모듈은 백엔드 endpoint만 호출합니다. DTO 차이는 페이지가 아니라 `src/lib/api/adapters.ts`에서 정규화합니다.

Cursor 응답은 다음 형태로 정규화합니다.

```ts
{
  content: T[]
  nextCursor: string | null
  hasNext: boolean
  totalElements?: number
  totalCount?: number
}
```

[◀ 상태 관리](state.ko.md) | [컴포넌트 ▶](components.ko.md)
