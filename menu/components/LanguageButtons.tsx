'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

export default function LanguageButtons() {
  const router = useRouter()
  return (
    <div className="language-grid">
      <button className="rounded-lg p-4 bg-white/5 hover:bg-white/10 transition" onClick={() => router.push('/english')}>English</button>
      <button className="rounded-lg p-4 bg-white/5 hover:bg-white/10 transition" onClick={() => router.push('/hindi')}>Hindi</button>
      <button className="rounded-lg p-4 bg-white/5 hover:bg-white/10 transition" onClick={() => router.push('/gujarati')}>Gujarati</button>
      <button className="rounded-lg p-4 bg-white/5 hover:bg-white/10 transition" onClick={() => router.push('/marathi')}>Marathi</button>
    </div>
  )
}
