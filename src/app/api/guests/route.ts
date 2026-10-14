import { NextResponse } from 'next/server'

import { type Guest, photoUrl } from '@/lib/guest'
import { mergeGuestList, replaceGuestList } from '@/lib/guest-store'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type SaveBody = {
  origin?: string
  guests?: Guest[]
  /** true = xoá danh sách cũ rồi nạp lại; mặc định chỉ thêm người mới. */
  replace?: boolean
}

/** Nạp danh sách vào DB — mặc định chỉ thêm người mới, `replace` để ghi đè. */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as SaveBody
    const guests = Array.isArray(body.guests) ? body.guests : []
    if (guests.length === 0) {
      return NextResponse.json({ ok: false, error: 'Danh sách rỗng.' }, { status: 400 })
    }
    if (body.replace) {
      const saved = await replaceGuestList(guests, body.origin ?? '')
      return NextResponse.json({ ok: true, replaced: true, saved, added: saved })
    }
    const added = await mergeGuestList(guests, body.origin ?? '')
    return NextResponse.json({ ok: true, replaced: false, added })
  } catch (error) {
    console.error('[guests] POST failed:', error)
    return NextResponse.json({ ok: false, error: 'Không lưu được danh sách.' }, { status: 500 })
  }
}

/** Danh sách người nhận thiệp cho trang admin. */
export async function GET() {
  try {
    const [rows, photos] = await Promise.all([
      prisma.guest.findMany({ orderBy: [{ stt: 'asc' }] }),
      prisma.guestPhoto.findMany({ select: { guestId: true, slot: true, updatedAt: true } }),
    ])
    const urlOf = (guestId: string, slot: number) => {
      const photo = photos.find((p) => p.guestId === guestId && p.slot === slot)
      return photo ? photoUrl(guestId, slot, photo.updatedAt) : null
    }
    const guests = rows.map((row) => ({
      ...row,
      coverPhotoUrl: urlOf(row.guestId, 1),
      page3PhotoUrl: urlOf(row.guestId, 2),
    }))

    return NextResponse.json({
      ok: true,
      count: guests.length,
      guests,
    })
  } catch (error) {
    console.error('[guests] GET failed:', error)
    return NextResponse.json({ ok: false, error: 'Không đọc được danh sách.' }, { status: 500 })
  }
}

/** Xoá toàn bộ danh sách khách và mọi ảnh đã upload. */
export async function DELETE() {
  try {
    const [guests] = await prisma.$transaction([
      prisma.guest.deleteMany(),
      prisma.guestPhoto.deleteMany(),
    ])
    return NextResponse.json({ ok: true, deleted: guests.count })
  } catch (error) {
    console.error('[guests] DELETE failed:', error)
    return NextResponse.json({ ok: false, error: 'Không xoá được danh sách.' }, { status: 500 })
  }
}
