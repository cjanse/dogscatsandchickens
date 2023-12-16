import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import favicon from '../public/favicon.ico'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dogs, Cats, and Chickens',
  description: 'Play the original card game \"Dogs, Cats, and Chickens!\"',
  icons: {
    icon: '/favicon.ico',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      <link rel="shortcut icon" href={favicon.src} type="image/x-icon" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
