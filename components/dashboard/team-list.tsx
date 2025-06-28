"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Mail, Phone, Shield } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import { PermissionGate } from "@/components/auth/permission-gate"
import { stringToColor } from "@/lib/utils"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  status: string
  tasks: number
  avatar?: string
  createdAt: string
}

export function TeamList() {
  const [members, setMembers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/users")

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Eroare la încărcarea membrilor echipei")
        }

        const data = await response.json()
        setMembers(data)
      } catch (error) {
        console.error("Eroare la încărcarea membrilor:", error)
        toast({
          title: "Eroare",
          description: "Nu s-au putut încărca membrii echipei",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [toast])

  const handleDeleteMember = async (memberId: string) => {
    // Implementare pentru ștergerea unui membru
    try {
      const response = await fetch(`/api/users/${memberId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Eroare la ștergerea membrului")
      }

      // Actualizează lista de membri
      setMembers((prev) => prev.filter((member) => member._id !== memberId))

      toast({
        title: "Succes",
        description: "Membru șters cu succes",
      })
    } catch (error) {
      console.error("Eroare la ștergerea membrului:", error)
      toast({
        title: "Eroare",
        description: (error as Error).message || "Eroare la ștergerea membrului",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Nu există membri în echipă</h3>
        <p className="text-muted-foreground mb-6">Invită colegi pentru a începe colaborarea.</p>
        <PermissionGate permission="manage_users">
          <Button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600">
            Invită membri
          </Button>
        </PermissionGate>
      </div>
    )
  }

  // Formatare dată pentru afișare
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ro-RO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  // Obține iconița pentru rol
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-red-500" />
      case "manager":
        return <Shield className="h-4 w-4 text-amber-500" />
      default:
        return <Shield className="h-4 w-4 text-green-500" />
    }
  }

  // Obține eticheta pentru rol
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator"
      case "manager":
        return "Manager"
      default:
        return "Membru"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member) => {
        // Generează o culoare consistentă pentru avatar bazată pe numele membrului
        const avatarColor = stringToColor(`${member.firstName} ${member.lastName}`)

        return (
          <Card key={member._id} className="group hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12 transition-all duration-300 group-hover:scale-105">
                      <AvatarImage
                        src={member.avatar || "/placeholder.svg?height=48&width=48&query=user"}
                        alt={`${member.firstName} ${member.lastName}`}
                      />
                      <AvatarFallback className={`bg-gradient-to-r ${avatarColor} text-white`}>
                        {member.firstName.charAt(0)}
                        {member.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                        member.status === "online" ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {member.firstName} {member.lastName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      {getRoleIcon(member.role)}
                      {getRoleLabel(member.role)}
                    </CardDescription>
                  </div>
                </div>
                <PermissionGate permission="manage_users">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-70 group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Opțiuni</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
                      <DropdownMenuItem>Vizualizează profil</DropdownMenuItem>
                      <DropdownMenuItem>Editează</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteMember(member._id)}
                        disabled={member._id === user?._id} // Nu permite ștergerea propriului cont
                      >
                        Elimină din echipă
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </PermissionGate>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Număr de telefon</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <Badge variant="outline">Membru din {member.createdAt ? formatDate(member.createdAt) : "N/A"}</Badge>
                  
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
