"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useProjects } from "@/contexts/project-context"
import { useTasks } from "@/contexts/task-context"
import { Plus } from "lucide-react"
import { MultiSelect } from "@/components/ui/multi-select"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ro } from "date-fns/locale"
import { cn } from "@/lib/utils"

export function CreateTaskDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<{ value: string; label: string }[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [date, setDate] = useState<Date | undefined>(undefined)
  const { projects, selectedProject } = useProjects()
  const { createTask } = useTasks()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    project: "",
  })

  // Setează proiectul selectat ca implicit
  useEffect(() => {
    if (selectedProject) {
      setFormData((prev) => ({ ...prev, project: selectedProject._id }))
    }
  }, [selectedProject])

  // Încarcă utilizatorii pentru selectarea membrilor
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users")
        if (response.ok) {
          const data = await response.json()
          const formattedUsers = data.map((user: any) => ({
            value: user._id,
            label: `${user.firstName} ${user.lastName}`,
          }))
          setUsers(formattedUsers)
        }
      } catch (error) {
        console.error("Eroare la încărcarea utilizatorilor:", error)
      }
    }

    fetchUsers()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createTask({
        title: formData.title,
        description: formData.description,
        status: formData.status as "todo" | "in-progress" | "completed",
        priority: formData.priority as "low" | "medium" | "high",
        project: formData.project,
        assignees: selectedUsers.length > 0 ? selectedUsers : undefined,
        dueDate: date ? date.toISOString() : undefined,
      })

      if (result) {
        setOpen(false)
        setFormData({
          title: "",
          description: "",
          status: "todo",
          priority: "medium",
          project: selectedProject ? selectedProject._id : "",
        })
        setSelectedUsers([])
        setDate(undefined)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="sm:w-auto w-full">
          <Plus className="mr-2 h-4 w-4" /> Creează task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Creează un task nou</DialogTitle>
            <DialogDescription>Completează detaliile pentru a crea un task nou.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titlu</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Titlul taskului"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descriere</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descrierea taskului"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selectează status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">În Progres</SelectItem>
                    <SelectItem value="completed">Finalizat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Prioritate</Label>
                <Select value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Selectează prioritate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Scăzută</SelectItem>
                    <SelectItem value="medium">Medie</SelectItem>
                    <SelectItem value="high">Ridicată</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project">Proiect</Label>
              <Select value={formData.project} onValueChange={(value) => handleSelectChange("project", value)} required>
                <SelectTrigger id="project">
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignees">Asignați</Label>
              <MultiSelect
                options={users}
                selected={selectedUsers}
                onChange={setSelectedUsers}
                placeholder="Selectează membrii"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Termen limită</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: ro }) : <span>Selectează data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Se procesează..." : "Creează task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
