import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Toaster richColors position="top-right" />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}