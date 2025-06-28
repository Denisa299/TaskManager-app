"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { hasPermission } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/models/user"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  status: string
  tasks: number
  avatar?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  hasPermission: (permission: string) => boolean
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  role?: UserRole
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Verificare autentificare la încărcarea paginii
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/auth/me")

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Eroare la verificarea autentificării:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        return { success: true, message: data.message }
      } else {
        return { success: false, message: data.error }
      }
    } catch (error) {
      console.error("Eroare la autentificare:", error)
      return { success: false, message: "Eroare la autentificare" }
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, message: data.message }
      } else {
        return { success: false, message: data.error }
      }
    } catch (error) {
      console.error("Eroare la înregistrare:", error)
      return { success: false, message: "Eroare la înregistrare" }
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
      setUser(null)
    } catch (error) {
      console.error("Eroare la deconectare:", error)
    }
  }

  // Funcție pentru verificarea permisiunilor
  const checkPermission = (permission: string) => {
    return hasPermission(user, permission)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkAuth,
        hasPermission: checkPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth trebuie utilizat în interiorul unui AuthProvider")
  }
  return context
}
