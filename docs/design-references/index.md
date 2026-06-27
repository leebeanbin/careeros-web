# Design Reference Map

페이지별 클론 대상 URL과 추출 목표를 정의합니다.
클로너 결과물(`docs/research/`)을 이 문서의 추출 목표에 맞춰 `docs/design-system/`에 반영하세요.

---

## 클로너 실행 방법

```bash
# 1. ai-website-cloner-template 레포 클론
git clone https://github.com/leebeanbin/ai-website-cloner-template.git cloner
cd cloner && npm install

# 2. Chrome 포함 Claude Code 실행
claude --chrome

# 3. 대상 URL 클로닝 (아래 표 참고)
/clone-website https://linear.app
```

클로너가 생성하는 파일:
- `docs/research/components/` → 섹션별 정확한 CSS 수치 + 상태별 스타일
- `docs/research/design-tokens.md` → 추출된 컬러·폰트·간격 토큰
- `docs/research/screenshots/` → 레퍼런스 스크린샷

---

## 페이지별 클론 대상

| CareerOS 페이지 | 클론 대상 URL | 추출 목표 |
|----------------|-------------|---------|
| **레이아웃 전체** (사이드바 + 탑바) | `https://linear.app` (로그인 후) | 사이드바 너비·색상·nav item 높이, 탑바 높이 |
| **랜딩 페이지** `/` | `https://linear.app` | Hero 섹션, Feature 카드, CTA 버튼, 그라디언트 |
| **로그인/회원가입** | `https://vercel.com/login` | 폼 카드 스타일, OAuth 버튼, 타이포그래피 |
| **대시보드** `/dashboard` | `https://linear.app` (홈 뷰) | 위젯 카드 배치, 통계 섹션 레이아웃 |
| **채용공고 목록** `/jobs` | `https://linear.app/issues` (유사) | 필터 바, 리스트 아이템 밀도, 정렬 UI |
| **채용공고 상세** `/jobs/:id` | `https://lever.co` (채용 상세 페이지) | 포스팅 레이아웃, 사이드 액션 패널 |
| **매칭 목록** `/matches` | `https://spotify.com` (추천 피드) | 점수 배지, 카드 그리드 vs 리스트 선택 |
| **매칭 상세** `/matches/:id` | `https://grammarly.com` (인사이트 탭) | 레이더/점수 시각화, 섹션 구분 |
| **이력서** `/resume` | `https://canva.com` (문서 업로더) | 업로드 영역 드래그앤드롭, 파일 리스트 |
| **GitHub** `/github` | `https://github.com/settings/applications` | 연결 상태 카드, 연동 OAuth 버튼 |
| **경력 그래프** `/candidate` | `https://notion.so` (프로필 페이지) | 정보 섹션 레이아웃, 인라인 편집 |
| **AI 어드바이저** `/advisor` | `https://claude.ai` (대화 목록) | 리포트 히스토리 리스트, 날짜 그루핑 |
| **알림** `/notifications` | `https://discord.com` (알림 패널) | 읽음/안읽음 구분, 타입 배지, 밀도 |
| **설정** `/settings` | `https://discord.com/app` (설정 화면) | 좌측 설정 카테고리 nav + 우측 폼 레이아웃 |
| **어드민 사용자** `/admin/users` | `https://linear.app/settings/members` | 멤버 테이블, 역할 배지, 드롭다운 액션 |
| **어드민 AI 호출** `/admin/ai-calls` | `https://www.datadoghq.com` (로그 뷰어) | 필터 + 로그 테이블, 통계 카드 |

---

## 추출 후 적용 절차

```
1. 클로너 완료 → docs/research/design-tokens.md 확인
2. 컬러 토큰: docs/design-system/tokens.md 의 CSS 변수 업데이트
3. 타이포그래피: 폰트 패밀리 + 사이즈 스케일 비교 후 반영
4. 섀도우/반경: tokens.md 의 --shadow-* 및 --radius-* 업데이트
5. 레이아웃 수치: docs/design-system/layout.md 의 정확한 px 값 업데이트
6. 컴포넌트 패턴: docs/design-system/patterns.md 에 새 패턴 추가
7. 페이지 스펙: docs/pages/{page}.md 에 UI 상세 보강
```

---

## 우선순위

1차 (필수, 핵심 UX): **linear.app** (레이아웃 전체 + 리스트)
2차 (폼/인증): **vercel.com/login**, **discord.com/app 설정**
3차 (개별 페이지): lever.co, canva.com, grammarly.com

1차만 클로닝해도 careeros-web 의 80%를 커버할 수 있습니다.
