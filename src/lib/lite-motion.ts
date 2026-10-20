/** Gắn bởi script trong root layout, trước lần paint đầu. */
export const isLiteMotion = () =>
  typeof document !== 'undefined' && document.documentElement.dataset.motion === 'lite'
