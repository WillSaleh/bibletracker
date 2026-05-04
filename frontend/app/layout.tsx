import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Lora } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const lora = Lora({ 
  subsets: ['latin'],
  variable: '--font-lora',
  style: ['normal', 'italic']
})

export const metadata: Metadata = {
  title: 'Bible Tracker',
  description: 'Track your reading. Nourish your soul.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${lora.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}