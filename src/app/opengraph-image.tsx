import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Road Ready UAE – Free UAE Driving Theory Test Practice for All Vehicle Types'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#0e0e0e',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gold top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            backgroundColor: '#f5ce53',
          }}
        />

        {/* Cyan bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '6px',
            backgroundColor: '#81ecff',
          }}
        />

        {/* Subtle grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            opacity: 0.06,
            backgroundImage:
              'linear-gradient(#f5ce53 1px, transparent 1px), linear-gradient(90deg, #f5ce53 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '50px 60px',
            flex: 1,
            justifyContent: 'space-between',
          }}
        >
          {/* Top: Logo + Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                backgroundColor: '#f5ce53',
                border: '3px solid #000000',
                boxShadow: '4px 4px 0px 0px #000000',
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#000000">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16C5.67 16 5 15.33 5 14.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.5px',
                }}
              >
                ROAD READY{' '}
                <span style={{ color: '#f5ce53' }}>UAE</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#81ecff', letterSpacing: '2px', textTransform: 'uppercase' as const }}>
                Free Theory Test Practice
              </div>
            </div>
          </div>

          {/* Center: Main headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                fontSize: '56px',
                fontWeight: 800,
                color: '#f5ce53',
                lineHeight: 1.05,
                letterSpacing: '-2px',
              }}
            >
              Pass Your UAE
            </div>
            <div
              style={{
                fontSize: '56px',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.05,
                letterSpacing: '-2px',
              }}
            >
              Driving Test
            </div>
            <div
              style={{
                fontSize: '22px',
                fontWeight: 500,
                color: '#ababab',
                marginTop: '8px',
              }}
            >
              Practice with 1,200+ real exam-style questions aligned with RTA standards
            </div>
          </div>

          {/* Bottom: Feature pills + vehicle types */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Feature badges */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { icon: '✓', text: '1,200+ Questions', color: '#4ade80' },
                { icon: '✓', text: '6 Languages', color: '#81ecff' },
                { icon: '✓', text: 'Mock Exams', color: '#f5ce53' },
                { icon: '✓', text: '100% Free', color: '#4ade80' },
              ].map((f) => (
                <div
                  key={f.text}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: '#191919',
                    border: '2px solid #333333',
                  }}
                >
                  <span style={{ color: f.color, fontSize: '16px', fontWeight: 800 }}>{f.icon}</span>
                  <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: 600 }}>{f.text}</span>
                </div>
              ))}
            </div>

            {/* Vehicle types */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {['Car', 'Motorcycle', 'Truck', 'Light Bus', 'Heavy Bus'].map((v) => (
                <div
                  key={v}
                  style={{
                    padding: '6px 14px',
                    border: '2px solid #f5ce53',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#f5ce53',
                    letterSpacing: '1px',
                    textTransform: 'uppercase' as const,
                  }}
                >
                  {v}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
