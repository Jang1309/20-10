import { NextResponse } from 'next/server'

import { PHOTO_SLOTS } from '@/lib/guest'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BYTES = 3 * 1024 * 1024
const MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

type RouteContext = { params: Promise<{ id: string; slot: string }> }

const parseSlot = (slot: string) => {
  const n = Number(slot)
  return (PHOTO_SLOTS as readonly number[]).includes(n) ? n : null
}

/** Trả ảnh cho thiệp — URL có `?v=` theo lần sửa nên cache lâu được. */
export async function GET(_request: Request, { params }: RouteContext) {
  const { id, slot } = await params
  const n = parseSlot(slot)
  if (!n) return new Response('Not found', { status: 404 })

  const photo = await prisma.guestPhoto.findUnique({
    where: { guestId_slot: { guestId: id, slot: n } },
  })
  if (!photo) return new Response('Not found', { status: 404 })

  return new Response(Buffer.from(photo.data), {
    headers: {
      'Content-Type': photo.mime,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}

/** Upload / thay ảnh (form-data, field `file`). */
export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id, slot } = await params
    const n = parseSlot(slot)
    if (!n) return NextResponse.json({ ok: false, error: 'Ô ảnh không hợp lệ.' }, { status: 400 })

    const guest = await prisma.guest.findUnique({
      where: { guestId: id },
      select: { guestId: true },
    })
    if (!guest) {
      return NextResponse.json({ ok: false, error: 'Không tìm thấy khách.' }, { status: 404 })
    }

    const form = await request.formData().catch(() => null)
    const file = form?.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: 'Chưa chọn ảnh.' }, { status: 400 })
    }
    if (!MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { ok: false, error: 'Chỉ nhận ảnh JPG, PNG, WEBP.' },
        { status: 400 },
      )
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ ok: false, error: 'Ảnh quá lớn (tối đa 3MB).' }, { status: 413 })
    }

    const data = new Uint8Array(await file.arrayBuffer())
    const photo = await prisma.guestPhoto.upsert({
      where: { guestId_slot: { guestId: id, slot: n } },
      create: { guestId: id, slot: n, mime: file.type, data },
      update: { mime: file.type, data },
      select: { updatedAt: true },
    })

    return NextResponse.json({ ok: true, updatedAt: photo.updatedAt })
  } catch (error) {
    console.error('[guests/:id/photos] PUT failed:', error)
    return NextResponse.json({ ok: false, error: 'Không lưu được ảnh.' }, { status: 500 })
  }
}

/** Xoá ảnh — thiệp quay về dùng ảnh còn lại hoặc thiết kế mặc định. */
export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id, slot } = await params
    const n = parseSlot(slot)
    if (!n) return NextResponse.json({ ok: false, error: 'Ô ảnh không hợp lệ.' }, { status: 400 })
    await prisma.guestPhoto.deleteMany({ where: { guestId: id, slot: n } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[guests/:id/photos] DELETE failed:', error)
    return NextResponse.json({ ok: false, error: 'Không xoá được ảnh.' }, { status: 500 })
  }
}
