# Chess Platform UI Design System & Component Architecture

## 1. Design System Foundation

### Color Palette

#### Primary Colors
```css
/* Chess Board & Game Colors */
--primary-light: #f0d9b5;    /* Light squares */
--primary-dark: #b58863;     /* Dark squares */
--primary-accent: #769656;   /* Move highlight */
--primary-selected: #baca2b; /* Selected piece */
--primary-check: #ff6b6b;    /* Check/danger */
--primary-capture: #fd79a8;  /* Capture highlight */

/* Brand Colors */
--brand-primary: #2563eb;    /* Blue 600 - main brand */
--brand-secondary: #7c3aed;  /* Violet 600 - secondary actions */
--brand-accent: #06b6d4;     /* Cyan 500 - success states */
```

#### Semantic Colors
```css
/* Success/Error/Warning */
--success: #10b981;          /* Emerald 500 */
--error: #ef4444;            /* Red 500 */
--warning: #f59e0b;          /* Amber 500 */
--info: #3b82f6;             /* Blue 500 */

/* Neutral Scale (Dark Mode First) */
--neutral-50: #f9fafb;       /* Light backgrounds */
--neutral-100: #f3f4f6;      /* Subtle backgrounds */
--neutral-200: #e5e7eb;      /* UI element borders */
--neutral-300: #d1d5db;      /* UI element borders, disabled content */
--neutral-400: #9ca3af;      /* Placeholder text */
--neutral-500: #6b7280;      /* Body text */
--neutral-600: #4b5563;      /* Headings */
--neutral-700: #374151;      /* Headings, dark mode body */
--neutral-800: #1f2937;      /* Dark mode backgrounds */
--neutral-900: #111827;      /* Dark mode primary backgrounds */
```

#### Accessibility-First Color System
```css
/* WCAG 2.1 AA Compliant Contrast Ratios */
.light-theme {
  --text-primary: #111827;     /* 15.8:1 contrast ratio */
  --text-secondary: #374151;   /* 9.5:1 contrast ratio */
  --text-tertiary: #6b7280;    /* 4.5:1 contrast ratio */
  --background: #ffffff;
  --surface: #f9fafb;
  --surface-elevated: #ffffff;
  --border: #e5e7eb;
}

.dark-theme {
  --text-primary: #f9fafb;     /* 16.2:1 contrast ratio */
  --text-secondary: #d1d5db;   /* 10.1:1 contrast ratio */
  --text-tertiary: #9ca3af;    /* 4.7:1 contrast ratio */
  --background: #111827;
  --surface: #1f2937;
  --surface-elevated: #374151;
  --border: #4b5563;
}
```

### Typography Scale

#### Font Stack
```css
/* Primary Font - System UI (Fast Loading) */
--font-primary: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;

/* Monospace - For notation, timers, ratings */
--font-mono: 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', 
             'Oxygen Mono', 'Ubuntu Mono', monospace;

/* Chess Notation Font */
--font-notation: 'Chess Lucida', 'Chess Alpha', monospace;
```

#### Type Scale (1.25 - Major Third)
```css
--text-xs: 0.75rem;      /* 12px - Fine print, captions */
--text-sm: 0.875rem;     /* 14px - Supporting text */
--text-base: 1rem;       /* 16px - Body text */
--text-lg: 1.125rem;     /* 18px - Emphasis */
--text-xl: 1.25rem;      /* 20px - Small headings */
--text-2xl: 1.5rem;      /* 24px - Medium headings */
--text-3xl: 1.875rem;    /* 30px - Large headings */
--text-4xl: 2.25rem;     /* 36px - XL headings */
--text-5xl: 3rem;        /* 48px - Hero text */
--text-6xl: 3.75rem;     /* 60px - Display text */
```

#### Font Weights & Line Heights
```css
--font-light: 300;       /* Rare usage */
--font-normal: 400;      /* Body text */
--font-medium: 500;      /* Emphasis, UI labels */
--font-semibold: 600;    /* Headings, important UI */
--font-bold: 700;        /* Strong emphasis */
--font-extrabold: 800;   /* Hero text, branding */

--leading-tight: 1.25;   /* Headlines */
--leading-snug: 1.375;   /* Sub-headlines */
--leading-normal: 1.5;   /* Body text */
--leading-relaxed: 1.625; /* Long form reading */
```

### Spacing System (8px Grid)

#### Base Unit: 8px
```css
--space-px: 1px;         /* Border, dividers */
--space-0-5: 0.125rem;   /* 2px - Fine adjustments */
--space-1: 0.25rem;      /* 4px - Small gaps */
--space-2: 0.5rem;       /* 8px - Base unit */
--space-3: 0.75rem;      /* 12px - Small components */
--space-4: 1rem;         /* 16px - Component padding */
--space-5: 1.25rem;      /* 20px - Component spacing */
--space-6: 1.5rem;       /* 24px - Section spacing */
--space-8: 2rem;         /* 32px - Large components */
--space-10: 2.5rem;      /* 40px - Section dividers */
--space-12: 3rem;        /* 48px - Layout spacing */
--space-16: 4rem;        /* 64px - Page sections */
--space-20: 5rem;        /* 80px - Large layouts */
--space-24: 6rem;        /* 96px - Hero sections */
```

### Border Radius Standards

#### Consistent Rounding System
```css
--radius-none: 0px;          /* Sharp edges */
--radius-sm: 0.125rem;       /* 2px - Subtle */
--radius-base: 0.25rem;      /* 4px - Default components */
--radius-md: 0.375rem;       /* 6px - Cards, buttons */
--radius-lg: 0.5rem;         /* 8px - Large components */
--radius-xl: 0.75rem;        /* 12px - Modal, panels */
--radius-2xl: 1rem;          /* 16px - Hero sections */
--radius-3xl: 1.5rem;        /* 24px - Large cards */
--radius-full: 9999px;       /* Fully rounded - avatars, pills */
```

### Shadow/Elevation System

#### Depth Levels (Material Design Inspired)
```css
/* Level 0 - Flat */
--shadow-none: none;

/* Level 1 - Slightly raised */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);

/* Level 2 - Default cards */
--shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

/* Level 3 - Raised elements */
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

/* Level 4 - Floating elements */
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

/* Level 5 - Modal, dropdowns */
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

/* Level 6 - Maximum elevation */
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

/* Inner shadows for inset effects */
--shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);

/* Colored shadows for interactive states */
--shadow-primary: 0 4px 14px 0 rgb(37 99 235 / 0.2);
--shadow-error: 0 4px 14px 0 rgb(239 68 68 / 0.2);
--shadow-success: 0 4px 14px 0 rgb(16 185 129 / 0.2);
```

---

## 2. Component Library Architecture

### Base Components (shadcn/ui)

#### Core UI Building Blocks
```
shadcn/ui Components:
├── Layout
│   ├── Container
│   ├── Grid System
│   ├── Flex Utilities
│   └── Aspect Ratio
│
├── Navigation
│   ├── Navigation Menu
│   ├── Breadcrumb
│   ├── Pagination
│   └── Tabs
│
├── Form Components
│   ├── Button (variants: default, destructive, outline, secondary, ghost, link)
│   ├── Input (text, password, email, search)
│   ├── Textarea
│   ├── Select & Combobox
│   ├── Checkbox & Radio Group
│   ├── Switch & Toggle
│   ├── Slider & Range
│   └── Form (with validation)
│
├── Data Display
│   ├── Badge
│   ├── Avatar & Avatar Group
│   ├── Card
│   ├── Table & Data Table
│   ├── Calendar
│   └── Progress Indicators
│
├── Feedback
│   ├── Alert & Alert Dialog
│   ├── Toast & Sonner
│   ├── Loading Spinner
│   ├── Skeleton Loaders
│   └── Command Palette
│
├── Overlays
│   ├── Dialog & Drawer
│   ├── Popover & Tooltip
│   ├── Dropdown Menu
│   ├── Context Menu
│   ├── Hover Card
│   └── Sheet (mobile)
│
└── Specialized
    ├── Resizable Panels
    ├── Scroll Area
    ├── Separator
    └── Toggle Group
```

### Advanced Animation Components (Aceternity UI)

#### Visual Effects for Chess Platform
```
Aceternity UI Components:
├── Chess-Specific Effects
│   ├── Typewriter Effect (for game notation display)
│   ├── Background Beams (for game atmosphere)
│   ├── Glowing Effects (piece highlights, check indicators)
│   ├── 3D Card Effects (for game history, player profiles)
│   └── Container Scroll Animation (for game analysis)
│
├── Micro-Interactions
│   ├── Hover Cards (player info on piece hover)
│   ├── Animated Tabs (game controls, settings)
│   ├── Floating Elements (move suggestions)
│   ├── Collision Effects (piece captures)
│   └── Parallax Scrolling (landing page hero)
│
├── Loading & Transition States
│   ├── Animated Loaders
│   ├── Page Transitions
│   ├── Skeleton Animations
│   └── Staggered Animations
│
└── Interactive Backgrounds
    ├── Animated Grid (chess board inspiration)
    ├── Particle Effects (celebration animations)
    ├── Gradient Animations
    └── Aurora Effects (premium feel)
```

### Special Effects Components (Magic UI)

#### Enhanced User Experience Elements
```
Magic UI Components:
├── Text Animations
│   ├── Text Animate (character/word/line animations)
│   ├── Typing Animation (live game commentary)
│   ├── Hyper Text (scrambling effects for reveals)
│   ├── Blur Fade (smooth content transitions)
│   └── Marquee (scrolling announcements)
│
├── Interactive Beams
│   ├── Animated Beam (connecting players visually)
│   ├── Border Beam (highlighting active elements)
│   └── Multi-directional Beams (complex animations)
│
├── List & Content Animation
│   ├── Animated List (game move history)
│   ├── Flip Text (score updates)
│   ├── Staggered Reveals (feature presentations)
│   └── Sequential Loading
│
├── Visual Effects
│   ├── Hero Video Dialog (tutorial integration)
│   ├── 3D Marquee (testimonials, featured games)
│   ├── Gradient Text Effects
│   └── Dynamic Backgrounds
│
└── Game-Specific Animations
    ├── Piece Movement Trails
    ├── Capture Animations
    ├── Check/Checkmate Effects
    └── Victory Celebrations
```

---

## 3. Custom Chess Components (ASCII Mockups)

### Chess Board Component
```
┌─────────────────────────────────────────────────────────────┐
│                     Chess Board Component                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    ┌─────────────────────────────────────────────────┐     │
│    │ a  b  c  d  e  f  g  h                          │     │
│    │8 ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜ │ Move: 15  White to play    │     │
│    │7 ♟ ♟ ♟ ♟ ♟ ♟ ♟ ♟ │ Timer: ⏱️ 5:23           │     │
│    │6 ▢ ▣ ▢ ▣ ▢ ▣ ▢ ▣ │                             │     │
│    │5 ▣ ▢ ▣ ▢ ▣ ▢ ▣ ▢ │ Last Move:                 │     │
│    │4 ▢ ▣ ▢ ▣ ♙ ▣ ▢ ▣ │ ♙ e2-e4 (opening)          │     │
│    │3 ▣ ▢ ▣ ▢ ▣ ▢ ▣ ▢ │                             │     │
│    │2 ♙ ♙ ♙ ♙ ▢ ♙ ♙ ♙ │ Captured:                  │     │
│    │1 ♖ ♘ ♗ ♕ ♔ ♗ ♘ ♖ │ ♟♟ (Black: +2 points)     │     │
│    │  a  b  c  d  e  f  g  h                          │     │
│    └─────────────────────────────────────────────────┘     │
│                                                             │
│  States:                                                    │
│  • Default: Normal square colors                            │
│  • Selected: ♔ glowing border + possible moves highlighted  │
│  • Legal Move: Green dot overlay ●                          │
│  • Last Move: Yellow highlight background                   │
│  • Check: Red glow around king ♔⚡                          │
│  • Pre-move: Semi-transparent ghost piece                   │
│                                                             │
│  Interactions:                                              │
│  • Click-to-select + click-to-move                          │
│  • Drag-and-drop with visual feedback                       │
│  • Keyboard navigation (accessibility)                      │
│  • Touch gestures (mobile: tap, drag)                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Game Control Panel Component  
```
┌─────────────────────────────────────────────────────────────┐
│                   Game Control Panel                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │    🏃 RESIGN │ │  🤝 OFFER   │ │   💬 CHAT    │          │
│  │             │ │     DRAW    │ │              │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   ⚙️ SETTINGS│ │  📊 ANALYSIS│ │  🎯 HINTS    │          │
│  │             │ │             │ │   (Beginner) │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                             │
│  Progressive Complexity States:                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Beginner Mode:                                      │   │
│  │ • Show hints button                                 │   │
│  │ • Simplified resign (with confirmation)             │   │
│  │ • Draw offer with explanation                       │   │
│  │ • Larger touch targets (56px minimum)               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Expert Mode:                                        │   │
│  │ • All options available                             │   │
│  │ • Quick actions (keyboard shortcuts)                │   │
│  │ • Advanced analysis tools                           │   │
│  │ • Compact layout for more board space               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Player Info Card Component
```
┌─────────────────────────────────────────────────────────────┐
│                    Player Info Card                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 👤 AliceChess94          🟢 Online      ⏱️ 4:23    │   │
│  │    Rating: 1285 (+15)    🔥 Streak: 3   🏆 Peak:   │   │
│  │                                          1320      │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ ████████████████████████████░░░░░░░░░░░░  75% Win   │   │
│  │ Games Played: 156  •  Rapid: 1285  •  Blitz: 1156  │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ 🎯 Currently: Winning (+2.1 advantage)              │   │
│  │ ♟ Captured: ♙♘ (+5 points)                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Component States:                                          │
│  • Online: Green indicator + real-time status              │
│  • In Game: Yellow indicator + "busy" message              │
│  • Offline: Gray indicator + last seen time                │
│  • Profile Hover: Expanded stats with animation            │
│                                                             │
│  Accessibility Features:                                    │
│  • Screen reader friendly status announcements             │
│  • High contrast mode support                              │
│  • Keyboard navigation for all interactive elements        │
│  • Focus indicators for all states                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Move History Component
```
┌─────────────────────────────────────────────────────────────┐
│                     Move History                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  #  White    Black     Time     Eval              │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ 1.  e4       e5       0.5s      +0.2              │   │
│  │ 2.  Nf3      Nc6      1.2s      +0.1              │   │
│  │ 3.  Bb5      a6       0.8s      +0.3              │   │
│  │ 4.  Ba4      Nf6      1.5s      +0.2              │   │
│  │ 5.  O-O      Be7      2.1s      +0.4              │   │
│  │ 6.  Re1      b5       1.8s      +0.3              │   │
│  │ 7.  Bb3      d6       2.3s      +0.5              │   │
│  │ 8.  c3       O-O      1.9s      +0.4   ◀ Current  │   │
│  │                                                     │   │
│  │ ▼ Scroll for more moves                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Features:                                                  │
│  • Click any move to jump to that position                 │
│  • Evaluation bar shows advantage (+/-/=)                  │
│  • Time per move tracking                                  │
│  • Opening name detection (after 8+ moves)                 │
│  • Keyboard navigation (↑↓ arrow keys)                     │
│                                                             │
│  Animations:                                                │
│  • New moves slide in from right with Magic UI             │
│  • Current move highlighted with border beam               │
│  • Smooth scrolling to keep current move visible           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Quick Match Finder Component
```
┌─────────────────────────────────────────────────────────────┐
│                  Quick Match Finder                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                🎯 FIND GAME                         │   │
│  │                                                     │   │
│  │  Time Control:                                      │   │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │   │
│  │  │ 1+0  │ │ 3+2  │ │ 5+5  │ │10+0  │ ◀ Selected   │   │
│  │  │Bullet│ │Blitz │ │Rapid │ │Rapid │              │   │
│  │  └──────┘ └──────┘ └──────┘ └──────┘              │   │
│  │                                                     │   │
│  │  Rating Range: 1150 - 1250 (±50 from your 1200)   │   │
│  │  ████████████████████████░░░░░░░░░░ Expand Range   │   │
│  │                                                     │   │
│  │  Game Type:                                         │   │
│  │  ◉ Rated    ○ Casual    ○ Practice with AI         │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │              🚀 START SEARCH                │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  Estimated wait time: ~30 seconds                  │   │
│  │  👥 159 players looking for games                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Search States:                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Searching:                                          │   │
│  │ • Animated loading with Magic UI beam effects       │   │
│  │ • Real-time player count updates                    │   │
│  │ • Option to cancel or modify search                 │   │
│  │ • "Play AI instead" alternative offered             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Interaction Design & Micro-Animations

### Framer Motion Configuration

#### Animation Timing & Easing
```typescript
// Chess Platform Animation Presets
export const chessPlatformAnimations = {
  // Fast, snappy interactions
  quickActions: {
    duration: 0.15,
    ease: [0.4, 0, 0.2, 1], // easeOutCubic
  },
  
  // Standard UI transitions  
  uiTransitions: {
    duration: 0.25,
    ease: [0.4, 0, 0.2, 1],
  },
  
  // Piece movements on board
  pieceMovement: {
    duration: 0.3,
    ease: [0.23, 1, 0.32, 1], // easeOutQuart
  },
  
  // Page/section transitions
  pageTransitions: {
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1],
  },
  
  // Special effects (captures, check)
  gameEffects: {
    duration: 0.6,
    ease: [0.23, 1, 0.32, 1],
  },
  
  // Loading and data updates
  dataUpdates: {
    duration: 0.8,
    ease: [0.4, 0, 0.2, 1],
  }
};
```

#### Component Animation States
```typescript
// Hover States
export const hoverEffects = {
  chessSquare: {
    hover: {
      backgroundColor: 'var(--primary-accent)',
      scale: 1.02,
      transition: chessPlatformAnimations.quickActions
    }
  },
  
  chessPiece: {
    hover: {
      scale: 1.1,
      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
      transition: chessPlatformAnimations.quickActions
    }
  },
  
  gameButton: {
    hover: {
      scale: 1.05,
      boxShadow: 'var(--shadow-lg)',
      transition: chessPlatformAnimations.quickActions
    },
    tap: { scale: 0.95 }
  }
};

// Loading States
export const loadingAnimations = {
  searchingForGame: {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  
  pieceCapture: {
    initial: { scale: 1, opacity: 1 },
    animate: {
      scale: 0,
      opacity: 0,
      rotate: 360,
      transition: chessPlatformAnimations.gameEffects
    }
  }
};

// Page Transitions
export const pageTransitions = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: chessPlatformAnimations.pageTransitions
  },
  
  slideLeft: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
    transition: chessPlatformAnimations.pageTransitions
  }
};
```

#### Gesture Responses (Mobile)
```typescript
// Touch/Drag Configurations
export const gestureConfig = {
  pieceSelection: {
    dragConstraints: { top: 0, left: 0, right: 0, bottom: 0 },
    dragElastic: 0.1,
    onDragStart: () => {
      // Haptic feedback on supported devices
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    },
    whileDrag: {
      scale: 1.2,
      zIndex: 999,
      filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))'
    }
  },
  
  swipeGestures: {
    swipeThreshold: 50,
    swipeVelocityThreshold: 300
  }
};
```

---

## 5. Interaction Priority Matrix

### Performance-Critical Interactions (< 16ms)
1. **Chess piece hover** - Immediate visual feedback
2. **Square highlighting** - Legal move indicators  
3. **Piece selection** - Visual state change
4. **Timer updates** - Real-time countdown display

### Standard Interactions (< 100ms)
1. **Piece movement** - Smooth animation to destination
2. **Button clicks** - State changes and navigation
3. **Move validation** - Legal move checking
4. **Game state updates** - Score, captures, etc.

### Enhanced Interactions (< 300ms)  
1. **Page transitions** - Between game screens
2. **Modal animations** - Settings, dialogs
3. **Data loading** - Player info, game history
4. **Search animations** - Matchmaking feedback

### Special Effects (< 600ms)
1. **Capture animations** - Piece elimination effects
2. **Check/checkmate** - Dramatic visual feedback  
3. **Game completion** - Victory/defeat animations
4. **Achievement unlocks** - Celebration effects

---

## 6. Component Variants & States

### Button System
```typescript
// Button Variants (shadcn/ui extended)
interface ButtonVariant {
  default: 'Primary actions, main CTAs';
  destructive: 'Resign game, delete account';
  outline: 'Secondary actions, filters';
  secondary: 'Less important actions';
  ghost: 'Subtle actions, navigation';
  link: 'Text-based actions, links';
  
  // Chess-specific variants
  gameAction: 'In-game actions (resign, draw, etc.)';
  timeControl: 'Time selection buttons';
  boardControl: 'Board manipulation (flip, analyze)';
  socialAction: 'Friend requests, challenges';
}

// Size Variants
interface ButtonSize {
  sm: '32px height, compact spacing';
  default: '40px height, standard';  
  lg: '48px height, prominent CTAs';
  icon: 'Square aspect ratio for icons';
}

// State Variants  
interface ButtonState {
  enabled: 'Default interactive state';
  disabled: 'Non-interactive, muted';
  loading: 'In-progress with spinner';
  success: 'Confirmation state';
  error: 'Error state with indication';
}
```

### Chess-Specific Component States
```typescript
// Chess Board States
interface ChessBoardState {
  playing: 'Interactive, player can move';
  analyzing: 'Review mode, can navigate history';
  spectating: 'Viewing only, no interaction';
  setup: 'Position setup for puzzles';
}

// Chess Piece States
interface ChessPieceState {
  normal: 'Default appearance';
  selected: 'Highlighted with move options';
  threatened: 'Under attack indication';
  defending: 'Protecting another piece';
  promoted: 'Recently promoted pawn';
}

// Game Status States
interface GameStatusState {
  active: 'Game in progress';
  check: 'King in check';
  checkmate: 'Game over, checkmate';
  stalemate: 'Game over, stalemate';
  draw: 'Game over, draw agreed';
  timeout: 'Game over, time forfeit';
  resignation: 'Game over, resignation';
}
```

---

## 7. Accessibility Implementation

### Focus Management
```css
/* Custom focus indicators */
.focus-ring {
  outline: 2px solid var(--brand-primary);
  outline-offset: 2px;
  border-radius: var(--radius-base);
}

.focus-ring-chess-square {
  outline: 3px solid var(--brand-accent);
  outline-offset: 1px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Screen Reader Support
```typescript
// ARIA Labels for Chess Components
export const chessAriaLabels = {
  chessBoard: 'Chess board, 8 by 8 grid',
  chessPiece: (piece: string, position: string) => 
    `${piece} on ${position}`,
  legalMove: (from: string, to: string) => 
    `Legal move from ${from} to ${to}`,
  gameStatus: (status: string, player?: string) =>
    `Game status: ${status}${player ? `, ${player} to move` : ''}`,
  timer: (time: string, player: string) =>
    `${player} time remaining: ${time}`
};

// Live Region Updates
export const liveRegionUpdates = {
  moveAnnouncement: (move: string, player: string) =>
    `${player} played ${move}`,
  gameStateChange: (state: string) =>
    `Game state changed to ${state}`,
  playerConnection: (player: string, status: string) =>
    `${player} ${status}`
};
```

### High Contrast Mode
```css
@media (prefers-contrast: high) {
  :root {
    --primary-light: #ffffff;
    --primary-dark: #000000;
    --text-primary: #000000;
    --background: #ffffff;
    --border: #000000;
  }
  
  .dark-theme {
    --text-primary: #ffffff;
    --background: #000000;
    --border: #ffffff;
  }
  
  /* Ensure all interactive elements have sufficient contrast */
  button, .interactive-element {
    border: 2px solid currentColor;
  }
}
```

---

## 8. Implementation Strategy

### Development Phases

#### Phase 1: Foundation (Week 1)
- Set up design token system
- Implement base shadcn/ui components
- Create chess-specific color variables
- Build core layout components

#### Phase 2: Chess Components (Week 2) 
- Develop ChessBoard component with animations
- Implement ChessPiece components with states
- Create PlayerInfo and GameControls
- Add Framer Motion animations

#### Phase 3: Advanced Effects (Week 3)
- Integrate Aceternity UI for special effects
- Implement Magic UI text animations
- Add gesture support for mobile
- Create celebration and feedback animations

#### Phase 4: Polish & Accessibility (Week 4)
- Complete accessibility implementations
- Performance optimization
- Cross-browser testing
- Mobile responsiveness final polish

### Performance Considerations
- **Bundle Size**: Code-split animation libraries
- **Animation Performance**: Use transform and opacity for 60fps
- **Memory Usage**: Cleanup listeners and unused refs
- **Mobile Performance**: Reduce animation complexity on lower-end devices

### Testing Strategy
- **Visual Testing**: Storybook for all component variants
- **Accessibility Testing**: axe-core integration
- **Animation Testing**: Jest + React Testing Library
- **Cross-browser**: Automated testing on major browsers
- **Mobile Testing**: Real device testing for gestures

This design system provides the foundation for building a modern, accessible, and visually engaging chess platform that differentiates itself through progressive complexity and premium user experience.
