"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

interface Project {
  _id: string
  name: string
  description?: string
  members: User[]
  createdBy: User
  createdAt: string
  updatedAt: string
}

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  avatar?: string
  status: string
}

interface ProjectContextType {
  projects: Project[]
  loading: boolean
  error: string | null
  selectedProject: Project | null
  setSelectedProject: (project: Project | null) => void
  fetchProjects: () => Promise<void>
  createProject: (projectData: CreateProjectData) => Promise<Project | null>
}

interface CreateProjectData {
  name: string
  description?: string
  members?: string[]
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const { toast } = useToast()

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/projects")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Eroare la încărcarea proiectelor")
      }

      const data = await response.json()
      setProjects(data)

      // Selectează primul proiect dacă nu există unul selectat
      if (data.length > 0 && !selectedProject) {
        setSelectedProject(data[0])
      }
    } catch (error) {
      console.error("Eroare la încărcarea proiectelor:", error)
      setError((error as Error).message)
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca proiectele",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData: CreateProjectData): Promise<Project | null> => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Eroare la crearea proiectului")
      }

      const newProject = await response.json()
      setProjects((prev) => [newProject, ...prev])
      toast({
        title: "Succes",
        description: "Proiect creat cu succes",
      })
      return newProject
    } catch (error) {
      console.error("Eroare la crearea proiectului:", error)
      toast({
        title: "Eroare",
        description: (error as Error).message || "Eroare la crearea proiectului",
        variant: "destructive",
      })
      return null
    }
  }

  // Încarcă proiectele la montarea componentei
  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        error,
        selectedProject,
        setSelectedProject,
        fetchProjects,
        createProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProjects trebuie utilizat în interiorul unui ProjectProvider")
  }
  return context
}
