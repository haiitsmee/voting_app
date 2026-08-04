import { Star } from 'lucide-react'

export default function StarBackground() {
  return (
    <>
      {/* Definisi gradient — tidak terlihat sendiri, hanya dipakai lewat url(#id) di bawah */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="star-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEEAF0" />
            <stop offset="100%" stopColor="#F09410" />
          </linearGradient>
          <linearGradient id="star-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F0D0C7" />
            <stop offset="100%" stopColor="#BC430D" />
          </linearGradient>
          <linearGradient id="star-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F09410" />
            <stop offset="100%" stopColor="#BC430D" />
          </linearGradient>
          <linearGradient id="star-gradient-4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BC430D" />
            <stop offset="100%" stopColor="#241705" />
          </linearGradient>
        </defs>
      </svg>

      {/* 1. Bintang besar – kiri atas — Gradient 1 (pink → oranye) */}
      <div className="absolute top-40 -left-10 w-32 h-32 opacity-30 animate-[spin_20s_linear_infinite] pointer-events-none">
        <Star
          className="w-full h-full"
          style={{ fill: 'url(#star-gradient-1)', stroke: 'url(#star-gradient-1)' }}
        />
      </div>

      {/* 2. Bintang sedang – kanan bawah — Gradient 2 (peach → burnt orange) */}
      <div className="absolute bottom-20 -right-10 w-40 h-40 opacity-30 animate-[spin_25s_linear_infinite] pointer-events-none">
        <Star
          className="w-full h-full"
          style={{ fill: 'url(#star-gradient-2)', stroke: 'url(#star-gradient-2)' }}
        />
      </div>

      {/* 3. Bintang tambahan – kanan atas — Gradient 3 (oranye → burnt orange) */}
      <div className="absolute top-32 right-16 w-20 h-20 opacity-25 animate-[spin_30s_linear_infinite] pointer-events-none">
        <svg viewBox="0 0 100 100">
          <path
            d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z"
            fill="url(#star-gradient-3)"
          />
        </svg>
      </div>

      {/* 4. Bintang tambahan – kiri bawah — Gradient 4 (burnt orange → coklat gelap) */}
      <div className="absolute bottom-40 left-8 w-28 h-28 opacity-25 animate-[spin_35s_linear_infinite] pointer-events-none">
        <svg viewBox="0 0 100 100">
          <path
            d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z"
            fill="url(#star-gradient-4)"
          />
        </svg>
      </div>
    </>
  )
}