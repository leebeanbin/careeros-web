# careeros-web Wiki

This wiki is the project knowledge base. Read relevant pages before writing code.

---

## Portfolio Ecosystem

| Project | Role | Stack |
|---------|------|-------|
| **[beanllm](https://github.com/leebeanbin/beanllm)** | AI infrastructure — 8 LLM providers, PyPI library | Python · 6,340 tests |
| **[careerOS](https://github.com/leebeanbin/careerOS)** | Career AI platform backend | Spring Boot 3.3 · 415 tests |
| **careeros-web** ← (this repo) | Frontend client | Next.js 15 · TypeScript |
| **[dinobot](https://github.com/leebeanbin/dinobot)** | Discord career bot + Notion automation | Python · FastAPI |

careeros-web talks exclusively to the careerOS REST API (`localhost:8080` in dev).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router), TypeScript |
| Styling | Tailwind CSS v4 |
| Server State | TanStack Query v5 |
| Global UI State | Zustand |
| Forms | React Hook Form |
| Charts | Recharts |

---

## Wiki Pages

| Page | Korean | Content |
|------|--------|---------|
| [architecture.md](architecture.md) | [한국어](architecture.ko.md) | Layer map, file structure, auth flow, error + loading strategy |
| [routing.md](routing.md) | [한국어](routing.ko.md) | Route structure, middleware auth, two OAuth flows |
| [state.md](state.md) | [한국어](state.ko.md) | TanStack Query cache keys, Zustand stores, cursor pagination |
| [api-client.md](api-client.md) | [한국어](api-client.ko.md) | Fetch wrapper, token refresh flow, domain file map |
| [components.md](components.md) | [한국어](components.ko.md) | 5 core component interfaces and usage |

## Design System

| Page | Content |
|------|---------|
| [tokens](../docs/design-system/tokens.md) | Color palette, typography, spacing tokens |
| [layout](../docs/design-system/layout.md) | Page shell, sidebar nav, responsive breakpoints, content widths |
| [patterns](../docs/design-system/patterns.md) | Forms, buttons, toast, loading, empty/error states, modal |
| [components spec](../docs/design-system/components.md) | 5 core component props and visual specs |

## Page Specs

All page-level feature specs: [docs/pages/](../docs/pages/)
