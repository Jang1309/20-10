'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type ActivePage = {
  /** Flip state react-pageflip báo qua `onFlip`. */
  page: number
  orientation: 'portrait' | 'landscape'
}

const ActivePageContext = createContext<ActivePage>({ page: 0, orientation: 'landscape' })

export const ActivePageProvider = ActivePageContext.Provider

/**
 * react-pageflip báo *flip state*, không phải chỉ số trang, và số state phụ thuộc
 * hướng sách:
 * - Landscape: 0 = bìa, 1 = trải đôi trang 2 + 3.
 * - Portrait: 0 = bìa, 1 = trang 2, 2 = trang 3.
 */
export function useIsPageVisible(pageIndex: number) {
  const { page, orientation } = useContext(ActivePageContext)
  if (orientation === 'portrait' || pageIndex === 0) return page === pageIndex
  return page >= 1
}

/** Hướng sách thật sự react-pageflip đang dùng (landscape = trải đôi trang 2 + 3). */
export function useBookOrientation() {
  return useContext(ActivePageContext).orientation
}

/** Chạy hiệu ứng xuất hiện một lần, lần đầu `isActive` thành true, rồi giữ nguyên. */
export function useRevealOnce(isActive: boolean) {
  const [revealed, setRevealed] = useState(isActive)

  useEffect(() => {
    if (!isActive) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRevealed(true)
  }, [isActive])

  return revealed
}
