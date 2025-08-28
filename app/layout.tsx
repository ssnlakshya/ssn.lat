import type React from "react"
import type { Viewport } from "next"
import { Bricolage_Grotesque } from "next/font/google"
import { Providers } from "@/context"
import { Header } from "@/components/header"
import { MeshGradientComponent } from "@/components/mesh-gradient"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
  preload: true,
})

export const dynamic = "force-static"
export const revalidate = 30

export const viewport: Viewport = {
  maximumScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bricolageGrotesque.className} antialiased max-w-screen min-h-svh bg-slate-1 text-slate-12`}>
        <Providers defaultTheme="system">
          <MeshGradientComponent
            colors={[
              "#FF6B35", // Orange
              "#FFFFFF", // White
              "#FFA366", // Light orange
              "#FFFFFF", // White
            ]}
            speed={1.5}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 0,
              width: "100%",
              height: "100%",
            }}
          />
          <div className="max-w-screen-sm mx-auto w-full relative z-[1] flex flex-col min-h-screen">
            <div className="px-5 gap-8 flex flex-col flex-1 py-[12vh]">
              <Header />
              <main className="flex justify-center">{children}</main>
            </div>
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}

export const metadata = {
  title: "SSN.c - URL Shortener",
  description: "Transform your long URLs into clean, shareable links",
  generator: 'v0.app'
}