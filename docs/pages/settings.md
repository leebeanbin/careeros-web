# Settings Page

Route: `/settings`

---

## API Calls

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v1/users/me` | Current user profile |
| `PATCH` | `/api/v1/users/me` | Update profile |
| `DELETE` | `/api/v1/users/me` | Delete account |
| `GET` | `/api/v1/candidates/me/preferences` | Job preferences |
| `PATCH` | `/api/v1/candidates/me/preferences` | Update preferences |

---

## Layout

### Profile Section
- Fields: `name`, `email` (read-only)
- "저장" → `PATCH /users/me`

### Job Preferences Section
- Same form as `/candidate` preferences panel
- Deduplicates by sharing the same cache key `['candidates', 'me', 'preferences']`

### Danger Zone
- "계정 삭제" button → confirm dialog → `DELETE /users/me` → redirect `/login`

---

## TanStack Query Cache Keys

```ts
['users', 'me']
['candidates', 'me', 'preferences']
```
