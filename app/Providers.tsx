'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { SettingsProvider } from './context/SettingsContext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" attribute="class" enableSystem={false}>
      <SettingsProvider>
        {children}
      </SettingsProvider>
    </ThemeProvider>
  )
}