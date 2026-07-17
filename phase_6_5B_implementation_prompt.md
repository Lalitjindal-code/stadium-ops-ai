# Phase 6.5B — Navigation & Layout
## Implementation Prompt: Unified Shell and Layout Wrappers

> **Context**: This phase follows the successful implementation of the Phase 6.5A foundation. The design system tokens, globals.css, and primitive UI components are already in place. Your goal now is to establish the layout shells for the organizer and volunteer personas.

---

## Objective

Create a unified, dark-themed navigation shell across all organizer pages, establish a consistent page transition wrapper, and build the mobile-first header for the volunteer portal.

---

## Design Goals

| Goal | Rule |
|------|------|
| **Unified Shell** | The sidebar should look identical across all organizer pages and use `var(--bg-surface)` as its background. |
| **Consistent Content Area** | Every organizer page must wrap its main content in a `PageWrapper` component to ensure consistent padding and entrance animation (`animate-fade-in-up`). |
| **Lucide Icons** | Replace all emoji icons in the navigation with their professional `lucide-react` equivalents. |
| **Mobile-First Volunteer** | The `VolunteerHeader` must be optimized for a 390px viewport, using a sticky position and high-contrast duty status badge. |
| **Next.js Layout Best Practices** | Introduce an `organizer/layout.tsx` to handle the sidebar and layout shell centrally, rather than duplicating the sidebar import on every page. |

---

## Existing Files to Modify

### 1. Organizer Pages (`app/organizer/page.tsx`, `map/page.tsx`, `scenario/page.tsx`, `assignments/page.tsx`)
**Changes required**:
- Remove the `OrganizerNav` import and component usage.
- Remove the outermost `<div className="flex h-screen...">` and `<main className="flex-1 ml-[220px]...">` wrapper elements, as these will now be handled by `organizer/layout.tsx`.
- Wrap the remaining page content in the new `<PageWrapper>` component.
- *Note*: Leave the actual page content (cards, forms, map) alone. We are only refactoring the layout shell in this phase.

### 2. Volunteer Page (`app/volunteer/page.tsx`)
**Changes required**:
- Remove the existing inline `<header>` element.
- Import and use the new `<VolunteerHeader>` component at the top of the page.
- Keep the `main` content as-is for now.

---

## New Files to Create

### 1. `frontend/src/app/organizer/layout.tsx` (NEW)
A Next.js layout file that wraps all organizer routes.
- Renders the new `OrganizerSidebar`.
- Provides the main flex container (`flex h-screen bg-[var(--bg-base)] font-sans`).
- Provides the `<main className="flex-1 ml-[var(--sidebar-width)] overflow-auto">` content area for `children`.

### 2. `frontend/src/components/layout/OrganizerSidebar.tsx` (NEW)
Replaces the old `OrganizerNav.tsx`.
- Width: `w-[var(--sidebar-width)]` (240px).
- Background: `bg-[var(--bg-surface)] border-r border-[var(--bg-border)]`.
- Logo: Replace stadium emoji with a styled text mark (e.g., "Stadium Ops" in `text-[var(--text-primary)]` with a cyan accent).
- Links: Dashboard (`LayoutDashboard`), Operations Map (`Map`), Scenario Simulator (`Zap`), Resource Optimizer (`Users`), Activity Timeline (`Clock`), Settings (`Settings`).
- Active State: `bg-[var(--primary-700)] bg-opacity-30 border-l-[3px] border-[var(--primary-400)] text-[var(--text-primary)]`.
- Inactive State: `text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]`.
- Add a "SYSTEM STATUS" section at the bottom with live indicators:
  - `● AI Engine Online` (text-safe/green)
  - `● Firebase Connected` (text-safe/green)
  - `32ms latency` (text-tertiary)

### 3. `frontend/src/components/layout/PageWrapper.tsx` (NEW)
A reusable wrapper for the content area of every organizer page.
- Props: `title?: string`, `subtitle?: string`, `actions?: React.ReactNode`, `children: React.ReactNode`, `className?: string`.
- Applies the `.animate-fade-in-up` class to the outermost div.
- Applies consistent `p-8` padding.
- If `title` is provided, renders a `<SectionHeader title={title} subtitle={subtitle} actions={actions} />` at the top.

### 4. `frontend/src/components/layout/VolunteerHeader.tsx` (NEW)
Mobile-first top bar for the volunteer portal.
- Layout: `sticky top-0 z-50 bg-[var(--bg-surface)] border-b border-[var(--bg-border)] px-4 py-3 flex justify-between items-center`.
- Left side: Stadium Icon (Lucide `Building2`) + "Volunteer Portal" text + "FIFA 2026" subtitle.
- Right side: `<Badge variant="safe" label="On Duty" />` (using the UI component from Phase A) and a Logout button (using `<Button variant="ghost" size="sm">`).

### 5. `frontend/src/components/layout/index.ts` (NEW)
Barrel export for layout components:
```typescript
export { default as OrganizerSidebar } from './OrganizerSidebar';
export { default as PageWrapper } from './PageWrapper';
export { default as VolunteerHeader } from './VolunteerHeader';
```

---

## Components Affected (Deleted)
- Delete `frontend/src/components/OrganizerNav.tsx` (replaced by `OrganizerSidebar`).

---

## Constraints

1. **Tokens Only**: Use CSS variables (`var(--bg-surface)`, etc.) for all colors. No Tailwind hardcoded hex colors or standard color classes like `bg-slate-900`.
2. **Phase Isolation**: Do not redesign the internal content of the pages (e.g., the map itself, the scenario cards). Only modify the wrappers and headers.
3. **Routing**: Ensure all `Link` components in the sidebar point to the correct Next.js routes (`/organizer`, `/organizer/map`, `/organizer/scenario`, `/organizer/assignments`, `/organizer/timeline`, `/organizer/settings`). Note: `timeline` and `settings` pages don't exist yet, but the links should be added now.
4. **Imports**: Utilize the primitive UI components created in Phase A (`Badge`, `Button`, `SectionHeader`) inside the new layout components.

---

## Acceptance Criteria

- [ ] `OrganizerSidebar` renders on the left side of all `/organizer/*` pages with a width of 240px and a dark surface background.
- [ ] Active navigation links in the sidebar display a visible left border and distinct background color.
- [ ] The new `SYSTEM STATUS` section is visible at the bottom of the sidebar.
- [ ] All 4 organizer pages use `<PageWrapper>` and exhibit a smooth fade-in-up entrance animation on load.
- [ ] `app/organizer/layout.tsx` correctly handles the flex layout, completely removing the need for page-level sidebar imports.
- [ ] `VolunteerHeader` is sticky at the top of the volunteer portal, using the new `Badge` and `Button` primitives, and has a dark surface background.
- [ ] The old `OrganizerNav.tsx` file is successfully deleted.
- [ ] No TypeScript errors are introduced.

---

## Verification Checklist

- [ ] Run `npm run dev` and navigate to `/organizer`.
- [ ] Verify the sidebar is dark and uses Lucide icons instead of emojis.
- [ ] Click through all 4 existing sidebar links and verify the active state updates correctly.
- [ ] Verify the page content fades in smoothly upon navigation.
- [ ] Navigate to `/volunteer` and verify the new header looks correct on a narrow viewport (use DevTools responsive mode).
- [ ] Run `npm run type-check` to confirm zero errors.

---

## Rollback Plan

**Before starting — create a Git checkpoint:**
```bash
git add -A && git commit -m "chore: checkpoint before Phase 6.5B layout"
```

**If issues occur:**
1. Delete `app/organizer/layout.tsx` and the `components/layout/` directory.
2. Restore `components/OrganizerNav.tsx` from Git history.
3. Restore the 5 page files (`app/organizer/page.tsx`, `map/page.tsx`, etc.) to their previous state to revert the wrapper changes.

---

## Gemini / AntiGravity Implementation Prompt

> Copy everything below this line and use it as the implementation instruction.

---

### TASK: Phase 6.5B — Navigation & Layout Shell

You are implementing Phase 6.5B of the Stadium Operations AI Dashboard design sprint.
The design system (globals.css and UI primitives) from Phase A is already installed and available in `@/components/ui`.

Your goal is to build the layout shells for the application.

**STEP 1: Create Layout Components**
Create the `frontend/src/components/layout` directory.

1. Create `OrganizerSidebar.tsx`:
   - Width: `w-[var(--sidebar-width)]` (240px).
   - Background: `bg-[var(--bg-surface)] border-r border-[var(--bg-border)]`.
   - Links: Dashboard (`/organizer`), Map (`/organizer/map`), Scenarios (`/organizer/scenario`), Assignments (`/organizer/assignments`), Timeline (`/organizer/timeline`), Settings (`/organizer/settings`).
   - Use Lucide icons: `LayoutDashboard, Map, Zap, Users, Clock, Settings`.
   - Active state styling: `bg-[var(--primary-700)] bg-opacity-30 border-l-[3px] border-[var(--primary-400)] text-[var(--text-primary)]`.
   - Inactive state styling: `text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] border-l-[3px] border-transparent`.
   - Bottom section: System Status with static "AI Engine Online" (green dot) and "Firebase Connected" (green dot).

2. Create `PageWrapper.tsx`:
   - Wraps children in a div with `animate-fade-in-up p-8 max-w-[var(--max-content-width)] mx-auto w-full`.
   - Accepts `title`, `subtitle`, and `actions`. If `title` is provided, render the `SectionHeader` from `@/components/ui/SectionHeader` at the top, followed by children.

3. Create `VolunteerHeader.tsx`:
   - Mobile-first sticky header: `sticky top-0 z-50 bg-[var(--bg-surface)] border-b border-[var(--bg-border)] px-4 py-3 flex justify-between items-center`.
   - Left: Icon (`Building2`) + "Volunteer Portal" text.
   - Right: Use `<Badge variant="safe" label="On Duty" />` and `<Button variant="ghost" size="sm">Log out</Button>` (import from `@/components/ui`).

4. Create `index.ts` in the layout directory to export these three components.

**STEP 2: Refactor Organizer Pages to use Next.js Layout**
1. Create `frontend/src/app/organizer/layout.tsx`.
   - It should render `<div className="flex h-screen bg-[var(--bg-base)] font-sans">`.
   - Inside, render `<OrganizerSidebar />`.
   - Next to it, render `<main className="flex-1 ml-[var(--sidebar-width)] overflow-auto">{children}</main>`.
2. Update the 4 organizer pages (`page.tsx`, `map/page.tsx`, `scenario/page.tsx`, `assignments/page.tsx`):
   - Remove the `OrganizerNav` import and `<OrganizerNav />` rendering.
   - Remove the outer flex div and main div that duplicated the layout.
   - Wrap the remaining content in `<PageWrapper>`.
   - Pass a relevant `title` to `PageWrapper` if appropriate, or leave it blank if the page has its own custom header (like the Map).

**STEP 3: Update Volunteer Page**
1. In `frontend/src/app/volunteer/page.tsx`:
   - Remove the existing inline `<header>` element and its contents.
   - Import and render `<VolunteerHeader />` at the top.
   - Ensure the `handleLogout` logic is passed down or handled correctly if moved (you may need to pass a logout function as a prop to `VolunteerHeader` or move the auth logic inside it).

**STEP 4: Cleanup**
1. Delete `frontend/src/components/OrganizerNav.tsx`.
2. Run `npm run type-check` to ensure no errors.
