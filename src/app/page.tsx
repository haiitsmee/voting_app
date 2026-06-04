'use client'

import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import { ArrowRight } from "lucide-react"

export default function LandingPage() {
  const handleGoogleAuth = async () => {
    // Satu fungsi ini menghandle Register sekaligus Login via Google
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` }
    })
  }

  return (
    // Background gelap pekat (Dark Mode)
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-50 overflow-hidden font-sans">
      
      {/* Background Glow Effects untuk ngasih kedalaman (Depth) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Hero Content Section */}
      <div className="relative z-10 w-full max-w-4xl px-6 text-center flex flex-col items-center">
        
        {/* Tagline Pill (Glassmorphism halus) */}
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium text-zinc-300">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Sistem Voting Digital MVP
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          Online Voting System
        </h1>
        
        {/* Deskripsi */}
        <p className="text-lg sm:text-xl text-zinc-400 mb-12 max-w-2xl leading-relaxed">
          Platform pemilihan yang aman, transparan, dan real-time. 
          Satu identitas, satu suara. Tentukan kandidat terbaik pilihanmu sekarang juga.
        </p>

        {/* Glass Card Container untuk CTA */}
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl shadow-2xl">
          <Button
            onClick={handleGoogleAuth}
            className="w-full h-14 bg-white hover:bg-zinc-200 text-zinc-950 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] text-base font-bold shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          >
            {/* Ikon Google */}
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
            Register as a Voter
            <ArrowRight className="h-4 w-4 text-zinc-500" />
          </Button>
          
          <p className="mt-5 text-xs text-zinc-500 font-medium text-center">
            Menggunakan Google OAuth untuk mencegah double-voting.
          </p>
        </div>

      </div>
    </div>
  )
}