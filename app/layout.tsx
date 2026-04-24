import type { Metadata, Viewport } from 'next'
import { Press_Start_2P, Nunito } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const pressStart = Press_Start_2P({ 
  weight: '400',
  subsets: ["latin"],
  variable: '--font-pixel'
});

const nunito = Nunito({ 
  subsets: ["latin"],
  variable: '--font-nunito'
});

export const metadata: Metadata = {
  title: 'Tuzya Sathi 💕 - A Romantic Platformer',
  description: 'A love letter from Kishor to Bubbu - A romantic pixel art platformer game',
  generator: 'v0.app',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Tuzya Sathi'
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FFB6C1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${pressStart.variable} ${nunito.variable}`}>
      <body className="font-nunito antialiased bg-pink-100 overflow-hidden">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
