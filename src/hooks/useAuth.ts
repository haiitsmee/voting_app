import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setIsLoggedIn(true)
        
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
          
        if (data?.is_admin) {
          setIsAdmin(true)
        }
      }
      setLoading(false)
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setIsLoggedIn(true)
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
          
        setIsAdmin(!!data?.is_admin)
        setIsLoggedIn(false)
        setIsAdmin(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    setIsAdmin(false)
  }

  return { isLoggedIn, isAdmin, loading, logout }
}