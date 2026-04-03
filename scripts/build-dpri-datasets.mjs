import fs from 'node:fs'
import path from 'node:path'
import xlsx from 'xlsx'

const repoRoot = process.cwd()
const inputPath = path.join(repoRoot, 'docs', 'assets', 'DPRI-2025-Booklet-asofOctober7.xlsx')
const dataDir = path.join(repoRoot, 'data')
const outAllPath = path.join(dataDir, 'dpri_2025_all_medicines.csv')
const outTopPath = path.join(dataDir, 'dpri_2025_top_medicines.csv')

const POPULAR_KEYWORDS = [
  'paracetamol', 'amoxicillin', 'metformin', 'amlodipine', 'losartan', 'atorvastatin', 'simvastatin',
  'omeprazole', 'pantoprazole', 'cetirizine', 'loratadine', 'salbutamol', 'ascorbic acid', 'multivitamins',
  'ibuprofen', 'diclofenac', 'mefenamic acid', 'co-amoxiclav', 'azithromycin', 'clopidogrel', 'aspirin',
  'cinnarizine', 'carvedilol', 'furosemide', 'hydrochlorothiazide', 'insulin', 'gliclazide', 'glimepiride',
  'metoprolol', 'nifedipine', 'telmisartan', 'valsartan', 'ferrous sulfate', 'folic acid', 'calcium'
]

function normalizeHeader(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function parseNumber(value) {
  if (value === null || value === undefined || value === '') return null
  const cleaned = String(value).replace(/[^0-9.\-]/g, '')
  if (!cleaned) return null
  const num = Number(cleaned)
  return Number.isFinite(num) ? num : null
}

function toCsv(rows, headers) {
  const esc = (v) => {
    const s = v === null || v === undefined ? '' : String(v)
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`
    }
    return s
  }
  const lines = [headers.join(',')]
  for (const row of rows) {
    lines.push(headers.map((h) => esc(row[h])).join(','))
  }
  return `${lines.join('\n')}\n`
}

function build() {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Missing XLSX file at ${inputPath}`)
  }

  fs.mkdirSync(dataDir, { recursive: true })

  const workbook = xlsx.readFile(inputPath, { cellDates: false })
  const firstSheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[firstSheetName]
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' })

  let headerRowIdx = -1
  let drugIdx = -1
  let lowIdx = -1
  let medIdx = -1
  let highIdx = -1

  for (let i = 0; i < Math.min(rows.length, 150); i += 1) {
    const normalized = rows[i].map(normalizeHeader)
    const d = normalized.findIndex((x) => x === 'drugname' || x === 'drug name')
    const l = normalized.findIndex((x) => x === 'lowest')
    const m = normalized.findIndex((x) => x === 'median')
    const h = normalized.findIndex((x) => x === 'highest')
    if (d >= 0 && l >= 0 && m >= 0 && h >= 0) {
      headerRowIdx = i
      drugIdx = d
      lowIdx = l
      medIdx = m
      highIdx = h
      break
    }
  }

  if (headerRowIdx < 0) {
    throw new Error('Could not detect header row with Drugname/Lowest/Median/Highest')
  }

  const byDrug = new Map()

  for (let i = headerRowIdx + 1; i < rows.length; i += 1) {
    const row = rows[i]
    const drugRaw = row[drugIdx]
    const drugname = String(drugRaw || '').replace(/\s+/g, ' ').trim()
    if (!drugname) continue

    const lowest = parseNumber(row[lowIdx])
    const median = parseNumber(row[medIdx])
    const highest = parseNumber(row[highIdx])
    if (lowest === null && median === null && highest === null) continue

    const key = drugname.toLowerCase()
    const existing = byDrug.get(key)
    if (!existing) {
      byDrug.set(key, { drugname, lowest, median, highest })
      continue
    }

    existing.lowest = [existing.lowest, lowest].filter((x) => x !== null).sort((a, b) => a - b)[0] ?? existing.lowest
    existing.median = existing.median ?? median
    existing.highest = [existing.highest, highest].filter((x) => x !== null).sort((a, b) => b - a)[0] ?? existing.highest
  }

  const allRows = Array.from(byDrug.values()).sort((a, b) => a.drugname.localeCompare(b.drugname))

  const scored = allRows.map((row) => {
    const n = row.drugname.toLowerCase()
    const score = POPULAR_KEYWORDS.reduce((acc, kw, idx) => {
      if (n.includes(kw)) {
        return Math.max(acc, 1000 - idx)
      }
      return acc
    }, 0)
    return { ...row, _score: score }
  })

  const topRows = scored
    .sort((a, b) => {
      if (b._score !== a._score) return b._score - a._score
      return a.drugname.localeCompare(b.drugname)
    })
    .slice(0, 150)
    .map(({ _score, ...rest }) => rest)

  fs.writeFileSync(outAllPath, toCsv(allRows, ['drugname', 'lowest', 'median', 'highest']), 'utf8')
  fs.writeFileSync(outTopPath, toCsv(topRows, ['drugname', 'lowest', 'median', 'highest']), 'utf8')

  console.log(`[dpri] Source sheet: ${firstSheetName}`)
  console.log(`[dpri] Parsed medicines: ${allRows.length}`)
  console.log(`[dpri] Wrote all dataset: ${path.relative(repoRoot, outAllPath)}`)
  console.log(`[dpri] Wrote top dataset: ${path.relative(repoRoot, outTopPath)}`)
}

build()
