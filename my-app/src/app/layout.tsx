import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Comment App',
  description: 'Reddit-style nested comments built with RxDB and shadcn/ui',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn('min-h-screen bg-background text-foreground antialiased', inter.className)}>
        <main className="max-w-2xl mx-auto px-4 py-10">
          {children}
        </main>
      </body>
    </html>
  )
}

