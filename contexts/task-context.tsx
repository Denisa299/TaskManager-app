"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useProjects } from "./project-context"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  avatar?: string
  status: string
}

interface Project {
  _id: string
  name: string
}

interface Task {
  _id: string
  title: string
  description?: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  project: Project
  assignees: User[]
  dueDate?: string
  comments: number
  attachments: number
  subtasks: {
    total: number
    completed: number
  }
  createdBy: User
  createdAt: string
  updatedAt: string
}

interface CreateTaskData {
  title: string
  description?: string
  status?: "todo" | "in-progress" | "completed"
  priority?: "low" | "medium" | "high"
  project: string
  assignees?: string[]
  dueDate?: string
}

interface UpdateTaskData {
  title?: string
  description?: string
  status?: "todo" | "in-progress" | "completed"
  priority?: "low" | "medium" | "high"
  assignees?: string[]
  dueDate?: string
  subtasks?: {
    total: number
    completed: number
  }
}

interface TaskContextType {
  tasks: Task[]
  loading: boolean
  error: string | null
  fetchTasks: (projectId?: string) => Promise<void>
  createTask: (taskData: CreateTaskData) => Promise<Task | null>
  updateTask: (taskId: string, taskData: UpdateTaskData) => Promise<Task | null>
  deleteTask: (taskId: string) => Promise<boolean>
  getTasksByStatus: (status: "todo" | "in-progress" | "completed") => Task[]
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { selectedProject } = useProjects()

  const fetchTasks = async (projectId?: string) => {
    try {
      setLoading(true)
      setError(null)

      const url = new URL("/api/tasks", window.location.origin)

      // Adaugă projectId la query dacă este specificat sau dacă există un proiect selectat
      const projectToFetch = projectId || (selectedProject ? selectedProject._id : null)
      if (projectToFetch) {
        url.searchParams.append("projectId", projectToFetch)
      }

      const response = await fetch(url.toString())

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Eroare la încărcarea taskurilor")
      }

      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("Eroare la încărcarea taskurilor:", error)
      setError((error as Error).message)
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca taskurile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData: CreateTaskData): Promise<Task | null> => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Eroare la crearea taskului")
      }

      const newTask = await response.json()
      setTasks((prev) => [newTask, ...prev])
      toast({
        title: "Succes",
        description: "Task creat cu succes",
      })
      return newTask
    } catch (error) {
      console.error("Eroare la crearea taskului:", error)
      toast({
        title: "Eroare",
        description: (error as Error).message || "Eroare la crearea taskului",
        variant: "destructive",
      })
      return null
    }
  }

  const updateTask = async (taskId: string, taskData: UpdateTaskData): Promise<Task | null> => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Eroare la actualizarea taskului")
      }

      const updatedTask = await response.json()

      // Actualizează lista de taskuri
      setTasks((prev) => prev.map((task) => (task._id === taskId ? updatedTask : task)))

      toast({
        title: "Succes",
        description: "Task actualizat cu succes",
      })

      return updatedTask
    } catch (error) {
      console.error("Eroare la actualizarea taskului:", error)
      toast({
        title: "Eroare",
        description: (error as Error).message || "Eroare la actualizarea taskului",
        variant: "destructive",
      })
      return null
    }
  }

  const deleteTask = async (taskId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Eroare la ștergerea taskului")
      }

      // Elimină taskul din lista
      setTasks((prev) => prev.filter((task) => task._id !== taskId))

      toast({
        title: "Succes",
        description: "Task șters cu succes",
      })

      return true
    } catch (error) {
      console.error("Eroare la ștergerea taskului:", error)
      toast({
        title: "Eroare",
        description: (error as Error).message || "Eroare la ștergerea taskului",
        variant: "destructive",
      })
      return false
    }
  }

  const getTasksByStatus = (status: "todo" | "in-progress" | "completed") => {
    return tasks.filter((task) => task.status === status)
  }

  // Încarcă taskurile când se schimbă proiectul selectat
  useEffect(() => {
    if (selectedProject) {
      fetchTasks(selectedProject._id)
    }
  }, [selectedProject])

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        getTasksByStatus,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTasks trebuie utilizat în interiorul unui TaskProvider")
  }
  return context
}
