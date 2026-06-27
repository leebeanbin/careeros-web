# careeros-web Wiki

이 위키는 프로젝트 지식 베이스입니다. 코드 작성 전 관련 페이지를 먼저 읽으세요.

[English](./README.md) | 🇰🇷 **한국어**

---

## 포트폴리오 에코시스템

| 프로젝트 | 역할 | 스택 |
|---------|------|------|
| **[beanllm](https://github.com/leebeanbin/beanllm)** | AI 인프라 — 8개 LLM 제공사, PyPI 라이브러리 | Python · 6,340 테스트 |
| **[careerOS](https://github.com/leebeanbin/careerOS)** | 커리어 AI 플랫폼 백엔드 | Spring Boot 3.3 · 415 테스트 |
| **careeros-web** ← (이 레포) | 프론트엔드 클라이언트 | Next.js 15 · TypeScript |
| **[dinobot](https://github.com/leebeanbin/dinobot)** | 디스코드 커리어 봇 + Notion 자동화 | Python · FastAPI |

careeros-web은 careerOS REST API (`localhost:8080` 개발 환경)와만 통신합니다.

---

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| 프레임워크 | Next.js 15 (App Router), TypeScript |
| 스타일링 | Tailwind CSS v4 |
| 서버 상태 | TanStack Query v5 |
| 전역 UI 상태 | Zustand |
| 폼 | React Hook Form |
| 차트 | Recharts |

---

## Wiki 페이지

| 페이지 | 내용 |
|--------|------|
| [architecture.ko.md](architecture.ko.md) | 레이어 구조, 파일 트리, 인증 흐름, 에러·로딩 전략 |
| [routing.ko.md](routing.ko.md) | 라우트 구조, 미들웨어 인증, OAuth 콜백 |
| [state.ko.md](state.ko.md) | TanStack Query 캐시 키, Zustand 스토어, 커서 페이지네이션 |
| [api-client.ko.md](api-client.ko.md) | fetch 래퍼, 토큰 갱신 흐름, 도메인 파일 목록 |
| [components.ko.md](components.ko.md) | 핵심 컴포넌트 5개 인터페이스 및 사용법 |

## 디자인 시스템

| 페이지 | 내용 |
|--------|------|
| [토큰](../docs/design-system/tokens.ko.md) | 컬러 팔레트, 타이포그래피, 간격, 보더 반경 |
| [레이아웃](../docs/design-system/layout.ko.md) | 페이지 셸, 사이드바 네비게이션, 반응형 브레이크포인트 |
| [패턴](../docs/design-system/patterns.ko.md) | 폼, 버튼, 토스트, 탭, 테이블, 모달, 배지, 필터 바 |
| [컴포넌트 명세](../docs/design-system/components.ko.md) | 5개 핵심 컴포넌트 props 및 시각적 명세 |

## 페이지 명세

페이지별 기능 명세: [docs/pages/](../docs/pages/)
