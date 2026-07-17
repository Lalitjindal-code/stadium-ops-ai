# UI/UX Design

## Stadium Operations Dashboard

---

## 1. Pages

| Route | Persona | Purpose |
|---|---|---|
| `/login` | Both | Firebase Auth login |
| `/organizer` | Organizer | Main dashboard — alerts, map, recommendations |
| `/organizer/upload` | Organizer | CSV upload / manual data entry |
| `/organizer/incidents` | Organizer | Incident list + triage |
| `/organizer/incidents/[id]` | Organizer | Incident detail |
| `/volunteer` | Volunteer | Task list + AI instructions |
| `/volunteer/report` | Volunteer | Submit incident report |

---

## 2. Organizer Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│ Header: Stadium Ops Dashboard        [Risk: HIGH] [User] │
├───────────────┬─────────────────────────────────────────┤
│  Nav           │  Live Map (Google Maps)                 │
│  - Dashboard   │  - Gate markers (color = status)        │
│  - Upload      │  - Incident pins                        │
│  - Incidents   │  - Volunteer positions                  │
│  - Volunteers  │                                          │
├───────────────┴─────────────────────────────────────────┤
│  AI Recommendations Panel                                │
│  ┌─────────────┬─────────────┬─────────────┬──────────┐ │
│  │ Congestion  │ Bottleneck  │ Gate Recs   │ Volunteer │ │
│  │ Alerts      │ Predictions │             │ Suggests  │ │
│  │ [reasoning] │ [reasoning] │ [reasoning] │[reasoning]│ │
│  └─────────────┴─────────────┴─────────────┴──────────┘ │
└─────────────────────────────────────────────────────────┘
```

Each recommendation card always shows the AI's **reasoning** inline (collapsed by default, expandable) — this is a core product requirement, not an afterthought, so it should never be hidden behind an extra click-path that judges might miss.

---

## 3. Upload Page

```
┌─────────────────────────────────────────┐
│  Upload Operational Data                 │
│  ┌───────────────────────────────────┐  │
│  │ Data type: [Crowd ▾]               │  │
│  │ [Drag & drop CSV] or [Enter manually]│ │
│  └───────────────────────────────────┘  │
│  [Preview parsed rows table]             │
│  [ Run AI Analysis ]                     │
└───────────────────────────────────────────┘
```

After "Run AI Analysis," redirect to `/organizer` with the new analysis loaded and a brief loading state showing "Gemini is analyzing..." (never a blank screen — always signal AI is actively reasoning).

---

## 4. Incident Detail Page

```
┌─────────────────────────────────────────┐
│  Incident #inc_009          [HIGH RISK]  │
│  Location: Gate B concourse              │
│  Reported by: Volunteer (user_082)       │
│  ─────────────────────────────────────   │
│  Original report:                        │
│  "Fan collapsed near merchandise stand…" │
│  ─────────────────────────────────────   │
│  AI Summary:                             │
│  "Medical incident: fan collapsed,       │
│   conscious, disoriented, near Gate B."  │
│  ─────────────────────────────────────   │
│  Status: [Open ▾]   [Assign Volunteer]   │
└─────────────────────────────────────────┘
```

---

## 5. Volunteer Dashboard Layout

Mobile-first, single-column, large tap targets — this is used on-the-move.

```
┌───────────────────────────┐
│  My Tasks        [Profile]│
├───────────────────────────┤
│  🔴 URGENT                 │
│  Direct crowd to Gate C    │
│  📍 Gate A exterior         │
│  "Gate A is over capacity. │
│   Stand near the north     │
│   barrier and redirect…"   │
│  [ Acknowledge ]           │
├───────────────────────────┤
│  🟡 MEDIUM                 │
│  Assist wayfinding, Gate D │
├───────────────────────────┤
│  [ + Report Incident ]     │
└───────────────────────────┘
```

Priority is always communicated with both color **and** text label (not color alone), for accessibility.

---

## 6. Volunteer Incident Report Flow

```
┌───────────────────────────┐
│  Report Incident           │
│  Location: [auto-detected  │
│   or manual entry]         │
│  What's happening?         │
│  [ text area ]             │
│  [ Submit ]                │
└───────────────────────────┘
```

Kept to two fields deliberately — under time pressure, a volunteer should be able to file a report in under 15 seconds.

---

## 7. Component Inventory

| Component | Used in | Notes |
|---|---|---|
| `RiskBadge` | Organizer header, incident cards | Color + text, not color alone |
| `RecommendationCard` | Organizer dashboard | Title, data summary, expandable reasoning |
| `LiveMap` | Organizer dashboard | Wraps Google Maps JS API, gate/incident/volunteer markers |
| `TaskCard` | Volunteer dashboard | Priority, location, AI instructions, acknowledge button |
| `IncidentForm` | Volunteer report page | Two-field quick submit |
| `DataUploadForm` | Organizer upload page | CSV drop zone + manual entry toggle |
| `AnalysisLoadingState` | Organizer dashboard | Explicit "Gemini is analyzing…" state |

---

## 8. Navigation

- Organizer: persistent left sidebar (desktop) / bottom nav (mobile) — Dashboard, Upload, Incidents, Volunteers.
- Volunteer: single-page task view with a floating "Report Incident" action — deliberately minimal, no sidebar, to reduce cognitive load in the field.

---

## 9. Accessibility Notes

- All risk/priority indicators use icon + color + text (never color alone).
- Minimum 44px tap targets on volunteer mobile views.
- AI reasoning text kept in plain language (enforced by the prompt template in `AI.md`), not jargon, so it's understandable under stress.
