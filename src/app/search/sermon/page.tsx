"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";

export default function SermonSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [mediaType, setMediaType] = useState<"video" | "audio">("video");
    const [results, setResults] = useState<Array<{
        id: number;
        title: string;
        date: string;
        video_url: string;
        audio_url: string;
    }>>([]);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{
        id: number;
        title: string;
        date: string;
        video_url: string;
        audio_url: string;
    } | null>(null);

    const fetchSermons = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from("sermons")
                .select("*")
                .order("date", { ascending: false });

            if (searchTerm) {
                query = query.ilike("title", `%${searchTerm}%`);
            }
            if (searchDate) {
                query = query.eq("date", searchDate);
            }

            const { data, error } = await query;
            if (error) throw error;
            setResults(data || []);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            console.error("Error fetching sermons:", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSermons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchDate]);

    return (
        <div className="container fade-in" style={{ padding: '80px 24px' }}>
            <header style={{ marginBottom: '60px' }}>
                <Link href="/" style={{
                    color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem',
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    marginBottom: '24px', letterSpacing: '0.05em'
                }}>
                    ← BACK TO HOME
                </Link>
                <h2 style={{ fontSize: '3.5rem', marginBottom: '16px' }}>
                    📖 <span className="text-gradient">Sermon Archive</span>
                </h2>
                <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px' }}>
                    홀리씨즈교회의 영성 깊은 설교 말씀을 찾아보세요.
                    날짜와 제목으로 쉽고 빠르게 검색할 수 있습니다.
                </p>
            </header>

            <section className="glass-card" style={{ marginBottom: '50px' }}>
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '32px', alignItems: 'end'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--primary)', letterSpacing: '0.1em' }}>SERMON TITLE</label>
                        <input
                            type="text" placeholder="설교 제목 입력..."
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchSermons()}
                            style={{
                                padding: '18px', borderRadius: '16px', border: '1px solid var(--border)',
                                backgroundColor: 'rgba(255, 255, 255, 0.5)', fontSize: '1.1rem', outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--primary)', letterSpacing: '0.1em' }}>DATE FILTER</label>
                        <input
                            type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)}
                            style={{
                                padding: '18px', borderRadius: '16px', border: '1px solid var(--border)',
                                backgroundColor: 'rgba(255, 255, 255, 0.5)', fontSize: '1.1rem', outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--primary)', letterSpacing: '0.1em' }}>FORMAT</label>
                        <div style={{
                            display: 'flex', backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            padding: '6px', borderRadius: '16px', border: '1px solid var(--border)'
                        }}>
                            <button
                                onClick={() => setMediaType("video")}
                                style={{
                                    flex: 1, padding: '14px', borderRadius: '12px',
                                    backgroundColor: mediaType === "video" ? 'var(--primary)' : "transparent",
                                    color: mediaType === "video" ? "white" : "var(--foreground)",
                                    fontWeight: 700
                                }}
                            >VIDEO</button>
                            <button
                                onClick={() => setMediaType("audio")}
                                style={{
                                    flex: 1, padding: '14px', borderRadius: '12px',
                                    backgroundColor: mediaType === "audio" ? 'var(--primary)' : "transparent",
                                    color: mediaType === "audio" ? "white" : "var(--foreground)",
                                    fontWeight: 700
                                }}
                            >AUDIO</button>
                        </div>
                    </div>

                    <button className="btn-primary" style={{ padding: '18px' }} onClick={fetchSermons} disabled={loading}>
                        {loading ? "SEARCHING..." : "SEARCH"}
                    </button>
                </div>
            </section>

            {selectedItem && (
                <section className="glass-card" style={{ marginBottom: '50px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{selectedItem.title}</h3>
                            <p className="text-muted">{selectedItem.date}</p>
                        </div>
                        <button
                            onClick={() => setSelectedItem(null)}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '12px',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                color: '#dc2626',
                                fontWeight: 700,
                                fontSize: '0.85rem'
                            }}
                        >
                            CLOSE
                        </button>
                    </div>
                    {mediaType === "video" && selectedItem.video_url ? (
                        <video
                            key={selectedItem.id}
                            controls
                            autoPlay
                            style={{
                                width: '100%',
                                borderRadius: '16px',
                                backgroundColor: '#000'
                            }}
                        >
                            <source src={selectedItem.video_url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : mediaType === "audio" && selectedItem.audio_url ? (
                        <audio
                            key={selectedItem.id}
                            controls
                            autoPlay
                            style={{
                                width: '100%',
                                borderRadius: '16px'
                            }}
                        >
                            <source src={selectedItem.audio_url} type="audio/mpeg" />
                            Your browser does not support the audio tag.
                        </audio>
                    ) : (
                        <div style={{
                            padding: '60px',
                            textAlign: 'center',
                            backgroundColor: 'rgba(239, 68, 68, 0.05)',
                            borderRadius: '16px',
                            color: '#dc2626'
                        }}>
                            {mediaType === "video" ? "비디오" : "오디오"} 파일이 없습니다.
                        </div>
                    )}
                </section>
            )}

            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '1.8rem' }}>Results</h3>
                    <span className="text-muted" style={{ fontWeight: 600 }}>Total {results.length} items</span>
                </div>

                <div style={{ display: 'grid', gap: '20px' }}>
                    {results.length > 0 ? results.map((item) => (
                        <div key={item.id} className="glass-card" style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                <div style={{
                                    width: '50px', height: '50px', borderRadius: '12px',
                                    backgroundColor: 'rgba(45, 91, 255, 0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                                }}>
                                    {mediaType === "video" ? "🎬" : "🎧"}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{item.title}</h4>
                                    <p className="text-muted" style={{ fontSize: '0.95rem' }}>{item.date}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setSelectedItem(item)}
                                    style={{
                                        fontWeight: 800, padding: '10px 20px',
                                        border: '2px solid var(--primary)', borderRadius: '12px', fontSize: '0.85rem',
                                        backgroundColor: selectedItem?.id === item.id ? 'var(--primary)' : 'transparent',
                                        color: selectedItem?.id === item.id ? 'white' : 'var(--primary)'
                                    }}>
                                    {selectedItem?.id === item.id ? '▶ PLAYING' : 'PLAY'} {mediaType.toUpperCase()}
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '100px', opacity: 0.5 }}>
                            검색 결과가 없습니다.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
