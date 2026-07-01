'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import {
  ArrowRight, Calendar, Users, Trophy, Loader2,
  Award, Target, Heart, Handshake, Clock
} from "lucide-react"
import Navbar from "@/components/layout/Navbar"
import { useAuth } from "@/hooks/useAuth"

export default function LandingPage() {
  const { isLoggedIn, loading: authLoading } = useAuth()

  const [announcement, setAnnouncement] = useState('Menunggu Info')
  const [totalNominees, setTotalNominees] = useState(0)
  const [isVotingActive, setIsVotingActive] = useState(true)
  const [isDataLoading, setIsDataLoading] = useState(true)

  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsDataLoading(true)
      const { data: settingData } = await supabase.from('settings').select('*').limit(1).single()
      if (settingData) {
        setAnnouncement(settingData.announcement || 'Menunggu Info')
        setIsVotingActive(settingData.voting_is_active)
      }
      const { count } = await supabase.from('nominees').select('*', { count: 'exact', head: true })
      if (count !== null) setTotalNominees(count)
      setIsDataLoading(false)
    }
    fetchDashboardData()
  }, [])

  useEffect(() => {
    const targetDate = new Date('2026-11-08T00:00:00').getTime()
    const interval = setInterval(() => {
      const now = Date.now()
      const diff = targetDate - now
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        clearInterval(interval)
        return
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setCountdown({ days, hours, minutes, seconds })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleGoogleAuth = async () => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const redirectBase = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
    const redirectTo = `${redirectBase}/ranking`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo }
    });
  }

  const isLoading = authLoading || isDataLoading

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start bg-crown-espresso text-crown-cream overflow-hidden font-sans">
      <Navbar />

      {/* Ornamen Bunga – menggunakan fill-crown-gold dengan opacity */}
      <div className="absolute top-24 -left-12 z-0 w-32 h-32 md:w-48 md:h-48 animate-[spin_30s_linear_infinite]">
        <svg viewBox="0 0 100 100" className="fill-crown-gold/30">
          <path d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z" />
        </svg>
      </div>
      <div className="absolute bottom-1/4 -right-12 z-0 w-24 h-24 md:w-36 md:h-36 animate-[spin_20s_linear_infinite]">
        <svg viewBox="0 0 100 100" className="fill-crown-gold/30">
          <path d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z" />
        </svg>
      </div>

      <main className="relative z-10 w-full max-w-5xl px-6 pt-12 pb-24 text-center flex flex-col items-center flex-grow">

        {/* Judul Utama: CROWN 2026 */}
        <div className="relative mb-8">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1 bg-crown-bronze rounded-t-xl shadow-lg">
            <span className="text-crown-cream text-base font-bold tracking-widest">CROWN 2026</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-2 flex flex-wrap items-center justify-center text-crown-gold drop-shadow-[2px_2px_0px_rgba(188,67,13,0.4)]">
            {'CELESTIAL GALA'.split(' ').map((word, wordIndex) => (
              <span key={wordIndex} className="inline-flex whitespace-nowrap mx-2">
                {word.split('').map((char, charIndex) => {
                  const index = wordIndex * 10 + charIndex
                  return (
                    <span
                      key={charIndex}
                      className="relative inline-block"
                      style={{ transform: `translateY(${Math.sin(index) * 3}px) rotate(${Math.cos(index) * 2}deg)` }}
                    >
                      {char}
                    </span>
                  )
                })}
              </span>
            ))}
          </h1>
          <p className="text-crown-cream-dark text-sm md:text-base font-light tracking-widest mt-2">
            Malam Apresiasi Civitas Akademika FIA UB
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="w-full max-w-md mx-auto mb-10 bg-crown-cream/5 backdrop-blur-md border border-crown-gold/20 rounded-2xl py-4 px-6 shadow-xl">
          <div className="flex items-center justify-center gap-2 text-crown-cream-dark text-sm font-medium mb-3">
            <Clock className="h-4 w-4 text-crown-gold" />
            <span>Menuju 8 November 2026</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: 'Hari', value: countdown.days },
              { label: 'Jam', value: countdown.hours },
              { label: 'Menit', value: countdown.minutes },
              { label: 'Detik', value: countdown.seconds },
            ].map((item) => (
              <div key={item.label} className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold text-crown-gold tabular-nums">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-crown-cream-dark/60">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Blok Aksi Utama */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-crown-gold animate-spin" />
          </div>
        ) : (
          isLoggedIn ? (
            <div className="w-full max-w-3xl space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="p-8 rounded-[2rem] bg-crown-cream/5 backdrop-blur-md border border-crown-gold/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <h2 className="text-3xl font-black text-crown-gold mb-6">Selamat Datang, Pejuang!</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: Calendar, label: "Info Pengumuman", val: announcement },
                    { icon: Users, label: "Total Kandidat", val: `${totalNominees} Bintang` },
                    { icon: Trophy, label: "Status Voting", val: isVotingActive ? "Aktif" : "Ditutup" }
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-crown-cream/10 backdrop-blur-sm rounded-2xl border border-crown-gold/10 shadow-sm hover:border-crown-gold/40 transition-colors flex flex-col items-center justify-center">
                      <item.icon className="mb-2 text-crown-gold" />
                      <p className="font-bold text-xs text-crown-cream-dark/70">{item.label}</p>
                      <p className="font-black text-center text-crown-gold mt-1">{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                onClick={() => window.location.href = '/ranking'}
                className="bg-crown-gold hover:bg-[#d8820e] text-crown-espresso px-10 py-6 rounded-full font-black text-lg shadow-[0_4px_16px_rgba(240,148,16,0.5)] hover:-translate-y-1 transition-all"
              >
                Voting Sekarang <ArrowRight className="ml-2 animate-pulse" />
              </Button>
            </div>
          ) : (
            <div className="w-full max-w-md p-8 rounded-[2rem] bg-crown-cream/5 backdrop-blur-md border border-crown-gold/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <p className="text-lg font-bold mb-6 text-crown-cream-dark">Bergabunglah dalam Malam Apresiasi</p>
              <Button
                onClick={handleGoogleAuth}
                className="w-full h-14 bg-crown-gold hover:bg-[#d8820e] text-crown-espresso rounded-2xl flex items-center justify-center gap-3 font-black shadow-[0_4px_16px_rgba(240,148,16,0.4)] hover:-translate-y-1 transition-all"
              >
                Daftar sebagai Voter <ArrowRight className="h-4 w-4 animate-[pulse_1.5s_infinite]" />
              </Button>
            </div>
          )
        )}

        {/* Section About CROWN */}
        <div className="w-full mt-20 text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-crown-gold mb-6 border-b border-crown-gold/30 pb-2 inline-block">
            About CROWN
          </h2>
          <p className="text-crown-cream-dark text-base md:text-lg leading-relaxed max-w-3xl">
            Celestial Gala merepresentasikan bahwa di dalam ekosistem FIA, setiap individu atau kelompok adalah bintang yang memiliki potensi untuk bersinar dan melalui CROWN, cahaya tersebut diakui, dirayakan, dan diabadikan sebagai sebuah prestasi.
          </p>
        </div>

        {/* Grid Tujuan CROWN */}
        <div className="w-full mt-12">
          <h3 className="text-2xl font-semibold text-crown-gold mb-6 text-center">Tujuan CROWN</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Award,
                title: 'Apresiasi Objektif',
                desc: 'Mengapresiasi pencapaian, kontribusi, serta dedikasi terbaik civitas akademika FIA UB secara objektif.'
              },
              {
                icon: Target,
                title: 'Motivasi Berprestasi',
                desc: 'Meningkatkan motivasi berprestasi, berkontribusi, serta berdedikasi seluruh civitas akademika serta LKM & LOF FIA UB.'
              },
              {
                icon: Heart,
                title: 'Budaya Apresiasi',
                desc: 'Meningkatkan budaya apresiasi yang lebih kuat terhadap kontribusi dan prestasi di lingkungan FIA UB.'
              },
              {
                icon: Handshake,
                title: 'Ruang Apresiasi',
                desc: 'Menciptakan ruang apresiasi yang mempererat hubungan antara seluruh civitas akademika serta LKM & LOF FIA UB.'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-crown-cream/5 backdrop-blur-sm border border-crown-gold/10 hover:border-crown-gold/30 transition-all duration-300 shadow-lg hover:shadow-[0_8px_24px_rgba(240,148,16,0.15)]">
                <div className="flex items-center gap-3 mb-3">
                  <item.icon className="h-8 w-8 text-crown-gold" />
                  <h4 className="text-lg font-bold text-crown-cream">{item.title}</h4>
                </div>
                <p className="text-crown-cream-dark/80 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}