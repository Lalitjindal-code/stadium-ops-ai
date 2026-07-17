# DESIGN TOKENS
## AI Stadium Operations Dashboard — Source of Truth for All Visual Values
### Implement these FIRST. Every component references these tokens.

---

## OVERVIEW

Design tokens are the atomic units of the design system. By implementing tokens in a single `globals.css` file, all components automatically inherit changes when tokens are updated. This is non-negotiable for a consistent premium product.

---

## IMPLEMENTATION

### globals.css (complete token file)

```css
/* ============================================
   STADIUM OPS AI — DESIGN TOKENS
   Version 2.0 — Phase 6.5
   ============================================ */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  
  /* ──────────────────────────────────────────
     TYPOGRAPHY
  ────────────────────────────────────────── */
  
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;

  /* Type Scale */
  --text-display-2xl: 3rem;        /* 48px */
  --text-display-xl:  2.25rem;     /* 36px */
  --text-heading-lg:  1.5rem;      /* 24px */
  --text-heading-md:  1.25rem;     /* 20px */
  --text-heading-sm:  1rem;        /* 16px */
  --text-body-lg:     0.9375rem;   /* 15px */
  --text-body-md:     0.8125rem;   /* 13px */
  --text-body-sm:     0.75rem;     /* 12px */
  --text-label-lg:    0.8125rem;   /* 13px */
  --text-label-sm:    0.6875rem;   /* 11px */
  --text-button-lg:   0.875rem;    /* 14px */
  --text-button-sm:   0.75rem;     /* 12px */
  --text-mono-lg:     0.875rem;    /* 14px */
  --text-mono-sm:     0.75rem;     /* 12px */

  /* Font Weights */
  --weight-light:      300;
  --weight-regular:    400;
  --weight-medium:     500;
  --weight-semibold:   600;
  --weight-bold:       700;
  --weight-extrabold:  800;

  /* Line Heights */
  --leading-tight:    1.1;
  --leading-snug:     1.25;
  --leading-normal:   1.5;
  --leading-relaxed:  1.6;
  --leading-loose:    1.75;

  /* Letter Spacing */
  --tracking-tighter: -0.02em;
  --tracking-tight:   -0.01em;
  --tracking-normal:  0em;
  --tracking-wide:    0.03em;
  --tracking-wider:   0.06em;
  --tracking-widest:  0.1em;


  /* ──────────────────────────────────────────
     COLOR SYSTEM
  ────────────────────────────────────────── */

  /* Backgrounds */
  --bg-base:         #080C14;
  --bg-surface:      #0D1421;
  --bg-elevated:     #111927;
  --bg-overlay:      #162033;
  --bg-muted:        #1C2940;
  --bg-border:       rgba(255, 255, 255, 0.06);
  --bg-border-hover: rgba(255, 255, 255, 0.10);

  /* Primary — Indigo */
  --primary-900:  #1E1B4B;
  --primary-800:  #312E81;
  --primary-700:  #3730A3;
  --primary-600:  #4338CA;
  --primary-500:  #4F46E5;
  --primary-400:  #6366F1;
  --primary-300:  #818CF8;
  --primary-200:  #A5B4FC;
  --primary-100:  #C7D2FE;
  --primary-50:   #EEF2FF;

  /* Accent — Cyan (AI color) */
  --accent-600:   #0891B2;
  --accent-500:   #06B6D4;
  --accent-400:   #22D3EE;
  --accent-300:   #67E8F9;
  --accent-glow:  rgba(6, 182, 212, 0.15);

  /* Text Scale */
  --text-primary:   #F1F5F9;
  --text-secondary: #94A3B8;
  --text-tertiary:  #64748B;
  --text-disabled:  #334155;
  --text-link:      #818CF8;

  /* Risk / Status Colors */
  --risk-critical:        #EF4444;
  --risk-critical-bg:     rgba(239, 68, 68, 0.12);
  --risk-critical-border: rgba(239, 68, 68, 0.25);
  --risk-critical-text:   #FCA5A5;
  --risk-critical-glow:   0 0 20px rgba(239, 68, 68, 0.3);

  --risk-high:        #F97316;
  --risk-high-bg:     rgba(249, 115, 22, 0.12);
  --risk-high-border: rgba(249, 115, 22, 0.25);
  --risk-high-text:   #FDBA74;

  --risk-medium:        #EAB308;
  --risk-medium-bg:     rgba(234, 179, 8, 0.12);
  --risk-medium-border: rgba(234, 179, 8, 0.25);
  --risk-medium-text:   #FDE047;

  --risk-safe:        #22C55E;
  --risk-safe-bg:     rgba(34, 197, 94, 0.12);
  --risk-safe-border: rgba(34, 197, 94, 0.25);
  --risk-safe-text:   #86EFAC;

  --info:        #3B82F6;
  --info-bg:     rgba(59, 130, 246, 0.12);
  --info-border: rgba(59, 130, 246, 0.25);
  --info-text:   #93C5FD;

  /* Chart Colors */
  --chart-1: #4F46E5;
  --chart-2: #06B6D4;
  --chart-3: #22C55E;
  --chart-4: #EAB308;
  --chart-5: #F97316;
  --chart-6: #EF4444;
  --chart-7: #A855F7;
  --chart-8: #EC4899;

  /* Heatmap Colors */
  --heat-0: #1E3A5F;
  --heat-1: #1D4ED8;
  --heat-2: #0891B2;
  --heat-3: #059669;
  --heat-4: #D97706;
  --heat-5: #DC2626;
  --heat-6: #7C3AED;


  /* ──────────────────────────────────────────
     SPACING
  ────────────────────────────────────────── */
  
  --space-0:  0px;
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;

  /* Layout Sizes */
  --sidebar-width:        240px;
  --sidebar-collapsed-w: 64px;
  --header-height:        64px;
  --max-content-width:    1440px;


  /* ──────────────────────────────────────────
     BORDER RADIUS
  ────────────────────────────────────────── */
  
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-2xl:  20px;
  --radius-full: 9999px;


  /* ──────────────────────────────────────────
     SHADOWS & ELEVATION
  ────────────────────────────────────────── */
  
  --shadow-sm:  0 1px 2px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.2);
  --shadow-md:  0 4px 16px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3);
  --shadow-lg:  0 8px 32px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.4);
  --shadow-xl:  0 16px 64px rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.5);

  --shadow-glow-primary: 0 0 20px rgba(79, 70, 229, 0.25);
  --shadow-glow-cyan:    0 0 20px rgba(6, 182, 212, 0.25);
  --shadow-glow-red:     0 0 20px rgba(239, 68, 68, 0.3);
  --shadow-glow-green:   0 0 20px rgba(34, 197, 94, 0.25);

  /* Glassmorphism */
  --glass-bg:           rgba(13, 20, 33, 0.7);
  --glass-border:       rgba(255, 255, 255, 0.06);
  --glass-heavy-bg:     rgba(8, 12, 20, 0.85);


  /* ──────────────────────────────────────────
     ANIMATION
  ────────────────────────────────────────── */
  
  --duration-instant: 100ms;
  --duration-fast:    150ms;
  --duration-normal:  200ms;
  --duration-slow:    300ms;
  --duration-enter:   400ms;

  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring:  cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --ease-decel:   cubic-bezier(0, 0, 0.2, 1);
  --ease-accel:   cubic-bezier(0.4, 0, 1, 1);


  /* ──────────────────────────────────────────
     BREAKPOINTS (for JS access via CSS vars)
  ────────────────────────────────────────── */
  
  --bp-sm:  640px;
  --bp-md:  768px;
  --bp-lg:  1024px;
  --bp-xl:  1280px;
  --bp-2xl: 1536px;
}


/* ──────────────────────────────────────────
   BASE RESET & GLOBAL STYLES
────────────────────────────────────────── */

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-sans);
  font-size: var(--text-body-lg);
  font-weight: var(--weight-regular);
  line-height: var(--leading-normal);
  color: var(--text-primary);
  background-color: var(--bg-base);
  min-height: 100vh;
}


/* ──────────────────────────────────────────
   KEYFRAME ANIMATIONS
────────────────────────────────────────── */

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

@keyframes pulseSlow {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
}

@keyframes pulseRing {
  0%   { transform: scale(1);   opacity: 1; }
  100% { transform: scale(1.8); opacity: 0; }
}

@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

@keyframes aiThinkDot {
  0%   { opacity: 0.3; transform: scale(0.8); }
  50%  { opacity: 1;   transform: scale(1.2); }
  100% { opacity: 0.3; transform: scale(0.8); }
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-16px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(16px); }
  to   { opacity: 1; transform: translateX(0); }
}


/* ──────────────────────────────────────────
   ANIMATION UTILITY CLASSES
────────────────────────────────────────── */

.animate-fade-in-up {
  animation: fadeInUp var(--duration-enter) var(--ease-decel) both;
}

.animate-fade-in {
  animation: fadeIn var(--duration-slow) var(--ease-decel) both;
}

.animate-shimmer {
  background: linear-gradient(90deg,
    rgba(255,255,255,0.03) 25%,
    rgba(255,255,255,0.08) 37%,
    rgba(255,255,255,0.03) 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

.animate-pulse-ring::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  animation: pulseRing 1.5s ease-out infinite;
  border: 2px solid currentColor;
}

/* Stagger children */
.stagger > *:nth-child(1) { animation-delay: 0ms; }
.stagger > *:nth-child(2) { animation-delay: 60ms; }
.stagger > *:nth-child(3) { animation-delay: 120ms; }
.stagger > *:nth-child(4) { animation-delay: 180ms; }
.stagger > *:nth-child(5) { animation-delay: 240ms; }
.stagger > *:nth-child(6) { animation-delay: 300ms; }


/* ──────────────────────────────────────────
   SCROLLBAR STYLING
────────────────────────────────────────── */

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255,255,255,0.2);
}


/* ──────────────────────────────────────────
   FOCUS STYLES
────────────────────────────────────────── */

:focus-visible {
  outline: 2px solid var(--primary-400);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

---

## TAILWIND CONFIG MAPPING

```javascript
// tailwind.config.ts additions
// These map design tokens to Tailwind utility classes

theme: {
  extend: {
    colors: {
      // Background scale
      'bg-base':     '#080C14',
      'bg-surface':  '#0D1421',
      'bg-elevated': '#111927',
      'bg-overlay':  '#162033',
      'bg-muted':    '#1C2940',

      // Primary brand
      primary: {
        900: '#1E1B4B',
        800: '#312E81',
        700: '#3730A3',
        600: '#4338CA',
        500: '#4F46E5',
        400: '#6366F1',
        300: '#818CF8',
        200: '#A5B4FC',
        100: '#C7D2FE',
        50:  '#EEF2FF',
      },

      // Accent (AI)
      accent: {
        600: '#0891B2',
        500: '#06B6D4',
        400: '#22D3EE',
        300: '#67E8F9',
      },

      // Text
      'text-primary':   '#F1F5F9',
      'text-secondary': '#94A3B8',
      'text-tertiary':  '#64748B',
    },

    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },

    borderRadius: {
      sm:   '4px',
      md:   '8px',
      lg:   '12px',
      xl:   '16px',
      '2xl':'20px',
    },

    animation: {
      'fade-in-up': 'fadeInUp 400ms cubic-bezier(0, 0, 0.2, 1) both',
      'fade-in':    'fadeIn 300ms cubic-bezier(0, 0, 0.2, 1) both',
      'shimmer':    'shimmer 1.4s ease infinite',
      'pulse-ring': 'pulseRing 1.5s ease-out infinite',
    },
  },
}
```

---

## TOKEN USAGE CHEAT SHEET

### Common Patterns

```tsx
// Card background
className="bg-[var(--bg-elevated)] border border-[var(--bg-border)]"

// Primary button
className="bg-primary-500 hover:bg-primary-400 text-white rounded-lg px-5 py-3"

// Risk badge — critical
className="bg-[var(--risk-critical-bg)] border border-[var(--risk-critical-border)] text-[var(--risk-critical-text)]"

// Monospace data value
className="font-mono text-sm font-medium text-[var(--text-primary)]"

// Section header label
className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--text-tertiary)]"

// AI accent border (left highlight)
className="border-l-[3px] border-l-[var(--accent-500)] pl-4"

// Glass card
className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)]"
```

---

*Design Tokens — Phase 6.5 — Stadium Operations AI*
