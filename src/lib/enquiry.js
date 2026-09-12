import { isSupabaseConfigured, supabase } from './supabase'

function isLocalDev() {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  return host === 'localhost' || host === '127.0.0.1'
}

/**
 * Saves an enquiry to Supabase via Edge Function (insert + email)
 * or the local Express JSON API (npm run dev fallback).
 */
export async function submitEnquiry({ name, email, subject, message }) {
  const payload = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: subject.trim(),
    message: message.trim(),
  }

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.functions.invoke('submit-enquiry', {
      body: payload,
    })

    if (error) {
      const messageText = error.message || ''
      const missingFunction =
        messageText.includes('Function not found') ||
        messageText.includes('404') ||
        error.context?.status === 404

      if (missingFunction) {
        const { error: insertError } = await supabase.from('enquiry').insert(payload)
        if (insertError) {
          throw new Error(insertError.message || 'Could not save message.')
        }
        return { ok: true, storage: 'supabase', emailed: false }
      }

      let detail = messageText
      try {
        const body = typeof error.context?.json === 'function' ? await error.context.json() : data
        if (body?.error) detail = body.error
      } catch {
        // keep messageText
      }
      throw new Error(detail || 'Could not save message.')
    }

    if (data && data.ok === false) {
      throw new Error(data.error || 'Could not save message.')
    }

    return {
      ok: true,
      storage: 'supabase',
      emailed: Boolean(data?.emailed),
    }
  }

  // Local API only works with `npm run dev` — not on Firebase Hosting
  if (!isLocalDev()) {
    throw new Error(
      'Enquiry storage is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then rebuild and deploy.',
    )
  }

  const response = await fetch('/api/enquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok || !data.ok) {
    throw new Error(data.error || 'Failed to send message.')
  }

  return { ok: true, storage: 'local', id: data.id, emailed: Boolean(data.emailed) }
}
