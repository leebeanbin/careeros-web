# Matches Page

Route: `/matches`

---

## API Calls

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v1/matches` | Paginated match list (cursor) |
| `PATCH` | `/api/v1/matches/:matchId/hide` | Hide a match |

---

## Query Params

| Param | Type | Values |
|-------|------|--------|
| `cursor` | string | pagination cursor |
| `size` | number | default 20 |
| `hideHidden` | boolean | default `true` (exclude hidden) |

---

## Layout

- `CursorList` with `JobCard` + `MatchScoreBadge` overlay
- Each card has a "숨기기" button → `PATCH /matches/:matchId/hide`
- After hide: optimistic update removes item from list
- Tabs: "전체" / "숨김" (toggle `hideHidden`)

---

## TanStack Query Cache Keys

```ts
['matches', filters]    // useInfiniteQuery
```
