'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { supabase } from '@/lib/supabase/client'
import { supabaseFetcher } from '@/lib/supabase/fetcher'
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Tag,
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

export default function GaleriDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id as string

  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [item, setItem] = useState<Documentation | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsMounted(true)
    if (id) fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // 1. Ambil detail dokumentasi (harus published untuk halaman publik)
      const { data, error: docError } = await supabaseFetcher<Documentation>({
        table: 'documentation',
        select: 'id, title, description, media_url, media_type, category_id, created_at',
        filters: { id, is_published: true },
        single: true,
      })

      if (docError) {
        console.error('Gagal ambil detail dokumentasi:', docError)
        setError('Gagal memuat dokumentasi. Silakan refresh.')
        setIsLoading(false)
        return
      }

      if (!data) {
        console.log('ℹ️ Dokumentasi tidak ditemukan atau belum ditayangkan.')
        setError('Dokumentasi tidak ditemukan atau belum ditayangkan.')
        setIsLoading(false)
        return
      }

      setItem(data)

      // 2. Ambil nama kategori (jika ada)
      if (data.category_id) {
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .eq('id', data.category_id)
          .maybeSingle()

        if (catError) {
          console.warn('Gagal ambil kategori:', catError)
        }
        if (catData) setCategory(catData)
      }
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
        <p className="text-crown-cream-dark font-medium">Memuat dokumentasi...</p>
      </div>
    )
  }

  // Error / tidak ditemukan
  if (error || !item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-crown-espresso text-crown-cream p-6">
        <AlertCircle className="h-16 w-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-crown-cream mb-2">Terjadi Kesalahan</h2>
        <p className="text-crown-cream-dark text-center max-w-md">
          {error || 'Dokumentasi tidak ditemukan.'}
        </p>
        <Link
          href="/galery"
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-crown-gold text-crown-espresso font-bold rounded-xl hover:bg-[#d8820e] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Galeri
        </Link>
      </div>
    )
  }

  // ========== RENDER UTAMA ==========
  return (
    <div className="min-h-screen bg-crown-espresso font-sans flex flex-col relative overflow-hidden">
      <Navbar />
      <StarBackground />

      <main className="flex-grow relative z-10 max-w-4xl mx-auto w-full px-6 py-12">
        <Link
          href="/galery"
          className="inline-flex items-center gap-2 mb-8 text-sm font-bold text-crown-cream-dark hover:text-crown-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Galeri
        </Link>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div
            className="rounded-3xl overflow-hidden bg-crown-cream/10 backdrop-blur-sm"
            style={{
              border: '2px solid #F09410',
              boxShadow: '0 8px 24px rgba(240,148,16,0.15)',
            }}
          >
            <div className="relative bg-black flex items-center justify-center">
              {item.media_type === 'video' ? (
                <video
                  src={item.media_url}
                  controls
                  className="w-full max-h-[600px] object-contain"
                />
              ) : (
                <img
                  src={item.media_url}
                  alt={item.title}
                  className="w-full max-h-[600px] object-contain"
                />
              )}
            </div>

            <div className="p-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {category && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-crown-gold/10 text-crown-gold border border-crown-gold/30">
                    <Tag className="w-3.5 h-3.5" />
                    {category.name}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-xs font-bold text-crown-cream-dark/60">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(item.created_at).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-crown-gold mb-4 drop-shadow-[2px_2px_0px_rgba(188,67,13,0.3)]">
                {item.title}
              </h1>

              {item.description && (
                <p className="text-lg text-crown-cream-dark leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}