/** Loại thiệp — quyết định branding + bộ lời chúc + chữ ký. */
export const WISH_KINDS = ['bateco', 'external', 'mother', 'partner'] as const

export type WishKind = (typeof WISH_KINDS)[number]

export const WISH_KIND_LABEL: Record<WishKind, string> = {
  bateco: 'Bateco (nội bộ / khách)',
  external: 'Ngoài (không Bateco)',
  mother: 'Cho mẹ',
  partner: 'Cho người yêu',
}

export const parseWishKind = (value: unknown): WishKind =>
  typeof value === 'string' && (WISH_KINDS as readonly string[]).includes(value)
    ? (value as WishKind)
    : 'bateco'

/** Thiệp không mang branding Bateco. */
export const isUnbranded = (kind: WishKind): boolean => kind !== 'bateco'

/** Chữ ký trang 2; `null` = chỉ để "Thân ái,". */
export const wishSignature = (kind: WishKind): string | null => {
  switch (kind) {
    case 'bateco':
      return 'Bateco Group'
    case 'mother':
      return 'Con yêu mẹ'
    case 'partner':
      return 'Anh yêu em'
    default:
      return null
  }
}

/** Danh xưng gợi ý khi chọn loại thiệp mới. */
export const defaultHonorific = (kind: WishKind): string => {
  switch (kind) {
    case 'mother':
      return 'Mẹ'
    case 'partner':
      return 'Em'
    default:
      return 'Chị'
  }
}
