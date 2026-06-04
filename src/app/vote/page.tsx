'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function VotePage() {
  const [categories, setCategories] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [votedCategories, setVotedCategories] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      // Ambil kategori + nominee
      const { data: cats } = await supabase
        .from('categories')
        .select('*, nominees(*)')
      setCategories(cats || [])

      // Ambil kategori yang sudah divote user
      if (user) {
        const { data: votes } = await supabase
          .from('votes')
          .select('category_id')
          .eq('user_id', user.id)
        setVotedCategories(new Set(votes?.map(v => v.category_id) || []))
      }
    }
    fetchData()
  }, [])

  const handleVote = async (nomineeId: string, categoryId: string) => {
    if (votedCategories.has(categoryId)) {
      alert('Anda sudah vote di kategori ini!')
      return
    }
    const { error } = await supabase.from('votes').insert({
      user_id: user.id,
      nominee_id: nomineeId,
      category_id: categoryId
    })
    if (error) alert(error.message)
    else {
      alert('Vote berhasil!')
      setVotedCategories(prev => new Set(prev).add(categoryId))
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Voting Nominasi</h1>
      {categories.map(cat => (
        <div key={cat.id} className="border p-4 my-4 rounded">
          <h2 className="text-xl font-semibold">{cat.name}</h2>
          {votedCategories.has(cat.id) ? (
            <p className="text-green-600">Anda sudah memberikan suara di kategori ini.</p>
          ) : (
            cat.nominees.map((nom: any) => (
              <div key={nom.id} className="flex justify-between items-center py-2">
                <span>{nom.name}</span>
                <button
                  onClick={() => handleVote(nom.id, cat.id)}
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  Vote
                </button>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  )
}