# Landing Page & Auth Fixes

## 🐛 Issues Fixed

### Issue 1: Landing Page Not Visible
**Problem**: Users were immediately redirected to `/login` when visiting `/`

**Root Cause**: Middleware was redirecting ALL unauthenticated users to login, including those trying to view the landing page.

**Fix**: Updated `src/middleware.ts` to allow public access to the landing page:
```typescript
const isLandingPage = req.nextUrl.pathname === '/';

if (!user && !isAuthPage && !isAuthCallback && !isLandingPage) {
  // Only redirect if NOT on landing page
}
```

### Issue 2: Magic Link Authentication Not Working
**Problem**: After clicking magic link in email, users weren't being authenticated.

**Root Cause**: Missing auth callback route to exchange the token for a session.

**Fix**: Created `src/app/auth/callback/route.ts` to handle the OAuth/magic link callback:
```typescript
// Exchange the code for a session
await supabase.auth.exchangeCodeForSession(code)
// Then redirect to dashboard
```

**Updated Login Page**: Changed redirect URLs to point to the callback route:
```typescript
emailRedirectTo: `${location.origin}/auth/callback`
```

### Issue 3: Layout Header/Footer Showing on Landing Page
**Problem**: The app header and footer were appearing on the landing page (which has its own design).

**Root Cause**: Layout was rendering the same header/footer for all pages.

**Fix**: 
1. Middleware now passes pathname via header: `res.headers.set('x-pathname', req.nextUrl.pathname)`
2. Layout detects landing page and skips wrapper:
```typescript
const isLandingPage = pathname === '/';
{isLandingPage ? children : <div>header + children + footer</div>}
```

## ✅ Files Changed

### New Files
- `src/app/auth/callback/route.ts` - Auth callback handler

### Modified Files
- `src/middleware.ts` - Allow landing page and auth callback access
- `src/app/layout.tsx` - Conditional rendering for landing page
- `src/app/(auth)/login/page.tsx` - Updated redirect URLs

## 🧪 How to Test

### 1. Landing Page Access (Unauthenticated)
```
✅ Visit http://localhost:3000
✅ Should see the landing page (no redirect)
✅ Should NOT see app header/footer
✅ Should see landing page hero, sections, and custom footer
```

### 2. Magic Link Authentication
```
✅ Click "Start Journaling" or "Sign In to Begin" → goes to /login
✅ Enter email and click "Send magic link"
✅ Should see green success message
✅ Check email inbox (or spam) for magic link
✅ Click the magic link
✅ Should redirect to /auth/callback, then /dashboard
✅ Should now see app header with your email
```

### 3. Authenticated User Experience
```
✅ While logged in, visit /dashboard → works
✅ Visit /entries → works
✅ Visit /bets → works
✅ Visit / → see landing page (not redirected)
✅ Visit /login → redirected to /dashboard
```

### 4. Route Protection
```
✅ Log out
✅ Try to visit /dashboard → redirected to /login
✅ Try to visit /entries → redirected to /login
✅ Try to visit /bets → redirected to /login
✅ Visit / → landing page works (no redirect)
```

## 🔧 Supabase Configuration Required

For magic links to work, you need to configure Supabase:

### 1. Email Templates (Optional but Recommended)
Go to **Authentication → Email Templates** and customize the magic link template.

### 2. Site URL Configuration
Go to **Authentication → URL Configuration**:

**Development:**
- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/**`

**Production:**
- Site URL: `https://yourdomain.com`
- Redirect URLs: `https://yourdomain.com/**`

### 3. Email Provider
By default, Supabase uses their email service (rate-limited for free tier).

For production, configure custom SMTP:
- Go to **Project Settings → Auth**
- Add your SMTP credentials (SendGrid, Mailgun, etc.)

## 📋 Authentication Flow Diagram

```
User visits landing page (/)
    ↓
Clicks "Start Journaling" or "Sign In to Begin"
    ↓
Redirected to /login
    ↓
Enters email and clicks "Send magic link"
    ↓
Supabase sends email with link like:
https://yourproject.supabase.co/auth/v1/verify?token=...&type=magiclink&redirect_to=http://localhost:3000/auth/callback
    ↓
User clicks link in email
    ↓
Supabase redirects to: http://localhost:3000/auth/callback?code=...
    ↓
Callback route exchanges code for session
    ↓
Sets auth cookies
    ↓
Redirects to /dashboard
    ↓
User is now authenticated ✅
```

## 🔒 Security Notes

### What's Protected
- ✅ All app routes (`/dashboard`, `/entries`, `/bets`) require authentication
- ✅ Landing page (`/`) is public
- ✅ Login page (`/login`) is public
- ✅ Auth callback (`/auth/callback`) is public (but only processes valid tokens)
- ✅ Middleware validates session on every request
- ✅ RLS policies protect data in Supabase

### What's Public
- `/` (landing page)
- `/login` (sign-in page)
- `/auth/callback` (OAuth/magic link handler)
- Static assets (`/_next`, `/favicon.ico`)

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Update `NEXT_PUBLIC_SITE_URL` in `.env.local` or environment variables
- [ ] Configure Supabase Site URL to production domain
- [ ] Add production domain to Redirect URLs in Supabase
- [ ] Test magic link in production environment
- [ ] Consider adding custom SMTP for emails
- [ ] Test all auth flows (login, logout, protected routes)

## 🎯 Quick Verification

After restarting your dev server, verify:

```bash
# 1. Landing page works
curl -I http://localhost:3000
# Should return 200, not redirect

# 2. Protected routes redirect
curl -I http://localhost:3000/dashboard
# Should return 307 redirect to /login (if not authenticated)

# 3. Auth callback exists
curl -I http://localhost:3000/auth/callback
# Should return 200 or 307 (depending on whether code param is present)
```

## ✨ Result

Now users can:
1. ✅ **See the landing page** without being forced to log in
2. ✅ **Use magic link authentication** successfully
3. ✅ **Experience a clean landing page** without app UI elements
4. ✅ **Access protected routes** after authentication
5. ✅ **Navigate freely** between public and private sections

---

**Status**: All issues resolved ✅  
**Date**: November 6, 2025

