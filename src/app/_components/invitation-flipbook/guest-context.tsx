'use client'

import { createContext, useContext } from 'react'

import type { Guest } from '@/lib/guest'

const GuestContext = createContext<Guest | null>(null)

export const GuestProvider = GuestContext.Provider

/** Khách hiện tại từ link thiệp, hoặc `null` nếu mở trang chung. */
export function useGuest() {
  return useContext(GuestContext)
}

/** Seed ổn định để chọn lời chúc — ưu tiên id, không thì tên. */
export function useWishSeed() {
  const guest = useGuest()
  return guest?.id || guest?.name || 'bateco-20-10'
}
