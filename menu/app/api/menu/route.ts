import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

type Row = {
  category: string
  isVeg: boolean
  name: string
  shortDesc: string
  price: string
  image?: string
}

function parseCSV(text: string): string[][] {
  // Simple split — keep CSVs simple (no quoted commas). Returns rows of columns.
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => line.split(',').map(col => col.trim()))
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const lang = (url.searchParams.get('lang') || 'english').toLowerCase()
    const filePath = path.join(process.cwd(), 'data', `${lang}.csv`)
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ ok: false, error: `Data file not found for ${lang}` }, { status: 404 })
    }
    const raw = fs.readFileSync(filePath, 'utf8')
    const rows = parseCSV(raw)
    const headers = rows.shift() || []
    const out: Row[] = rows.map(cols => {
      const obj: any = {}
      headers.forEach((h, idx) => obj[h] = cols[idx] ?? '')
      const isVegField = (obj['isVeg'] ?? obj['IsVeg'] ?? '').toString().toLowerCase()
      const isVeg = isVegField === 'true' || isVegField === '1' || isVegField === 'veg' || isVegField === 'yes'
      return {
        category: (obj['category'] ?? obj['Category'] ?? 'Others').toString(),
        isVeg,
        name: (obj['name'] ?? obj['Name'] ?? '').toString(),
        shortDesc: (obj['shortDesc'] ?? obj['description'] ?? obj['short_desc'] ?? '').toString(),
        price: (obj['price'] ?? obj['Price'] ?? '').toString(),
        image: (obj['image'] ?? '').toString()
      }
    })
    return NextResponse.json({ ok: true, rows: out })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
