import type { Metadata } from "next";
import "./globals.css";
import { ProjectProvider } from "@/context/ProjectContext";
import { WeatherProvider } from "@/context/WeatherContext";
import Layout from "@/components/Layout";
import { metadata as meta } from './metadata'
import PWA from "./pwa";

export const metadata: Metadata = meta

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
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <ProjectProvider>
          <WeatherProvider>
            <Layout>{children}</Layout>
            <PWA />
          </WeatherProvider>
        </ProjectProvider>
      </body>
    </html>
  );
}
