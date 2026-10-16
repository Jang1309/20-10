/* eslint-disable @next/next/no-img-element */

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { ORG_NAME } from '@/lib/site'

export const OG_SIZE = { width: 1200, height: 630 }

type OgAssets = {
  background: string
  invite: string
  logo: string
}
type CardProps = {
  who: string
  partner?: string
  big?: boolean
  assets: OgAssets
}
type OgFont = {
  name: string
  data: ArrayBuffer
  weight: 400 | 700
  style: 'normal'
}

const publicPath = (file: string) => join(process.cwd(), 'public', file)
const readPublicFile = async (file: string) => {
  const buffer = await readFile(publicPath(file))
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer
}
const readAsset = async (file: string, mime: string) => {
  const buffer = await readFile(publicPath(file))
  return `data:${mime};base64,${buffer.toString('base64')}`
}

let fontsPromise: Promise<OgFont[]> | null = null
let assetsPromise: Promise<OgAssets> | null = null

export const getOgFonts = () => {
  fontsPromise ??= Promise.all([
    readPublicFile('fonts/NotoSans-Regular.ttf').then((data) => ({
      name: 'Noto Sans',
      data,
      weight: 400 as const,
      style: 'normal' as const,
    })),
    readPublicFile('fonts/NotoSans-Bold.ttf').then((data) => ({
      name: 'Noto Sans',
      data,
      weight: 700 as const,
      style: 'normal' as const,
    })),
  ])

  return fontsPromise
}

export const getOgAssets = () => {
  assetsPromise ??= Promise.all([
    readAsset('bg-20-10.png', 'image/png'),
    readAsset('title.png', 'image/png'),
    readAsset('d-logo.png', 'image/png'),
  ]).then(([background, invite, logo]) => ({ background, invite, logo }))

  return assetsPromise
}

const TitleCard = ({ src, width, height }: { src: string; width: number; height: number }) => (
  <div
    style={{
      width,
      height,
      display: 'flex',
      background: '#fff7f4',
      borderRadius: 18,
      overflow: 'hidden',
      border: '1px solid rgba(201,154,74,0.55)',
      boxShadow: '0 16px 40px rgba(157,61,74,0.16)',
    }}
  >
    <img
      src={src}
      alt=''
      width={width}
      height={height}
      style={{ width, height, objectFit: 'contain' }}
    />
  </div>
)

/** Ảnh chia sẻ: tiêu đề thiệp trên nền lụa, tên khách một dòng. Không lặp lại câu 20/10. */
export const OgCard = ({ who, partner, big = true, assets }: CardProps) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      position: 'relative',
      background: '#f6dde3',
      fontFamily: 'Noto Sans',
      color: '#9d2340',
    }}
  >
    <img
      src={assets.background}
      alt=''
      width={1200}
      height={630}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1200,
        height: 630,
        objectFit: 'cover',
      }}
    />
    {big ? (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          padding: '40px 64px',
          gap: 56,
        }}
      >
        <TitleCard
          src={assets.invite}
          width={360}
          height={480}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: 640,
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 4, color: '#a24b5c' }}>
            THÂN GỬI
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 54,
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#9d2340',
            }}
          >
            {who}
          </div>
          {partner ? (
            <div style={{ marginTop: 8, fontSize: 28, color: '#9d2340' }}>{partner}</div>
          ) : null}
          <div
            style={{
              marginTop: 28,
              width: 72,
              height: 2,
              background: '#c99a4a',
            }}
          />
          <img
            src={assets.logo}
            alt=''
            width={168}
            height={46}
            style={{ marginTop: 22, width: 168, height: 46, objectFit: 'contain' }}
          />
        </div>
      </div>
    ) : (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 18,
        }}
      >
        <img
          src={assets.logo}
          alt=''
          width={150}
          height={41}
          style={{ width: 150, height: 41, objectFit: 'contain' }}
        />
        <TitleCard
          src={assets.invite}
          width={340}
          height={453}
        />
        <div style={{ fontSize: 20, color: '#7a3a40' }}>{ORG_NAME}</div>
      </div>
    )}
  </div>
)
