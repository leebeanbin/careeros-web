# State Management

🌐 **English** | [한국어](./state.ko.md)

---

## Strategy

| State Type | Solution | Rationale |
|------------|----------|-----------|
| Server State (API responses) | **TanStack Query v5** | Caching, revalidation, infinite scroll, optimistic updates |
| Global UI State | **Zustand** | Auth session, notification count |
| Form State | **React Hook Form** | Uncontrolled inputs, minimal re-renders |
| URL-Derived State | `useSearchParams` | Filters and pagination persisted in URL |

---

## TanStack Query Cache Keys

```ts
// Auth
queryKey: ['users', 'me']                           // GET /users/me

// Jobs
queryKey: ['jobs', filters]                         // GET /jobs (with all filter params)
queryKey: ['jobs', jobId]                           // GET /jobs/:jobId
queryKey: ['jobs', jobId, 'similar']                // GET /jobs/:jobId/similar
queryKey: ['jobs', 'saved']                         // GET /jobs/saved
queryKey: ['jobs', 'admin', adminFilters]           // GET /jobs/admin (admin only)

// Matches
queryKey: ['matches']                               // GET /matches
queryKey: ['matches', matchId]                      // GET /matches/:matchId

// Resume
queryKey: ['resumes']                               // GET /resumes
queryKey: ['resumes', 'active']                     // GET /resumes/active
queryKey: ['resumes', resumeId]                     // GET /resumes/:resumeId
queryKey: ['resumes', resumeId, 'analysis']         // GET /resumes/:resumeId/analysis
queryKey: ['resumes', resumeId, 'layout-review']    // GET /resumes/:resumeId/layout-review

// GitHub
queryKey: ['github', 'connection']                  // GET /github/connect
queryKey: ['github', 'profile']                     // GET /github/profile
queryKey: ['github', 'repositories']               // GET /github/repositories
queryKey: ['github', 'sync', syncId]                // GET /github/sync/:syncId (poll sync job)

// Candidate
queryKey: ['candidates', 'me', 'graph']             // GET /candidates/me/graph
queryKey: ['candidates', 'me', 'preferences']       // GET /candidates/me/preferences

// Advisor
queryKey: ['advisor', 'dashboard']                  // GET /advisor/dashboard
queryKey: ['advisor', 'reports']                    // GET /advisor/reports
queryKey: ['advisor', 'reports', reportId]          // GET /advisor/reports/:reportId

// Notifications
queryKey: ['notifications', cursor]                 // GET /notifications

// Taxonomy (used in filter forms)
queryKey: ['taxonomy', 'skills']                    // GET /taxonomy/skills
queryKey: ['taxonomy', 'roles']                     // GET /taxonomy/roles

// Admin
queryKey: ['admin', 'users', adminUserFilters]      // GET /users (admin)
queryKey: ['admin', 'users', userId]                // GET /users/:userId
queryKey: ['admin', 'jobs']                         // GET /jobs/admin
queryKey: ['admin', 'ai-calls', aiFilters]          // GET /admin/ai-calls
queryKey: ['admin', 'ai-calls', 'stats']            // GET /admin/ai-calls/stats
```

**staleTime:** 30s default. `['matches']` and `['advisor', 'dashboard']` → 60s (aligned with backend Redis TTL).

---

## Zustand Stores

```ts
// src/stores/authStore.ts
// JWT is HTTP-only — never store the raw token in JS. Populate from GET /users/me after login.
interface AuthStore {
  userId: number | null
  role: 'USER' | 'ADMIN' | null
  setAuth: (userId: number, role: 'USER' | 'ADMIN') => void
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

## Cursor Pagination

All list endpoints use cursor-based pagination via `useInfiniteQuery`:

```ts
useInfiniteQuery({
  queryKey: ['jobs', filters],
  queryFn: ({ pageParam }) => fetchJobs({ ...filters, cursor: pageParam }),
  getNextPageParam: (last) => last.nextCursor ?? undefined,
  initialPageParam: undefined,
})
```

Trigger: `IntersectionObserver` on the last list item (wrapped by `CursorList` component).

---

[◀ Page Routing](routing.md) | [API Client ▶](api-client.md)
