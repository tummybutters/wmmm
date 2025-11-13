'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'

const EntrySchema = z.object({
  kind: z.enum(['journal', 'belief', 'note']),
  text: z.string().min(1, 'Text is required').max(10000, 'Text is too long'),
})

export async function createEntry(formData: FormData) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const parsed = EntrySchema.safeParse({
    kind: formData.get('kind'),
    text: formData.get('text'),
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const { error } = await supabase
    .from('entries')
    .insert({
      user_id: user.id,
      kind: parsed.data.kind,
      text: parsed.data.text,
    })

  if (error) {
    console.error('Error creating entry:', error)
    return { error: 'Failed to create entry' }
  }

  revalidatePath('/entries')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateEntry(id: string, formData: FormData) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const parsed = EntrySchema.safeParse({
    kind: formData.get('kind'),
    text: formData.get('text'),
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const { error } = await supabase
    .from('entries')
    .update({
      kind: parsed.data.kind,
      text: parsed.data.text,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating entry:', error)
    return { error: 'Failed to update entry' }
  }

  revalidatePath('/entries')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteEntry(id: string) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting entry:', error)
    return { error: 'Failed to delete entry' }
  }

  revalidatePath('/entries')
  revalidatePath('/dashboard')
  return { success: true }
}

