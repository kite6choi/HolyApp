"use client";

import { useState } from "react";
import Link from "next/link";

export default function AlarmSettings() {
    const [alarmTime, setAlarmTime] = useState("07:00");
    const [selectedContent, setSelectedContent] = useState<string | null>(null);
    const [contentType, setContentType] = useState<"sermon" | "praise">("sermon");
    const [isAlarmActive, setIsAlarmActive] = useState(false);

    return (
        <div className="container fade-in" style={{ padding: '80px 24px' }}>
            <header style={{ marginBottom: '60px' }}>
                <Link href="/" style={{
                    color: 'var(--primary)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '24px',
                    letterSpacing: '0.05em'
                }}>
                    ← BACK TO HOME
                </Link>
                <h2 style={{ fontSize: '3.5rem', marginBottom: '16px' }}>
                    ⏰ <span className="text-gradient">Alarm Settings</span>
                </h2>
                <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px' }}>
                    매일 아침 은혜로운 말씀과 찬양으로 하루를 시작하세요.
                    원하는 시간과 콘텐츠를 설정하면 알람이 울립니다.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
                {/* 알람 설정 부분 */}
                <section className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <label style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--primary)', letterSpacing: '0.1em' }}>
                            SET ALARM TIME
                        </label>
                        <input
                            type="time"
                            value={alarmTime}
                            onChange={(e) => setAlarmTime(e.target.value)}
                            style={{
                                fontSize: '4rem',
                                fontWeight: 800,
                                border: 'none',
                                backgroundColor: 'transparent',
                                color: 'var(--primary)',
                                textAlign: 'center',
                                outline: 'none',
                                letterSpacing: '-0.05em'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <label style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--primary)', letterSpacing: '0.1em' }}>
                            CHOOSE CONTENT TYPE
                        </label>
                        <div style={{
                            display: 'flex',
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            padding: '6px',
                            borderRadius: '16px'
                        }}>
                            <button
                                onClick={() => setContentType("sermon")}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    borderRadius: '12px',
                                    backgroundColor: contentType === "sermon" ? 'white' : "transparent",
                                    color: 'var(--foreground)',
                                    fontWeight: 700,
                                    boxShadow: contentType === "sermon" ? 'var(--shadow-sm)' : 'none'
                                }}
                            >
                                SERMON
                            </button>
                            <button
                                onClick={() => setContentType("praise")}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    borderRadius: '12px',
                                    backgroundColor: contentType === "praise" ? 'white' : "transparent",
                                    color: 'var(--foreground)',
                                    fontWeight: 700,
                                    boxShadow: contentType === "praise" ? 'var(--shadow-sm)' : 'none'
                                }}
                            >
                                PRAISE
                            </button>
                        </div>
                    </div>

                    <button
                        className="btn-primary"
                        onClick={() => setIsAlarmActive(!isAlarmActive)}
                        style={{
                            marginTop: '10px',
                            backgroundColor: isAlarmActive ? 'var(--accent)' : 'var(--primary)',
                            background: isAlarmActive ? 'linear-gradient(135deg, #FF4D00, #FFAD00)' : 'var(--primary)'
                        }}
                    >
                        {isAlarmActive ? "DEACTIVATE ALARM" : "ACTIVATE ALARM"}
                    </button>
                </section>

                {/* 선택된 콘텐츠 프리뷰 */}
                <section className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <label style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--primary)', letterSpacing: '0.1em' }}>
                        SELECTED CONTENT
                    </label>

                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        gap: '20px',
                        border: '2px dashed var(--border)',
                        borderRadius: '24px',
                        padding: '40px'
                    }}>
                        {selectedContent ? (
                            <>
                                <div style={{ fontSize: '3rem' }}>{contentType === "sermon" ? "📖" : "🎵"}</div>
                                <h4 style={{ fontSize: '1.5rem' }}>{selectedContent}</h4>
                                <button
                                    onClick={() => setSelectedContent(null)}
                                    style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.9rem' }}
                                >
                                    CHANGE CONTENT
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-muted">재생할 콘텐츠를 <br />검색해서 선택해 주세요.</p>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <a href={`/search/${contentType}`} className="btn-primary" style={{ padding: '12px 24px', fontSize: '0.8rem' }}>
                                        SEARCH {contentType.toUpperCase()}
                                    </a>
                                </div>
                            </>
                        )}
                    </div>

                    <div style={{ padding: '20px', backgroundColor: 'rgba(45, 91, 255, 0.05)', borderRadius: '16px' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>
                            💡 Hint:
                        </p>
                        <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                            웹 브라우저 정책상 탭이 활성화되어 있어야 음악이 자동으로 재생될 수 있습니다.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
