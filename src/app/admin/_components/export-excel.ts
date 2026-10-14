import * as XLSX from 'xlsx-js-style'

type Row = {
  guestId: string
  stt: number
  category: string | null
  name: string
  honorific: string | null
  title: string | null
  unit: string | null
  department: string | null
  partner: string | null
  link: string
}

type ExportRow = {
  stt: number
  honorific: string
  name: string
  link: string
}

const NAVY = '5E2F35'
const GOLD = 'D92F45'
const HEADER_FILL = 'D92F45'
const STRIPE = 'F6DDE3'
const BORDER = 'E8C4CB'

const thin = { style: 'thin', color: { rgb: BORDER } } as const
const allBorders = { top: thin, bottom: thin, left: thin, right: thin }

const COLS: { key: keyof ExportRow; label: string; width: number }[] = [
  { key: 'stt', label: 'STT', width: 6 },
  { key: 'honorific', label: 'Danh xưng', width: 10 },
  { key: 'name', label: 'Họ và tên', width: 28 },
  { key: 'link', label: 'Link thiệp', width: 56 },
]

const titleStyle = {
  font: { bold: true, sz: 15, color: { rgb: NAVY } },
  alignment: { horizontal: 'center', vertical: 'center' },
}
const subtitleStyle = {
  font: { italic: true, sz: 11, color: { rgb: GOLD } },
  alignment: { horizontal: 'center', vertical: 'center' },
}
const headerStyle = {
  font: { bold: true, sz: 11, color: { rgb: 'FFFFFF' } },
  fill: { patternType: 'solid', fgColor: { rgb: HEADER_FILL } },
  alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  border: allBorders,
}

const cellStyle = (rowIndex: number, extra: Record<string, unknown> = {}) => ({
  font: { sz: 10 },
  alignment: { vertical: 'center', wrapText: true },
  fill: rowIndex % 2 === 0 ? { patternType: 'solid', fgColor: { rgb: STRIPE } } : undefined,
  border: allBorders,
  ...extra,
})

/** Xuất 1 sheet: tên + link thiệp. */
export const exportGuestsExcel = (rows: Row[]) => {
  const list: ExportRow[] = rows.map((row, index) => ({
    stt: index + 1,
    honorific: row.honorific ?? '',
    name: row.name,
    link: row.link,
  }))

  const lastCol = COLS.length - 1
  const aoa: unknown[][] = [
    ['DANH SÁCH THIỆP 20/10'],
    ['Bateco Group · Chúc mừng ngày Phụ nữ Việt Nam'],
    [],
    COLS.map((col) => col.label),
    ...list.map((row) => COLS.map((col) => row[col.key])),
  ]

  const ws = XLSX.utils.aoa_to_sheet(aoa)
  ws['!cols'] = COLS.map((col) => ({ wch: col.width }))
  ws['!rows'] = [{ hpt: 26 }, { hpt: 18 }, { hpt: 6 }, { hpt: 30 }]
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: lastCol } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: lastCol } },
  ]
  ws['!autofilter'] = {
    ref: XLSX.utils.encode_range({ s: { r: 3, c: 0 }, e: { r: 3, c: lastCol } }),
  }
  ws['!freeze'] = {
    xSplit: 0,
    ySplit: 4,
    topLeftCell: 'A5',
    activePane: 'bottomLeft',
    state: 'frozen',
  }

  const at = (r: number, c: number) => ws[XLSX.utils.encode_cell({ r, c })]
  if (at(0, 0)) at(0, 0).s = titleStyle
  if (at(1, 0)) at(1, 0).s = subtitleStyle
  COLS.forEach((_, c) => {
    const cell = at(3, c)
    if (cell) cell.s = headerStyle
  })

  list.forEach((_, i) => {
    const r = i + 4
    COLS.forEach((col, c) => {
      const cell = at(r, c)
      if (!cell) return
      const extra: Record<string, unknown> = {}
      if (col.key === 'stt') extra.alignment = { horizontal: 'center', vertical: 'center' }
      if (col.key === 'name') extra.font = { sz: 10, bold: true }
      if (col.key === 'link' && cell.v) {
        cell.l = { Target: String(cell.v || ''), Tooltip: 'Mở thiệp' }
        extra.font = { sz: 9, color: { rgb: 'D92F45' }, underline: true }
      }
      cell.s = cellStyle(i, extra)
    })
  })

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Danh sách')
  const stamp = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `Danh sach thiep 20-10 - ${stamp}.xlsx`)
}
