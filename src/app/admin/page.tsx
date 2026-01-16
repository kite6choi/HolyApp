"use client";

export default function AdminDashboard() {
    return (
        <div className="container fade-in" style={{ padding: '100px 28px' }}>
            <header style={{ marginBottom: '60px' }}>
                <h2 style={{ fontSize: '3.5rem', marginBottom: '16px' }}>
                    ⚙️ <span className="text-gradient">Admin Dashboard</span>
                </h2>
                <p className="text-muted" style={{ fontSize: '1.2rem' }}>홀리씨즈 앱의 데이터를 관리하는 중앙 제어 센터입니다.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                <a href="/admin/upload" className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ fontSize: '2.5rem' }}>📤</div>
                    <div>
                        <h3 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>콘텐츠 업로드</h3>
                        <p className="text-muted">설교와 찬양 데이터를 데이터베이스에 직접 등록합니다.</p>
                    </div>
                    <div style={{ marginTop: 'auto', fontWeight: 800, color: 'var(--primary)' }}>GO TO UPLOAD →</div>
                </a>

                {/* 나중에 데이터 통계나 사용자 관리 등을 추가할 수 있는 슬롯 */}
                <div className="glass-card" style={{ opacity: 0.5, borderStyle: 'dashed' }}>
                    <div style={{ fontSize: '2.5rem' }}>📊</div>
                    <div>
                        <h3 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>데이터 통계</h3>
                        <p className="text-muted">업로드된 콘텐츠의 현황을 확인합니다. (준비 중)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
