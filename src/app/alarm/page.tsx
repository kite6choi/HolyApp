"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

interface AlarmSettings {
    alarmTime: string;
    selectedContent: {
        id: number;
        title: string;
        type: "sermon" | "praise";
        video_url?: string;
        audio_url?: string;
    } | null;
    isAlarmActive: boolean;
}

export default function AlarmSettings() {
    const [alarmTime, setAlarmTime] = useState("07:00");
    const [selectedContent, setSelectedContent] = useState<AlarmSettings["selectedContent"]>(null);
    const [contentType, setContentType] = useState<"sermon" | "praise">("sermon");
    const [isAlarmActive, setIsAlarmActive] = useState(false);
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");

    // localStorage에서 알람 설정 불러오기
    useEffect(() => {
        const savedSettings = localStorage.getItem("alarmSettings");
        if (savedSettings) {
            const settings: AlarmSettings = JSON.parse(savedSettings);
            setAlarmTime(settings.alarmTime);
            setSelectedContent(settings.selectedContent);
            if (settings.selectedContent) {
                setContentType(settings.selectedContent.type);
            }
            setIsAlarmActive(settings.isAlarmActive);
        }

        // URL 파라미터로 콘텐츠 추가 확인
        const params = new URLSearchParams(window.location.search);
        const contentData = params.get("content");
        if (contentData) {
            const content = JSON.parse(decodeURIComponent(contentData));
            setSelectedContent(content);
            setContentType(content.type);
            // URL 파라미터 제거
            window.history.replaceState({}, "", "/alarm");
        }

        // 알림 권한 확인
        if ("Notification" in window) {
            setNotificationPermission(Notification.permission);
        }
    }, []);

    // 알람 설정 변경 시 localStorage에 저장
    useEffect(() => {
        const settings: AlarmSettings = {
            alarmTime,
            selectedContent,
            isAlarmActive,
        };
        localStorage.setItem("alarmSettings", JSON.stringify(settings));
    }, [alarmTime, selectedContent, isAlarmActive]);

    const requestNotificationPermission = useCallback(async () => {
        if ("Notification" in window && Notification.permission === "default") {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);
            return permission;
        }
        return Notification.permission;
    }, []);

    const triggerAlarm = useCallback(async () => {
        console.log("[알람] 알람이 울립니다!", selectedContent?.title);

        // 알림 권한 요청
        const permission = await requestNotificationPermission();

        if (permission === "granted" && selectedContent) {
            // 브라우저 알림 표시
            const notification = new Notification("홀리씨즈 알람", {
                body: `${selectedContent.type === "sermon" ? "설교" : "찬양"}: ${selectedContent.title}`,
                icon: "/app-icon.png",
                badge: "/app-icon.png",
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            // 콘텐츠 재생 페이지로 이동
            const url = selectedContent.video_url || selectedContent.audio_url;
            if (url) {
                // 새 창에서 재생
                window.open(`/alarm/play?content=${encodeURIComponent(JSON.stringify(selectedContent))}`, "_blank");
            }
        } else {
            console.warn("[알람] 알림 권한이 없습니다:", permission);
        }

        // 알람 자동 비활성화 (다음날 다시 울리게 하려면 이 부분 제거)
        // setIsAlarmActive(false);
    }, [selectedContent, requestNotificationPermission]);

    // 알람 체크 타이머
    useEffect(() => {
        if (!isAlarmActive || !selectedContent) {
            console.log("[알람] 비활성화 상태 - 알람 체크 안 함");
            return;
        }

        console.log(`[알람] 활성화됨 - ${alarmTime}에 "${selectedContent.title}" 재생 예정`);

        const checkAlarm = () => {
            const now = new Date();
            const [hours, minutes] = alarmTime.split(":");
            const alarmHour = parseInt(hours);
            const alarmMinute = parseInt(minutes);

            const currentTime = `${now.getHours()}:${now.getMinutes()}`;
            const targetTime = `${alarmHour}:${alarmMinute}`;

            // 현재 시간과 알람 시간이 같은지 체크 (1분 단위)
            if (
                now.getHours() === alarmHour &&
                now.getMinutes() === alarmMinute &&
                now.getSeconds() < 10 // 10초 이내에만 알람 울림
            ) {
                console.log(`[알람] 시간 일치! ${currentTime} === ${targetTime}`);
                triggerAlarm();
            }
        };

        const interval = setInterval(checkAlarm, 1000);
        return () => {
            console.log("[알람] 타이머 정리");
            clearInterval(interval);
        };
    }, [isAlarmActive, alarmTime, selectedContent, triggerAlarm]);

    const handleActivateAlarm = useCallback(async () => {
        if (!isAlarmActive && selectedContent) {
            // 알람 활성화 시 알림 권한 요청
            const permission = await requestNotificationPermission();
            if (permission === "granted") {
                console.log("[알람] 알림 권한 허용됨");
            } else {
                console.warn("[알람] 알림 권한 거부됨:", permission);
            }
        }
        setIsAlarmActive(!isAlarmActive);
        console.log("[알람] 알람 상태 전환:", !isAlarmActive ? "활성화" : "비활성화");
    }, [isAlarmActive, selectedContent, requestNotificationPermission]);

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
                    시간을 설정하고 오늘의 콘텐츠를 선택하면 알람이 울립니다.
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

                    {notificationPermission === "denied" && (
                        <div style={{ padding: '16px', backgroundColor: 'rgba(255, 77, 0, 0.1)', borderRadius: '12px', marginTop: '10px' }}>
                            <p style={{ fontSize: '0.85rem', color: '#FF4D00', fontWeight: 700 }}>
                                ⚠️ 알림 권한이 차단되었습니다.
                            </p>
                            <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                                브라우저 설정에서 알림 권한을 허용해 주세요.
                            </p>
                        </div>
                    )}

                    <button
                        className="btn-primary"
                        onClick={handleActivateAlarm}
                        disabled={!selectedContent}
                        style={{
                            marginTop: '10px',
                            backgroundColor: isAlarmActive ? 'var(--accent)' : 'var(--primary)',
                            background: isAlarmActive ? 'linear-gradient(135deg, #FF4D00, #FFAD00)' : 'var(--primary)',
                            opacity: !selectedContent ? 0.5 : 1,
                            cursor: !selectedContent ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isAlarmActive ? "DEACTIVATE ALARM" : "ACTIVATE ALARM"}
                    </button>

                    {isAlarmActive && selectedContent && (
                        <div style={{ padding: '16px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', marginTop: '10px' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>
                                ✅ 알람이 활성화되었습니다!
                            </p>
                            <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                                {alarmTime}에 "{selectedContent.title}"이(가) 재생됩니다.
                            </p>
                        </div>
                    )}
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
                                <div style={{ fontSize: '3rem' }}>{selectedContent.type === "sermon" ? "📖" : "🎵"}</div>
                                <h4 style={{ fontSize: '1.5rem' }}>{selectedContent.title}</h4>
                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                                    {selectedContent.type === "sermon" ? "설교" : "찬양"}
                                </p>
                                <button
                                    onClick={() => setSelectedContent(null)}
                                    style={{
                                        color: 'var(--accent)',
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    CHANGE CONTENT
                                </button>
                            </>
                        ) : (
                            <>
                                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>
                                    {contentType === "sermon" ? "📖" : "🎵"}
                                </div>
                                <p className="text-muted">오늘의 {contentType === "sermon" ? "설교" : "찬양"}를<br />자동으로 선택해 드립니다.</p>
                                <button
                                    onClick={async () => {
                                        try {
                                            const { data, error } = await supabase
                                                .from(contentType === "sermon" ? "sermons" : "praises")
                                                .select("*")
                                                .limit(100);

                                            if (error) throw error;

                                            if (data && data.length > 0) {
                                                // 랜덤으로 하나 선택
                                                const randomIndex = Math.floor(Math.random() * data.length);
                                                const randomItem = data[randomIndex];

                                                setSelectedContent({
                                                    id: randomItem.id,
                                                    title: randomItem.title,
                                                    type: contentType,
                                                    video_url: randomItem.video_url,
                                                    audio_url: randomItem.audio_url
                                                });
                                            }
                                        } catch (error) {
                                            console.error("Error fetching random content:", error);
                                            alert("콘텐츠를 불러오는데 실패했습니다.");
                                        }
                                    }}
                                    className="btn-primary"
                                    style={{ padding: '12px 24px', fontSize: '0.85rem' }}
                                >
                                    🎲 오늘의 {contentType === "sermon" ? "설교" : "찬양"} 선택
                                </button>
                            </>
                        )}
                    </div>

                    <div style={{ padding: '20px', backgroundColor: 'rgba(45, 91, 255, 0.05)', borderRadius: '16px' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>
                            💡 알람 작동 방식:
                        </p>
                        <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '8px', lineHeight: '1.6' }}>
                            • 매일 같은 시간에 알람이 울립니다<br />
                            • 브라우저가 열려있어야 알람이 작동합니다<br />
                            • 알림 권한을 허용해 주세요
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
