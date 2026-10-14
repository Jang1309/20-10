/** Thông tin dùng cho SEO / thẻ chia sẻ (Open Graph) của thiệp chúc 20/10. */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://bateco-birthday.vercel.app')
).replace(/\/$/, '')

export const ORG_NAME = 'Tập đoàn Bateco'
export const EVENT_NAME = 'Chúc mừng ngày Phụ nữ Việt Nam 20/10'
export const EVENT_WHEN = '20/10'
export const EVENT_VENUE = 'Bateco Group'

/** Câu mô tả chung, chèn tên khách nếu có. */
export const inviteDescription = (guestLine?: string) =>
  `${ORG_NAME} xin gửi đến ${guestLine ?? 'Chị'} lời chúc mừng chân thành nhân ${EVENT_NAME}.`
