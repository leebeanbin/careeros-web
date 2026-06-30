# CareerOS Interaction Patterns

## Agent Page Pattern

Use this order for assistant-led pages:

1. `AgentIntro`: what the agent is reading and what it will produce.
2. `AgentStatusStrip`: compact current-state summary.
3. Primary workflow: rows, panels, analysis, or form.
4. Empty/error/loading states close to the affected area.

## Controls

- Filters, group controls, and display controls must update URL params or local state.
- Inert controls are not allowed. If a feature is unavailable, disable the control or remove it.
- Buttons use variants: `primary`, `secondary`, `ghost`, `danger`, `success`, `muted`.
- Muted cobalt is limited to focus/primary/saved/selected states; ordinary analysis UI should stay neutral.

## Lists

- Prefer row lists for jobs, matches, notifications, users, and admin logs.
- Rows use `rgba(255,255,255,0.03)` hover and `rgba(255,255,255,0.04)` dividers.
- Empty states must say what is missing and what action is available next.

## AI Analysis

Analysis views should not only show generic cards. Use this structure:

- Core judgment
- Evidence
- Risk signal
- Priority
- Next action

Resume layout reviews should point to concrete resume areas: header, summary, experience, impact metrics, tech stack, and projects.
