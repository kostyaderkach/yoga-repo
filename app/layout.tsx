import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Yoga App',
  description: 'Mobile-first yoga schedule and booking app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
