import bundleAnalyzer from '@next/bundle-analyzer'
import { NextConfig } from 'next'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
    // Next 16: ảnh nội bộ có query phải khai báo mới được tối ưu. Ảnh khách có `?v=<mốc sửa>`
    // nên bỏ `search` cho riêng route này; ảnh tĩnh trong /public thì không có query.
    localPatterns: [{ pathname: '/api/guests/*/photos/*' }, { pathname: '/**', search: '' }],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
    deviceSizes: [430, 768, 1080, 1280, 1600, 1920],
  },
  reactStrictMode: false,
  output: 'standalone',
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    viewTransition: true,
    webVitalsAttribution: ['CLS', 'LCP'],
    // cssChunking: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

// ANALYZE=true pnpm build

export default withBundleAnalyzer(nextConfig)
