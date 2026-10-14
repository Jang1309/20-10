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

/** Ảnh chân dung: từ mờ, hơi phóng to → rõ nét. */
export const portraitIn: Variants = {
  hidden: { opacity: 0, scale: 1.08, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 1.3, ease: easeOutExpo },
  },
}

export const dropIn: Variants = {
  hidden: { opacity: 0, y: -14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutExpo } },
}

/** Cả cuốn thiệp nổi lên khi mở trang. */
export const bookOpen: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.94, rotateX: 10, transformPerspective: 1200 },
  show: {
    opacity: 1,
    transformPerspective: 1200,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { duration: 1.1, ease: easeOutExpo },
  },
}

/** Container stagger cho nội dung một trang thiệp, `delay` = chờ trước khi chạy. */
export const pageStagger = (delay = 0.15, stagger = 0.12): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})
