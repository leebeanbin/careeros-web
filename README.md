# careeros-web

Frontend client for the CareerOS AI career platform.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)](https://typescriptlang.org)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-red?style=flat-square)](https://tanstack.com/query)

---

## Portfolio Ecosystem

| Project | Role | Stack |
|---------|------|-------|
| **[beanllm](https://github.com/leebeanbin/beanllm)** | AI infrastructure library | Python · 8 LLM providers |
| **[careerOS](https://github.com/leebeanbin/careerOS)** | Backend API | Spring Boot 3.3 · Java 17 |
| **careeros-web** ← (this repo) | Frontend client | Next.js 15 · TypeScript |
| **[dinobot](https://github.com/leebeanbin/dinobot)** | Discord bot + Notion automation | Python · FastAPI |

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

## Features

Covers all 58 careerOS backend endpoints:

- **Matches** — AI match score with 5-axis radar breakdown (skill/evidence/role/preference/freshness)
- **Jobs** — filtered job list, save, apply-click tracking, similar jobs
- **Resume** — upload, AI analysis, layout review, download
- **GitHub** — connect, sync, repository list
- **Advisor** — AI career report request and history
- **Candidate** — career graph, job preferences
- **Notifications** — real-time read/delete
- **Admin** — user management, job management, AI call audit log

---

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
```

Requires careerOS backend running at `localhost:8080`.

---

## Docs

| | |
|-|-|
| [wiki/](wiki/README.md) | Project knowledge base (routing, state, API client, components) |
| [docs/design-system/](docs/design-system/tokens.md) | Color tokens, typography, component specs |
| [docs/pages/](docs/pages/) | Per-page feature specs (all 58 endpoints) |
