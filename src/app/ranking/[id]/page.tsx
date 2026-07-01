'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  AlertTriangle,
  Lock,
  Loader2,
  Crown,
  Star,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { supabaseFetcher, supabaseInsert } from '@/lib/supabase/fetcher'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Tipe data
type Nominee = {
  id: string
  name: string
  description: string
  image_url: string
  category_id: string
}

type Vote = {
  nominee_id: string
  user_id: string
  category_id: string
}

type VoterCheck = {
  nim: string
}

export default function NominationDetailPage() {
  const { id: categoryId } = useParams()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  // State data
  const [nominees, setNominees] = useState<Nominee[]>([])
  const [hasVoted, setHasVoted] = useState(false)
  const [votedNomineeId, setVotedNomineeId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State untuk AlertDialog
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertTitle, setAlertTitle] = useState('')
  const [alertMessage, setAlertMessage] = useState('')
  const [alertIsError, setAlertIsError] = useState(false)

  // State untuk konfirmasi vote
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedNomineeId, setSelectedNomineeId] = useState<string | null>(null)

  const showAlert = (title: string, message: string, isError = false) => {
    setAlertTitle(title)
    setAlertMessage(message)
    setAlertIsError(isError)
    setAlertOpen(true)
  }

  useEffect(() => {
    setIsMounted(true)
    fetchInitialData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId])

  const fetchInitialData = async () => {
    setIsLoading(true)

    try {
      // 1. Ambil user session
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        // Jika tidak ada user, redirect ke home
        router.push('/')
        return
      }
      setUserId(user.id)

      // 2. Ambil daftar kandidat (nominees) berdasarkan category_id
      const { data: nomineesData, error: nomineesError } = await supabaseFetcher<Nominee[]>({
        table: 'nominees',
        select: '*',
        filters: { category_id: categoryId as string },
        order: { column: 'created_at', ascending: true },
      })

      if (nomineesError) {
        console.error('Gagal ambil nominees:', nomineesError)
        showAlert('Gagal Memuat Data', 'Tidak dapat memuat daftar kandidat. Silakan refresh.', true)
        setNominees([])
        setIsLoading(false)
        return
      }

      setNominees(nomineesData || [])

      // 3. Cek apakah user sudah pernah vote di kategori ini
      const { data: existingVote, error: voteError } = await supabaseFetcher<Vote>({
        table: 'votes',
        select: 'nominee_id, user_id, category_id',
        filters: {
          category_id: categoryId as string,
          user_id: user.id,
        },
        single: true,
      })

      if (voteError && voteError.code !== 'PGRST116') {
        // PGRST116 = tidak ditemukan (maybeSingle mengembalikan null)
        console.error('Gagal cek vote:', voteError)
      }

      if (existingVote) {
        setHasVoted(true)
        setVotedNomineeId(existingVote.nominee_id)
      }

    } catch (err) {
      console.error('🔥 Unexpected error:', err)
      showAlert('Terjadi Kesalahan', 'Silakan refresh halaman.', true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoteClick = (nomineeId: string) => {
    if (hasVoted || !userId) return
    setSelectedNomineeId(nomineeId)
    setConfirmOpen(true)
  }

  const confirmVote = async () => {
    if (!selectedNomineeId || !userId || !categoryId) return

    setIsSubmitting(true)
    setConfirmOpen(false)

    try {
      const { data, error } = await supabaseInsert<Vote>('votes', {
        user_id: userId,
        nominee_id: selectedNomineeId,
        category_id: categoryId,
      })

      if (error) {
        console.error('Gagal vote:', error)
        if (error.code === '23505') {
          showAlert('Sudah Memilih', 'Anda sudah memberikan suara untuk kategori ini.', true)
        } else if (error.code === '42501') {
          showAlert('Akses Ditolak', 'Anda tidak memiliki izin untuk melakukan voting.', true)
        } else {
          showAlert('Gagal Voting', error.message || 'Terjadi kesalahan saat menyimpan suara.', true)
        }
        return
      }

      // Sukses
      setHasVoted(true)
      setVotedNomineeId(selectedNomineeId)
      showAlert('Suara Tersimpan! 🎉', 'Terima kasih telah berpartisipasi dalam CROWN 2026! Suaramu sangat berarti.')

    } catch (err) {
      console.error('🔥 Unexpected error:', err)
      showAlert('Terjadi Kesalahan', 'Silakan coba lagi.', true)
    } finally {
      setIsSubmitting(false)
      setSelectedNomineeId(null)
    }
  }

  // Hydration guard
  if (!isMounted) return null

  return (
    <div className="min-h-screen flex flex-col bg-crown-espresso font-sans">
      <Navbar />

      <main className="flex-grow w-full max-w-4xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-14">
          <p className="text-crown-gold/60 text-xs font-semibold uppercase tracking-[0.4em] mb-4">
            Crown 2026 &mdash; Official Ballot
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-crown-gold mb-3 uppercase tracking-widest [text-shadow:0_0_30px_rgba(240,148,16,0.25)]">
            Pilih Kandidat Terbaik
          </h1>
          <div className="mx-auto h-px w-16 bg-crown-gold/30" />
        </div>

        {/* Notifikasi jika sudah melakukan voting */}
        {hasVoted && (
          <div className="mb-12 px-6 py-5 bg-crown-cream/[0.02] backdrop-blur-md border border-crown-gold/10 rounded-2xl flex items-center justify-center gap-3 animate-in fade-in zoom-in duration-500">
            <Lock className="text-crown-gold/70 h-5 w-5" strokeWidth={1.5} />
            <p className="font-medium text-crown-cream-dark text-base tracking-wide">
              Kamu sudah memberikan suara untuk kategori ini. Terima kasih!
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-9 w-9 text-crown-gold/70 animate-spin mb-5" strokeWidth={1.5} />
            <p className="font-medium text-crown-cream-dark/70 tracking-wide text-sm uppercase">Menyiapkan surat suara...</p>
          </div>
        ) : nominees.length === 0 ? (
          <div className="text-center bg-crown-cream/[0.02] backdrop-blur-md p-14 rounded-3xl border border-crown-gold/10">
            <Crown className="h-12 w-12 mx-auto text-crown-gold/30 mb-5" strokeWidth={1.25} />
            <p className="text-lg font-medium text-crown-cream-dark/70 tracking-wide">Belum ada kandidat di kategori ini.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {nominees.map((c) => {
              const isThisVoted = votedNomineeId === c.id

              return (
                <div
                  key={c.id}
                  className={`p-7 md:p-8 rounded-2xl border backdrop-blur-md transition-all duration-500 flex flex-col sm:flex-row items-center justify-between gap-6 ${
                    isThisVoted
                      ? 'border-crown-gold/30 bg-crown-gold/[0.04] shadow-[0_10px_40px_rgba(240,148,16,0.1)]'
                      : hasVoted
                      ? 'border-crown-bronze/10 bg-crown-cream/[0.01] opacity-50'
                      : 'border-crown-gold/10 bg-crown-cream/[0.02] hover:border-crown-gold/25 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(240,148,16,0.08)]'
                  }`}
                >
                  <div className="w-full sm:w-auto">
                    <h3 className={`text-xl md:text-2xl font-bold mb-2 tracking-wide ${
                      isThisVoted ? 'text-crown-gold' : 'text-crown-cream'
                    }`}>
                      {c.name}
                    </h3>
                    <p className="text-crown-cream-dark/60 text-sm leading-relaxed font-light">
                      {c.description || 'Tidak ada deskripsi.'}
                    </p>
                  </div>

                  {hasVoted ? (
                    <Button
                      disabled
                      className={`rounded-full font-medium tracking-wide px-7 py-5 text-sm transition-all duration-300 ${
                        isThisVoted
                          ? 'bg-crown-gold/90 text-crown-espresso'
                          : 'bg-white/5 border border-white/10 text-crown-cream-dark/50'
                      }`}
                    >
                      {isThisVoted ? (
                        <><CheckCircle2 className="mr-2 h-4 w-4" strokeWidth={1.75} /> Pilihanmu</>
                      ) : (
                        'Tertutup'
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleVoteClick(c.id)}
                      disabled={isSubmitting || !userId}
                      className="bg-crown-gold/90 hover:bg-crown-gold text-crown-espresso font-semibold tracking-wide rounded-full px-8 py-5 text-sm shadow-[0_4px_20px_rgba(240,148,16,0.15)] hover:shadow-[0_6px_28px_rgba(240,148,16,0.25)] hover:-translate-y-0.5 transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin h-4 w-4" strokeWidth={1.75} />
                      ) : (
                        <><CheckCircle2 className="mr-2 h-4 w-4" strokeWidth={1.75} /> Vote</>
                      )}
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* AlertDialog Konfirmasi Voting */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="bg-crown-espresso/95 backdrop-blur-xl border border-crown-gold/15 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3 text-xl font-bold text-crown-gold tracking-wide">
              <AlertTriangle className="h-5 w-5 text-crown-gold/80" strokeWidth={1.5} />
              Konfirmasi Pilihan
            </AlertDialogTitle>
            <AlertDialogDescription className="text-crown-cream-dark/70 font-light text-sm leading-relaxed mt-3">
              Apakah kamu yakin ingin memberikan suara untuk{' '}
              <span className="font-semibold text-crown-gold">
                {nominees.find(n => n.id === selectedNomineeId)?.name || 'kandidat ini'}
              </span>
              ? Satu akun hanya bisa memilih satu kali di kategori ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 flex gap-3">
            <AlertDialogCancel className="rounded-full font-medium tracking-wide px-6 py-4 text-sm border border-crown-bronze/20 text-crown-cream-dark/70 hover:bg-crown-cream/[0.03] transition-all duration-300">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmVote}
              className="rounded-full font-semibold tracking-wide px-6 py-4 text-sm text-crown-espresso bg-crown-gold/90 hover:bg-crown-gold shadow-[0_4px_20px_rgba(240,148,16,0.15)] transition-all duration-300"
            >
              Ya, Kunci Suaraku!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog Info / Error */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className={`bg-crown-espresso/95 backdrop-blur-xl border rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] ${
          alertIsError ? 'border-red-500/20' : 'border-crown-gold/15'
        }`}>
          <AlertDialogHeader>
            <AlertDialogTitle className={`flex items-center gap-3 text-xl font-bold tracking-wide ${
              alertIsError ? 'text-red-400/90' : 'text-crown-gold'
            }`}>
              {alertIsError ? (
                <AlertTriangle className="h-5 w-5" strokeWidth={1.5} />
              ) : (
                <CheckCircle2 className="h-5 w-5" strokeWidth={1.5} />
              )}
              {alertTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-crown-cream-dark/70 font-light text-sm leading-relaxed mt-3">
              {alertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8">
            <AlertDialogAction
              onClick={() => setAlertOpen(false)}
              className={`rounded-full font-semibold tracking-wide px-8 py-4 text-sm text-crown-espresso transition-all duration-300 ${
                alertIsError ? 'bg-red-500/90 hover:bg-red-500' : 'bg-crown-gold/90 hover:bg-crown-gold'
              }`}
            >
              OK, Mengerti!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}