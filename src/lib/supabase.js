import { createClient } from '@supabase/supabase-js'
import { personal } from '../data'

const url =
  import.meta.env.VITE_SUPABASE_URL || personal.supabase?.url || ''
const anonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || personal.supabase?.anonKey || ''

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null
