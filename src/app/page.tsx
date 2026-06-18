'use client'
export const dynamic = 'force-dynamic'

import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import { ArrowRight } from "lucide-react"
import Navbar from "@/components/layout/Navbar" // mengimpor komponen navbar baru di sini ya

export default function LandingPage() {
  const handleGoogleAuth = async () => {
    const redirectTo = 'https://voting-app-ten-gamma.vercel.app/ranking';
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo }
    });
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start bg-[#F5CF52] text-zinc-950 overflow-hidden font-sans">
      
      {/* Komponen Navbar Utama */}
      <Navbar />

      {/* Background Grid Pattern (Slightly subtle) */}
      <div className="absolute inset-0 z-0 bg-[url('/img/grid-pattern.svg')] opacity-[0.03]" />

      {/* Decorative Aster Flowers dengan animasi berputar lambat (slow-spin) */}
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

      {/* Main Content Area (Yellow) */}
      <main className="relative z-10 w-full max-w-4xl px-6 pt-12 pb-24 text-center flex flex-col items-center flex-grow">
        
        {/* Label kecil */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-medium text-zinc-950 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-[#E7267B] animate-pulse"></span>
          Sistem Voting Digital MVP
        </div>

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
                style={{
                    transform: `translateY(${Math.sin(index) * 4}px) rotate(${Math.cos(index) * 3}deg)`,
                }}
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
        
        {/* Teks paragraf */}
        <p className="text-lg sm:text-xl text-zinc-950 mb-12 max-w-2xl leading-relaxed font-medium">
          Bring The Great Story with Harmonization and Collaborative Simpul Brawijaya
        </p>

        {/* Share Icon Placeholder dengan animasi mengambang naik-turun */}
        <div className="mb-12 animate-[bounce_4s_infinite]">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-[#D7A250]">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
            </svg>
        </div>

        {/* Voter Registration Button Card */}
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/20 border border-white/30 backdrop-blur-xl shadow-2xl transition-all hover:shadow-[0_0_30px_rgba(231,38,123,0.2)]">
          <Button
            onClick={handleGoogleAuth}
            className="w-full h-14 bg-white hover:bg-zinc-200 text-zinc-950 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] text-base font-bold shadow-[4px_4px_0px_#2345E6] active:translate-y-1 active:shadow-none"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
            Register as a Voter
            <ArrowRight className="h-4 w-4 text-zinc-500 animate-[pulse_1.5s_infinite]" />
          </Button>
          
          <p className="mt-5 text-xs text-zinc-600 font-medium text-center">
            Menggunakan Google OAuth untuk mencegah double-voting.
          </p>
        </div>

      </main>

      {/* Flowing Wave Separator */}
      <div className="w-full h-16 pointer-events-none -mb-[1px]">
        <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="h-full w-full fill-[#2345E6]">
          <path d="M0 5 Q25 0 50 5 Q75 10 100 5 L100 10 L0 10 Z" />
        </svg>
      </div>

      {/* Footer / Lower Section (Blue) */}
      <footer className="relative z-10 w-full bg-[#2345E6] text-white px-6 pt-16 pb-12 text-center flex flex-col items-center">
        
        {/* Title Group 'ABOUT US' */}
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 flex items-center justify-center gap-2 text-[#C8E53A]">
            {'ABOUT US'.split('').map((char, index) => (
                <span key={index} className="inline-block hover:scale-110 transition-transform cursor-default">
                    {char}
                </span>
            ))}
        </h2>
        <p className="text-xl font-bold text-[#E7267B] mb-8 drop-shadow-sm">BRACIATE 2025</p>
        
        {/* Indonesian text explanation */}
        <p className="text-lg text-white max-w-3xl leading-relaxed mb-8 font-medium">
          Brawijaya Appreciate merupakan program kerja dari Kementerian Dalam Negeri Eksekutif Mahasiswa Universitas Brawijaya yang berbentuk malam penghargaan dengan tujuan sebagai bentuk kolaborasi, harmonisasi, dan apresiasi untuk simpul Brawijaya, yaitu <span className="font-extrabold text-[#C8E53A] underline decoration-[#E7267B] decoration-2">BEM, DPM, HIMA, dan UKM</span>.
        </p>

        {/* Deskripsi platform */}
        <p className="text-base text-white/80 max-w-2xl leading-relaxed border-t border-white/10 pt-6">
            Platform pemilihan yang aman, transparan, dan real-time. 
            Satu identitas, satu suara. Tentukan kandidat terbaik pilihanmu sekarang juga.
        </p>

      </footer>
    </div>
  )
}