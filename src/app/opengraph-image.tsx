import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Road Ready UAE – Free Driving Theory Test Practice'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#0e0e0e',
          padding: '60px',
        }}
      >
        {/* Top border accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            backgroundColor: '#f5ce53',
          }}
        />

        {/* Logo + Title row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          {/* Logo square */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              backgroundColor: '#f5ce53',
              border: '4px solid #000000',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="#000000"
            >
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16C5.67 16 5 15.33 5 14.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
            </svg>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                fontSize: '52px',
                fontWeight: 800,
                color: '#f5ce53',
                lineHeight: 1.1,
                letterSpacing: '-1px',
              }}
            >
              Road Ready UAE
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '28px',
            fontWeight: 600,
            color: '#81ecff',
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          Free Driving Theory Test Practice
        </div>

        {/* Vehicle categories */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          {['Light Vehicle', 'Motorcycle', 'Heavy Truck', 'Light Bus', 'Heavy Bus'].map(
            (cat) => (
              <div
                key={cat}
                style={{
                  display: 'flex',
                  padding: '12px 20px',
                  backgroundColor: '#1a1a1a',
                  border: '2px solid #333333',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#ffffff',
                }}
              >
                {cat}
              </div>
            )
          )}
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            fontSize: '20px',
            color: '#999999',
            textAlign: 'center',
          }}
        >
          500+ exam-style questions · Aligned with RTA standards · 100% free
        </div>

        {/* Bottom border accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '8px',
            backgroundColor: '#81ecff',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
