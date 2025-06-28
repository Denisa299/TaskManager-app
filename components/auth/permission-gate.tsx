"use client"

import { useAuth } from "@/contexts/auth-context"
import type { ReactNode } from "react"

interface PermissionGateProps {
  permission: string
  fallback?: ReactNode
  children: ReactNode
}

export function PermissionGate({ permission, fallback = null, children }: PermissionGateProps) {
  const { hasPermission } = useAuth()

  if (!hasPermission(permission)) {
    return fallback
  }

  return <>{children}</>
}
