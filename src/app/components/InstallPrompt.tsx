"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // iOS 감지
        const userAgent = window.navigator.userAgent.toLowerCase();
        const ios = /iphone|ipad|ipod/.test(userAgent);
        const android = /android/.test(userAgent);
        setIsIOS(ios);

        console.log("[InstallPrompt] Device detected:", { ios, android, userAgent });

        // 인앱 브라우저 감지
        const isInAppBrowser = /kakaotalk|naver|line|fbav|fbios|fb_iab|instagram|inapp|webview/i.test(userAgent);
        if (isInAppBrowser) {
            console.log("[InstallPrompt] In-app browser detected, hiding install banner");
            return;
        }

        // 이미 설치되었는지 확인
        const standalone = window.matchMedia("(display-mode: standalone)").matches;
        const isInStandaloneMode = standalone || (window.navigator as any).standalone;
        setIsStandalone(isInStandaloneMode);

        console.log("[InstallPrompt] Standalone mode:", isInStandaloneMode);

        // 이미 설치된 경우 배너 표시 안 함
        if (isInStandaloneMode) {
            console.log("[InstallPrompt] Already in standalone mode, hiding banner");
            return;
        }

        // 이전에 배너를 닫았는지 확인
        const dismissed = localStorage.getItem("install-prompt-dismissed");
        console.log("[InstallPrompt] Previously dismissed:", dismissed);

        // 테스트를 위해 주석 처리 - 나중에 활성화
        // if (dismissed) {
        //     return;
        // }

        // beforeinstallprompt 이벤트 리스너 (Android/Chrome)
        const handleBeforeInstallPrompt = (e: Event) => {
            console.log("[InstallPrompt] beforeinstallprompt event fired!");
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowBanner(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        // 모바일 기기라면 무조건 배너 표시 (테스트용)
        const isMobile = ios || android || window.innerWidth < 768;
        if (isMobile && !isInStandaloneMode && !dismissed) {
            console.log("[InstallPrompt] Mobile detected, showing banner");
            setTimeout(() => {
                setShowBanner(true);
            }, 1000); // 1초 후 표시
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            // iOS인 경우 설치 안내만 표시
            return;
        }

        // 설치 프롬프트 표시
        deferredPrompt.prompt();

        // 사용자 선택 대기
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response: ${outcome}`);

        // 프롬프트 초기화
        setDeferredPrompt(null);
        setShowBanner(false);
    };

    const handleDismiss = () => {
        setShowBanner(false);
        localStorage.setItem("install-prompt-dismissed", "true");
    };

    if (!showBanner || isStandalone) {
        return null;
    }

    return (
        <div
            style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "var(--card-bg)",
                backdropFilter: "var(--glass-blur)",
                WebkitBackdropFilter: "var(--glass-blur)",
                borderTop: "2px solid var(--primary)",
                padding: "20px",
                zIndex: 9999,
                boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)",
                animation: "slideUp 0.3s ease-out",
            }}
        >
            <style jsx>{`
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }
            `}</style>

            <div className="container" style={{ maxWidth: "600px", margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div style={{ fontSize: "2.5rem" }}>📱</div>

                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: "1.2rem", marginBottom: "8px", fontWeight: 800 }}>
                            앱으로 설치하기
                        </h3>
                        {isIOS ? (
                            <p className="text-muted" style={{ fontSize: "0.85rem", lineHeight: "1.5" }}>
                                Safari에서 하단 <strong>공유 버튼(□↑)</strong>을 누르고<br />
                                <strong>"홈 화면에 추가"</strong>를 선택하세요.
                            </p>
                        ) : (
                            <p className="text-muted" style={{ fontSize: "0.85rem", lineHeight: "1.5" }}>
                                홈 화면에 추가하고 앱처럼 사용하세요!<br />
                                더 빠르고 편리한 경험을 제공합니다.
                            </p>
                        )}
                    </div>

                    <div style={{ display: "flex", gap: "12px", flexDirection: "column", minWidth: "100px" }}>
                        {!isIOS && deferredPrompt && (
                            <button
                                onClick={handleInstallClick}
                                className="btn-primary"
                                style={{
                                    padding: "12px 24px",
                                    fontSize: "0.9rem",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                설치하기
                            </button>
                        )}
                        <button
                            onClick={handleDismiss}
                            style={{
                                padding: "8px 16px",
                                fontSize: "0.8rem",
                                background: "none",
                                border: "1px solid var(--border)",
                                borderRadius: "12px",
                                color: "var(--text-muted)",
                                cursor: "pointer",
                            }}
                        >
                            나중에
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
