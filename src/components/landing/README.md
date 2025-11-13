# Landing Page Components

Clean, minimal landing page for World Model Journal with a mystic, observatory aesthetic.

## Structure

- **Hero.tsx** - Full-screen hero with gradient background, title, subtitle, and CTA button
- **About.tsx** - Two-column text introducing the concept
- **HowItWorks.tsx** - Three cards explaining the core workflow
- **Quote.tsx** - Centered blockquote with decorative quotes
- **CTA.tsx** - Final call-to-action with glowing button
- **Footer.tsx** - Minimal copyright footer

## Customization

All text content is in the component files and easily editable.

### Key Text Sections

**Hero** (`Hero.tsx`):
- Title: "World Model Journal"
- Subtitle: "A daily mirror for your reasoning."
- Button: "Start Journaling" → /login

**About** (`About.tsx`):
- Describes how the journal observes and tracks beliefs

**How It Works** (`HowItWorks.tsx`):
- Write: Capture beliefs
- Predict: Quantify uncertainty
- Reflect: See patterns emerge

**Quote** (`Quote.tsx`):
- "Understanding begins when we measure our own minds."

**CTA** (`CTA.tsx`):
- "Begin your observation"
- Button: "Sign In to Begin" → /login

## Styling

### Color Palette
- Background: `from-indigo-950 via-black to-slate-900`
- Accent gradient: `from-teal-400 to-purple-400`
- Text: white with gray-300/400 for secondary

### Typography
- Headings: Playfair Display (serif) via `font-serif`
- Body: Inter (sans-serif) - inherited from layout

### Animations
- Framer Motion for fade-in on scroll
- Subtle entrance animations (opacity + y-offset)
- Gentle hover effects on buttons and cards

## Performance

- Next.js 14 App Router
- Server components where possible
- Client components (`'use client'`) only for animations
- Optimized fonts via next/font
- No heavy JS dependencies beyond Framer Motion

