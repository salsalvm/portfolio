import { isSupabaseConfigured, supabase } from './supabase'

/**
 * Saves a contact enquiry to Supabase (production)
 * or the local Express JSON API (npm run dev fallback).
 */
export async function submitContact({ name, email, subject, message }) {
  const payload = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: subject.trim(),
    message: message.trim(),
  }

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('contacts').insert(payload)
    if (error) {
      throw new Error(error.message || 'Could not save message.')
    }
    return { ok: true, storage: 'supabase' }
  }

  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok || !data.ok) {
    throw new Error(data.error || 'Failed to send message.')
  }

  return { ok: true, storage: 'local', id: data.id }
}
