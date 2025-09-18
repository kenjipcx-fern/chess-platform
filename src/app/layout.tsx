import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Chess Platform - Progressive Chess Experience',
  description: 'Modern chess platform with progressive complexity and accessibility-first design',
  keywords: ['chess', 'online chess', 'chess game', 'chess platform', 'progressive chess'],
  authors: [{ name: 'Chess Platform Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#769656' },
    { media: '(prefers-color-scheme: dark)', color: '#eeeed2' },
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://chess-platform.dev',
    title: 'Chess Platform - Progressive Chess Experience',
    description: 'Modern chess platform with progressive complexity',
    siteName: 'Chess Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chess Platform - Progressive Chess Experience',
    description: 'Modern chess platform with progressive complexity',
    creator: '@chessplatform',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-chess-secondary via-white to-chess-board-light">
          {children}
        </div>
      </body>
    </html>
  )
}
