'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const slides = [
  { id: 'hotel', title: 'Hotel Azure', subtitle: 'Welcome to Hotel Azure' },
  { id: 'ad', title: 'Today\'s Special', subtitle: 'Buy 1 Get 1 on Mocktails' },
  { id: 'lang', title: 'Choose Language', subtitle: 'Select preferred language to continue' }
]

export default function Home() {
  const [index, setIndex] = useState<number>(0)
  const router = useRouter()

  useEffect(() => {
    if (index < slides.length - 1) {
      const t = setTimeout(() => setIndex(i => i + 1), 2000)
      return () => clearTimeout(t)
    }
  }, [index])

  return (
    <div className="slide-wrap">
      {slides.map((s, i) => (
        <div key={s.id} className={`slide ${i === index ? 'show' : ''}`}>
          <div className="text-center px-6">
            <h1 className="text-4xl sm:text-5xl font-bold">{s.title}</h1>
            <p className="mt-3 text-slate-300">{s.subtitle}</p>

            {s.id === 'lang' && i === index && (
              <div className="mt-8">
                <div className="language-grid">
                  <button onClick={() => router.push('/english')} className="rounded-lg p-4 bg-white/5 hover:bg-white/10 transition">English</button>
                  <button onClick={() => router.push('/hindi')} className="rounded-lg p-4 bg-white/5 hover:bg-white/10 transition">Hindi</button>
                  <button onClick={() => router.push('/gujarati')} className="rounded-lg p-4 bg-white/5 hover:bg-white/10 transition">Gujarati</button>
                  <button onClick={() => router.push('/marathi')} className="rounded-lg p-4 bg-white/5 hover:bg-white/10 transition">Marathi</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
