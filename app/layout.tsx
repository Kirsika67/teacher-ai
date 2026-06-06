import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Teacher AI Copilot',
  description: 'AI-powered teaching materials generator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="et">
      <body>{children}</body>
    </html>
  )
}
