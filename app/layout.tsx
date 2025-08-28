import type React from "react"
import "../basehub.config"
import type { Viewport } from "next"
import { Bricolage_Grotesque } from "next/font/google"
import { Providers } from "@/context"
import { Header } from "@/components/header"
import { Toolbar } from "basehub/next-toolbar"
import { basehub } from "basehub"
import { MeshGradientComponent } from "@/components/mesh-gradient"
import { PlaygroundSetupModal } from "@/components/playground-notification"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
  preload: true,
})

export const dynamic = "force-static"
export const revalidate = 30

const envs: Record<string, { isValid: boolean; name: string; label: string }> = {}
const _vercel_url_env_name = "VERCEL_URL"
const isMainV0 = process.env[_vercel_url_env_name]?.startsWith("preview-waitlist-kzmiywb8tn0gppio5dmp")

let allValid = true
const subscribeEnv = ({
  name,
  label,
  value,
}: {
  name: string
  label: string
  value: string | undefined
}) => {
  const isValid = !!value
  if (!isValid) {
    allValid = false
  }
  envs[name] = {
    isValid,
    name,
    label,
  }
}

export const viewport: Viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { settings } = await basehub().query({
    settings: {
      defaultTheme: true,
      forcedTheme: true,
      background: {
        color1: { hex: true },
        color2: { hex: true },
        color3: { hex: true },
        color4: { hex: true },
        speed: true,
      },
    },
  })

  let playgroundNotification = null

  subscribeEnv({
    name: "BASEHUB_TOKEN",
    label: "BaseHub Read Token",
    value: process.env.BASEHUB_TOKEN,
  })
  subscribeEnv({
    name: "RESEND_API_KEY",
    label: "Resend API Key",
    value: process.env.RESEND_API_KEY,
  })

  if (!isMainV0 && !allValid && process.env.NODE_ENV !== "production") {
    const playgroundData = await basehub().query({
      _sys: {
        playgroundInfo: {
          expiresAt: true,
          editUrl: true,
          claimUrl: true,
        },
      },
    })

    if (playgroundData._sys.playgroundInfo) {
      playgroundNotification = <PlaygroundSetupModal playgroundInfo={playgroundData._sys.playgroundInfo} envs={envs} />
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bricolageGrotesque.className} antialiased max-w-screen min-h-svh bg-slate-1 text-slate-12`}>
        <Providers defaultTheme={settings.defaultTheme || "system"} forcedTheme={settings.forcedTheme}>
          <MeshGradientComponent
            colors={[
              "#FF6B35", // Orange
              "#F7931E", // Light orange
              "#FFB347", // Peach
              "#FF8C42", // Coral orange
            ]}
            speed={settings.background.speed}
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
        {!isMainV0 && <Toolbar />}
        {playgroundNotification}
        <Toaster />
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
