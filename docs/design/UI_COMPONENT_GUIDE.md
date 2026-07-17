# UI COMPONENT GUIDE
## AI Stadium Operations Dashboard — Complete Component Catalog
### Every reusable component, its API, and visual specification

---

## COMPONENT ARCHITECTURE

All components live in `frontend/src/components/`.
Sub-directories group by domain:
```
components/
  ui/                   ← Primitive, reusable UI atoms
    Button.tsx
    Badge.tsx
    Card.tsx
    Input.tsx
    Spinner.tsx
    Skeleton.tsx
    Toast.tsx
    Tooltip.tsx
    ProgressBar.tsx
  layout/               ← Layout shells and navigation
    OrganizerSidebar.tsx
    VolunteerHeader.tsx
    PageWrapper.tsx
  dashboard/            ← Organizer dashboard widgets
    KPICard.tsx
    AIAnalysisCard.tsx
    RecommendationCard.tsx
    ActivityFeed.tsx
    RiskHeader.tsx
  map/                  ← Map components (existing, refactor)
    MapLoader.tsx
    MapView.tsx
    GateMarker.tsx
    IncidentMarker.tsx
    VolunteerMarker.tsx
    Legend.tsx
    DecisionCenter.tsx
    AIActivityFeed.tsx
  volunteer/            ← Volunteer portal widgets
    TaskCard.tsx
    IncidentReportForm.tsx
    StatusHeader.tsx
```

---

## DESIGN LANGUAGE RULES (apply to every component)

Before writing a single component, internalize these rules:

1. **Dark backgrounds only**: `var(--bg-elevated)` for cards, `var(--bg-surface)` for panels
2. **Borders not dividers**: Use `border-[var(--bg-border)]` not `<hr>` for separation
3. **Semantic color through variables**: Never hardcode `red`, always `var(--risk-critical)`
4. **Inter for UI, JetBrains Mono for data**: Separate contexts via font-family
5. **No pure white**: Use `var(--text-primary)` (#F1F5F9) — slightly warm near-white
6. **Radius consistency**: cards=xl(16px), buttons=lg(12px), badges=full
7. **Transitions on all interactive elements**: `transition-all duration-150`

---

## PRIMITIVE COMPONENTS (ui/)

---

### Button

**File**: `components/ui/Button.tsx`

**Variants**:
| Variant | Background | Border | Text | Use |
|---------|-----------|--------|------|-----|
| `primary` | `primary-500` | none | white | Main CTAs |
| `secondary` | transparent | `bg-border` | `text-secondary` | Secondary actions |
| `danger` | `risk-critical-bg` | `risk-critical-border` | `risk-critical-text` | Destructive actions |
| `ghost` | transparent | transparent | `text-secondary` | Tertiary, nav items |

**Sizes**:
| Size | Padding | Font | Height |
|------|---------|------|--------|
| `sm` | `8px 16px` | 12px/semibold | 32px |
| `md` | `12px 20px` | 14px/semibold | 40px |
| `lg` | `14px 24px` | 14px/semibold | 48px |

**States**: Default → Hover (slightly lighter bg) → Active (scale 0.98) → Loading (spinner) → Disabled (opacity 40%)

**Props**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

---

### Badge (RiskBadge)

**File**: `components/ui/Badge.tsx`

**Variants**:
| Variant | BG | Border | Text | Icon |
|---------|-----|--------|------|------|
| `critical` | `risk-critical-bg` | `risk-critical-border` | `risk-critical-text` | ShieldAlert |
| `high` | `risk-high-bg` | `risk-high-border` | `risk-high-text` | AlertOctagon |
| `medium` | `risk-medium-bg` | `risk-medium-border` | `risk-medium-text` | AlertTriangle |
| `safe` | `risk-safe-bg` | `risk-safe-border` | `risk-safe-text` | ShieldCheck |
| `info` | `info-bg` | `info-border` | `info-text` | Info |
| `ai` | `accent-glow` | accent border | `accent-300` | Sparkles |

**Props**:
```typescript
interface BadgeProps {
  variant: 'critical' | 'high' | 'medium' | 'safe' | 'info' | 'ai';
  label: string;
  showIcon?: boolean;       // default: true
  pulse?: boolean;          // adds pulse ring on critical
  size?: 'sm' | 'md';
}
```

**Critical behavior**: When `variant="critical"` and `pulse=true`, render an animated ring around the badge using `pulseRing` keyframe.

---

### Card

**File**: `components/ui/Card.tsx`

**Variants**:
| Variant | Background | Border | Use |
|---------|-----------|--------|-----|
| `default` | `bg-elevated` | `bg-border` | Standard cards |
| `glass` | `glass-bg` + backdrop-blur | `glass-border` | Overlays on map |
| `accent` | `bg-elevated` + left accent border | `bg-border` | Highlighted sections |

**Props**:
```typescript
interface CardProps {
  variant?: 'default' | 'glass' | 'accent';
  accentColor?: string;     // for variant="accent"
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;          // enables hover lift
  className?: string;
  children: React.ReactNode;
}
```

---

### Input

**File**: `components/ui/Input.tsx`

**Appearance**: Dark background (`bg-overlay`), subtle border (`bg-border`), focus ring in `primary-500`.

**Props**:
```typescript
interface InputProps {
  label?: string;
  labelUppercase?: boolean;   // renders label in UPPERCASE tracking-wide style
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  // + all standard HTML input props
}
```

---

### Spinner

**File**: `components/ui/Spinner.tsx`

**Sizes**: `sm` (14px), `md` (20px), `lg` (32px)

**Colors**: `primary` (indigo), `white`, `accent` (cyan for AI spinners)

Use `color="accent"` for all AI processing spinners to reinforce "AI = cyan" language.

---

### Skeleton

**File**: `components/ui/Skeleton.tsx`

Uses `animate-shimmer` class from design tokens.

```typescript
interface SkeletonProps {
  width?: string;    // e.g., '100%', '180px'
  height?: string;   // e.g., '16px', '80px'
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}
```

**Card Skeleton**: Pre-composed skeleton that matches card proportions for dashboard loading states.

---

### ProgressBar

**File**: `components/ui/ProgressBar.tsx`

**Usage**: Confidence scores, capacity indicators, AI certainty.

```typescript
interface ProgressBarProps {
  value: number;        // 0-100
  color?: 'primary' | 'accent' | 'safe' | 'warning' | 'critical';
  showLabel?: boolean;
  label?: string;       // custom label, defaults to "value%"
  size?: 'sm' | 'md';
  animated?: boolean;   // animate fill on mount
}
```

**Visual**: Track is `bg-muted`, fill uses semantic color. Animated version uses CSS transition on width from 0 to value.

---

### Toast

**File**: `components/ui/Toast.tsx`

Use a simple state-based toast system, no external library needed.

**Variants**: `success`, `error`, `warning`, `info`, `ai` (for AI completion events)

Auto-dismisses after 4 seconds. Slides in from top-right.

---

## LAYOUT COMPONENTS (layout/)

---

### OrganizerSidebar

**File**: `components/layout/OrganizerSidebar.tsx`

**Replaces**: Current `OrganizerNav.tsx`

**Visual Specification**:
```
┌──────────────────────────┐
│ 🏟 STADIUM OPS           │  ← Logo area
│ FIFA WORLD CUP 2026      │
├──────────────────────────┤
│ NAVIGATION               │  ← Section label: text-[11px] uppercase tracking-wide text-tertiary
│                          │
│ ⬜ Dashboard              │  ← Inactive: text-secondary
│ ◼ Operations Map  ←active│  ← Active: bg-primary-700/50, border-l-2 border-primary-400, text-primary
│ ⬜ Scenario Sim           │
│ ⬜ Resource Opt           │
│ ─────────────────────── │  ← Divider
│ ⬜ Activity Timeline     │
│ ⬜ Settings              │
│                          │
├──────────────────────────┤
│ SYSTEM STATUS            │  ← Section label
│ ● AI Engine Online        │  ← Green dot, text-safe, font-mono text-sm
│ ● Firebase Connected      │
│ 32ms response             │  ← mono, text-tertiary
├──────────────────────────┤
│ [OG] Organizer           │  ← Avatar + name
│      ● Online             │  ← Green dot
│      [Log out →]          │
└──────────────────────────┘
Width: 240px, fixed, full-height
Background: bg-surface
Border-right: bg-border
```

**Nav items**: Use Lucide icons (18px), not emoji.

**Props**:
```typescript
interface OrganizerSidebarProps {
  userName?: string;
  onLogout: () => void;
}
```

---

### VolunteerHeader

**File**: `components/layout/VolunteerHeader.tsx`

Top bar for volunteer portal. Mobile-friendly.
Contains: logo/title, duty status badge, profile/logout.

---

### PageWrapper

**File**: `components/layout/PageWrapper.tsx`

Wraps page content with `animate-fade-in-up` entrance animation and consistent padding.

```typescript
interface PageWrapperProps {
  title?: string;          // page title for h1
  subtitle?: string;       // optional subtitle
  actions?: React.ReactNode;  // right-side header actions
  children: React.ReactNode;
}
```

---

## DASHBOARD COMPONENTS (dashboard/)

---

### KPICard

**File**: `components/dashboard/KPICard.tsx`

**Visual**:
```
┌─────────────────────────────┐
│ [Icon]  TOTAL CROWD         │
│                             │
│ 92,450     ↑ 12% vs avg    │
│                             │
│ ▁▂▃▅▇▆█▅  [sparkline line] │
└─────────────────────────────┘
```

**Props**:
```typescript
interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;           // e.g., 'people', '%', 'mins'
  trend?: number;          // +/- percentage vs previous
  icon: React.ReactNode;
  color?: 'primary' | 'accent' | 'safe' | 'warning' | 'critical';
  sparkline?: number[];    // 8-12 data points for mini chart
  loading?: boolean;
}
```

---

### AIAnalysisCard

**File**: `components/dashboard/AIAnalysisCard.tsx`

Displays the full Gemini analysis summary. Has a distinctive left-border accent in cyan (`--accent-500`).

**Visual**:
```
┌── [cyan border] ────────────────────────────────────────┐
│ ✦ Gemini AI Analysis            [RISK: HIGH]  [92% conf]│
│ ──────────────────────────────────────────────────────  │
│ "Heavy crowd concentration at Gate A (94% capacity)..." │
│                                                         │
│ 3 Congestion Alerts · 2 Bottlenecks · 4 Gate Actions   │
│                                                         │
│ Generated 2m ago · Analysis ID: ANA_20260712_001       │
└─────────────────────────────────────────────────────────┘
```

**Props**:
```typescript
interface AIAnalysisCardProps {
  result: AnalysisResult;
  loading?: boolean;
}
```

---

### RecommendationCard

**File**: `components/dashboard/RecommendationCard.tsx`

**Replaces**: Current `RecommendationCard.tsx` — make it fully dark-themed.

**Props**:
```typescript
interface RecommendationCardProps<T> {
  title: string;
  icon: React.ReactNode;
  variant: 'critical' | 'high' | 'medium' | 'safe' | 'info';
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  loading?: boolean;
  emptyMessage?: string;
}
```

**Visual**: Left border in semantic color, `bg-elevated`, expandable reasoning per item.

---

### ActivityFeed

**File**: `components/dashboard/ActivityFeed.tsx`

Scrollable list of timestamped events. Live updates with `slideInLeft` animation on new items.

**Props**:
```typescript
interface ActivityFeedProps {
  events: FeedEvent[];
  maxItems?: number;    // default 10, scroll beyond
  title?: string;
}

interface FeedEvent {
  id: string;
  time: string;         // formatted timestamp
  message: string;
  type: 'info' | 'warning' | 'critical' | 'success' | 'ai';
  actor?: string;       // who triggered it
}
```

---

## MAP COMPONENTS (map/) — Refactor Existing

### DecisionCenter

**File**: `components/map/DecisionCenter.tsx` (refactor existing)

Upgrade from current light theme to dark glass panel. Keep all existing props, just restyle.

---

### Legend

**File**: `components/map/Legend.tsx` (refactor existing)

Convert to floating glass panel positioned bottom-right of map. Dark background, visible on map.

---

## VOLUNTEER COMPONENTS (volunteer/)

---

### TaskCard

**File**: `components/volunteer/TaskCard.tsx`

**Replaces**: Inline JSX in `/volunteer/page.tsx`

**Props**:
```typescript
interface TaskCardProps {
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  location: string;
  eta: string;
  status: 'pending' | 'acknowledged' | 'in_progress' | 'complete';
  onAcknowledge?: () => void;
  onStart?: () => void;
  assignmentScore?: number;
  reasoning?: string;       // expandable AI reasoning
}
```

**Priority visual**: Color bar at top of card (`4px height`) using semantic color.

---

### IncidentReportForm

**File**: `components/volunteer/IncidentReportForm.tsx`

Two-field form per PRD specification. Large tap targets (min 48px height). Mobile-first.

**Fields**:
1. Location (text input, with auto-suggestions based on mock gate data)
2. What's happening? (textarea, min 4 rows)

**Submit**: Full-width button, dark primary style. Shows success state with checkmark animation.

**Props**:
```typescript
interface IncidentReportFormProps {
  onSubmit: (report: { location: string; description: string }) => Promise<void>;
  loading?: boolean;
}
```

---

## COMPONENT STATES MATRIX

Every component must handle all four states:

| State | Visual Treatment |
|-------|-----------------|
| Default | Normal rendering |
| Loading | Skeleton shimmer overlay OR spinner |
| Empty | Illustration + helpful message (never just blank) |
| Error | Red border + error text + retry action |

### Empty State Design
```
┌─────────────────────────────────────┐
│                                     │
│         [Lucide icon, 40px          │
│          text-tertiary, opacity 40] │
│                                     │
│    No Analysis Results Yet          │
│    Upload crowd data to generate    │
│    AI-powered operational insights  │
│                                     │
│    [Upload Data →]  ← ghost button  │
│                                     │
└─────────────────────────────────────┘
```

Never show a blank white or gray box. Every empty state has:
1. A relevant icon
2. A helpful heading
3. A descriptive subtext
4. An actionable CTA

---

## COMPONENT CHECKLIST

For each new or refactored component, verify:

- [ ] Uses dark color tokens (no `bg-white`, `bg-gray-*`, `text-gray-*`)
- [ ] Handles loading state with skeleton
- [ ] Handles empty state with illustration + message
- [ ] Handles error state
- [ ] Has `transition-all duration-150` on all interactive elements
- [ ] Uses `var(--font-mono)` for all data/number values
- [ ] Aria labels on all icons and interactive elements
- [ ] Tested at 1280px and 768px widths

---

*UI Component Guide — Phase 6.5 — Stadium Operations AI*
