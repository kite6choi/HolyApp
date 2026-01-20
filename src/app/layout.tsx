import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "HolySeeds Church | 홀리씨즈교회",
  description: "언제 어디서나 함께하는 설교와 찬양, 홀리씨즈교회 앱입니다.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HolySeeds",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <header style={{
          height: 'var(--header-height)',
          backgroundColor: 'var(--card-bg)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          borderBottom: '1px solid var(--border)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center'
        }}>
          <div className="container" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
              <Image
                src="/church-logo.png"
                alt="Holyseeds Church Official Logo"
                width={150}
                height={50}
                priority
                style={{ objectFit: 'contain' }}
              />
            </Link>
            <nav>
              <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none' }}>
                <li><Link href="/" style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)', letterSpacing: '0.05em' }}>HOME</Link></li>
                {/* Future Menu Items */}
              </ul>
            </nav>
          </div>
        </header>

        <main style={{ paddingTop: 'var(--header-height)', minHeight: '100vh' }}>
          {children}
        </main>

        <footer style={{
          padding: '100px 0 50px',
          textAlign: 'center',
          backgroundColor: 'var(--background)'
        }}>
          <div className="container" style={{ opacity: 0.4 }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              © 2026 HOLYSEEDS CHURCH. <span className="text-gradient">Crafted for Grace.</span>
            </p>
            <a href="/admin" style={{ fontSize: '0.6rem', marginTop: '20px', display: 'inline-block', opacity: 0.3 }}>ADMIN LOGIN</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
