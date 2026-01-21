import Link from "next/link";

export default function Offline() {
    return (
        <div className="container fade-in" style={{
            padding: '100px 24px',
            textAlign: 'center',
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div className="glass-card" style={{
                maxWidth: '600px',
                padding: '60px 40px'
            }}>
                <div style={{ fontSize: '5rem', marginBottom: '30px' }}>📡</div>

                <h1 style={{
                    fontSize: '2.5rem',
                    marginBottom: '20px'
                }}>
                    <span className="text-gradient">오프라인 상태</span>
                </h1>

                <p className="text-muted" style={{
                    fontSize: '1.1rem',
                    marginBottom: '40px',
                    lineHeight: '1.7'
                }}>
                    인터넷 연결이 끊어졌습니다.<br />
                    네트워크 연결을 확인해 주세요.
                </p>

                <div style={{
                    padding: '24px',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '16px',
                    marginBottom: '40px'
                }}>
                    <p style={{
                        fontSize: '0.9rem',
                        color: 'var(--primary)',
                        fontWeight: 700,
                        marginBottom: '8px'
                    }}>
                        💡 PWA 기능
                    </p>
                    <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                        이 앱을 홈 화면에 추가하면 오프라인에서도<br />
                        일부 기능을 사용할 수 있습니다.
                    </p>
                </div>

                <Link href="/" className="btn-primary" style={{
                    padding: '16px 40px',
                    display: 'inline-block'
                }}>
                    다시 시도
                </Link>
            </div>
        </div>
    );
}
