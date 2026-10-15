import type { Metadata } from 'next'
import { Great_Vibes, Lora, Noto_Serif, Pinyon_Script, Style_Script } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from 'sonner'

import { LenisProvider } from '@/components/providers/lenis-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { ORG_NAME, SHARE_TITLE, SITE_URL, inviteDescription } from '@/lib/site'

import '@/styles/globals.css'

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
})

const pinyonScript = Pinyon_Script({
  variable: '--font-pinyon-script',
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['400'],
})
const styleScript = Style_Script({
  variable: '--font-style-script-face',
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['400'],
})
const notoSerif = Noto_Serif({
  variable: '--font-noto-serif',
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const greatVibes = Great_Vibes({
  variable: '--font-great-vibes',
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
})

const description = inviteDescription()

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SHARE_TITLE} · ${ORG_NAME}`,
    template: `%s · ${ORG_NAME}`,
  },
  description,
  applicationName: SHARE_TITLE,
  keywords: ['Bateco', 'thiệp chúc', '20/10', 'Ngày Phụ nữ Việt Nam', ORG_NAME],
  authors: [{ name: ORG_NAME }],
  // URL có tên khách — không cho công cụ tìm kiếm lập chỉ mục.
  robots: { index: false, follow: false, nocache: true },
  openGraph: {
    type: 'website',
    siteName: ORG_NAME,
    locale: 'vi_VN',
    url: SITE_URL,
    title: `${SHARE_TITLE} · ${ORG_NAME}`,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SHARE_TITLE} · ${ORG_NAME}`,
    description,
  },
  formatDetection: { telephone: false, email: false, address: false },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='vi'>
      <body
        className={`${lora.variable} ${pinyonScript.variable} ${styleScript.variable} ${notoSerif.variable} ${greatVibes.variable} font-sans antialiased`}
      >
        <QueryProvider>
          <NuqsAdapter>
            <LenisProvider>{children}</LenisProvider>
            <Toaster richColors />
          </NuqsAdapter>
        </QueryProvider>
      </body>
    </html>
  )
}
