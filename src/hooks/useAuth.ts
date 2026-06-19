import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userName, setUserName] = useState('') // Menambahkan state untuk nama user
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fungsi untuk mengecek sesi saat halaman dimuat
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setIsLoggedIn(true)
        
        // Mengambil nama lengkap dari Google OAuth, jika tidak ada pakai nama emailnya
        const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User'
        setUserName(name)
        
        // Cek status admin
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

    // Listener otomatis jika user login/logout di tengah jalan
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setIsLoggedIn(true)
        
        const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User'
        setUserName(name)

        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
          
        setIsAdmin(!!data?.is_admin)
      } else {
        setIsLoggedIn(false)
        setIsAdmin(false)
        setUserName('')
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
    setUserName('')
  }

  return { isLoggedIn, isAdmin, userName, loading, logout } 
}