import fs from 'node:fs'
import path from 'node:path'
import xlsx from 'xlsx'

const repoRoot = process.cwd()
const sourceCsv = path.join(repoRoot, 'data', 'dpri_2025_top_medicines.csv')
const existingRecordsPath = path.join(repoRoot, 'src', 'fluent', 'records', 'medicines.now.ts')
const outputPath = path.join(repoRoot, 'src', 'fluent', 'records', 'medicines-top.now.ts')

const CATEGORY_RULES = [
  { category: "category_antibiotic", keywords: ['amoxicillin', 'azithromycin', 'cef', 'penicillin', 'vancomycin', 'meropenem', 'ciprofloxacin', 'levofloxacin'] },
  { category: "category_analgesic", keywords: ['paracetamol', 'ibuprofen', 'diclofenac', 'mefenamic', 'tramadol', 'ketorolac', 'naproxen', 'aspirin'] },
  { category: "category_antihypertensive", keywords: ['amlodipine', 'losartan', 'telmisartan', 'valsartan', 'carvedilol', 'metoprolol', 'nifedipine', 'enalapril'] },
  { category: "category_antidiabetic", keywords: ['metformin', 'insulin', 'gliclazide', 'glimepiride', 'linagliptin'] },
  { category: "category_antihistamine", keywords: ['cetirizine', 'loratadine', 'diphenhydramine', 'chlorphenamine', 'fexofenadine'] },
  { category: "category_antacid", keywords: ['omeprazole', 'pantoprazole', 'antacid', 'aluminum hydroxide', 'lactulose'] },
  { category: "category_vitamins", keywords: ['ascorbic', 'vitamin', 'multivitamins', 'folic acid', 'calcium', 'ferrous', 'zinc'] }
]

function toNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function cleanText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function escapeSingleQuotes(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function inferForm(drugname) {
  const d = drugname.toLowerCase()
  if (d.includes('tablet')) return 'tablet'
  if (d.includes('capsule')) return 'capsule'
  if (d.includes('syrup')) return 'syrup'
  if (d.includes('suspension')) return 'suspension'
  if (d.includes('injection') || d.includes('infusion') || d.includes('ampule') || d.includes('vial')) return 'injection'
  if (d.includes('cream')) return 'cream'
  if (d.includes('ointment')) return 'ointment'
  if (d.includes('drops')) return 'drops'
  if (d.includes('powder') || d.includes('sachet')) return 'powder'
  return 'tablet'
}

function inferCategoryId(drugname) {
  const d = drugname.toLowerCase()
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((k) => d.includes(k))) {
      return `Now.ID['${rule.category}']`
    }
  }
  return "Now.ID['category_vitamins']"
}

function extractStrength(drugname) {
  const match = drugname.match(/(\d+(?:\.\d+)?\s?(?:mg|mcg|g|iu|mL|ml|%))/i)
  return match ? match[1] : ''
}

function buildDescription(drugname) {
  return `DPRI 2025 benchmark medicine entry: ${drugname}`
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40)
}

function getExistingGenericNames(fileText) {
  const names = new Set()
  const regex = /generic_name:\s*'([^']+)'/g
  let m
  while ((m = regex.exec(fileText)) !== null) {
    names.add(m[1].toLowerCase())
  }
  return names
}

function buildRecordBlock(row, id) {
  const drugname = cleanText(row.drugname)
  const lowest = toNumber(row.lowest)
  const median = toNumber(row.median)
  const highest = toNumber(row.highest)
  const dpri = median ?? lowest ?? highest ?? 0

  const strength = extractStrength(drugname)
  const form = inferForm(drugname)
  const category = inferCategoryId(drugname)
  const hospitalAvg = dpri > 0 ? (dpri * 2.8) : 0

  return `Record({\n    $id: 'medicine_top_${slugify(drugname)}_${id}',\n    table: 'x_1966129_transpar_medicine',\n    data: {\n        generic_name: '${escapeSingleQuotes(drugname)}',\n        brand_name: '',\n        strength: '${escapeSingleQuotes(strength)}',\n        form: '${form}',\n        dpri_price: ${dpri.toFixed(2)},\n        dpri_lowest_price: ${lowest !== null ? lowest.toFixed(2) : `${dpri.toFixed(2)}`},\n        dpri_median_price: ${median !== null ? median.toFixed(2) : `${dpri.toFixed(2)}`},\n        dpri_highest_price: ${highest !== null ? highest.toFixed(2) : `${dpri.toFixed(2)}`},\n        hospital_avg_price: ${hospitalAvg.toFixed(2)},\n        category: ${category},\n        description: '${escapeSingleQuotes(buildDescription(drugname))}',\n        active: 'active',\n    },\n})`
}

function main() {
  if (!fs.existsSync(sourceCsv)) {
    throw new Error(`Missing CSV source: ${sourceCsv}`)
  }

  const existingText = fs.readFileSync(existingRecordsPath, 'utf8')
  const existingNames = getExistingGenericNames(existingText)

  const wb = xlsx.readFile(sourceCsv, { raw: false })
  const sheet = wb.Sheets[wb.SheetNames[0]]
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' })

  const recordBlocks = []
  const seen = new Set()

  for (const row of rows) {
    const drugname = cleanText(row.drugname)
    if (!drugname) continue

    const key = drugname.toLowerCase()
    if (existingNames.has(key)) continue
    if (seen.has(key)) continue
    seen.add(key)

    recordBlocks.push(buildRecordBlock(row, recordBlocks.length + 1))
  }

  const content = [
    "import '@servicenow/sdk/global'",
    "import { Record } from '@servicenow/sdk/core'",
    '',
    '// Auto-generated from data/dpri_2025_top_medicines.csv',
    '// Regenerate with: npm run build:dpri:seed',
    '',
    ...recordBlocks
  ].join('\n\n') + '\n'

  fs.writeFileSync(outputPath, content, 'utf8')

  console.log(`[dpri-seed] Source CSV: ${path.relative(repoRoot, sourceCsv)}`)
  console.log(`[dpri-seed] Existing fixed medicines skipped: ${existingNames.size}`)
  console.log(`[dpri-seed] Added top records: ${recordBlocks.length}`)
  console.log(`[dpri-seed] Wrote: ${path.relative(repoRoot, outputPath)}`)
}

main()
