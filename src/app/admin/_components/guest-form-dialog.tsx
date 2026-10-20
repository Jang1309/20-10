'use client'

import { PencilIcon, PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import GuestPhotoField from '@/app/admin/_components/guest-photo-field'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import {
  WISH_KINDS,
  WISH_KIND_LABEL,
  defaultHonorific,
  parseWishKind,
  type WishKind,
} from '@/lib/wish-kind'

export type GuestFormValue = {
  guestId?: string
  category: string
  honorific: string
  name: string
  title: string
  unit: string
  department: string
  partner: string
  wishKind: WishKind
  coverPhotoUrl?: string | null
  page3PhotoUrl?: string | null
}

const EMPTY: GuestFormValue = {
  category: '',
  honorific: 'Chị',
  name: '',
  title: '',
  unit: '',
  department: '',
  partner: '',
  wishKind: 'bateco',
}

type Props = {
  origin: string
  /** Giữ prop để tương thích chỗ gọi cũ; không còn dùng. */
  categories?: string[]
  onSaved: () => void
  guest?: GuestFormValue
}

const GuestFormDialog = ({ origin, onSaved, guest }: Props) => {
  const isEdit = Boolean(guest?.guestId)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<GuestFormValue>(guest ?? EMPTY)
  const [saving, setSaving] = useState(false)

  const reset = (next: boolean) => {
    setOpen(next)
    if (next) setForm(guest ?? EMPTY)
  }

  const setWishKind = (kind: WishKind) => {
    setForm((prev) => {
      const next = { ...prev, wishKind: kind }
      // Gợi ý danh xưng khi đổi loại (chỉ nếu đang để mặc định của loại cũ).
      const wasDefault =
        prev.honorific === defaultHonorific(prev.wishKind) ||
        prev.honorific === 'Chị' ||
        prev.honorific === ''
      if (wasDefault) next.honorific = defaultHonorific(kind)
      return next
    })
  }

  const submit = async () => {
    if (!form.name.trim()) {
      toast.error('Nhập họ tên.')
      return
    }
    setSaving(true)
    try {
      const payload = {
        honorific: form.honorific.trim() || defaultHonorific(form.wishKind),
        name: form.name.trim(),
        category: form.category.trim() || undefined,
        title: form.title.trim() || undefined,
        unit: form.unit.trim() || undefined,
        department: form.department.trim() || undefined,
        partner: form.partner.trim() || undefined,
        wishKind: form.wishKind,
      }

      const response = isEdit
        ? await fetch(`/api/guests/${guest?.guestId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ origin, ...payload }),
          })
        : await fetch('/api/guests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ origin, guests: [payload], replace: false }),
          })
      const result = (await response.json()) as { ok: boolean; error?: string; added?: number }
      if (!result.ok) throw new Error(result.error ?? 'Lỗi.')

      if (isEdit) toast.success('Đã cập nhật.')
      else if (result.added === 0) toast.info('Người này đã có trong danh sách.')
      else toast.success('Đã thêm.')

      setOpen(false)
      onSaved()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không lưu được.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={reset}
    >
      <DialogTrigger asChild>
        {isEdit ? (
          <Button
            variant='ghost'
            size='sm'
            className='h-7 px-2 text-xs'
          >
            <PencilIcon className='size-3.5' />
            Sửa
          </Button>
        ) : (
          <Button size='sm'>
            <PlusIcon className='size-4' />
            Thêm người
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Sửa thông tin' : 'Thêm người nhận thiệp'}</DialogTitle>
        </DialogHeader>

        <div className='grid gap-1.5'>
          <Label htmlFor='g-wishKind'>Loại thiệp</Label>
          <NativeSelect
            id='g-wishKind'
            className='w-full'
            value={form.wishKind}
            onChange={(event) => setWishKind(parseWishKind(event.target.value))}
          >
            {WISH_KINDS.map((kind) => (
              <NativeSelectOption
                key={kind}
                value={kind}
              >
                {WISH_KIND_LABEL[kind]}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <p className='text-xs text-muted-foreground'>
            {form.wishKind === 'mother'
              ? 'Lời chúc cho mẹ, chữ ký “Con yêu mẹ”, không logo Bateco.'
              : form.wishKind === 'partner'
                ? 'Lời chúc cho người yêu, chữ ký “Anh yêu em”, không logo Bateco.'
                : form.wishKind === 'external'
                  ? 'Lời chúc trung tính, không logo / chữ ký Bateco.'
                  : 'Thiệp có branding Bateco Group.'}
          </p>
        </div>

        <div className='grid grid-cols-[6rem_1fr] gap-3'>
          <div className='grid gap-1.5'>
            <Label htmlFor='g-honorific'>Danh xưng</Label>
            <Input
              id='g-honorific'
              value={form.honorific}
              onChange={(event) => setForm((prev) => ({ ...prev, honorific: event.target.value }))}
              placeholder={defaultHonorific(form.wishKind)}
            />
          </div>
          <div className='grid gap-1.5'>
            <Label htmlFor='g-name'>Họ và tên *</Label>
            <Input
              id='g-name'
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </div>
        </div>

        {guest?.guestId ? (
          <div className='grid grid-cols-2 gap-3'>
            <GuestPhotoField
              guestId={guest.guestId}
              slot={1}
              label='Ảnh bìa'
              url={guest.coverPhotoUrl ?? null}
              onChanged={onSaved}
            />
            <GuestPhotoField
              guestId={guest.guestId}
              slot={2}
              label='Ảnh trang 3'
              url={guest.page3PhotoUrl ?? null}
              onChanged={onSaved}
            />
          </div>
        ) : (
          <p className='text-xs text-gray-500'>
            Thêm người xong, bấm “Sửa” để tải ảnh bìa và ảnh trang 3.
          </p>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant='outline'
              disabled={saving}
            >
              Huỷ
            </Button>
          </DialogClose>
          <Button
            onClick={() => void submit()}
            disabled={saving}
          >
            {saving ? 'Đang lưu…' : isEdit ? 'Lưu' : 'Thêm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GuestFormDialog
