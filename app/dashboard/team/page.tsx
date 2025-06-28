"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, Settings } from "lucide-react"
import { TeamMembers } from "@/components/dashboard/team-members"
import { AddTeamMemberDialog } from "@/components/dashboard/add-team-member-dialog"
import { useAuth } from "@/contexts/auth-context"
import { PermissionGate } from "@/components/auth/permission-gate"

export default function TeamPage() {
  const [showAddMember, setShowAddMember] = useState(false)
  const { user } = useAuth()

  // funcție apelată când se adaugă un membru nou
  const handleMemberAdded = () => {
    setShowAddMember(false)
    // aici poți adăuga logica de refresh, notificare etc.
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Echipă</h1>
          <p className="text-muted-foreground">Gestionează membrii echipei tale.</p>
        </div>
        <PermissionGate permission="manage_team">
          <Button onClick={() => setShowAddMember(true)} className="bg-gradient-to-r from-green-600 to-green-500">
            <UserPlus className="mr-2 h-4 w-4" />
            Adaugă membru
          </Button>
        </PermissionGate>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Membrii echipei</CardTitle>
          <CardDescription>Lista completă a membrilor echipei și rolurile lor.</CardDescription>
        </CardHeader>
        <CardContent>
          <TeamMembers />
        </CardContent>
      </Card>

      {/* Dialogul pentru adăugare membru */}
      {showAddMember && (
        <AddTeamMemberDialog onMemberAdded={handleMemberAdded} />
      )}
    </div>
  )
}
