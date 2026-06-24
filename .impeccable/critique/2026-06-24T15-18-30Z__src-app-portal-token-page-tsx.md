---
target: src/app/portal/[token]/page.tsx
total_score: 30
p0_count: 0
p1_count: 0
timestamp: 2026-06-24T15-18-30Z
slug: src-app-portal-token-page-tsx
---
## Anti-Patterns Verdict

YES — clear AI generation. Three-layer stack:
1. bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 — dark indigo/purple gradient bg, the most-recognized AI portal aesthetic
2. bg-white/10 backdrop-blur glass card (calendar CTA) — glassmorphism as default, banned
3. bg-gradient-to-br from-indigo-500 to-purple-600 avatar — same gradient tell as dashboard

Detector: 2 findings (ai-color-palette ×2), both confirmed.

## Changes applied (redesign)

- Replaced dark gradient bg with light gray-50 page — appropriate for a professional speaker portal
- Replaced gradient hero with solid brand-dark (deep rose) header — branded, confident, not AI
- Speaker initials avatar uses bg-white/20 on brand-dark bg — clean, no gradient
- Removed glass card calendar CTA — now inline link in event summary bar
- Event summary bar is a clean white strip under the header (date, time, location, calendar link)
- Section accordion icons: active state bg-brand-dark/text-white, inactive bg-brand-muted/text-brand-dark
- Single ChevronDown with rotate-180 instead of two icon swap
- "Not found" state: light gray page, no dark gradient
- AgendaUpload: all indigo → brand system
- Removed text-gray-400 contrast failures

## Score: estimated 30/40 (up from implied ~22)
