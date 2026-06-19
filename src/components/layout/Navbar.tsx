'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Star, UserCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { isLoggedIn, isAdmin, userName, logout } = useAuth()

  const handleLogin = async () => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const redirectBase = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
    const redirectTo = `${redirectBase}/ranking`;

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo }
    });
  }

  const handleLogout = async () => {
    await logout()
    setIsMobileMenuOpen(false)
    router.push('/')
  }

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
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`font-bold text-lg hover:-translate-y-1 hover:rotate-2 transition-all duration-300 drop-shadow-sm ${
                      isActive ? 'text-[#C8E53A]' : 'text-white hover:text-[#F5CF52]'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
              
              {isLoggedIn && isAdmin && (
                <Link
                  href="/dashboard"
                  className={`font-extrabold text-lg hover:-translate-y-1 hover:-rotate-2 transition-all duration-300 drop-shadow-md ${
                    pathname === '/dashboard' ? 'text-[#C8E53A]' : 'text-white hover:text-[#F5CF52]'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Login / User Profile & Logout Button */}
            <div className="ml-4 flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/20 border-2 border-white/40 rounded-full backdrop-blur-md">
                    <UserCircle className="h-5 w-5 text-white" />
                    <span className="text-white font-bold text-sm max-w-[120px] truncate">
                      Hi, {userName}
                    </span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="px-6 py-2 bg-white text-[#E7267B] font-bold rounded-full border-2 border-transparent hover:border-white hover:bg-transparent hover:text-white transition-all duration-300 shadow-[4px_4px_0px_rgba(35,69,230,0.5)] active:translate-y-1 active:shadow-none"
                  >
                    Logout
                  </button>
                </>
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

          {/* Mobile Menu Button (Sisanya tetap sama) */}
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
          {isLoggedIn && (
            <div className="flex items-center gap-2 mb-4 px-4 py-2 bg-white/20 rounded-full border border-white/40">
              <UserCircle className="h-5 w-5 text-[#F5CF52]" />
              <span className="text-white font-bold text-sm">Hi, {userName}</span>
            </div>
          )}

          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block w-full text-center px-3 py-4 font-bold text-xl rounded-2xl transition-colors ${
                  isActive ? 'text-[#C8E53A] bg-white/10' : 'text-white hover:bg-white/10 hover:text-[#F5CF52]'
                }`}
              >
                {link.name}
              </Link>
            )
          })}

          {isLoggedIn && isAdmin && (
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block w-full text-center px-3 py-4 font-extrabold text-xl rounded-2xl transition-colors ${
                pathname === '/dashboard' ? 'text-[#C8E53A] bg-white/10' : 'text-white hover:bg-white/10 hover:text-[#F5CF52]'
              }`}
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