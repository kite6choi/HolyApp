"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";

export default function PraiseSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const [mediaType, setMediaType] = useState<"video" | "audio">("video");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPraises = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from("praises")
                .select("*")
                .order("title", { ascending: true });

            if (searchTerm) {
                // 제목 또는 가사에서 검색 (OR 조건)
                query = query.or(`title.ilike.%${searchTerm}%,lyrics.ilike.%${searchTerm}%`);
            }

            const { data, error } = await query;
            if (error) throw error;
            setResults(data || []);
        } catch (error: any) {
            console.error("Error fetching praises:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPraises();
    }, []);

    return (
        <div className="container fade-in" style={{ padding: '80px 24px' }}>
            <header style={{ marginBottom: '60px' }}>
                <a href="/" style={{
                    color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem',
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    marginBottom: '24px', letterSpacing: '0.05em'
                }}>
                    ← BACK TO HOME
                </a>
                <h2 style={{ fontSize: '3.5rem', marginBottom: '16px' }}>
                    🎵 <span className="text-gradient">Praise Search</span>
                </h2>
                <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px' }}>
                    찾으시는 찬양의 제목이나 첫 가사를 입력해 주세요.
                    마음을 여는 아름다운 찬양이 당신을 기다립니다.
                </p>
            </header>

            <section className="glass-card" style={{ marginBottom: '50px' }}>
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '32px', alignItems: 'end'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--primary)', letterSpacing: '0.1em' }}>TITLE OR LYRICS</label>
                        <input
                            type="text" placeholder="찬양 제목 또는 첫 가사 입력..."
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchPraises()}
                            style={{
                                padding: '18px', borderRadius: '16px', border: '1px solid var(--border)',
                                backgroundColor: 'rgba(255, 255, 255, 0.5)', fontSize: '1.1rem', outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--primary)', letterSpacing: '0.1em' }}>MEDIA FORMAT</label>
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

                    <button className="btn-primary" style={{ padding: '18px' }} onClick={fetchPraises} disabled={loading}>
                        {loading ? "SEARCHING..." : "SEARCH NOW"}
                    </button>
                </div>
            </section>

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
                                    backgroundColor: 'rgba(0, 209, 255, 0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                                }}>
                                    {mediaType === "video" ? "🎬" : "🎧"}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{item.title}</h4>
                                    <p className="text-muted" style={{ fontSize: '0.95rem' }}>"{item.lyrics}"</p>
                                </div>
                            </div>
                            <a
                                href={mediaType === "video" ? item.video_url : item.audio_url}
                                target="_blank" rel="noopener noreferrer"
                                style={{
                                    color: 'var(--primary)', fontWeight: 800, padding: '10px 20px',
                                    border: '2px solid var(--primary)', borderRadius: '12px', fontSize: '0.85rem'
                                }}>
                                PLAY {mediaType.toUpperCase()}
                            </a>
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
