'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertTriangle, Lock, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mendefinisikan tipe data sesuai skema database kamu
type Nominee = {
  id: string
  name: string
  description: string
  image_url: string
  category_id: string
}

export default function NominationDetailPage() {
  const { id: categoryId } = useParams()
  const [isMounted, setIsMounted] = useState(false)
  
  // State untuk data database
  const [nominees, setNominees] = useState<Nominee[]>([])
  const [hasVoted, setHasVoted] = useState(false)
  const [votedNomineeId, setVotedNomineeId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  
  // State untuk UI loading
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const fetchInitialData = async () => {
      // 1. Ambil sesi user saat ini
      const { data: { session } } = await supabase.auth.getSession()
      const currentUser = session?.user
      
      if (currentUser) {
        setUserId(currentUser.id)
      }

      // 2. Ambil daftar kandidat (nominees) berdasarkan category_id
      const { data: fetchedNominees } = await supabase
        .from('nominees')
        .select('*')
        .eq('category_id', categoryId)
      
      if (fetchedNominees) {
        setNominees(fetchedNominees)
      }

      // 3. Cek apakah user sudah pernah vote di kategori ini
      if (currentUser) {
        const { data: existingVote } = await supabase
          .from('votes')
          .select('nominee_id')
          .eq('category_id', categoryId)
          .eq('user_id', currentUser.id)
          .maybeSingle()

        if (existingVote) {
          setHasVoted(true)
          setVotedNomineeId(existingVote.nominee_id)
        }
      }

      setIsLoading(false)
    }

    fetchInitialData()
  }, [categoryId])

  const handleVote = async (nomineeId: string) => {
    if (!userId || hasVoted) return

    setIsSubmitting(true)

    console.log("Data yang akan dikirim:", {
      user_id: userId,
      nominee_id: nomineeId,
      category_id: categoryId
    })

    const { data, error } = await supabase
      .from('votes')
      .insert({
        user_id: userId,
        nominee_id: nomineeId,
        category_id: categoryId
      })

    if (!error) {
      setHasVoted(true)
      setVotedNomineeId(nomineeId)
      alert("Suara berhasil disimpan! 🎉")
    } else {
      console.error("Gagal mengirimkan suara. Detail dari Supabase:", error)
      alert("Maaf, terjadi kesalahan saat menyimpan suaramu. Cek Console untuk detailnya.")
    }

    setIsSubmitting(false)
  }

  if (!isMounted) return null

  return (
    <div className="min-h-screen flex flex-col bg-[#F5CF52] font-sans">
      <Navbar />
      
      <main className="flex-grow w-full max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-black text-[#E7267B] mb-8 text-center uppercase drop-shadow-[2px_2px_0px_white]">
          Pilih Kandidat Terbaik
        </h1>

        {/* Notifikasi jika sudah melakukan voting */}
        {hasVoted && (
          <div className="mb-8 p-4 bg-white/60 border-[3px] border-[#C8E53A] rounded-2xl flex items-center justify-center gap-3 shadow-[4px_4px_0px_#2345E6] animate-in fade-in zoom-in">
            <Lock className="text-[#2345E6] h-6 w-6" />
            <p className="font-bold text-[#2345E6] text-lg">
              Kamu sudah memberikan suara untuk kategori ini. Terima kasih!
            </p>
          </div>
        )}

        {isLoading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-[#2345E6] animate-spin mb-4" />
            <p className="font-bold text-[#E7267B]">Menyiapkan surat suara...</p>
          </div>
        ) : nominees.length === 0 ? (
          // Empty State
          <div className="text-center bg-white/50 p-8 rounded-3xl border-2 border-dashed border-[#E7267B]">
            <p className="text-xl font-bold text-[#E7267B]">Belum ada kandidat di kategori ini.</p>
          </div>
        ) : (
          // Daftar Kandidat
          <div className="space-y-6">
            {nominees.map((c) => {
              const isThisVoted = votedNomineeId === c.id

              return (
                <div 
                  key={c.id} 
                  className={`bg-white p-6 rounded-2xl border-[3px] flex flex-col sm:flex-row items-center justify-between transition-all duration-300 ${
                    isThisVoted 
                      ? "border-[#C8E53A] shadow-[0_0_20px_rgba(200,229,58,0.5)] ring-4 ring-[#C8E53A]/20" 
                      : "border-[#2345E6] shadow-[4px_4px_0px_#2345E6] hover:-translate-y-1"
                  } ${hasVoted && !isThisVoted ? "opacity-60 grayscale-[30%]" : ""}`}
                >
                  <div className="w-full sm:w-auto mb-4 sm:mb-0">
                    <h3 className="text-2xl font-black text-[#2345E6] mb-1">{c.name}</h3>
                    <p className="text-base text-zinc-600">{c.description || "Tidak ada deskripsi."}</p>
                  </div>

                  {/* Logika Tombol Vote */}
                  {hasVoted ? (
                    <Button 
                      disabled 
                      className={`rounded-full font-bold px-6 py-6 ${
                        isThisVoted 
                          ? "bg-[#C8E53A] text-[#2345E6] opacity-100" 
                          : "bg-zinc-200 text-zinc-400"
                      }`}
                    >
                      {isThisVoted ? <><CheckCircle2 className="mr-2 h-5 w-5" /> Pilihanmu</> : "Tertutup"}
                    </Button>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button 
                          disabled={isSubmitting || !userId}
                          className="bg-[#C8E53A] hover:bg-[#b0cc2f] text-[#2345E6] font-extrabold rounded-full px-8 py-6 shadow-[2px_2px_0px_#2345E6] animate-[pulse_4s_infinite]"
                        >
                          {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : <><CheckCircle2 className="mr-2 h-5 w-5" /> Vote</>}
                        </Button>
                      </AlertDialogTrigger>
                      
                      <AlertDialogContent className="bg-white border-[3px] border-[#2345E6] rounded-3xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-[#E7267B] flex items-center gap-2 text-xl font-black">
                            <AlertTriangle className="text-[#F5CF52] fill-[#F5CF52]" /> Konfirmasi Pilihan
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-zinc-700 font-medium text-base">
                            Apakah kamu yakin ingin memberikan suara untuk <span className="font-black text-[#2345E6]">{c.name}</span>? 
                            Satu akun hanya bisa memilih satu kali di kategori ini.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-full font-bold border-2 border-zinc-300">Batal</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleVote(c.id)}
                            className="bg-[#2345E6] text-white rounded-full font-bold hover:bg-[#1a35b8]"
                          >
                            Ya, Kunci Suaraku!
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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