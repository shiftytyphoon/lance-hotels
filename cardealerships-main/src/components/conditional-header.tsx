"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header"

// Routes that are part of the authenticated app (no public header)
const appRoutes = ['/dashboard', '/calls', '/agents', '/setup', '/settings', '/signin', '/signup']

export function ConditionalHeader() {
  const pathname = usePathname()

  // Don't show header on authenticated app pages
  const isAppRoute = appRoutes.some(route => pathname.startsWith(route))

  return isAppRoute ? null : <Header />
}
