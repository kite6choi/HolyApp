"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import QRCode from "qrcode";

export default function InstallGuide() {
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [appUrl, setAppUrl] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // 현재 URL 가져오기
        const url = window.location.origin;
        setAppUrl(url);

        // 모바일 감지
        const userAgent = window.navigator.userAgent.toLowerCase();
        const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
        setIsMobile(mobile);

        // QR 코드 생성
        if (canvasRef.current) {
            QRCode.toCanvas(
                canvasRef.current,
                url,
                {
                    width: 300,
                    margin: 2,
                    color: {
                        dark: "#10B981",
                        light: "#FFFFFF",
                    },
                },
                (error) => {
                    if (error) console.error("QR Code generation error:", error);
                }
            );
        }

        // 데이터 URL로도 생성 (다운로드용)
        QRCode.toDataURL(url, { width: 500, color: { dark: "#10B981" } })
            .then((dataUrl) => {
                setQrCodeUrl(dataUrl);
            })
            .catch((error) => {
                console.error("QR Code data URL error:", error);
            });
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(appUrl);
        alert("URL이 클립보드에 복사되었습니다!");
    };

    const downloadQRCode = () => {
        const link = document.createElement("a");
        link.download = "holyseeds-qr-code.png";
        link.href = qrCodeUrl;
        link.click();
    };

    return (
        <div className="container fade-in" style={{ padding: "80px 24px" }}>
            <header style={{ marginBottom: "60px", textAlign: "center" }}>
                <Link
                    href="/"
                    style={{
                        color: "var(--primary)",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "24px",
                        letterSpacing: "0.05em",
                    }}
                >
                    ← BACK TO HOME
                </Link>
                <h2 style={{ fontSize: "3.5rem", marginBottom: "16px" }}>
                    📱 <span className="text-gradient">앱 설치 가이드</span>
                </h2>
                <p className="text-muted" style={{ fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
                    모바일에서 앱처럼 사용하세요.<br />
                    더 빠르고 편리한 경험을 제공합니다.
                </p>
            </header>

            <div style={{ display: "grid", gap: "40px", maxWidth: "800px", margin: "0 auto" }}>
                {!isMobile ? (
                    <>
                        {/* 데스크톱: QR 코드 표시 */}
                        <section className="glass-card" style={{ textAlign: "center", padding: "60px 40px" }}>
                            <h3 style={{ fontSize: "2rem", marginBottom: "30px" }}>
                                <span className="text-gradient">모바일로 스캔하세요</span>
                            </h3>

                            <div
                                style={{
                                    display: "inline-block",
                                    padding: "30px",
                                    backgroundColor: "white",
                                    borderRadius: "24px",
                                    boxShadow: "var(--shadow-lg)",
                                }}
                            >
                                <canvas ref={canvasRef} style={{ display: "block" }} />
                            </div>

                            <p className="text-muted" style={{ fontSize: "0.95rem", marginTop: "30px", lineHeight: "1.7" }}>
                                스마트폰 카메라로 위 QR 코드를 스캔하면<br />
                                바로 앱에 접속할 수 있습니다.
                            </p>

                            {qrCodeUrl && (
                                <button
                                    onClick={downloadQRCode}
                                    className="btn-primary"
                                    style={{ marginTop: "20px", padding: "14px 28px" }}
                                >
                                    QR 코드 다운로드
                                </button>
                            )}
                        </section>

                        {/* URL 복사 */}
                        <section className="glass-card">
                            <h4 style={{ fontSize: "1.2rem", marginBottom: "20px", fontWeight: 800 }}>
                                또는 URL 직접 입력
                            </h4>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "12px",
                                    alignItems: "center",
                                    padding: "16px 20px",
                                    backgroundColor: "rgba(16, 185, 129, 0.05)",
                                    borderRadius: "12px",
                                    border: "2px solid var(--primary)",
                                }}
                            >
                                <code
                                    style={{
                                        flex: 1,
                                        fontSize: "1rem",
                                        color: "var(--primary)",
                                        fontWeight: 700,
                                    }}
                                >
                                    {appUrl}
                                </code>
                                <button
                                    onClick={copyToClipboard}
                                    style={{
                                        padding: "10px 20px",
                                        borderRadius: "10px",
                                        backgroundColor: "var(--primary)",
                                        color: "white",
                                        fontWeight: 700,
                                        fontSize: "0.85rem",
                                        border: "none",
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    복사
                                </button>
                            </div>
                        </section>
                    </>
                ) : (
                    <>
                        {/* 모바일: 설치 안내 */}
                        <section className="glass-card">
                            <div style={{ textAlign: "center", marginBottom: "30px" }}>
                                <div style={{ fontSize: "4rem", marginBottom: "20px" }}>✅</div>
                                <h3 style={{ fontSize: "1.8rem", marginBottom: "16px" }}>
                                    <span className="text-gradient">좋습니다!</span>
                                </h3>
                                <p className="text-muted" style={{ fontSize: "1.1rem" }}>
                                    모바일에서 접속하셨네요.<br />
                                    아래 방법으로 설치하세요.
                                </p>
                            </div>
                        </section>
                    </>
                )}

                {/* 설치 방법 안내 */}
                <section className="glass-card">
                    <h3 style={{ fontSize: "1.5rem", marginBottom: "30px", fontWeight: 800 }}>
                        📲 설치 방법
                    </h3>

                    <div style={{ display: "grid", gap: "24px" }}>
                        {/* Android */}
                        <div
                            style={{
                                padding: "24px",
                                backgroundColor: "rgba(16, 185, 129, 0.05)",
                                borderRadius: "16px",
                                border: "1px solid var(--primary)",
                            }}
                        >
                            <h4
                                style={{
                                    fontSize: "1.2rem",
                                    marginBottom: "16px",
                                    fontWeight: 800,
                                    color: "var(--primary)",
                                }}
                            >
                                🤖 Android (Chrome)
                            </h4>
                            <ol style={{ paddingLeft: "20px", lineHeight: "2" }}>
                                <li>하단에 표시되는 <strong>&quot;홈 화면에 추가&quot;</strong> 배너 클릭</li>
                                <li>또는 우측 상단 <strong>⋮</strong> 메뉴 → <strong>&quot;앱 설치&quot;</strong></li>
                                <li><strong>&quot;설치&quot;</strong> 버튼 클릭</li>
                                <li>홈 화면에 아이콘 생성 완료! 🎉</li>
                            </ol>
                        </div>

                        {/* iOS */}
                        <div
                            style={{
                                padding: "24px",
                                backgroundColor: "rgba(59, 130, 246, 0.05)",
                                borderRadius: "16px",
                                border: "1px solid #3B82F6",
                            }}
                        >
                            <h4
                                style={{
                                    fontSize: "1.2rem",
                                    marginBottom: "16px",
                                    fontWeight: 800,
                                    color: "#3B82F6",
                                }}
                            >
                                🍎 iOS (Safari)
                            </h4>
                            <ol style={{ paddingLeft: "20px", lineHeight: "2" }}>
                                <li>⚠️ <strong>반드시 Safari 사용</strong> (Chrome 안 됨!)</li>
                                <li>하단 중앙 <strong>공유 버튼(□↑)</strong> 클릭</li>
                                <li>아래로 스크롤해서 <strong>&quot;홈 화면에 추가&quot;</strong> 찾기</li>
                                <li><strong>&quot;추가&quot;</strong> 버튼 클릭</li>
                                <li>홈 화면에 아이콘 생성 완료! 🎉</li>
                            </ol>
                        </div>
                    </div>
                </section>

                {/* 설치 후 장점 */}
                <section className="glass-card">
                    <h3 style={{ fontSize: "1.5rem", marginBottom: "30px", fontWeight: 800 }}>
                        ✨ 앱 설치 시 장점
                    </h3>
                    <div style={{ display: "grid", gap: "16px" }}>
                        <div style={{ display: "flex", gap: "16px" }}>
                            <div style={{ fontSize: "1.5rem" }}>📱</div>
                            <div>
                                <strong>앱처럼 사용</strong>
                                <p className="text-muted" style={{ fontSize: "0.9rem", marginTop: "4px" }}>
                                    홈 화면 아이콘, 전체 화면 실행
                                </p>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "16px" }}>
                            <div style={{ fontSize: "1.5rem" }}>⏰</div>
                            <div>
                                <strong>알람 기능 개선</strong>
                                <p className="text-muted" style={{ fontSize: "0.9rem", marginTop: "4px" }}>
                                    백그라운드에서 더 안정적으로 작동
                                </p>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "16px" }}>
                            <div style={{ fontSize: "1.5rem" }}>⚡</div>
                            <div>
                                <strong>빠른 실행</strong>
                                <p className="text-muted" style={{ fontSize: "0.9rem", marginTop: "4px" }}>
                                    아이콘 터치로 즉시 실행
                                </p>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "16px" }}>
                            <div style={{ fontSize: "1.5rem" }}>📡</div>
                            <div>
                                <strong>오프라인 지원</strong>
                                <p className="text-muted" style={{ fontSize: "0.9rem", marginTop: "4px" }}>
                                    인터넷 없어도 기본 기능 사용 가능
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
