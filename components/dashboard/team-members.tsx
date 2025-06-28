"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Mail, Phone } from "lucide-react"
import { UserIcon } from "@heroicons/react/24/solid"

interface TeamMember {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  status: string
  tasks: number
  avatar?: string
}

export function TeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/users")

        if (response.ok) {
          const data = await response.json()
          setMembers(data)
        } else {
          toast({
            title: "Eroare",
            description: "Nu s-au putut încărca membrii echipei",
            variant: "destructive",
          })
        }
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    )
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nu există membri în echipă. Invită colegi pentru a începe colaborarea.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {members.map((member) => {
        return (
          <div
            key={member._id}
            className="flex items-center justify-between border-b pb-4 group hover:bg-gray-50 p-4 rounded-md transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                <UserIcon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="font-medium text-lg">
                  {member.firstName} {member.lastName}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {member.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  Număr de telefon
                </div>
                <Badge
                  variant="secondary"
                  className={`${member.status === "online" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}
                >
                  {member.status === "online" ? "" : ""}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-600 group-hover:bg-green-200 transition-colors duration-200"
              >
                {member.tasks} taskuri
              </Badge>
            </div>
          </div>
        )
      })}
    </div>
  )
}
