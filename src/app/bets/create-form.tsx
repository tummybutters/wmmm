'use client'

import { useState } from 'react'
import { createBet } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function CreateBetForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)

    const result = await createBet(formData)

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      // Reset form
      const form = document.getElementById('create-bet-form') as HTMLFormElement
      form?.reset()
      setIsSubmitting(false)
    }
  }

  return (
    <form id="create-bet-form" action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="statement">Prediction Statement</Label>
        <Textarea
          id="statement"
          name="statement"
          placeholder="e.g., GPT-5 will be released by end of 2024"
          rows={3}
          required
          disabled={isSubmitting}
        />
        <p className="text-xs text-muted-foreground">
          Make a clear, falsifiable prediction
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="probability">Probability</Label>
        <Input
          id="probability"
          name="probability"
          type="number"
          step="0.01"
          min="0"
          max="1"
          placeholder="0.65"
          required
          disabled={isSubmitting}
        />
        <p className="text-xs text-muted-foreground">
          Enter a value between 0 and 1 (e.g., 0.65 for 65%)
        </p>
      </div>

      {error && (
        <div className="text-sm text-destructive">{error}</div>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Bet'}
      </Button>
    </form>
  )
}



