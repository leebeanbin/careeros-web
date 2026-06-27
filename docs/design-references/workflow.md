# 클론 → 적용 워크플로우

---

## Step 1. 클로너 환경 세팅

```bash
# ai-website-cloner-template 레포를 careeros-web과 별도 폴더에 준비
git clone https://github.com/leebeanbin/ai-website-cloner-template.git ~/cloner
cd ~/cloner
npm install

# Claude Code + Chrome 실행 (Chrome 필수)
claude --chrome
```

> careeros-web 레포 안에서 클로너를 실행하지 마세요.
> 클로너 결과물은 `~/cloner/` 안에만 쌓이도록 격리합니다.

---

## Step 2. 우선순위 1차 클로닝

```
# linear.app 전체 레이아웃 (사이드바 + 리스트 뷰)
/clone-website https://linear.app

# vercel.com 로그인 페이지
/clone-website https://vercel.com/login

# discord.com 설정 페이지 (로그인 필요 — 직접 URL 입력)
/clone-website https://discord.com/channels/@me
```

---

## Step 3. 추출할 수치

클로너 완료 후 `~/cloner/docs/research/` 에서 아래 항목을 추출합니다:

### 레이아웃 수치 (→ `docs/design-system/layout.md`)
- [ ] 사이드바 실제 너비 (px)
- [ ] 사이드바 배경색 (hex)
- [ ] nav item 높이 (px)
- [ ] nav item 활성/호버 배경색 (hex 또는 rgba)
- [ ] 탑바 높이 (px)
- [ ] 콘텐츠 영역 padding (px)

### 토큰 수치 (→ `docs/design-system/tokens.md`)
- [ ] 주요 포인트 컬러 (accent)
- [ ] 카드 섀도우 (`box-shadow` 실제값)
- [ ] 카드 border 색상 (rgba)
- [ ] 폰트 패밀리
- [ ] body text 사이즈 (px)
- [ ] label/caption text 사이즈 (px)

### 컴포넌트 패턴 (→ `docs/design-system/patterns.md`)
- [ ] 버튼 hover 전환 duration/easing
- [ ] 드롭다운 애니메이션 방향 + duration
- [ ] 토스트 진입 방향 + duration
- [ ] 포커스 링 스타일 (color + offset)

---

## Step 4. careeros-web에 반영

추출한 수치를 careeros-web으로 가져와 직접 파일 편집:

```bash
cd /Users/leebeanbin/Downloads/careeros-web

# 1. 토큰 업데이트
edit docs/design-system/tokens.md

# 2. 레이아웃 수치 업데이트
edit docs/design-system/layout.md

# 3. 스크린샷 저장 (선택)
cp ~/cloner/docs/research/screenshots/*.png docs/design-references/screenshots/

# 4. 커밋
git add docs/
git commit -m "design: apply cloned design tokens from linear/vercel/discord"
```

---

## 주의사항

- 컬러를 그대로 복사하지 말 것 — careeros 브랜드 맥락에 맞게 조정
- 클로너가 생성한 React 컴포넌트 코드는 직접 careeros-web에 붙여넣지 말 것 (스택 불일치: shadcn vs 순수 Tailwind)
- 디자인 **수치와 패턴**만 참고하고, 코드는 직접 작성
