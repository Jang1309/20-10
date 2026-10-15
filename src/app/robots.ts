import type { MetadataRoute } from 'next'

const SHARE_BOTS = [
  'facebookexternalhit',
  'Facebot',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
  'TelegramBot',
  'Slackbot',
  'Discordbot',
  'Zalo',
  'ZaloBot',
  'Viber',
]

/** Trang thiệp có tên khách: bot tìm kiếm không vào. Bot xem trước link (Zalo, Facebook, …) được đọc thẻ chia sẻ, trừ admin/api. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: SHARE_BOTS,
        allow: '/',
        disallow: ['/admin', '/api/', '/preview-avatar'],
      },
      {
        userAgent: '*',
        disallow: '/',
      },
    ],
  }
}
