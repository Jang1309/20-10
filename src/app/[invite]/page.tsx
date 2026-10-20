import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import InvitationFlipbook from '@/app/_components/invitation-flipbook'
import { type Guest, photoUrl } from '@/lib/guest'
import { prisma } from '@/lib/prisma'
import { SHARE_TITLE, inviteDescription } from '@/lib/site'
import { isUnbranded, parseWishKind } from '@/lib/wish-kind'

export const dynamic = 'force-dynamic'

type InvitePageProps = {
  params: Promise<{ invite: string }>
}

const findGuest = (slug: string) =>
  prisma.guest.findUnique({ where: { slug: decodeURIComponent(slug) } }).catch(() => null)

const guestLine = (g: { honorific: string | null; name: string }) =>
  [g.honorific, g.name].filter(Boolean).join(' ')

export async function generateMetadata({ params }: InvitePageProps): Promise<Metadata> {
  const { invite } = await params
  const g = await findGuest(invite)
  if (!g) return { title: 'Không tìm thấy thiệp', robots: { index: false, follow: false } }

  const who = [g.honorific, g.name].filter(Boolean).join(' ')
  const title = `${SHARE_TITLE} · ${who}`
  const wishKind = parseWishKind(g.wishKind)
  const description = inviteDescription(guestLine(g), isUnbranded(wishKind))

  return {
    title,
    description,
    alternates: { canonical: `/${invite}` },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `/${invite}`,
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: false, follow: false, nocache: true },
  }
}

const InvitePage = async ({ params }: InvitePageProps) => {
  const { invite } = await params
  const record = await findGuest(invite)

  if (!record) notFound()

  const photos = await prisma.guestPhoto.findMany({
    where: { guestId: record.guestId },
    select: { slot: true, updatedAt: true },
  })
  const urlOf = (slot: number) => {
    const photo = photos.find((p) => p.slot === slot)
    return photo ? photoUrl(record.guestId, slot, photo.updatedAt) : undefined
  }
  // Thiếu ảnh ô nào thì dùng ảnh ô còn lại.
  const cover = urlOf(1) ?? urlOf(2)
  const page3 = urlOf(2) ?? urlOf(1) ?? record.avatarUrl ?? undefined

  const guest: Guest = {
    id: record.guestId,
    name: record.name,
    honorific: record.honorific ?? undefined,
    title: record.title ?? undefined,
    unit: record.unit ?? undefined,
    department: record.department ?? undefined,
    partner: record.partner ?? undefined,
    coverUrl: cover ?? record.avatarUrl ?? undefined,
    avatarUrl: page3,
    category: record.category ?? undefined,
    wishKind: parseWishKind(record.wishKind),
  }

  return <InvitationFlipbook guest={guest} />
}

export default InvitePage
