'use client'
import React, { useState } from 'react'

type Item = {
  category: string
  isVeg: boolean
  name: string
  shortDesc: string
  price: string
  image?: string
}

export default function FoodCard({ item }: { item: Item }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <div className="food-row cursor-pointer" onClick={() => setOpen(o => !o)}>
        <div>
          <div className="food-name">{item.name} <span className="text-sm text-slate-400 font-normal">{item.isVeg ? '(Veg)' : '(Non-veg)'}</span></div>
          <div className="food-desc">{item.shortDesc}</div>
        </div>
        <div className="text-right min-w-[72px]">
          <div className="font-semibold">₹{item.price}</div>
        </div>
      </div>

      <div className={`food-expand ${open ? 'show' : ''}`}>
        <div className="flex gap-4 items-start">
          <img src={item.image || '/placeholder-food.jpg'} alt={item.name} className="food-img" />
          <div>
            <div className="font-semibold">{item.name}</div>
            <div className="text-slate-300 mt-2">{item.shortDesc}</div>
            <div className="mt-3">Price: ₹{item.price}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
