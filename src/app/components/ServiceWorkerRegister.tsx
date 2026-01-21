"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((registration) => {
                    console.log("✅ Service Worker registered successfully:", registration.scope);

                    // 업데이트 확인
                    registration.addEventListener("updatefound", () => {
                        const newWorker = registration.installing;
                        console.log("🔄 New Service Worker installing...");

                        newWorker?.addEventListener("statechange", () => {
                            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                                // 새 버전이 있을 때 사용자에게 알림 (선택사항)
                                console.log("📦 New version available! Please refresh.");
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.error("❌ Service Worker registration failed:", error);
                });
        }
    }, []);

    return null; // UI를 렌더링하지 않음
}
