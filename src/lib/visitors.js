import { isSupabaseConfigured, supabase } from './supabase'

const SESSION_KEY = 'portfolio_visit_tracked'

async function sha256Short(value) {
  const data = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32)
}

async function resolveVisitorIp() {
  try {
    const response = await fetch('https://api.ipify.org?format=json', {
      signal: AbortSignal.timeout(4000),
    })
    if (!response.ok) return 'unknown'
    const data = await response.json()
    return String(data.ip || 'unknown')
  } catch {
    return 'unknown'
  }
}

/**
 * Stores unique visitors in Supabase Postgres.
 * Same IP → same row (visit_count++), not a new array entry.
 */
export async function trackUniqueVisitor() {
  if (!isSupabaseConfigured || !supabase) return
  if (typeof window === 'undefined') return

  try {
    if (sessionStorage.getItem(SESSION_KEY)) return
    sessionStorage.setItem(SESSION_KEY, '1')

    const ip = await resolveVisitorIp()
    const id = await sha256Short(ip)

    await supabase.rpc('track_visitor', {
      p_id: id,
      p_ip: ip,
      p_user_agent: String(navigator.userAgent || '').slice(0, 400),
      p_referrer: String(document.referrer || '').slice(0, 500),
      p_path: String(window.location.pathname || '/').slice(0, 200),
    })
  } catch {
    // Never break the site for analytics
  }
}
