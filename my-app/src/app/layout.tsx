
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
      <body className={cn('h-screen bg-background text-foreground antialiased', inter.className)}>
        <main className="h-full flex flex-col items-center">
          <div className="w-full max-w-2xl h-full flex flex-col">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}

