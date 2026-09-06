'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Loader2 } from 'lucide-react'
import { Cinzel, Cormorant_Garamond } from 'next/font/google'
import { useAuth } from '@/hooks/useAuth'

// Font display "ukiran" untuk wordmark — terasa royal, bukan sans polos
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
})

// Font miring elegan untuk curved motto di atas wordmark
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['italic'],
})

/**
 * NOTE — Sticky behavior:
 * Elemen <nav> di bawah ini SUDAH membawa class `sticky top-0 z-50` pada
 * root-nya sendiri. Karena posisi sticky ditempel di komponen ini, BUKAN
 * di halaman yang memanggilnya, setiap child/page yang render <Navbar />
 * akan otomatis sticky tanpa perlu menambahkan wrapper atau class apapun
 * di sisi child. Cukup:
 *
 *   <Navbar />
 *   <main>...</main>
 *
 * Satu syarat teknis dari CSS `position: sticky` (bukan sesuatu yang perlu
 * diatur manual, tapi perlu diperhatikan): pastikan tidak ada elemen leluhur
 * di antara <body> dan <nav> ini yang diberi `overflow: hidden/auto/scroll`
 * (selain scroll bawaan dokumen), karena itu satu-satunya hal yang bisa
 * mematikan efek sticky secara diam-diam.
 */
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { isLoggedIn, isAdmin, userName, loading, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    setIsMobileMenuOpen(false)
    router.push('/')
  }

  // Lock scroll saat mobile menu terbuka
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
    { name: 'Galeri', href: '/galery' },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full bg-crown-espresso/80 backdrop-blur-md border-b border-crown-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo Section — crest emblem: motto melengkung + wordmark + crown watermark beranimasi di belakang */}
          <Link
            href="/"
            className="group relative flex-shrink-0 flex flex-col items-center justify-center select-none cursor-pointer py-1"
          >
            {/* Curved motto — hanya tampil di desktop agar row mobile tetap ringkas */}
            <svg
              viewBox="0 0 170 24"
              className="hidden md:block w-36 h-5 -mb-1.5 overflow-visible"
              aria-hidden="true"
            >
              <defs>
                <path id="crownMottoArc" d="M 6,22 Q 85,-8 164,22" fill="none" />
                <linearGradient id="crownMottoGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#BC430D" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="#F09410" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#BC430D" stopOpacity="0.35" />
                </linearGradient>
              </defs>
              <text
                className={cormorant.className}
                fontSize="7.2"
                letterSpacing="2.5"
                fill="url(#crownMottoGradient)"
              >
                <textPath href="#crownMottoArc" startOffset="50%" textAnchor="middle">
                  Official Voting Platform
                </textPath>
              </text>
            </svg>

            {/* Panggung wordmark + watermark */}
            <div className="relative flex items-center justify-center h-9 md:h-10">
              {/* Crown watermark — beranimasi di BELAKANG teks (layered motion, bukan satu keyframe kaku) */}
              <div
                className="crown-float pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <div className="crown-sway">
                  <Image
                    src="/crown-logo.png"
                    alt=""
                    width={112}
                    height={112}
                    priority
                    className="crown-glow w-14 md:w-[68px] h-auto opacity-25 group-hover:opacity-45 group-hover:scale-110 transition-[opacity,transform] duration-500 ease-crown-pop"
                  />
                </div>
              </div>

              {/* Wordmark */}
              <span
                className={`${cinzel.className} relative z-10 text-xl md:text-2xl font-semibold tracking-[0.18em] text-crown-gold [text-shadow:0_0_18px_rgba(240,148,16,0.3)]`}
              >
                CROWN <span className="text-crown-cream">2026</span>
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
                    className={`font-medium text-sm lg:text-base transition-colors duration-300 ${
                      isActive ? 'text-crown-gold' : 'text-crown-cream hover:text-crown-gold'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}

              {isLoggedIn && isAdmin && (
                <Link
                  href="/dashboard"
                  className={`font-medium text-sm lg:text-base transition-colors duration-300 ${
                    pathname === '/dashboard' ? 'text-crown-gold' : 'text-crown-cream hover:text-crown-gold'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Auth Section */}
            <div className="ml-4 flex items-center gap-4">
              {loading ? (
                <Loader2 className="h-5 w-5 text-crown-gold animate-spin" />
              ) : isLoggedIn ? (
                <>
                  <span className="text-crown-cream-dark text-sm font-medium">
                    Halo, {userName || 'Voter'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-crown-cream border border-crown-bronze rounded-full hover:bg-crown-bronze/20 hover:text-crown-gold transition-all duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : null}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-crown-cream hover:text-crown-gold hover:bg-crown-cream/10 transition-colors focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="block h-7 w-7" />
              ) : (
                <Menu className="block h-7 w-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-crown-espresso/95 backdrop-blur-md border-b border-crown-gold/10 transition-all duration-300 ease-in-out origin-top ${
          isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block w-full text-center px-3 py-3 font-medium text-base rounded-xl transition-colors ${
                  isActive ? 'text-crown-gold bg-crown-gold/10' : 'text-crown-cream hover:text-crown-gold hover:bg-crown-cream/10'
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
              className={`block w-full text-center px-3 py-3 font-medium text-base rounded-xl transition-colors ${
                pathname === '/dashboard' ? 'text-crown-gold bg-crown-gold/10' : 'text-crown-cream hover:text-crown-gold hover:bg-crown-cream/10'
              }`}
            >
              Dashboard
            </Link>
          )}

          {/* Auth Section Mobile */}
          <div className="pt-4 w-full px-6 flex flex-col items-center gap-3 border-t border-crown-gold/10 mt-2">
            {loading ? (
              <Loader2 className="h-6 w-6 text-crown-gold animate-spin" />
            ) : isLoggedIn ? (
              <>
                <span className="text-crown-cream-dark text-sm font-medium">
                  Halo, {userName || 'Voter'}
                </span>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm font-medium text-crown-cream border border-crown-bronze rounded-full hover:bg-crown-bronze/20 hover:text-crown-gold transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/*
        Animasi crown watermark — didesain berlapis (layered motion), bukan satu
        keyframe tunggal, supaya terasa hidup & tidak mekanis:

        1. crown-float  → naik-turun pelan (translateY), durasi 6.5s
        2. crown-sway   → ayunan rotasi lembut, durasi 9s + delay negatif
                          (mulai di tengah siklus) supaya tidak sinkron dengan float
        3. crown-glow   → napas cahaya (opacity + drop-shadow), durasi 4.5s

        Tiga durasi yang saling prima (6.5 / 9 / 4.5) membuat kombinasi gerak
        nyaris tidak pernah "mengulang pola" yang sama persis — prinsip
        overlapping action ala animasi tradisional, dieksekusi lewat CSS murni.
        Easing custom (bukan linear/ease bawaan) dipakai supaya gerak punya
        akselerasi & perlambatan yang halus, dan hover memakai kurva "back-out"
        untuk efek pop yang sedikit overshoot lalu settle.
      */}
      <style jsx>{`
        :global(.ease-crown-pop) {
          transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .crown-float {
          animation: crown-float 6.5s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }

        .crown-sway {
          animation: crown-sway 9s cubic-bezier(0.37, 0, 0.63, 1) infinite;
          animation-delay: -3s;
        }

        .crown-glow {
          animation: crown-glow 4.5s ease-in-out infinite;
          animation-delay: -1.2s;
        }

        @keyframes crown-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        @keyframes crown-sway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }

        @keyframes crown-glow {
          0%, 100% {
            filter: drop-shadow(0 0 6px rgba(240, 148, 16, 0.2));
          }
          50% {
            filter: drop-shadow(0 0 16px rgba(240, 148, 16, 0.45));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .crown-float,
          .crown-sway,
          .crown-glow {
            animation: none;
          }
        }
      `}</style>
    </nav>
  )
}