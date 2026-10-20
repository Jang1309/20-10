import type { Variants } from 'motion/react'

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.15,
    },
  },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.9, ease: 'easeOut' },
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

export const lineExpand: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  show: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
}

export const riseFromBottom: Variants = {
  hidden: { opacity: 0, y: 48 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
}

export function withDelay(variants: Variants, delay: number): Variants {
  const show = variants.show
  if (typeof show !== 'object') return variants

  return {
    ...variants,
    show: { ...show, transition: { ...show.transition, delay } },
  }
}

const easeOutExpo = [0.22, 1, 0.36, 1] as const

/** Nét thư pháp / đường trang trí hiện dần từ trái sang phải, như đang được viết. */
export const writeIn: Variants = {
  // inset âm để drop-shadow quanh chữ không bị cắt khi đã hiện xong.
  hidden: { opacity: 0, clipPath: 'inset(-15% 110% -15% -10%)' },
  show: {
    opacity: 1,
    clipPath: 'inset(-15% -10% -15% -10%)',
    transition: { duration: 1.5, ease: [0.65, 0, 0.35, 1] },
  },
}

/** Ảnh chân dung: từ mờ, hơi phóng to → rõ nét. Không dùng filter:blur (rất nặng trên mobile). */
export const portraitIn: Variants = {
  hidden: { opacity: 0, scale: 1.06 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.1, ease: easeOutExpo },
  },
}

export const dropIn: Variants = {
  hidden: { opacity: 0, y: -14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutExpo } },
}

/** Cả cuốn thiệp nổi lên khi mở trang. Tránh rotateX — trên một số GPU Android làm thiệp trắng/giật. */
export const bookOpen: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease: easeOutExpo },
  },
}

/** Container stagger cho nội dung một trang thiệp, `delay` = chờ trước khi chạy. */
export const pageStagger = (delay = 0.15, stagger = 0.12): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

/**
 * Nét mực viết dần (chữ ký, đường trang trí): mặt nạ mép mềm trượt từ trái sang phải.
 * Dùng kèm `inkMaskStyle` trên cùng phần tử; `custom` = thời lượng (giây).
 */
export const inkWrite: Variants = {
  hidden: { opacity: 0, maskPosition: '100% 0%' },
  show: (duration: number = 2.4) => ({
    opacity: 1,
    maskPosition: '0% 0%',
    transition: { duration, ease: [0.4, 0, 0.4, 1], opacity: { duration: 0.3 } },
  }),
}

// Mặt nạ rộng 230%, mép mềm ở giữa: cỡ này để mép đi đúng từ mép trái tới mép phải phần tử
// suốt thời lượng — rộng hơn thì phần lớn thời gian mép chạy ngoài chữ, nét hiện vụt một cái.
export const inkMaskStyle = {
  maskImage: 'linear-gradient(90deg, #000 47%, transparent 53%)',
  WebkitMaskImage: 'linear-gradient(90deg, #000 47%, transparent 53%)',
  maskSize: '230% 100%',
  WebkitMaskSize: '230% 100%',
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
} as const

/** Trái tim "đóng dấu" — kích hoạt khi chữ ký viết xong. */
export const heartPop: Variants = {
  hidden: { opacity: 0, scale: 0 },
  show: {
    opacity: 1,
    scale: [0, 1.4, 1],
    transition: { duration: 0.6, ease: easeOutExpo },
  },
}

export type BurstParticle = { x: number; y: number; rotate: number; delay: number }

/** Một hạt (cánh hoa / tim) bung ra từ tâm, rơi nhẹ rồi tan — chạy một lần. */
export const burstParticle: Variants = {
  hidden: { opacity: 0, x: '0rem', y: '0rem', scale: 0.3, rotate: 0 },
  show: (p: BurstParticle) => ({
    opacity: [0, 1, 1, 0],
    x: `${p.x * 1.4}rem`,
    y: ['0rem', `${p.y * 1.4}rem`, `${p.y * 1.4 + 1.5}rem`],
    scale: [0.3, 1, 0.9],
    rotate: p.rotate,
    transition: {
      delay: 0.05 + p.delay,
      duration: 2,
      ease: 'easeOut',
      opacity: { times: [0, 0.12, 0.65, 1], duration: 2, delay: 0.05 + p.delay },
      y: { times: [0, 0.4, 1], duration: 2, delay: 0.05 + p.delay },
    },
  }),
}

/** Viền vàng khung ảnh bừng sáng rồi dịu lại, giữ một quầng mờ. */
export const frameGlow: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 1, 0.35],
    transition: { duration: 2.2, times: [0, 0.35, 1], ease: 'easeInOut' },
  },
}

/** Đường vòm ngoài khung ảnh khép vào sau khi ảnh hiện. */
export const frameLineIn: Variants = {
  hidden: { opacity: 0, scale: 1.08 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.1, ease: easeOutExpo } },
}
