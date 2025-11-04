import type React from "react"
import type { Metadata } from "next"
import { Open_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { ServerProvider } from "@/contexts/server-context"
import { Sidebar } from "@/components/sidebar"
import "./globals.css"

const openSans = Open_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DashMine - Minecraft Server Dashboard",
  description: "Monitor and manage your Minecraft server",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${openSans.className} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ServerProvider>
            <div className="flex min-h-screen bg-background">
              <Sidebar />
              <main className="flex-1">{children}</main>
            </div>
          </ServerProvider>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
