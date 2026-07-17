# Phase 6.5C — Organizer Dashboard Redesign
## Implementation Prompt: Command Center Dark UI transformation

> **Context**: This phase builds upon Phase 6.5A (primitives) and Phase 6.5B (unified shell/layout). The dark system tokens, layout wrapper, and Next.js shell are in place. Now, you will transform the organizer dashboard into a high-fidelity, premium dark-themed Command Center.

---

## Objective

Redesign the organizer dashboard page and its primary sub-components from standard, light-themed layouts to a cohesive, dark-themed command center. Add a live KPI metrics section, upgrade the AI analysis representation, enhance the recommendation display, and implement polished empty and loading states.

---

## Design Goals

| Goal | Rule |
|------|------|
| **Deep Dark Aesthetic** | Eliminate all traces of light background classes (`bg-white`, `bg-gray-50`, `bg-slate-50`) in favor of design tokens (`bg-[var(--bg-base)]`, `bg-[var(--bg-elevated)]`, `bg-[var(--bg-surface)]`). |
| **KPI Metrics Dashboard** | Display key indicators using premium Card components with Lucide icons and support dynamic updates from uploaded data. |
| **Integrated AI Summary** | Elevate the generic AI summary box into a feature card featuring a cyan accent line, a visual progress bar indicating AI confidence, and monospace ID strings. |
| **Actionable Recommendations** | Display the AI reasoning inline rather than collapsed behind `<details>`, and color-code the cards' left borders semantically to indicate risk levels. |
| **Engaging Loading & Demo UX** | Animate the upload processing state with a pulsing skeleton loader and provide a "Use Sample Data" helper to load demo data instantly. |

---

## Existing Files to Modify

### 1. `frontend/src/app/organizer/page.tsx`
- Replace plain layout structures with the dark theme token system.
- Integrate the new **KPI Section** immediately below the page header.
- Replace the legacy `<div className="bg-blue-50 ...">` AI Summary box with a custom AI Analysis summary card using the `Card` component (accent variant).
- Update the Empty State display (pre-upload) to a dark dashboard layout with a "Use Sample Data" quick-fill button.
- Make sure standard elements (like the upload form container and page columns) align with the dark aesthetic.

### 2. `frontend/src/components/RecommendationCard.tsx`
- Refactor to match the dark aesthetic using `var(--bg-elevated)` as the default background.
- Change the left border styling: instead of a static indigo border, dynamically apply semantic colors matching the recommendation type or severity (e.g., Critical/Congestion = Red, Bottleneck = Orange, Gate = Green, Volunteer = Purple).
- Display the `reasoning` text directly below the title/items (remove the `<details>` dropdown) so organizers can see the AI's logic at a glance.
- Import and use the Phase A UI primitives (`Badge`, `Card`, etc.) where appropriate.

### 3. `frontend/src/components/DataUploadForm.tsx`
- Redesign the container to use `bg-[var(--bg-elevated)]` and `border-[var(--bg-border)]`.
- Restyle the drag-and-drop area to use dark tokens, replacing light slate colors with `bg-[var(--bg-surface)]` and `border-[var(--bg-border)]`.
- Restyle the preview data table with dark-themed headings, rows, and borders.
- Replace the plain `Running Gemini AI Analysis...` loading message with a high-quality loading container showing:
  - The UI `Spinner` (accent color).
  - A prominent "Gemini is analyzing crowd data..." header.
  - Three cycling loading dots or a subtle shimmer.
  - A short sub-text description describing the ongoing AI operation.

---

## New Files to Create
- None. This phase is dedicated strictly to redesigning and upgrading the existing dashboard layout files and components.

---

## Components Affected
- `OrganizerDashboard` (`app/organizer/page.tsx`)
- `DataUploadForm` (`components/DataUploadForm.tsx`)
- `RecommendationCard` (`components/RecommendationCard.tsx`)

---

## Constraints

1. **Strict Dark Mode**: No hardcoded hex values or standard Tailwind grey/white utility classes (`bg-white`, `bg-slate-100`, `text-slate-800`, `border-gray-200`) should remain in the modified files.
2. **Typography Consistency**: Ensure headers use `var(--font-inter)` and metrics/IDs use `var(--font-mono)`.
3. **Pydantic/API Contract**: Do not alter the structure of `AnalysisResult` or the backend API payload. All new dashboard items must work with the existing data contracts in `frontend/src/types/index.ts`.
4. **Interactive States**: Interactive elements (like buttons, dropdowns, and file upload zones) must show active hover states (`hover:bg-[var(--bg-surface)]`, focus rings, etc.).

---

## Acceptance Criteria

### KPI Metrics
- [ ] Render 4 KPI cards: "Total Crowd", "Active Gates", "Volunteers On Duty", and "AI Confidence".
- [ ] KPI cards use the primitive `Card` component.
- [ ] KPI metrics populate with mock constants initially (`92,450`, `12 of 14`, `24`, `92%`), but update dynamically when a CSV is successfully analyzed (e.g. "Total Crowd" updates to the sum of counts, "Active Gates" updates based on recommendations).

### AI Summary Card
- [ ] Replace the light-blue container with an AI analysis card using `Card` with `accent` variant (cyan accent color).
- [ ] Include an inline `ProgressBar` mapping to the AI confidence score.
- [ ] Render the summary text, monospace Analysis ID, and a timestamp showing "Generated X minutes ago".

### Recommendation Cards
- [ ] Use `bg-[var(--bg-elevated)]` and appropriate dark borders.
- [ ] Apply semantic left borders: Red (`var(--risk-critical)`) for Congestion, Orange (`var(--risk-high)`) for Bottlenecks, Green (`var(--risk-safe)`) for Gates, and Purple (`var(--accent-500)`) for Volunteers.
- [ ] Render AI reasoning inline (remove `<details>` and `<summary>` wrappers).

### Empty State & Demo CSV Loading
- [ ] Render a centered Empty State card with Lucide `BarChart2` (40px, text-tertiary).
- [ ] Include a prominent "Use Sample Data" button.
- [ ] Clicking "Use Sample Data" automatically parses a static mock CSV string representing standard gate data (e.g. Gate A, B, C, D counts) and triggers the analysis API request without requiring a file upload.

### Loading Animation
- [ ] Replace simple text loading with a structured container.
- [ ] Display the Phase A `Spinner` styled with the `accent` color.
- [ ] Present status updates (e.g. "Ingesting CSV...", "Running Gemini Predictive Models...", "Optimizing gate routes...").

---

## Verification Checklist

- [ ] Run `npm run dev` and navigate to `/organizer`.
- [ ] Verify the page is fully dark, displaying the 4 KPI cards and the redesigned Empty State.
- [ ] Click "Use Sample Data". Confirm that the loading state triggers with the spinner, dot animations, and shifting status text.
- [ ] Verify that the mock data finishes analyzing and correctly updates the KPI metrics (e.g., Total Crowd increases, confidence changes).
- [ ] Verify that the AI Summary Card is rendered with a cyan left border and displays a progress bar.
- [ ] Verify that the 4 recommendation cards have semantic borders (Red, Orange, Green, Purple) and display reasoning text inline.
- [ ] Run `npm run type-check` to verify zero TypeScript errors.

---

## Rollback Plan

**Create a Git checkpoint before starting:**
```bash
git add -A && git commit -m "chore: checkpoint before Phase 6.5C dashboard redesign"
```

**If rollback is required:**
```bash
git reset --hard HEAD
```

---

## Gemini / AntiGravity Implementation Prompt

> Copy everything below this line and use it as the implementation instruction.

---

### TASK: Phase 6.5C — Organizer Dashboard Redesign

You are implementing Phase 6.5C of the Stadium Operations AI Dashboard.
The design tokens, global styles, and UI primitives (Button, Badge, Card, Spinner, ProgressBar, etc.) are already fully integrated.

Transform the organizer dashboard into a high-fidelity, premium dark command center.

**STEP 1: Refactor `RecommendationCard.tsx`**
1. Modify `frontend/src/components/RecommendationCard.tsx` to:
   - Use the `Card` component from `@/components/ui` as the base wrapper. Set its variant to `default` or `accent`.
   - Dynamic left border color based on the title or type of recommendation:
     - "Congestion Alerts" -> `border-l-[var(--risk-critical)]`
     - "Predicted Bottlenecks" -> `border-l-[var(--risk-medium)]`
     - "Gate Recommendations" -> `border-l-[var(--risk-safe)]`
     - "Volunteer Actions" -> `border-l-[var(--accent-500)]`
   - Render the `reasoning` string directly inside the card below the item list (remove the `<details>` / `<summary>` tags). Make sure it has a subtle prefix like "AI Reasoning: " in an italic, secondary/tertiary text style.
   - Restyle all elements inside using dark token colors (`text-[var(--text-secondary)]`, etc.).

**STEP 2: Refactor `DataUploadForm.tsx`**
1. Add `"use client";` if not present.
2. Update the container to use `Card` wrapper (`bg-[var(--bg-elevated)]` and `border-[var(--bg-border)]`).
3. Update the drag-and-drop zone class names to replace light slates with dark tokens:
   - Base style: `bg-[var(--bg-surface)] border-[var(--bg-border)] border-2 border-dashed rounded-xl p-6 text-center hover:border-[var(--primary-400)] hover:bg-[var(--bg-elevated)] transition-colors`
   - Use Lucide icons: Replace `📥` with `UploadCloud` (or `ArrowUpToLine`) from `lucide-react`.
4. Update the preview table to be dark-themed:
   - Table headers: `bg-[var(--bg-surface)] text-[var(--text-tertiary)] border-[var(--bg-border)]`
   - Rows: `hover:bg-[var(--bg-surface)]/50 border-[var(--bg-border)] text-[var(--text-secondary)]`
5. Enhance the loading/processing state:
   - When `loading` is true, render a dedicated container centered inside the card.
   - Render `<Spinner color="accent" size="lg" className="mb-4" />`.
   - Render `<h3 className="font-semibold text-sm text-[var(--text-primary)]">Gemini is analyzing your data...</h3>`.
   - Render a cycling status sub-text (e.g. "Ingesting CSV...", "Running Gemini Predictive Models...", "Formulating route recommendations...") or a simple descriptive sub-headline.
6. Integrate a "Use Sample Data" action:
   - Next to (or above) the main submission button, add a secondary button `<Button variant="secondary" onClick={handleUseSampleData} disabled={loading}>Use Sample Data</Button>`.
   - In `handleUseSampleData`, simulate papa-parsing a static CSV string (e.g., Gate1, 1500, Gate2, 800, etc.), populate the parsed rows, and trigger the submission API call immediately.
   - Use this static CSV content:
     ```
     gateId,count,timestamp
     Gate A,1850,2026-07-17T16:00:00Z
     Gate B,2900,2026-07-17T16:00:00Z
     Gate C,950,2026-07-17T16:00:00Z
     Gate D,4100,2026-07-17T16:00:00Z
     ```

**STEP 3: Refactor Organizer Dashboard Page (`app/organizer/page.tsx`)**
1. Refactor the wrapper structure:
   - Set the main background to `bg-[var(--bg-base)] text-[var(--text-secondary)]`.
2. Implement the **KPI Metrics Section**:
   - Add a 4-column grid above the layout columns.
   - Render 4 cards using `<Card variant="default" padding="sm">`:
     1. **Total Crowd**: Value is `92,450` default. Icon: `Users`.
     2. **Active Gates**: Value is `12 of 14` default. Icon: `DoorOpen` (or `Grid`).
     3. **Volunteers On Duty**: Value is `24` default. Icon: `UserCheck`.
     4. **AI Confidence**: Value is `92%` default. Icon: `Brain` (or `Sparkles`).
   - If `analysisResult` is loaded:
     - Sum the crowd counts in `parsedRows` (if available in state) or set dynamically based on the uploaded data to update the "Total Crowd" metric.
     - Set "AI Confidence" to `(analysisResult.confidence * 100).toFixed(0) + '%'`.
3. Redesign the **AI Summary Section**:
   - Instead of the simple blue box, use `<Card variant="accent" accentColor="var(--accent-400)">`.
   - Inside, render a title "AI Analysis Engine", the confidence score represented by `<ProgressBar value={analysisResult.confidence * 100} color="accent" className="my-3" />`, the `analysisResult.aiSummary` text, and a monospace string at the bottom: `Analysis ID: {analysisResult.analysisId} • Generated just now`.
4. Update the **Empty State**:
   - Replace the generic empty state box with a designed card matching `var(--bg-elevated)`.
   - Use Lucide `BarChart2` (40px, text-[var(--text-tertiary)]).
   - Show title "Command Center Offline" and subtitle "Upload crowd metrics or use simulated sample data to activate AI command recommendations."
   - Render the "Use Sample Data" button centrally in the empty state as well.

**STEP 4: Clean Up & Verify**
1. Remove all old references to inline colors and light layouts.
2. Run `npm run type-check` to verify code correctness.
