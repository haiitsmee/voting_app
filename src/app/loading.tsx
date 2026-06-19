import { Star, Sparkles } from 'lucide-react'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F5CF52] overflow-hidden">
      
      {/* Background Ornamen Berputar */}
      <div className="absolute top-20 left-20 w-32 h-32 opacity-20 animate-[spin_10s_linear_infinite]">
        <Star className="w-full h-full text-[#E7267B] fill-[#E7267B]" />
      </div>
      <div className="absolute bottom-20 right-20 w-40 h-40 opacity-20 animate-[spin_15s_linear_infinite]">
        <Sparkles className="w-full h-full text-[#2345E6] fill-[#2345E6]" />
      </div>

      {/* Main Loader */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-24 h-24 mb-8">
          <Star className="absolute inset-0 w-full h-full text-[#C8E53A] fill-[#C8E53A] animate-[ping_2s_infinite] opacity-50" />
          <Star className="absolute inset-0 w-full h-full text-[#E7267B] fill-[#E7267B] animate-[bounce_1.5s_infinite] drop-shadow-[4px_4px_0px_#2345E6]" />
        </div>

        {/* Teks Loading */}
        <h2 className="text-3xl md:text-4xl font-black text-[#2345E6] uppercase tracking-widest drop-shadow-[2px_2px_0px_white] animate-pulse">
          Tunggu Sebentar...
        </h2>
        <div className="mt-4 flex gap-2">
          <span className="w-3 h-3 rounded-full bg-[#E7267B] animate-[bounce_1s_infinite_100ms]"></span>
          <span className="w-3 h-3 rounded-full bg-[#C8E53A] animate-[bounce_1s_infinite_200ms]"></span>
          <span className="w-3 h-3 rounded-full bg-[#2345E6] animate-[bounce_1s_infinite_300ms]"></span>
        </div>
      </div>
    </div>
  )
}