'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'

const BetSchema = z.object({
  statement: z.string().min(1, 'Statement is required').max(1000, 'Statement is too long'),
  probability: z.coerce.number().min(0, 'Probability must be between 0 and 1').max(1, 'Probability must be between 0 and 1'),
})

const ResolveBetSchema = z.object({
  outcome: z.enum(['true', 'false']),
})

export async function createBet(formData: FormData) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const parsed = BetSchema.safeParse({
    statement: formData.get('statement'),
    probability: formData.get('probability'),
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const { error } = await supabase
    .from('Bet')
    .insert({
      user_id: user.id,
      source: 'personal',
      statement: parsed.data.statement,
      probability: parsed.data.probability,
      status: 'open',
    })

  if (error) {
    console.error('Error creating bet:', error)
    return { error: 'Failed to create bet' }
  }

  revalidatePath('/bets')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateBet(id: string, formData: FormData) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const parsed = BetSchema.safeParse({
    statement: formData.get('statement'),
    probability: formData.get('probability'),
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const { error } = await supabase
    .from('Bet')
    .update({
      statement: parsed.data.statement,
      probability: parsed.data.probability,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating bet:', error)
    return { error: 'Failed to update bet' }
  }

  revalidatePath('/bets')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function resolveBet(id: string, formData: FormData) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const parsed = ResolveBetSchema.safeParse({
    outcome: formData.get('outcome'),
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const outcome = parsed.data.outcome === 'true'

  const { error } = await supabase
    .from('Bet')
    .update({
      status: 'resolved',
      outcome,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error resolving bet:', error)
    return { error: 'Failed to resolve bet' }
  }

  revalidatePath('/bets')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteBet(id: string) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const { error } = await supabase
    .from('Bet')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting bet:', error)
    return { error: 'Failed to delete bet' }
  }

  revalidatePath('/bets')
  revalidatePath('/dashboard')
  return { success: true }
}

