'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { supabaseInsert } from '@/lib/supabase/fetcher'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  CheckCircle,
  Shield,
  UserCheck,
  Lock,
  Users,
  AlertCircle,
  ArrowRight,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'

// Tipe untuk data voter yang dikembalikan
type Voter = {
  id: string
  nim: string
  email: string
  created_at: string
}

export default function NIMPage() {
  const router = useRouter()
  const { isLoggedIn, loading: authLoading } = useAuth()
  const [nim, setNim] = useState('')
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/')
    }
  }, [isLoggedIn, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Hanya validasi bahwa NIM tidak kosong
    if (!nim.trim()) {
      setError('NIM tidak boleh kosong.')
      return
    }
    if (!agree) {
      setError('Anda harus menyetujui SOP Voting terlebih dahulu.')
      return
    }

    setLoading(true)

    // 1. Ambil email dari session
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user?.email) {
      setError('Gagal mengambil email pengguna. Silakan login ulang.')
      setLoading(false)
      return
    }
    const email = user.email

    // 2. Insert data menggunakan fetcher
    const { data, error: insertError } = await supabaseInsert<Voter>('voters', {
      nim: nim.trim(),
      email,
    })

    if (insertError) {
      // Tangani error spesifik
      if (insertError.code === '23505') {
        setError('NIM atau Email sudah terdaftar. Anda hanya dapat melakukan verifikasi satu kali.')
      } else if (insertError.code === '42501') {
        setError('Akses ditolak. Periksa RLS policy pada tabel voters.')
      } else if (insertError.code === 'PGRST205') {
        setError('Tabel voters belum tersedia. Hubungi administrator.')
      } else {
        setError('Terjadi kesalahan: ' + insertError.message)
      }
      setLoading(false)
    } else {
      // Sukses
      console.log('✅ Voter berhasil disimpan:', data)
      setSuccess(true)
      setLoading(false)
      setTimeout(() => {
        router.push('/ranking')
      }, 1200)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-crown-espresso">
        <Loader2 className="h-10 w-10 text-crown-gold animate-spin" />
      </div>
    )
  }

  if (!isLoggedIn) return null

  return (
    <div className="relative min-h-screen flex flex-col bg-crown-espresso text-crown-cream overflow-hidden font-sans">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Kolom Kiri: SOP */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-crown-gold">
              SOP VOTING CROWN 2026
            </h1>
            <ul className="space-y-3">
              {[
                { icon: Users, text: 'Peserta adalah seluruh mahasiswa aktif FIA UB.' },
                { icon: Lock, text: 'Sistem menerapkan ketentuan one account, one vote.' },
                { icon: CheckCircle, text: 'Pemilih hanya diperbolehkan memilih satu kandidat pada setiap kategori.' },
                { icon: Shield, text: 'Pilihan didasarkan pada kontribusi, dedikasi, prestasi, dan dampak kandidat.' },
                { icon: AlertCircle, text: 'Setelah dikirim, data tidak dapat diubah atau dibatalkan.' },
                { icon: UserCheck, text: 'Voting bersifat rahasia, dilarang melakukan spam atau manipulasi.' },
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 bg-crown-cream/5 backdrop-blur-sm p-4 rounded-xl border border-crown-gold/10 hover:border-crown-gold/30 transition-all"
                >
                  <item.icon className="h-5 w-5 text-crown-gold mt-0.5 flex-shrink-0" />
                  <span className="text-crown-cream-dark text-sm md:text-base">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom Kanan: Form NIM */}
          <div className="bg-crown-cream/5 backdrop-blur-md border border-crown-gold/20 rounded-2xl p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <h2 className="text-2xl font-bold text-crown-gold mb-2">Verifikasi Identitas</h2>
            <p className="text-crown-cream-dark text-sm mb-6">
              Silakan masukkan NIM Anda untuk memverifikasi identitas sebagai mahasiswa aktif FIA UB.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="nim" className="block text-sm font-medium text-crown-cream/80 mb-1">
                  NIM
                </label>
                <input
                  id="nim"
                  type="text"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  placeholder="Contoh: 225050101111001"
                  className="w-full px-4 py-3 bg-crown-cream/10 border border-crown-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-crown-gold/60 text-crown-cream placeholder:text-crown-cream-dark/50 transition-all"
                  disabled={loading || success}
                  required
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="agree"
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-crown-gold/30 text-crown-gold focus:ring-crown-gold/60 bg-crown-espresso"
                  disabled={loading || success}
                />
                <label htmlFor="agree" className="text-sm text-crown-cream-dark leading-relaxed">
                  Saya telah membaca dan menyetujui SOP Voting CROWN 2026.
                </label>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-200 text-sm p-3 rounded-xl flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-green-500/20 border border-green-500/30 text-green-200 text-sm p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Verifikasi berhasil! Mengalihkan ke halaman ranking...</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || success}
                className="w-full py-6 bg-crown-gold hover:bg-[#d8820e] text-crown-espresso rounded-xl font-black text-lg shadow-[0_4px_16px_rgba(240,148,16,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    Verifikasi & Lanjutkan
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}