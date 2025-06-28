"use client"

import type React from "react"

import { useState } from "react"
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
import { Plus } from "lucide-react"
import { MultiSelect } from "@/components/ui/multi-select"
import { useEffect } from "react"

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<{ value: string; label: string }[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const { createProject } = useProjects()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  // Încarcă utilizatorii pentru selectarea membrilor
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users")
        if (response.ok) {
          const data = await response.json()
          const formattedUsers = data.map((user: any) => ({
            value: user._id,
            label: `${user.firstName} ${user.lastName} (${user.email})`,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createProject({
        name: formData.name,
        description: formData.description,
        members: selectedUsers.length > 0 ? selectedUsers : undefined,
      })

      if (result) {
        setOpen(false)
        setFormData({
          name: "",
          description: "",
        })
        setSelectedUsers([])
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="sm:w-auto w-full">
          <Plus className="mr-2 h-4 w-4" /> Proiect nou
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Creează un proiect nou</DialogTitle>
            <DialogDescription>Completează detaliile pentru a crea un proiect nou.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nume proiect</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Numele proiectului"
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
                placeholder="Descrierea proiectului"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="members">Membri</Label>
              <MultiSelect
                options={users}
                selected={selectedUsers}
                onChange={setSelectedUsers}
                placeholder="Selectează membrii"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Se procesează..." : "Creează proiect"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
