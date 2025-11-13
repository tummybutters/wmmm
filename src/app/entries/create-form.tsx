'use client'

import { useState } from 'react'
import { createEntry } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'

export function CreateEntryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)

    const result = await createEntry(formData)

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      // Reset form
      const form = document.getElementById('create-entry-form') as HTMLFormElement
      form?.reset()
      setIsSubmitting(false)
    }
  }

  return (
    <form id="create-entry-form" action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="kind">Type</Label>
        <Select id="kind" name="kind" required disabled={isSubmitting}>
          <option value="journal">Journal</option>
          <option value="belief">Belief</option>
          <option value="note">Note</option>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="text">Content</Label>
        <Textarea
          id="text"
          name="text"
          placeholder="Write your entry here..."
          rows={5}
          required
          disabled={isSubmitting}
        />
      </div>

      {error && (
        <div className="text-sm text-destructive">{error}</div>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Entry'}
      </Button>
    </form>
  )
}



