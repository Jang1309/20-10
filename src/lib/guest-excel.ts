import type { Guest } from '@/lib/guest'

/**
 * Turns a raw sheet matrix (rows of cell values, from SheetJS or the Microsoft
 * Graph Excel API) into `Guest` rows. Shared by the admin upload flow and the
 * "write back to SharePoint" API so column detection stays identical.
 */

/** Strip accents + lowercase so header matching survives typos and casing. */
export const normalizeHeader = (value: unknown): string =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim()

/** "Phạm Trung Hưng cùng phu nhân" -> "Phạm Trung Hưng" (cột phu nhân giữ phần đi cùng). */
const stripPartnerSuffix = (name: string): string =>
  name.replace(/\s*[-,]?\s*cùng\s+(phu\s*nhân|phu\s*quân)\b.*$/iu, '').trim()

const isNameHeaderText = (h: string): boolean =>
  h.includes('ho va ten') ||
  h.includes('ho ten') ||
  h.includes('ten khach') ||
  // File danh sách người dùng HR (20/10): cột "Tên người dùng"
  h.includes('ten nguoi dung')

const COLUMN_MATCHERS: { key: keyof Guest; test: (header: string) => boolean }[] = [
  { key: 'name', test: isNameHeaderText },
  { key: 'honorific', test: (h) => h.includes('danh xung') },
  { key: 'title', test: (h) => h.includes('chuc danh') },
  { key: 'unit', test: (h) => h.includes('don vi') },
  {
    key: 'department',
    test: (h) => h.includes('bo phan') || h.includes('phong ban'),
  },
  { key: 'partner', test: (h) => h.includes('phu nhan') || h.includes('phu quan') },
]

export const LINK_HEADER = 'Link thiệp'
export const PARTNER_LINK_HEADER = 'Link thiệp phu nhân/phu quân'

const isBlankLike = (value: unknown): boolean => {
  const text = String(value ?? '').trim()
  return !text || text === '0'
}

const cleanCell = (value: unknown): string => (isBlankLike(value) ? '' : String(value).trim())

const isHonorific = (value: unknown): boolean => {
  const text = normalizeHeader(value)
  return ['ong', 'ba', 'anh', 'chi'].includes(text)
}

const isPartnerRelation = (value: unknown): boolean => {
  const text = normalizeHeader(value).replace(/\s+/g, ' ')
  return text.includes('phu nhan') || text.includes('phu quan')
}

const findColumn = (row: unknown[], test: (header: string) => boolean, start = 0): number =>
  row.findIndex((cell, index) => index >= start && test(normalizeHeader(cell)))

type FamilyColumns = {
  staffName: number
  staffTitle: number
  staffHonorific: number
  partnerHonorific: number
  partnerName: number
  partnerRelation: number
  partnerTitle: number
}

const isNameHeader = (cell: unknown) => isNameHeaderText(normalizeHeader(cell))

/** Index of the row that holds the column headers, or -1. */
export const findHeaderRow = (matrix: unknown[][]): number =>
  matrix.findIndex((row) => Array.isArray(row) && row.some(isNameHeader))

export type ColumnIndex = Record<keyof Guest, number>

export const detectColumns = (headerRow: unknown[]): ColumnIndex => {
  const headers = Array.from({ length: headerRow.length }, (_, index) =>
    normalizeHeader(headerRow[index]),
  )
  const columnIndex = {} as ColumnIndex
  for (const { key, test } of COLUMN_MATCHERS) {
    columnIndex[key] = headers.findIndex((header) => test(header))
  }
  return columnIndex
}

/** Cột "Giới tính" — có thì chỉ lấy nữ cho thiệp 20/10. */
export const findGenderColumn = (headerRow: unknown[]): number =>
  headerRow.findIndex((cell) => {
    const h = normalizeHeader(cell)
    return h.includes('gioi tinh') || h === 'gender' || h === 'sex'
  })

export const isFemaleGender = (value: unknown): boolean => {
  const text = normalizeHeader(value).replace(/\s+/g, '')
  return text === 'nu' || text === 'female' || text === 'f' || text === 'woman'
}

/**
 * Loại tài khoản hệ thống / role giả trong file HR (Administrator, SALE Distributor…).
 * Giữ lại tên người thật (có dấu tiếng Việt hoặc ≥ 2 từ dạng họ tên).
 */
export const looksLikePersonName = (name: string): boolean => {
  const trimmed = name.trim()
  if (!trimmed) return false

  const normalized = normalizeHeader(trimmed)
  if (
    /^(admin|administrator|assistant|purchase|sale|sales)\b/.test(normalized) ||
    normalized.includes('distributor')
  ) {
    return false
  }

  const hasVietDiacritic =
    /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(trimmed)
  const words = trimmed.split(/\s+/).filter(Boolean)
  if (words.length < 2 && !hasVietDiacritic) return false

  // Nhãn role viết HOA Latin nhiều từ (ASSISTANT DISTRIBUTOR, …)
  if (!hasVietDiacritic && /^[A-Z0-9\s._/-]+$/.test(trimmed) && trimmed === trimmed.toUpperCase()) {
    return false
  }

  return true
}

export const readGuestRow = (
  row: unknown[],
  columnIndex: ColumnIndex,
  category?: string,
  options?: { forceHonorific?: string },
): Guest | null => {
  const cell = (key: keyof Guest) => {
    const index = columnIndex[key]
    return index >= 0 ? cleanCell(row?.[index]) : ''
  }
  const rawName = cell('name')
  if (!rawName) return null
  const name = stripPartnerSuffix(rawName) || rawName
  if (!looksLikePersonName(name)) return null
  return {
    name,
    honorific: cell('honorific') || options?.forceHonorific || undefined,
    title: cell('title') || undefined,
    unit: cell('unit') || undefined,
    department: cell('department') || undefined,
    partner: cell('partner') || undefined,
    category: category || undefined,
  }
}

const detectFamilyColumns = (matrix: unknown[][], headerRowIndex: number): FamilyColumns | null => {
  const headerRow = matrix[headerRowIndex] ?? []
  const subHeaderRow = matrix[headerRowIndex + 1] ?? []
  const staffName = findColumn(headerRow, (h) => h.includes('ho va ten') || h.includes('ho ten'))
  const staffTitle = findColumn(headerRow, (h) => h.includes('chuc danh'))
  const familyInfo = findColumn(headerRow, (h) => h.includes('thong tin gia dinh'))
  const partnerTitle = findColumn(headerRow, (h) => h.includes('ghep cot'))
  const partnerName = findColumn(
    subHeaderRow,
    (h) => h.includes('ho va ten') || h.includes('ho ten'),
    Math.max(staffName + 1, 0),
  )

  if (staffName === -1 || staffTitle === -1 || partnerName === -1 || partnerTitle === -1) {
    return null
  }

  const sampleRows = matrix.slice(headerRowIndex + 2, headerRowIndex + 22)
  let staffHonorific = -1
  for (let c = staffName + 1; c < (familyInfo === -1 ? partnerName : familyInfo); c += 1) {
    if (sampleRows.some((row) => isHonorific(row?.[c]))) {
      staffHonorific = c
      break
    }
  }

  const partnerHonorific = findColumn(
    subHeaderRow,
    (h) => h.includes('danh xung'),
    Math.max(familyInfo + 1, staffName + 1),
  )

  let partnerRelation = findColumn(headerRow, (h) => h.includes('danh xung'), partnerName + 1)
  if (partnerRelation === -1) {
    for (let c = partnerName + 1; c < partnerTitle; c += 1) {
      if (sampleRows.some((row) => isPartnerRelation(row?.[c]))) {
        partnerRelation = c
        break
      }
    }
  }

  if (staffHonorific === -1 || partnerHonorific === -1 || partnerRelation === -1) {
    return null
  }

  return {
    staffName,
    staffTitle,
    staffHonorific,
    partnerHonorific,
    partnerName,
    partnerRelation,
    partnerTitle,
  }
}

const readFamilyGuestRows = (
  row: unknown[],
  columns: FamilyColumns,
  category?: string,
): Guest[] => {
  const rawName = cleanCell(row[columns.staffName])
  if (!rawName) return []

  const name = stripPartnerSuffix(rawName) || rawName
  const relation = cleanCell(row[columns.partnerRelation])
  const partnerName = cleanCell(row[columns.partnerName])
  const hasPartner = Boolean(partnerName && isPartnerRelation(relation))

  const staff: Guest = {
    name,
    honorific: cleanCell(row[columns.staffHonorific]) || undefined,
    title: cleanCell(row[columns.staffTitle]) || undefined,
    category: category || undefined,
  }

  if (!hasPartner) return [staff]

  return [
    staff,
    {
      name: partnerName,
      honorific: cleanCell(row[columns.partnerHonorific]) || undefined,
      title: cleanCell(row[columns.partnerTitle]) || relation || undefined,
      category: category || undefined,
    },
  ]
}

export type ParsedSheet = {
  headerRowIndex: number
  columnIndex: ColumnIndex
  /** Existing "Link thiệp" column index, or -1 if the sheet has none yet. */
  linkColumnIndex: number
  /** One entry per data row that has a name, with its absolute row index in the matrix. */
  guests: { rowIndex: number; guest: Guest }[]
}

export const parseSheetMatrix = (matrix: unknown[][], category?: string): ParsedSheet => {
  const headerRowIndex = findHeaderRow(matrix)
  if (headerRowIndex === -1) {
    throw new Error('Không tìm thấy cột họ tên / tên người dùng trong file.')
  }
  const headerRow = matrix[headerRowIndex]
  const columnIndex = detectColumns(headerRow)
  const genderColumnIndex = findGenderColumn(headerRow)
  const linkColumnIndex = headerRow.findIndex(
    (cell) => normalizeHeader(cell) === normalizeHeader(LINK_HEADER),
  )
  const familyColumns = detectFamilyColumns(matrix, headerRowIndex)
  // File HR có cột giới tính → thiệp 20/10 chỉ lấy nữ, danh xưng mặc định "Chị".
  const femaleOnly = genderColumnIndex >= 0
  const forceHonorific = femaleOnly ? 'Chị' : undefined

  const guests: { rowIndex: number; guest: Guest }[] = []
  for (let rowIndex = headerRowIndex + 1; rowIndex < matrix.length; rowIndex += 1) {
    const row = matrix[rowIndex] ?? []
    if (familyColumns && rowIndex === headerRowIndex + 1) continue
    if (femaleOnly && !isFemaleGender(row[genderColumnIndex])) continue
    const rowGuests = familyColumns
      ? readFamilyGuestRows(row, familyColumns, category)
      : [readGuestRow(row, columnIndex, category, { forceHonorific })].filter(
          (guest): guest is Guest => Boolean(guest),
        )
    guests.push(...rowGuests.map((guest) => ({ rowIndex, guest })))
  }

  return { headerRowIndex, columnIndex, linkColumnIndex, guests }
}

/** Không tìm thấy dòng tiêu đề (sheet không phải danh sách khách). */
export const sheetHasGuestList = (matrix: unknown[][]): boolean => findHeaderRow(matrix) !== -1
