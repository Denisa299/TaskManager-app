"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTasks } from "@/contexts/task-context"
import { format } from "date-fns"
import { ro } from "date-fns/locale"
import { Skeleton } from "@/components/ui/skeleton"
import { CreateTaskDialog } from "./create-task-dialog"
import { useToast } from "@/components/ui/use-toast"
import { stringToColor } from "@/lib/utils"

export function KanbanBoard() {
  const { tasks, loading, error, getTasksByStatus, updateTask, deleteTask } = useTasks()
  const { toast } = useToast()

  const columns = [
    {
      id: "todo",
      title: "To Do",
      tasks: getTasksByStatus("todo"),
      color: "bg-blue-500",
      hoverColor: "group-hover:bg-blue-600",
    },
    {
      id: "in-progress",
      title: "In progres",
      tasks: getTasksByStatus("in-progress"),
      color: "bg-amber-500",
      hoverColor: "group-hover:bg-amber-600",
    },
    {
      id: "completed",
      title: "Done",
      tasks: getTasksByStatus("completed"),
      color: "bg-green-500",
      hoverColor: "group-hover:bg-green-600",
    },
  ]

  const handleMoveTask = async (taskId: string, newStatus: "todo" | "in-progress" | "completed") => {
    await updateTask(taskId, { status: newStatus })
  }

  const handleDeleteTask = async (taskId: string) => {
    const confirmed = window.confirm("Ești sigur că vrei să ștergi acest task?")
    if (confirmed) {
      await deleteTask(taskId)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-amber-500"
      case "low":
        return "bg-green-500"
      default:
        return ""
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    return format(new Date(dateString), "d MMM yyyy", { locale: ro })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((columnIndex) => (
          <div key={columnIndex} className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Skeleton className="w-3 h-3 rounded-full" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-8 rounded-full" />
              </div>
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((taskIndex) => (
                <Skeleton key={taskIndex} className="h-40 w-full rounded-md" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2 text-red-500">Eroare la încărcarea taskurilor</h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Reîncarcă</Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => (
        <div key={column.id} className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${column.color}`} />
              <h3 className="font-semibold">{column.title}</h3>
              <Badge variant="outline">{column.tasks.length}</Badge>
            </div>
            {column.id === "todo" && <CreateTaskDialog />}
          </div>
          <div className="flex flex-col gap-4">
            {column.tasks.map((task) => (
              <Card key={task._id} className="shadow-sm group hover:shadow-md transition-all duration-300">
                <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)} transition-all duration-300 ${task.priority === "high" ? "group-hover:animate-pulse" : ""}`}
                    />
                    <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-70 group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Opțiuni</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
                      <DropdownMenuItem>Editează</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        disabled={task.status === "todo"}
                        onClick={() => handleMoveTask(task._id, "todo")}
                      >
                        Mută în To Do
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={task.status === "in-progress"}
                        onClick={() => handleMoveTask(task._id, "in-progress")}
                      >
                        Mută în În Progres
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={task.status === "completed"}
                        onClick={() => handleMoveTask(task._id, "completed")}
                      >
                        Mută în Finalizat
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTask(task._id)}>
                        Șterge
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  {task.description && <p className="text-sm text-muted-foreground mb-3">{task.description}</p>}
                  {task.dueDate && <div className="text-xs text-muted-foreground mb-3">{formatDate(task.dueDate)}</div>}
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {task.assignees.map((assignee, index) => {
                        // Generează o culoare consistentă pentru avatar bazată pe numele utilizatorului
                        const avatarColor = stringToColor(`${assignee.firstName} ${assignee.lastName}`)

                        return (
                          <Avatar
                            key={index}
                            className="h-6 w-6 border-2 border-background transition-all duration-300 hover:scale-110 hover:z-10"
                          >
                            <AvatarImage
                              src={assignee.avatar || `/placeholder.svg?height=24&width=24&query=user`}
                              alt={`${assignee.firstName} ${assignee.lastName}`}
                            />
                            <AvatarFallback className={`bg-gradient-to-r ${avatarColor} text-white text-[10px]`}>
                              {assignee.firstName.charAt(0)}
                              {assignee.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  
                      <div>
                       
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {column.tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-lg text-muted-foreground">
                <p className="text-sm mb-2">Nu există taskuri în {column.title}</p>
                {column.id === "todo" && <CreateTaskDialog />}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
