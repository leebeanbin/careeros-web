# HeroSection Specification

## Overview
- **Target file:** `src/components/HeroSection.tsx`
- **Screenshot:** see scroll y=0 screenshot
- **Interaction model:** static (no scroll animations needed for the clone)

## DOM Structure
Full-width section with dark background. Contains:
1. Top spacer (for fixed nav: ~200px padding-top)
2. Left-aligned headline block:
   - H1 "The product development system for teams and agents"
   - Subtitle P "Purpose-built for planning and building products. Designed for the AI era."
3. "New · Coding Sessions →" feature announcement link (top-right of heading area)
4. App UI mockup (large rounded rectangle showing the Linear app interface)

## Computed Styles

### Section Container
- background-color: rgb(8, 9, 10)
- padding-top: ~180px (accounts for fixed nav + breathing room)
- padding-bottom: 0
- overflow: hidden

### Inner Container (inset)
- max-width: 1440px
- margin: 0 auto
- padding-left: 64px
- padding-right: 64px
- position: relative

### H1 — "The product development system for teams and agents"
- font-size: 64px
- font-weight: 510
- line-height: 64px (1:1 tight)
- letter-spacing: -1.408px
- color: rgb(247, 248, 248)
- max-width: 860px
- margin-bottom: 24px
- font-family: Inter Variable / Inter

### Subtitle Paragraph
- font-size: 16px
- font-weight: 400
- line-height: 24px
- color: rgb(138, 143, 152)
- margin-bottom: 0

### "New · Coding Sessions →" Link
- positioned: absolutely (top-right of the heading area) OR floated right in a flex container
- display: flex
- align-items: center
- gap: 8px
- text-decoration: none
- font-size: 15px
- "New" badge:
  - color: rgb(208, 214, 224)
  - font-weight: 510
  - display: inline-block
- " · " separator
- "Coding Sessions →" text:
  - color: rgb(208, 214, 224)
  - font-weight: 400
- Arrow "→" is part of the text

### App Mockup Container
- margin-top: 48px
- border-radius: 12px 12px 0 0 (top corners rounded, bottom cropped)
- background-color: rgb(15, 16, 17)
- border: 1px solid rgba(255, 255, 255, 0.08)
- border-bottom: none
- overflow: hidden
- width: calc(100% - 48px)  [roughly full width minus padding]
- min-height: 500px
- position: relative

## App Mockup Content
The mockup shows the Linear app with:

**Left sidebar** (width ~230px, dark bg ~rgb(15,16,17), border-right 1px solid rgba(255,255,255,0.06)):
- "Linear" workspace header with chevron (12px, muted color)
- Nav items: 🔲 Inbox, ↩ My issues, ☰ Reviews, ✦ Pulse
- Section: "Workspace" header (10px uppercase muted)
- Items: ⬡ Initiatives, 📁 Projects, ••• More
- Section: "Favorites"
- Item: ⭕ Faster app launch (highlighted row)

**Center panel** (dark bg, issue viewer):
- Top bar: "Faster app launch ⭐ ···" | "02 / 145 ↑↓" | "ENG-2703 🔗 📋 ⑂"
- Issue title: "Faster app launch"
- Issue description: "Render UI before `vehicle_state` sync when minimum required state is present, instead of blocking on full refresh during iOS startup."
- "Activity" section header
- Activity items (with avatar icons): "Linear created the issue via Slack on behalf of karri · 2min ago", "Triage Intelligence added the label Performance and iOS · 2min ago", "karri · 4 min ago"

**Right panel** (issue metadata, dark bg):
- Status: ⭕ In Progress
- Priority: 📊 High
- Assignee: jori (avatar)
- Project: ⬡ Linear

**Floating AI panel** (bottom right):
- Header: "● Linear  Opus 4.8  [−] [□] [×]"
- Content: "jori connected Linear to ENG-2703", "Examining the startup path...", "Worked for 7s ▼"
- "Render UI before `vehicle_state` sync ..."

## States & Behaviors
N/A — static display for clone purposes

## Assets
None (app mockup is HTML/CSS, not an image)

## Text Content (verbatim)
- H1: "The product development system for teams and agents"
- Subtitle: "Purpose-built for planning and building products. Designed for the AI era."
- Feature link: "New · Coding Sessions →"

## Responsive Behavior
- **Desktop (1440px):** Full layout as described
- **Mobile (390px):** Heading stacks, font size reduces to ~36px, mockup may be hidden or simplified
- **Breakpoint:** ~768px

## Implementation Notes
- The "New" badge is a simple colored span, not a button
- The feature link is top-right aligned — use a flex container between h1 block and the link
- The app mockup is a complex UI — build it as realistic HTML/CSS using the app colors:
  - App bg: rgb(15, 16, 17)
  - Sidebar: width 230px, border-right rgba(255,255,255,0.06)
  - Panel dividers: 1px solid rgba(255,255,255,0.06)
  - Highlighted row bg: rgba(255,255,255,0.05)
  - Text: rgb(247,248,248) primary, rgb(138,143,152) secondary
  - Code inline: font-mono, bg rgba(255,255,255,0.1), rounded 4px, padding 2px 6px
  - Activity item avatar size: 20px circular
- Match the rounded top corners and cropped bottom of the mockup window
- The mockup has a subtle glow/gradient behind it (rgba gradient from page bg to transparent)
