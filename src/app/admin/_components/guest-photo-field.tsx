'use client'

import { ImagePlusIcon, Trash2Icon } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

/** Cạnh dài tối đa sau khi thu nhỏ — đủ nét cho khung ảnh trên thiệp (màn retina). */
const MAX_SIDE = 1200

/** Thu nhỏ + nén JPEG trên trình duyệt để ảnh lưu trong DB chỉ còn ~100–300KB. */
const shrinkImage = async (file: File): Promise<Blob> => {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Trình duyệt không hỗ trợ xử lý ảnh.')
  // Nền trắng để ảnh PNG trong suốt không thành nền đen khi sang JPEG.
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Không nén được ảnh.'))),
      'image/jpeg',
      0.86,
    ),
  )
}

type Props = {
  guestId: string
  slot: 1 | 2
  label: string
  url: string | null
  onChanged: () => void
}

const ACCEPT = new Set(['image/jpeg', 'image/png', 'image/webp'])

const GuestPhotoField = ({ guestId, slot, label, url, onChanged }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState(url)
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const endpoint = `/api/guests/${guestId}/photos/${slot}`

  const upload = async (file: File) => {
    if (!ACCEPT.has(file.type)) {
      toast.error('Chỉ nhận JPG, PNG hoặc WebP.')
      return
    }
    setBusy(true)
    try {
      const blob = await shrinkImage(file).catch(() => {
        throw new Error('Không đọc được ảnh (HEIC chưa hỗ trợ, hãy dùng JPG/PNG).')
      })
      const body = new FormData()
      body.append('file', blob, 'photo.jpg')
      const response = await fetch(endpoint, { method: 'PUT', body })
      const result = (await response.json()) as { ok: boolean; error?: string; updatedAt?: string }
      if (!result.ok) throw new Error(result.error ?? 'Lỗi.')
      setPreview(`${endpoint}?v=${new Date(result.updatedAt ?? Date.now()).getTime()}`)
      toast.success(`Đã lưu ${label.toLowerCase()}.`)
      onChanged()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không tải được ảnh.')
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    setBusy(true)
    try {
      const response = await fetch(endpoint, { method: 'DELETE' })
      const result = (await response.json()) as { ok: boolean; error?: string }
      if (!result.ok) throw new Error(result.error ?? 'Lỗi.')
      setPreview(null)
      toast.success(`Đã xoá ${label.toLowerCase()}.`)
      onChanged()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không xoá được ảnh.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className='grid gap-1.5'>
      <Label>{label}</Label>
      <button
        type='button'
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        onDragEnter={(event) => {
          event.preventDefault()
          event.stopPropagation()
          if (!busy) setDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          event.stopPropagation()
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          // Chỉ tắt highlight khi rời hẳn ô (không phải sang con bên trong).
          if (event.currentTarget.contains(event.relatedTarget as Node)) return
          setDragging(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          event.stopPropagation()
          setDragging(false)
          if (busy) return
          const file = event.dataTransfer.files?.[0]
          if (file) void upload(file)
        }}
        className={`relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-md border border-dashed bg-gray-50 text-gray-400 transition disabled:opacity-60 ${
          dragging
            ? 'border-[#D92F45] bg-[#D92F45]/5 text-[#D92F45]'
            : 'border-gray-300 hover:border-[#D92F45] hover:text-[#D92F45]'
        }`}
        aria-label={preview ? `Đổi ${label.toLowerCase()}` : `Tải ${label.toLowerCase()}`}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- ảnh xem trước từ API nội bộ
          <img
            src={preview}
            alt={label}
            className='pointer-events-none h-full w-full object-cover'
          />
        ) : (
          <span className='pointer-events-none flex flex-col items-center gap-1 px-2 text-center text-xs'>
            <ImagePlusIcon className='size-5' />
            {dragging ? 'Thả ảnh vào đây' : 'Chọn hoặc kéo thả ảnh'}
          </span>
        )}
        {busy && (
          <span className='absolute inset-0 flex items-center justify-center bg-white/70 text-xs text-gray-600'>
            Đang xử lý…
          </span>
        )}
        {dragging && preview && (
          <span className='pointer-events-none absolute inset-0 flex items-center justify-center bg-[#D92F45]/15 text-xs font-medium text-[#D92F45]'>
            Thả để đổi ảnh
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type='file'
        accept='image/jpeg,image/png,image/webp'
        className='hidden'
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (file) void upload(file)
        }}
      />
      {preview && (
        <Button
          type='button'
          variant='ghost'
          size='sm'
          className='h-7 text-xs text-red-600 hover:text-red-700'
          onClick={() => void remove()}
          disabled={busy}
        >
          <Trash2Icon className='size-3.5' />
          Xoá ảnh
        </Button>
      )}
    </div>
  )
}

export default GuestPhotoField
