# Phase 6.5D — Operations Map Redesign
## Implementation Prompt: Command Center Map UI

> **Context**: This phase builds upon Phase 6.5A (foundation), 6.5B (navigation/layout), and 6.5C (organizer dashboard). You will now transform the Operations Control Center map page and its supporting dashboards into a professional command center experience.

---

## Objective

Redesign all map overlays, legends, sidebars, and control panels to use dark-themed tokens, incorporate glassmorphism, and replace standard inputs/emojis with premium custom controls and Lucide icons.

---

## Design Goals

| Goal | Rule |
|------|------|
| **Unified Command Map** | The map's control panels (Decision Center, Layer Controls, and Activity Feed) must utilize `var(--bg-elevated)` or `var(--bg-surface)` backgrounds with `var(--bg-border)` borders. |
| **Glassmorphism Legend** | Re-engineer the floating map legend as a dark glass container (`backdrop-blur-xl`, `bg-[var(--glass-bg)]`, `border-[var(--glass-border)]`) positioned at the bottom-right of the viewport. |
| **Pulsing Risk Glows** | Apply subtle colored status ring animations or glows to active metrics depending on risk severity. |
| **Professional Controls** | Replace standard HTML checkboxes in Layer Controls with styled inputs and Lucide icons. |

---

## Existing Files to Modify

### 1. `frontend/src/components/map/DecisionCenter.tsx`
- Replace plain layout structures with dark theme token styles: `bg-[var(--bg-elevated)]`, `border-[var(--bg-border)]`, etc.
- Replace emojis with Lucide icons:
  - "🧠 AI Decision Center" -> `Brain` (accent colored)
  - "Current Risk" -> `ShieldAlert` or `AlertTriangle`
  - "Top Incident" -> `AlertCircle`
  - "Priority Gate" -> `DoorOpen`
  - "AI Confidence" -> `Sparkles` or `BrainCircuit`
  - "Required Volunteers" -> `Users`
  - "Medical Teams" -> `Activity`
  - "Security Teams" -> `Shield`
- Add a visual `ProgressBar` representing the `confidenceScore` directly under the "AI Confidence" metric or inside the metric block, with a subtle glow shadow effect.
- Style list items and layout grids to use the design token fonts and borders.

### 2. `frontend/src/components/map/AIActivityFeed.tsx`
- Redesign the container to use `bg-[var(--bg-elevated)]`, `border-[var(--bg-border)]`, and dark scrollbars.
- Replace emojis with Lucide icons (e.g., `Activity` or `Zap` for the feed header).
- Revise the feed row designs:
  - Use a vertical left-border indicator utilizing semantic status colors: `critical` -> `var(--risk-critical)`, `warning` -> `var(--risk-medium)`, `success` -> `var(--risk-safe)`, default -> `var(--info-text)`.
  - Format timestamps in monospace (`font-mono`) and muted secondary colors.
  - Set backgrounds of rows to a subtle dark surface color (e.g., `bg-[var(--bg-surface)]/40`).
  - Add the `slide-in-left` entrance utility class to incoming feed items.

### 3. `frontend/src/components/map/Legend.tsx`
- Reposition to bottom-right of the map container (`bottom-6 right-6` instead of `bottom-6 left-6`).
- Change wrapper container to a glassmorphism style: `bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)]`.
- Restyle text to use dark theme secondary/tertiary colors.
- Use Lucide icons or small styled color dots (`w-3 h-3 rounded-full`) mapping to each key item.

### 4. `frontend/src/app/organizer/map/page.tsx`
- Wrap the page body in `<PageWrapper>` with `!p-0 h-full flex flex-col max-w-none` to fit the viewport layout.
- The sidebar wrapper containing `DecisionCenter` and `AIActivityFeed` must use `bg-[var(--bg-base)] border-r border-[var(--bg-border)]`.
- Redesign the **Map Layers** checkboxes panel:
  - Container background: `bg-[var(--bg-elevated)] border border-[var(--bg-border)]`.
  - Replace default checkboxes with a styled checkbox structure (e.g., custom border, transition-all colors on select).
  - Add Lucide icons beside each layer name (e.g., `DoorOpen` for Gates, `Users` for Volunteers, `AlertCircle` for Active Incidents).

---

## New Files to Create
- None.

---

## Constraints

1. **Keep Map Functionality**: Do not alter the Google Maps JS API loader, map markers, or interactive map features. Only modify the sidebar panel components, legend overlay, and layer controls.
2. **Pure Design Tokens**: Apply CSS variables for borders, text, and panel backgrounds. Avoid hardcoded hex colors.
3. **TypeScript Compliance**: Keep interfaces identical to preserve contract values between `MapView` and `MapDashboardPage`.

---

## Acceptance Criteria

### Decision Center Overlay
- [ ] Uses `bg-[var(--bg-elevated)]` and has Lucide icons instead of emojis.
- [ ] Displays the AI Confidence metric with a custom Progress Bar and a subtle cyan glow shadow.
- [ ] Resource deployment metrics are styled using theme tables/list borders.

### AI Activity Feed
- [ ] Render container with dark background, rounded borders, and custom styled scrollbars.
- [ ] Feed rows use semantic left border colors corresponding to their warning level.
- [ ] Timestamps are formatted in `font-mono`.

### Map Legend
- [ ] Floating legend is positioned in the bottom-right corner of the map viewport.
- [ ] Wrapper applies `backdrop-blur-xl` glass styles and looks premium.

### Layer Controls
- [ ] Layer control checkboxes are styled as custom dark-theme inputs (no standard blue browser controls).
- [ ] Lucide icons accompany each layer item.

---

## Verification Checklist

- [ ] Run `npm run dev` and navigate to `/organizer/map`.
- [ ] Verify that all panels on the left-side sidebar (Decision Center, Feed, Layers) are fully dark-themed.
- [ ] Verify that the floating legend is positioned on the bottom-right and has a blurry, glass background.
- [ ] Toggle checkboxes in the layer controls panel and verify that map layers turn on/off correctly.
- [ ] Run `npm run type-check` to confirm zero errors.

---

## Rollback Plan

**Create Git checkpoint:**
```bash
git add -A && git commit -m "chore: checkpoint before Phase 6.5D map redesign"
```

**If issues occur:**
```bash
git reset --hard HEAD
```

---

## Gemini / AntiGravity Implementation Prompt

> Copy everything below this line and use it as the implementation instruction.

---

### TASK: Phase 6.5D — Operations Map Redesign

You are implementing Phase 6.5D of the Stadium Operations AI Dashboard.
The design system foundation (tokens, variables, UI primitives) and navigation shells are already complete.

Your task is to redesign the Operations Control Center map interface.

**STEP 1: Refactor `DecisionCenter.tsx`**
1. Modify `frontend/src/components/map/DecisionCenter.tsx`:
   - Replace the wrapper with a dark panel: `bg-[var(--bg-elevated)] border border-[var(--bg-border)] rounded-xl p-5`.
   - Update header: Replace emoji with Lucide `Brain` (accent-400 color).
   - Use Lucide icons inside card grids:
     - Current Risk -> `AlertTriangle` (color mapped to currentRisk severity).
     - Top Incident -> `AlertCircle` (red/orange text).
     - Priority Gate -> `DoorOpen` (primary-400 text).
     - AI Confidence -> `Sparkles` (accent-400 text).
   - Integrate a visual progress bar below the AI Confidence metric using `<ProgressBar value={confidenceScore * 100} color="accent" size="sm" />` (import from `@/components/ui`).
   - Style grid blocks with `bg-[var(--bg-surface)] border border-[var(--bg-border)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors`.
   - Restyle the Resource Deployment Status list using theme border-bottom dividers (`border-[var(--bg-border)]`) and the font-mono values for metrics.

**STEP 2: Refactor `AIActivityFeed.tsx`**
1. Modify `frontend/src/components/map/AIActivityFeed.tsx`:
   - Wrapper: `bg-[var(--bg-elevated)] border border-[var(--bg-border)] rounded-xl p-5 mt-6 h-72 flex flex-col`.
   - Header: Lucide `Activity` (accent-400 color) + "AI Activity Feed" text.
   - Row layouts:
     - Map severity type to border-l colors:
       - `critical` -> `border-l-[var(--risk-critical)] text-[var(--risk-critical-text)] bg-[var(--risk-critical-bg)]`
       - `warning` -> `border-l-[var(--risk-high)] text-[var(--risk-high-text)] bg-[var(--risk-high-bg)]`
       - `success` -> `border-l-[var(--risk-safe)] text-[var(--risk-safe-text)] bg-[var(--risk-safe-bg)]`
       - Default -> `border-l-[var(--info-border)] text-[var(--info-text)] bg-[var(--info-bg)]`
     - Wrap rows with `p-3 rounded-r-xl border border-y border-r border-[var(--bg-border)] flex items-start gap-2.5 transition-colors`.
     - Timestamp class: `font-mono text-[10px] text-[var(--text-tertiary)] mt-0.5`.
     - Message class: `text-[var(--text-secondary)] font-medium`.

**STEP 3: Refactor `Legend.tsx`**
1. Modify `frontend/src/components/map/Legend.tsx`:
   - Change position classes: Replace `absolute bottom-6 left-6` with `absolute bottom-6 right-6`.
   - Wrapper styling: `bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] p-4 rounded-xl shadow-2xl text-xs z-10 w-44`.
   - Text styling: Change headers to `font-bold text-[var(--text-primary)] mb-2 border-b border-[var(--glass-border)] pb-1`.
   - Map keys: Clean up dot elements to match:
     - Safe Gate -> `bg-[var(--risk-safe)]`
     - Moderate Gate -> `bg-[var(--risk-medium)]`
     - Critical Gate -> `bg-[var(--risk-critical)]`
     - Volunteer -> `bg-[var(--primary-500)]`
     - Medical -> `bg-pink-500` (or `var(--risk-critical)`)
     - Security -> `bg-purple-500` (or `var(--accent-500)`)
     - Traffic -> `bg-orange-500`
   - Adjust typography and spacing so the legend is compact and sleek.

**STEP 4: Refactor Map Page (`app/organizer/map/page.tsx`)**
1. Modify `frontend/src/app/organizer/map/page.tsx`:
   - Replace wrapper elements with the unified `<PageWrapper className="!p-0 h-full flex flex-col max-w-none">`.
   - Sidebar wrapper: `w-[400px] bg-[var(--bg-base)] border-r border-[var(--bg-border)] p-6 overflow-y-auto z-10 flex flex-col gap-6`.
   - Redesign Map Layers panel:
     - Container wrapper: `bg-[var(--bg-elevated)] p-5 rounded-xl border border-[var(--bg-border)]`.
     - Title: `font-bold text-sm text-[var(--text-primary)] mb-3 border-b border-[var(--bg-border)] pb-1.5 flex items-center gap-1.5`. Use Lucide `Layers`.
     - Checklist items:
       - Use Lucide icons beside label names: `DoorOpen` for Gates, `Users` for Volunteers, `AlertCircle` for Active Incidents.
       - Custom checkboxes: Restyle checkboxes or use `<input type="checkbox" className="rounded bg-[var(--bg-surface)] border-[var(--bg-border)] text-[var(--primary-500)] focus:ring-[var(--primary-400)] cursor-pointer" />`.

**STEP 5: Clean Up & Verify**
1. Ensure all standard light background classes in the sidebar area are replaced with dark tokens.
2. Run `npm run type-check` to confirm zero compilation errors.
