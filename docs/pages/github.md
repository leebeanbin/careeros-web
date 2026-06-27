# GitHub Page

Route: `/github`

---

## API Calls

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/v1/github/connect` | Connect GitHub (username + OAuth token) |
| `GET` | `/api/v1/github/connect` | Get connection status |
| `DELETE` | `/api/v1/github/connect` | Disconnect GitHub |
| `POST` | `/api/v1/github/sync` | Trigger manual sync (returns syncId) |
| `GET` | `/api/v1/github/sync/:syncId` | Poll sync job status |
| `GET` | `/api/v1/github/repositories` | List synced repositories |
| `GET` | `/api/v1/github/profile` | GitHub profile summary |

---

## Layout

### Connection Status
- If not connected: show connect form
  - `username` input + "OAuth 연결" button
  - `POST /github/connect` with `{ username, oauthToken }`
- If connected: show username, avatar, "연결 해제" button

### Profile Card
- From `GET /github/profile`: `username`, `publicRepos`, `followers`, `bio`

### Sync
- "동기화" button → `POST /github/sync` → returns `syncId`
- Poll `GET /github/sync/:syncId` every 2s until `status === 'COMPLETED'`
- Shows last synced timestamp and in-progress spinner during sync

### Repositories
- `CursorList` of repos from `GET /github/repositories`
- Each item: repo name, stars, language, description

---

## TanStack Query Cache Keys

```ts
['github', 'connection']
['github', 'profile']
['github', 'repositories']
['github', 'sync', syncId]    // polling — enabled only while sync is in progress
```
