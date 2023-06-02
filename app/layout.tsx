import Head from 'next/head'
import './globals.css'
import { Inter } from 'next/font/google'
import AtpAgentProvider from '../atp/bsky-agent-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'bsky case builder',
  description:
    '(Unoffial app) Create a moderation case for accelerated handling by the moderation team.',
}

// Global Contexts

// Root Layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={'h-full bg-white'}>
      <body className={inter.className + ' h-full'}>
        <AtpAgentProvider>{children}</AtpAgentProvider>
      </body>
    </html>
  )
}
