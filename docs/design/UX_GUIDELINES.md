# UX GUIDELINES
## AI Stadium Operations Dashboard — FIFA World Cup 2026
### Behavioral & Experience Design Standards

---

## CORE UX PHILOSOPHY

This product is used in a **high-pressure, time-critical environment** during live FIFA World Cup matches. Poor UX decisions cost time. In an operations center, wasted seconds have real consequences.

Every UX decision in this product must answer:
> "Does this help an operations manager make a faster, better, more confident decision?"

If no, remove it.

---

## 1. INFORMATION HIERARCHY

### The 3-Second Rule
A user (or hackathon judge) must understand the system's current state **within 3 seconds** of opening any page.

**Organizer Dashboard** — 3 seconds must reveal:
- Current risk level (badge in header)
- How many alerts exist (count on cards)
- Whether AI has analyzed recent data (AI card visible)

**Operations Map** — 3 seconds must reveal:
- Which gates are problematic (red markers visible)
- Overall risk status (Decision Center panel)
- Number of active incidents (feed visible)

**Scenario Simulation** — 3 seconds must reveal:
- What simulation options exist (checkboxes visible)
- Whether a simulation is running/complete (state clearly indicated)

### Visual Priority Hierarchy (F-pattern)
For every page, content is arranged:
1. **Top-left**: Most critical status (risk level, system status)
2. **Top-right**: Actions (logout, primary CTA)
3. **Left column**: Input or summary context
4. **Right/main area**: AI output and recommendations

This mirrors the natural F-shaped reading pattern.

---

## 2. AI REASONING VISIBILITY

### Rule: AI reasoning is primary content, not a footnote

The entire product value proposition is "AI that explains its decisions." Never bury reasoning.

**Correct pattern**:
```
┌─────────────────────────────────────┐
│ Gate A — CRITICAL                   │
│ AI Reason: Density is at 94% of     │
│ maximum capacity based on current   │
│ sensor readings, with crowd still   │
│ arriving via North entrance.        │
└─────────────────────────────────────┘
```

**Wrong pattern**:
```
┌─────────────────────────────────────┐
│ Gate A — CRITICAL      [See why ▾]  │
│ (reasoning hidden behind a click)   │
└─────────────────────────────────────┘
```

**Exception**: If there are 6+ items in a list, the first 2 can show reasoning inline, remaining collapsed. But there must always be a visible reason for the top item.

### Confidence Score Display

Always display AI confidence scores where provided. Format: `██████████░░ 87%`
- Use `ProgressBar` component
- Below 70%: show in warning color
- 70-85%: primary color
- 85%+: accent (cyan) color

---

## 3. LOADING STATE STRATEGY

### Never Show a Blank Page

Every data-loading state must show a meaningful skeleton, not a spinner alone.

| Situation | UI Response |
|-----------|------------|
| Page load | Immediate skeleton layout matching expected content |
| AI analysis (2-8s) | Animated skeleton + "Gemini is analyzing..." message with thinking dots |
| Map tile loading | MapLoader spinner centered on map area |
| Background refresh | Subtle loading indicator in header, not full-page overlay |

### AI Processing — Special Treatment

When Gemini is actively processing, communicate this explicitly:
```
┌─────────────────────────────────────────┐
│  ✦ Gemini is analyzing your data...     │
│     ·  ·  ·   (animated dots)           │
│                                         │
│  Reviewing crowd density patterns       │
│  Identifying congestion risks           │
│  Generating recommendations             │
│  [progress: ████████░░░]               │
└─────────────────────────────────────────┘
```

This transforms a blank loading wait into a visible AI working moment — which is exactly what judges want to see.

---

## 4. ERROR STATE STRATEGY

### Error Message Quality

Errors must be:
1. **Human-readable** — not `"Error: 422 Unprocessable Entity"`
2. **Actionable** — what should the user do next?
3. **Contextual** — where did the error occur?

**Wrong**: `"An error occurred. Please try again."`

**Right**: 
```
┌─────────────────────────────────────────┐
│ ⚠️ Analysis Failed                      │
│ Could not connect to AI engine.         │
│ Check your network and retry.           │
│                                         │
│ [Try Again]  [Use Demo Data]            │
└─────────────────────────────────────────┘
```

The "Use Demo Data" fallback is critical for hackathon demos — if the backend is down, the frontend should still demonstrate the experience.

---

## 5. NAVIGATION UX

### Sidebar Design Principles

1. **Active state must be unambiguous**: Left border + background + text color change — never just one signal
2. **Section labels help orientation**: "NAVIGATION", "SYSTEM STATUS", "ACCOUNT" — uppercase labels group links
3. **Current page in breadcrumb**: Header should show current page name
4. **No dead ends**: Every page has a clear path back and a clear next action

### Breadcrumb Pattern
```
Stadium Ops  /  Operations Map
```
Show in header for all sub-pages. Not needed on dashboard (root).

### Mobile Navigation (Volunteer Portal)
Bottom tab bar, not sidebar. Tabs:
1. My Tasks (home icon)
2. Report Incident (plus/alert icon)
3. Profile/Log out (user icon)

---

## 6. DATA ENTRY UX

### CSV Upload Flow
1. Drop zone visible immediately — large, with dashed border
2. File preview before submit — show parsed rows as a table (first 5 rows)
3. Validation inline — show errors before submit, not after
4. Clear progress during upload
5. Success state before AI analysis starts

### Form Validation
- Validate on blur, not on change (reduces distraction while typing)
- Show validation errors inline, below the field
- Success states: green checkmark appears when field is valid
- Never require users to scroll to find an error

---

## 7. VOLUNTEER UX — MOBILE FIRST

The volunteer portal is used on a phone, in a crowd, under time pressure. Every interaction must be:

1. **One-handed operable**: All primary actions reachable with right thumb
2. **Large tap targets**: Minimum 48px × 48px for all interactive elements
3. **High contrast**: Tasks must be readable in bright sunlight (14:1 contrast minimum for critical text)
4. **Minimal reading**: Priority is communicated visually first (color stripe + icon), text second
5. **Fast acknowledge**: Acknowledge button requires single tap, no confirmation dialog

### Task Priority Visual Language
```
Critical:  [━━━━━] Red top bar
High:      [━━━━━] Orange top bar  
Medium:    [━━━━━] Yellow top bar
Low:       [━━━━━] Slate top bar
```

Color stripe is 4px tall, full card width, first thing visible on card.

---

## 8. EMPTY STATE DESIGN

### Empty States Are Onboarding

When a page has no data, it is also an opportunity to explain what the page does.

**Dashboard — No Analysis**:
```
Icon: BarChart2 (40px, muted)
Heading: "No Analysis Results Yet"
Body: "Upload your crowd data CSV to generate AI-powered 
       congestion alerts, bottleneck predictions, and 
       volunteer deployment recommendations."
CTA: [Upload Crowd Data] → links to DataUploadForm
```

**Operations Map — No incidents**:
```
Icon: ShieldCheck (40px, green-muted)
Heading: "All Clear — No Active Incidents"
Body: "The map is monitoring all gate positions in real time.
       Incidents reported by volunteers will appear here."
(No CTA needed — this is a success state)
```

---

## 9. FEEDBACK & CONFIRMATION

### User Action Feedback Matrix

| Action | Immediate | Short-term | Final |
|--------|-----------|------------|-------|
| Upload CSV | File name shows | Parse preview | "Analysis ready" |
| Run AI Analysis | Button spins | Skeleton visible | Cards populate |
| Run Scenario | Button spins | Loading grid | Results expand |
| Acknowledge task | Button changes | Badge updates | Confirmation toast |
| Submit incident | Button spins | — | Success animation |

### Toast Notifications
- Position: top-right
- Duration: 4 seconds, then fade
- Never more than 2 toasts visible simultaneously
- Toast types: success (green), error (red), info (blue), ai (cyan for AI events)

---

## 10. DEMO-SPECIFIC UX DECISIONS

These decisions exist specifically to optimize hackathon judge experience:

### Quick Demo Fill
The login page has "Quick Access Demo Roles" buttons. Keep these.
They should fill credentials AND submit immediately after a brief visual delay (500ms) so judges see both personas quickly.

### Sample Data Availability
The DataUploadForm should have a "Use Sample Data" button that loads the CSV from `docs/sample_crowd_data.csv` without requiring file upload. This ensures AI analysis runs even without a prepared demo file.

### AI Reasoning Always Visible
The first recommendation in each card should always have its reasoning expanded by default. Judges should not need to click to see Gemini's work.

### Scenario Result — Pre-selected
The Scenario page should have "Heavy Rain + Sudden Crowd Surge" pre-selected as the default scenario. This is the most dramatic scenario and will produce the highest-impact AI response for demo purposes.

---

## 11. LANGUAGE & MICROCOPY

### Button Labels
| Instead of... | Use... |
|--------------|--------|
| Submit | Run AI Analysis |
| OK | Confirm |
| Cancel | Never mind |
| Error | Analysis Failed |
| Loading | Gemini is analyzing... |
| No data | No analysis yet |

### Risk Level Labels
Always: `CRITICAL` / `HIGH` / `MEDIUM` / `SAFE`
Never: `ERROR` / `DANGER` / `OK` / `GOOD`

The word "CRITICAL" is deliberately alarming — it signals urgency appropriately.

### AI Attribution
Always attribute AI output to Gemini explicitly:
- "Gemini detected 3 congestion points"
- "AI Reasoning: ..."
- "Generated by Gemini AI"
- "✦ Gemini Analysis" (sparkle icon from Lucide)

This helps judges tick the "AI integration" box immediately.

---

## 12. ACCESSIBILITY CHECKLIST

Before marking any component done, verify:

- [ ] Color is not the only way information is conveyed
- [ ] Focus outline visible on all interactive elements (2px ring)
- [ ] All images and icons have aria-label or aria-hidden
- [ ] Error messages are associated with their input (aria-describedby)
- [ ] Loading states announce to screen readers (aria-busy)
- [ ] Modals trap focus correctly
- [ ] Tab order is logical (matches visual order)
- [ ] No keyboard traps

---

*UX Guidelines — Phase 6.5 — Stadium Operations AI*
