---
target: src/app/page.tsx (dashboard)
total_score: 23
p0_count: 2
p1_count: 2
timestamp: 2026-06-24T15-32-24Z
slug: src-app-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Status change produces no confirmation; add success is silent |
| 2 | Match System / Real World | 3 | "Calendar"/"Portal"/"Deadline" untranslated in Thai-primary tool |
| 3 | User Control and Freedom | 2 | X button is dual-purpose; no undo for status changes |
| 4 | Consistency and Standards | 2 | Raw `<input>` for search vs. Input component; mixed radius scale |
| 5 | Error Prevention | 2 | Submit-only validation; "ยกเลิก" unprotected in status row |
| 6 | Recognition Rather Than Recall | 3 | Filter counts visible; disabled-tab reason not explained |
| 7 | Flexibility and Efficiency | 2 | No sort, no bulk actions, filter hidden behind extra tap |
| 8 | Aesthetic and Minimalist Design | 3 | Controlled density; Portal feature-cards are documentation-as-UI |
| 9 | Error Recovery | 2 | No scroll-to-first-error; empty state lacks inline clear-filter |
| 10 | Help and Documentation | 2 | Only one tooltip; Input labels/IDs not associated |
| **Total** | | **23/40** | **Acceptable — significant improvements needed** |

---

## Anti-Patterns Verdict

**LLM assessment:** Does not immediately read as AI-generated — no gradient text, no glassmorphism, no numbered eyebrows, no hero-metric cards. However, trained eyes catch the fingerprints within 30 seconds:
- **Section-header pattern cloned verbatim** across AddSpeakerModal (×3) and SpeakerDetailModal edit mode (×3): same `w-6 h-6 rounded-lg bg-brand-muted` icon + `text-sm font-semibold text-gray-700` heading unit. Compositional tell — a human abstracts this on second use.
- **`bg-brand-dark` avatar treatment is undifferentiated.** Card avatar, list item avatar, assignee chip, modal header avatar — all identical. No hierarchy between subject (speaker) and actor (assignee).
- **`rounded-2xl` monoculture.** Every container — cards, modals, pills, header icons, empty state — uses `rounded-2xl` or `rounded-xl`. No radius vocabulary whatsoever.
- **StatsBar is a hero-metric row in thin disguise.** Five colored dots + counts + `›` separators = structurally identical to the anti-pattern, just horizontally arranged.
- **`backdrop-blur-xl` on the navbar** — the glassmorphism reflex applied to every sticky header.

**Deterministic scan:** Detector returned 0 findings. No coded anti-patterns in the markup/style tree. The remaining tells live in compositional sameness and interaction patterns, not in the raw tokens.

---

## Overall Impression

The palette and Thai copy are genuinely strong — better than average AI output in both dimensions. The foundation is solid. The critical gap is **interaction craft**: the highest-stakes moment in the entire workflow (advancing a speaker through the pipeline) produces zero feedback, while the most frequent navigation act (filtering by status) costs an unnecessary extra click. The design is aesthetically calm but operationally inert.

---

## What's Working

**1. Thai copy is genuinely considered.** Status labels (`รอดำเนินการ`, `ติดต่อแล้ว`, `ยืนยันแล้ว`) are natural Thai, not transliteration. Pipeline order in StatsBar matches the team's mental model. Placeholder text in AddSpeakerModal (`เช่น ดร.สมชาย ใจดี`) is locally appropriate and concrete.

**2. Deadline urgency is surfaced at the card level.** `isDeadlineNear` / `isDeadlinePassed` logic with orange/red color-coding directly on cards lets the team scan the grid and see who is critical without opening modals. Directly serves "zero missed deadlines."

**3. Accessibility groundwork is present.** `prefers-reduced-motion` override in `globals.css` is correct. `focus:ring-2 focus:ring-brand-dark focus:ring-offset-2` pattern in Button and Input is consistent. These are genuine commitments.

---

## Priority Issues

### [P0] Status change has zero feedback and no persistence signal

**`SpeakerDetailModal.tsx` lines 194–207, `page.tsx` lines 56–63.**

The highest-frequency, highest-stakes action in the product — advancing a speaker through the pipeline — produces no visual confirmation, no success state, and no indication the change persisted. The status pill is tapped; it silently toggles. When this connects to a real backend, the user will have no way to know if the save succeeded or failed.

**Why it matters:** The peak moment in the emotional journey is completely flat. A team member advancing a speaker to "ยืนยันแล้ว" deserves at minimum a brief confirmation. Silent state changes breed doubt.

**Fix:** Optimistic update pattern — on click, immediately show active pill + inline "บันทึกแล้ว" micro-confirmation (500ms fade-out). On network failure, revert with an error toast. Even client-only: animate the transition.

**Suggested command:** `/impeccable delight` (add a success moment) + `/impeccable harden` (add error recovery)

---

### [P0] The X button is dual-purpose with no visual distinction

**`SpeakerDetailModal.tsx` lines 181–186.** `onClick={isEditing ? handleCancelEdit : onClose}`

Same icon, same position, two opposite behaviors depending on a mode the user may not be tracking. In edit mode it discards unsaved changes; in view mode it closes the modal. A user who edits, then taps X expecting to close the modal, loses their work and stays in view mode. No label, no visual change between modes.

**Why it matters:** P0 because it causes silent data loss. Users will lose edits without understanding why the modal didn't close.

**Fix:** In edit mode, remove the X entirely. Use only "บันทึก" (Save) and "ยกเลิก" (Cancel) buttons at the bottom of the form — the current approach — and make "ยกเลิก" the escape hatch. The header X should close the modal exclusively.

**Suggested command:** `/impeccable harden`

---

### [P1] Filter is hidden behind an extra tap; no sort control

**`page.tsx` lines 144–153 (`showFilters` toggle), lines 156–189 (status pills).**

"Status is the product" (PRODUCT.md, Principle 1). Yet filtering by status requires two taps: click ตัวกรอง → click the status pill. The filter panel is hidden by default. Additionally, there is no sort — the team cannot see speakers ordered by seminar date (who presents soonest), by deadline (who is most overdue), or by name.

**Why it matters:** The most-used navigation act in an operational tool is penalized by an extra click on every use. For นุช running an event with 20 speakers, this is 20+ unnecessary interactions per day.

**Fix:** Make the status filter pills persistent (always visible beneath the search bar; remove the toggle). Add a sort dropdown: by seminar date, by deadline, by name.

**Suggested command:** `/impeccable layout`

---

### [P1] "ยกเลิก" status is unprotected from accidental activation

**`SpeakerDetailModal.tsx` lines 194–207.**

"ยกเลิก" (Cancelled) sits in the same button row as "ยืนยันแล้ว" and "เสร็จสิ้น" with identical visual weight. Cancelling a speaker is an irreversible, high-consequence action. One misclick ends the relationship with no confirmation, no undo.

**Why it matters:** Under deadline pressure — exactly when นุช is working fastest — a single misclick causes real damage. There is no recovery path visible in the UI.

**Fix:** Visually separate "ยกเลิก" from the forward-flow statuses. Move it outside the pill row (e.g., a discrete "ยกเลิกการเชิญ" link in red at the bottom of the modal's overview section). Gate it behind a confirmation dialog: "ยืนยันการยกเลิกวิทยากร [ชื่อ]?"

**Suggested command:** `/impeccable harden`

---

### [P2] Validation is submit-only with no focus management on error

**`AddSpeakerModal.tsx` lines 33–43, `SpeakerDetailModal.tsx` lines 106–116.**

Both modals validate only on submit. When errors appear, no field is focused and no scroll occurs. Because the modal has a fixed scroll container, error fields may be off-screen. The user must visually scan 10 fields to find what failed.

**Why it matters:** Submit-time-only validation is a frustration spike at the moment of highest effort investment. A user who fills the form carefully and hits submit should not have to hunt for errors.

**Fix:** Add `onBlur` validation per field. On submit failure, call `.focus()` on the first errored input. Scroll the modal container to bring the error into view.

**Suggested command:** `/impeccable harden`

---

## Persona Red Flags

### Alex (Power User)

- No keyboard shortcuts anywhere. Alex opens 15 speaker modals per day; all require mouse clicks.
- No bulk status change. Cannot advance a group of confirmed speakers simultaneously.
- No sort. Cannot see "who presents soonest" without manually scanning all cards.
- No inline status change from card — must open modal for every status update.

### Sam (Accessibility-Dependent)

- View-mode toggle buttons (`page.tsx` lines 131–142) are icon-only with no `aria-label`. Screen readers announce nothing useful.
- `Input.tsx` lines 14–38: `<label>` has no `htmlFor` and `<input>` has no `id`. Labels and inputs are not programmatically associated — WCAG 2.1 AA failure (1.3.1).
- `Select` component has the same label/ID association defect.
- Status selector pills in modal (`SpeakerDetailModal.tsx` lines 194–207) have no `aria-pressed` or `aria-current`. Screen readers cannot determine which status is active.
- Status filter pill count badges (`bg-gray-100 text-gray-600`): ~4.1:1 contrast ratio. Below the 4.5:1 WCAG AA threshold for normal-sized text.

### นุช (Activity Team, Thai-speaking, 20+ speakers per event, deadline pressure)

- There is no "ยังไม่ส่ง Agenda" cross-filter. Finding overdue speakers requires visual scanning of the entire grid.
- Email → Status update flow for six overdue speakers requires 30+ clicks minimum with no chaining.
- A misclick on status (wrong speaker, wrong status) has no undo — previous status is not stored or displayed anywhere in the UI.
- `text-xs` metadata (12px Thai) on cards becomes harder to distinguish when names are long and truncated under deadline-scan conditions.

---

## Minor Observations

- `backdrop-blur-xl` on the navbar (`page.tsx` line 73) is the glassmorphism reflex — serves no purpose on `bg-slate-50`. Remove.
- `SpeakerDetailModal.tsx` line 249: both "เวลา" and "Deadline Agenda" use the `Clock` icon. Two different concepts, same icon. Use `AlarmClock` or `CalendarX` for the deadline row.
- `AddSpeakerModal.tsx` line 58: `await new Promise((r) => setTimeout(r, 800))` — hardcoded fake delay in production code path. Will ship if not removed.
- The StatsBar lacks `role="status"` or an accessible label — reads as decorative to screen readers.
- Portal tab content (`SpeakerDetailModal.tsx` lines 441–472) is marketing copy ("ระบบสร้างหน้าเว็บส่วนตัว...") inside an operational tool. Replace with current-state information: last portal activity, upload status, open tickets.
- `ChevronRight` on `SpeakerCard` is decorative noise implying page navigation, not a modal open.
- Stagger delay of `i * 0.04s` on 20+ cards means the last card appears ~800ms late.

---

## Questions to Consider

1. **If status is the product, why is it the smallest element on the card?** The status badge is a 12px pill below the name. What if status were the first, largest, most visually dominant element — and the name were secondary?

2. **Does the modal pattern serve the user, or the developer?** Every action goes through a modal. Would a split-pane layout — list left, detail right — dramatically reduce click depth for the daily power-user path?

3. **What does the system look like at 200 speakers?** No pagination, no virtualization, no grouped views. At what number does the current model break down — and is it smaller than the real-world dataset?
