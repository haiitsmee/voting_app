import { Star } from 'lucide-react'

export default function StarBackground() {
  return (
    <>
      {/* Definisi gradient — tidak terlihat sendiri, hanya dipakai lewat url(#id) di bawah */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="star-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF5E1" />
            <stop offset="100%" stopColor="#FFB627" />
          </linearGradient>
          <linearGradient id="star-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE0CC" />
            <stop offset="100%" stopColor="#FF7A29" />
          </linearGradient>
          <linearGradient id="star-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFC94D" />
            <stop offset="100%" stopColor="#FF7A29" />
          </linearGradient>
          <linearGradient id="star-gradient-4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7A29" />
            <stop offset="100%" stopColor="#8A4A16" />
          </linearGradient>
        </defs>
      </svg>

      {/* === Ornamen 4-titik tersebar di seluruh layar === */}
      <div className="absolute top-10 left-6 z-0 w-20 h-20 md:w-28 md:h-28 animate-[spin_24s_linear_infinite] pointer-events-none">
        <svg viewBox="0 0 100 100">
          <path d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z" fill="url(#star-gradient-1)" opacity="0.8" />
        </svg>
      </div>
      <div className="absolute top-24 right-10 z-0 w-14 h-14 md:w-20 md:h-20 animate-[spin_18s_linear_infinite_reverse] pointer-events-none">
        <svg viewBox="0 0 100 100">
          <path d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z" fill="url(#star-gradient-3)" opacity="0.75" />
        </svg>
      </div>
      <div className="absolute top-1/3 left-1/4 z-0 w-10 h-10 md:w-14 md:h-14 animate-[spin_15s_linear_infinite] pointer-events-none">
        <svg viewBox="0 0 100 100">
          <path d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z" fill="url(#star-gradient-2)" opacity="0.7" />
        </svg>
      </div>
      <div className="absolute top-1/2 right-1/4 z-0 w-16 h-16 md:w-24 md:h-24 animate-[spin_28s_linear_infinite_reverse] pointer-events-none">
        <svg viewBox="0 0 100 100">
          <path d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z" fill="url(#star-gradient-4)" opacity="0.8" />
        </svg>
      </div>
      <div className="absolute top-1/4 right-1/3 z-0 w-9 h-9 md:w-12 md:h-12 animate-[spin_20s_linear_infinite] pointer-events-none">
        <svg viewBox="0 0 100 100">
          <path d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z" fill="url(#star-gradient-1)" opacity="0.65" />
        </svg>
      </div>
      <div className="absolute bottom-1/3 left-10 z-0 w-16 h-16 md:w-24 md:h-24 animate-[spin_22s_linear_infinite] pointer-events-none">
        <svg viewBox="0 0 100 100">
          <path d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z" fill="url(#star-gradient-3)" opacity="0.75" />
        </svg>
      </div>
      <div className="absolute bottom-1/4 left-1/3 z-0 w-10 h-10 md:w-14 md:h-14 animate-[spin_17s_linear_infinite_reverse] pointer-events-none">
        <svg viewBox="0 0 100 100">
          <path d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z" fill="url(#star-gradient-2)" opacity="0.7" />
        </svg>
      </div>
      <div className="absolute bottom-20 right-1/4 z-0 w-14 h-14 md:w-20 md:h-20 animate-[spin_19s_linear_infinite] pointer-events-none">
        <svg viewBox="0 0 100 100">
          <path d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z" fill="url(#star-gradient-1)" opacity="0.7" />
        </svg>
      </div>
      <div className="absolute bottom-24 -right-12 z-0 w-24 h-24 md:w-36 md:h-36 animate-[spin_20s_linear_infinite] pointer-events-none">
        <svg viewBox="0 0 100 100">
          <path d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z" fill="url(#star-gradient-3)" opacity="0.85" />
        </svg>
      </div>
      <div className="absolute bottom-6 left-1/2 z-0 w-9 h-9 md:w-12 md:h-12 animate-[spin_26s_linear_infinite_reverse] pointer-events-none">
        <svg viewBox="0 0 100 100">
          <path d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z" fill="url(#star-gradient-4)" opacity="0.65" />
        </svg>
      </div>
      <div className="absolute top-16 -left-12 z-0 w-32 h-32 md:w-48 md:h-48 animate-[spin_30s_linear_infinite] pointer-events-none">
        <svg viewBox="0 0 100 100">
          <path d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z" fill="url(#star-gradient-1)" opacity="0.85" />
        </svg>
      </div>

      {/* === Bintang lucide — aksen pelengkap, tersebar juga === */}
      <div className="absolute top-1/4 left-1/2 w-14 h-14 opacity-25 animate-[spin_20s_linear_infinite] pointer-events-none">
        <Star className="w-full h-full" style={{ fill: 'url(#star-gradient-1)', stroke: 'url(#star-gradient-1)' }} />
      </div>
      <div className="absolute bottom-1/3 right-6 w-16 h-16 opacity-25 animate-[spin_25s_linear_infinite] pointer-events-none">
        <Star className="w-full h-full" style={{ fill: 'url(#star-gradient-2)', stroke: 'url(#star-gradient-2)' }} />
      </div>
    </>
  )
}