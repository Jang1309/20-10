'use client'

import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import Lyrics from './lyrics'

// Chỉ các sự kiện này mới được trình duyệt tính là "người dùng thao tác" để cho phát tiếng.
// pointerdown/touchstart của ngón tay KHÔNG tính trên mobile (Safari/Chrome) → phải dùng lúc nhấc tay.
const UNLOCK_EVENTS = ['pointerup', 'touchend', 'click', 'keydown'] as const

// Animate height (không phải scaleY) để đầu cột luôn bo tròn. Mỗi cột một nhịp riêng để trông như đang "nghe" thật, không đều tăm tắp.
const EQUALIZER = [
  { heights: ['40%', '100%', '55%', '90%', '40%'], duration: 1.1 },
  { heights: ['100%', '45%', '80%', '35%', '100%'], duration: 0.9 },
  { heights: ['60%', '90%', '30%', '100%', '60%'], duration: 1.3 },
  { heights: ['35%', '70%', '100%', '50%', '35%'], duration: 1 },
]

/** Nhạc nền thiệp: mặc định bật, nút tròn góc trên phải để tắt/bật. */
const MusicToggle = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  // Ý muốn của khách (mặc định bật) — tách khỏi trạng thái phát thật vì autoplay có thể bị chặn.
  const wantPlayRef = useRef(true)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.5

    const tryPlay = () => {
      if (wantPlayRef.current && audio.paused) audio.play().catch(() => {})
    }
    // Trình duyệt chặn autoplay có tiếng → thử lại ở mỗi thao tác cho tới khi phát được thật.
    const unlock = (event: Event) => {
      // Chạm vào chính nút nhạc → để `toggle` xử lý, tránh vừa bật đã bị tắt.
      if (buttonRef.current?.contains(event.target as Node)) return
      tryPlay()
    }
    const stopListening = () =>
      UNLOCK_EVENTS.forEach((type) => window.removeEventListener(type, unlock))

    UNLOCK_EVENTS.forEach((type) => window.addEventListener(type, unlock))
    audio.addEventListener('play', stopListening, { once: true })
    tryPlay()
    return () => {
      stopListening()
      audio.removeEventListener('play', stopListening)
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    wantPlayRef.current = audio.paused
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  }

  return (
    <>
      <audio
        ref={audioRef}
        src='/20-10/music.mp3'
        loop
        preload='auto'
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <Lyrics
        audioRef={audioRef}
        playing={playing}
      />
      <button
        ref={buttonRef}
        type='button'
        onClick={toggle}
        aria-label={playing ? 'Tắt nhạc' : 'Bật nhạc'}
        aria-pressed={playing}
        className='fixed right-4 top-4 z-50 size-[2.75rem] rounded-full bg-[linear-gradient(160deg,#f6e3b6_0%,#c99a4a_35%,#f3d9a0_60%,#b8873a_100%)] p-[2px] shadow-[0_0.35rem_1rem_rgba(157,61,74,0.22)] transition-transform active:scale-90 xsm:right-1.5 xsm:top-1.5 xsm:size-9'
      >
        {/* Vòng sóng vàng lan ra khi đang phát. */}
        {playing && (
          <motion.span
            aria-hidden
            className='pointer-events-none absolute inset-0 rounded-full border border-[#c99a4a]'
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 1.75, opacity: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <span className='flex size-full items-center justify-center rounded-full bg-[#fff7f4]'>
          <span
            aria-hidden
            className='flex h-[0.95rem] items-end gap-[2.5px]'
          >
            {EQUALIZER.map((bar, index) => (
              <motion.span
                key={index}
                className='w-[2.5px] rounded-full bg-[#D92F45]'
                animate={
                  playing ? { height: bar.heights, opacity: 1 } : { height: '22%', opacity: 0.45 }
                }
                transition={
                  playing
                    ? { duration: bar.duration, repeat: Infinity, ease: 'easeInOut' }
                    : { duration: 0.35, ease: 'easeOut' }
                }
              />
            ))}
          </span>
        </span>
      </button>
    </>
  )
}

export default MusicToggle
