# Notifications Page

Route: `/notifications`

---

## API Calls

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v1/notifications` | Paginated notifications (cursor) |
| `PATCH` | `/api/v1/notifications/:notificationId/read` | Mark one as read |
| `PATCH` | `/api/v1/notifications/read-all` | Mark all as read |
| `DELETE` | `/api/v1/notifications/:notificationId` | Delete notification |

---

## Layout

### Header Actions
- "전체 읽음" button → `PATCH /notifications/read-all` → invalidate list

### Notification List
- `CursorList` of notification items
- Each item: `message`, `type` badge, `createdAt`, read indicator dot
- Click → mark as read (`PATCH /notifications/:id/read`) + navigate if `targetUrl` present
- Delete button per item → `DELETE /notifications/:id` with optimistic removal

---

## TanStack Query Cache Keys

```ts
['notifications', filters]    // useInfiniteQuery
```
