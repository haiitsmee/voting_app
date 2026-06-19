'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import { supabase } from '@/lib/supabase/client'
import { 
  BarChart3, 
  FolderPlus, 
  UserPlus, 
  ShieldCheck, 
  Loader2, 
  Save,
  Megaphone,
  CheckCircle2,
  AlertTriangle,
  Pencil,
  Trash2,
  X
} from 'lucide-react'
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

// Tipe Data
type Category = { id: string; name: string }
type Nominee = { id: string; name: string; description: string; category_id: string }
type RankingItem = { name: string; count: number; category_id: string }

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('monitor')
  const [isLoading, setIsLoading] = useState(true)

  // Data State
  const [categories, setCategories] = useState<Category[]>([])
  const [nominees, setNominees] = useState<Nominee[]>([])
  const [stats, setStats] = useState({ votes: 0, categories: 0, nominees: 0 })
  const [ranking, setRanking] = useState<RankingItem[]>([])

  // Settings & Admin State
  const [settingId, setSettingId] = useState<string | null>(null)
  const [isVotingActive, setIsVotingActive] = useState(true)
  const [announcement, setAnnouncement] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')

  // CRUD State - Kategori
  const [newCatName, setNewCatName] = useState('')
  const [editingCatId, setEditingCatId] = useState<string | null>(null)

  // CRUD State - Nomine
  const [newNominee, setNewNominee] = useState({ name: '', description: '', category_id: '' })
  const [editingNomineeId, setEditingNomineeId] = useState<string | null>(null)

  // Alert Dialog State (Informasi)
  const [alertConfig, setAlertConfig] = useState({ open: false, title: '', message: '', isError: false })
  
  // Alert Dialog State (Konfirmasi Hapus)
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: '', id: '', name: '' })

  const showAlert = (title: string, message: string, isError = false) => {
    setAlertConfig({ open: true, title, message, isError })
  }

  const closeAlert = () => setAlertConfig(prev => ({ ...prev, open: false }))

  useEffect(() => {
    setIsMounted(true)
    fetchData()
    fetchRanking()
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const { data } = await supabase.from('settings').select('*').limit(1).single()
    if (data) {
      setSettingId(data.id)
      setIsVotingActive(data.voting_is_active)
      setAnnouncement(data.announcement || '')
    }
  }

  const fetchRanking = async () => {
    const { data, error } = await supabase.from('nominees').select(`name, category_id, votes(count)`)
    if (!error && data) {
      const formatted = data.map(n => ({
        name: n.name,
        category_id: n.category_id,
        // @ts-ignore
        count: n.votes[0]?.count || 0 
      })).sort((a, b) => b.count - a.count)
      setRanking(formatted)
    }
  }

  const fetchData = async () => {
    setIsLoading(true)
    const { data: catData } = await supabase.from('categories').select('*').order('created_at', { ascending: true })
    if (catData) setCategories(catData)

    const { data: nomData } = await supabase.from('nominees').select('*').order('created_at', { ascending: true })
    if (nomData) setNominees(nomData)

    const { count: voteCount } = await supabase.from('votes').select('*', { count: 'exact', head: true })

    setStats({
      votes: voteCount || 0,
      categories: catData?.length || 0,
      nominees: nomData?.length || 0
    })
    setIsLoading(false)
  }

  // --- CRUD KATEGORI ---

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName) return

    if (editingCatId) {
      // Proses Update
      const { error } = await supabase.from('categories').update({ name: newCatName }).eq('id', editingCatId)
      if (!error) {
        showAlert('Berhasil!', 'Kategori berhasil diperbarui! ✨')
        cancelEditCategory()
        fetchData()
      } else {
        showAlert('Gagal Update!', error.message, true)
      }
    } else {
      // Proses Insert
      const { error } = await supabase.from('categories').insert({ name: newCatName })
      if (!error) {
        showAlert('Berhasil!', 'Kategori baru ditambahkan! ✨')
        setNewCatName('')
        fetchData()
      } else {
        showAlert('Gagal Tambah!', error.message, true)
      }
    }
  }

  const startEditCategory = (c: Category) => {
    setEditingCatId(c.id)
    setNewCatName(c.name)
  }

  const cancelEditCategory = () => {
    setEditingCatId(null)
    setNewCatName('')
  }

  // --- CRUD NOMINE ---

  const handleSubmitNominee = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNominee.name || !newNominee.category_id) return

    if (editingNomineeId) {
      // Proses Update
      const { error } = await supabase.from('nominees').update(newNominee).eq('id', editingNomineeId)
      if (!error) {
        showAlert('Berhasil!', 'Kandidat berhasil diperbarui! 🎉')
        cancelEditNominee()
        fetchData()
      } else {
        showAlert('Gagal Update!', error.message, true)
      }
    } else {
      // Proses Insert
      const { error } = await supabase.from('nominees').insert(newNominee)
      if (!error) {
        showAlert('Berhasil!', 'Kandidat baru ditambahkan! 🎉')
        setNewNominee({ name: '', description: '', category_id: '' })
        fetchData()
      } else {
        showAlert('Gagal Tambah!', error.message, true)
      }
    }
  }

  const startEditNominee = (n: Nominee) => {
    setEditingNomineeId(n.id)
    setNewNominee({ name: n.name, description: n.description || '', category_id: n.category_id })
  }

  const cancelEditNominee = () => {
    setEditingNomineeId(null)
    setNewNominee({ name: '', description: '', category_id: '' })
  }

  // --- FUNGSI HAPUS (DELETE) ---

  const confirmDelete = (type: 'category' | 'nominee', id: string, name: string) => {
    setDeleteConfirm({ open: true, type, id, name })
  }

  const executeDelete = async () => {
    const { type, id } = deleteConfirm
    const table = type === 'category' ? 'categories' : 'nominees'
    
    const { error } = await supabase.from(table).delete().eq('id', id)
    
    setDeleteConfirm({ open: false, type: '', id: '', name: '' })

    if (!error) {
      showAlert('Terhapus!', `${type === 'category' ? 'Kategori' : 'Nomine'} berhasil dihapus dari sistem.`)
      fetchData()
      // Jika yang dihapus sedang di-edit, reset form-nya
      if (type === 'category' && editingCatId === id) cancelEditCategory()
      if (type === 'nominee' && editingNomineeId === id) cancelEditNominee()
    } else {
      showAlert('Gagal Menghapus!', `Pastikan data ini tidak sedang terhubung dengan data lain. Error: ${error.message}`, true)
    }
  }

  // --- FUNGSI LAINNYA ---

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAdminEmail) return
    const { data, error } = await supabase.rpc('make_admin_by_email', { admin_email: newAdminEmail })
    if (!error && data === true) {
      setNewAdminEmail('')
      showAlert('Berhasil!', 'Akses Admin berhasil diberikan! 🛡️')
    } else {
      showAlert('Gagal!', 'Pastikan email tersebut sudah terdaftar/login di sistem kita.', true)
    }
  }

  const toggleVotingStatus = async () => {
    if (!settingId) return
    const { error } = await supabase.from('settings').update({ voting_is_active: !isVotingActive }).eq('id', settingId)
    if (!error) {
      setIsVotingActive(!isVotingActive)
      showAlert('Status Diperbarui', `Status voting sekarang: ${!isVotingActive ? 'Aktif' : 'Ditutup'} 🌸`)
    }
  }

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settingId) return
    const { error } = await supabase.from('settings').update({ announcement }).eq('id', settingId)
    if (!error) showAlert('Berhasil!', 'Pengumuman berhasil disimpan! 📢')
  }

  const tabs = [
    { id: 'monitor', label: 'Pemantauan', icon: BarChart3 },
    { id: 'category', label: 'Kategori', icon: FolderPlus },
    { id: 'nominee', label: 'Nomine', icon: UserPlus },
    { id: 'settings', label: 'Pengaturan', icon: ShieldCheck },
  ]

  if (!isMounted) return null

  return (
    <div className="min-h-screen bg-[#F5CF52] font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8 relative z-10">
        <h1 className="text-4xl font-black text-[#E7267B] mb-8 text-center uppercase drop-shadow-[2px_2px_0px_white]">
          Control Panel
        </h1>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-bold rounded-full border-2 transition-all ${
                  isActive ? 'bg-[#2345E6] text-white border-[#2345E6] shadow-[4px_4px_0px_#E7267B] translate-y-[-2px]' : 'bg-white text-[#2345E6] border-[#2345E6] hover:bg-[#F5CF52]/20'
                }`}
              >
                <tab.icon className="w-5 h-5" /> {tab.label}
              </button>
            )
          })}
        </div>

        <div className="bg-white p-8 rounded-[2rem] border-[3px] border-[#2345E6] shadow-[8px_8px_0px_#2345E6] min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <Loader2 className="h-12 w-12 text-[#E7267B] animate-spin" />
              <p className="mt-4 font-bold text-[#2345E6]">Memuat data sistem...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: PEMANTAUAN (Tetap sama) */}
              {activeTab === 'monitor' && (
                <div className="animate-in fade-in duration-500 space-y-10">
                  {/* ... Kode Statistik Global & Ranking per kategori tetap sama persis ... */}
                  <div>
                    <h2 className="text-2xl font-black text-[#2345E6] mb-6">Statistik Global</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-[#C8E53A]/20 border-2 border-[#C8E53A] rounded-2xl text-center shadow-[4px_4px_0px_#C8E53A]"><p className="text-5xl font-black text-[#2345E6] mb-2">{stats.votes}</p><p className="font-bold text-zinc-700">Total Suara Masuk</p></div>
                      <div className="p-6 bg-[#E7267B]/10 border-2 border-[#E7267B] rounded-2xl text-center shadow-[4px_4px_0px_#E7267B]"><p className="text-5xl font-black text-[#E7267B] mb-2">{stats.categories}</p><p className="font-bold text-zinc-700">Kategori Aktif</p></div>
                      <div className="p-6 bg-[#2345E6]/10 border-2 border-[#2345E6] rounded-2xl text-center shadow-[4px_4px_0px_#2345E6]"><p className="text-5xl font-black text-[#2345E6] mb-2">{stats.nominees}</p><p className="font-bold text-zinc-700">Kandidat Terdaftar</p></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#2345E6] mb-6 uppercase">Posisi Kandidat per Kategori</h3>
                    {categories.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {categories.map((category) => {
                          const categoryRanking = ranking.filter(r => r.category_id === category.id)
                          return (
                            <div key={category.id} className="bg-zinc-50 border-2 border-zinc-200 rounded-2xl p-6 shadow-sm">
                              <h4 className="text-lg font-black text-[#E7267B] mb-4 border-b-2 border-zinc-200 pb-3">{category.name}</h4>
                              {categoryRanking.length > 0 ? (
                                <div className="space-y-3">
                                  {categoryRanking.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-zinc-200 transition-transform hover:scale-[1.02]">
                                      <div className="flex items-center gap-3"><span className={`w-8 h-8 flex items-center justify-center rounded-full font-black text-sm text-white ${idx === 0 ? 'bg-[#C8E53A] shadow-md' : idx === 1 ? 'bg-zinc-400' : idx === 2 ? 'bg-orange-400' : 'bg-zinc-200 text-zinc-600'}`}>{idx + 1}</span><span className="font-bold text-zinc-800">{item.name}</span></div>
                                      <span className="font-black text-[#E7267B]">{item.count} Suara</span>
                                    </div>
                                  ))}
                                </div>
                              ) : <p className="text-center font-medium text-zinc-400 py-4">Belum ada suara masuk.</p>}
                            </div>
                          )
                        })}
                      </div>
                    ) : <p className="text-center font-bold text-zinc-400">Belum ada data kategori.</p>}
                  </div>
                </div>
              )}

              {/* TAB 2: KATEGORI DENGAN CRUD */}
              {activeTab === 'category' && (
                <div className="animate-in fade-in duration-500 grid md:grid-cols-2 gap-10">
                  <div className="bg-zinc-50 p-6 rounded-3xl border-2 border-zinc-200 h-fit">
                    <h2 className="text-2xl font-black text-[#2345E6] mb-4">
                      {editingCatId ? 'Ubah Kategori' : 'Tambah Kategori'}
                    </h2>
                    <form onSubmit={handleSubmitCategory} className="space-y-4">
                      <input 
                        type="text" required value={newCatName} onChange={(e) => setNewCatName(e.target.value)}
                        className="w-full p-4 border-2 border-zinc-300 rounded-xl focus:border-[#E7267B] focus:outline-none focus:ring-4 focus:ring-[#E7267B]/20"
                        placeholder="Contoh: BEM Fakultas Terbaik"
                      />
                      <div className="flex gap-2">
                        <button type="submit" className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white font-bold rounded-xl shadow-[4px_4px_0px_#2345E6] transition-transform active:translate-y-1 ${editingCatId ? 'bg-[#2345E6] hover:bg-[#1a35b8]' : 'bg-[#E7267B] hover:bg-[#c21f66]'}`}>
                          <Save className="w-5 h-5" /> {editingCatId ? 'Simpan Perubahan' : 'Simpan Kategori'}
                        </button>
                        {editingCatId && (
                          <button type="button" onClick={cancelEditCategory} className="px-4 py-3 bg-zinc-200 text-zinc-700 font-bold rounded-xl hover:bg-zinc-300 transition-colors">
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#2345E6] mb-4">Daftar Kategori ({categories.length})</h2>
                    <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
                      {categories.map(c => (
                        <div key={c.id} className={`flex items-center justify-between p-4 border-2 rounded-xl font-bold transition-colors ${editingCatId === c.id ? 'border-[#E7267B] bg-[#E7267B]/10 text-[#E7267B]' : 'border-zinc-200 bg-zinc-50 text-[#2345E6]'}`}>
                          <span>{c.name}</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => startEditCategory(c)} className="p-2 text-zinc-400 hover:text-[#2345E6] hover:bg-white rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => confirmDelete('category', c.id, c.name)} className="p-2 text-zinc-400 hover:text-[#E7267B] hover:bg-white rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: NOMINE DENGAN CRUD */}
              {activeTab === 'nominee' && (
                <div className="animate-in fade-in duration-500 grid md:grid-cols-2 gap-10">
                  <div className="bg-zinc-50 p-6 rounded-3xl border-2 border-zinc-200 h-fit">
                    <h2 className="text-2xl font-black text-[#2345E6] mb-4">
                      {editingNomineeId ? 'Ubah Kandidat' : 'Tambah Kandidat'}
                    </h2>
                    <form onSubmit={handleSubmitNominee} className="space-y-4">
                      <select 
                        required value={newNominee.category_id} onChange={(e) => setNewNominee({ ...newNominee, category_id: e.target.value })}
                        className="w-full p-4 border-2 border-zinc-300 rounded-xl focus:border-[#E7267B] focus:outline-none"
                      >
                        <option value="">-- Pilih Kategori --</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <input 
                        type="text" required value={newNominee.name} onChange={(e) => setNewNominee({ ...newNominee, name: e.target.value })}
                        className="w-full p-4 border-2 border-zinc-300 rounded-xl focus:border-[#E7267B] focus:outline-none" placeholder="Nama Nomine"
                      />
                      <textarea 
                        value={newNominee.description} onChange={(e) => setNewNominee({ ...newNominee, description: e.target.value })}
                        className="w-full p-4 border-2 border-zinc-300 rounded-xl focus:border-[#E7267B] focus:outline-none" rows={3} placeholder="Deskripsi Singkat"
                      />
                      <div className="flex gap-2">
                        <button type="submit" className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white font-bold rounded-xl shadow-[4px_4px_0px_#2345E6] transition-transform active:translate-y-1 ${editingNomineeId ? 'bg-[#2345E6] hover:bg-[#1a35b8]' : 'bg-[#E7267B] hover:bg-[#c21f66]'}`}>
                          <Save className="w-5 h-5" /> {editingNomineeId ? 'Simpan Perubahan' : 'Simpan Kandidat'}
                        </button>
                        {editingNomineeId && (
                          <button type="button" onClick={cancelEditNominee} className="px-4 py-3 bg-zinc-200 text-zinc-700 font-bold rounded-xl hover:bg-zinc-300 transition-colors">
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#2345E6] mb-4">Daftar Nomine ({nominees.length})</h2>
                    <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2">
                      {nominees.map(n => (
                        <div key={n.id} className={`flex items-start justify-between p-4 border-2 rounded-xl transition-colors ${editingNomineeId === n.id ? 'border-[#E7267B] bg-[#E7267B]/10' : 'border-zinc-200 bg-zinc-50'}`}>
                          <div>
                            <p className={`font-black ${editingNomineeId === n.id ? 'text-[#E7267B]' : 'text-[#2345E6]'}`}>{n.name}</p>
                            <p className="text-xs font-bold text-zinc-500 mt-1">Kat: {categories.find(c => c.id === n.category_id)?.name || 'Unknown'}</p>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <button onClick={() => startEditNominee(n)} className="p-2 text-zinc-400 hover:text-[#2345E6] hover:bg-white rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => confirmDelete('nominee', n.id, n.name)} className="p-2 text-zinc-400 hover:text-[#E7267B] hover:bg-white rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PENGATURAN (Tetap sama persis) */}
              {activeTab === 'settings' && (
                <div className="animate-in fade-in duration-500 space-y-12">
                   {/* ... Kode pengaturan status, pengumuman, dan admin ... */}
                   <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-zinc-50 p-6 rounded-3xl border-2 border-zinc-200 text-center flex flex-col justify-center">
                      <h3 className="text-xl font-black text-[#2345E6] mb-4">Sesi Voting</h3>
                      <div className={`p-6 rounded-2xl border-[3px] mb-4 transition-colors ${isVotingActive ? 'border-[#C8E53A] bg-[#C8E53A]/10' : 'border-[#E7267B] bg-[#E7267B]/10'}`}><p className="font-bold text-lg text-zinc-700">Status saat ini:</p><p className={`text-3xl font-black ${isVotingActive ? 'text-[#C8E53A]' : 'text-[#E7267B]'}`}>{isVotingActive ? 'AKTIF' : 'DITUTUP'}</p></div>
                      <button onClick={toggleVotingStatus} className={`w-full py-4 font-black rounded-xl text-white shadow-[4px_4px_0px_rgba(0,0,0,0.1)] transition-transform active:translate-y-1 ${isVotingActive ? 'bg-[#E7267B] hover:bg-[#c21f66]' : 'bg-[#C8E53A] text-[#2345E6] hover:bg-[#b0cc2f]'}`}>{isVotingActive ? 'Tutup Voting Sekarang' : 'Buka Voting Kembali'}</button>
                    </div>
                    <div className="bg-zinc-50 p-6 rounded-3xl border-2 border-zinc-200">
                      <h3 className="text-xl font-black text-[#2345E6] mb-4 flex items-center gap-2"><Megaphone className="w-5 h-5 text-[#E7267B]" /> Teks Pengumuman</h3>
                      <p className="text-sm font-medium text-zinc-500 mb-4">Teks ini bisa kamu tampilkan di halaman depan atau halaman ranking.</p>
                      <form onSubmit={handleSaveAnnouncement} className="space-y-4 flex flex-col h-[calc(100%-80px)]">
                        <textarea value={announcement} onChange={(e) => setAnnouncement(e.target.value)} className="w-full p-4 border-2 border-zinc-300 rounded-xl focus:border-[#E7267B] focus:outline-none flex-grow" placeholder="Contoh: Malam Puncak akan diadakan pada 25 Des 2025!" />
                        <button type="submit" className="w-full py-4 bg-[#2345E6] text-white font-bold rounded-xl hover:bg-[#1a35b8] shadow-[4px_4px_0px_#E7267B]">Simpan Pengumuman</button>
                      </form>
                    </div>
                  </div>
                  <hr className="border-2 border-dashed border-zinc-200" />
                  <div className="max-w-xl mx-auto text-center">
                    <div className="mb-6 flex justify-center"><ShieldCheck className="w-16 h-16 text-[#C8E53A] drop-shadow-[2px_2px_0px_#2345E6]" /></div>
                    <h2 className="text-2xl font-black text-[#2345E6] mb-2">Kelola Akses Administrator</h2>
                    <p className="text-zinc-600 font-medium mb-6">Masukkan alamat email untuk memberikan akses penuh pada dasbor ini.</p>
                    <form onSubmit={handleAddAdmin} className="space-y-4">
                      <input type="email" required value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} className="w-full p-4 border-2 border-zinc-300 rounded-xl text-center focus:border-[#2345E6] focus:outline-none" placeholder="Contoh: temanmu@gmail.com" />
                      <button type="submit" className="w-full py-4 bg-[#2345E6] text-[#C8E53A] font-black text-lg rounded-xl hover:bg-[#1a35b8] shadow-[4px_4px_0px_#E7267B] transition-transform active:translate-y-1">Jadikan Admin</button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* 1. Global Alert Dialog (Untuk Info & Error) */}
      <AlertDialog open={alertConfig.open} onOpenChange={(open) => !open && closeAlert()}>
        <AlertDialogContent className={`bg-white border-[3px] rounded-3xl ${alertConfig.isError ? 'border-[#E7267B]' : 'border-[#2345E6]'}`}>
          <AlertDialogHeader>
            <AlertDialogTitle className={`flex items-center gap-2 text-2xl font-black ${alertConfig.isError ? 'text-[#E7267B]' : 'text-[#2345E6]'}`}>
              {alertConfig.isError ? <AlertTriangle className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
              {alertConfig.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-700 font-medium text-base mt-2">
              {alertConfig.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogAction onClick={closeAlert} className={`rounded-full font-bold px-8 py-6 text-white ${alertConfig.isError ? 'bg-[#E7267B] hover:bg-[#c21f66]' : 'bg-[#2345E6] hover:bg-[#1a35b8]'}`}>
              OK, Mengerti!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 2. Alert Dialog Konfirmasi Hapus */}
      <AlertDialog open={deleteConfirm.open} onOpenChange={(open) => !open && setDeleteConfirm({ open: false, type: '', id: '', name: '' })}>
        <AlertDialogContent className="bg-white border-[3px] border-[#E7267B] rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-2xl font-black text-[#E7267B]">
              <AlertTriangle className="h-6 w-6" /> Konfirmasi Hapus
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-700 font-medium text-base mt-2">
              Apakah kamu yakin ingin menghapus <strong>{deleteConfirm.name}</strong>? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex gap-2">
            <AlertDialogCancel className="rounded-full font-bold px-8 py-6 border-2 border-zinc-200 text-zinc-600 hover:bg-zinc-100">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete} className="rounded-full font-bold px-8 py-6 text-white bg-[#E7267B] hover:bg-[#c21f66] shadow-[4px_4px_0px_#2345E6]">
              Ya, Hapus Sekarang
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}