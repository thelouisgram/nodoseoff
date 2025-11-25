// utils/auth.ts
import supabase from './supabase'
import { User, Session } from '@supabase/supabase-js'

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Get the current session
 */
export async function getCurrentSession(): Promise<Session | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch (error) {
    console.error('Error getting current session:', error)
    return null
  }
}

/**
 * Refresh the current session
 */
export async function refreshAuthSession(): Promise<Session | null> {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession()
    if (error) throw error
    return session
  } catch (error) {
    console.error('Error refreshing session:', error)
    return null
  }
}

/**
 * Check if the user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return !!user
}

/**
 * Get access token from current session
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const session = await getCurrentSession()
    return session?.access_token ?? null
  } catch (error) {
    console.error('Error getting access token:', error)
    return null
  }
}

/**
 * Get refresh token from current session
 */
export async function getRefreshToken(): Promise<string | null> {
  try {
    const session = await getCurrentSession()
    return session?.refresh_token ?? null
  } catch (error) {
    console.error('Error getting refresh token:', error)
    return null
  }
}

/**
 * Verify if token is expired
 */
export function isTokenExpired(expiresAt: number): boolean {
  const currentTime = Math.floor(Date.now() / 1000)
  // Add 60 second buffer
  return currentTime >= (expiresAt - 60)
}

/**
 * Get token expiry time
 */
export async function getTokenExpiry(): Promise<number | null> {
  try {
    const session = await getCurrentSession()
    return session?.expires_at ?? null
  } catch (error) {
    console.error('Error getting token expiry:', error)
    return null
  }
}

/**
 * Set up automatic token refresh
 */
export function setupAutoRefresh(callback?: (session: Session | null) => void) {
  let refreshTimer: NodeJS.Timeout

  const scheduleRefresh = async () => {
    const expiry = await getTokenExpiry()
    
    if (!expiry) return

    const currentTime = Math.floor(Date.now() / 1000)
    const timeUntilExpiry = expiry - currentTime
    
    // Refresh 5 minutes before expiry
    const refreshTime = Math.max(0, (timeUntilExpiry - 300) * 1000)

    refreshTimer = setTimeout(async () => {
      const session = await refreshAuthSession()
      if (callback) callback(session)
      scheduleRefresh() // Schedule next refresh
    }, refreshTime)
  }

  scheduleRefresh()

  // Return cleanup function
  return () => {
    if (refreshTimer) clearTimeout(refreshTimer)
  }
}

/**
 * Sign out and clear all auth data
 */
export async function signOutUser(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    // Clear any cached data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nodoseoff-auth')
    }
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

/**
 * Update user password
 */
export async function updatePassword(newPassword: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    return { error }
  } catch (error) {
    return { error }
  }
}

/**
 * Update user email
 */
export async function updateEmail(newEmail: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase.auth.updateUser({
      email: newEmail
    })
    return { error }
  } catch (error) {
    return { error }
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  } catch (error) {
    return { error }
  }
}

/**
 * Get user metadata
 */
export async function getUserMetadata(): Promise<any> {
  try {
    const user = await getCurrentUser()
    return user?.user_metadata ?? {}
  } catch (error) {
    console.error('Error getting user metadata:', error)
    return {}
  }
}

/**
 * Update user metadata
 */
export async function updateUserMetadata(metadata: any): Promise<{ error: any }> {
  try {
    const { error } = await supabase.auth.updateUser({
      data: metadata
    })
    return { error }
  } catch (error) {
    return { error }
  }
}