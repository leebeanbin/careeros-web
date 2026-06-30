# CareerOS 인터랙션 패턴

## Agent Page Pattern

어시스턴트형 페이지는 다음 순서를 사용합니다.

1. `AgentIntro`: 에이전트가 무엇을 읽고 무엇을 만들지 설명합니다.
2. `AgentStatusStrip`: 현재 상태를 작게 요약합니다.
3. 핵심 workflow: row, panel, analysis, form 중 하나로 구성합니다.
4. empty/error/loading 상태는 문제가 생긴 영역 가까이에 둡니다.

## 컨트롤

- 필터, 그룹, 보기 컨트롤은 URL param 또는 local state를 실제로 바꿔야 합니다.
- 동작 없는 컨트롤은 금지합니다. 사용할 수 없는 기능은 disabled 처리하거나 제거합니다.
- 버튼 variant는 `primary`, `secondary`, `ghost`, `danger`, `success`, `muted`를 사용합니다.
- muted cobalt는 focus/primary/saved/selected 상태로 제한합니다. 일반 분석 UI는 neutral 톤을 유지합니다.

## 목록

- jobs, matches, notifications, users, admin logs는 row list를 우선합니다.
- row hover는 `rgba(255,255,255,0.03)`, divider는 `rgba(255,255,255,0.04)`를 사용합니다.
- empty state는 무엇이 없는지와 다음 행동을 함께 알려야 합니다.

## AI 분석

분석 화면은 단순 카드 나열이 아니라 다음 구조를 사용합니다.

- 핵심 판단
- 근거
- 위험 신호
- 우선순위
- 다음 액션

이력서 레이아웃 리뷰는 헤더, 요약문, 경험, 성과 수치, 기술 스택, 프로젝트처럼 실제 이력서 영역을 구체적으로 지목합니다.
