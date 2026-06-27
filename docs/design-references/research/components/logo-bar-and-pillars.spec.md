# LogoBar + NewSpecies + PillarCards Specification

## Overview
- **Target files:**
  - `src/components/LogoBar.tsx`
  - `src/components/NewSpeciesSection.tsx`
  - `src/components/PillarCards.tsx`
- **Screenshot:** scroll y=900 screenshot
- **Interaction model:** static

---

## 1. LogoBar Component

### DOM Structure
A horizontal row of customer logos, centered. Contained in a `<a>` tag linking to `/customers`.

### Computed Styles

#### Container
- background-color: rgb(8, 9, 10)
- padding: 40px 64px
- display: flex
- justify-content: center
- align-items: center

#### Logo Row
- display: flex
- align-items: center
- gap: 48px
- flex-wrap: nowrap

#### Individual Logo
- color: rgb(247, 248, 248)
- opacity: 0.6 (muted appearance)
- height: 20-28px (varies by logo)
- fill: currentColor

### Text Content (verbatim)
Logos (left to right): Vercel, CURSOR, OSCAR, OpenAI, coinbase, Cash App, BOOM, ramp

### Logo SVGs
These are all SVG logos. Recreate as styled text with brand-appropriate fonts as fallback, OR use simple SVG text paths. For the clone, render them as:
- "▲ Vercel" — triangle icon + text
- "⬡ CURSOR" — hexagon + text
- "OSCAR" — plain text
- "OpenAI" — plain text
- "coinbase" — "⬡" + text (similar icon)
- "$ Cash App" — "$" in square + text
- "BOOM" — text with lightning bolt
- "ramp ↗" — text + arrow

Use white text at opacity 0.6. Font: Inter 14px, weight 500.

---

## 2. NewSpeciesSection Component

### DOM Structure
Full-width dark section with:
1. Large H2 heading (two-tone — first part white, second part muted gray)
2. Below: 3-column grid of PillarCards

### Computed Styles

#### Section Container
- background-color: rgb(8, 9, 10)
- padding: 80px 64px 80px
- max-width: 1440px (centered)

#### H2 — "A new species of product tool."
- font-size: 48px
- font-weight: 510
- line-height: 56px
- letter-spacing: -0.96px (approx)
- First sentence "A new species of product tool." → color: rgb(247, 248, 248)
- Second sentence "Purpose-built for modern teams with AI workflows at its core, Linear sets a new standard for planning and building products." → color: rgb(138, 143, 152)
- Both sentences on same H2 element (use two spans with different colors)
- margin-bottom: 64px
- max-width: 900px

---

## 3. PillarCards Component (3-column)

### DOM Structure
3-column grid of cards, each card containing:
1. Isometric 3D wireframe illustration (top of card)
2. Title (H3)
3. Description paragraph

### Card Container
- display: grid
- grid-template-columns: repeat(3, 1fr)
- gap: 8px

### Individual Card
- background-color: rgb(15, 16, 17)
- border: 1px solid rgba(255, 255, 255, 0.05)
- border-radius: 8px
- padding: 0 24px 28px
- display: flex
- flex-direction: column

### Card Illustration Area
- height: ~220px
- display: flex
- align-items: center
- justify-content: center
- margin-bottom: 16px
- overflow: hidden

### Card Title (H3)
- font-size: 15px
- font-weight: 510
- color: rgb(247, 248, 248)
- margin-bottom: 8px

### Card Description (P)
- font-size: 14px
- font-weight: 400
- line-height: 20px
- color: rgb(138, 143, 152)

### Card Content

**Card 1: "Built for purpose"**
- Title: "Built for purpose"
- Description: "Linear is shaped by the practices and principles of world-class product teams."
- Illustration: Isometric wireframe cube (single flat layered square shape) — draw as SVG outline

**Card 2: "Powered by AI agents"**
- Title: "Powered by AI agents"
- Description: "Designed for workflows shared by humans and agents. From drafting PRDs to pushing PRs."
- Illustration: Isometric 3D cube cluster (3 cubes arranged in a stepped formation) — draw as SVG outline

**Card 3: "Designed for speed"**
- Title: "Designed for speed"
- Description: "Reduces noise and restores momentum to help teams ship with high velocity and focus."
- Illustration: Isometric stack of layered sheets/cards — draw as SVG outline

### Illustration SVG Style
- stroke: rgba(255, 255, 255, 0.2) (very subtle white wireframe)
- fill: rgba(255, 255, 255, 0.03)
- stroke-width: 1

## Responsive Behavior
- **Desktop (1440px):** 3-column grid as described
- **Tablet (768px):** May reduce to 2-column
- **Mobile (390px):** Single column, illustrations stack above text

## Assets
None (illustrations are SVG, logos are text-based SVGs)
