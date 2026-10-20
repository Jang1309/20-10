/* eslint-disable @next/next/no-img-element */

import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

const PETAL_SRCS = [
  '/petal-a.png',
  '/petal-b.png',
  '/petal-c.png',
  '/petal-1.png',
  '/petal-2.png',
  '/petal-3.png',
] as const

type Petal = {
  left: number
  delay: number
  duration: number
  size: number
  drift: number
  sway: number
  swayDuration: number
  spin: number
  spinDuration: number
  flutterDuration: number
  opacity: number
  blur: number
  src: number
  /** Ẩn trên màn nhỏ để nhẹ máy. */
  extra: boolean
}

type Layer = 'back' | 'front'

/** Deterministic pseudo-random so SSR/client match */
const hash = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

const round = (value: number, digits = 2) => Math.round(value * 10 ** digits) / 10 ** digits

/**
 * Lớp sau: hai độ sâu (xa = nhỏ, mờ, chậm; gần = rõ nét).
 * Lớp trước: vài cánh to, nhoè như bokeh, bay ngang trước thiệp.
 */
const makePetals = (layer: Layer): Petal[] => {
  const count = layer === 'back' ? 40 : 5
  const seed = layer === 'back' ? 0 : 500

  return Array.from({ length: count }, (_, i) => {
    const [a, b, c, d, e, f] = [1, 17, 41, 73, 97, 131].map((k) => hash(seed + i + k))
    const far = layer === 'back' && e > 0.55
    const front = layer === 'front'

    const duration = front ? 9 + c * 4 : far ? 18 + c * 8 : 12 + c * 6
    const size = front ? 4.5 + d * 2 : far ? 1.1 + d * 0.6 : 1.8 + d * 1.1

    return {
      left: round(a * 100 - 8, 1),
      // Delay âm → mở trang là đã có hoa rải khắp màn hình, không phải chờ.
      delay: round(-b * duration, 1),
      duration: round(duration, 1),
      size: round(size),
      drift: round(6 + f * 14, 1),
      sway: Math.round((18 + e * 32) * (i % 2 === 0 ? 1 : -1)),
      swayDuration: round(3 + a * 3, 1),
      spin: i % 3 === 0 ? -1 : 1,
      spinDuration: round(7 + d * 8, 1),
      flutterDuration: round(2.4 + c * 2.2, 1),
      opacity: round(front ? 0.4 + a * 0.2 : far ? 0.35 + a * 0.2 : 0.65 + b * 0.3),
      blur: round(front ? 2.5 + c * 1.5 : far ? 0.5 + c * 0.6 : 0),
      src: (i + (front ? 2 : 0)) % PETAL_SRCS.length,
      extra: front ? i >= 3 : i >= 22,
    }
  })
}

const LAYERS: Record<Layer, Petal[]> = { back: makePetals('back'), front: makePetals('front') }

const FallingPetals = ({ layer = 'back' }: { layer?: Layer }) => (
  <div
    className={cn('falling-petals', layer === 'front' && 'falling-petals--front')}
    aria-hidden
  >
    {LAYERS[layer].map((petal, index) => (
      <span
        key={index}
        className={cn('falling-petal', petal.extra && 'falling-petal--extra')}
        style={
          {
            '--petal-left': `${petal.left}%`,
            '--petal-delay': `${petal.delay}s`,
            '--petal-duration': `${petal.duration}s`,
            '--petal-size': `${petal.size}rem`,
            '--petal-drift': `${petal.drift}vw`,
            '--petal-sway': `${petal.sway}px`,
            '--petal-sway-duration': `${petal.swayDuration}s`,
            '--petal-spin': petal.spin,
            '--petal-spin-duration': `${petal.spinDuration}s`,
            '--petal-flutter-duration': `${petal.flutterDuration}s`,
            '--petal-opacity': petal.opacity,
            '--petal-blur': `${petal.blur}px`,
          } as CSSProperties
        }
      >
        <span className='falling-petal__sway'>
          <span className='falling-petal__spin'>
            <img
              src={PETAL_SRCS[petal.src]}
              alt=''
              draggable={false}
            />
          </span>
        </span>
      </span>
    ))}
  </div>
)

export default FallingPetals
