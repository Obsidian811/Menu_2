'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export default function EnglishHome() {
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/menu?lang=english').then(r => r.json()).then(j => {
      if (j.ok) {
        const cats = Array.from(new Set(j.rows.map((r: any) => r.category || 'Others')))
        setCategories(cats)
      }
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="container">
      <h1 className="text-2xl font-bold">Menu — English</h1>
      <p className="text-slate-300">Choose a category</p>

      {loading ? <div className="mt-6 text-slate-300">Loading...</div> : (
        <div className="mt-6">
          {categories.map((c) => (
            <div key={c} className="category-card">
              <Link href={`/english/${encodeURIComponent(c.toLowerCase())}`}>
                <div className="flex justify-between items-center">
                  <div className="font-semibold">{c}</div>
                  <div className="text-slate-300">View items →</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
