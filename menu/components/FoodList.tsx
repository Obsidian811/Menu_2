'use client'
import React from 'react'
import FoodCard from './FoodCard'

type Item = {
  category: string
  isVeg: boolean
  name: string
  shortDesc: string
  price: string
  image?: string
}

export default function FoodList({ items }: { items: Item[] }) {
  if (!items || items.length === 0) return <div className="text-slate-300">No items found.</div>
  return (
    <div>
      {items.map((it, idx) => (
        <div key={idx} className="category-card">
          <FoodCard item={it} />
        </div>
      ))}
    </div>
  )
}
