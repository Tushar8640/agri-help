import type { Metadata } from "next";
import "./globals.css";
import { ProjectProvider } from "@/context/ProjectContext";
import { WeatherProvider } from "@/context/WeatherContext";
import Layout from "@/components/Layout";



export const metadata: Metadata = {
  title: "Agri Tech",
  description: "Generated for Agri Tech",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
