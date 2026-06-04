'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { UserCircle2, GraduationCap, CalendarDays, Check, Info, AlertTriangle } from "lucide-react"

// --- Mock Data untuk MVP ---
const NOMINATIONS = [
  {
    id: "cat-1",
    title: "President Student Council",
    nominees: [
      {
        id: "n-1",
        name: "Arkananta Putra",
        major: "Software Engineering",
        batch: "2024",
        vision: "Membangun ekosistem kampus yang digital, inklusif, dan responsif terhadap kebutuhan mahasiswa Gen Z.",
        mission: "1. Digitalisasi penuh layanan aduan mahasiswa.\n2. Kolaborasi rutin dengan tech-startup lokal untuk internship."
      },
      {
        id: "n-2",
        name: "Nabila Maharani",
        major: "Information Systems",
        batch: "2024",
        vision: "Mewujudkan BEM yang transparan dan menjadi wadah nyata untuk pengembangan soft-skill mahasiswa.",
        mission: "1. Mengadakan bootcamp kepemimpinan gratis.\n2. Transparansi anggaran BEM secara real-time via website."
      },
    ]
  }
]

export default function DashboardPage() {
  // State untuk modal View Details
  const [selectedNominee, setSelectedNominee] = useState<(typeof NOMINATIONS)[0]['nominees'][0] | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // State untuk modal Konfirmasi Vote
  const [nomineeToVote, setNomineeToVote] = useState<(typeof NOMINATIONS)[0]['nominees'][0] | null>(null)
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false)

  const handleViewDetails = (nominee: any) => {
    setSelectedNominee(nominee)
    setIsDetailsModalOpen(true)
  }

  const handleVoteClick = (nominee: any) => {
    setNomineeToVote(nominee)
    setIsVoteModalOpen(true)
  }

  const confirmVote = () => {
    // Nanti logika insert ke Supabase ditaruh di sini ya Za
    console.log("Berhasil vote:", nomineeToVote?.name)
    
    // Tutup modal setelah berhasil
    setIsVoteModalOpen(false)
    
    // Opsional: Kamu bisa nambahin Toast Notification di sini 
    // biar user tau vote-nya sukses masuk
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-6 md:p-12 font-sans selection:bg-indigo-500/30">
      
      {/* Ornamen Background Soft Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Dashboard */}
        <div className="mb-12 border-b border-white/10 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Voting Dashboard</h1>
            <p className="text-zinc-400 text-sm">Pilih kandidat terbaik untuk masa depan kampus.</p>
          </div>
          {/* Avatar User Mockup */}
          <div className="h-10 w-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center">
            <UserCircle2 className="h-6 w-6 text-zinc-400" />
          </div>
        </div>

        {/* Render Kategori Nominasi */}
        {NOMINATIONS.map((category) => (
          <div key={category.id} className="mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mb-6">
              <span className="text-lg font-semibold text-zinc-200">{category.title}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.nominees.map((nominee) => (
                <div 
                  key={nominee.id}
                  className="group relative p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl hover:bg-zinc-900/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.05)] hover:-translate-y-1 flex flex-col"
                >
                  <div className="w-20 h-20 mx-auto rounded-full bg-zinc-800/50 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                    <UserCircle2 className="h-10 w-10 text-zinc-500" strokeWidth={1.5} />
                  </div>

                  <div className="text-center mb-6 flex-grow">
                    <h3 className="text-xl font-bold text-white mb-3">{nominee.name}</h3>
                    <div className="flex flex-col gap-2 items-center text-sm text-zinc-400">
                      <div className="flex items-center gap-2 bg-zinc-950/50 px-3 py-1.5 rounded-full border border-white/5">
                        <GraduationCap className="h-4 w-4 text-indigo-400" />
                        <span>{nominee.major}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-zinc-950/50 px-3 py-1.5 rounded-full border border-white/5">
                        <CalendarDays className="h-4 w-4 text-blue-400" />
                        <span>Angkatan {nominee.batch}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <Button 
                      variant="outline" 
                      className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl h-11"
                      onClick={() => handleViewDetails(nominee)}
                    >
                      <Info className="mr-2 h-4 w-4" />
                      Details
                    </Button>
                    <Button 
                      onClick={() => handleVoteClick(nominee)}
                      className="flex-1 bg-white hover:bg-zinc-200 text-zinc-950 rounded-xl h-11 font-bold shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Vote
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* 1. Modal / Dialog untuk View Details */}
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="bg-zinc-950 border border-zinc-800 text-zinc-50 sm:max-w-md p-0 overflow-hidden rounded-[2rem]">
            <div className="bg-gradient-to-br from-indigo-500/10 to-zinc-950 p-6 pb-4 border-b border-white/5 flex items-center gap-4">
               <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0">
                  <UserCircle2 className="h-8 w-8 text-zinc-400" />
               </div>
               <div>
                  <DialogTitle className="text-xl font-bold text-white mb-1">
                    {selectedNominee?.name}
                  </DialogTitle>
                  <DialogDescription className="text-zinc-400 text-sm flex items-center gap-2">
                    {selectedNominee?.major} • {selectedNominee?.batch}
                  </DialogDescription>
               </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Visi</h4>
                <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                  "{selectedNominee?.vision}"
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Misi</h4>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                  {selectedNominee?.mission}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 2. Modal / Dialog untuk Konfirmasi Vote */}
        <Dialog open={isVoteModalOpen} onOpenChange={setIsVoteModalOpen}>
          <DialogContent className="bg-zinc-950 border border-zinc-800 text-zinc-50 sm:max-w-md p-6 rounded-[2rem]">
            <DialogHeader className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center mb-2">
                <AlertTriangle className="h-6 w-6 text-indigo-400" />
              </div>
              <DialogTitle className="text-xl font-bold text-white text-center">
                Konfirmasi Pilihan
              </DialogTitle>
              <DialogDescription className="text-zinc-400 text-center text-sm leading-relaxed">
                Apakah kamu yakin ingin memberikan suara untuk <br />
                <span className="text-white font-semibold text-base block mt-2 mb-4">{nomineeToVote?.name}?</span>
                
                <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 py-2 px-3 rounded-lg block text-xs">
                  Perhatian: Pilihan pada kategori ini hanya bisa dilakukan <b>satu kali</b> dan tidak dapat diubah setelah dikonfirmasi.
                </span>
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setIsVoteModalOpen(false)} 
                className="flex-1 bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl h-11"
              >
                Batal
              </Button>
              <Button 
                onClick={confirmVote} 
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)]"
              >
                Ya, Vote Sekarang
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  )
}