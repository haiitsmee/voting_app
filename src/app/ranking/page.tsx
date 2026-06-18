'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Navbar from '@/components/layout/Navbar'
import { Trophy, Star, Sparkles } from 'lucide-react'

// Mendefinisikan tipe data TypeScript untuk Nominasi
type Nomination = {
  id: string
  title: string
  description: string
  icon: string
}

export default function RankingPage() {
  const [nominations, setNominations] = useState<Nomination[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNominations = async () => {
      const { data, error } = await supabase
        .from('nominations')
        .select('*')
        .order('created_at', { ascending: true })

      if (!error && data) {
        setNominations(data)
      }
      setIsLoading(false)
    }

    fetchNominations()
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start bg-[#F5CF52] text-zinc-950 font-sans overflow-hidden">
      
      <Navbar />

      <div className="absolute top-32 left-4 md:left-12 z-0 w-20 h-20 opacity-50 animate-[spin_15s_linear_infinite]">
        <Star className="w-full h-full text-[#E7267B] fill-[#E7267B]" />
      </div>
      <div className="absolute bottom-20 right-4 md:right-12 z-0 w-24 h-24 opacity-50 animate-[bounce_4s_infinite]">
        <Sparkles className="w-full h-full text-[#2345E6]" />
      </div>

      <main className="relative z-10 w-full max-w-5xl px-6 pt-12 pb-24 flex flex-col items-center flex-grow">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 mb-4 bg-[#C8E53A] rounded-full border-[3px] border-[#2345E6] shadow-[4px_4px_0px_#2345E6] animate-[bounce_3s_infinite]">
            <Trophy className="h-8 w-8 text-[#2345E6]" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#E7267B] drop-shadow-[3px_3px_0px_#2345E6] uppercase">
            Kategori Nominasi
          </h1>
          <p className="mt-4 text-lg md:text-xl font-bold text-[#2345E6] max-w-2xl mx-auto">
            Kenali berbagai kategori penghargaan untuk simpul Brawijaya tahun ini. Siapa jagoanmu?
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4 my-20">
            <div className="w-16 h-16 border-8 border-[#2345E6] border-t-[#E7267B] rounded-full animate-spin"></div>
            <p className="text-xl font-bold text-[#2345E6] animate-pulse">Mengambil data nominasi...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {nominations.map((nom, index) => (
              <div 
                key={nom.id}
                className="group relative bg-white border-[3px] border-[#2345E6] rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_#E7267B] shadow-[6px_6px_0px_#2345E6] flex flex-col items-center text-center"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-5xl mb-4 transform group-hover:scale-125 transition-transform duration-300">
                  {nom.icon}
                </div>
                
                <h2 className="text-2xl font-black text-[#E7267B] mb-3 leading-tight">
                  {nom.title}
                </h2>
                
                <p className="text-base font-medium text-zinc-700 leading-relaxed">
                  {nom.description}
                </p>

                <div className="absolute -top-3 -right-3 bg-[#C8E53A] text-[#2345E6] text-xs font-black px-3 py-1 rounded-full border-2 border-[#2345E6] rotate-12 group-hover:rotate-0 transition-transform">
                  BRACIATE
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && nominations.length === 0 && (
          <div className="text-center bg-white/50 p-8 rounded-3xl border-2 border-dashed border-[#E7267B]">
            <p className="text-xl font-bold text-[#E7267B]">Belum ada nominasi yang ditambahkan nih.</p>
          </div>
        )}
      </main>

    </div>
  )
}