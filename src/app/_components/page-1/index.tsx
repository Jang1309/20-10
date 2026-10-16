'use client'

import { HeartIcon } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { useGuest } from '@/app/_components/invitation-flipbook/guest-context'
import Sheen from '@/app/_components/sheen'
import {
  dropIn,
  fadeIn,
  fadeUp,
  pageStagger,
  portraitIn,
  riseFromBottom,
  scaleIn,
} from '@/lib/animations'
import { cn } from '@/lib/utils'
import { splitDisplayName } from '@/lib/wishes-20-10'

/**
 * Bật một lần sau khi thiệp mở (chờ cuốn thiệp nổi lên xong) rồi giữ nguyên —
 * react-pageflip ẩn/hiện trang khi lật nên không được dựa vào mount/keyframes.
 */
const useRevealAfterMount = (delayMs: number) => {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setShown(true), delayMs)
    return () => window.clearTimeout(timer)
  }, [delayMs])

  return shown
}

/**
 * Tên khách đặt ngay dưới tiêu đề, chân dung vòm lớn bên dưới, nằm trên cụm hoa nhưng
 * chân ảnh mờ dần vào cụm hoa thay vì một tấm thẻ dán giữa thiệp.
 */
const CoverPortrait = ({ src, name }: { src: string; name: string }) => (
  <div className='absolute-x-center top-[49.5%] z-[3] flex flex-col items-center'>
    <motion.p
      variants={fadeIn}
      className='text-[0.62rem] uppercase tracking-[0.32em] text-[#7a3a40]'
    >
      Thân gửi
    </motion.p>
    <motion.p
      variants={fadeUp}
      className='font-noto-serif mt-0.5 whitespace-nowrap text-[1.45rem] italic leading-tight text-[#D92F45] [text-shadow:0_0_0.6rem_rgba(255,247,244,0.9)]'
    >
      {name}
    </motion.p>
    <motion.div
      variants={portraitIn}
      className='relative mt-5'
    >
      {/* Vòm chỉ vàng mảnh vọng ra ngoài như khung tranh, cũng mờ dần ở chân. */}
      <div
        aria-hidden
        className='absolute -inset-x-[0.45rem] -top-[0.45rem] bottom-0 rounded-t-full border border-[#c99a4a]/60 [mask-image:linear-gradient(180deg,#000_70%,transparent_95%)]'
      />
      <HeartIcon
        aria-hidden
        className='absolute -top-[0.85rem] left-1/2 z-10 size-[0.8rem] -translate-x-1/2 fill-[#D92F45] text-[#D92F45] drop-shadow-[0_0_0.25rem_rgba(255,247,244,0.95)]'
      />
      <div className='relative h-[12.75rem] w-[9.5rem] overflow-hidden rounded-t-full border-[3px] border-[#fff7f4] shadow-[0_0_0_1px_rgba(201,154,74,0.75),0_0.8rem_1.8rem_rgba(157,61,74,0.22)] [mask-image:linear-gradient(180deg,#000_78%,transparent_100%)]'>
        <Image
          src={src}
          alt={`Ảnh ${name}`}
          fill
          sizes='200px'
          priority
          unoptimized
          className='object-cover object-[50%_20%]'
        />
        {/* Ám hồng ở rìa, giữ sáng vùng mặt — nền ảnh chụp (thường xám) hoà vào tông thiệp. */}
        <div
          aria-hidden
          className='absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_38%,rgba(248,206,216,0)_45%,rgba(248,206,216,0.75)_100%)] mix-blend-multiply'
        />
        <Sheen
          delay={2.8}
          repeatDelay={6}
          intensity={0.35}
        />
      </div>
    </motion.div>
  </div>
)

const Page1 = () => {
  const guest = useGuest()
  const avatarUrl = guest?.coverUrl
  const { line2 } = splitDisplayName(undefined, guest?.name ?? '')
  const shortName = [guest?.honorific || 'Chị', line2].join(' ')
  const shown = useRevealAfterMount(450)

  return (
    <motion.section
      initial='hidden'
      animate={shown ? 'show' : 'hidden'}
      variants={pageStagger(0, 0.22)}
      className='relative h-full w-full overflow-hidden bg-[#f6dde3]'
    >
      <Image
        src='/bg-card-1.png'
        alt='background'
        fill
        sizes='(max-width: 639px) 92vw, 460px'
        className='object-cover'
        priority
        unoptimized
      />
      <Image
        src='/border.png'
        alt='border'
        fill
        sizes='(max-width: 639px) 92vw, 460px'
        className='object-fill scale-[1.04]'
      />
      <div
        className={cn(
          'absolute-x-center z-[2]',
          avatarUrl ? 'top-[5.5%] w-[38%]' : 'top-[6%] w-[44%]',
        )}
      >
        <motion.div variants={dropIn}>
          <Image
            src='/d-logo.png'
            alt='Bateco Group'
            width={1596}
            height={411}
            priority
            unoptimized
            className='h-auto w-full object-contain'
          />
        </motion.div>
      </div>
      {/* Có ảnh → thu tiêu đề lại và đẩy lên để chừa chỗ cho chân dung phía trên cụm hoa. */}
      <div
        className={cn(
          'absolute-x-center z-[1]',
          avatarUrl ? 'top-[8.5%] w-[64%]' : 'top-[11%] w-[78%]',
        )}
      >
        <motion.div
          variants={scaleIn}
          className='relative'
        >
          <Image
            src='/title.png'
            alt='Chúc mừng ngày Phụ nữ Việt Nam 20/10'
            width={1086}
            height={1448}
            priority
            unoptimized
            className='h-auto w-full object-contain'
          />
          {/* Ánh nhũ chỉ lướt trên nét chữ tiêu đề, lặp lại thưa. */}
          <Sheen
            maskSrc='/title.png'
            delay={2.6}
            repeatDelay={6}
            intensity={0.85}
          />
        </motion.div>
      </div>
      <div
        className={cn(
          'pointer-events-none absolute bottom-0 left-0 z-[2] w-full',
          avatarUrl && 'translate-y-[2rem]',
        )}
      >
        <motion.div variants={riseFromBottom}>
          <Image
            src='/decor-flower-1.png'
            alt=''
            width={1448}
            height={1086}
            className='h-[25rem] w-full object-cover'
            aria-hidden
          />
        </motion.div>
      </div>
      {avatarUrl && (
        <CoverPortrait
          src={avatarUrl}
          name={shortName}
        />
      )}
    </motion.section>
  )
}

export default Page1
