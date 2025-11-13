import { cookies } from 'next/headers'
import { createServerClient as createSupabaseServerClient, type CookieOptions } from '@supabase/ssr'
import type { Database } from './database.types'

export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('Missing Supabase server env vars')
  }

  const cookieStore = cookies()

  return createSupabaseServerClient<Database>(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch {
          // cookies() may be immutable in some contexts (e.g. during render)
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 })
        } catch {
          // noop
        }
      },
    },
  })
}


