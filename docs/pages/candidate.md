# Candidate Page

Route: `/candidate`

---

## API Calls

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v1/candidates/me/graph` | Career graph data |
| `PATCH` | `/api/v1/candidates/me/graph` | Update graph nodes/edges |
| `GET` | `/api/v1/candidates/me/preferences` | Job preferences |
| `PATCH` | `/api/v1/candidates/me/preferences` | Update preferences |

---

## Layout

### Career Graph
- Visualizes candidate's skill/experience graph from `GET /candidates/me/graph`
- Read-only view (edit TBD in future session)

### Preferences
- Form with fields from `GET /candidates/me/preferences`:
  - `preferredCountries` (multi-select)
  - `preferredRoleCategories` (multi-select)
  - `preferredRemoteType` (single select)
  - `openToRelocation` (boolean)
- "저장" button → `PATCH /candidates/me/preferences`

---

## TanStack Query Cache Keys

```ts
['candidates', 'me', 'graph']
['candidates', 'me', 'preferences']
```
