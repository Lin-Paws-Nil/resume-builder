import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'createresume.co — Free AI Resume Builder';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2zm2 4v2h8V7H8zm0 4v2h8v-2H8zm0 4v2h5v-2H8z" fill="white"/>
            </svg>
          </div>
          <span
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            createresume.co
          </span>
        </div>
        <h1
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: '20px',
          }}
        >
          Free AI Resume Builder
        </h1>
        <p
          style={{
            fontSize: '28px',
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          12+ ATS-friendly templates. AI-powered suggestions. Instant PDF download.
        </p>
      </div>
    ),
    { ...size }
  );
}
