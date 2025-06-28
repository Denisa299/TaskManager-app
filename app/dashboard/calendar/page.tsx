"use client"

import { useState } from "react"
import { Calendar as CalendarComponent, dateFnsLocalizer } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { ro } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTasks } from "@/contexts/task-context"
import { useProjects } from "@/contexts/project-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { CreateTaskDialog } from "@/components/dashboard/create-task-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Configurare localizare pentru calendar
const locales = {
  "ro-RO": ro,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Stiluri personalizate pentru evenimente în calendar
const eventStyleGetter = (event: any) => {
  let backgroundColor = "#3b82f6" // blue-500 default

  if (event.priority === "high") {
    backgroundColor = "#ef4444" // red-500
  } else if (event.priority === "medium") {
    backgroundColor = "#f59e0b" // amber-500
  } else if (event.priority === "low") {
    backgroundColor = "#10b981" // emerald-500
  }

  const style = {
    backgroundColor,
    borderRadius: "4px",
    opacity: event.status === "completed" ? 0.6 : 0.8,
    color: "white",
    border: "none",
    display: "block",
  }
  return {
    style,
  }
}

export default function CalendarPage() {
  const { tasks, loading: tasksLoading } = useTasks()
  const { projects, loading: projectsLoading, selectedProject, setSelectedProject } = useProjects()
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [showEventDetails, setShowEventDetails] = useState(false)

  // Convertește taskurile în evenimente pentru calendar
  const events = tasks
    .filter((task) => task.dueDate) // Filtrează doar taskurile cu dată
    .map((task) => ({
      id: task._id,
      title: task.title,
      start: new Date(task.dueDate as string),
      end: new Date(task.dueDate as string),
      status: task.status,
      priority: task.priority,
      description: task.description,
      project: task.project,
      assignees: task.assignees,
    }))

  const handleProjectChange = (projectId: string) => {
    const project = projects.find((p) => p._id === projectId) || null
    setSelectedProject(project)
  }

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setShowEventDetails(true)
  }

  const loading = tasksLoading || projectsLoading

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-1" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[600px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">Vizualizează taskurile în format calendar</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="w-full sm:w-64">
            <Select value={selectedProject?._id || "all"} onValueChange={handleProjectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Toate proiectele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toate proiectele</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project._id} value={project._id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <CreateTaskDialog />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendar taskuri</CardTitle>
          <CardDescription>Vizualizează și gestionează taskurile în funcție de termenele limită</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            <CalendarComponent
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%" }}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={handleEventClick}
              views={["month", "week", "day", "agenda"]}
              messages={{
                today: "Azi",
                previous: "Înapoi",
                next: "Înainte",
                month: "Lună",
                week: "Săptămână",
                day: "Zi",
                agenda: "Agendă",
                date: "Dată",
                time: "Oră",
                event: "Eveniment",
                noEventsInRange: "Nu există taskuri în acest interval",
              }}
              culture="ro-RO"
            />
          </div>
        </CardContent>
      </Card>

      {/* Dialog pentru detalii eveniment */}
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              {selectedEvent?.project?.name && `Proiect: ${selectedEvent.project.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Status</h4>
              <Badge
                variant={
                  selectedEvent?.status === "completed"
                    ? "default"
                    : selectedEvent?.status === "in-progress"
                      ? "secondary"
                      : "outline"
                }
              >
                {selectedEvent?.status === "completed"
                  ? "Finalizat"
                  : selectedEvent?.status === "in-progress"
                    ? "În progres"
                    : "To Do"}
              </Badge>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Prioritate</h4>
              <Badge
                variant={
                  selectedEvent?.priority === "high"
                    ? "destructive"
                    : selectedEvent?.priority === "medium"
                      ? "default"
                      : "outline"
                }
              >
                {selectedEvent?.priority === "high"
                  ? "Ridicată"
                  : selectedEvent?.priority === "medium"
                    ? "Medie"
                    : "Scăzută"}
              </Badge>
            </div>
            {selectedEvent?.description && (
              <div>
                <h4 className="text-sm font-medium mb-1">Descriere</h4>
                <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium mb-1">Termen limită</h4>
              <p className="text-sm text-muted-foreground">
                {selectedEvent?.start && format(new Date(selectedEvent.start), "PPP", { locale: ro })}
              </p>
            </div>
            {selectedEvent?.assignees?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Asignați</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.assignees.map((assignee: any) => (
                    <Badge key={assignee._id} variant="outline">
                      {assignee.firstName} {assignee.lastName}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
