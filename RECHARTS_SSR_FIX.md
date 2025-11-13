# Recharts SSR Error Fix

## 🐛 Error

After clicking the magic link and redirecting to `/dashboard`:

```
Server Error
Error: Super expression must either be null or a function
```

**Location**: `node_modules/recharts/es6/component/TooltipBoundingBox.js`

## 🔍 Root Cause

The dashboard page is a **Server Component** by default in Next.js 14 App Router, but **Recharts is a client-side only library**. 

Recharts uses React component classes that require the browser environment and don't work with Server-Side Rendering (SSR).

## ✅ Solution

Extracted the chart into a separate **Client Component**:

### New File: `src/components/WordFrequencyChart.tsx`
- Added `'use client'` directive at the top
- Isolated all Recharts imports and usage
- Takes data as props from Server Component

### Updated: `src/app/dashboard/page.tsx`
- Removed Recharts imports (BarChart, Bar, XAxis, etc.)
- Replaced inline chart JSX with `<WordFrequencyChart data={topWords} />`
- Remains a Server Component (can fetch data server-side)

## 🎯 Architecture Pattern

```
Server Component (dashboard/page.tsx)
    ↓ fetches data server-side
    ↓ passes data as props
Client Component (WordFrequencyChart.tsx)
    ↓ renders Recharts in browser
```

This is the recommended pattern for Next.js 14:
- **Server Components**: Data fetching, business logic
- **Client Components**: Interactive UI, browser-only libraries

## 🧪 How to Test

1. **Restart your dev server**:
```bash
npm run dev
```

2. **Sign in via magic link**:
   - Visit `http://localhost:3000`
   - Click "Start Journaling"
   - Enter email and send magic link
   - Click link in email

3. **Should redirect to `/dashboard`**:
   - ✅ No more Recharts error
   - ✅ Dashboard loads successfully
   - ✅ Charts render (if you have data)
   - ✅ Metrics cards display

## 📁 Files Changed

**New:**
- `src/components/WordFrequencyChart.tsx` - Client component for chart

**Modified:**
- `src/app/dashboard/page.tsx` - Uses new client component

## 🔧 Other Client-Only Libraries

If you add other browser-only libraries in the future, use the same pattern:

**Examples of client-only libraries:**
- `recharts` ✅ Fixed
- `react-chartjs-2`
- `react-map-gl`
- `framer-motion` (already using in landing page)
- Libraries that use `window`, `document`, `localStorage`

**How to fix:**
1. Create a separate component with `'use client'`
2. Import the library in that component
3. Pass data from Server Component as props

## ✨ Benefits

- ✅ **Faster initial load** - Dashboard HTML pre-rendered on server
- ✅ **Better SEO** - Content visible to crawlers
- ✅ **Smaller JS bundle** - Chart code only loads when needed
- ✅ **Cleaner separation** - Data fetching vs. rendering

## 📚 Learn More

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [When to use Server vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)

---

**Status**: Fixed ✅  
**Date**: November 6, 2025

