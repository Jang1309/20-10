'use client'

import { motion } from 'motion/react'

import { useIsLowEndDevice } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

type SheenProps = {
  className?: string
  /** Giây chờ trước lần lướt đầu tiên. */
  delay?: number
  /** Có thì lặp lại, nghỉ chừng này giây giữa hai lần lướt. */
  repeatDelay?: number
  /** Độ sáng của vệt (0–1). */
  intensity?: number
  /** Ảnh PNG trong suốt làm mặt nạ — vệt sáng chỉ hiện trên phần có nét (chữ nhũ). */
  maskSrc?: string
}

/** Vệt sáng chéo lướt qua bề mặt, như ánh kim trên giấy in nhũ. Tắt trên máy yếu. */
const Sheen = ({ className, delay = 0, repeatDelay, intensity = 0.45, maskSrc }: SheenProps) => {
  const isLowEnd = useIsLowEndDevice()
  if (isLowEnd) return null

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      style={
        maskSrc
          ? {
              maskImage: `url(${maskSrc})`,
              maskSize: '100% 100%',
              WebkitMaskImage: `url(${maskSrc})`,
              WebkitMaskSize: '100% 100%',
            }
          : undefined
      }
    >
      <motion.div
        className='absolute inset-y-[-20%] -left-1/3 w-1/3'
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(255,250,240,${intensity}) 50%, transparent 100%)`,
        }}
        initial={{ x: '0%', skewX: -18 }}
        animate={{ x: '420%', skewX: -18 }}
        transition={{
          duration: 1.8,
          ease: [0.45, 0, 0.25, 1],
          delay,
          repeat: repeatDelay === undefined ? 0 : Infinity,
          repeatDelay,
        }}
      />
    </div>
  )
}

export default Sheen
