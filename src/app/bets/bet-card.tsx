'use client'

import { useState } from 'react'
import type { Database } from '@/lib/supabase/database.types'
import { updateBet, resolveBet, deleteBet } from './actions'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

type Bet = Database['public']['Tables']['Bet']['Row']

export function BetCard({ bet }: { bet: Bet }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isResolving, setIsResolving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpdate(formData: FormData) {
    setError(null)
    const result = await updateBet(bet.id, formData)

    if (result.error) {
      setError(result.error)
    } else {
      setIsEditing(false)
    }
  }

  async function handleResolve(formData: FormData) {
    setError(null)
    const result = await resolveBet(bet.id, formData)

    if (result.error) {
      setError(result.error)
    } else {
      setIsResolving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this bet?')) {
      return
    }

    setIsDeleting(true)
    const result = await deleteBet(bet.id)

    if (result.error) {
      setError(result.error)
      setIsDeleting(false)
    }
  }

  const formattedDate = new Date(bet.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const formattedResolvedDate = bet.resolved_at
    ? new Date(bet.resolved_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                bet.status === 'open' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {bet.status}
              </span>
              <span className="text-lg font-bold">
                {(bet.probability * 100).toFixed(0)}%
              </span>
              {bet.outcome !== null && (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  bet.outcome 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {bet.outcome ? '✓ Happened' : '✗ Did not happen'}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Created {formattedDate}
              {formattedResolvedDate && ` • Resolved ${formattedResolvedDate}`}
            </p>
          </div>
          <div className="flex gap-2">
            {!isEditing && !isResolving && (
              <>
                {bet.status === 'open' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      disabled={isDeleting}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsResolving(true)}
                      disabled={isDeleting}
                    >
                      Resolve
                    </Button>
                  </>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form action={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`statement-${bet.id}`}>Statement</Label>
              <Textarea
                id={`statement-${bet.id}`}
                name="statement"
                defaultValue={bet.statement}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`probability-${bet.id}`}>Probability</Label>
              <Input
                id={`probability-${bet.id}`}
                name="probability"
                type="number"
                step="0.01"
                min="0"
                max="1"
                defaultValue={bet.probability}
                required
              />
            </div>

            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}

            <div className="flex gap-2">
              <Button type="submit">Save</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setError(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : isResolving ? (
          <form action={handleResolve} className="space-y-4">
            <div className="space-y-2">
              <Label>Did this prediction come true?</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="outcome"
                    value="true"
                    required
                    className="w-4 h-4"
                  />
                  <span>Yes, it happened</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="outcome"
                    value="false"
                    required
                    className="w-4 h-4"
                  />
                  <span>No, it did not happen</span>
                </label>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}

            <div className="flex gap-2">
              <Button type="submit">Resolve Bet</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsResolving(false)
                  setError(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-lg">{bet.statement}</p>
        )}
      </CardContent>
    </Card>
  )
}


