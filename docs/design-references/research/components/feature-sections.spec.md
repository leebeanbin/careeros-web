# Feature Sections Specification

## Overview
- **Target file:** `src/components/FeatureSection.tsx` (reusable) + one instance per section
- **Screenshots:** scroll y=2600, 3800, 5100, 6300, 7400
- **Interaction model:** static (each section is independent; the "1.0 Intake →" etc. links are navigation links)

## DOM Structure (shared for all 5 sections)
Each feature section is a `<section>` element containing:
1. **Header** (2-column grid):
   - Left: H2 heading (large, 2-line)
   - Right: Description paragraph + numbered action link
2. **Illustration** (full-width app UI mockup)
3. **Footer nav** (usually hidden for the visible links — the links like "1.0 Intake →" appear at the END of each section's illustration as a caption)

---

## Shared Computed Styles

### Section Container
- display: block
- padding-top: 80px
- padding-bottom: 80px
- padding-left: 64px
- padding-right: 64px
- background-color: rgb(8, 9, 10)
- border-top: 1px solid rgba(255, 255, 255, 0.05)

### Header Grid
- display: grid
- grid-template-columns: 1fr 1fr
- gap: 0 80px
- align-items: end
- padding-bottom: 48px

### H2 (Left Column)
- font-size: 48px
- font-weight: 510
- line-height: 52px
- letter-spacing: -0.96px
- color: rgb(247, 248, 248)
- white-space: pre-line (respects newlines in content)
- max-width: 520px

### Description (Right Column)
- font-size: 16px
- font-weight: 400
- line-height: 26px
- color: rgb(138, 143, 152)
- margin-bottom: 20px

### Action Link (e.g., "1.0 Intake →")
- display: inline-flex
- align-items: center
- gap: 8px
- font-size: 14px
- font-weight: 510
- color: rgb(247, 248, 248)
- text-decoration: none
- Number prefix: "1.0" in rgb(138, 143, 152), "Intake" in rgb(247, 248, 248), "→" at end

### Illustration Container
- background-color: rgb(13, 14, 15)
- border-radius: 12px
- border: 1px solid rgba(255, 255, 255, 0.06)
- overflow: hidden
- position: relative
- min-height: 560px

---

## Section 1: "Make product operations self-driving" (Intake)

### H2 Text
"Make product\noperations self-driving"

### Description
"Turn conversations and customer feedback into actionable issues that are routed, labeled, and prioritized for the right team."

### Action Link
"1.0  Intake →"

### Illustration (Scroll y=2600)
Two-panel layout side by side:

**Left: Slack Thread Panel** (width ~45%)
- Panel header: "# Thread in #feedback" with ⋮ menu
- Avatar list: lena (2:49 PM), didier (2:49 PM), andreas (2:49 PM)
- Messages:
  - lena: "Anyone else noticing the iOS app feels slow to open if you haven't used it in a bit?"
  - didier: "Yea, we're still blocking initial render on a full vehicle_state sync every time..."
  - andreas: "Feels like we could render sooner and load the rest in the background. Probably also worth tracking startup timing so we know how often this happens!"
- Bottom input: "@Linear create urgent issues and assign to me" with send button
- Background: rgb(13, 14, 15), slack-style layout

**Right: Issue Board Panel** (width ~55%)  
- Columns: "Todo  71" | "In Progress  3" | (more)
- Issue cards with IDs: ENG-926 "Remove UI inconsistencies" [Bug] [Design], ENG-2088 "TypeError: Cannot read properties" [Bug], ENG-924 "Upgrade to Claude Opus 4.5" [AI], ENG-1182 "Optimize load times" [Performance], MKT-1028 "Launch page assets" [Design], ENG-2187 "Prevent duplicate ride requests on poor..." [Bug] [62048]
- Background: slightly lighter than main bg

---

## Section 2: "Define the product direction" (Plan)

### H2 Text
"Define the\nproduct direction"

### Description
"Plan and navigate from idea to launch. Align your team with product initiatives, strategic roadmaps, and clear, up-to-date PRDs."

### Action Link
"2.0  Plan →"

### Illustration (Scroll y=3800)
Two-panel layout:

**Left: Initiatives List Panel** (width ~35%)
- "Initiatives" header
- Initiative rows:
  - ⬡ Core Product  99
    - ≡ Infra stability  28
    - + Autonomous systems  16
    - 📱 Mobile apps  8
  - ⬡ APAC Expansion  21
    - 🌸 Japan Launch  12
    - 📋 Customer-driven priorities  9
- Each row has icon + name + number

**Right: Gantt/Timeline Panel** (width ~65%)
- Month headers: MAR, APR, MAY, JUN, JUL, AUG, SEP (with week columns)
- Timeline bars:
  - "✦ UI Refresh ✓" — orange progress bar spanning MAY-JUL, milestones "Core screens" and "Polish"
  - "✦ Split fares ↑" — purple progress bar, milestones "Internal" and "Public Beta"  
  - "✦ Autonomy status clarity ✓" — blue dotted line with milestone "Alpha"

---

## Section 3: "Move work forward across teams and agents" (Build)

### H2 Text
"Move work forward\nacross teams and agents"

### Description
"Build and deploy AI agents that work alongside your team. Work on complex tasks together or delegate fully."

### Action Link
"3.0  Build →"

### Illustration (Scroll y=5100)
Two-panel layout:

**Left: AI Agent Terminal** (width ~50%)
- Header: "⬡ Codex" with ⋯ menu
- Terminal output (monospaced, dark):
  ```
  On it! I've received your request.
  Kicked off a task in kinetic/kinetic-iOS environment.
  Searching for root AGENTS file
  kinetic/kinetic-iOS$ /bin/bash -lc rg --files -g 'AGENTS.md'
  AGENTS.md
  Locating initialization logic for vehicle_state
  ⠙ Thinking...
  ```
- bg: rgb(13, 14, 15), monospaced text in rgb(138,143,152), highlighted parts in rgb(247,248,248)

**Right: Assign Dropdown** (width ~50%)
- "Assign to..." header in input
- Agent/Human list:
  - ⬡ Codex  [Agent badge]  ✓ (selected)
  - 👤 Steven
  - 👤 Ema
  - ⬡ GitHub Copilot  [Agent badge]
  - ⬡ Cursor  [Agent badge]
  - 👤 Meg
- [Agent] badge: bg rgba(255,255,255,0.1), color rgb(208,214,224), border-radius 4px, font-size 11px, padding 2px 6px

---

## Section 4: "Review PRs and agent output" (Diffs)

### H2 Text
"Review PRs and agent output"

### Description
"Understand code changes at a glance with structural diffs for human and agent output. Review, discuss, and merge within Linear."

### Action Link
"4.0  Diffs →"

### Illustration (Scroll y=6300)
Full-width diff viewer:
- File tab: "kinetic-ios/src/screens/Home/HomeScreen.tsx" on left | "Linear ◇" tag on right
- Split diff view (old | new):
  - Line numbers (01-18 on each side)
  - Red highlighted rows (removed): lines 03 (useVehicleState import), 07 (isFullySynced), 09 (if statement)
  - Green highlighted rows (added): lines 03 (SyncStatus added), 07 (syncStatus), 09 (SyncStatus.PENDING)
  - Code syntax coloring: keywords (import, const, return, if) in blue/purple, strings in other colors
  - bg: rgb(13, 14, 15)
  - Red line bg: rgba(220, 38, 38, 0.15)
  - Green line bg: rgba(34, 197, 94, 0.12)

---

## Section 5: "Understand progress at scale" (Monitor)

### H2 Text
"Understand\nprogress at scale"

### Description
"Take the guesswork out of product development with project updates, analytics, and dashboards that show you what's happening and why."

### Action Link
"5.0  Monitor →"

### Illustration (Scroll y=7400)
Two-panel layout:

**Left: Weekly Pulse Card** (width ~45%)
- "Weekly Pulse for Jun 27" header with "▶ Listen" button and "1.0×" speed
- "Projects" section:
  - "UI refresh" — "⚠ At risk  By romain · 1 day ago"
    - "iOS implementation is mostly complete, but Android updates are still work in progress"
    - "Risk of timeline slip if remaining design decisions aren't finalized soon"
  - "Tokyo launch" — "✓ On track  By julian · 3 hours ago"
    - "Localization efforts have been completed"
    - "Everything else on track for launch in early September"

**Right: Cycle Time Chart** (width ~55%)
- "Cycle time by agent" header
- Scatter plot with:
  - X axis: Agent names (Cursor, Codex, No agent)
  - Y axis: Numbers 0-18
  - Blue dots (Cursor cluster), Orange dots (Codex cluster), Gray dots (No agent)
  - Line connecting median points across groups

---

## Responsive Behavior
- **Desktop (1440px):** 2-column header grid, full-width illustration
- **Tablet (768px):** Header stacks to single column
- **Mobile (390px):** Header stacks, illustration may scroll horizontally or be simplified

## Implementation Notes
- Build each section as its own component importing the shared FeatureSection shell
- The illustrations are styled HTML components, not images
- Use font-mono (Fira Code or SF Mono) for code/terminal content
- Each panel inside illustrations uses bg rgb(13,14,15), border 1px solid rgba(255,255,255,0.06)
- Avatar circles: 24-28px, circular, bg rgba(255,255,255,0.1)
- Issue ID badges: font-mono, font-size 11px, color rgb(138,143,152)
- Label badges: bg rgba(255,255,255,0.06), border-radius 4px, padding 2px 8px, font-size 12px
