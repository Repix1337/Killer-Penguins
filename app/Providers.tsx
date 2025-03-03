'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { SettingsProvider } from './context/SettingsContext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider 
      forcedTheme="light" 
      enableSystem={false} 
      attribute="class"
      disableTransitionOnChange
    >
      <SettingsProvider>
        {children}
      </SettingsProvider>
    </ThemeProvider>
  )
}