import { ImageResponse } from 'next/og'

export const alt = 'Road Ready UAE Blog'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { slug } = await params

  // Convert slug to readable title
  const title = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/Rta/g, 'RTA')
    .replace(/Uae/g, 'UAE')
    .replace(/2026/g, '(2026)')

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0e0e0e',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              backgroundColor: '#f5ce53',
              color: '#584500',
              padding: '6px 16px',
              fontSize: '18px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              border: '3px solid #000000',
              alignSelf: 'flex-start',
            }}
          >
            BLOG
          </div>
          <div
            style={{
              fontSize: '48px',
              fontWeight: 700,
              color: '#f9f9f9',
              lineHeight: 1.2,
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#f5ce53',
                border: '3px solid #000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#584500',
                fontSize: '20px',
                fontWeight: 700,
              }}
            >
              RR
            </div>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#f9f9f9',
              }}
            >
              ROAD READY{' '}
              <span style={{ color: '#f5ce53' }}>UAE</span>
            </div>
          </div>
          <div
            style={{
              color: '#81ecff',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            roadreadyuae.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
