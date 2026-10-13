import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

import { Providers } from '@/components/providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Gawe',
  description: 'Temukan lowongan yang cocok untuk kamu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <Providers>
          <header className="flex items-center justify-between bg-gray-900 px-4 py-4 text-white sm:px-6">
            <div className="flex items-center gap-2 text-lg font-bold sm:text-xl">
              <span>Gawe</span>
            </div>
            <nav className="space-x-3 sm:space-x-4">
              <a href="/" className="text-sm hover:text-gray-300 sm:text-base">
                Lowongan Kerja
              </a>
              <a href="/dashboard" className="text-sm hover:text-gray-300 sm:text-base">
                Dashboard
              </a>
            </nav>
          </header>
          <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:py-8">
            {children}
          </main>
          <footer className="bg-gray-100 px-4 py-4 text-center text-gray-600">
            © Gawe - 2027
          </footer>
        </Providers>
      </body>
    </html>
  )
}
