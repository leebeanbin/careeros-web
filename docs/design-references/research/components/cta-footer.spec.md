# CTA Section + Footer Specification

## Overview
- **Target files:**
  - `src/components/CtaSection.tsx`
  - `src/components/Footer.tsx`
- **Screenshots:** scroll y=9800 (bottom of page)
- **Interaction model:** static

---

## 1. CtaSection

### DOM Structure
Full-width centered section with:
1. Large heading
2. Two buttons side by side

### Computed Styles

#### Section Container
- background-color: rgb(8, 9, 10)
- padding: 120px 64px
- text-align: center
- display: flex
- flex-direction: column
- align-items: center

#### H2 — "Built for the future. Available today."
- font-size: 72px (larger than typical H2)
- font-weight: 510
- line-height: 76px
- letter-spacing: -1.44px
- color: rgb(247, 248, 248)
- margin-bottom: 40px
- max-width: 700px
- text-align: center

#### Buttons Container
- display: flex
- align-items: center
- gap: 12px

#### "Get started" Button (Primary)
- background-color: rgb(229, 229, 230)
- color: rgb(8, 9, 10)
- font-size: 16px
- font-weight: 510
- padding: 12px 20px
- border-radius: 9999px
- border: 1px solid rgb(229, 229, 230)
- height: 44px
- cursor: pointer
- text-decoration: none

#### "Contact sales" Button (Ghost)
- background-color: rgba(255, 255, 255, 0.05)
- color: rgb(247, 248, 248)
- font-size: 16px
- font-weight: 510
- padding: 12px 20px
- border-radius: 9999px
- border: 1px solid rgba(255, 255, 255, 0.1)
- height: 44px
- cursor: pointer
- text-decoration: none

### Text Content (verbatim)
- H2: "Built for the future. Available today."
- Button 1: "Get started"
- Button 2: "Contact sales"

---

## 2. Footer

### DOM Structure
Dark footer section with:
1. Border-top separator
2. Main footer area:
   - Left: Linear logo icon (small)
   - Right: 5 columns of links (Product, Features, Company, Resources, Connect)
3. Bottom row: Privacy, Terms, DPA, AUP links (small, muted)

### Computed Styles

#### Footer Container
- background-color: rgb(8, 9, 10)
- border-top: 1px solid rgba(255, 255, 255, 0.08)
- padding: 48px 64px 32px

#### Main Grid
- display: grid
- grid-template-columns: 120px repeat(5, 1fr)
- gap: 0 40px
- align-items: start
- margin-bottom: 48px

#### Logo Area
- LinearIcon (circular icon only, no wordmark): 24px × 24px
- color: rgb(247, 248, 248)
- opacity: 0.8

#### Column Header (H3)
- font-size: 13px
- font-weight: 510
- color: rgb(247, 248, 248)
- margin-bottom: 16px
- text-transform: none

#### Column Link (A)
- font-size: 13px
- font-weight: 400
- color: rgb(138, 143, 152)
- text-decoration: none
- display: block
- margin-bottom: 12px
- transition: color 0.15s ease
- hover: color: rgb(247, 248, 248)

#### Bottom Legal Row
- display: flex
- align-items: center
- gap: 20px
- padding-top: 24px
- border-top: 1px solid rgba(255, 255, 255, 0.06)

#### Legal Link
- font-size: 12px
- color: rgb(138, 143, 152)
- text-decoration: none
- hover: color: rgb(247, 248, 248)

### Content (verbatim)

**Product column:**
Intake, Plan, Build, Diffs, Monitor, Pricing, Security

**Features column:**
Asks, Agents, Coding Sessions, Customer Requests, Insights, Mobile, Integrations, Changelog

**Company column:**
About, Customers, Careers, Blog, Method, Quality, Brand

**Resources column:**
Switch, Download, Documentation, Developers, Status, Enterprise, Startups

**Connect column:**
Contact us, Community, X (Twitter), GitHub, YouTube

**Legal row:**
Privacy, Terms, DPA, AUP

## Responsive Behavior
- **Desktop (1440px):** 6-column footer grid as described
- **Tablet (768px):** May reduce to 3-column
- **Mobile (390px):** 2-column or single column stacked

## Assets
- Logo: Use `LinearIcon` from `src/components/icons.tsx`
