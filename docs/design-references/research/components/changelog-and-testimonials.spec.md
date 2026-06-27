# Changelog + Testimonials Specification

## Overview
- **Target files:**
  - `src/components/ChangelogSection.tsx`
  - `src/components/TestimonialsSection.tsx`
- **Screenshots:** scroll y=8600 (both sections visible)
- **Interaction model:** static

---

## 1. ChangelogSection ("What's New")

### DOM Structure
Section with:
1. 4-column grid of changelog post cards
2. "View all →" link below

### Computed Styles

#### Section Container
- background-color: rgb(8, 9, 10)
- padding: 80px 64px
- border-top: 1px solid rgba(255, 255, 255, 0.05)

#### Grid Container
- display: grid
- grid-template-columns: repeat(4, 1fr)
- gap: 16px
- margin-bottom: 24px

#### Individual Card
- display: flex
- flex-direction: column
- gap: 12px
- cursor: pointer

#### Card Dot/Color Indicator
- width: 8px
- height: 8px
- border-radius: 9999px
- background: varies by post (see content below)
- margin-bottom: 4px

#### Card Title
- font-size: 15px
- font-weight: 510
- color: rgb(247, 248, 248)
- line-height: 22px
- margin-bottom: 4px

#### Card Excerpt
- font-size: 14px
- font-weight: 400
- line-height: 20px
- color: rgb(138, 143, 152)
- display: -webkit-box
- -webkit-line-clamp: 3
- overflow: hidden

#### Card Date
- font-size: 12px
- color: rgb(138, 143, 152)
- font-family: monospace
- margin-top: auto

#### "View all →" Link
- font-size: 14px
- font-weight: 510
- color: rgb(247, 248, 248)
- text-decoration: none
- display: inline-flex
- align-items: center
- gap: 4px

### Content (verbatim)

**Card 1:** 
- Dot color: rgb(234, 179, 8) (orange/amber)
- Title: "Agent assisted project updates"
- Excerpt: "Project and initiative updates keep teams aligned, but writing them means pulling out recent changes from issues, documents, and conversations."
- Date: "JUN 17, 2026"

**Card 2:**
- Dot color: rgb(99, 102, 241) (indigo/purple)
- Title: "Coding sessions in Linear"
- Excerpt: "Earlier this year, we launched Linear Agent, giving teams a new way to plan and coordinate their issues and projects. Since then, we've continued to expand..."
- Date: "JUN 10, 2026"

**Card 3:**
- Dot color: rgb(34, 197, 94) (green)
- Title: "Team documents"
- Excerpt: "Important team context doesn't always belong in a specific issue, project, or initiative. Teams also need a dedicated place for the notes, specs, and decisions..."
- Date: "JUN 3, 2026"

**Card 4:**
- Dot color: rgb(59, 130, 246) (blue)
- Title: "Linear Diffs"
- Excerpt: "Agents generate large volumes of code, but individuals are still accountable for the changes that merge. This leads to a lot of review work..."
- Date: "MAY 27, 2026"

---

## 2. TestimonialsSection

### DOM Structure
Section with 2 testimonial cards side by side (each ~50% width, slight gap).

### Computed Styles

#### Section Container
- background-color: rgb(8, 9, 10)
- padding: 0 12px 12px

#### Cards Container
- display: grid
- grid-template-columns: 1fr 1fr
- gap: 8px

#### Primary Card (light blue gradient)
- background: linear-gradient(0deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%), linear-gradient(180deg, #b2d5ff 0%, #dfd1ff 100%)
  (This produces a soft lavender/periwinkle pastel color)
- border-radius: 8px
- padding: 24px 32px
- display: flex
- flex-direction: column
- justify-content: space-between
- min-height: 360px

#### Primary Card Quote Text
- font-size: 32px
- font-weight: 400
- line-height: 40px
- color: rgb(8, 9, 10) (dark text on light background!)
- margin-bottom: 32px

#### Primary Card Logo
- Small OpenAI-style logo (black on the light background)
- height: 20px

#### Primary Card Attribution
- display: flex
- align-items: center
- gap: 12px
- Avatar: 36px circle
- Name: "Gabriel Peal"
  - font-size: 14px
  - font-weight: 510
  - color: rgb(8, 9, 10)
- Role: "Staff Software Engineer, OpenAI"
  - font-size: 13px
  - color: rgba(8, 9, 10, 0.6)

#### Secondary Card (bright yellow-green)
- background: #e4f222
- border-radius: 8px
- padding: 24px 32px
- display: flex
- flex-direction: column
- justify-content: space-between
- min-height: 360px

#### Secondary Card Quote Text
- font-size: 32px
- font-weight: 400
- line-height: 40px
- color: rgb(8, 9, 10) (dark text on yellow background!)
- margin-bottom: 32px

#### Secondary Card Logo
- Small "ramp" logo (black)

#### Secondary Card Attribution
- Avatar: 36px circle
- Name: "Nik Koblov"
  - font-size: 14px
  - font-weight: 510
  - color: rgb(8, 9, 10)
- Role: "Head of Engineering, Ramp"
  - font-size: 13px
  - color: rgba(8, 9, 10, 0.6)

### Content (verbatim)

**Primary Card:**
- Quote: "You'll probably build a better product, just because of the craft that using Linear infuses on your brain."
- Attribution: Gabriel Peal, Staff Software Engineer, OpenAI

**Secondary Card:**
- Quote: "Our speed is intense and Linear helps us be action biased."
- Attribution: Nik Koblov, Head of Engineering, Ramp

## Responsive Behavior
- **Desktop:** 4-col changelog, 2-col testimonials
- **Mobile:** Both stack to single column

## Assets
- None (text-based content)
