"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function AdminUpload() {
    const [type, setType] = useState<"sermon" | "praise">("sermon");
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [lyrics, setLyrics] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [message, setMessage] = useState("");

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setUploadProgress(0);

        try {
            let videoUrl = "";
            let audioUrl = "";

            // 1. 비디오 파일이 있다면 Storage에 업로드
            if (videoFile) {
                // 파일 검증
                if (!videoFile.type.includes('video/mp4')) {
                    throw new Error('MP4 파일만 업로드 가능합니다.');
                }
                if (videoFile.size > 50 * 1024 * 1024) {
                    throw new Error('비디오 파일은 50MB 이하여야 합니다.');
                }

                const fileExt = videoFile.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
                const filePath = `${type}/${fileName}`;

                setUploadProgress(25);

                const { error: uploadError } = await supabase.storage
                    .from('videos')
                    .upload(filePath, videoFile);

                if (uploadError) throw uploadError;

                setUploadProgress(50);

                // 공개 URL 가져오기
                const { data: { publicUrl } } = supabase.storage
                    .from('videos')
                    .getPublicUrl(filePath);

                videoUrl = publicUrl;
            }

            // 2. 오디오 파일이 있다면 Storage에 업로드
            if (audioFile) {
                // 파일 검증
                if (!audioFile.type.includes('audio/mpeg') && !audioFile.type.includes('audio/mp3')) {
                    throw new Error('MP3 파일만 업로드 가능합니다.');
                }
                if (audioFile.size > 50 * 1024 * 1024) {
                    throw new Error('오디오 파일은 50MB 이하여야 합니다.');
                }

                const fileExt = audioFile.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
                const filePath = `${type}/${fileName}`;

                setUploadProgress(75);

                const { error: uploadError } = await supabase.storage
                    .from('audio')
                    .upload(filePath, audioFile);

                if (uploadError) throw uploadError;

                // 공개 URL 가져오기
                const { data: { publicUrl } } = supabase.storage
                    .from('audio')
                    .getPublicUrl(filePath);

                audioUrl = publicUrl;
            }

            setUploadProgress(90);

            // 3. 데이터베이스에 정보 저장
            const insertData: {
                title: string;
                video_url: string;
                audio_url: string;
                date?: string;
                lyrics?: string;
            } = {
                title,
                video_url: videoUrl,
                audio_url: audioUrl,
            };

            if (type === "sermon") {
                insertData.date = date;
            } else {
                insertData.lyrics = lyrics;
            }

            const { error } = await supabase
                .from(type === "sermon" ? "sermons" : "praises")
                .insert([insertData]);

            if (error) throw error;

            setUploadProgress(100);
            setMessage("✅ 성공적으로 업로드되었습니다!");

            // 폼 초기화
            setTitle("");
            setVideoFile(null);
            setAudioFile(null);
            setLyrics("");
            setDate("");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            setMessage(`❌ 오류 발생: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container fade-in" style={{ padding: '80px 24px' }}>
            <header style={{ marginBottom: '60px' }}>
                <a href="/admin" style={{ color: 'var(--primary)', fontWeight: 700, display: 'block', marginBottom: '10px' }}>← BACK TO DASHBOARD</a>
                <h2 style={{ fontSize: '3rem', marginBottom: '16px' }}>
                    🛠️ <span className="text-gradient">Admin Center</span>
                </h2>
                <p className="text-muted">콘텐츠 업로드 및 데이터베이스 관리 페이지입니다.</p>
            </header>

            <section className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <button
                            type="button"
                            onClick={() => setType("sermon")}
                            style={{
                                flex: 1, padding: '15px', borderRadius: '12px',
                                backgroundColor: type === "sermon" ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
                                color: type === "sermon" ? 'white' : 'var(--foreground)',
                                fontWeight: 700
                            }}
                        >
                            SERMON (설교)
                        </button>
                        <button
                            type="button"
                            onClick={() => setType("praise")}
                            style={{
                                flex: 1, padding: '15px', borderRadius: '12px',
                                backgroundColor: type === "praise" ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
                                color: type === "praise" ? 'white' : 'var(--foreground)',
                                fontWeight: 700
                            }}
                        >
                            PRAISE (찬양)
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--primary)', letterSpacing: '0.1em' }}>TITLE (제목)</label>
                        <input
                            required type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                            placeholder="제목을 입력하세요..."
                            style={{ padding: '15px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--background)' }}
                        />
                    </div>

                    {type === "sermon" && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--primary)', letterSpacing: '0.1em' }}>DATE (날짜)</label>
                            <input
                                required type="date" value={date} onChange={(e) => setDate(e.target.value)}
                                style={{ padding: '15px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--background)' }}
                            />
                        </div>
                    )}

                    {type === "praise" && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--primary)', letterSpacing: '0.1em' }}>LYRICS (첫 가사)</label>
                            <textarea
                                value={lyrics} onChange={(e) => setLyrics(e.target.value)}
                                placeholder="첫 시작 가사를 입력하세요..."
                                style={{ padding: '15px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--background)', minHeight: '100px' }}
                            />
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--primary)', letterSpacing: '0.1em' }}>VIDEO FILE (비디오 파일 - MP4)</label>
                        <input
                            type="file" accept="video/mp4"
                            onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)}
                            style={{ padding: '15px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--background)' }}
                        />
                        {videoFile && (
                            <p style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>
                                📹 {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                        )}
                        <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>* MP4 형식, 최대 50MB</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--primary)', letterSpacing: '0.1em' }}>AUDIO FILE (오디오 파일 - MP3)</label>
                        <input
                            type="file" accept="audio/mp3,audio/mpeg"
                            onChange={(e) => setAudioFile(e.target.files ? e.target.files[0] : null)}
                            style={{ padding: '15px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--background)' }}
                        />
                        {audioFile && (
                            <p style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>
                                🎵 {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                        )}
                        <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>* MP3 형식, 최대 50MB</p>
                    </div>

                    {loading && uploadProgress > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{
                                width: '100%',
                                height: '8px',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                borderRadius: '4px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${uploadProgress}%`,
                                    height: '100%',
                                    backgroundColor: 'var(--primary)',
                                    transition: 'width 0.3s ease'
                                }} />
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--primary)', textAlign: 'center' }}>
                                업로드 중... {uploadProgress}%
                            </p>
                        </div>
                    )}

                    {message && (
                        <div style={{
                            padding: '15px', borderRadius: '10px',
                            backgroundColor: message.startsWith('✅') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: message.startsWith('✅') ? '#059669' : '#dc2626',
                            fontWeight: 600, textAlign: 'center'
                        }}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit" disabled={loading}
                        className="btn-primary"
                        style={{ padding: '20px', fontSize: '1.1rem', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? "UPLOADING..." : "UPLOAD NOW"}
                    </button>
                </form>
            </section>
        </div>
    );
}
