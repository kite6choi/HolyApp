"use client";

import { useState, useEffect } from "react";

export default function DebugInfo() {
    const [debugInfo, setDebugInfo] = useState<any>({});
    const [show, setShow] = useState(false);

    useEffect(() => {
        // URL에 ?debug=1 이 있으면 디버그 정보 표시
        const params = new URLSearchParams(window.location.search);
        const debugMode = params.get("debug") === "1";
        setShow(debugMode);

        if (debugMode) {
            const userAgent = window.navigator.userAgent.toLowerCase();
            const ios = /iphone|ipad|ipod/.test(userAgent);
            const android = /android/.test(userAgent);
            const standalone = window.matchMedia("(display-mode: standalone)").matches;
            const isInStandaloneMode = standalone || (window.navigator as any).standalone;
            const dismissed = localStorage.getItem("install-prompt-dismissed");
            const isMobile = ios || android || window.innerWidth < 768;

            setDebugInfo({
                userAgent,
                ios,
                android,
                isMobile,
                standalone,
                isInStandaloneMode,
                dismissed,
                screenWidth: window.innerWidth,
                screenHeight: window.innerHeight,
            });
        }
    }, []);

    if (!show) {
        return null;
    }

    return (
        <div
            style={{
                position: "fixed",
                top: "80px",
                left: "10px",
                right: "10px",
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                color: "#00ff00",
                padding: "20px",
                borderRadius: "12px",
                fontSize: "0.8rem",
                fontFamily: "monospace",
                zIndex: 10000,
                maxHeight: "70vh",
                overflow: "auto",
                border: "2px solid #00ff00",
            }}
        >
            <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ color: "#ffff00", fontSize: "1rem" }}>🐛 DEBUG MODE</strong>
                <button
                    onClick={() => setShow(false)}
                    style={{
                        backgroundColor: "#ff0000",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    닫기
                </button>
            </div>

            <div style={{ lineHeight: "1.8" }}>
                <div style={{ marginBottom: "12px", color: "#ffff00" }}>
                    <strong>디바이스 정보:</strong>
                </div>
                <div>iOS: {debugInfo.ios ? "✅ YES" : "❌ NO"}</div>
                <div>Android: {debugInfo.android ? "✅ YES" : "❌ NO"}</div>
                <div>모바일: {debugInfo.isMobile ? "✅ YES" : "❌ NO"}</div>
                <div>화면 크기: {debugInfo.screenWidth} x {debugInfo.screenHeight}</div>

                <div style={{ marginTop: "16px", marginBottom: "12px", color: "#ffff00" }}>
                    <strong>설치 상태:</strong>
                </div>
                <div>Standalone 모드: {debugInfo.isInStandaloneMode ? "✅ 설치됨" : "❌ 미설치"}</div>
                <div>배너 닫음: {debugInfo.dismissed ? "✅ YES" : "❌ NO"}</div>

                <div style={{ marginTop: "16px", marginBottom: "12px", color: "#ffff00" }}>
                    <strong>배너 표시 조건:</strong>
                </div>
                <div>
                    {debugInfo.isMobile && !debugInfo.isInStandaloneMode ? (
                        <span style={{ color: "#00ff00" }}>✅ 배너가 표시되어야 합니다!</span>
                    ) : (
                        <span style={{ color: "#ff0000" }}>
                            ❌ 배너 표시 안 됨:{" "}
                            {!debugInfo.isMobile && "모바일이 아님"}
                            {debugInfo.isInStandaloneMode && "이미 설치됨"}
                        </span>
                    )}
                </div>

                <div style={{ marginTop: "16px", marginBottom: "8px", color: "#ffff00" }}>
                    <strong>User Agent:</strong>
                </div>
                <div style={{ fontSize: "0.7rem", wordBreak: "break-all", color: "#cccccc" }}>
                    {debugInfo.userAgent}
                </div>

                <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "rgba(255, 255, 0, 0.1)", borderRadius: "6px" }}>
                    <div style={{ color: "#ffff00", marginBottom: "8px" }}>💡 테스트 명령어:</div>
                    <div style={{ fontSize: "0.75rem", color: "#cccccc" }}>
                        배너 닫음 상태 초기화:<br />
                        <code style={{ color: "#00ff00" }}>localStorage.clear()</code>
                    </div>
                </div>
            </div>
        </div>
    );
}
