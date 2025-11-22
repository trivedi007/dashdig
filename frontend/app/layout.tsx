import type { Metadata } from 'next'
import './globals.css'
import '../styles/dashboard.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Dashdig - Humanize and Shortenize URLs | Smart URL Shortener',
  description: 'Transform cryptic URLs into human-readable links. Dashdig helps you humanize and shortenize URLs with AI-powered contextual shortening.',
  openGraph: {
    title: 'Dashdig - Humanize and Shortenize URLs',
    description: 'Stop sharing ugly links. Create memorable, human-readable URLs that people actually remember.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Dashdig',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dashdig - Humanize and Shortenize URLs',
    description: 'Transform cryptic URLs into human-readable links with AI-powered smart shortening.',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '16x16 32x32', type: 'image/x-icon' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#2D3436',
              padding: '16px',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            success: {
              iconTheme: {
                primary: '#4ECDC4',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#FF6B35',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
