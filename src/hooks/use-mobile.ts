import * as React from 'react'

const MOBILE_BREAKPOINT = 640
const TABLET_BREAKPOINT = 1025
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
const TABLET_QUERY = `(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`

function subscribeToQuery(query: string, onStoreChange: () => void) {
  const mql = window.matchMedia(query)
  mql.addEventListener('change', onStoreChange)
  return () => mql.removeEventListener('change', onStoreChange)
}

function getQuerySnapshot(query: string) {
  return window.matchMedia(query).matches
}

function getServerSnapshot() {
  return false
}

function subscribeToPlatform() {
  return () => {}
}

function getAndroidSnapshot() {
  return /Android/i.test(window.navigator.userAgent)
}

export function useIsMobile() {
  return React.useSyncExternalStore(
    (onStoreChange) => subscribeToQuery(MOBILE_QUERY, onStoreChange),
    () => getQuerySnapshot(MOBILE_QUERY),
    getServerSnapshot,
  )
}

export function useIsTablet() {
  return React.useSyncExternalStore(
    (onStoreChange) => subscribeToQuery(TABLET_QUERY, onStoreChange),
    () => getQuerySnapshot(TABLET_QUERY),
    getServerSnapshot,
  )
}

export function useIsAndroid() {
  return React.useSyncExternalStore(subscribeToPlatform, getAndroidSnapshot, getServerSnapshot)
}

type NavigatorWithMemory = Navigator & {
  deviceMemory?: number
  connection?: { saveData?: boolean; effectiveType?: string; addEventListener?: EventListener }
}

/** Máy yếu / tiết kiệm dữ liệu — dùng để tắt hiệu ứng nặng, điện thoại khỏe vẫn full. */
function getLowEndSnapshot() {
  const nav = window.navigator as NavigatorWithMemory
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  if (nav.connection?.saveData) return true
  const net = nav.connection?.effectiveType
  if (net === '2g' || net === 'slow-2g') return true

  const memory = nav.deviceMemory
  const cores = nav.hardwareConcurrency ?? 8
  // Chrome báo RAM GB; ≤4 gần như luôn máy phổ thông yếu GPU.
  if (typeof memory === 'number' && memory <= 4) return true
  if (cores <= 4) return true
  // Android mid-range hay khai 6–8 core nhưng RAM thấp.
  if (/Android/i.test(nav.userAgent) && typeof memory === 'number' && memory <= 6) return true
  return false
}

function subscribeToLowEnd(onStoreChange: () => void) {
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
  mql.addEventListener('change', onStoreChange)
  const conn = (window.navigator as NavigatorWithMemory).connection as
    | (EventTarget & { saveData?: boolean; effectiveType?: string })
    | undefined
  conn?.addEventListener('change', onStoreChange)
  return () => {
    mql.removeEventListener('change', onStoreChange)
    conn?.removeEventListener('change', onStoreChange)
  }
}

export function useIsLowEndDevice() {
  return React.useSyncExternalStore(subscribeToLowEnd, getLowEndSnapshot, getServerSnapshot)
}
