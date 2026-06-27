# careeros-web Agent Rules

Wiki-first workflow: load the right context before changing code.

Before writing any code, modifying documentation, or running tests, load the relevant wiki pages:

- **Wiki Index:** [wiki/README.md](wiki/README.md)
- **Routing:** [wiki/routing.md](wiki/routing.md)
- **State Management:** [wiki/state.md](wiki/state.md)
- **API Client:** [wiki/api-client.md](wiki/api-client.md)
- **Components:** [wiki/components.md](wiki/components.md)

## Package Structure

```text
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/           # public routes: /login, /signup
│   ├── (auth)/             # protected routes: /dashboard, /jobs, /matches, ...
│   └── (admin)/            # admin-only routes: /admin/*
├── components/             # shared UI components
├── lib/
│   └── api/                # API client functions by domain
└── stores/                 # Zustand stores
```

## Key Rules

- All server state via TanStack Query — no `useState` for remote data
- All forms via React Hook Form
- Auth: JWT HTTP-only cookies — never read token in JS
- Cursor pagination: `useInfiniteQuery` + `IntersectionObserver`
- Token refresh: handled inside `apiFetch` — 401 → `POST /auth/reissue` → retry once → `/login`

## Backend

careerOS REST API at `http://localhost:8080` (dev). All 58 endpoints documented in [wiki/state.md](wiki/state.md).

## Design

Tailwind CSS v4 utility classes only. CSS custom property tokens in [docs/design-system/tokens.md](docs/design-system/tokens.md). No custom design system library.
