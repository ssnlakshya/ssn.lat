"use client"

import { ThemeProvider } from "next-themes"
import { ReactNode } from "react"

interface ProvidersProps {
  children: ReactNode
  defaultTheme?: string
  forcedTheme?: string
}

export function Providers({ children, defaultTheme = "system", forcedTheme }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={defaultTheme}
      forcedTheme={forcedTheme}
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}