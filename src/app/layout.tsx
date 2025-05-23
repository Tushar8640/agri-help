import type { Metadata } from "next";
import "./globals.css";
import { ProjectProvider } from "@/context/ProjectContext";
import { WeatherProvider } from "@/context/WeatherContext";
import Layout from "@/components/Layout";

export const metadata: Metadata = {
  title: 'Agri Tech',
  description: 'Agri Tech',
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
    icon: 'icon512_maskable.png',
    apple: 'icon512_maskable.png',
  },

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="icon512_maskable.png" sizes="any" />
        <link rel="apple-touch-icon" href="icon512_maskable.png.png" />
      </head>
      <body>
        <ProjectProvider>
          <WeatherProvider>
            <Layout>{children}</Layout>
          </WeatherProvider>
        </ProjectProvider>
      </body>
    </html>
  );
}
