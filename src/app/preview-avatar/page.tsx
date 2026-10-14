// TẠM: chỉ để xem trước avatar trang 3 — xoá sau khi duyệt.
import InvitationFlipbook from '@/app/_components/invitation-flipbook'

const Preview = async ({ searchParams }: { searchParams: Promise<{ none?: string }> }) => {
  const { none } = await searchParams
  return (
    <InvitationFlipbook
      guest={{
        id: 'preview',
        honorific: 'Chị',
        name: 'Hoàng Thị Thu Hường',
        coverUrl: none ? undefined : '/2.png',
        avatarUrl: none ? undefined : '/2.png',
      }}
    />
  )
}

export default Preview
