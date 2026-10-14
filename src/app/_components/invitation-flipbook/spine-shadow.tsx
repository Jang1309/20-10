'use client'

import { useBookOrientation } from '@/app/_components/invitation-flipbook/active-page-context'
import { cn } from '@/lib/utils'

/**
 * Bóng gáy sách ở mép trong của trang khi trải đôi (landscape), để hai trang
 * trông như uốn vào gáy thay vì hai tấm phẳng đặt cạnh nhau.
 */
const SpineShadow = ({ side }: { side: 'left' | 'right' }) => {
  if (useBookOrientation() !== 'landscape') return null

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-y-0 z-20 w-[2.75rem]',
        side === 'right'
          ? 'right-0 bg-[linear-gradient(to_left,rgba(94,47,53,0.22)_0%,rgba(94,47,53,0.08)_35%,transparent_100%)]'
          : 'left-0 bg-[linear-gradient(to_right,rgba(94,47,53,0.22)_0%,rgba(94,47,53,0.08)_35%,transparent_100%)]',
      )}
    />
  )
}

export default SpineShadow
