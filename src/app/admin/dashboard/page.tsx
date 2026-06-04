'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  Users, 
  Trophy, 
  Settings, 
  LogOut, 
  TrendingUp,
  UserCircle2
} from "lucide-react"

// --- Mock Data Statistik untuk MVP ---
const STATS = {
  totalVoters: 1245,
  totalNominees: 8,
  activeCategories: 3,
  participationRate: 78
}

const LIVE_RESULTS = [
  {
    id: "cat-1",
    title: "President Student Council",
    totalVotes: 850,
    nominees: [
      { id: "n-1", name: "Arkananta Putra", votes: 510, percentage: 60, color: "bg-indigo-500" },
      { id: "n-2", name: "Nabila Maharani", votes: 340, percentage: 40, color: "bg-blue-500" },
    ]
  },
  {
    id: "cat-2",
    title: "Best Campus Ambassador",
    totalVotes: 720,
    nominees: [
      { id: "n-3", name: "Jeremy Thomas", votes: 432, percentage: 60, color: "bg-rose-500" },
      { id: "n-4", name: "Sarah Wijaya", votes: 288, percentage: 40, color: "bg-emerald-500" },
    ]
  }
]

export default function AdminDashboardPage() {
  const [activeMenu, setActiveMenu] = useState("overview")

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-50 font-sans overflow-hidden selection:bg-indigo-500/30">
      
      {/* Background Glow */}
      <div className="fixed top-0 right-0 w-[600px] h-[400px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

      {/* Sidebar - Glassmorphism */}
      <aside className="relative z-10 w-64 border-r border-white/10 bg-zinc-900/30 backdrop-blur-xl flex flex-col hidden md:flex">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            <span className="flex h-3 w-3 rounded-full bg-indigo-500 animate-pulse"></span>
            Admin Panel
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveMenu("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeMenu === 'overview' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}
          >
            <BarChart3 className="h-5 w-5" />
            Overview
          </button>
          <button 
            onClick={() => setActiveMenu("categories")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeMenu === 'categories' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}
          >
            <Trophy className="h-5 w-5" />
            Manajemen Nominasi
          </button>
          <button 
            onClick={() => setActiveMenu("voters")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeMenu === 'voters' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}
          >
            <Users className="h-5 w-5" />
            Data Pemilih
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200 text-sm font-medium">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col h-screen overflow-y-auto">
        
        {/* Topbar */}
        <header className="px-8 py-5 border-b border-white/5 bg-zinc-950/50 backdrop-blur-md flex justify-between items-center sticky top-0 z-20">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard Monitoring</h1>
            <p className="text-zinc-400 text-sm mt-1">Pantau perolehan suara secara real-time.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="bg-white/5 border-white/10 rounded-full hover:bg-white/10 text-zinc-300">
              <Settings className="h-4 w-4" />
            </Button>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 p-0.5">
              <div className="h-full w-full bg-zinc-900 rounded-full flex items-center justify-center">
                 <UserCircle2 className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                  <Users className="h-6 w-6 text-indigo-400" />
                </div>
                <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">
                  <TrendingUp className="h-3 w-3 mr-1" /> +12%
                </span>
              </div>
              <h3 className="text-zinc-400 text-sm font-medium">Total Voters</h3>
              <p className="text-3xl font-bold text-white mt-1">{STATS.totalVoters}</p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <Trophy className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <h3 className="text-zinc-400 text-sm font-medium">Kategori Aktif</h3>
              <p className="text-3xl font-bold text-white mt-1">{STATS.activeCategories}</p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                  <BarChart3 className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
              <h3 className="text-zinc-400 text-sm font-medium">Partisipasi Pemilih</h3>
              <p className="text-3xl font-bold text-white mt-1">{STATS.participationRate}%</p>
            </div>
          </div>

          {/* Live Voting Results Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
              Live Voting Results
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {LIVE_RESULTS.map((category) => (
                <div key={category.id} className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl">
                  <div className="flex justify-between items-end mb-6 pb-4 border-b border-white/5">
                    <div>
                      <h3 className="text-lg font-bold text-zinc-100">{category.title}</h3>
                      <p className="text-xs text-zinc-500 mt-1">Total masuk: {category.totalVotes} suara</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {category.nominees.map((nominee) => (
                      <div key={nominee.id}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-semibold text-zinc-200">{nominee.name}</span>
                          <span className="text-zinc-400">{nominee.votes} suara ({nominee.percentage}%)</span>
                        </div>
                        {/* Custom Progress Bar */}
                        <div className="w-full bg-zinc-950/50 rounded-full h-3 border border-white/5 overflow-hidden flex">
                          <div 
                            className={`h-full ${nominee.color} rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${nominee.percentage}%` }}
                          >
                            <div className="w-full h-full bg-white/20 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}