'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import { supabase } from '@/lib/supabase/client'
import { supabaseFetcher } from '@/lib/supabase/fetcher'
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
  X,
  Users,
  Search,
  Download,
  Image as ImageIcon,
  Video,
  Upload,
  Eye,
  EyeOff,
  Film
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
type Voter = {
  id: string
  nim: string
  email: string
  created_at: string
}
type Documentation = {
  id: string
  title: string
  description: string | null
  media_url: string
  media_type: 'image' | 'video'
  category_id: string | null
  display_order: number
  is_published: boolean
  created_at: string
}

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

  // Voters State
  const [voters, setVoters] = useState<Voter[]>([])
  const [votersLoading, setVotersLoading] = useState(false)
  const [votersSearch, setVotersSearch] = useState('')
  const [votersError, setVotersError] = useState<string | null>(null)

  // CRUD State - Dokumentasi
  const [documentation, setDocumentation] = useState<Documentation[]>([])
  const [docLoading, setDocLoading] = useState(false)
  const [docUploading, setDocUploading] = useState(false)
  const [newDoc, setNewDoc] = useState({ title: '', description: '', category_id: '' })
  const [newDocFile, setNewDocFile] = useState<File | null>(null)
  const [editingDocId, setEditingDocId] = useState<string | null>(null)

  // Alert Dialog State
  const [alertConfig, setAlertConfig] = useState({ open: false, title: '', message: '', isError: false })
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

  // --- FETCH FUNCTIONS ---
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

  // --- FETCH VOTERS ---
  const fetchVoters = async () => {
    setVotersLoading(true)
    setVotersError(null)
    try {
      const { data, error } = await supabaseFetcher<Voter[]>({
        table: 'voters',
        select: '*',
        order: { column: 'created_at', ascending: false }
      })
      if (error) {
        if (error.code === '42501') {
          setVotersError('Akses ditolak. Anda tidak memiliki izin untuk melihat data voters.')
        } else {
          setVotersError(`Gagal mengambil data voters: ${error.message}`)
        }
        setVoters([])
      } else {
        setVoters(data || [])
      }
    } catch (err) {
      console.error('Unexpected error fetchVoters:', err)
      setVotersError('Terjadi kesalahan tak terduga saat memuat data voters.')
      setVoters([])
    } finally {
      setVotersLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'voters') {
      fetchVoters()
    }
    if (activeTab === 'documentation') {
      fetchDocumentation()
    }
  }, [activeTab])

  // --- FETCH DOKUMENTASI ---
  const fetchDocumentation = async () => {
    setDocLoading(true)
    const { data, error } = await supabaseFetcher<Documentation[]>({
      table: 'documentation',
      order: { column: 'display_order', ascending: true },
    })
    if (!error && data) setDocumentation(data)
    setDocLoading(false)
  }

  // --- CRUD KATEGORI ---
  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName) return

    if (editingCatId) {
      const { error } = await supabase.from('categories').update({ name: newCatName }).eq('id', editingCatId)
      if (!error) {
        showAlert('Berhasil!', 'Kategori berhasil diperbarui! ✨')
        cancelEditCategory()
        fetchData()
      } else {
        showAlert('Gagal Update!', error.message, true)
      }
    } else {
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
      const { error } = await supabase.from('nominees').update(newNominee).eq('id', editingNomineeId)
      if (!error) {
        showAlert('Berhasil!', 'Kandidat berhasil diperbarui! 🎉')
        cancelEditNominee()
        fetchData()
      } else {
        showAlert('Gagal Update!', error.message, true)
      }
    } else {
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

  // --- CRUD DOKUMENTASI ---
  const MAX_DOC_FILE_SIZE = 20 * 1024 * 1024 // 20MB

  const handleDocFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setNewDocFile(null)
      return
    }
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    if (!isImage && !isVideo) {
      showAlert('Format Tidak Didukung', 'Hanya file gambar (jpg, png, dst) atau video (mp4, dst) yang diperbolehkan.', true)
      e.target.value = ''
      return
    }
    if (file.size > MAX_DOC_FILE_SIZE) {
      showAlert('File Terlalu Besar', 'Ukuran file maksimal 20MB.', true)
      e.target.value = ''
      return
    }
    setNewDocFile(file)
  }

  const handleSubmitDocumentation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDoc.title) return
    if (!editingDocId && !newDocFile) {
      showAlert('File Wajib Diisi', 'Silakan pilih foto atau video untuk diunggah.', true)
      return
    }

    setDocUploading(true)
    try {
      let mediaUrl: string | undefined
      let mediaType: 'image' | 'video' | undefined

      // Upload file baru ke storage jika ada
      if (newDocFile) {
        mediaType = newDocFile.type.startsWith('video/') ? 'video' : 'image'
        const ext = newDocFile.name.split('.').pop()
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('documentation')
          .upload(path, newDocFile)

        if (uploadError) {
          showAlert('Gagal Upload!', uploadError.message, true)
          setDocUploading(false)
          return
        }

        const { data: publicUrlData } = supabase.storage
          .from('documentation')
          .getPublicUrl(path)
        mediaUrl = publicUrlData.publicUrl
      }

      const payload: Record<string, any> = {
        title: newDoc.title,
        description: newDoc.description || null,
        category_id: newDoc.category_id || null,
      }
      if (mediaUrl) payload.media_url = mediaUrl
      if (mediaType) payload.media_type = mediaType

      if (editingDocId) {
        const { error } = await supabase.from('documentation').update(payload).eq('id', editingDocId)
        if (!error) {
          showAlert('Berhasil!', 'Dokumentasi berhasil diperbarui! 📸')
          cancelEditDocumentation()
          fetchDocumentation()
        } else {
          showAlert('Gagal Update!', error.message, true)
        }
      } else {
        const { error } = await supabase.from('documentation').insert(payload)
        if (!error) {
          showAlert('Berhasil!', 'Dokumentasi baru berhasil diunggah! 📸')
          setNewDoc({ title: '', description: '', category_id: '' })
          setNewDocFile(null)
          fetchDocumentation()
        } else {
          showAlert('Gagal Tambah!', error.message, true)
        }
      }
    } catch (err) {
      console.error('Unexpected error handleSubmitDocumentation:', err)
      showAlert('Terjadi Kesalahan', 'Gagal memproses unggahan dokumentasi.', true)
    } finally {
      setDocUploading(false)
    }
  }

  const startEditDocumentation = (d: Documentation) => {
    setEditingDocId(d.id)
    setNewDoc({ title: d.title, description: d.description || '', category_id: d.category_id || '' })
    setNewDocFile(null)
  }
  const cancelEditDocumentation = () => {
    setEditingDocId(null)
    setNewDoc({ title: '', description: '', category_id: '' })
    setNewDocFile(null)
  }

  const toggleDocPublish = async (d: Documentation) => {
    const { error } = await supabase.from('documentation').update({ is_published: !d.is_published }).eq('id', d.id)
    if (!error) {
      fetchDocumentation()
    } else {
      showAlert('Gagal!', error.message, true)
    }
  }

  // --- DELETE ---
  const confirmDelete = (type: 'category' | 'nominee' | 'documentation', id: string, name: string) => {
    setDeleteConfirm({ open: true, type, id, name })
  }

  const executeDelete = async () => {
    const { type, id } = deleteConfirm

    if (type === 'documentation') {
      const doc = documentation.find(d => d.id === id)
      const { error } = await supabase.from('documentation').delete().eq('id', id)
      setDeleteConfirm({ open: false, type: '', id: '', name: '' })
      if (!error) {
        // Hapus juga file di storage (best-effort, tidak menghalangi jika gagal)
        if (doc?.media_url) {
          const fileName = doc.media_url.split('/documentation/').pop()
          if (fileName) {
            await supabase.storage.from('documentation').remove([fileName])
          }
        }
        showAlert('Terhapus!', 'Dokumentasi berhasil dihapus dari sistem.')
        fetchDocumentation()
        if (editingDocId === id) cancelEditDocumentation()
      } else {
        showAlert('Gagal Menghapus!', error.message, true)
      }
      return
    }

    const table = type === 'category' ? 'categories' : 'nominees'
    
    const { error } = await supabase.from(table).delete().eq('id', id)
    
    setDeleteConfirm({ open: false, type: '', id: '', name: '' })

    if (!error) {
      showAlert('Terhapus!', `${type === 'category' ? 'Kategori' : 'Nomine'} berhasil dihapus dari sistem.`)
      fetchData()
      if (type === 'category' && editingCatId === id) cancelEditCategory()
      if (type === 'nominee' && editingNomineeId === id) cancelEditNominee()
    } else {
      showAlert('Gagal Menghapus!', `Pastikan data ini tidak sedang terhubung dengan data lain. Error: ${error.message}`, true)
    }
  }

  // --- ADMIN FUNCTIONS ---
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
      showAlert('Status Diperbarui', `Status voting sekarang: ${!isVotingActive ? 'Aktif' : 'Ditutup'}`)
    }
  }

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settingId) return
    const { error } = await supabase.from('settings').update({ announcement }).eq('id', settingId)
    if (!error) showAlert('Berhasil!', 'Pengumuman berhasil disimpan! 📢')
  }

  const exportVotersCSV = () => {
    const filtered = getFilteredVoters()
    if (filtered.length === 0) {
      showAlert('Tidak Ada Data', 'Tidak ada data voters untuk diekspor.', true)
      return
    }
    const delimiter = ';'
    const headers = ['Email', 'NIM', 'Tanggal Registrasi']
    const rows = filtered.map(v => [
      v.email,
      `="${v.nim}"`, // NIM diformat sebagai teks agar tidak scientific notation
      new Date(v.created_at).toLocaleString('id-ID', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    ])
    const csvContent = [
      headers.join(delimiter),
      ...rows.map(r => r.join(delimiter))
    ].join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `voters_${new Date().toISOString().slice(0,10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  const getFilteredVoters = () => {
    if (!votersSearch.trim()) return voters
    const q = votersSearch.trim().toLowerCase()
    return voters.filter(v => 
      v.email.toLowerCase().includes(q) || 
      v.nim.includes(q)
    )
  }

  // TABS
  const tabs = [
    { id: 'monitor', label: 'Pemantauan', icon: BarChart3 },
    { id: 'category', label: 'Kategori', icon: FolderPlus },
    { id: 'nominee', label: 'Nomine', icon: UserPlus },
    { id: 'voters', label: 'Data Voters', icon: Users },
    { id: 'documentation', label: 'Dokumentasi', icon: ImageIcon },
    { id: 'settings', label: 'Pengaturan', icon: ShieldCheck },
  ]

  if (!isMounted) return null

  // Komponen Tabel Voters
  const renderVotersTable = () => {
    const filtered = getFilteredVoters()
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-crown-gold/60" />
            <input
              type="text"
              placeholder="Cari NIM atau Email..."
              value={votersSearch}
              onChange={(e) => setVotersSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-crown-espresso border border-crown-gold/30 rounded-xl text-crown-cream placeholder:text-crown-cream-dark/50 focus:outline-none focus:ring-2 focus:ring-crown-gold/60 transition-all"
            />
          </div>
          <button
            onClick={exportVotersCSV}
            className="flex items-center gap-2 px-5 py-2 bg-crown-gold text-crown-espresso font-bold rounded-xl hover:bg-[#d8820e] transition-colors shadow-[0_4px_12px_rgba(240,148,16,0.3)]"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {votersLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 text-crown-gold animate-spin" />
          </div>
        ) : votersError ? (
          <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-4 rounded-xl flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span>{votersError}</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-crown-cream-dark/60">
            {votersSearch ? 'Tidak ada voter yang cocok dengan pencarian.' : 'Belum ada data voter.'}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-crown-bronze/20 bg-crown-espresso/50">
            <table className="w-full text-left">
              <thead className="border-b border-crown-bronze/30 bg-crown-espresso">
                <tr>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-crown-gold">No</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-crown-gold">Email Voter</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-crown-gold">NIM Terverifikasi</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-crown-gold">Waktu Registrasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-crown-bronze/10">
                {filtered.map((voter, idx) => (
                  <tr key={voter.id} className="hover:bg-crown-cream/5 transition-colors">
                    <td className="px-4 py-3 text-crown-cream-dark">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-crown-cream">{voter.email}</td>
                    <td className="px-4 py-3 font-mono text-crown-cream-dark">{voter.nim}</td>
                    <td className="px-4 py-3 text-sm text-crown-cream-dark">
                      {new Date(voter.created_at).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  // Komponen Tab Dokumentasi
  const renderDocumentationTab = () => (
    <div className="animate-in fade-in duration-500 grid md:grid-cols-2 gap-10">
      <div className="bg-crown-cream/5 p-6 rounded-3xl border border-crown-gold/20 h-fit">
        <h2 className="text-2xl font-black text-crown-gold mb-4">
          {editingDocId ? 'Ubah Dokumentasi' : 'Unggah Dokumentasi'}
        </h2>
        <form onSubmit={handleSubmitDocumentation} className="space-y-4">
          <input
            type="text" required value={newDoc.title} onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
            className="w-full p-4 bg-crown-espresso border border-crown-gold/30 rounded-xl focus:border-crown-gold focus:outline-none focus:ring-2 focus:ring-crown-gold/30 text-crown-cream placeholder:text-crown-cream-dark/50"
            placeholder="Judul (mis. Malam Puncak 2025)"
          />
          <textarea
            value={newDoc.description} onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
            className="w-full p-4 bg-crown-espresso border border-crown-gold/30 rounded-xl focus:border-crown-gold focus:outline-none focus:ring-2 focus:ring-crown-gold/30 text-crown-cream placeholder:text-crown-cream-dark/50" rows={3} placeholder="Deskripsi Singkat (opsional)"
          />
          <select
            value={newDoc.category_id} onChange={(e) => setNewDoc({ ...newDoc, category_id: e.target.value })}
            className="w-full p-4 bg-crown-espresso border border-crown-gold/30 rounded-xl focus:border-crown-gold focus:outline-none focus:ring-2 focus:ring-crown-gold/30 text-crown-cream"
          >
            <option value="">-- Tanpa Kategori --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <label className="flex flex-col items-center justify-center gap-2 w-full p-6 bg-crown-espresso border-2 border-dashed border-crown-gold/40 rounded-xl cursor-pointer hover:border-crown-gold transition-colors">
            <Upload className="w-6 h-6 text-crown-gold" />
            <span className="text-sm font-bold text-crown-cream-dark text-center">
              {newDocFile ? newDocFile.name : editingDocId ? 'Ganti file (opsional)' : 'Pilih foto atau video'}
            </span>
            <input type="file" accept="image/*,video/*" onChange={handleDocFileChange} className="hidden" />
          </label>

          <div className="flex gap-2">
            <button
              type="submit" disabled={docUploading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-crown-espresso font-bold rounded-xl shadow-[0_4px_12px_rgba(240,148,16,0.3)] transition-transform active:translate-y-1 bg-crown-gold hover:bg-[#d8820e] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {docUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {docUploading ? 'Mengunggah...' : editingDocId ? 'Simpan Perubahan' : 'Unggah'}
            </button>
            {editingDocId && (
              <button type="button" onClick={cancelEditDocumentation} className="px-4 py-3 bg-crown-cream/10 text-crown-cream font-bold rounded-xl hover:bg-crown-cream/20 transition-colors">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-black text-crown-gold mb-4">Galeri ({documentation.length})</h2>
        {docLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 text-crown-gold animate-spin" />
          </div>
        ) : documentation.length === 0 ? (
          <div className="text-center py-12 text-crown-cream-dark/60 font-medium">Belum ada dokumentasi diunggah.</div>
        ) : (
          <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2">
            {documentation.map(d => (
              <div key={d.id} className={`flex items-start gap-4 p-4 border rounded-xl transition-colors ${
                editingDocId === d.id ? 'border-crown-gold bg-crown-gold/10' : 'border-crown-bronze/20 bg-crown-cream/5'
              }`}>
                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-crown-espresso border border-crown-bronze/20 flex items-center justify-center">
                  {d.media_type === 'video' ? (
                    <Film className="w-8 h-8 text-crown-gold/60" />
                  ) : (
                    <img src={d.media_url} alt={d.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-black truncate ${editingDocId === d.id ? 'text-crown-gold' : 'text-crown-cream'}`}>{d.title}</p>
                    {d.media_type === 'video' && <Video className="w-3.5 h-3.5 text-crown-cream-dark/50 flex-shrink-0" />}
                  </div>
                  {d.description && <p className="text-xs text-crown-cream-dark/60 mt-1 line-clamp-2">{d.description}</p>}
                  <p className="text-xs font-bold text-crown-cream-dark/60 mt-1">
                    Kat: {categories.find(c => c.id === d.category_id)?.name || 'Umum'} · {d.is_published ? 'Tayang' : 'Draft'}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1 ml-2 flex-shrink-0">
                  <button onClick={() => toggleDocPublish(d)} title={d.is_published ? 'Sembunyikan' : 'Tayangkan'} className="p-2 text-crown-cream-dark/50 hover:text-crown-gold hover:bg-crown-cream/10 rounded-lg transition-colors">
                    {d.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => startEditDocumentation(d)} className="p-2 text-crown-cream-dark/50 hover:text-crown-gold hover:bg-crown-cream/10 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => confirmDelete('documentation', d.id, d.title)} className="p-2 text-crown-cream-dark/50 hover:text-red-400 hover:bg-crown-cream/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-crown-espresso font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8 relative z-10">
        <h1 className="text-4xl font-black text-crown-gold mb-8 text-center uppercase drop-shadow-[2px_2px_0px_rgba(188,67,13,0.4)]">
          Control Panel
        </h1>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-bold rounded-full border-2 transition-all ${
                  isActive 
                    ? 'bg-crown-gold text-crown-espresso border-crown-gold shadow-[0_4px_16px_rgba(240,148,16,0.4)] translate-y-[-2px]' 
                    : 'bg-crown-cream/10 text-crown-cream border-crown-gold/30 hover:bg-crown-cream/20'
                }`}
              >
                <tab.icon className="w-5 h-5" /> {tab.label}
              </button>
            )
          })}
        </div>

        <div className="bg-crown-cream/5 backdrop-blur-md p-8 rounded-[2rem] border border-crown-gold/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <Loader2 className="h-12 w-12 text-crown-gold animate-spin" />
              <p className="mt-4 font-bold text-crown-cream">Memuat data sistem...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: PEMANTAUAN */}
              {activeTab === 'monitor' && (
                <div className="animate-in fade-in duration-500 space-y-10">
                  <div>
                    <h2 className="text-2xl font-black text-crown-gold mb-6">Statistik Global</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-crown-cream/10 border border-crown-gold/30 rounded-2xl text-center shadow-[0_4px_12px_rgba(240,148,16,0.1)]">
                        <p className="text-5xl font-black text-crown-gold mb-2">{stats.votes}</p>
                        <p className="font-bold text-crown-cream-dark">Total Suara Masuk</p>
                      </div>
                      <div className="p-6 bg-crown-cream/10 border border-crown-gold/30 rounded-2xl text-center shadow-[0_4px_12px_rgba(240,148,16,0.1)]">
                        <p className="text-5xl font-black text-crown-gold mb-2">{stats.categories}</p>
                        <p className="font-bold text-crown-cream-dark">Kategori Aktif</p>
                      </div>
                      <div className="p-6 bg-crown-cream/10 border border-crown-gold/30 rounded-2xl text-center shadow-[0_4px_12px_rgba(240,148,16,0.1)]">
                        <p className="text-5xl font-black text-crown-gold mb-2">{stats.nominees}</p>
                        <p className="font-bold text-crown-cream-dark">Kandidat Terdaftar</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-crown-gold mb-6 uppercase">Posisi Kandidat per Kategori</h3>
                    {categories.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {categories.map((category) => {
                          const categoryRanking = ranking.filter(r => r.category_id === category.id)
                          return (
                            <div key={category.id} className="bg-crown-cream/5 border border-crown-bronze/20 rounded-2xl p-6 shadow-sm">
                              <h4 className="text-lg font-black text-crown-gold mb-4 border-b border-crown-bronze/30 pb-3">{category.name}</h4>
                              {categoryRanking.length > 0 ? (
                                <div className="space-y-3">
                                  {categoryRanking.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-crown-cream/5 rounded-xl border border-crown-bronze/10 transition-transform hover:scale-[1.02]">
                                      <div className="flex items-center gap-3">
                                        <span className={`w-8 h-8 flex items-center justify-center rounded-full font-black text-sm ${
                                          idx === 0 ? 'bg-crown-gold text-crown-espresso shadow-md' : 
                                          idx === 1 ? 'bg-crown-bronze/60 text-crown-cream' : 
                                          idx === 2 ? 'bg-crown-bronze/30 text-crown-cream' : 
                                          'bg-crown-cream/10 text-crown-cream-dark'
                                        }`}>
                                          {idx + 1}
                                        </span>
                                        <span className="font-bold text-crown-cream">{item.name}</span>
                                      </div>
                                      <span className="font-black text-crown-gold">{item.count} Suara</span>
                                    </div>
                                  ))}
                                </div>
                              ) : <p className="text-center font-medium text-crown-cream-dark/60 py-4">Belum ada suara masuk.</p>}
                            </div>
                          )
                        })}
                      </div>
                    ) : <p className="text-center font-bold text-crown-cream-dark/60">Belum ada data kategori.</p>}
                  </div>
                </div>
              )}

              {/* TAB 2: KATEGORI */}
              {activeTab === 'category' && (
                <div className="animate-in fade-in duration-500 grid md:grid-cols-2 gap-10">
                  <div className="bg-crown-cream/5 p-6 rounded-3xl border border-crown-gold/20 h-fit">
                    <h2 className="text-2xl font-black text-crown-gold mb-4">
                      {editingCatId ? 'Ubah Kategori' : 'Tambah Kategori'}
                    </h2>
                    <form onSubmit={handleSubmitCategory} className="space-y-4">
                      <input 
                        type="text" required value={newCatName} onChange={(e) => setNewCatName(e.target.value)}
                        className="w-full p-4 bg-crown-espresso border border-crown-gold/30 rounded-xl focus:border-crown-gold focus:outline-none focus:ring-2 focus:ring-crown-gold/30 text-crown-cream placeholder:text-crown-cream-dark/50"
                        placeholder="Contoh: BEM Fakultas Terbaik"
                      />
                      <div className="flex gap-2">
                        <button type="submit" className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-crown-espresso font-bold rounded-xl shadow-[0_4px_12px_rgba(240,148,16,0.3)] transition-transform active:translate-y-1 ${editingCatId ? 'bg-crown-gold hover:bg-[#d8820e]' : 'bg-crown-gold hover:bg-[#d8820e]'}`}>
                          <Save className="w-5 h-5" /> {editingCatId ? 'Simpan Perubahan' : 'Simpan Kategori'}
                        </button>
                        {editingCatId && (
                          <button type="button" onClick={cancelEditCategory} className="px-4 py-3 bg-crown-cream/10 text-crown-cream font-bold rounded-xl hover:bg-crown-cream/20 transition-colors">
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-crown-gold mb-4">Daftar Kategori ({categories.length})</h2>
                    <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
                      {categories.map(c => (
                        <div key={c.id} className={`flex items-center justify-between p-4 border rounded-xl font-bold transition-colors ${
                          editingCatId === c.id ? 'border-crown-gold bg-crown-gold/10 text-crown-gold' : 'border-crown-bronze/20 bg-crown-cream/5 text-crown-cream'
                        }`}>
                          <span>{c.name}</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => startEditCategory(c)} className="p-2 text-crown-cream-dark/50 hover:text-crown-gold hover:bg-crown-cream/10 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => confirmDelete('category', c.id, c.name)} className="p-2 text-crown-cream-dark/50 hover:text-red-400 hover:bg-crown-cream/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: NOMINE */}
              {activeTab === 'nominee' && (
                <div className="animate-in fade-in duration-500 grid md:grid-cols-2 gap-10">
                  <div className="bg-crown-cream/5 p-6 rounded-3xl border border-crown-gold/20 h-fit">
                    <h2 className="text-2xl font-black text-crown-gold mb-4">
                      {editingNomineeId ? 'Ubah Kandidat' : 'Tambah Kandidat'}
                    </h2>
                    <form onSubmit={handleSubmitNominee} className="space-y-4">
                      <select 
                        required value={newNominee.category_id} onChange={(e) => setNewNominee({ ...newNominee, category_id: e.target.value })}
                        className="w-full p-4 bg-crown-espresso border border-crown-gold/30 rounded-xl focus:border-crown-gold focus:outline-none focus:ring-2 focus:ring-crown-gold/30 text-crown-cream"
                      >
                        <option value="">-- Pilih Kategori --</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <input 
                        type="text" required value={newNominee.name} onChange={(e) => setNewNominee({ ...newNominee, name: e.target.value })}
                        className="w-full p-4 bg-crown-espresso border border-crown-gold/30 rounded-xl focus:border-crown-gold focus:outline-none focus:ring-2 focus:ring-crown-gold/30 text-crown-cream placeholder:text-crown-cream-dark/50" placeholder="Nama Nomine"
                      />
                      <textarea 
                        value={newNominee.description} onChange={(e) => setNewNominee({ ...newNominee, description: e.target.value })}
                        className="w-full p-4 bg-crown-espresso border border-crown-gold/30 rounded-xl focus:border-crown-gold focus:outline-none focus:ring-2 focus:ring-crown-gold/30 text-crown-cream placeholder:text-crown-cream-dark/50" rows={3} placeholder="Deskripsi Singkat"
                      />
                      <div className="flex gap-2">
                        <button type="submit" className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-crown-espresso font-bold rounded-xl shadow-[0_4px_12px_rgba(240,148,16,0.3)] transition-transform active:translate-y-1 ${editingNomineeId ? 'bg-crown-gold hover:bg-[#d8820e]' : 'bg-crown-gold hover:bg-[#d8820e]'}`}>
                          <Save className="w-5 h-5" /> {editingNomineeId ? 'Simpan Perubahan' : 'Simpan Kandidat'}
                        </button>
                        {editingNomineeId && (
                          <button type="button" onClick={cancelEditNominee} className="px-4 py-3 bg-crown-cream/10 text-crown-cream font-bold rounded-xl hover:bg-crown-cream/20 transition-colors">
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-crown-gold mb-4">Daftar Nomine ({nominees.length})</h2>
                    <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2">
                      {nominees.map(n => (
                        <div key={n.id} className={`flex items-start justify-between p-4 border rounded-xl transition-colors ${
                          editingNomineeId === n.id ? 'border-crown-gold bg-crown-gold/10' : 'border-crown-bronze/20 bg-crown-cream/5'
                        }`}>
                          <div>
                            <p className={`font-black ${editingNomineeId === n.id ? 'text-crown-gold' : 'text-crown-cream'}`}>{n.name}</p>
                            <p className="text-xs font-bold text-crown-cream-dark/60 mt-1">Kat: {categories.find(c => c.id === n.category_id)?.name || 'Unknown'}</p>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <button onClick={() => startEditNominee(n)} className="p-2 text-crown-cream-dark/50 hover:text-crown-gold hover:bg-crown-cream/10 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => confirmDelete('nominee', n.id, n.name)} className="p-2 text-crown-cream-dark/50 hover:text-red-400 hover:bg-crown-cream/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: DATA VOTERS */}
              {activeTab === 'voters' && (
                <div className="animate-in fade-in duration-500">
                  <h2 className="text-2xl font-black text-crown-gold mb-4 flex items-center gap-2">
                    <Users className="w-6 h-6 text-crown-gold" />
                    Data Voter Terdaftar
                  </h2>
                  {renderVotersTable()}
                </div>
              )}

              {/* TAB 5: DOKUMENTASI */}
              {activeTab === 'documentation' && renderDocumentationTab()}

              {/* TAB 6: PENGATURAN */}
              {activeTab === 'settings' && (
                <div className="animate-in fade-in duration-500 space-y-12">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-crown-cream/5 p-6 rounded-3xl border border-crown-gold/20 text-center flex flex-col justify-center">
                      <h3 className="text-xl font-black text-crown-gold mb-4">Sesi Voting</h3>
                      <div className={`p-6 rounded-2xl border mb-4 transition-colors ${
                        isVotingActive ? 'border-crown-gold/60 bg-crown-gold/10' : 'border-red-500/40 bg-red-500/10'
                      }`}>
                        <p className="font-bold text-lg text-crown-cream-dark">Status saat ini:</p>
                        <p className={`text-3xl font-black ${isVotingActive ? 'text-crown-gold' : 'text-red-400'}`}>
                          {isVotingActive ? 'AKTIF' : 'DITUTUP'}
                        </p>
                      </div>
                      <button onClick={toggleVotingStatus} className={`w-full py-4 font-black rounded-xl text-crown-espresso shadow-[0_4px_12px_rgba(240,148,16,0.3)] transition-transform active:translate-y-1 ${
                        isVotingActive ? 'bg-red-500 hover:bg-red-600' : 'bg-crown-gold hover:bg-[#d8820e]'
                      }`}>
                        {isVotingActive ? 'Tutup Voting Sekarang' : 'Buka Voting Kembali'}
                      </button>
                    </div>
                    <div className="bg-crown-cream/5 p-6 rounded-3xl border border-crown-gold/20">
                      <h3 className="text-xl font-black text-crown-gold mb-4 flex items-center gap-2"><Megaphone className="w-5 h-5 text-crown-gold" /> Teks Pengumuman</h3>
                      <p className="text-sm font-medium text-crown-cream-dark/70 mb-4">Teks ini bisa kamu tampilkan di halaman depan atau halaman ranking.</p>
                      <form onSubmit={handleSaveAnnouncement} className="space-y-4 flex flex-col h-[calc(100%-80px)]">
                        <textarea value={announcement} onChange={(e) => setAnnouncement(e.target.value)} className="w-full p-4 bg-crown-espresso border border-crown-gold/30 rounded-xl focus:border-crown-gold focus:outline-none focus:ring-2 focus:ring-crown-gold/30 text-crown-cream placeholder:text-crown-cream-dark/50 flex-grow" placeholder="Contoh: Malam Puncak akan diadakan pada 25 Des 2025!" />
                        <button type="submit" className="w-full py-4 bg-crown-gold text-crown-espresso font-bold rounded-xl hover:bg-[#d8820e] shadow-[0_4px_12px_rgba(240,148,16,0.3)]">Simpan Pengumuman</button>
                      </form>
                    </div>
                  </div>
                  <hr className="border-crown-bronze/30" />
                  <div className="max-w-xl mx-auto text-center">
                    <div className="mb-6 flex justify-center"><ShieldCheck className="w-16 h-16 text-crown-gold drop-shadow-[0_4px_12px_rgba(240,148,16,0.3)]" /></div>
                    <h2 className="text-2xl font-black text-crown-gold mb-2">Kelola Akses Administrator</h2>
                    <p className="text-crown-cream-dark/70 font-medium mb-6">Masukkan alamat email untuk memberikan akses penuh pada dasbor ini.</p>
                    <form onSubmit={handleAddAdmin} className="space-y-4">
                      <input type="email" required value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} className="w-full p-4 bg-crown-espresso border border-crown-gold/30 rounded-xl text-center focus:border-crown-gold focus:outline-none focus:ring-2 focus:ring-crown-gold/30 text-crown-cream placeholder:text-crown-cream-dark/50" placeholder="Contoh: temanmu@gmail.com" />
                      <button type="submit" className="w-full py-4 bg-crown-gold text-crown-espresso font-black text-lg rounded-xl hover:bg-[#d8820e] shadow-[0_4px_12px_rgba(240,148,16,0.3)] transition-transform active:translate-y-1">Jadikan Admin</button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Alert Dialogs */}
      <AlertDialog open={alertConfig.open} onOpenChange={(open) => !open && closeAlert()}>
        <AlertDialogContent className="bg-crown-espresso border border-crown-gold/30 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <AlertDialogHeader>
            <AlertDialogTitle className={`flex items-center gap-2 text-2xl font-black ${alertConfig.isError ? 'text-red-400' : 'text-crown-gold'}`}>
              {alertConfig.isError ? <AlertTriangle className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
              {alertConfig.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-crown-cream-dark font-medium text-base mt-2">
              {alertConfig.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogAction onClick={closeAlert} className={`rounded-full font-bold px-8 py-6 text-crown-espresso ${alertConfig.isError ? 'bg-red-500 hover:bg-red-600' : 'bg-crown-gold hover:bg-[#d8820e]'}`}>
              OK, Mengerti!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteConfirm.open} onOpenChange={(open) => !open && setDeleteConfirm({ open: false, type: '', id: '', name: '' })}>
        <AlertDialogContent className="bg-crown-espresso border border-red-500/40 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-2xl font-black text-red-400">
              <AlertTriangle className="h-6 w-6" /> Konfirmasi Hapus
            </AlertDialogTitle>
            <AlertDialogDescription className="text-crown-cream-dark font-medium text-base mt-2">
              Apakah kamu yakin ingin menghapus <strong className="text-crown-cream">{deleteConfirm.name}</strong>? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex gap-2">
            <AlertDialogCancel className="rounded-full font-bold px-8 py-6 border border-crown-bronze/30 text-crown-cream-dark hover:bg-crown-cream/10">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete} className="rounded-full font-bold px-8 py-6 text-crown-espresso bg-red-500 hover:bg-red-600 shadow-[0_4px_12px_rgba(239,68,68,0.3)]">
              Ya, Hapus Sekarang
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}