'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Star } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth' // Hook sudah diaktifkan
import { supabase } from '@/lib/supabase/client' // Import supabase untuk fungsi login

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Mengambil state langsung dari custom hook yang kita buat
  const { isLoggedIn, isAdmin, logout } = useAuth()

  // Fungsi untuk login dengan Google dari Navbar
  const handleLogin = async () => {
    // Mengarahkan ke dashboard setelah berhasil login
    const redirectTo = 'https://voting-app-ten-gamma.vercel.app/ranking';
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo }
    });
  }

  // Fungsi khusus untuk logout sekalian menutup menu mobile
  const handleLogout = async () => {
    await logout()
    setIsMobileMenuOpen(false)
  }

  // Mencegah scroll saat mobile menu terbuka
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Ranking', href: '/ranking' },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#E7267B] shadow-lg border-b-[3px] border-[#2345E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 group cursor-pointer">
            <Star 
              className="h-8 w-8 text-[#F5CF52] fill-[#F5CF52] animate-[spin_10s_linear_infinite] group-hover:scale-110 transition-transform" 
            />
            <div className="flex flex-col items-start leading-none mt-1">
              <span className="text-xl font-black tracking-widest text-[#2345E6] drop-shadow-[2px_2px_0px_#F5CF52]">
                BRAWIJAYA
              </span>
              <span className="text-white text-xs font-bold tracking-[0.2em] -mt-1 ml-1">
                APPRECIATE
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <div className="flex items-baseline gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white font-bold text-lg hover:text-[#F5CF52] hover:-translate-y-1 hover:rotate-2 transition-all duration-300 drop-shadow-sm"
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Conditional Dashboard Link */}
              {isLoggedIn && isAdmin && (
                <Link
                  href="/dashboard"
                  className="text-[#C8E53A] font-extrabold text-lg hover:text-white hover:-translate-y-1 hover:-rotate-2 transition-all duration-300 drop-shadow-md"
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Login / Logout Button */}
            <div className="ml-4">
              {isLoggedIn ? (
                <button 
                  onClick={logout}
                  className="px-6 py-2.5 bg-white text-[#E7267B] font-bold rounded-full border-2 border-transparent hover:border-white hover:bg-transparent hover:text-white transition-all duration-300 shadow-[4px_4px_0px_rgba(35,69,230,0.5)] active:translate-y-1 active:shadow-none"
                >
                  Logout
                </button>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="px-6 py-2.5 bg-[#C8E53A] text-[#2345E6] font-extrabold rounded-full animate-[bounce_3s_infinite] hover:animate-none hover:scale-110 transition-all duration-300 shadow-[4px_4px_0px_#2345E6] active:translate-y-1 active:shadow-none"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-white hover:text-[#F5CF52] hover:bg-white/10 transition-colors focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="block h-8 w-8 animate-[spin_0.3s_ease-in-out]" />
              ) : (
                <Menu className="block h-8 w-8 hover:animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden absolute top-20 left-0 w-full bg-[#E7267B] border-b-[3px] border-[#2345E6] transition-all duration-300 ease-in-out origin-top ${
          isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-center px-3 py-4 text-white font-bold text-xl hover:bg-white/10 hover:text-[#F5CF52] rounded-2xl transition-colors"
            >
              {link.name}
            </Link>
          ))}

          {isLoggedIn && isAdmin && (
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-center px-3 py-4 text-[#C8E53A] font-extrabold text-xl hover:bg-white/10 hover:text-white rounded-2xl transition-colors"
            >
              Dashboard
            </Link>
          )}

          <div className="pt-4 w-full px-6">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="w-full px-6 py-4 bg-white text-[#E7267B] font-bold text-lg rounded-full border-b-4 border-[#2345E6] active:border-b-0 active:translate-y-1 transition-all"
              >
                Logout
              </button>
            ) : (
              <button 
                onClick={() => {
                  handleLogin();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-6 py-4 bg-[#C8E53A] text-[#2345E6] font-extrabold text-lg rounded-full border-b-4 border-[#2345E6] active:border-b-0 active:translate-y-1 transition-all"
              >
                Login dengan Google
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}