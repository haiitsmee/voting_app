import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ProgressBarProvider from '@/components/providers/ProgressBarProvider'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Brawijaya Appreciate',
  description: 'Digital Voting System Brawijaya Appreciate 2025',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <ProgressBarProvider>
          {children}
        </ProgressBarProvider>

        <Footer/>
      </body>
    </html>
  )
}