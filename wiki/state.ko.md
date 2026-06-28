# 상태 관리 (State Management)

🌐 [English](./state.md) | **한국어**

---

## 상태 관리 적용 전략

| 데이터 성격 | 관리 프레임워크 | 채택 사유 |
|------------|--------------|---------|
| 서버 동기화 데이터 (API 응답) | **TanStack Query v5** | 내장 캐싱, 자동 갱신, 무한스크롤, 낙관적 업데이트 |
| 전역 UI 상태 | **Zustand** | 인증 세션, 알림 카운트 |
| 입력 폼 상태 | **React Hook Form** | 비제어 컴포넌트, 최소 리렌더링 |
| URL 파생 상태 | `useSearchParams` | 필터·페이지네이션 상태를 URL에 보존 |

---

## TanStack Query 캐시 키

```ts
// 인증
queryKey: ['me']                                    // GET /users/me

// 공고
queryKey: ['jobs', filters]                         // GET /jobs (전 필터)
queryKey: ['jobs', jobId]                           // GET /jobs/:jobId
queryKey: ['jobs', jobId, 'similar']                // GET /jobs/:jobId/similar
queryKey: ['jobs', 'saved']                         // GET /jobs/saved
queryKey: ['jobs', 'admin', adminFilters]           // GET /jobs/admin (관리자)

// 매칭
queryKey: ['matches']                               // GET /matches
queryKey: ['matches', matchId]                      // GET /matches/:matchId

// 이력서
queryKey: ['resumes']                               // GET /resumes
queryKey: ['resumes', resumeId]                     // GET /resumes/:resumeId
queryKey: ['resumes', resumeId, 'analysis']         // GET /resumes/:resumeId/analysis
queryKey: ['resumes', resumeId, 'layout-review']    // GET /resumes/:resumeId/layout-review

// GitHub
queryKey: ['github', 'profile']                     // GET /github/profile
queryKey: ['github', 'repositories']                // GET /github/repositories
queryKey: ['github', 'sync', syncId]                // GET /github/sync/:syncId

// 후보자
queryKey: ['candidate', 'graph']                    // GET /candidates/me/graph
queryKey: ['candidate', 'preferences']              // GET /candidates/me/preferences

// 어드바이저
queryKey: ['advisor', 'dashboard']                  // GET /advisor/dashboard
queryKey: ['advisor', 'reports']                    // GET /advisor/reports
queryKey: ['advisor', 'reports', reportId]          // GET /advisor/reports/:reportId

// 알림
queryKey: ['notifications', cursor]                 // GET /notifications

// 분류체계 (필터 폼에서 내부 사용)
queryKey: ['taxonomy', 'skills']                    // GET /taxonomy/skills
queryKey: ['taxonomy', 'roles']                     // GET /taxonomy/roles

// 관리자
queryKey: ['admin', 'users', adminUserFilters]
queryKey: ['admin', 'users', userId]
queryKey: ['admin', 'ai-calls', aiFilters]
queryKey: ['admin', 'ai-calls', 'stats']
```

**staleTime:** 기본 30초. `['matches']` · `['advisor', 'dashboard']` → 60초 (백엔드 Redis TTL과 동기화).

---

## Zustand 스토어

```ts
// src/stores/authStore.ts
interface AuthStore {
  userId: number | null
  role: 'USER' | 'ADMIN' | null
  accessToken: string | null
  setAuth: (userId: number, role: string, token: string) => void
  clear: () => void
}

// src/stores/notificationStore.ts
interface NotificationStore {
  unreadCount: number
  setUnreadCount: (n: number) => void
  decrement: () => void
  reset: () => void
}
```

---

## 커서 페이지네이션

```ts
useInfiniteQuery({
  queryKey: ['jobs', filters],
  queryFn: ({ pageParam }) => fetchJobs({ ...filters, cursor: pageParam }),
  getNextPageParam: (last) => last.nextCursor ?? undefined,
  initialPageParam: undefined,
})
```

트리거: `CursorList` 컴포넌트 내부의 `IntersectionObserver`가 마지막 아이템 진입 감지.

---

[◀ 페이지 라우팅](routing.ko.md) | [API 클라이언트 ▶](api-client.ko.md)
