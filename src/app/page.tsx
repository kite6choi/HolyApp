/** HolyApp Build Trigger: 2026-01-17 */
export default function Home() {
  const features = [
    {
      title: "Sermon",
      subtitle: "설교말씀 검색",
      description: "매주 선포되는 생명력 있는 말씀을 고화질 영상과 생생한 음성으로 만나보세요.",
      icon: "📖",
      link: "/search/sermon",
      gradient: "linear-gradient(135deg, #059669, #10B981)"
    },
    {
      title: "Praise",
      subtitle: "찬양 검색",
      description: "마음을 여는 아름다운 찬양의 제목과 가사를 쉽고 빠르게 찾아보세요.",
      icon: "🎵",
      link: "/search/praise",
      gradient: "linear-gradient(135deg, #10B981, #34D399)"
    }
  ];

  return (
    <div className="container fade-in" style={{ padding: '100px 28px' }}>
      {/* Hero Section */}
      <section style={{ marginBottom: '120px', textAlign: 'left', maxWidth: '800px' }}>
        <h4 style={{ color: 'var(--primary)', letterSpacing: '0.4em', fontSize: '0.8rem', marginBottom: '20px', fontWeight: 700 }}>
          WELCOME TO HOLYSEEDS
        </h4>
        <h2 style={{ fontSize: '4.5rem', marginBottom: '32px', fontWeight: 800 }}>
          말씀과 찬양으로 <br />
          <span className="text-gradient">일상을 은혜롭게.</span>
        </h2>
        <p className="text-muted" style={{ fontSize: '1.25rem', lineHeight: '1.8', maxWidth: '600px' }}>
          홀리씨즈교회앱은 당신의 영성을 위한 축복의 통로 입니다.
          언제 어디서나 깊은 은혜의 시간을 경험해 보세요.
        </p>
      </section>

      {/* Main Features Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        marginBottom: '100px'
      }}>
        {features.map((feature, index) => (
          <a key={index} href={feature.link} className="glass-card" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            minHeight: '380px'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: feature.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.2rem',
              color: 'white',
              boxShadow: '0 15px 30px -10px rgba(0,0,0,0.2)'
            }}>
              {feature.icon}
            </div>
            <div style={{ marginTop: '20px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.2em' }}>{feature.title}</span>
              <h3 style={{ fontSize: '2rem', marginTop: '8px', marginBottom: '16px' }}>{feature.subtitle}</h3>
              <p className="text-muted" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>{feature.description}</p>
            </div>
            <div style={{
              marginTop: 'auto',
              fontWeight: 800,
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              GET STARTED <span style={{ fontSize: '1.2rem' }}>→</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
