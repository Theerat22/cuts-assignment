---
target: src/app/page.tsx
total_score: 24
p0_count: 0
p1_count: 3
timestamp: 2026-06-24T14-53-59Z
slug: src-app-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Status badges and deadline warnings clear; loading/async states not surfaced |
| 2 | Match System / Real World | 3 | Thai copy throughout natural; "portal" concept unexplained |
| 3 | User Control and Freedom | 3 | Filter clear and modal cancel present; no undo on status changes |
| 4 | Consistency and Standards | 3 | Component system cohesive; rounded-lg buttons vs rounded-2xl cards mismatch |
| 5 | Error Prevention | 2 | Status changes immediate with no confirmation or undo |
| 6 | Recognition Rather Than Recall | 3 | Status filters discoverable; filter pills hidden behind one tap |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcuts, no bulk actions, one-at-a-time status changes only |
| 8 | Aesthetic and Minimalist Design | 2 | StatsBar duplicates filter-pill counts; card info density creates visual noise |
| 9 | Error Recovery | 2 | Toast library present but no inline form errors; status revert not possible |
| 10 | Help and Documentation | 1 | No contextual help, no tooltips, no onboarding for new team members |
| **Total** | | **24/40** | Acceptable — significant improvements needed |

## Anti-Patterns Verdict

YES — reads as AI-generated. Three compound tells: (1) indigo→purple gradient on every avatar/logo (the most-identified AI palette signal of 2025-26), (2) hero-metric StatsBar (4 identical number+label+icon cards), (3) identical card grid with 4px status stripe that reads as neither accent nor border.

Deterministic scan: 5 findings — ai-color-palette ×3, gray-on-color ×2. All confirmed, no false positives.

## Priority Issues

[P1] AI palette — indigo-600/purple-700 gradient on logo, avatars, list items. Fix: replace with single committed brand color, no gradient.
[P1] StatsBar hero-metric template — 4 identical stat cards duplicate filter pill counts. Fix: replace with horizontal pipeline tracker or remove.
[P1] Identical card grid — SpeakerCard h-1 status bar unreadable at glance. Fix: make status the dominant visual signal (solid left edge or card bg tint).
[P2] text-gray-500/gray-400 contrast failures on white — fails WCAG AA. Fix: use text-gray-600 minimum for body text.
[P2] Status filter UX — primary action hidden behind toggle. Fix: surface as persistent pill row.

## Minor Observations

- rounded-lg buttons vs rounded-2xl cards: inconsistent radius vocabulary
- border-gray-100 on cards against slate-50 bg is invisible — use gray-200 or remove
- Search placeholder copy has spacing issues
- Navbar "Speaker CRM" text is English in Thai-primary UI
- Motion stagger has no prefers-reduced-motion guard
