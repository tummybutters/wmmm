import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateBetForm } from './create-form'
import { BetCard } from './bet-card'

async function getBets() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const { data: bets, error } = await supabase
    .from('Bet')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bets:', error)
    console.error('Details:', JSON.stringify(error, null, 2))
  }

  return { bets: bets || [], error }
}

export default async function BetsPage() {
  const { bets, error } = await getBets()
  const openBets = bets.filter(b => b.status === 'open')
  const resolvedBets = bets.filter(b => b.status === 'resolved')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bets</h1>
        <p className="text-muted-foreground mt-2">
          Track your predictions and measure calibration
        </p>
      </div>

      {error && (
        <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800">Database Error</h3>
              <p className="text-sm text-red-700 mt-1">{error.message}</p>
              <p className="text-xs text-red-600 mt-2">
                Check that Row Level Security policies are set up. See <code className="bg-red-100 px-1 rounded">SETUP_FIX_INSTRUCTIONS.md</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Create Bet Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Bet</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateBetForm />
        </CardContent>
      </Card>

      {/* Open Bets */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Open Bets ({openBets.length})</h2>
        {openBets.length > 0 ? (
          <div className="space-y-4">
            {openBets.map((bet) => (
              <BetCard key={bet.id} bet={bet} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No open bets. Create a prediction above!
            </CardContent>
          </Card>
        )}
      </div>

      {/* Resolved Bets */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Resolved Bets ({resolvedBets.length})</h2>
        {resolvedBets.length > 0 ? (
          <div className="space-y-4">
            {resolvedBets.map((bet) => (
              <BetCard key={bet.id} bet={bet} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No resolved bets yet.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

