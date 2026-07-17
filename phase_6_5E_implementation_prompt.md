# Phase 6.5E — Scenario & Assignments Redesign

## Objective
Implement Phase 6.5E of the MVP redesign. Update the Scenario Simulator and Volunteer Assignments pages to adhere strictly to the Phase 6.5A dark theme design system and layout shell, ensuring visual consistency across the entire organizer dashboard.

## Scope of Work

### 1. Update Scenario Simulator Page (`frontend/src/app/organizer/scenario/page.tsx`)
- Wrap the page in the Phase 6.5B `PageWrapper`.
- Ensure the background uses the `var(--bg-base)` and text uses `var(--text-primary)`/`var(--text-secondary)`.
- Update the scenario selection checkboxes to use dark mode pills (`bg-[var(--bg-elevated)]` unselected, `bg-[var(--primary-500)]` or `border-[var(--primary-400)]` when selected).
- Update the Severity dropdown to a dark-styled select input.
- Redesign the Results grid to use dark cards (`bg-[var(--bg-surface)]`) with colored left borders corresponding to risk level.
- Replace any hardcoded light mode skeletons with the dark shimmer skeleton (using `animate-pulse` and `bg-[var(--bg-elevated)]`).
- Replace hardcoded priority tags with the centralized `<Badge>` component from `components/ui/Badge.tsx`.

### 2. Update Assignments Page (`frontend/src/app/organizer/assignments/page.tsx`)
- Wrap the page in the Phase 6.5B `PageWrapper`.
- Apply global dark theme backgrounds (`var(--bg-base)`).
- Redesign assignment cards to use `bg-[var(--bg-surface)]` or `bg-[var(--bg-elevated)]` with semantic priority borders on the left side.
- Update the resource summary panel to a dark stats panel.
- Redesign the AI Reasoning section to use a dark background with a distinctive left border (e.g., cyan/accent) matching the style used in the AI summary card from Phase 6.5C.
- Replace any inline priority styling with the centralized `<Badge>` component.

### 3. Update Badge Component Usage (`frontend/src/components/ui/Badge.tsx`)
- Ensure the `Badge` primitive is properly exported and supports the semantic variants (Critical, High, Medium, Low, Info).
- Ensure both the Scenario and Assignments pages use this component exclusively for priority labels.

## Execution Constraints
- **Zero Redesign Scope Creep**: Do not invent new features or alter backend API logic.
- **Strict Token Usage**: Only use `var(--bg-*)`, `var(--text-*)`, `var(--primary-*)`, `var(--risk-*)`, etc. Remove any hardcoded `bg-white`, `bg-gray-*`, `text-slate-*` from these pages.
- **Maintain TypeScript Strictness**: Do not introduce any new `any` types or `@ts-ignore` directives. Maintain 0 TypeScript errors.

## Deliverables
After executing this plan, provide:
1. Files created/modified.
2. A summary of changes made.
3. Verification results demonstrating no TypeScript errors and that the UI aligns with the dark theme.
