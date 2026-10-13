import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

import { Providers } from "@/components/providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Dicoding Jobs",
  description: "Temukan lowongan yang cocok untuk kamu",
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
          <header className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
            <div className="text-xl font-bold">Jobs</div>
            <nav className="space-x-4">
              <a href="/" className="hover:text-gray-300">Lowongan Kerja</a>
              <a href="/dashboard" className="hover:text-gray-300">Dashboard</a>
            </nav>
          </header>
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-gray-100 py-4 text-center text-gray-600">
            Dicoding Jobs • dicoding.com • Jl. Prof. Dr. Satrya Wijaya No. 12, Jakarta
          </footer>
        </Providers>
      </body>
    </html>
  )
}