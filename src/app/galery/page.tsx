'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { supabase } from '@/lib/supabase/client'
import { supabaseFetcher } from '@/lib/supabase/fetcher'
import {
  Loader2,
  Images,
  Film,
  AlertCircle,
  Calendar,
} from 'lucide-react'
import StarBackground from '@/components/layout/StarBackground'

// Tipe data
type Category = {
  id: string
  name: string
}

type Documentation = {
  id: string
  title: string
  description: string | null
  media_url: string
  media_type: 'image' | 'video'
  category_id: string | null
  created_at: string
}

export default function GaleriPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [documentation, setDocumentation] = useState<Documentation[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsMounted(true)
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // 1. Ambil categories (untuk label kategori pada tiap kartu)
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true })

      if (catError) {
        console.warn('Gagal ambil categories:', catError)
      }
      if (catData) setCategories(catData)

      // 2. Ambil dokumentasi yang sudah ditayangkan
      const { data: docData, error: docError } = await supabaseFetcher<Documentation[]>({
        table: 'documentation',
        select: 'id, title, description, media_url, media_type, category_id, created_at',
        filters: { is_published: true },
        order: { column: 'display_order', ascending: true },
      })

      if (docError) {
        console.error('Gagal ambil dokumentasi:', docError)
        setError('Gagal memuat galeri dokumentasi. Silakan refresh.')
        setIsLoading(false)
        return
      }

      setDocumentation(docData || [])
    } catch (unexpectedError) {
      console.error('🔥 Unexpected error:', unexpectedError)
      setError('Terjadi kesalahan tak terduga. Silakan refresh halaman.')
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
        <p className="text-crown-cream-dark font-medium">Memuat galeri...</p>
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
      <StarBackground />

      <main className="flex-grow relative z-10 max-w-6xl mx-auto w-full px-6 py-12">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-5xl md:text-6xl font-black text-crown-gold uppercase drop-shadow-[3px_3px_0px_rgba(188,67,13,0.4)]">
            Galeri Dokumentasi
          </h1>
          <p className="mt-4 text-xl font-bold text-crown-cream-dark">
            Momen-momen terbaik yang berhasil kami abadikan.
          </p>
        </div>

        {documentation.length === 0 ? (
          <div className="text-center bg-crown-cream/5 backdrop-blur-sm p-12 rounded-2xl border border-crown-gold/20 max-w-2xl mx-auto shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <Images className="h-20 w-20 mx-auto text-crown-gold mb-4 opacity-50" />
            <p className="text-2xl font-black text-crown-cream">Belum ada dokumentasi yang diunggah nih!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {documentation.map((item, index) => {
              const accentColors = ['#F09410', '#BC430D', '#FEEAF0']
              const activeColor = accentColors[index % accentColors.length]
              const categoryName = categories.find((c) => c.id === item.category_id)?.name

              return (
                <Link
                  key={item.id}
                  href={`/galery/${item.id}`}
                  className="group block"
                >
                  <div
                    className="bg-crown-cream/10 backdrop-blur-sm rounded-3xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-3"
                    style={{
                      border: `2px solid ${activeColor}`,
                      boxShadow: `0 8px 24px rgba(240,148,16,0.15)`,
                    }}
                  >
                    <div className="relative aspect-video bg-crown-espresso overflow-hidden">
                      {item.media_type === 'video' ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-12 h-12 text-crown-gold/60 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      ) : (
                        <img
                          src={item.media_url}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      )}
                      {categoryName && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-crown-espresso/80 text-crown-gold border border-crown-gold/40">
                          {categoryName}
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h2 className="text-xl font-black text-crown-cream leading-tight group-hover:text-crown-gold transition-colors">
                        {item.title}
                      </h2>
                      {item.description && (
                        <p className="mt-2 text-sm text-crown-cream-dark/70 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="mt-auto pt-6 flex items-center gap-2 text-xs font-bold text-crown-cream-dark/60">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}