'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import { ArrowRight, Calendar, Users, Trophy, Loader2 } from "lucide-react"
import Navbar from "@/components/layout/Navbar"
import { useAuth } from "@/hooks/useAuth"

export default function LandingPage() {
  const { isLoggedIn, loading: authLoading } = useAuth()
  
  // State untuk menyimpan data dinamis dari database
  const [announcement, setAnnouncement] = useState('Menunggu Info')
  const [totalNominees, setTotalNominees] = useState(0)
  const [isVotingActive, setIsVotingActive] = useState(true)
  const [isDataLoading, setIsDataLoading] = useState(true)

  // Mengambil data dari Supabase saat komponen dimuat
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsDataLoading(true)

      // 1. Ambil pengaturan (Pengumuman & Status Voting)
      const { data: settingData } = await supabase.from('settings').select('*').limit(1).single()
      if (settingData) {
        setAnnouncement(settingData.announcement || 'Menunggu Info')
        setIsVotingActive(settingData.voting_is_active)
      }

      // 2. Ambil total kandidat
      const { count } = await supabase.from('nominees').select('*', { count: 'exact', head: true })
      if (count !== null) {
        setTotalNominees(count)
      }

      setIsDataLoading(false)
    }

    fetchDashboardData()
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

  // Tampilkan loading screen singkat jika auth atau data masih diproses
  const isLoading = authLoading || isDataLoading

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start bg-[#F5CF52] text-zinc-950 overflow-hidden font-sans">
      <Navbar />

      {/* Ornamen Bunga Bergerak Tetap Ada */}
      <div className="absolute top-24 -left-12 z-0 w-32 h-32 md:w-48 md:h-48 animate-[spin_30s_linear_infinite]">
        <svg viewBox="0 0 100 100" className="fill-[#53399A]">
          <path d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z" />
        </svg>
      </div>
      <div className="absolute bottom-1/4 -right-12 z-0 w-24 h-24 md:w-36 md:h-36 animate-[spin_20s_linear_infinite]">
        <svg viewBox="0 0 100 100" className="fill-[#53399A]">
          <path d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z" />
        </svg>
      </div>

      <main className="relative z-10 w-full max-w-4xl px-6 pt-12 pb-24 text-center flex flex-col items-center flex-grow">
        
        {/* Title Group - Replicating 'BRAWIJAYA APPRECIATE' style */}
        <div className="relative mb-6">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-[#2345E6] rounded-t-xl shadow-md">
             <span className="text-white text-base font-extrabold tracking-tight">BRAWIJAYA</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 flex flex-wrap items-center justify-center gap-2 text-[#E7267B] drop-shadow-[2px_2px_0px_rgba(255,255,255,0.6)]">
            {'APPRECIATE'.split('').map((char, index) => (
              <span 
                key={index} 
                className={`relative inline-block ${index === 7 ? 'text-[#C8E53A]' : ''}`}
                style={{ transform: `translateY(${Math.sin(index) * 4}px) rotate(${Math.cos(index) * 3}deg)` }}
              >
                  {char}
                  {index === 7 && (
                      <svg viewBox="0 0 100 100" className="absolute -top-5 -right-3 h-5 w-5 fill-[#C8E53A] animate-[bounce_2s_infinite]">
                          <path d="M10 30 L50 0 L90 30 L70 80 L30 80 Z" />
                      </svg>
                  )}
              </span>
            ))}
          </h1>
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center">
             <Loader2 className="h-10 w-10 text-[#2345E6] animate-spin" />
          </div>
        ) : (
          isLoggedIn ? (
            /* Tampilan Info Event (Sudah Login) */
            <div className="w-full max-w-3xl space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="p-8 rounded-[2rem] bg-white/30 border-[3px] border-white/50 backdrop-blur-md shadow-[8px_8px_0px_#2345E6]">
                <h2 className="text-3xl font-black text-[#2345E6] mb-6">Welcome Back, Champ!</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    // Data sekarang otomatis terisi dari hasil fetching database
                    { icon: Calendar, label: "Info Pengumuman", val: announcement },
                    { icon: Users, label: "Total Kandidat", val: `${totalNominees} Simpul` },
                    { icon: Trophy, label: "Status Voting", val: isVotingActive ? "Aktif" : "Ditutup" }
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-white rounded-2xl border-2 border-[#2345E6]/20 shadow-sm hover:border-[#E7267B] transition-colors flex flex-col items-center justify-center">
                      <item.icon className="mb-2 text-[#E7267B]" />
                      <p className="font-bold text-xs text-zinc-500">{item.label}</p>
                      <p className="font-black text-center text-[#2345E6] mt-1">{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Button 
                onClick={() => window.location.href = '/ranking'}
                className="bg-[#2345E6] hover:bg-[#1a35b8] text-white px-10 py-6 rounded-full font-black text-lg shadow-[4px_4px_0px_#E7267B] hover:-translate-y-1 transition-all"
              >
                Lihat Ranking Sekarang <ArrowRight className="ml-2 animate-pulse" />
              </Button>
            </div>
          ) : (
            /* Tampilan Tombol Register (Belum Login) */
            <div className="w-full max-w-md p-8 rounded-[2rem] bg-white/20 border-[3px] border-white/30 backdrop-blur-xl shadow-[8px_8px_0px_#2345E6]">
              <p className="text-lg font-bold mb-6 text-zinc-900">Bring The Great Story with Harmonization and Collaborative Simpul Brawijaya</p>
              <Button
                onClick={handleGoogleAuth}
                className="w-full h-14 bg-white hover:bg-zinc-200 text-zinc-950 rounded-2xl flex items-center justify-center gap-3 font-black shadow-[4px_4px_0px_#2345E6] hover:-translate-y-1 transition-all"
              >
                Register as a Voter <ArrowRight className="h-4 w-4 animate-[pulse_1.5s_infinite]" />
              </Button>
            </div>
          )
        )}
      </main>

      {/* Footer tetap sama */}
      <footer className="relative z-10 w-full bg-[#2345E6] text-white px-6 pt-16 pb-12 text-center flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#C8E53A]">ABOUT US</h2>
        <p className="max-w-3xl leading-relaxed text-white/90">
          Program kerja dari Kementerian Dalam Negeri Eksekutif Mahasiswa Universitas Brawijaya untuk <span className="font-black text-[#C8E53A]">BEM, DPM, HIMA, dan UKM</span>.
        </p>
      </footer>
    </div>
  )
}