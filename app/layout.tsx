import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Finance Tracker - Multi-Tenant Workspace',
  description: 'Secure, password-protected finance tracking workspaces for managing income and expenses with real-time analytics.',
  keywords: 'finance, tracker, budget, income, expenses, analytics, workspace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}