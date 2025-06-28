"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, ListTodo } from "lucide-react"
import { useTasks } from "@/contexts/task-context"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { ro } from "date-fns/locale"
import Link from "next/link"

export function RecentTasks() {
  const { tasks, loading, error } = useTasks()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "todo":
        return <ListTodo className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return (
          <Badge variant="default" className="bg-amber-500">
            Medium
          </Badge>
        )
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return null
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Fără termen"

    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Azi"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Mâine"
    } else {
      return format(date, "d MMM", { locale: ro })
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-red-500">Eroare la încărcarea taskurilor</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">Nu există taskuri</p>
      </div>
    )
  }

  // Sortează taskurile după data de creare (cele mai recente primele)
  const sortedTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5) // Limitează la 5 taskuri

  return (
    <div className="space-y-4">
      {sortedTasks.map((task) => (
        <Link
          key={task._id}
          href={`/dashboard/tasks?project=${task.project._id}`}
          className="flex items-center justify-between border-b pb-4 hover:bg-muted/20 rounded-md p-2 -mx-2 transition-colors"
        >
          <div className="flex items-center gap-3">
            {getStatusIcon(task.status)}
            <div>
              <div className="font-medium">{task.title}</div>
              <div className="text-xs text-muted-foreground">Termen: {formatDate(task.dueDate)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getPriorityBadge(task.priority)}
            {task.assignees.length > 0 && (
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={task.assignees[0].avatar || "/placeholder.svg?height=24&width=24&query=user"}
                  alt={`${task.assignees[0].firstName} ${task.assignees[0].lastName}`}
                />
                <AvatarFallback>
                  {task.assignees[0].firstName.charAt(0)}
                  {task.assignees[0].lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
