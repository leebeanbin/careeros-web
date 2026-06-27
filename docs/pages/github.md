# GitHub Page

Route: `/github`

---

## API Calls

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/v1/github/connect` | Connect GitHub (username + OAuth token) |
| `GET` | `/api/v1/github/connect` | Get connection status |
| `DELETE` | `/api/v1/github/connect` | Disconnect GitHub |
| `POST` | `/api/v1/github/sync` | Trigger manual sync |
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
- "동기화" button → `POST /github/sync`
- Shows last synced timestamp

### Repositories
- `CursorList` of repos from `GET /github/repositories`
- Each item: repo name, stars, language, description

---

## TanStack Query Cache Keys

```ts
['github', 'connection']
['github', 'profile']
['github', 'repositories']
```
