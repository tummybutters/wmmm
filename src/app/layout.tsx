import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

const inter = Inter({ subsets: ['latin'] })
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'World Model Journal',
  description: 'Track beliefs, predictions, and calibrate your worldview',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Check if we're on the landing page
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';
  const isLandingPage = pathname === '/';

  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.variable}`}>
        {isLandingPage ? (
          // Landing page renders its own layout
          children
        ) : (
          // App pages use the standard layout with header/footer
          <div className="min-h-screen flex flex-col">
            <header className="border-b">
              <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center justify-between">
                  <Link href="/dashboard" className="text-xl font-bold">
                    World Model Journal
                  </Link>
                  <div className="flex items-center gap-6">
                    {user && (
                      <>
                        <Link 
                          href="/dashboard" 
                          className="text-sm font-medium hover:text-primary transition-colors"
                        >
                          Dashboard
                        </Link>
                        <Link 
                          href="/entries" 
                          className="text-sm font-medium hover:text-primary transition-colors"
                        >
                          Entries
                        </Link>
                        <Link 
                          href="/bets" 
                          className="text-sm font-medium hover:text-primary transition-colors"
                        >
                          Bets
                        </Link>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-muted-foreground">{user.email}</span>
                          <form action="/logout" method="post">
                            <button className="text-sm font-medium hover:text-primary transition-colors">
                              Logout
                            </button>
                          </form>
                        </div>
                      </>
                    )}
                    {!user && (
                      <Link 
                        href="/login"
                        className="text-sm font-medium hover:text-primary transition-colors"
                      >
                        Login
                      </Link>
                    )}
                  </div>
                </nav>
              </div>
            </header>
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="border-t py-6 text-center text-sm text-muted-foreground">
              <div className="container mx-auto px-4">
                World Model Journal - Track your beliefs and predictions
              </div>
            </footer>
          </div>
        )}
      </body>
    </html>
  )
}

