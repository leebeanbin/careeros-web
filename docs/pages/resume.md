# Resume Page

Route: `/resume`

---

## API Calls

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/v1/resumes` | Upload resume (multipart/form-data) |
| `GET` | `/api/v1/resumes` | List all resumes |
| `GET` | `/api/v1/resumes/active` | Get active resume |
| `GET` | `/api/v1/resumes/:resumeId` | Get single resume metadata |
| `DELETE` | `/api/v1/resumes/:resumeId` | Delete resume |
| `GET` | `/api/v1/resumes/:resumeId/download` | Download PDF |
| `GET` | `/api/v1/resumes/:resumeId/analysis` | AI analysis result |
| `GET` | `/api/v1/resumes/:resumeId/layout-review` | Layout review feedback |

---

## Layout

### Upload Section
- `ResumeUploader` component (PDF, max 10MB)
- After upload: refetch `['resumes']`, show success toast

### Resume List
- Table: `originalFileName`, `uploadedAt`, active badge
- Actions per row: "다운로드", "분석 보기", "레이아웃 리뷰", "삭제"

### Analysis Panel
- Triggered by "분석 보기" → fetches `GET /resumes/:resumeId/analysis`
- Shows AI extraction fields: skills, experience summary, extracted projects

### Layout Review Panel
- Triggered by "레이아웃 리뷰" → fetches `GET /resumes/:resumeId/layout-review`
- Shows feedback items as bulleted list

---

## TanStack Query Cache Keys

```ts
['resumes']
['resumes', 'active']
['resumes', resumeId]
['resumes', resumeId, 'analysis']
['resumes', resumeId, 'layout-review']
```
