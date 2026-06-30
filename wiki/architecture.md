# Architecture Overview

🌐 **English** | [한국어](./architecture.ko.md)

## Layer Map

```
Browser
  └── Next.js App Router
        ├── src/proxy.ts          — route guard + ADMIN role check
        ├── (public)/             — landing and auth entry pages
        ├── (auth)/layout.tsx     — dark assistant app shell
        ├── (admin)/layout.tsx    — admin shell
        ├── TanStack Query        — server state and cache
        └── src/lib/api/*         — typed API modules + DTO adapters
```

## Data Flow

```mermaid
sequenceDiagram
  participant C as Component
  participant Q as TanStack Query
  participant F as apiFetch
  participant P as proxy.ts
  participant B as CareerOS API

  P->>P: Check access_token cookie before protected route render
  C->>Q: useQuery / useMutation
  Q->>F: Domain API call
  F->>B: GET/POST/PATCH/DELETE /api/v1/*
  B-->>F: { data }
  F-->>Q: Normalized DTO
  Q-->>C: data, loading, error
  note over F,B: 401 → POST /auth/reissue → retry once
```

## Design System

Authenticated and admin pages use the `dark-app` token system in `src/app/globals.css`. The visual direction is neutral-first: black surfaces, white typography, restrained borders, subtle motion, and limited accent color for selected/saved/primary states.

## Key Constraints

- Do not read JWT cookies from client JavaScript.
- Keep server state in TanStack Query.
- Keep backend DTO drift inside `src/lib/api/adapters.ts`.
- Prefer shared UI primitives and design tokens over page-level color hardcoding.
- Cursor pagination is the default list contract.

[Wiki Index](README.md) | [Routing ▶](routing.md)
