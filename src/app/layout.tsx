import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '../../lib/providers'
import Notification from './components/notification'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hotel Management System',
  description: '',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Notification />
          {children}
        </Providers>
      </body>
    </html>
  )
}