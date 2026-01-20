"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface AlarmContent {
    id: number;
    title: string;
    type: "sermon" | "praise";
    video_url?: string;
    audio_url?: string;
}

export default function AlarmPlay() {
    const [content, setContent] = useState<AlarmContent | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const contentData = params.get("content");
        if (contentData) {
            const parsedContent = JSON.parse(decodeURIComponent(contentData));
            setContent(parsedContent);
        }
    }, []);

    if (!content) {
        return (
            <div className="container fade-in" style={{ padding: '100px 28px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>로딩 중...</h2>
            </div>
        );
    }

    return (
        <div className="container fade-in" style={{ padding: '80px 24px' }}>
            <header style={{ marginBottom: '60px', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⏰</div>
                <h2 style={{ fontSize: '3rem', marginBottom: '16px' }}>
                    <span className="text-gradient">알람 재생</span>
                </h2>
                <p className="text-muted" style={{ fontSize: '1.2rem' }}>
                    {content.type === "sermon" ? "설교" : "찬양"}: {content.title}
                </p>
            </header>

            <section className="glass-card" style={{ marginBottom: '40px' }}>
                {content.video_url ? (
                    <video
                        controls
                        autoPlay
                        style={{
                            width: '100%',
                            borderRadius: '16px',
                            backgroundColor: '#000',
                            marginBottom: '20px'
                        }}
                    >
                        <source src={content.video_url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : content.audio_url ? (
                    <div style={{ padding: '60px 40px', textAlign: 'center' }}>
                        <div style={{ fontSize: '5rem', marginBottom: '30px' }}>
                            {content.type === "sermon" ? "📖" : "🎵"}
                        </div>
                        <h3 style={{ fontSize: '2rem', marginBottom: '40px' }}>{content.title}</h3>
                        <audio
                            controls
                            autoPlay
                            style={{
                                width: '100%',
                                maxWidth: '600px',
                                borderRadius: '16px'
                            }}
                        >
                            <source src={content.audio_url} type="audio/mpeg" />
                            Your browser does not support the audio tag.
                        </audio>
                    </div>
                ) : (
                    <div style={{
                        padding: '60px',
                        textAlign: 'center',
                        backgroundColor: 'rgba(239, 68, 68, 0.05)',
                        borderRadius: '16px',
                        color: '#dc2626'
                    }}>
                        재생 가능한 미디어가 없습니다.
                    </div>
                )}
            </section>

            <div style={{ textAlign: 'center', display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <Link href="/alarm" className="btn-primary" style={{ padding: '16px 32px' }}>
                    ← BACK TO ALARM
                </Link>
                <Link href="/" className="btn-primary" style={{ padding: '16px 32px', backgroundColor: 'var(--secondary)' }}>
                    HOME
                </Link>
            </div>
        </div>
    );
}
