'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { supabase } from '@/lib/supabase/client'
import { Loader2, Star, Sparkles, Trophy, Crown, Medal } from 'lucide-react'

// Mendefinisikan tipe data
type Category = {
  id: string
  name: string
}

type RankingItem = {
  name: string
  count: number
  category_id: string
}

export default function RankingPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [ranking, setRanking] = useState<RankingItem[]>([])
  const [isVotingActive, setIsVotingActive] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    
    // 1. Cek status voting dari tabel settings
    const { data: settingData } = await supabase.from('settings').select('voting_is_active').limit(1).single()
    const votingActive = settingData ? settingData.voting_is_active : true
    setIsVotingActive(votingActive)

    // 2. Mengambil tabel 'categories'
    const { data: catData, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true })

    if (!catError && catData) {
      setCategories(catData)
    }

    // 3. Jika voting ditutup, ambil data ranking
    if (!votingActive) {
      const { data: nomData } = await supabase
        .from('nominees')
        .select(`
          name,
          category_id,
          votes(count)
        `)

      if (nomData) {
        const formatted = nomData.map(n => ({
          name: n.name,
          category_id: n.category_id,
          // @ts-ignore
          count: n.votes[0]?.count || 0 
        })).sort((a, b) => b.count - a.count)
        
        setRanking(formatted)
      }
    }
    
    setIsLoading(false)
  }

  if (!isMounted) return null

  return (
    <div className="min-h-screen bg-[#F5CF52] font-sans flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Ornamen Background yang Menggemaskan[cite: 3] */}
      <div className="absolute top-40 -left-10 w-32 h-32 opacity-20 animate-[spin_20s_linear_infinite]">
        <Star className="w-full h-full text-[#E7267B] fill-[#E7267B]" />
      </div>
      <div className="absolute bottom-20 -right-10 w-40 h-40 opacity-20 animate-[spin_25s_linear_infinite]">
        <Sparkles className="w-full h-full text-[#2345E6] fill-[#2345E6]" />
      </div>

      <main className="flex-grow relative z-10 max-w-6xl mx-auto w-full px-6 py-12">
        
        {/* Header Halaman[cite: 3] */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-5xl md:text-6xl font-black text-[#E7267B] uppercase drop-shadow-[3px_3px_0px_white]">
            {isVotingActive ? 'Kategori Nominasi' : 'Hasil Akhir Voting'}
          </h1>
          <p className="mt-4 text-xl font-bold text-[#2345E6]">
            {isVotingActive 
              ? 'Pilih kategori dan tentukan simpul jagoanmu!' 
              : 'Terima kasih atas partisipasinya! Berikut adalah simpul-simpul terbaik pilihan kita.'}
          </p>
        </div>

        {/* State Management Tampilan[cite: 3] */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-16 w-16 text-[#2345E6] animate-spin mb-4" />
            <p className="font-bold text-xl text-[#E7267B] animate-pulse">Menyiapkan data...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center bg-white/60 backdrop-blur-sm p-12 rounded-[2rem] border-4 border-dashed border-[#E7267B] max-w-2xl mx-auto shadow-[8px_8px_0px_#2345E6]">
            <Trophy className="h-20 w-20 mx-auto text-[#E7267B] mb-4 opacity-50" />
            <p className="text-2xl font-black text-[#E7267B]">Belum ada kategori nominasi nih!</p>
          </div>
        ) : isVotingActive ? (
          
          /* TAMPILAN SAAT VOTING AKTIF (Seperti sebelumnya) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const colors = ['#2345E6', '#E7267B', '#C8E53A']
              const activeColor = colors[index % colors.length]

              return (
                <Link 
                  key={category.id}
                  href={`/ranking/${category.id}`} 
                  className="group block"
                >
                  <div 
                    className="bg-white rounded-3xl p-8 h-full flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-3"
                    style={{
                      border: `3px solid ${activeColor}`,
                      boxShadow: `8px 8px 0px ${activeColor}`,
                    }}
                  >
                    <div className="text-6xl mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 drop-shadow-md">
                      🏆
                    </div>
                    <h2 className="text-2xl font-black text-zinc-800 leading-tight group-hover:text-[#E7267B] transition-colors">
                      {category.name}
                    </h2>
                    <div className="mt-auto pt-6 w-full">
                      <div className="w-full py-2.5 bg-zinc-100 rounded-full group-hover:bg-[#F5CF52] transition-colors border-2 border-transparent group-hover:border-[#E7267B]">
                        <p className="text-sm font-bold text-zinc-500 group-hover:text-[#E7267B]">
                          Klik untuk vote ✨
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

        ) : (
          
          /* TAMPILAN SAAT VOTING DITUTUP (Papan Peringkat) */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in zoom-in duration-500">
            {categories.map((category, index) => {
              const categoryRanking = ranking.filter(r => r.category_id === category.id)
              const colors = ['#2345E6', '#E7267B']
              const themeColor = colors[index % colors.length]

              return (
                <div 
                  key={category.id} 
                  className="bg-white rounded-[2rem] p-8 border-[3px] transition-all duration-300 hover:-translate-y-2"
                  style={{ borderColor: themeColor, boxShadow: `8px 8px 0px ${themeColor}` }}
                >
                  <div className="flex items-center justify-between border-b-2 border-zinc-100 pb-4 mb-6">
                    <h2 className="text-2xl font-black text-zinc-800">{category.name}</h2>
                    <Crown className="w-8 h-8" style={{ color: themeColor }} />
                  </div>

                  {categoryRanking.length > 0 ? (
                    <div className="space-y-4">
                      {categoryRanking.map((item, idx) => (
                        <div 
                          key={idx} 
                          className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-transform hover:scale-[1.02] ${
                            idx === 0 
                              ? 'bg-[#F5CF52]/20 border-[#F5CF52] shadow-sm' 
                              : 'bg-zinc-50 border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <span className={`w-10 h-10 flex items-center justify-center rounded-full font-black text-white ${
                              idx === 0 ? 'bg-[#C8E53A] shadow-md' : idx === 1 ? 'bg-zinc-400' : idx === 2 ? 'bg-orange-400' : 'bg-zinc-300 text-zinc-600'
                            }`}>
                              {idx === 0 ? <Medal className="w-5 h-5" /> : idx + 1}
                            </span>
                            <span className={`font-bold text-lg ${idx === 0 ? 'text-[#E7267B]' : 'text-zinc-700'}`}>
                              {item.name}
                            </span>
                          </div>
                          <span className="font-black text-[#2345E6] text-lg">{item.count} <span className="text-sm text-zinc-500 font-bold">Suara</span></span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-zinc-400 font-medium italic">Belum ada suara di kategori ini.</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

        )}
      </main>
    </div>
  )
}