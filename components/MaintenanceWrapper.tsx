// components/MaintenanceWrapper.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MaintenanceWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const authStatus = sessionStorage.getItem('maintenance-auth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    } else {
      const password = prompt('Site is in maintenance mode. Enter password:')
      if (password === process.env.NEXT_PUBLIC_MAINTENANCE_PASSWORD) {
        sessionStorage.setItem('maintenance-auth', 'true')
        setIsAuthenticated(true)
      } else {
        router.push('/maintenance')
      }
    }
  }, [router])

  if (!isAuthenticated) {
    return null // or loading spinner
  }

  return <>{children}</>
}