import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateEntryForm } from './create-form'
import { EntryCard } from './entry-card'

async function getEntries() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const { data: entries, error } = await supabase
    .from('Entry')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching entries:', error)
    console.error('Details:', JSON.stringify(error, null, 2))
  }

  return { entries: entries || [], error }
}

export default async function EntriesPage() {
  const { entries, error } = await getEntries()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Entries</h1>
        <p className="text-muted-foreground mt-2">
          Journal entries, beliefs, and notes
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

      {/* Create Entry Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateEntryForm />
        </CardContent>
      </Card>

      {/* Entries List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Entries ({entries.length})</h2>
        {entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No entries yet. Create your first entry above!
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

