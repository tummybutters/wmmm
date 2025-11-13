# Landing Page Visual Guide

## 🎨 Section-by-Section Breakdown

### 1. Hero Section (Full Viewport)
```
┌────────────────────────────────────────────────────┐
│                                                    │
│  [constellation dot]      [constellation dot]     │
│                                                    │
│              World Model                           │
│              Journal                               │
│         (teal-to-purple gradient)                  │
│                                                    │
│      A daily mirror for your reasoning.           │
│                                                    │
│         [Start Journaling] → /login               │
│        (glowing gradient button)                   │
│                                                    │
│  [constellation dot]    [constellation dot]       │
│                                                    │
└────────────────────────────────────────────────────┘
Background: Deep indigo-950 → black → slate-900
```

### 2. About Section
```
┌────────────────────────────────────────────────────┐
│                                                    │
│  Your ideas          │  The Journal observes.     │
│  evolve              │  Each thought, each        │
│  (gradient accent)   │  prediction becomes a      │
│                      │  data point in your        │
│                      │  personal archive of       │
│                      │  understanding.            │
│                      │  ──────────────────        │
│                                                    │
└────────────────────────────────────────────────────┘
Background: Pure black
```

### 3. How It Works (Three Cards)
```
┌────────────────────────────────────────────────────┐
│                                                    │
│          How It Works                              │
│                                                    │
│  ┌─────┐      ┌─────┐      ┌─────┐              │
│  │  ✎  │      │  ◈  │      │  ◉  │              │
│  │     │      │     │      │     │              │
│  │Write│      │Pred-│      │Refl-│              │
│  │     │      │ict  │      │ect  │              │
│  │Cap- │      │Quan-│      │See  │              │
│  │ture │      │tify │      │cog- │              │
│  │bel- │      │unc- │      │nit- │              │
│  │iefs │      │ert- │      │ive  │              │
│  │     │      │ainty│      │patt-│              │
│  │     │      │     │      │erns │              │
│  └─────┘      └─────┘      └─────┘              │
│                                                    │
└────────────────────────────────────────────────────┘
Background: Slate-950 with gradient
Cards: Semi-transparent slate-900 with hover effects
```

### 4. Quote Section
```
┌────────────────────────────────────────────────────┐
│                                                    │
│          "                                         │
│                                                    │
│      Understanding begins when we                 │
│      measure our own minds.                       │
│                                                    │
│                                         "          │
│            ──────────                              │
│                                                    │
└────────────────────────────────────────────────────┘
Background: Pure black
Quote marks: Faded teal/purple
```

### 5. Call-to-Action
```
┌────────────────────────────────────────────────────┐
│                                                    │
│        Begin your observation                      │
│                                                    │
│       [Sign In to Begin] → /login                 │
│      (glowing gradient button                     │
│       with blur effect)                            │
│                                                    │
└────────────────────────────────────────────────────┘
Background: Black → indigo-950 gradient
```

### 6. Footer
```
┌────────────────────────────────────────────────────┐
│  © 2025 World Model Journal. Crafted for thinkers.│
└────────────────────────────────────────────────────┘
Background: Deep indigo-950
Text: Small, gray-500
```

## 🎬 Animation Timeline

### On Page Load
```
0.0s: Hero title fades in, slides up (20px)
0.2s: Hero subtitle fades in, slides up
0.4s: Hero button fades in, slides up
```

### On Scroll
```
About section enters → fade in, slide up (0.8s)
How It Works cards enter → staggered fade-in:
  - Card 1: 0.0s delay
  - Card 2: 0.2s delay
  - Card 3: 0.4s delay
Quote enters → fade in (0.8s)
CTA enters → fade in (0.8s)
```

### Hover Effects
```
Hero button: Shadow intensity increases
CTA button: Blur glow expands
Cards: Border color shifts to teal-500/30
```

## 📱 Responsive Breakpoints

### Mobile (< 768px)
- Title: 6xl (text-6xl) → Single column
- Cards: Stacked vertically
- Padding: Reduced to 4rem
- Buttons: Full width on small screens

### Desktop (≥ 768px)
- Title: 8xl (text-8xl) → Hero spans full width
- Cards: Three columns grid
- Padding: Full 8rem
- Max widths enforced for readability

## 🎨 Color Swatch

```
Primary Backgrounds:
■ #1e1b4b (indigo-950)
■ #000000 (black)
■ #0f172a (slate-900)

Accent Colors:
■ #2dd4bf (teal-400) ────┐
■ #a78bfa (purple-400) ──┘ Gradient
■ #14b8a6 (teal-500) ────┐
■ #8b5cf6 (purple-500) ──┘ Gradient (darker)

Text Colors:
■ #ffffff (white) - primary
■ #d1d5db (gray-300) - secondary
■ #9ca3af (gray-400) - tertiary
■ #6b7280 (gray-500) - footer

Card Backgrounds:
■ rgba(15, 23, 42, 0.5) (slate-900/50)
■ #1e293b (slate-800) - borders
```

## 🔤 Typography Scale

```
Hero Title:      96px / 6rem (text-6xl md:text-8xl)
Section Titles:  48px / 3rem (text-4xl md:text-5xl)
Card Titles:     24px / 1.5rem (text-2xl)
Hero Subtitle:   24px / 1.5rem (text-xl md:text-2xl)
Body Text:       18px / 1.125rem (text-lg)
Footer:          14px / 0.875rem (text-sm)
```

## ✨ Special Effects

### Constellation Dots
- 5 pulsing dots positioned absolutely
- Sizes: 1px × 1px
- Colors: Teal/purple variations
- Animation: Pulse with staggered delays

### Gradient Text
- `bg-clip-text` + `text-transparent`
- Applied to "Journal" in hero
- Applied to "evolve" in about section

### Button Glow
- Two-layer effect:
  1. Solid gradient background
  2. Blurred duplicate underneath
- Hover: Blur opacity increases

### Card Hover
- Transition: 300ms ease
- Border color: slate-800 → teal-500/30
- No transform (keeps it subtle)

## 🎯 Visual Hierarchy

```
1. Hero title (largest, serif)
   ↓
2. Hero subtitle (large, sans)
   ↓
3. Section headings (serif)
   ↓
4. Body text (sans)
   ↓
5. Footer (smallest, muted)
```

## 🌙 Mood Board References

Think of:
- **Interstellar** movie UI (minimal, cosmic)
- **Observatory control rooms** (dark, precise)
- **Notion** landing (clean, modern)
- **Linear** aesthetics (gradient accents)
- **Stripe** spacing (generous whitespace)

**NOT like:**
- Flashy SaaS pages with 10 animations
- Cluttered dashboards
- Neon cyberpunk
- Corporate stock photos

---

**Visual Style**: Celestial minimalism  
**Mood**: Contemplative, intelligent, serene  
**Era**: Contemporary (2024-2025)

