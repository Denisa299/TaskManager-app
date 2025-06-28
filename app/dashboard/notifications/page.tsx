"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/contexts/notification-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Bell, Check, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { ro } from "date-fns/locale"
import { stringToColor } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function NotificationsPage() {
  const { notifications, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications()
  const router = useRouter()

  const handleNotificationClick = async (notificationId: string, read: boolean, data?: any) => {
    if (!read) {
      await markAsRead(notificationId)
    }

    // Navighează la pagina relevantă dacă există date
    if (data?.taskId) {
      router.push(`/dashboard/tasks?task=${data.taskId}`)
    } else if (data?.projectId) {
      router.push(`/dashboard/projects?project=${data.projectId}`)
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

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case "task_assigned":
        return "Task asignat"
      case "task_updated":
        return "Task actualizat"
      case "project_updated":
        return "Proiect actualizat"
      case "comment_added":
        return "Comentariu nou"
      case "deadline_reminder":
        return "Reminder deadline"
      default:
        return "Notificare"
    }
  }

  const unreadNotifications = notifications.filter((n) => !n.read)

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>

        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-40" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Notificări</h1>
        <p className="text-muted-foreground">Gestionează toate notificările tale</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">
            {unreadNotifications.length > 0 ? `${unreadNotifications.length} necitite` : "Toate citite"}
          </h2>
          {unreadNotifications.length > 0 && (
            <Badge variant="secondary" className="bg-green-100 text-green-600">
              {unreadNotifications.length}
            </Badge>
          )}
        </div>
        {unreadNotifications.length > 0 && (
          <Button onClick={markAllAsRead} variant="outline" className="gap-2">
            <Check className="h-4 w-4" />
            Marchează toate ca citite
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nu ai notificări</h3>
            <p className="text-muted-foreground text-center">
              Când vei primi notificări despre taskuri, proiecte sau comentarii, le vei vedea aici.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification._id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${!notification.read ? "border-green-200 bg-green-50/50" : ""}`}
              onClick={() => handleNotificationClick(notification._id, notification.read, notification.data)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {notification.sender ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={notification.sender.avatar || ""}
                          alt={`${notification.sender.firstName} ${notification.sender.lastName}`}
                        />
                        <AvatarFallback
                          className={`text-sm bg-gradient-to-r ${stringToColor(`${notification.sender.firstName} ${notification.sender.lastName}`)} text-white`}
                        >
                          {notification.sender.firstName.charAt(0)}
                          {notification.sender.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm ${!notification.read ? "font-semibold" : "font-medium"}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && <div className="h-2 w-2 bg-green-500 rounded-full"></div>}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {getNotificationTypeLabel(notification.type)}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(notification.createdAt), "PPp", { locale: ro })}
                      </p>
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead(notification._id)
                            }}
                            className="h-8 px-2 text-xs"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Marchează ca citit
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification._id)
                          }}
                          className="h-8 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
