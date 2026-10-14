/**
 * Mốc thời gian liên quan thiệp 20/10 (giờ Việt Nam, UTC+7).
 * Giữ file này cho countdown / tiện ích ngày giờ nếu cần sau.
 */
export const EVENT_DATE = new Date('2026-10-20T00:00:00+07:00')

export type Remaining = {
  total: number
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
}

/** Thời gian còn lại từ `from` (mặc định: bây giờ) đến ngày 20/10. */
export const getRemaining = (from: number = Date.now()): Remaining => {
  const total = Math.max(0, EVENT_DATE.getTime() - from)
  const seconds = Math.floor(total / 1000)
  return {
    total,
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    done: total === 0,
  }
}
