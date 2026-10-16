'use client'

import { HeartIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { type ReactNode, useState } from 'react'

import {
  useBookOrientation,
  useIsPageVisible,
  useRevealOnce,
} from '@/app/_components/invitation-flipbook/active-page-context'
import { useGuest, useWishSeed } from '@/app/_components/invitation-flipbook/guest-context'
import SpineShadow from '@/app/_components/invitation-flipbook/spine-shadow'
import Sheen from '@/app/_components/sheen'
import {
  type BurstParticle,
  burstParticle,
  fadeUp,
  frameGlow,
  frameLineIn,
  lineExpand,
  pageStagger,
  portraitIn,
  scaleIn,
  writeIn,
} from '@/lib/animations'
import { cn } from '@/lib/utils'
import { pickPage3Wish } from '@/lib/wishes-20-10'

const GoldDivider = ({ className }: { className?: string }) => (
  <motion.div
    variants={lineExpand}
    aria-hidden
    className={`mx-auto flex w-[56%] items-center gap-2 ${className ?? ''}`}
  >
    <span className='h-px flex-1 bg-gradient-to-r from-transparent to-[#D92F45]/55' />
    <HeartIcon
      className='size-[0.75rem] text-[#D92F45]'
      strokeWidth={1.75}
    />
    <span className='h-px flex-1 bg-gradient-to-l from-transparent to-[#D92F45]/55' />
  </motion.div>
)

const Em = ({ children }: { children: ReactNode }) => (
  <span className='whitespace-nowrap font-semibold italic text-[#D92F45]'>{children}</span>
)

/** Highlight nhẹ vài từ khóa trong câu chúc (20/10, tự tin, …). */
const withEmphasis = (text: string) => {
  const parts = text.split(
    /(20\/10|xứng đáng|tự tin|dịu dàng|mạnh mẽ|nụ cười thật đẹp|yêu thương|hạnh phúc)/g,
  )
  return parts.map((part, index) =>
    index % 2 === 1 ? <Em key={`${part}-${index}`}>{part}</Em> : <span key={index}>{part}</span>,
  )
}

/** Khung ảnh hình vòm: viền vàng, lớp giấy kem bên trong, cánh hoa cài ở góc trên. */
const PortraitFrame = ({ src, alt }: { src: string; alt: string }) => {
  // Viền vàng chỉ bừng lên sau khi ảnh đã rõ nét.
  const [shown, setShown] = useState(false)
  const frameAnim = { initial: 'hidden', animate: shown ? 'show' : 'hidden' } as const
  return (
    <motion.div
      variants={portraitIn}
      onAnimationComplete={(definition) => definition === 'show' && setShown(true)}
      className='relative'
    >
      {/* Đường vòm mảnh vọng ra ngoài, tạo chiều sâu như khung tranh. */}
      <motion.div
        variants={frameLineIn}
        {...frameAnim}
        aria-hidden
        className='absolute -inset-[0.45rem] rounded-t-[4.6rem] rounded-b-[1rem] border border-[#c99a4a]/45'
      />
      {/* Quầng vàng bừng lên quanh khung rồi dịu lại — khoảnh khắc "chụp" ảnh. */}
      <motion.div
        variants={frameGlow}
        {...frameAnim}
        aria-hidden
        className='absolute inset-0 rounded-t-[4.125rem] rounded-b-[0.6rem] shadow-[0_0_1.4rem_0.35rem_rgba(243,210,140,0.95)]'
      />
      <div className='relative h-[10.75rem] w-[8.25rem] rounded-t-[4.125rem] rounded-b-[0.6rem] bg-[linear-gradient(160deg,#f6e3b6_0%,#c99a4a_35%,#f3d9a0_60%,#b8873a_100%)] p-[3px] shadow-[0_0.9rem_2rem_rgba(157,61,74,0.28)]'>
        <div className='h-full w-full rounded-t-[3.95rem] rounded-b-[0.45rem] bg-[#fff7f4] p-[3px]'>
          <div className='relative h-full w-full overflow-hidden rounded-t-[3.8rem] rounded-b-[0.3rem]'>
            <Image
              src={src}
              alt={alt}
              fill
              unoptimized
              sizes='160px'
              className='object-cover object-[50%_25%]'
            />
            {/* Phủ hồng nhẹ ở đáy để dòng thư pháp đè lên vẫn đọc rõ. */}
            <div
              aria-hidden
              className='absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#f6dde3]/80 to-transparent'
            />
            <Sheen
              delay={2.4}
              repeatDelay={5.5}
              intensity={0.4}
            />
          </div>
        </div>
      </div>
      <Image
        src='/flower-3.png'
        alt=''
        aria-hidden
        width={1254}
        height={1254}
        unoptimized
        className='pointer-events-none absolute -left-[1.75rem] top-[1.25rem] w-[2.4rem] -rotate-[24deg] opacity-90 drop-shadow-[0_0.25rem_0.4rem_rgba(157,61,74,0.2)]'
      />
    </motion.div>
  )
}

// Cố định để mỗi lần mở thiệp bung giống nhau; quạt chủ yếu lên trên và sang hai bên.
const BURST: (BurstParticle & { kind: 'heart' | 'a' | 'b' | 'c' })[] = [
  { kind: 'heart', x: -4.2, y: -1.6, rotate: -40, delay: 0 },
  { kind: 'a', x: -3.1, y: -3.2, rotate: -120, delay: 0.04 },
  { kind: 'heart', x: -1.4, y: -3.9, rotate: -15, delay: 0.02 },
  { kind: 'b', x: 0.3, y: -4.3, rotate: 90, delay: 0.06 },
  { kind: 'heart', x: 1.8, y: -3.6, rotate: 20, delay: 0.01 },
  { kind: 'c', x: 3.3, y: -2.9, rotate: 140, delay: 0.05 },
  { kind: 'heart', x: 4.4, y: -1.2, rotate: 35, delay: 0.03 },
  { kind: 'a', x: -4.8, y: 0.2, rotate: -70, delay: 0.07 },
  { kind: 'b', x: 4.9, y: 0.4, rotate: 80, delay: 0.08 },
  { kind: 'heart', x: -2.4, y: -2, rotate: -25, delay: 0.09 },
  { kind: 'heart', x: 2.6, y: -1.9, rotate: 25, delay: 0.1 },
]

/** Cánh hoa và tim bung nhẹ một lần quanh chữ "Cảm ơn". */
const ThanksBurst = ({ play }: { play: boolean }) => {
  if (useReducedMotion()) return null
  return (
    <motion.span
      initial='hidden'
      animate={play ? 'show' : 'hidden'}
      aria-hidden
      className='pointer-events-none absolute left-1/2 top-[1.3rem] size-0'
    >
      {BURST.map((p, index) => (
        <motion.span
          key={index}
          custom={p}
          variants={burstParticle}
          className='absolute -left-[0.55rem] -top-[0.55rem] flex'
        >
          {p.kind === 'heart' ? (
            <HeartIcon className='size-[0.85rem] fill-[#D92F45] text-[#D92F45]' />
          ) : (
            <Image
              src={`/petal-${p.kind}.png`}
              alt=''
              width={240}
              height={240}
              unoptimized
              className='h-auto w-[1.25rem]'
            />
          )}
        </motion.span>
      ))}
    </motion.span>
  )
}

const Page3 = () => {
  const guest = useGuest()
  const wish = pickPage3Wish(useWishSeed())
  const revealed = useRevealOnce(useIsPageVisible(2))
  const [thanksShown, setThanksShown] = useState(false)
  // Desktop trải đôi: trang 2 và 3 hiện cùng lúc → trang 3 chạy sau trang 2 một nhịp.
  const startDelay = useBookOrientation() === 'landscape' ? 1.1 : 0.15
  const avatarUrl = guest?.avatarUrl
  const who = [guest?.honorific, guest?.name].filter(Boolean).join(' ')

  return (
    <section className='relative h-full w-full overflow-hidden bg-[#f6dde3]'>
      <Image
        src='/bg-page-2.png'
        alt='background'
        fill
        sizes='(max-width: 639px) 92vw, 460px'
        className='object-cover rotate-y-180'
        unoptimized
      />
      <Image
        src='/border.png'
        alt='border'
        fill
        sizes='(max-width: 639px) 92vw, 460px'
        className='object-fill scale-[1.04]'
      />

      <motion.div
        initial='hidden'
        animate={revealed ? 'show' : 'hidden'}
        variants={pageStagger(startDelay, 0.16)}
        className={cn(
          'absolute z-10 flex w-full flex-col justify-center',
          avatarUrl ? 'top-[4.75rem]' : 'top-[7rem]',
        )}
      >
        <header className='flex flex-col items-center px-[1.5rem]'>
          {avatarUrl && (
            <PortraitFrame
              src={avatarUrl}
              alt={who ? `Ảnh ${who}` : 'Ảnh chân dung'}
            />
          )}
          {/* Dòng thư pháp được "viết" dần từ trái sang phải. */}
          <motion.div
            variants={writeIn}
            className={cn(avatarUrl && 'relative z-10 -mt-[2.1rem]')}
          >
            <Image
              src='/woman.png'
              alt='Phụ nữ luôn đẹp nhất khi được là chính mình'
              width={1448}
              height={1086}
              priority
              unoptimized
              className={cn(
                'pointer-events-none w-auto object-contain',
                avatarUrl
                  ? 'h-[6.25rem] drop-shadow-[0_0_0.4rem_rgba(255,247,244,0.95)]'
                  : 'h-[10.35rem]',
              )}
            />
          </motion.div>
        </header>

        <GoldDivider className='mt-5' />

        <div className='mt-4 space-y-2 text-pretty px-[2.5rem] text-center font-lora text-[0.75rem] leading-[1.65] text-[#4f272c]'>
          <motion.p variants={fadeUp}>{withEmphasis(wish.paragraph1)}</motion.p>
          <motion.p variants={fadeUp}>{withEmphasis(wish.paragraph2)}</motion.p>
        </div>

        <GoldDivider className='mt-4' />

        <div className='relative mt-3 flex h-[4.4rem] flex-col items-center justify-center px-[2.75rem] text-center'>
          <motion.p
            variants={scaleIn}
            onAnimationComplete={(definition) => definition === 'show' && setThanksShown(true)}
            className='font-style-script text-[2.35rem] leading-[0.95] tracking-[0.04em] text-[#D92F45]'
          >
            Cảm ơn
          </motion.p>
          <ThanksBurst play={thanksShown} />
          <motion.p
            variants={fadeUp}
            className='mt-1.5 max-w-[15rem] text-balance font-lora text-[0.78rem] italic leading-[1.5] text-[#7a3a40]'
          >
            {wish.thanksLine}
          </motion.p>
        </div>

        <motion.div
          variants={lineExpand}
          aria-hidden
          className='mx-auto mt-4 flex w-[64%] items-center gap-2.5'
        >
          <span className='h-px flex-1 bg-gradient-to-r from-transparent to-[#D92F45]/50' />
          <HeartIcon className='size-[0.75rem] fill-[#D92F45] text-[#D92F45]' />
          <span className='h-px flex-1 bg-gradient-to-l from-transparent to-[#D92F45]/50' />
        </motion.div>
      </motion.div>
      <SpineShadow side='left' />
    </section>
  )
}

export default Page3
