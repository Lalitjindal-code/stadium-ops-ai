# DESIGN SYSTEM
## AI-Powered Stadium Operations Dashboard — FIFA World Cup 2026
### The Complete Visual Identity & Design Language

---

## 1. BRAND IDENTITY

### Mission
*Empower FIFA World Cup 2026 operations teams with real-time AI situational awareness — turning fragmented stadium data into clear, confident, actionable intelligence.*

### Vision
*The world's most visually trustworthy AI command center: where organizers and volunteers can make life-safety decisions under pressure, backed by intelligence they can understand.*

### Brand Personality
| Trait | Description | Visual Translation |
|-------|-------------|-------------------|
| **Authoritative** | This is mission-critical software | Heavy fonts, structured grids, deep dark backgrounds |
| **Intelligent** | AI is the core — show it | Subtle glows, data animations, reasoning trails |
| **Trustworthy** | Lives depend on this during incidents | High contrast, legible type, accessible color |
| **Precise** | No guessing in an operations center | Tight spacing, aligned grids, clean iconography |
| **Calm under pressure** | Interface stays composed in emergencies | Restrained animations, no distracting decoration |

### Design Principles
1. **Signal over noise** — Every UI element earns its place by communicating information
2. **Dark is authoritative** — Operations centers use dark UIs for good reason: reduced eye strain, higher contrast for critical data
3. **AI reasoning is content** — Never hide Gemini's reasoning; surface it as a first-class data point
4. **Status at a glance** — A judge should understand system state in under 3 seconds
5. **Motion earns attention** — Animations only where they signal state changes, not decoration

---

## 2. TYPOGRAPHY

### Font Selection
**Primary: Inter** (Google Fonts)
- Why: The de-facto enterprise UI font. Used by Linear, Vercel, Stripe. Designed specifically for screen readability at small sizes. Excellent number rendering.
- Weight range: 300, 400, 500, 600, 700, 800

**Monospace: JetBrains Mono** (Google Fonts)
- Why: For data values, confidence scores, analysis IDs, timestamps. Tabular figures align perfectly in tables. Used by professional dev tools and data dashboards.
- Weight range: 400, 500, 600

### Type Scale (4px base × 1.25 modular scale)

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `display-2xl` | 48px / 3rem | 800 | 1.1 | -0.02em | Hero headings, major stats |
| `display-xl` | 36px / 2.25rem | 700 | 1.15 | -0.015em | Page titles |
| `heading-lg` | 24px / 1.5rem | 700 | 1.3 | -0.01em | Section headers |
| `heading-md` | 20px / 1.25rem | 600 | 1.35 | -0.008em | Card titles |
| `heading-sm` | 16px / 1rem | 600 | 1.4 | -0.005em | Widget headers |
| `body-lg` | 15px / 0.9375rem | 400 | 1.6 | 0 | Primary content |
| `body-md` | 13px / 0.8125rem | 400 | 1.6 | 0 | Secondary content |
| `body-sm` | 12px / 0.75rem | 400 | 1.5 | 0 | Captions, meta |
| `label-lg` | 13px / 0.8125rem | 600 | 1.4 | 0.03em | Form labels (uppercase) |
| `label-sm` | 11px / 0.6875rem | 700 | 1.3 | 0.06em | Badges, tags (uppercase) |
| `button-lg` | 14px / 0.875rem | 600 | 1 | 0.01em | Primary buttons |
| `button-sm` | 12px / 0.75rem | 600 | 1 | 0.015em | Secondary buttons |
| `mono-lg` | 14px / 0.875rem | 500 | 1.4 | 0 | Data values |
| `mono-sm` | 12px / 0.75rem | 500 | 1.4 | 0 | IDs, timestamps |

### Font Pairing Rationale
Inter + JetBrains Mono creates a **dual-register system**:
- Inter handles all narrative/instructional text — human-readable, warm
- JetBrains Mono handles all data/machine output — precise, technical signal
- The contrast between the two tells users: "this part is AI data, this part is UI"

---

## 3. COLOR SYSTEM — ENTERPRISE DARK THEME

### Design Philosophy
The palette is built around **deep operational authority** — the aesthetic of a military command center, NASA mission control, and Linear's dashboard, translated to FIFA context. 

Every color choice has a functional reason, not just aesthetic. Color = information.

### Background Scale
```css
--bg-base:        #080C14   /* Deep navy-black: main page background */
--bg-surface:     #0D1421   /* Slightly lighter: card backgrounds */
--bg-elevated:    #111927   /* Elevated cards, modals */
--bg-overlay:     #162033   /* Hover states, tooltips */
--bg-muted:       #1C2940   /* Subtle section dividers */
```

**Why**: Pure black feels flat. Navy-black reads as technical/professional. Slight blue tint makes the interface feel connected to the brand.

### Primary Brand — FIFA Indigo
```css
--primary-900:    #1E1B4B   /* Deepest — backgrounds */
--primary-800:    #312E81   /* Dark — active states */
--primary-700:    #3730A3   /* Medium — nav backgrounds */
--primary-600:    #4338CA   /* Primary actions */
--primary-500:    #4F46E5   /* Buttons, CTAs */
--primary-400:    #6366F1   /* Hover states */
--primary-300:    #818CF8   /* Subtle accents */
--primary-200:    #A5B4FC   /* Light accents */
--primary-100:    #C7D2FE   /* Very subtle */
--primary-50:     #EEF2FF   /* Near-white tint */
```

**Why Indigo**: FIFA's brand is historically blue-adjacent. Indigo reads as AI-native (many AI products use it). Deeper than blue, avoiding generic corporate blue. Maintains authority while being distinctive.

### Secondary — Cyan AI Glow
```css
--accent-500:     #06B6D4   /* AI indicators, live status */
--accent-400:     #22D3EE   /* Active AI processing states */
--accent-300:     #67E8F9   /* Subtle AI accents */
--accent-glow:    rgba(6, 182, 212, 0.15)  /* Glow backdrop */
```

**Why Cyan**: Creates visual language that "cyan = AI/live data." When judges see cyan, they know Gemini is involved. Distinct from primary indigo, avoiding confusion.

### Semantic — Status Colors
```css
/* Critical / Emergency */
--risk-critical:  #EF4444   /* Red 500 — immediate danger */
--risk-critical-bg: rgba(239, 68, 68, 0.12)
--risk-critical-border: rgba(239, 68, 68, 0.25)

/* High Risk */
--risk-high:      #F97316   /* Orange 500 — elevated concern */
--risk-high-bg:   rgba(249, 115, 22, 0.12)
--risk-high-border: rgba(249, 115, 22, 0.25)

/* Medium Risk */
--risk-medium:    #EAB308   /* Yellow 500 — monitor closely */
--risk-medium-bg: rgba(234, 179, 8, 0.12)
--risk-medium-border: rgba(234, 179, 8, 0.25)

/* Safe / Success */
--risk-safe:      #22C55E   /* Green 500 — normal operations */
--risk-safe-bg:   rgba(34, 197, 94, 0.12)
--risk-safe-border: rgba(34, 197, 94, 0.25)

/* Info */
--info:           #3B82F6   /* Blue 500 — informational */
--info-bg:        rgba(59, 130, 246, 0.12)
```

**Why these values**: Chosen to maintain WCAG AA contrast (minimum 4.5:1) against dark backgrounds. All bg variants use 12% opacity — visible but not distracting.

### Neutral Text Scale
```css
--text-primary:   #F1F5F9   /* Near-white — primary content */
--text-secondary: #94A3B8   /* Muted slate — secondary content */
--text-tertiary:  #64748B   /* Very muted — captions, meta */
--text-disabled:  #334155   /* Disabled states */
--text-inverse:   #0F172A   /* On light backgrounds */
```

### Chart Colors (Accessible 8-color palette)
```css
--chart-1:  #4F46E5   /* Indigo — primary series */
--chart-2:  #06B6D4   /* Cyan — secondary series */
--chart-3:  #22C55E   /* Green — positive */
--chart-4:  #EAB308   /* Yellow — warning */
--chart-5:  #F97316   /* Orange — elevated */
--chart-6:  #EF4444   /* Red — critical */
--chart-7:  #A855F7   /* Purple — VIP/special */
--chart-8:  #EC4899   /* Pink — medical */
```

### Heatmap Colors (Crowd Density)
```css
--heat-0:   #1E3A5F   /* Very low density */
--heat-1:   #1D4ED8   /* Low density */
--heat-2:   #0891B2   /* Below average */
--heat-3:   #059669   /* Normal */
--heat-4:   #D97706   /* Elevated */
--heat-5:   #DC2626   /* High density */
--heat-6:   #7C3AED   /* Critical — overcapacity */
```

### Accessibility Contrast Ratios
| Element | Foreground | Background | Ratio | WCAG Level |
|---------|-----------|------------|-------|------------|
| Primary text | `#F1F5F9` | `#080C14` | 18.1:1 | AAA ✅ |
| Secondary text | `#94A3B8` | `#080C14` | 7.4:1 | AA ✅ |
| Critical badge | `#FCA5A5` | `rgba(239,68,68,0.12)` | 5.2:1 | AA ✅ |
| Primary button | `#FFFFFF` | `#4F46E5` | 5.8:1 | AA ✅ |
| Caption text | `#64748B` | `#0D1421` | 4.8:1 | AA ✅ |

---

## 4. SPACING SYSTEM

### Base Unit: 4px
All spacing values are multiples of 4px for mathematical consistency.

```css
--space-0:   0px
--space-1:   4px    /* 0.25rem — micro gaps */
--space-2:   8px    /* 0.5rem  — icon gaps, tight pairs */
--space-3:   12px   /* 0.75rem — compact padding */
--space-4:   16px   /* 1rem    — standard padding */
--space-5:   20px   /* 1.25rem — card padding */
--space-6:   24px   /* 1.5rem  — section gaps */
--space-8:   32px   /* 2rem    — major section padding */
--space-10:  40px   /* 2.5rem  — large section gaps */
--space-12:  48px   /* 3rem    — page-level padding */
--space-16:  64px   /* 4rem    — hero sections */
--space-20:  80px   /* 5rem    — major vertical sections */
```

### Application Guide
| Context | Token | Value |
|---------|-------|-------|
| Sidebar width | — | 240px |
| Sidebar padding | `--space-6` | 24px |
| Card padding (default) | `--space-6` | 24px |
| Card padding (compact) | `--space-4` | 16px |
| Grid gap (cards) | `--space-4` to `--space-6` | 16-24px |
| Section vertical gap | `--space-8` | 32px |
| Page padding | `--space-8` | 32px |
| Header height | — | 64px |
| Badge padding | `--space-1` `--space-3` | 4px 12px |
| Button padding | `--space-3` `--space-5` | 12px 20px |

---

## 5. CORNER RADIUS SYSTEM

```css
--radius-sm:    4px    /* Badges, tags, small indicators */
--radius-md:    8px    /* Inputs, small buttons, tooltips */
--radius-lg:    12px   /* Cards, large buttons, panels */
--radius-xl:    16px   /* Major cards, dialog boxes */
--radius-2xl:   20px   /* Hero cards, featured panels */
--radius-full:  9999px /* Pills, avatars, progress indicators */
```

### Application Guide
| Component | Radius |
|-----------|--------|
| Buttons (primary) | `--radius-lg` 12px |
| Buttons (small) | `--radius-md` 8px |
| Cards | `--radius-xl` 16px |
| Input fields | `--radius-md` 8px |
| Badges/tags | `--radius-full` pill |
| Modal dialogs | `--radius-xl` 16px |
| Tooltips | `--radius-sm` 4px |
| Sidebar | 0px (full height flush) |
| Avatar | `--radius-full` |

---

## 6. ELEVATION & SHADOW SYSTEM

### Shadow Scale
```css
/* Flat — no elevation, border only */
--shadow-none: none;

/* Level 1 — slight lift, cards at rest */
--shadow-sm: 
  0 1px 2px rgba(0, 0, 0, 0.4),
  0 1px 4px rgba(0, 0, 0, 0.2);

/* Level 2 — hover, focused cards */
--shadow-md: 
  0 4px 16px rgba(0, 0, 0, 0.4),
  0 2px 4px rgba(0, 0, 0, 0.3);

/* Level 3 — floating panels, dropdowns */
--shadow-lg: 
  0 8px 32px rgba(0, 0, 0, 0.5),
  0 4px 8px rgba(0, 0, 0, 0.4);

/* Level 4 — modals, overlays */
--shadow-xl: 
  0 16px 64px rgba(0, 0, 0, 0.6),
  0 8px 16px rgba(0, 0, 0, 0.5);
```

### Brand Glow Shadows (AI elements)
```css
/* Indigo glow — primary AI elements */
--shadow-glow-primary: 0 0 20px rgba(79, 70, 229, 0.25);

/* Cyan glow — live/real-time indicators */
--shadow-glow-cyan: 0 0 20px rgba(6, 182, 212, 0.25);

/* Critical glow — emergency indicators */
--shadow-glow-red: 0 0 20px rgba(239, 68, 68, 0.3);
```

### Glassmorphism System
```css
/* Standard glass card */
--glass-bg: rgba(13, 20, 33, 0.7);
--glass-border: rgba(255, 255, 255, 0.06);
--glass-blur: blur(20px);

/* Heavy glass — primary overlays */
--glass-heavy-bg: rgba(8, 12, 20, 0.85);
--glass-heavy-blur: blur(40px);

/* Light glass — subtle sections */
--glass-light-bg: rgba(255, 255, 255, 0.03);
--glass-light-border: rgba(255, 255, 255, 0.04);
```

---

## 7. ICON SYSTEM

### Recommended Library: Lucide React
**Why Lucide**: 
- Clean 1.5px stroke-width geometric icons — matches the precision aesthetic
- Tree-shakeable — only import what you use (performance)
- Maintained by the community, actively updated
- Used by Linear, Vercel, shadcn/ui — enterprise credibility
- TypeScript-native

### Icon Usage Guide
| Context | Size | Stroke | Color |
|---------|------|--------|-------|
| Sidebar navigation | 18px | 1.5px | `--text-secondary` / `--primary-300` active |
| Card headers | 16px | 1.5px | Contextual semantic color |
| Status indicators | 14px | 2px | Semantic color |
| Inline text icons | 14px | 1.5px | Current text color |
| Large feature icons | 24px | 1.5px | `--primary-400` |
| Alert/risk icons | 20px | 2px | Semantic (red/orange/yellow/green) |

### Icon Mapping
| Page/Feature | Icons (Lucide) |
|-------------|----------------|
| Dashboard | `LayoutDashboard` |
| Operations Map | `Map` |
| Scenario Simulator | `Zap` |
| Resource Optimizer | `Users` |
| Activity Timeline | `Clock` |
| Settings | `Settings` |
| Volunteer Portal | `UserCheck` |
| Incident Report | `AlertTriangle` |
| AI Analysis | `Brain` / `Sparkles` |
| Upload | `Upload` / `FileUp` |
| Risk: Critical | `ShieldAlert` |
| Risk: High | `AlertOctagon` |
| Risk: Medium | `AlertTriangle` |
| Risk: Safe | `ShieldCheck` |
| Live/Online | `Radio` / `Wifi` |
| Congestion | `Activity` |
| Gate | `DoorOpen` |
| Volunteer | `UserCheck` |
| Medical | `Cross` / `HeartPulse` |

---

## 8. ANIMATION SYSTEM

### Animation Philosophy
Motion communicates meaning. Every animation serves one purpose:
1. **Orientation** — helping users understand what changed
2. **Status** — indicating system state (loading, processing, done)
3. **Hierarchy** — reinforcing which elements are primary

### Timing Tokens
```css
--duration-instant:  100ms   /* Hover microinteractions */
--duration-fast:     150ms   /* Button states, badge changes */
--duration-normal:   200ms   /* Card transitions, nav highlights */
--duration-slow:     300ms   /* Page elements, sidebars */
--duration-enter:    400ms   /* Page entrances */
--duration-exit:     200ms   /* Page exits (always faster) */

--ease-default:   cubic-bezier(0.4, 0, 0.2, 1)    /* Standard */
--ease-spring:    cubic-bezier(0.175, 0.885, 0.32, 1.275)  /* Bounce */
--ease-decel:     cubic-bezier(0, 0, 0.2, 1)       /* Enter */
--ease-accel:     cubic-bezier(0.4, 0, 1, 1)       /* Exit */
```

### Animation Catalog

#### Hover States
```css
/* Card lift */
card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  transition: all var(--duration-fast) var(--ease-default);
}

/* Button press */
button:active {
  transform: scale(0.98);
  transition: transform var(--duration-instant) var(--ease-default);
}

/* Nav item */
nav-item:hover {
  background: rgba(255,255,255,0.06);
  transition: background var(--duration-fast) var(--ease-default);
}
```

#### Page Transitions
```css
/* Fade-in-up — page entrance */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Duration: 400ms, ease-decel, stagger children by 60ms */

/* Fade-in — sidebar panels */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

#### Loading States
```css
/* Pulse skeleton — data loading */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

/* Spin — AI processing indicator */
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* AI Thinking dot pulse */
@keyframes aiThink {
  0%   { opacity: 0.3; transform: scale(0.8); }
  50%  { opacity: 1;   transform: scale(1.2); }
  100% { opacity: 0.3; transform: scale(0.8); }
}
/* Three dots, staggered 200ms each */
```

#### Critical Alert Animation
```css
/* Pulse ring — critical alerts */
@keyframes pulseRing {
  0%   { transform: scale(1);    opacity: 1; }
  100% { transform: scale(1.8);  opacity: 0; }
}
/* Creates radiating ring effect on critical risk badges */
```

#### Skeleton Shimmer
```css
/* Shimmer — card loading state */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
skeleton {
  background: linear-gradient(90deg, 
    rgba(255,255,255,0.03) 25%, 
    rgba(255,255,255,0.08) 37%, 
    rgba(255,255,255,0.03) 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}
```

---

## 9. DASHBOARD WIDGET DESIGN

### KPI Card — Standard
```
┌──────────────────────────────┐
│ [Icon]  METRIC LABEL         │
│                               │
│ 92,450          ↑ 12%        │
│ [large number]  [trend badge] │
│                               │
│ ▓▓▓▓▓▓▓░░░  [mini sparkline] │
└──────────────────────────────┘
Background: --bg-elevated
Border: 1px solid rgba(255,255,255,0.06)
Icon: 16px Lucide, semantic color
Number: display-xl, bold, --text-primary
Trend: Up = green, Down = red
```

### AI Analysis Card — Full Width
```
┌──────────────────────────────────────────────────┐
│ ✦ GEMINI AI ANALYSIS                [92% conf]   │
│ ─────────────────────────────────────────────── │
│ [AI Summary text — body-md, text-secondary]       │
│                                                   │
│ 4 Alerts  ·  2 Bottlenecks  ·  6 Actions         │
│ [stat pills]                                      │
│                                                   │
│ Generated: 2 mins ago  ·  ID: ANA_20260712_001   │
└──────────────────────────────────────────────────┘
Accent: cyan-glow border-left, 3px
Background: deep surface with slight cyan tint
```

### Risk Indicator — Header Badge
```
┌────────────────────┐
│ ● RISK: CRITICAL   │
│ ◉ Pulsing ring    │
└────────────────────┘
Colors: use semantic tokens
Animation: pulseRing on critical/high
```

### Recommendation Card
```
┌────────────────────────────────────┐
│ ⚠️ CONGESTION ALERTS      [3 items]│
│ ──────────────────────────────── │
│ • Gate A — CRITICAL               │
│   "Crowd density at 94%..."       │
│   [Collapse/expand reasoning ▾]   │
│ • Gate C — HIGH                   │
│   "Historical patterns suggest..."│
│ • Gate F — MEDIUM                 │
└────────────────────────────────────┘
Background: semantic color at 8% opacity
Border-left: 4px solid semantic color
```

### Activity Feed Item
```
┌────────────────────────────────────┐
│ 14:32  ● AI ANALYSIS               │
│ Congestion detected at Gate A.     │
│ Risk elevated to HIGH.             │
│                                    │
│ 14:28  ◎ VOLUNTEER                 │
│ V-042 acknowledged assignment.     │
└────────────────────────────────────┘
Dot colors: semantic
Font: mono-sm for timestamps
```

---

## 10. MAP DESIGN

### Marker Design Language
```
Gate Markers:
  SAFE:     Filled circle, --risk-safe, 12px
  MEDIUM:   Filled circle, --risk-medium, 14px  
  HIGH:     Filled circle, --risk-high, 16px, pulse shadow
  CRITICAL: Filled circle, --risk-critical, 18px, pulse ring animation

Volunteer Markers:
  Available: Indigo circle, UserCheck icon, 12px
  On-task:   Cyan circle, moving indicator
  
Incident Markers:
  AlertTriangle, --risk-high, 16px
  Pulse animation on active incidents
```

### Info Tooltip (Map popup)
```
┌───────────────────────────┐
│ Gate A — North Entrance   │
│ ─────────────────────── │
│ Density:  94%  ● Critical │
│ Count:    2,847 people    │
│ AI:       Divert to C,D   │
└───────────────────────────┘
Background: glass-heavy
Border: 1px solid rgba(255,255,255,0.1)
```

### Decision Center Panel
```
┌─────────────────────────────────┐
│ 🧠 AI DECISION CENTER           │
│ ────────────────────────────── │
│ CURRENT RISK    ● CRITICAL       │
│ PRIORITY GATE   Gate A          │
│ TOP INCIDENT    Medical         │
│                                 │
│ RESOURCE STATUS                 │
│ Volunteers:  24 required        │
│ Medical:     3 teams            │
│ Security:    5 teams            │
│                                 │
│ AI Confidence: ████████░░  92%  │
└─────────────────────────────────┘
```

---

## 11. ACCESSIBILITY STANDARDS

### Keyboard Navigation
- All interactive elements reachable via Tab
- Focus indicators: 2px inset ring, `--primary-400` color
- Escape closes modals and dropdowns
- Enter/Space activates buttons

### ARIA Requirements
- All risk badges: `role="status"` + `aria-label="Risk level: Critical"`
- Live AI feed: `aria-live="polite"` region
- Loading states: `aria-busy="true"` on containers
- Map markers: `aria-label` with full gate information

### Color Independence
- All risk levels communicated by: color + icon + text label (never color alone)
- Charts include pattern fills for colorblind users where critical

---

## 12. RESPONSIVE STRATEGY

### Breakpoints
```css
--bp-sm:  640px   /* Mobile landscape */
--bp-md:  768px   /* Tablet */
--bp-lg:  1024px  /* Small desktop */
--bp-xl:  1280px  /* Standard desktop (primary target) */
--bp-2xl: 1536px  /* Large desktop / presentation screen */
```

### Layout Behavior
| Breakpoint | Sidebar | Content | Focus |
|-----------|---------|---------|-------|
| Mobile (<768px) | Hidden, bottom nav | Full width | Volunteer portal |
| Tablet (768-1024) | Collapsed icon-only | Full width | Basic organizer |
| Desktop (1024+) | Full expanded | Remaining | Primary organizer |
| Large (1280+) | Full + labels | Multi-column | Presentation mode |

---

*Design System — Phase 6.5 — Stadium Operations AI*
*Maintained by: Product Design Lead*
