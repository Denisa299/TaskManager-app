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
import { useToast } from "@/components/ui/use-toast"
import { Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { PermissionGate } from "@/components/auth/permission-gate"

interface AddTeamMemberDialogProps {
  onMemberAdded: () => void
}

export function AddTeamMemberDialog({ onMemberAdded }: AddTeamMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "member",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Succes",
          description: data.message,
          variant: "default",
        })
        setOpen(false)
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          role: "member",
        })
        onMemberAdded()
      } else {
        toast({
          title: "Eroare",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Eroare la adăugarea membrului:", error)
      toast({
        title: "Eroare",
        description: "A apărut o eroare la adăugarea membrului",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PermissionGate permission="manage_users">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="sm:w-auto w-full">
            <Plus className="mr-2 h-4 w-4" /> Adaugă membru
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Adaugă un membru nou</DialogTitle>
              <DialogDescription>Completează informațiile pentru a adăuga un nou membru în echipă.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prenume</Label>
                  <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nume</Label>
                  <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Parolă</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selectează un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Doar administratorii pot crea alți administratori */}
                    {user?.role === "admin" && <SelectItem value="admin">Administrator</SelectItem>}
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="member">Membru</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Se procesează..." : "Adaugă membru"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PermissionGate>
  )
}
