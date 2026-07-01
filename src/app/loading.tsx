// src/app/loading.tsx
import { Crown } from 'lucide-react'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-crown-espresso overflow-hidden">
      
      {/* Background Ornamen – Bintang Berputar (emas dan perunggu) */}
      <div className="absolute top-20 left-20 w-32 h-32 opacity-20 animate-[spin_30s_linear_infinite] pointer-events-none">
        <svg viewBox="0 0 100 100" className="fill-crown-gold">
          <path d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z" />
        </svg>
      </div>
      <div className="absolute bottom-20 right-20 w-40 h-40 opacity-20 animate-[spin_25s_linear_infinite] pointer-events-none">
        <svg viewBox="0 0 100 100" className="fill-crown-bronze">
          <path d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z" />
        </svg>
      </div>
      <div className="absolute top-1/2 left-10 w-20 h-20 opacity-10 animate-[spin_40s_linear_infinite] pointer-events-none">
        <svg viewBox="0 0 100 100" className="fill-crown-gold">
          <path d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z" />
        </svg>
      </div>

      {/* Main Loader – Elegant Crown dengan efek glassmorphism */}
      <div className="relative z-10 flex flex-col items-center bg-crown-cream/5 backdrop-blur-md border border-crown-gold/20 rounded-3xl px-12 py-10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="relative w-24 h-24 mb-6">
          {/* Crown berdenyut dengan efek glow */}
          <div className="absolute inset-0 rounded-full bg-crown-gold/20 animate-ping opacity-50" />
          <Crown className="relative w-24 h-24 text-crown-gold drop-shadow-[0_0_20px_rgba(240,148,16,0.4)] animate-[bounce_1.5s_infinite]" />
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-crown-gold tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(240,148,16,0.3)] animate-pulse">
          Memuat...
        </h2>
        <div className="mt-4 flex gap-3">
          <span className="w-3 h-3 rounded-full bg-crown-gold animate-[bounce_1s_infinite_100ms]"></span>
          <span className="w-3 h-3 rounded-full bg-crown-bronze animate-[bounce_1s_infinite_200ms]"></span>
          <span className="w-3 h-3 rounded-full bg-crown-cream animate-[bounce_1s_infinite_300ms]"></span>
        </div>
        <p className="mt-4 text-crown-cream-dark text-sm font-medium tracking-wide">
          Menyiapkan semuanya untukmu...
        </p>
      </div>
    </div>
  )
}