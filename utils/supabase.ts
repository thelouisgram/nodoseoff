// utils/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://opshqmqagtfidynwftzk.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

// Client-side Supabase client with automatic session handling
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'nodoseoff-auth',
      flowType: 'pkce' // More secure auth flow
    }
  }
)

export default supabase

// Helper function to check if user is authenticated
export async function getAuthenticatedUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Helper function to get current session
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// Helper to refresh session
export async function refreshSession() {
  const { data: { session }, error } = await supabase.auth.refreshSession()
  return { session, error }
}