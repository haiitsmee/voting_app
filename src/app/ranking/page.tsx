'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { supabase } from '@/lib/supabase/client'
import { supabaseFetcher } from '@/lib/supabase/fetcher'
import {
  Loader2,
  Star,
  Sparkles,
  Trophy,
  Crown,
  Medal,
  AlertCircle,
} from 'lucide-react'

// Tipe data
type Category = {
  id: string
  name: string
}

type RankingItem = {
  name: string
  count: number
  category_id: string
}

type Voter = {
  nim: string
}

export default function RankingPage() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [ranking, setRanking] = useState<RankingItem[]>([])
  const [isVotingActive, setIsVotingActive] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsMounted(true)
    checkVoterAndFetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkVoterAndFetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // 1. Ambil user session (dengan fallback)
      let user = null
      let email = null

      // Coba getUser()
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) {
        console.warn('getUser() gagal, mencoba getSession()...', userError?.message)
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        if (sessionError || !sessionData.session) {
          console.error('getSession() juga gagal:', sessionError?.message)
          router.push('/')
          return
        }
        user = sessionData.session.user
        email = user?.email
      } else {
        user = userData.user
        email = user?.email
      }

      if (!user || !email) {
        console.error('User atau email tidak ditemukan.')
        router.push('/')
        return
      }

      console.log('✅ User terautentikasi:', email)

      // 2. Cek voter dengan fetcher (sekarang pakai maybeSingle)
      const { data: voter, error: voterError } = await supabaseFetcher<Voter>({
        table: 'voters',
        select: 'nim',
        filters: { email },
        single: true, // akan menggunakan maybeSingle di fetcher
      })

      if (voterError) {
        // Tangani error spesifik
        if (voterError.code === '42501') {
          setError('Akses ditolak. Periksa RLS policy pada tabel voters.')
        } else if (voterError.code === 'PGRST205') {
          setError('Tabel voters belum tersedia. Hubungi administrator.')
        } else {
          setError(`Gagal memverifikasi identitas: ${voterError.message}`)
        }
        setIsLoading(false)
        return
      }

      // Jika voter tidak ditemukan (data null) → redirect ke NIM
      if (!voter) {
        console.log('ℹ️ Voter belum terdaftar, redirect ke /nim')
        router.push('/nim')
        return
      }

      console.log('✅ Voter terverifikasi, NIM:', voter.nim)

      // 3. Terdaftar → ambil data ranking
      await fetchData()

    } catch (unexpectedError) {
      console.error('🔥 Unexpected error:', unexpectedError)
      setError('Terjadi kesalahan tak terduga. Silakan refresh halaman.')
      setIsLoading(false)
    }
  }

  const fetchData = async () => {
    try {
      // 1. Ambil status voting dari settings
      const { data: settingData, error: settingError } = await supabase
        .from('settings')
        .select('voting_is_active')
        .limit(1)
        .single()

      if (settingError) {
        console.warn('Gagal ambil status voting, default ke active:', settingError)
      }
      const votingActive = settingData ? settingData.voting_is_active : true
      setIsVotingActive(votingActive)

      // 2. Ambil categories
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true })

      if (catError) {
        console.error('Gagal ambil categories:', catError)
        setError('Gagal memuat kategori. Silakan refresh.')
        setIsLoading(false)
        return
      }

      if (catData) {
        setCategories(catData)
      }

      // 3. Jika voting ditutup, ambil data ranking
      if (!votingActive) {
        const { data: nomData, error: nomError } = await supabase
          .from('nominees')
          .select(`
            name,
            category_id,
            votes(count)
          `)

        if (nomError) {
          console.error('Gagal ambil data nominees:', nomError)
        }

        if (nomData) {
          const formatted = nomData.map((n) => ({
            name: n.name,
            category_id: n.category_id,
            // @ts-ignore
            count: n.votes[0]?.count || 0,
          })).sort((a, b) => b.count - a.count)

          setRanking(formatted)
        }
      }

    } catch (fetchError) {
      console.error('🔥 Error fetching data:', fetchError)
      setError('Gagal memuat data. Silakan refresh halaman.')
    } finally {
      setIsLoading(false)
    }
  }

  // Hydration guard
  if (!isMounted) return null

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-crown-espresso text-crown-cream">
        <Loader2 className="h-12 w-12 text-crown-gold animate-spin mb-4" />
        <p className="text-crown-cream-dark font-medium">Memuat data...</p>
      </div>
    )
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-crown-espresso text-crown-cream p-6">
        <AlertCircle className="h-16 w-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-crown-cream mb-2">Terjadi Kesalahan</h2>
        <p className="text-crown-cream-dark text-center max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-3 bg-crown-gold text-crown-espresso font-bold rounded-xl hover:bg-[#d8820e] transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    )
  }

  // ========== RENDER UTAMA ==========
  return (
    <div className="min-h-screen bg-crown-espresso font-sans flex flex-col relative overflow-hidden">
      <Navbar />

      {/* ===== ORNAMEN BINTANG BERPUSAT (3 buah) ===== */}
      {/* 1. Bintang besar – kiri atas (sudah ada, kita pertahankan) */}
      <div className="absolute top-40 -left-10 w-32 h-32 opacity-20 animate-[spin_20s_linear_infinite] pointer-events-none">
        <Star className="w-full h-full text-crown-gold fill-crown-gold" />
      </div>

      {/* 2. Bintang sedang – kanan bawah (sudah ada, kita pertahankan) */}
      <div className="absolute bottom-20 -right-10 w-40 h-40 opacity-20 animate-[spin_25s_linear_infinite] pointer-events-none">
        <Sparkles className="w-full h-full text-crown-bronze fill-crown-bronze" />
      </div>

      {/* 3. Bintang tambahan – kanan atas (baru) */}
      <div className="absolute top-32 right-16 w-20 h-20 opacity-15 animate-[spin_30s_linear_infinite] pointer-events-none">
        <svg viewBox="0 0 100 100" className="fill-crown-gold">
          <path d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z" />
        </svg>
      </div>

      {/* 4. Bintang tambahan – kiri bawah (baru) */}
      <div className="absolute bottom-40 left-8 w-28 h-28 opacity-15 animate-[spin_35s_linear_infinite] pointer-events-none">
        <svg viewBox="0 0 100 100" className="fill-crown-bronze">
          <path d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z" />
        </svg>
      </div>

      <main className="flex-grow relative z-10 max-w-6xl mx-auto w-full px-6 py-12">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-5xl md:text-6xl font-black text-crown-gold uppercase drop-shadow-[3px_3px_0px_rgba(188,67,13,0.4)]">
            {isVotingActive ? 'Kategori Nominasi' : 'Hasil Akhir Voting'}
          </h1>
          <p className="mt-4 text-xl font-bold text-crown-cream-dark">
            {isVotingActive
              ? 'Pilih kategori dan tentukan bintangmu!'
              : 'Terima kasih atas partisipasinya! Berikut adalah bintang-bintang terbaik pilihan kita.'}
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center bg-crown-cream/5 backdrop-blur-sm p-12 rounded-2xl border border-crown-gold/20 max-w-2xl mx-auto shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <Trophy className="h-20 w-20 mx-auto text-crown-gold mb-4 opacity-50" />
            <p className="text-2xl font-black text-crown-cream">Belum ada kategori nominasi nih!</p>
          </div>
        ) : isVotingActive ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const accentColors = ['#F09410', '#BC430D', '#FEEAF0']
              const activeColor = accentColors[index % accentColors.length]

              return (
                <Link
                  key={category.id}
                  href={`/ranking/${category.id}`}
                  className="group block"
                >
                  <div
                    className="bg-crown-cream/10 backdrop-blur-sm rounded-3xl p-8 h-full flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-3"
                    style={{
                      border: `2px solid ${activeColor}`,
                      boxShadow: `0 8px 24px rgba(240,148,16,0.15)`,
                    }}
                  >
                    <div className="text-6xl mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 drop-shadow-md">
                      🏆
                    </div>
                    <h2 className="text-2xl font-black text-crown-cream leading-tight group-hover:text-crown-gold transition-colors">
                      {category.name}
                    </h2>
                    <div className="mt-auto pt-6 w-full">
                      <div className="w-full py-2.5 bg-crown-gold/10 rounded-full group-hover:bg-crown-gold/30 transition-colors border border-crown-gold/20 group-hover:border-crown-gold/60">
                        <p className="text-sm font-bold text-crown-cream-dark group-hover:text-crown-gold">
                          Klik untuk vote
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in zoom-in duration-500">
            {categories.map((category, index) => {
              const categoryRanking = ranking.filter((r) => r.category_id === category.id)
              const themeColors = ['#F09410', '#BC430D']
              const themeColor = themeColors[index % themeColors.length]

              return (
                <div
                  key={category.id}
                  className="bg-crown-cream/5 backdrop-blur-sm rounded-2xl p-8 border border-crown-gold/20 transition-all duration-300 hover:-translate-y-2 shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                >
                  <div className="flex items-center justify-between border-b border-crown-gold/20 pb-4 mb-6">
                    <h2 className="text-2xl font-black text-crown-cream">{category.name}</h2>
                    <Crown className="w-8 h-8 text-crown-gold" />
                  </div>

                  {categoryRanking.length > 0 ? (
                    <div className="space-y-4">
                      {categoryRanking.map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-transform hover:scale-[1.02] ${
                            idx === 0
                              ? 'bg-crown-gold/20 border-crown-gold/60 shadow-[0_4px_12px_rgba(240,148,16,0.2)]'
                              : 'bg-crown-cream/5 border-crown-gold/10'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <span
                              className={`w-10 h-10 flex items-center justify-center rounded-full font-black ${
                                idx === 0
                                  ? 'bg-crown-gold text-crown-espresso shadow-md'
                                  : idx === 1
                                  ? 'bg-crown-bronze/60 text-crown-cream'
                                  : idx === 2
                                  ? 'bg-crown-bronze/30 text-crown-cream'
                                  : 'bg-crown-cream/10 text-crown-cream-dark'
                              }`}
                            >
                              {idx === 0 ? <Medal className="w-5 h-5" /> : idx + 1}
                            </span>
                            <span
                              className={`font-bold text-lg ${
                                idx === 0 ? 'text-crown-gold' : 'text-crown-cream'
                              }`}
                            >
                              {item.name}
                            </span>
                          </div>
                          <span className="font-black text-crown-gold text-lg">
                            {item.count}{' '}
                            <span className="text-sm text-crown-cream-dark font-bold">Suara</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-crown-cream-dark/60 font-medium italic">
                        Belum ada suara di kategori ini.
                      </p>
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