import { ImageResponse } from 'next/og'

import { OG_SIZE, OgCard, getOgAssets, getOgFonts } from '@/lib/og'
import { OG_ALT, SHARE_WHO_FALLBACK } from '@/lib/site'

export const runtime = 'nodejs'
export const alt = OG_ALT
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function OgImage() {
  const [assets, fonts] = await Promise.all([getOgAssets(), getOgFonts()])

  return new ImageResponse(
    <OgCard
      who={SHARE_WHO_FALLBACK}
      big={false}
      assets={assets}
    />,
    { ...size, fonts },
  )
}
