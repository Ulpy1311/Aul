import React from "react"
import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { MusicPlayer } from '@/components/valentine/music-player'
import { CustomCursor } from '@/components/ui/custom-cursor'
import { ScrollWrapper } from '@/components/ui/scroll-wrapper'
import { CustomContextMenu } from '@/components/ui/custom-context-menu'
import { WelcomePopup } from '@/components/valentine/welcome-popup'
import { SecurityGuard } from '@/components/ui/security-guard'
import { Navbar } from '@/components/ui/navbar'
import { GlobalEffects } from '@/components/valentine/global-effects'

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: 'For Aulia',
  description: 'Sebuah kartu Valentine digital yang penuh makna dan ketulusan',
  generator: 'v0.app',
  icons: {
    icon: '/heart-icon.png',
    apple: '/heart-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ScrollWrapper>
          <GlobalEffects />
          <Navbar />
          {children}
          <MusicPlayer />
          <CustomCursor />
          <CustomContextMenu />
          <WelcomePopup />
          <SecurityGuard />
        </ScrollWrapper>
        <Analytics />
      </body>
    </html>
  )
}
