"use client";

import { useState, useEffect } from "react";

export default function InAppBrowserWarning() {
    const [showWarning, setShowWarning] = useState(false);
    const [browserName, setBrowserName] = useState("");
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        const userAgent = window.navigator.userAgent.toLowerCase();

        // iOS/Android 감지
        const ios = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(ios);

        // 인앱 브라우저 감지
        const isKakao = /kakaotalk/i.test(userAgent);
        const isNaver = /naver/i.test(userAgent) || /line/i.test(userAgent);
        const isFacebook = /fbav|fbios|fb_iab/i.test(userAgent);
        const isInstagram = /instagram/i.test(userAgent);
        const isInAppBrowser = /inapp|webview/i.test(userAgent);

        let detected = false;
        let name = "";

        if (isKakao) {
            detected = true;
            name = "카카오톡";
        } else if (isNaver) {
            detected = true;
            name = "네이버";
        } else if (isFacebook) {
            detected = true;
            name = "페이스북";
        } else if (isInstagram) {
            detected = true;
            name = "인스타그램";
        } else if (isInAppBrowser) {
            detected = true;
            name = "앱 내부";
        }

        if (detected) {
            setBrowserName(name);
            setShowWarning(true);
            console.log(`[InAppBrowserWarning] ${name} 인앱 브라우저 감지됨 (${ios ? 'iOS' : 'Android'})`);
        }
    }, []);

    const handleClose = () => {
        setShowWarning(false);
    };

    if (!showWarning) {
        return null;
    }

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.95)",
                zIndex: 99999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
            }}
        >
            <div
                style={{
                    maxWidth: "500px",
                    width: "100%",
                    backgroundColor: "white",
                    borderRadius: "24px",
                    padding: "40px 30px",
                    textAlign: "center",
                    position: "relative",
                }}
            >
                {/* 닫기 버튼 */}
                <button
                    onClick={handleClose}
                    style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                        color: "#666",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    ✕
                </button>

                {/* 아이콘 */}
                <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🌐</div>

                {/* 제목 */}
                <h2
                    style={{
                        fontSize: "1.8rem",
                        fontWeight: 800,
                        marginBottom: "16px",
                        color: "#10B981",
                    }}
                >
                    {isIOS ? "Safari로 열어주세요" : "Chrome으로 열어주세요"}
                </h2>

                {/* 설명 */}
                <p
                    style={{
                        fontSize: "1.1rem",
                        lineHeight: "1.7",
                        color: "#666",
                        marginBottom: "30px",
                    }}
                >
                    현재 <strong style={{ color: "#000" }}>{browserName} 브라우저</strong>에서는<br />
                    앱 설치가 지원되지 않습니다.
                </p>

                {/* 안내 박스 */}
                <div
                    style={{
                        backgroundColor: "#F0FDF4",
                        border: "2px solid #10B981",
                        borderRadius: "16px",
                        padding: "24px 20px",
                        marginBottom: "30px",
                    }}
                >
                    <div
                        style={{
                            fontSize: "0.9rem",
                            fontWeight: 800,
                            color: "#10B981",
                            marginBottom: "12px",
                            letterSpacing: "0.05em",
                        }}
                    >
                        📱 설치 방법
                    </div>

                    <ol
                        style={{
                            textAlign: "left",
                            paddingLeft: "20px",
                            lineHeight: "2",
                            fontSize: "0.95rem",
                            color: "#333",
                            margin: 0,
                        }}
                    >
                        <li>
                            화면 <strong>우측 하단</strong>의 <strong style={{ fontSize: "1.2rem" }}>⋮</strong> (점 3개) 클릭
                        </li>
                        <li>
                            <strong>"다른 브라우저로 열기"</strong> 선택
                        </li>
                        <li>
                            <strong>{isIOS ? "Safari" : "Chrome"}</strong> 선택
                        </li>
                        <li>자동으로 설치 안내가 표시됩니다!</li>
                    </ol>
                </div>

                {/* 대체 방법 */}
                <div
                    style={{
                        padding: "20px",
                        backgroundColor: "rgba(139, 92, 246, 0.05)",
                        borderRadius: "12px",
                        marginBottom: "20px",
                    }}
                >
                    <div
                        style={{
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            color: "#8B5CF6",
                            marginBottom: "8px",
                        }}
                    >
                        또는
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#666", lineHeight: "1.6" }}>
                        {isIOS ? "Safari 앱" : "Chrome 앱"}을 직접 열고<br />
                        <code
                            style={{
                                backgroundColor: "rgba(0, 0, 0, 0.05)",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                fontSize: "0.85rem",
                                color: "#10B981",
                                fontWeight: 700,
                            }}
                        >
                            holyseeds-app.vercel.app
                        </code>
                        <br />
                        를 입력하세요
                    </div>
                </div>

                {/* 닫기 버튼 */}
                <button
                    onClick={handleClose}
                    style={{
                        width: "100%",
                        padding: "16px",
                        backgroundColor: "#F3F4F6",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "#666",
                        cursor: "pointer",
                    }}
                >
                    나중에 하기
                </button>
            </div>
        </div>
    );
}
