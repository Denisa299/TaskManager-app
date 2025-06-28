"use client"

import { KanbanBoard } from "@/components/dashboard/kanban-board"
import { LayoutGrid, List } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateTaskDialog } from "@/components/dashboard/create-task-dialog"
import { useProjects } from "@/contexts/project-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTasks } from "@/contexts/task-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function TasksPage() {
  const { projects, loading: projectsLoading, selectedProject, setSelectedProject } = useProjects()
  const { fetchTasks } = useTasks()

  const handleProjectChange = (projectId: string) => {
    const project = projects.find((p) => p._id === projectId) || null
    setSelectedProject(project)
    if (project) {
      fetchTasks(project._id)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Taskuri</h1>
          <p className="text-muted-foreground">Gestionează și organizează taskurile tale</p>
        </div>
        <CreateTaskDialog />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="w-full sm:w-64">
          {projectsLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={selectedProject?._id || ""} onValueChange={handleProjectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selectează proiect" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project._id} value={project._id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <Tabs defaultValue="board">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="board">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Board
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="mr-2 h-4 w-4" />
              Listă
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="board" className="mt-4">
          <KanbanBoard />
        </TabsContent>
        <TabsContent value="list" className="mt-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <p className="text-center text-muted-foreground">Vizualizarea de tip listă va fi disponibilă în curând.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
