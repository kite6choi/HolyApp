import { ImageResponse } from 'next/og';

// Image metadata
export const alt = '홀리씨즈교회 - 말씀과 찬양으로 일상을 은혜롭게';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
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
          background: 'linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)',
          padding: '80px',
        }}
      >
        {/* 메인 컨텐츠 카드 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '48px',
            padding: '80px 100px',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)',
            width: '100%',
            maxWidth: '1000px',
          }}
        >
          {/* 아이콘 */}
          <div
            style={{
              fontSize: '120px',
              marginBottom: '40px',
              display: 'flex',
            }}
          >
            ✝️
          </div>

          {/* 교회 이름 */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #059669, #10B981)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '30px',
              display: 'flex',
              letterSpacing: '-0.05em',
            }}
          >
            홀리씨즈교회
          </div>

          {/* 영문명 */}
          <div
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#10B981',
              letterSpacing: '0.2em',
              marginBottom: '50px',
              display: 'flex',
            }}
          >
            HOLYSEEDS CHURCH
          </div>

          {/* 슬로건 */}
          <div
            style={{
              fontSize: '42px',
              fontWeight: 800,
              color: '#333',
              textAlign: 'center',
              lineHeight: 1.4,
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex' }}>말씀과 찬양으로</div>
            <div
              style={{
                background: 'linear-gradient(135deg, #059669, #10B981)',
                backgroundClip: 'text',
                color: 'transparent',
                display: 'flex',
              }}
            >
              일상을 은혜롭게.
            </div>
          </div>

          {/* 하단 아이콘 */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              marginTop: '60px',
              fontSize: '48px',
            }}
          >
            <div style={{ display: 'flex' }}>📖</div>
            <div style={{ display: 'flex' }}>🎵</div>
          </div>
        </div>

        {/* 하단 URL */}
        <div
          style={{
            marginTop: '40px',
            fontSize: '28px',
            fontWeight: 700,
            color: 'white',
            display: 'flex',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            padding: '20px 40px',
            borderRadius: '16px',
          }}
        >
          holyseeds-app.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
