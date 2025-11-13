import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { calculateBrierScore, countBetsByStatus } from '@/lib/metrics'
import { getWordFrequency, getTopWords } from '@/lib/text'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { WordFrequencyChart } from '@/components/WordFrequencyChart'

async function getDashboardData() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Fetch all bets
  const { data: betsData, error: betsError } = await supabase
    .from('Bet')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (betsError) {
    console.error('Error fetching bets:', betsError)
    console.error('Details:', JSON.stringify(betsError, null, 2))
  }

  // Fetch entries from last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: entriesData, error: entriesError } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', sevenDaysAgo.toISOString())

  if (entriesError) {
    console.error('Error fetching entries:', entriesError)
    console.error('Details:', JSON.stringify(entriesError, null, 2))
  }

  const bets = betsData ?? []
  const entries = entriesData ?? []

  // Provide more detailed error message
  let dataError = null
  if (betsError || entriesError) {
    const errors = []
    if (betsError) errors.push(`Bets: ${betsError.message}`)
    if (entriesError) errors.push(`Entries: ${entriesError.message}`)
    
    // Check for RLS/permissions errors
    if (betsError?.code === '42501' || entriesError?.code === '42501') {
      dataError = '⚠️ Database access denied. Please ensure Row Level Security policies are set up. See SETUP_FIX_INSTRUCTIONS.md'
    } else {
      dataError = `Database error: ${errors.join(', ')}. Check console for details.`
    }
  }

  // Calculate metrics
  const brierScore = calculateBrierScore(bets)
  const betCounts = countBetsByStatus(bets)

  // Calculate word frequency
  const allText = entries.map(e => e.text).join(' ')
  const wordFreq = getWordFrequency(allText)
  const topWords = getTopWords(wordFreq, 15)

  // Get recent bets for table
  const recentBets = bets.slice(0, 10)

  return {
    brierScore,
    betCounts,
    topWords,
    recentBets,
    dataError,
  }
}

export default async function DashboardPage() {
  const { brierScore, betCounts, topWords, recentBets, dataError } = await getDashboardData()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Your prediction accuracy and recent activity
        </p>
      </div>

      {dataError && (
        <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 mb-1">Database Error</h3>
              <p className="text-sm text-red-700">{dataError}</p>
              <div className="mt-3 text-xs text-red-600">
                <p className="font-medium mb-1">Quick fixes:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Check that your database tables exist in Supabase</li>
                  <li>Verify Row Level Security policies are set up (run <code className="bg-red-100 px-1 rounded">supabase/auth-migration.sql</code>)</li>
                  <li>Ensure your <code className="bg-red-100 px-1 rounded">.env.local</code> has correct SUPABASE_URL and ANON_KEY</li>
                  <li>Check the browser console for detailed error messages</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Brier Score</CardTitle>
            <CardDescription>
              Lower is better (0 = perfect)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {brierScore !== null ? brierScore.toFixed(3) : 'N/A'}
            </div>
            {brierScore === null && (
              <p className="text-xs text-muted-foreground mt-1">
                No resolved bets yet
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Open Bets</CardTitle>
            <CardDescription>
              Predictions awaiting resolution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{betCounts.open}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Resolved Bets</CardTitle>
            <CardDescription>
              Completed predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{betCounts.resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Words Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Words (Last 7 Days)</CardTitle>
          <CardDescription>
            Most frequent words from your entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WordFrequencyChart data={topWords} />
        </CardContent>
      </Card>

      {/* Recent Bets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bets</CardTitle>
          <CardDescription>
            Your latest predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentBets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">Statement</th>
                    <th className="text-left py-3 px-2 font-medium">Probability</th>
                    <th className="text-left py-3 px-2 font-medium">Status</th>
                    <th className="text-left py-3 px-2 font-medium">Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBets.map((bet) => (
                    <tr key={bet.id} className="border-b">
                      <td className="py-3 px-2 max-w-md truncate">{bet.statement}</td>
                      <td className="py-3 px-2">{(bet.probability * 100).toFixed(0)}%</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          bet.status === 'open' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {bet.status}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        {bet.outcome === null ? '—' : bet.outcome ? '✓ Yes' : '✗ No'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No bets yet. Create your first prediction!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

