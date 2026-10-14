'use client'

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { MotionConfig, motion } from 'motion/react'
import Image from 'next/image'
import { forwardRef, useCallback, useRef, useState, useSyncExternalStore } from 'react'
import HTMLFlipBook from 'react-pageflip'

import FallingPetals from '@/app/_components/falling-petals'
import { ActivePageProvider } from '@/app/_components/invitation-flipbook/active-page-context'
import { GuestProvider } from '@/app/_components/invitation-flipbook/guest-context'
import { useBookPageSize } from '@/app/_components/invitation-flipbook/use-book-page-size'
import Page1 from '@/app/_components/page-1'
import Page2 from '@/app/_components/page-2'
import Page3 from '@/app/_components/page-3'
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile'
import { bookOpen, withDelay, fadeIn } from '@/lib/animations'
import type { Guest } from '@/lib/guest'
import { cn } from '@/lib/utils'

type PageFlipHandle = {
  pageFlip: () => {
    flipNext: () => void
    flipPrev: () => void
  }
}

type FlipPageProps = {
  children: React.ReactNode
  className?: string
}

type SwipeStart = {
  x: number
  y: number
  pointerId: number
} | null

const FlipPage = forwardRef<HTMLDivElement, FlipPageProps>(({ children, className }, ref) => {
  return (
    <div
      ref={ref}
      data-density='soft'
      className={cn(
        'invitation-flip-page h-full w-full overflow-hidden bg-[#f6dde3]',
        'select-none shadow-[0_1.5rem_4rem_rgba(44,31,14,0.28)]',
        className,
      )}
    >
      {children}
    </div>
  )
})

FlipPage.displayName = 'FlipPage'

const pages = [
  { id: 'cover', label: 'Trang bìa', content: <Page1 /> },
  { id: 'details', label: 'Thông tin', content: <Page2 /> },
  { id: 'closing', label: 'Lời mời', content: <Page3 /> },
]

const interactiveSelector = 'a, button, input, textarea, select, summary, [role="button"]'

const subscribeNoop = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

const InvitationFlipbook = ({ guest }: { guest?: Guest | null }) => {
  const bookRef = useRef<PageFlipHandle>(null)
  const swipeStartRef = useRef<SwipeStart>(null)
  const didSwipeRef = useRef(false)
  const pointerStartXRef = useRef<number | null>(null)
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isCompactBook = isMobile || isTablet
  const bookPageSize = useBookPageSize()
  const [activePage, setActivePage] = useState(0)
  const [pageState, setPageState] = useState('read')
  const [bookOrientation, setBookOrientation] = useState<{
    compact: boolean
    value: 'portrait' | 'landscape'
  } | null>(null)
  const [flipDirection, setFlipDirection] = useState<'forward' | 'back' | null>(null)
  const mounted = useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot)
  const orientation =
    bookOrientation?.compact === isCompactBook
      ? bookOrientation.value
      : isCompactBook
        ? 'portrait'
        : 'landscape'

  const effectiveFlipDirection = pageState === 'read' ? null : flipDirection
  const canFlipPrev = activePage > 0 && pageState === 'read'
  const canFlipNext = activePage < pages.length - 1 && pageState === 'read'

  const rememberOrientation = (mode: string) => {
    setBookOrientation({
      compact: isCompactBook,
      value: mode === 'portrait' ? 'portrait' : 'landscape',
    })
  }

  const flipToAdjacentPage = useCallback(
    (direction: 'next' | 'prev') => {
      if (pageState !== 'read') {
        return
      }

      const pageFlip = bookRef.current?.pageFlip()

      if (direction === 'prev' && activePage > 0) {
        setFlipDirection('back')
        pageFlip?.flipPrev()
        return
      }

      if (direction === 'next' && activePage < pages.length - 1) {
        setFlipDirection('forward')
        pageFlip?.flipNext()
      }
    },
    [activePage, pageState],
  )

  const handleDesktopBookClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (didSwipeRef.current) {
        didSwipeRef.current = false
        return
      }

      if (
        !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
        pageState !== 'read'
      ) {
        return
      }

      if ((event.target as HTMLElement).closest(interactiveSelector)) {
        return
      }

      const { left, width } = event.currentTarget.getBoundingClientRect()
      const clickedLeftHalf = event.clientX < left + width / 2

      flipToAdjacentPage(clickedLeftHalf ? 'prev' : 'next')
    },
    [flipToAdjacentPage, pageState],
  )

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest(interactiveSelector)) {
      return
    }

    pointerStartXRef.current = event.clientX
    swipeStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }, [])

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const swipeStart = swipeStartRef.current
      pointerStartXRef.current = null

      if (!swipeStart || swipeStart.pointerId !== event.pointerId) {
        return
      }

      swipeStartRef.current = null

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }

      const deltaX = event.clientX - swipeStart.x
      const deltaY = event.clientY - swipeStart.y
      const isHorizontalSwipe = Math.abs(deltaX) >= 32 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25

      if (!isHorizontalSwipe) {
        return
      }

      didSwipeRef.current = true
      flipToAdjacentPage(deltaX < 0 ? 'next' : 'prev')
    },
    [flipToAdjacentPage],
  )

  const handlePointerCancel = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    pointerStartXRef.current = null

    if (swipeStartRef.current?.pointerId !== event.pointerId) {
      return
    }

    swipeStartRef.current = null

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }, [])

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartXRef.current !== null) {
      const dx = event.clientX - pointerStartXRef.current
      if (Math.abs(dx) >= 4) {
        setFlipDirection(dx < 0 ? 'forward' : 'back')
      }
    }

    if (!swipeStartRef.current) {
      return
    }

    const deltaX = event.clientX - swipeStartRef.current.x
    const deltaY = event.clientY - swipeStartRef.current.y

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      event.preventDefault()
    }
  }, [])

  const bookReady = mounted && bookPageSize.width > 0

  return (
    <MotionConfig reducedMotion='user'>
      <GuestProvider value={guest ?? null}>
        <ActivePageProvider value={{ page: activePage, orientation }}>
          <section className='invitation-stage relative flex min-h-svh overflow-hidden text-[#5e2f35] pt-[2rem] lg:h-svh lg:min-h-0 lg:pt-[0.75rem] xlg:h-svh xlg:min-h-0 xlg:pt-[0.75rem]'>
            <Image
              src='/bg-20-10.png'
              alt='Background'
              fill
              sizes='100vw'
              priority
              unoptimized
              className='absolute inset-0 object-cover'
            />
            <FallingPetals />
            <div className='relative z-10 mx-auto flex w-full max-w-[78rem] flex-col items-center justify-center gap-5 px-0 xlg:h-full xlg:max-w-full xlg:gap-2 tablet:px-4 xsm:px-4'>
              <motion.div
                initial='hidden'
                animate={bookReady ? 'show' : 'hidden'}
                variants={bookOpen}
                className='relative w-full max-w-[70rem]'
              >
                <div
                  className={cn(
                    'book-stage relative flex justify-center transition-transform duration-700 ease-out',
                    orientation === 'landscape' && activePage === 0 && '-translate-x-[12.5rem]',
                    orientation === 'landscape' &&
                      activePage === pages.length - 1 &&
                      'translate-x-[15rem]',
                  )}
                >
                  <div
                    className='book-shell cursor-pointer'
                    data-page-state={pageState}
                    data-flip-direction={effectiveFlipDirection ?? undefined}
                    onClick={handleDesktopBookClick}
                    onPointerCancel={handlePointerCancel}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                  >
                    {bookReady && (
                      <HTMLFlipBook
                        key={isCompactBook ? 'compact-book' : 'desktop-book'}
                        ref={bookRef}
                        className={cn('invitation-book')}
                        style={{}}
                        width={bookPageSize.width}
                        height={bookPageSize.height}
                        minWidth={bookPageSize.minWidth}
                        maxWidth={bookPageSize.maxWidth}
                        minHeight={bookPageSize.minHeight}
                        maxHeight={bookPageSize.maxHeight}
                        size='stretch'
                        startPage={0}
                        drawShadow
                        flippingTime={isCompactBook ? 700 : 1000}
                        usePortrait={isCompactBook}
                        startZIndex={30}
                        autoSize
                        maxShadowOpacity={0.86}
                        showCover={!isCompactBook}
                        mobileScrollSupport={false}
                        clickEventForward
                        useMouseEvents={false}
                        swipeDistance={8}
                        showPageCorners={!isCompactBook}
                        disableFlipByClick
                        onFlip={(event) => setActivePage(Number(event.data))}
                        onChangeState={(event) => setPageState(String(event.data))}
                        onChangeOrientation={(event) => rememberOrientation(String(event.data))}
                        onInit={(event) => {
                          const mode = (event.data as { mode?: string } | undefined)?.mode
                          if (mode) rememberOrientation(mode)
                        }}
                      >
                        {pages.map((page) => (
                          <FlipPage key={page.id}>{page.content}</FlipPage>
                        ))}
                      </HTMLFlipBook>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial='hidden'
                animate={bookReady ? 'show' : 'hidden'}
                variants={withDelay(fadeIn, 1.6)}
                className='flex flex-col items-center gap-5 xlg:gap-2'
              >
                <p
                  className={cn(
                    'text-[#c45a6a] text-[1rem] font-semibold opacity-0 transition-opacity duration-300 ease-out xlg:hidden',
                    activePage === 0 && 'opacity-100',
                  )}
                >
                  Click hoặc vuốt màn hình để xem thiệp
                </p>

                <div className='compact-book-controls hidden items-center justify-center gap-3 xlg:flex'>
                  <button
                    type='button'
                    aria-label='Trang trước'
                    disabled={!canFlipPrev}
                    onClick={() => flipToAdjacentPage('prev')}
                    className='flex size-[2.75rem] items-center justify-center rounded-full border border-[#D92F45]/40 bg-[#f6dde3]/90 text-[#9d3d4a] shadow-[0_0.35rem_1rem_rgba(157,61,74,0.16)] transition-colors disabled:opacity-35'
                  >
                    <ChevronLeftIcon className='size-5' />
                  </button>
                  <span className='min-w-[4.25rem] rounded-full border border-[#D92F45]/30 bg-[#f6dde3]/80 px-3 py-2 text-center font-lora text-[0.78rem] font-semibold text-[#9d3d4a] tabular-nums shadow-[0_0.35rem_1rem_rgba(157,61,74,0.12)]'>
                    {activePage + 1}/{pages.length}
                  </span>
                  <button
                    type='button'
                    aria-label='Trang sau'
                    disabled={!canFlipNext}
                    onClick={() => flipToAdjacentPage('next')}
                    className='flex size-[2.75rem] items-center justify-center rounded-full border border-[#D92F45]/40 bg-[#f6dde3]/90 text-[#9d3d4a] shadow-[0_0.35rem_1rem_rgba(157,61,74,0.16)] transition-colors disabled:opacity-35'
                  >
                    <ChevronRightIcon className='size-5' />
                  </button>
                </div>
              </motion.div>
            </div>
            <FallingPetals layer='front' />
          </section>
        </ActivePageProvider>
      </GuestProvider>
    </MotionConfig>
  )
}

export default InvitationFlipbook
