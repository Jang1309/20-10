'use client'

import {
  AnimatePresence,
  type MotionValue,
  motion,
  useMotionValue,
  useTransform,
} from 'motion/react'
import { type RefObject, useEffect, useState } from 'react'

import { inkMaskStyle } from '@/lib/animations'
import { EM_XINH_LYRICS as LYRICS, type LyricLine } from '@/lib/lyrics-em-xinh'
import { cn } from '@/lib/utils'

const lineIndexAt = (time: number) => {
  const next = LYRICS.findIndex((line) => line.time > time)
  return next === -1 ? LYRICS.length - 1 : next - 1
}

// Thời gian tô hết một dòng: theo độ dài câu, nhưng không quá khoảng cách tới dòng sau
// (dòng trước đoạn nghỉ dài sẽ không bị tô chậm rì).
const fillSpan = (line: LyricLine, next?: LyricLine) =>
  Math.min(((next?.time ?? line.time + 4) - line.time) * 0.95, line.text.length * 0.09 + 0.6)

// Câu bè trong ngoặc: bỏ ngoặc, hiển thị nhỏ và nhạt hơn.
const parseLine = (index: number) => {
  const text = LYRICS[index]?.text ?? ''
  const backing = text.startsWith('(') && text.endsWith(')')
  return { text: backing ? text.slice(1, -1) : text, backing }
}

const FILLED = '0% 0%'

/**
 * Lớp dưới trắng mờ + lớp trên trắng sáng có quầng hồng, bị mặt nạ mực quét dần = karaoke.
 * Chữ trắng + bóng hồng đậm đọc rõ trên nền hồng nhạt mà không bị đục màu.
 */
const KaraokeText = ({
  text,
  maskPosition,
}: {
  text: string
  maskPosition: MotionValue<string> | string
}) => (
  <span className='relative block text-balance px-[0.3em] py-[0.2em]'>
    <span className='text-white/55 [text-shadow:0_0.1rem_0.6rem_rgba(157,61,74,0.35)]'>{text}</span>
    <motion.span
      style={{ ...inkMaskStyle, maskPosition }}
      className='absolute inset-0 px-[0.3em] py-[0.2em] text-white [text-shadow:0_0_0.9rem_rgba(255,255,255,0.55),0_0.15rem_0.8rem_rgba(157,61,74,0.6)]'
    >
      {text}
    </motion.span>
  </span>
)

const lineMotion = {
  initial: { opacity: 0, y: 20, filter: 'blur(6px)' },
  exit: { opacity: 0, y: -20, filter: 'blur(6px)' },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
} as const

// Câu bè: nhỏ hơn, giãn chữ, nhẹ hơn — như giọng hát nền.
const lineClass = (backing: boolean) =>
  cn('font-lora italic leading-[1.35]', backing ? 'font-normal tracking-[0.03em]' : 'font-semibold')

/**
 * Lời bài hát karaoke. Desktop: câu xen kẽ hai bên cuốn thiệp như song ca — câu đang hát
 * tô dần, câu vừa hát bên kia giữ lại mờ hơn. Mobile/tablet: một dòng trong khung dưới đáy.
 */
const Lyrics = ({
  audioRef,
  playing,
}: {
  audioRef: RefObject<HTMLAudioElement | null>
  playing: boolean
}) => {
  const [index, setIndex] = useState(-1)
  // Nửa bề rộng cuốn thiệp (px) — thiệp co giãn theo màn hình nên đo thật để lời không đè lên.
  const [bookHalf, setBookHalf] = useState(0)
  // Mép trên hàng nút chuyển trang (mobile) — vị trí đổi theo chiều cao máy nên đo thật.
  const [controlsTop, setControlsTop] = useState(0)
  const progress = useMotionValue(0)
  const maskPosition = useTransform(progress, (value) => `${100 - value * 100}% 0%`)

  useEffect(() => {
    if (!playing) return
    let frame = 0
    const tick = () => {
      const time = audioRef.current?.currentTime ?? 0
      const current = lineIndexAt(time)
      setIndex(current)
      const book = document.querySelector('.invitation-book')
      if (book) setBookHalf(Math.round(book.getBoundingClientRect().width / 2))
      const controls = document.querySelector('.compact-book-controls')
      if (controls) setControlsTop(Math.round(controls.getBoundingClientRect().top))
      const line = LYRICS[current]
      if (line) progress.set(Math.min(1, (time - line.time) / fillSpan(line, LYRICS[current + 1])))
      frame = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(frame)
  }, [audioRef, playing, progress])

  const current = parseLine(index)
  // Dòng rỗng = đoạn không lời: câu cũ trước mốc này không giữ lại nữa.
  let lastBreak = -1
  for (let k = index; k >= 0; k -= 1) {
    if (!LYRICS[k]?.text) {
      lastBreak = k
      break
    }
  }
  const sides = ([0, 1] as const).map((side) => {
    const lineIndex = index % 2 === side ? index : index - 1
    const visible = playing && lineIndex > lastBreak && lineIndex >= 0
    return { side, lineIndex, visible, active: lineIndex === index, ...parseLine(lineIndex) }
  })

  return (
    <div aria-hidden>
      {/* Desktop: hai cột hai bên thiệp, cách mép thiệp 2.5rem. z-[5]: trên cánh hoa nền (z-1),
          dưới cuốn thiệp (z-10) — trang lật qua sẽ che lời chứ không bị lời đè. */}
      {sides.map(({ side, lineIndex, visible, active, text, backing }) => (
        <div
          key={side}
          style={{ width: `calc(50% - ${bookHalf}px - 4.5rem)` }}
          className={cn(
            'pointer-events-none fixed top-1/2 z-[5] hidden -translate-y-1/2 lg:grid',
            side === 0
              ? 'left-[2rem] justify-items-end text-right'
              : 'right-[2rem] justify-items-start text-left',
          )}
        >
          <AnimatePresence initial={false}>
            {visible && text && (
              <motion.p
                key={lineIndex}
                {...lineMotion}
                animate={{
                  opacity: active ? 1 : 0.65,
                  y: 0,
                  filter: 'blur(0px)',
                }}
                className={cn(
                  'col-start-1 row-start-1 max-w-[min(24rem,100%)]',
                  lineClass(backing),
                  backing
                    ? 'text-[clamp(1rem,1.3vw,1.35rem)]'
                    : 'text-[clamp(1.3rem,1.8vw,1.9rem)]',
                )}
              >
                <KaraokeText
                  text={text}
                  maskPosition={active ? maskPosition : FILLED}
                />
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Mobile / tablet: một dòng trong khung mờ, đặt ngay trên hàng nút chuyển trang. */}
      <div
        style={
          controlsTop
            ? { top: controlsTop, transform: 'translateY(calc(-100% - 0.5rem))' }
            : undefined
        }
        className={cn(
          'pointer-events-none fixed inset-x-0 z-40 grid justify-items-center px-6 lg:hidden',
          !controlsTop && 'bottom-[3.9rem]',
        )}
      >
        <AnimatePresence initial={false}>
          {playing && current.text && (
            <motion.p
              key={index}
              {...lineMotion}
              animate={{ opacity: current.backing ? 0.85 : 1, y: 0, filter: 'blur(0px)' }}
              className={cn(
                'col-start-1 row-start-1 max-w-[min(34rem,100%)] rounded-2xl bg-[#9d3d4a]/35 px-3 py-1 text-center shadow-[0_0.5rem_1.5rem_rgba(157,61,74,0.2)] backdrop-blur-md',
                lineClass(current.backing),
                current.backing
                  ? 'text-[0.9rem] xsm:text-[0.78rem]'
                  : 'text-[1.05rem] xsm:text-[0.9rem]',
              )}
            >
              <KaraokeText
                text={current.text}
                maskPosition={maskPosition}
              />
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Lyrics
