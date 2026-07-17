# IMPLEMENTATION PHASES
## AI Stadium Operations Dashboard — Phase 6.5 Design Sprint
### Exact build order for transforming MVP → Premium Enterprise Product

---

## GUIDING PRINCIPLES

1. **Foundation first**: Design tokens and global CSS must be done before any component work
2. **Build bottom-up**: Primitives → Layouts → Pages — never the reverse
3. **One system**: Every change must use the token system, never ad-hoc values
4. **No regressions**: Each phase must leave the app in a working, demo-able state

---

## PHASE 6.5A — FOUNDATION
### Objective: Establish the unified dark design system

This is the most critical phase. All other phases depend on it.
If this is not done correctly, no other phase will look right.

**Estimated Effort**: 2-4 hours

---

#### Task A1: Install Design Tokens in globals.css
**File**: `frontend/src/app/globals.css`

Replace current globals.css entirely with the token-complete version from `DESIGN_TOKENS.md`.

Includes:
- Google Fonts import (Inter + JetBrains Mono)
- All CSS custom properties
- Base reset styles
- Keyframe animations
- Animation utility classes
- Scrollbar styling
- Focus styles

**Verification**: All CSS variables accessible in browser DevTools. Font loads from Google CDN.

---

#### Task A2: Update Tailwind Config
**File**: `frontend/tailwind.config.ts`

Add:
- Custom color extensions mapped to design tokens
- Font family extensions (Inter, JetBrains Mono)
- Border radius extensions (sm/md/lg/xl/2xl)
- Animation extensions (fade-in-up, shimmer, pulse-ring)
- `safelist` for dynamic class names (risk level colors)

**Verification**: `npx tailwindcss build` produces no warnings.

---

#### Task A3: Install Lucide Icons
**Command**: `npm install lucide-react`

**Verification**: `import { LayoutDashboard } from 'lucide-react'` works without error.

---

#### Task A4: Create Primitive UI Components
**Files**:
- `components/ui/Button.tsx` — from UI_COMPONENT_GUIDE.md spec
- `components/ui/Badge.tsx` — with all risk variants
- `components/ui/Card.tsx` — default, glass, accent variants
- `components/ui/Spinner.tsx` — primary, white, accent colors
- `components/ui/Skeleton.tsx` — with shimmer animation
- `components/ui/ProgressBar.tsx` — animated fill

**Verification**: Render each component in isolation, confirm visual matches spec.

---

#### Dependencies: None (this is the foundation)
#### Blocks: All subsequent phases

---

## PHASE 6.5B — NAVIGATION & LAYOUT
### Objective: Unified navigation shell across all organizer pages

**Estimated Effort**: 1-2 hours

---

#### Task B1: Replace OrganizerNav with OrganizerSidebar
**File**: Replace `components/OrganizerNav.tsx`

Key changes from current implementation:
- Width: 220px → 240px
- Background: `slate-900` → `var(--bg-surface)`
- Icons: emoji → Lucide icons (LayoutDashboard, Map, Zap, Users, Clock, Settings)
- Active state: bg-indigo-600 → `bg-primary-700/50 border-l-2 border-l-primary-400`
- Logo: emoji → styled text mark
- Add: SYSTEM STATUS section with live indicators
- Add: Timeline and Settings nav links

**Verification**: Navigate between all 4 organizer pages, active state correct on each.

---

#### Task B2: Create PageWrapper Component
**File**: `components/layout/PageWrapper.tsx`

Wraps page content with:
- `animate-fade-in-up` CSS animation on mount
- Consistent padding (`p-8`)
- Optional title + subtitle section
- Optional right-side actions slot

**Verification**: Page transition visible when navigating (brief fade-in-up from each page).

---

#### Task B3: Create VolunteerHeader Component
**File**: `components/layout/VolunteerHeader.tsx`

Mobile-first top bar with:
- Stadium icon + title
- Duty status badge (green "On Duty")
- Logout button

**Verification**: Renders correctly on 375px (iPhone SE) viewport.

---

#### Dependencies: Phase A complete
#### Blocks: Phases C, D, E, F

---

## PHASE 6.5C — ORGANIZER DASHBOARD REDESIGN
### Objective: Transform organizer dashboard from light/plain to dark enterprise command center

**Estimated Effort**: 3-5 hours

---

#### Task C1: Global Background — All Organizer Pages
**Files**: All organizer page files

Change:
- `bg-gray-50` → `bg-[var(--bg-base)]`
- `bg-white` → `bg-[var(--bg-elevated)]`
- All `text-gray-*` → `text-[var(--text-secondary)]`
- All `border-gray-*` → `border-[var(--bg-border)]`

**Verification**: App stays dark at 100% brightness. No white backgrounds visible.

---

#### Task C2: Add KPI Section to Dashboard
**File**: `frontend/src/app/organizer/page.tsx`

Add 4 KPI cards above the existing DataUploadForm area:

| KPI | Value | Icon |
|-----|-------|------|
| Total Crowd | 92,450 | Users |
| Active Gates | 12 of 14 | DoorOpen |
| Volunteers On Duty | 24 | UserCheck |
| AI Confidence | 92% | Brain |

Use mock values that update when `analysisResult` is available.

**Verification**: KPI cards visible immediately on dashboard load (before analysis).

---

#### Task C3: Redesign AI Summary Section
**File**: `frontend/src/app/organizer/page.tsx`

Replace current plain blue `bg-blue-50` box with full `AIAnalysisCard` component.
- Distinctive cyan left border
- Confidence score with ProgressBar
- Stats: count of each recommendation type
- Analysis ID in monospace
- "Generated X minutes ago" timestamp

**Verification**: AI analysis card matches design spec from DESIGN.md.

---

#### Task C4: Upgrade RecommendationCard Component
**File**: `components/RecommendationCard.tsx`

Make dark-themed:
- Background: `bg-[var(--bg-elevated)]`
- Left border: 3px, semantic color per variant
- Show AI reasoning (from `reasoning` field) inline, not collapsed
- Show confidence badge per item where available

**Verification**: All 4 recommendation types (congestion, bottleneck, gate, volunteer) display correctly with dark theme.

---

#### Task C5: Redesign Empty State
**File**: `frontend/src/app/organizer/page.tsx`

Replace current plain empty state with designed version:
- Lucide `BarChart2` icon (40px, muted)
- Dark background card
- Helpful description text
- "Use Sample Data" button (loads demo CSV automatically)

**Verification**: Empty state visible and styled before any upload.

---

#### Task C6: Add Gemini Processing Animation
**File**: `components/DataUploadForm.tsx` (existing)

During AI processing, show:
- Spinner (accent/cyan color)
- "Gemini is analyzing your data..." headline
- Three animated dots below
- Brief description of what's being analyzed

Replace current plain "Running Gemini AI Analysis..." text.

**Verification**: Animation visible during actual API call (requires backend running).

---

#### Dependencies: Phases A, B complete
#### Blocks: None (other phases parallel)

---

## PHASE 6.5D — OPERATIONS MAP REDESIGN
### Objective: Make map feel like a real command center, not a demo

**Estimated Effort**: 2-3 hours

---

#### Task D1: Dark Panel for Decision Center
**File**: `components/map/DecisionCenter.tsx`

Convert all white/light backgrounds to dark tokens.
Add:
- AI Confidence ProgressBar
- Lucide icons replacing emoji
- Subtle cyan glow on AI confidence meter

**Verification**: Decision Center readable on dark sidebar.

---

#### Task D2: Dark Panel for AI Activity Feed
**File**: `components/map/AIActivityFeed.tsx`

Convert to dark token system.
Add:
- Colored dot indicators per event type (matching semantic colors)
- Monospace timestamps
- `slideInLeft` animation for feed items

**Verification**: Feed visible and styled on map page.

---

#### Task D3: Layer Controls — Dark Styled
**File**: `frontend/src/app/organizer/map/page.tsx`

The checkbox controls panel needs:
- Dark background
- Lucide icon per layer toggle
- Styled checkbox (custom, not browser default)

**Verification**: Layer toggles functional and dark-themed.

---

#### Task D4: Map Legend — Floating Glass
**File**: `components/map/Legend.tsx`

Convert to glass card positioned bottom-right on the map:
- `backdrop-blur-xl`
- Dark glass background
- Compact, doesn't obstruct map

**Verification**: Legend visible over map tiles without blocking important areas.

---

#### Dependencies: Phases A, B complete
#### Blocks: None

---

## PHASE 6.5E — SCENARIO & ASSIGNMENTS REDESIGN
### Objective: Consistent dark theme on both AI feature pages

**Estimated Effort**: 2-3 hours

---

#### Task E1: Scenario Page — Dark Theme
**File**: `frontend/src/app/organizer/scenario/page.tsx`

- All backgrounds → dark tokens
- Scenario checkbox pills → dark `bg-elevated` with `primary-400` selected state
- Severity select → styled dark dropdown
- Results grid → dark cards with left-border per risk level
- Loading skeleton → dark shimmer

**Verification**: Full scenario run looks premium end-to-end.

---

#### Task E2: Assignments Page — Dark Theme
**File**: `frontend/src/app/organizer/assignments/page.tsx`

- All backgrounds → dark tokens
- Assignment cards → dark `bg-elevated`, semantic priority borders
- Resource summary → dark stats panel
- AI reasoning section → dark with cyan left-border

**Verification**: Assignment results display cleanly dark-themed.

---

#### Task E3: Priority Badge Consistency
**File**: `components/ui/Badge.tsx`

Ensure both pages use the shared `Badge` component for priority display, not inline classes.

**Verification**: Priority badges identical on both pages.

---

#### Dependencies: Phases A, B complete
#### Blocks: None

---

## PHASE 6.5F — VOLUNTEER PORTAL REDESIGN
### Objective: Full dark mobile-first volunteer experience

**Estimated Effort**: 2-3 hours

---

#### Task F1: Volunteer Dashboard — Dark Theme
**File**: `frontend/src/app/volunteer/page.tsx`

Key changes:
- Dark background throughout
- TaskCard component extracted with priority stripe (4px top border, semantic color)
- "Acknowledge" button in primary style
- On Duty badge in green/safe style

**Verification**: Renders well on 390px viewport (iPhone 14 size).

---

#### Task F2: Volunteer Incident Report Page
**File**: `frontend/src/app/volunteer/report/page.tsx` (NEW)

Two-field form per PRD requirement:
1. Location input (text, with Gate suggestions)
2. What's happening? textarea

Submit connects to backend `/api/v1/incidents/report` (or shows success state if backend unavailable).

Adds link to this page from volunteer dashboard header.

**Verification**: Form submits without errors. Success state appears.

---

#### Task F3: Volunteer Header Component
**File**: `components/layout/VolunteerHeader.tsx`

Renders on volunteer pages:
- FIFA branding
- Duty status badge
- Navigation to Report Incident
- Logout

**Verification**: Header consistent on both volunteer pages.

---

#### Dependencies: Phases A, B complete
#### Blocks: None

---

## PHASE 6.5G — NEW PAGES
### Objective: Add missing pages for product completeness

**Estimated Effort**: 2-3 hours

---

#### Task G1: Activity Timeline Page
**File**: `frontend/src/app/organizer/timeline/page.tsx` (NEW)

Displays mock audit trail of AI events. Static data is acceptable.

Timeline items:
- AI analysis completed events
- Volunteer assignments
- Scenario simulations
- Gate status changes
- Incident reports

Visual: Vertical timeline with left line, event dots in semantic colors, timestamps in monospace.

Add to sidebar nav: "Activity Timeline" with `Clock` icon.

**Verification**: Page renders with sidebar, timeline visible.

---

#### Task G2: Settings Page
**File**: `frontend/src/app/organizer/settings/page.tsx` (NEW)

Minimal settings page — purely for product credibility.

Sections:
1. Account Information (name, email, role — read only)
2. System Configuration (AI Model: "Gemini 2.0 Flash", Stadium: "MetLife Stadium, New Jersey" — read only)
3. Appearance (placeholder — Dark theme only — toggle disabled)

**Note**: Settings are display-only. No actual backend changes needed.

Add to sidebar nav: "Settings" with `Settings` icon.

**Verification**: Page renders and looks professional.

---

#### Dependencies: Phases A, B complete
#### Blocks: None

---

## PHASE 6.5H — FINAL POLISH
### Objective: The details that separate "good" from "excellent"

**Estimated Effort**: 2-4 hours

---

#### Task H1: Header Risk Badge Animation
All organizer pages: when risk level is CRITICAL or HIGH, the risk badge in the header should pulse.

---

#### Task H2: Toast Notification System
Create simple Toast provider in `layout.tsx`.

Volunteer acknowledge → success toast
AI analysis complete → ai-type toast with cyan styling
Error → error toast

---

#### Task H3: Skeleton States on All Cards
Every `RecommendationCard`, `KPICard`, and result section must show skeleton while loading.

---

#### Task H4: Demo Quick-Fill Enhancements
DataUploadForm: Add "Use Sample Data" button that auto-loads `docs/sample_crowd_data.csv` without requiring actual file selection.

Scenario page: Pre-select "Heavy Rain" + "Sudden Crowd Surge" as default selections.

---

#### Task H5: System Status in Sidebar
OrganizerSidebar: Add live status indicators at bottom:
- `● AI Engine Online` (always green in demo)
- `● Firebase Connected` (always green in demo)
- Response latency (static: "32ms")

---

#### Task H6: Responsive Verification
Test all pages at:
- 1440px (standard desktop — primary target)
- 1280px (laptop)
- 768px (tablet — functional minimum)
- 390px (iPhone 14 — volunteer portal must work)

---

## PHASE 7 — FINAL VERIFICATION
### Objective: Ensure nothing is broken before submission

**Estimated Effort**: 1-2 hours

**Checklist**:
- [ ] All imports resolve correctly (no TypeScript errors)
- [ ] No `bg-white` or `bg-gray-*` visible anywhere in dark theme
- [ ] All pages reachable from sidebar navigation
- [ ] Login → Organizer → All 6 pages → Logout flow works
- [ ] Login → Volunteer → Tasks → Report Incident → Logout flow works
- [ ] AI analysis runs end-to-end (requires backend)
- [ ] Scenario simulation runs end-to-end (requires backend)
- [ ] Resource optimization runs end-to-end (requires backend)
- [ ] Mobile layout of volunteer portal tested
- [ ] No console errors in production build
- [ ] `npm run build` succeeds without errors

---

## TOTAL EFFORT ESTIMATE

| Phase | Description | Hours |
|-------|-------------|-------|
| A | Foundation (tokens, primitives) | 2-4 |
| B | Navigation & Layout | 1-2 |
| C | Dashboard Redesign | 3-5 |
| D | Operations Map | 2-3 |
| E | Scenario & Assignments | 2-3 |
| F | Volunteer Portal | 2-3 |
| G | New Pages | 2-3 |
| H | Final Polish | 2-4 |
| 7 | Verification | 1-2 |
| **Total** | | **17-29 hours** |

**Recommended sprint**: 2-3 days for thorough implementation, 1 day for rapid MVP of phases A-F.

---

## DAILY SPRINT PLAN (if 1 day available)

**Morning (3h)**: Phase A + B — Foundation + Navigation
**Midday (3h)**: Phase C — Dashboard (highest judging impact)
**Afternoon (2h)**: Phase E + D (partial) — Feature pages dark theme
**Evening (2h)**: Phase F + H (partial) — Volunteer portal + Quick polish

---

*Implementation Phases — Phase 6.5 — Stadium Operations AI*
