'use client'

import { useState, useEffect, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'

function hasSupabaseConfig() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

async function getSupabaseClient() {
  const { createClient } = await import('@/lib/supabase/client')
  return createClient()
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      setLoading(false)
      return
    }

    getSupabaseClient().then((supabase) => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })

      return () => subscription.unsubscribe()
    })
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!hasSupabaseConfig()) throw new Error('Authentication not configured')
    const supabase = await getSupabaseClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    if (!hasSupabaseConfig()) throw new Error('Authentication not configured')
    const supabase = await getSupabaseClient()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  }, [])

  const signOut = useCallback(async () => {
    if (!hasSupabaseConfig()) return
    const supabase = await getSupabaseClient()
    await supabase.auth.signOut()
    setUser(null)
  }, [])

  return { user, loading, signIn, signUp, signOut }
}
