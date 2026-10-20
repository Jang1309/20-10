'use client'

import { HeartIcon } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useState } from 'react'

import {
  useIsPageVisible,
  useRevealOnce,
} from '@/app/_components/invitation-flipbook/active-page-context'
import { useGuest, useWishSeed } from '@/app/_components/invitation-flipbook/guest-context'
import SpineShadow from '@/app/_components/invitation-flipbook/spine-shadow'
import {
  fadeIn,
  fadeUp,
  heartPop,
  inkMaskStyle,
  inkWrite,
  lineExpand,
  pageStagger,
  writeIn,
} from '@/lib/animations'
import { parseWishKind, wishSignature } from '@/lib/wish-kind'
import { pickPage2Wish, splitDisplayName } from '@/lib/wishes-20-10'

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

const Page2 = () => {
  const guest = useGuest()
  const kind = parseWishKind(guest?.wishKind)
  const wish = pickPage2Wish(useWishSeed(), kind)
  const signature = wishSignature(kind)
  const { line1, line2 } = splitDisplayName(guest?.honorific || 'Chị', guest?.name || 'Yêu quý')
  const revealed = useRevealOnce(useIsPageVisible(1))
  const [signed, setSigned] = useState(false)

  return (
    <section className='relative h-full w-full overflow-hidden bg-[#f6dde3] pointer-events-auto'>
      <Image
        src='/bg-page-2.png'
        alt='background'
        unoptimized
        fill
        sizes='(max-width: 639px) 92vw, 460px'
        className='pointer-events-none object-cover'
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
        variants={pageStagger(0.15, 0.13)}
        className='absolute top-[7rem] z-10 flex flex-col justify-center'
      >
        <header className='ml-[4rem]'>
          <div className='flex items-center gap-2.5'>
            <motion.p
              variants={fadeUp}
              className='font-lora text-[1.05rem] text-[#7a3a40]'
            >
              Thân gửi
            </motion.p>
            <motion.div variants={writeIn}>
              <Image
                src='/heart-2.png'
                alt=''
                width={2111}
                height={354}
                unoptimized
                aria-hidden
                className='pointer-events-none w-auto h-[2.5rem] -translate-x-4'
              />
            </motion.div>
          </div>

          <h2 className='font-great-vibes font-semibold mt-2 text-[2.5rem] leading-[1.2] text-[#D92F45]'>
            <motion.span
              variants={fadeUp}
              className='block'
            >
              {line1}
            </motion.span>
            <motion.span
              variants={fadeUp}
              className='block pl-[18%]'
            >
              {line2}
            </motion.span>
          </h2>

          <motion.div
            variants={inkWrite}
            custom={2}
            style={inkMaskStyle}
          >
            <Image
              src='/heart.png'
              alt=''
              width={2111}
              height={354}
              unoptimized
              aria-hidden
              className='pointer-events-none -mt-[1.25rem] ml-[2rem] h-auto w-[78%]'
            />
          </motion.div>
        </header>

        <GoldDivider className='mt-5' />

        <div className='mt-4 space-y-2 text-pretty font-lora text-[0.75rem] leading-[1.65] px-[2.5rem] text-center text-[#4f272c]'>
          <motion.p variants={fadeUp}>{wish.intro}</motion.p>
          <motion.p variants={fadeUp}>{wish.body}</motion.p>
        </div>

        <GoldDivider className='mt-4' />

        <motion.p
          variants={fadeUp}
          className='mt-3 text-balance text-center font-lora text-[0.95rem] leading-[1.55] px-[3rem] font-semibold italic text-[#D92F45]'
        >
          {wish.closing}
        </motion.p>

        {/* Lời ký cuối thư — khép lại "Thân gửi" ở đầu trang. */}
        <div className='mt-3 flex flex-col items-center'>
          <motion.p
            variants={fadeIn}
            className='font-lora text-[0.75rem] italic text-[#7a3a40]'
          >
            Thân ái,
          </motion.p>
          {signature && (
            <div className='mt-1.5 flex items-center gap-1.5'>
              {/* Padding âm-dương để nét lượn của font không bị mặt nạ cắt mất. */}
              <motion.span
                variants={inkWrite}
                onAnimationComplete={(definition) => definition === 'show' && setSigned(true)}
                style={inkMaskStyle}
                className='-mx-3 -my-1.5 inline-block px-3 py-1.5 font-great-vibes text-[1.85rem] leading-[1.15] text-[#D92F45]'
              >
                {signature}
              </motion.span>
              <motion.span
                variants={heartPop}
                initial='hidden'
                animate={signed ? 'show' : 'hidden'}
                className='relative top-1 inline-flex'
              >
                <HeartIcon className='size-[0.7rem] fill-[#D92F45] text-[#D92F45]' />
              </motion.span>
            </div>
          )}
        </div>
      </motion.div>
      <SpineShadow side='right' />
    </section>
  )
}

export default Page2
