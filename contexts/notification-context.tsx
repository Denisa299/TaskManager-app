"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "./auth-context"

interface NotificationData {
  taskId?: string
  projectId?: string
  commentId?: string
  [key: string]: any
}

interface Notification {
  _id: string
  recipient: string
  sender?: {
    _id: string
    firstName: string
    lastName: string
    avatar?: string
  }
  type: "task_assigned" | "task_updated" | "project_updated" | "comment_added" | "deadline_reminder" | "system"
  title: string
  message: string
  data?: NotificationData
  read: boolean
  createdAt: string
  updatedAt: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  fetchNotifications: () => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  refreshUnreadCount: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  const fetchNotifications = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/notifications")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Eroare la încărcarea notificărilor")
      }

      const data = await response.json()
      setNotifications(data)
    } catch (error) {
      console.error("Eroare la încărcarea notificărilor:", error)
      setError((error as Error).message)
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca notificările",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshUnreadCount = async () => {
    if (!user) return

    try {
      const response = await fetch("/api/notifications/unread-count")

      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.count)
      }
    } catch (error) {
      console.error("Eroare la obținerea numărului de notificări necitite:", error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PUT",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Eroare la marcarea notificării ca citită")
      }

      // Actualizează local
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification,
        ),
      )

      // Actualizează numărul de notificări necitite
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Eroare la marcarea notificării ca citită:", error)
      toast({
        title: "Eroare",
        description: "Nu s-a putut marca notificarea ca citită",
        variant: "destructive",
      })
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "PUT",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Eroare la marcarea tuturor notificărilor ca citite")
      }

      // Actualizează local
      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
      setUnreadCount(0)

      toast({
        title: "Succes",
        description: "Toate notificările au fost marcate ca citite",
      })
    } catch (error) {
      console.error("Eroare la marcarea tuturor notificărilor ca citite:", error)
      toast({
        title: "Eroare",
        description: "Nu s-au putut marca toate notificările ca citite",
        variant: "destructive",
      })
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Eroare la ștergerea notificării")
      }

      // Actualizează local
      const notificationToDelete = notifications.find((n) => n._id === notificationId)
      setNotifications((prev) => prev.filter((notification) => notification._id !== notificationId))

      // Dacă notificarea era necitită, scade numărul
      if (notificationToDelete && !notificationToDelete.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }

      toast({
        title: "Succes",
        description: "Notificarea a fost ștearsă",
      })
    } catch (error) {
      console.error("Eroare la ștergerea notificării:", error)
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge notificarea",
        variant: "destructive",
      })
    }
  }

  // Încarcă notificările și numărul de notificări necitite când utilizatorul se autentifică
  useEffect(() => {
    if (user) {
      fetchNotifications()
      refreshUnreadCount()

      // Actualizează numărul de notificări necitite la fiecare 30 de secunde
      const interval = setInterval(refreshUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refreshUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications trebuie utilizat în interiorul unui NotificationProvider")
  }
  return context
}
