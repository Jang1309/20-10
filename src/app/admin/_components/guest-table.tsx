'use client'

import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  CheckIcon,
  DownloadIcon,
  SearchIcon,
  Trash2Icon,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { exportGuestsExcel } from '@/app/admin/_components/export-excel'
import GuestFormDialog from '@/app/admin/_components/guest-form-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { parseWishKind } from '@/lib/wish-kind'

export type GuestRow = {
  guestId: string
  stt: number
  category: string | null
  name: string
  honorific: string | null
  title: string | null
  unit: string | null
  department: string | null
  partner: string | null
  wishKind: string
  link: string
  coverPhotoUrl?: string | null
  page3PhotoUrl?: string | null
}

const PAGE_SIZE = 10
const SIBLING_PAGES = 1
type SortKey = 'stt' | 'name' | 'link'
type SortDirection = 'asc' | 'desc'

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase()

const compareText = (a: string | null, b: string | null, direction: SortDirection) => {
  const aValue = normalize(a?.trim() ?? '')
  const bValue = normalize(b?.trim() ?? '')

  if (!aValue && !bValue) return 0
  if (!aValue) return 1
  if (!bValue) return -1

  const result = aValue.localeCompare(bValue, 'vi')
  return direction === 'asc' ? result : -result
}

const compareNumber = (a: number, b: number, direction: SortDirection) =>
  direction === 'asc' ? a - b : b - a

const compareRows = (a: GuestRow, b: GuestRow, sortKey: SortKey, direction: SortDirection) => {
  switch (sortKey) {
    case 'stt':
      return compareNumber(a.stt, b.stt, direction)
    case 'name':
      return compareText(a.name, b.name, direction)
    case 'link':
      return compareText(a.link, b.link, direction)
    default:
      return 0
  }
}

const getPaginationItems = (current: number, pageCount: number) => {
  const visible = new Set([1, pageCount])
  for (
    let pageNumber = current - SIBLING_PAGES;
    pageNumber <= current + SIBLING_PAGES;
    pageNumber += 1
  ) {
    if (pageNumber >= 1 && pageNumber <= pageCount) visible.add(pageNumber)
  }

  const pages = [...visible].sort((a, b) => a - b)
  return pages.flatMap((pageNumber, index) => {
    const previous = pages[index - 1]
    if (previous && pageNumber - previous > 1) {
      return [`ellipsis-${previous}-${pageNumber}`, pageNumber] as const
    }
    return [pageNumber] as const
  })
}

type Props = {
  rows: GuestRow[]
  loading: boolean
  origin: string
  onRefresh: () => void
}

type SortableHeadProps = {
  active: boolean
  className?: string
  direction: SortDirection
  label: string
  onSort: () => void
}

const SortableHead = ({ active, className, direction, label, onSort }: SortableHeadProps) => {
  const Icon = active ? (direction === 'asc' ? ArrowUpIcon : ArrowDownIcon) : ArrowUpDownIcon

  return (
    <TableHead className={className}>
      <Button
        variant='ghost'
        size='sm'
        className='h-8 w-full px-0 font-semibold hover:bg-transparent'
        aria-sort={active ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
        onClick={onSort}
      >
        {label}
        <Icon className='size-3.5' />
      </Button>
    </TableHead>
  )
}

const GuestTable = ({ rows, loading, origin, onRefresh }: Props) => {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'stt',
    direction: 'asc',
  })
  const [copied, setCopied] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deletingAll, setDeletingAll] = useState(false)

  const deleteAll = async () => {
    setDeletingAll(true)
    try {
      const response = await fetch('/api/guests', { method: 'DELETE' })
      const result = (await response.json()) as { ok: boolean; error?: string; deleted?: number }
      if (!result.ok) throw new Error(result.error ?? 'Lỗi.')
      toast.success(`Đã xoá ${result.deleted ?? 0} người.`)
      setPage(1)
      onRefresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không xoá được.')
    } finally {
      setDeletingAll(false)
    }
  }

  const setSortKey = (key: SortKey) => {
    setSort((currentSort) => ({
      key,
      direction: currentSort.key === key && currentSort.direction === 'asc' ? 'desc' : 'asc',
    }))
    setPage(1)
  }

  const deleteGuest = async (guestId: string) => {
    setDeletingId(guestId)
    try {
      const response = await fetch(`/api/guests/${guestId}`, { method: 'DELETE' })
      const result = (await response.json()) as { ok: boolean; error?: string }
      if (!result.ok) throw new Error(result.error ?? 'Lỗi.')
      toast.success('Đã xoá.')
      onRefresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không xoá được.')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    return rows
      .filter((row) => {
        if (!q) return true
        return normalize(`${row.honorific ?? ''} ${row.name}`).includes(q)
      })
      .toSorted((a, b) => {
        const result = compareRows(a, b, sort.key, sort.direction)
        return result === 0 ? a.stt - b.stt : result
      })
  }, [rows, query, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pageCount)
  const pageRows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  const paginationItems = getPaginationItems(current, pageCount)

  const copy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied((value) => (value === id ? null : value)), 1500)
  }

  return (
    <div className='space-y-6'>
      <p className='text-sm text-gray-600'>
        <span className='font-semibold text-gray-900'>{rows.length}</span> thiệp
        {query.trim() ? (
          <>
            {' '}
            · đang lọc <span className='font-semibold text-gray-900'>{filtered.length}</span>
          </>
        ) : null}
      </p>

      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='relative w-full max-w-xs'>
          <SearchIcon className='absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-gray-400' />
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
            placeholder='Tìm theo tên…'
            className='pl-8'
          />
        </div>
        <div className='flex gap-2'>
          <GuestFormDialog
            origin={origin}
            categories={[]}
            onSaved={onRefresh}
          />
          <Button
            variant='outline'
            size='sm'
            onClick={() => exportGuestsExcel(rows)}
            disabled={rows.length === 0}
          >
            <DownloadIcon className='size-4' />
            Xuất Excel
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={onRefresh}
            disabled={loading}
          >
            {loading ? 'Đang tải…' : 'Làm mới'}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='text-red-600 hover:text-red-700'
                disabled={rows.length === 0 || deletingAll}
              >
                <Trash2Icon className='size-4' />
                {deletingAll ? 'Đang xoá…' : 'Xoá tất cả'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xoá toàn bộ danh sách?</AlertDialogTitle>
                <AlertDialogDescription>
                  Xoá <b>{rows.length}</b> người cùng mọi ảnh đã tải lên. Tất cả link thiệp sẽ ngừng
                  hoạt động và không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Huỷ</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => void deleteAll()}
                  className='bg-red-600 hover:bg-red-700'
                >
                  Xoá tất cả
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className='rounded-lg border border-gray-200'>
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHead
                label='STT'
                className='w-12'
                active={sort.key === 'stt'}
                direction={sort.direction}
                onSort={() => setSortKey('stt')}
              />
              <SortableHead
                label='Họ tên'
                active={sort.key === 'name'}
                direction={sort.direction}
                onSort={() => setSortKey('name')}
              />
              <SortableHead
                label='Link thiệp'
                active={sort.key === 'link'}
                direction={sort.direction}
                onSort={() => setSortKey('link')}
              />
              <TableHead className='w-32 text-right'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className='py-8 text-center text-sm text-gray-500'
                >
                  {rows.length === 0
                    ? 'Chưa có ai trong DB. Tải file Excel lên để nạp danh sách.'
                    : 'Không tìm thấy người phù hợp.'}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((row) => (
                <TableRow key={row.guestId}>
                  <TableCell className='text-gray-400'>{row.stt}</TableCell>
                  <TableCell>
                    <div className='font-medium'>
                      {[row.honorific, row.name].filter(Boolean).join(' ')}
                    </div>
                    <div className='text-xs text-gray-400'>
                      Ảnh:{' '}
                      {[row.coverPhotoUrl && 'bìa', row.page3PhotoUrl && 'trang 3']
                        .filter(Boolean)
                        .join(' · ') || 'chưa có'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <a
                        href={row.link}
                        target='_blank'
                        rel='noreferrer'
                        className='max-w-[22rem] truncate text-[#D92F45] underline'
                      >
                        {row.link}
                      </a>
                      <Button
                        variant='outline'
                        size='sm'
                        className='h-7 px-2 text-xs'
                        onClick={() => void copy(row.link, row.guestId)}
                      >
                        {copied === row.guestId ? <CheckIcon className='size-3.5' /> : 'Chép'}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex justify-end gap-1'>
                      <GuestFormDialog
                        origin={origin}
                        categories={[]}
                        onSaved={onRefresh}
                        guest={{
                          guestId: row.guestId,
                          category: row.category ?? '',
                          honorific: row.honorific ?? '',
                          name: row.name,
                          title: row.title ?? '',
                          unit: row.unit ?? '',
                          department: row.department ?? '',
                          partner: row.partner ?? '',
                          wishKind: parseWishKind(row.wishKind),
                          coverPhotoUrl: row.coverPhotoUrl,
                          page3PhotoUrl: row.page3PhotoUrl,
                        }}
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-7 px-2 text-xs text-red-600 hover:text-red-700'
                            disabled={deletingId === row.guestId}
                          >
                            <Trash2Icon className='size-3.5' />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xoá khỏi danh sách?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Xoá <b>{[row.honorific, row.name].filter(Boolean).join(' ')}</b>. Link
                              thiệp sẽ không còn hoạt động.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Huỷ</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => void deleteGuest(row.guestId)}
                              className='bg-red-600 hover:bg-red-700'
                            >
                              Xoá
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pageCount > 1 && (
        <div className='flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500'>
          <span>
            {filtered.length} người · trang {current}/{pageCount}
          </span>
          <Pagination className='mx-0 w-auto'>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href='#'
                  text='Trước'
                  aria-disabled={current <= 1}
                  className={current <= 1 ? 'opacity-50' : undefined}
                  onClick={(event) => {
                    event.preventDefault()
                    setPage(Math.max(1, current - 1))
                  }}
                />
              </PaginationItem>
              {paginationItems.map((item) => (
                <PaginationItem key={item}>
                  {typeof item === 'string' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href='#'
                      isActive={item === current}
                      onClick={(event) => {
                        event.preventDefault()
                        setPage(item)
                      }}
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href='#'
                  text='Sau'
                  aria-disabled={current >= pageCount}
                  className={current >= pageCount ? 'opacity-50' : undefined}
                  onClick={(event) => {
                    event.preventDefault()
                    setPage(Math.min(pageCount, current + 1))
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

export default GuestTable
