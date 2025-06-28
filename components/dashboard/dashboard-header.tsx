"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Bell, Menu, Search, LogOut, User, Settings, X, Check } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useNotifications } from "@/contexts/notification-context"
import { format } from "date-fns"
import { ro } from "date-fns/locale"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, hasPermission } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [showNotifications, setShowNotifications] = useState(false)
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications()

  const handleLogout = async () => {
    await logout()
    toast({
      title: "Deconectare reușită",
      description: "Te-ai deconectat cu succes",
      variant: "default",
    })
    router.push("/")
  }

  // Definește linkurile pentru meniul mobil
  const mobileNavItems = [
    { href: "/dashboard", label: "Dashboard", show: true },
    { href: "/dashboard/tasks", label: "Taskuri", show: true },
    { href: "/dashboard/projects", label: "Proiecte", show: true },
    { href: "/dashboard/team", label: "Echipă", show: hasPermission("view_team_data") },
    { href: "/dashboard/calendar", label: "Calendar", show: true },
    { href: "/dashboard/settings", label: "Setări", show: true },
  ].filter((item) => item.show)

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications)
  }

  const handleNotificationClick = async (notificationId: string, data?: any) => {
    // Marchează notificarea ca citită
    await markAsRead(notificationId)

    // Navighează la pagina relevantă dacă există date
    if (data?.taskId) {
      router.push(`/dashboard/tasks?task=${data.taskId}`)
    } else if (data?.projectId) {
      router.push(`/dashboard/projects?project=${data.projectId}`)
    }

    setShowNotifications(false)
  }

  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return diffInMinutes < 1 ? "Acum" : `Acum ${diffInMinutes} min`
    } else if (diffInHours < 24) {
      return `Acum ${diffInHours} ore`
    } else {
      return format(date, "d MMM", { locale: ro })
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task_assigned":
        return "📋"
      case "task_updated":
        return "✏️"
      case "project_updated":
        return "📁"
      case "comment_added":
        return "💬"
      case "deadline_reminder":
        return "⏰"
      default:
        return "🔔"
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-soft">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" className="border-green-200">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Meniu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4 mt-8">
                {mobileNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium hover:text-green-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-soft">
              <span className="font-bold">TM</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline-block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              TaskManager
            </span>
          </Link>
        </div>
        <div className="hidden md:flex items-center relative max-w-sm w-full">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Caută taskuri..."
            className="w-full pl-8 rounded-full bg-background border-green-200 focus:border-green-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative border-green-200 hover:bg-green-50"
                onClick={handleNotificationsClick}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-[10px] font-medium text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                <span className="sr-only">Notificări</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between p-2">
                <DropdownMenuLabel className="p-0">Notificări</DropdownMenuLabel>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                    <Check className="h-3 w-3 mr-1" />
                    Marchează toate
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-[400px] overflow-y-auto">
                {loading ? (
                  <div className="p-2 space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start gap-3 p-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1 space-y-1">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nu ai notificări</p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map((notification) => (
                    <DropdownMenuItem
                      key={notification._id}
                      className={`cursor-pointer flex items-start gap-3 p-3 ${!notification.read ? "bg-green-50" : ""}`}
                      onClick={() => handleNotificationClick(notification._id, notification.data)}
                    >
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`text-sm ${!notification.read ? "font-medium" : ""}`}>{notification.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatNotificationTime(notification.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            {!notification.read && <div className="h-2 w-2 bg-green-500 rounded-full"></div>}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification._id)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer justify-center text-green-600"
                    onClick={() => {
                      router.push("/dashboard/notifications")
                      setShowNotifications(false)
                    }}
                  >
                    Vezi toate notificările
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  <span className="text-sm">
                    {user ? `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}` : "U"}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user ? `${user.firstName} ${user.lastName}` : "Contul meu"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Setări</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Deconectare</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
