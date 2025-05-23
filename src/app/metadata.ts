// app/metadata.ts
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My PWA App',
  description: 'My Progressive Web App',
  generator: 'Next.js',
  manifest: '/manifest.json',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'My PWA App',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
  openGraph: {
    type: 'website',
    url: 'https://yourdomain.com',
    title: 'My PWA App',
    description: 'My Progressive Web App',
    siteName: 'My PWA App',
    images: [
      {
        url: '/icons/icon-512x512.png',
      },
    ],
  },
}

export default metadata