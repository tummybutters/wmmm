'use client'

import { useState } from 'react'
import type { Database } from '@/lib/supabase/database.types'
import { updateEntry, deleteEntry } from './actions'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

type Entry = Database['public']['Tables']['Entry']['Row']

export function EntryCard({ entry }: { entry: Entry }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpdate(formData: FormData) {
    setError(null)
    const result = await updateEntry(entry.id, formData)

    if (result.error) {
      setError(result.error)
    } else {
      setIsEditing(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this entry?')) {
      return
    }

    setIsDeleting(true)
    const result = await deleteEntry(entry.id)

    if (result.error) {
      setError(result.error)
      setIsDeleting(false)
    }
  }

  const formattedDate = new Date(entry.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              entry.kind === 'journal' ? 'bg-blue-100 text-blue-700' :
              entry.kind === 'belief' ? 'bg-purple-100 text-purple-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {entry.kind}
            </span>
            <p className="text-sm text-muted-foreground mt-2">{formattedDate}</p>
          </div>
          <div className="flex gap-2">
            {!isEditing && (
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
              <Label htmlFor={`kind-${entry.id}`}>Type</Label>
              <Select
                id={`kind-${entry.id}`}
                name="kind"
                defaultValue={entry.kind}
                required
              >
                <option value="journal">Journal</option>
                <option value="belief">Belief</option>
                <option value="note">Note</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`text-${entry.id}`}>Content</Label>
              <Textarea
                id={`text-${entry.id}`}
                name="text"
                defaultValue={entry.text}
                rows={5}
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
        ) : (
          <p className="whitespace-pre-wrap">{entry.text}</p>
        )}
      </CardContent>
    </Card>
  )
}


