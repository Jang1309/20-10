import { ImageResponse } from 'next/og'

import { OG_SIZE, OgCard, getOgAssets, getOgFonts } from '@/lib/og'
import { prisma } from '@/lib/prisma'
import { OG_ALT, SHARE_WHO_FALLBACK } from '@/lib/site'
import { isUnbranded, parseWishKind } from '@/lib/wish-kind'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const alt = OG_ALT
export const size = OG_SIZE
export const contentType = 'image/png'

type Params = { params: Promise<{ invite: string }> }

export default async function OgImage({ params }: Params) {
  const { invite } = await params
  const guest = await prisma.guest
    .findUnique({ where: { slug: decodeURIComponent(invite) } })
    .catch(() => null)

  const who = guest ? [guest.honorific, guest.name].filter(Boolean).join(' ') : SHARE_WHO_FALLBACK
  const [assets, fonts] = await Promise.all([getOgAssets(), getOgFonts()])

  return new ImageResponse(
    <OgCard
      who={who}
      big={Boolean(guest)}
      unbranded={guest ? isUnbranded(parseWishKind(guest.wishKind)) : false}
      assets={assets}
    />,
    { ...size, fonts },
  )
}
