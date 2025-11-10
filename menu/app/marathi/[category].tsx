'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import FoodList from '../../../components/FoodList'

export default function CategoryPage() {
  const router = useRouter()
  // derive lang & category from path (client)
  const [lang, setLang] = useState<string | null>(null)
  const [category, setCategory] = useState<string | null>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const parts = window.location.pathname.split('/').filter(Boolean)
    setLang(parts[0] || null)
    setCategory(parts[1] || null)
  }, [])

  useEffect(() => {
    if (!lang || !category) return
    fetch(`/api/menu?lang=${lang}`).then(r => r.json()).then(j => {
      if (j.ok) {
        const filtered = j.rows.filter((r: any) => (r.category || 'others').toLowerCase() === decodeURIComponent(category).toLowerCase())
        // sort: non-veg first then veg (user asked non-veg first)
        filtered.sort((a: any, b: any) => Number(a.isVeg) - Number(b.isVeg))
        setItems(filtered)
      }
    }).finally(() => setLoading(false))
  }, [lang, category])

  return (
    <div className="container">
      <button className="back-link" onClick={() => router.back()}>← Back</button>
      <h2 className="mt-4 text-xl font-semibold capitalize">{category}</h2>
      {loading ? <div className="mt-4 text-slate-300">Loading...</div> : <FoodList items={items} />}
    </div>
  )
}
