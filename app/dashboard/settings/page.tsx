"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/contexts/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [profileLoading, setProfileLoading] = useState(false)
  const [securityLoading, setSecurityLoading] = useState(false)
  const [notificationsLoading, setNotificationsLoading] = useState(false)

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    bio: "",
  })

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    taskAssigned: true,
    taskUpdated: true,
    projectUpdated: true,
    weeklyDigest: false,
  })

  // Actualizează formularele când utilizatorul este încărcat
  useState(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        role: user.role || "",
        bio: "",
      })
    }
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSecurityForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)

    // Simulează actualizarea profilului
    setTimeout(() => {
      toast({
        title: "Profil actualizat",
        description: "Profilul tău a fost actualizat cu succes.",
      })
      setProfileLoading(false)
    }, 1000)
  }

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast({
        title: "Eroare",
        description: "Parolele noi nu coincid.",
        variant: "destructive",
      })
      return
    }

    setSecurityLoading(true)

    // Simulează actualizarea parolei
    setTimeout(() => {
      toast({
        title: "Parolă actualizată",
        description: "Parola ta a fost actualizată cu succes.",
      })
      setSecurityLoading(false)
      setSecurityForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }, 1000)
  }

  const handleNotificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNotificationsLoading(true)

    // Simulează actualizarea setărilor de notificări
    setTimeout(() => {
      toast({
        title: "Setări actualizate",
        description: "Setările de notificări au fost actualizate cu succes.",
      })
      setNotificationsLoading(false)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>

        <Skeleton className="h-12 w-full max-w-md" />

        <div className="grid gap-6">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Setări</h1>
        <p className="text-muted-foreground">Gestionează setările contului tău</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="security">Securitate</TabsTrigger>
          <TabsTrigger value="notifications">Notificări</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleProfileSubmit}>
              <CardHeader>
                <CardTitle>Profil</CardTitle>
                <CardDescription>
                  Actualizează informațiile profilului tău. Aceste informații vor fi vizibile pentru alți membri ai
                  echipei.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={user?.avatar || "/placeholder.svg?height=96&width=96&query=user"}
                        alt="Avatar"
                      />
                      <AvatarFallback className="text-2xl">
                        {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" type="button">
                      Schimbă avatar
                    </Button>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prenume</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={profileForm.firstName}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nume</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={profileForm.lastName}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Rol</Label>
                      <Select
                        value={profileForm.role}
                        onValueChange={(value) => setProfileForm((prev) => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Selectează rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Administrator">Administrator</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Member">Membru</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Scrie câteva cuvinte despre tine..."
                        value={profileForm.bio}
                        onChange={handleProfileChange}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={profileLoading}>
                  {profileLoading ? "Se salvează..." : "Salvează modificările"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <form onSubmit={handleSecuritySubmit}>
              <CardHeader>
                <CardTitle>Securitate</CardTitle>
                <CardDescription>
                  Actualizează parola contului tău. Îți recomandăm să folosești o parolă puternică pe care nu o
                  folosești în altă parte.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Parola curentă</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={securityForm.currentPassword}
                    onChange={handleSecurityChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Parola nouă</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={securityForm.newPassword}
                    onChange={handleSecurityChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmă parola nouă</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={securityForm.confirmPassword}
                    onChange={handleSecurityChange}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={securityLoading}>
                  {securityLoading ? "Se actualizează..." : "Actualizează parola"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <form onSubmit={handleNotificationsSubmit}>
              <CardHeader>
                <CardTitle>Notificări</CardTitle>
                <CardDescription>
                  Configurează preferințele tale de notificări. Poți dezactiva oricând notificările.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificări prin email</p>
                    <p className="text-sm text-muted-foreground">Primește notificări prin email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Task asignat</p>
                    <p className="text-sm text-muted-foreground">Primește notificări când ți se asignează un task</p>
                  </div>
                  <Switch
                    checked={notificationSettings.taskAssigned}
                    onCheckedChange={(checked) => handleNotificationChange("taskAssigned", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Task actualizat</p>
                    <p className="text-sm text-muted-foreground">Primește notificări când un task este actualizat</p>
                  </div>
                  <Switch
                    checked={notificationSettings.taskUpdated}
                    onCheckedChange={(checked) => handleNotificationChange("taskUpdated", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Proiect actualizat</p>
                    <p className="text-sm text-muted-foreground">Primește notificări când un proiect este actualizat</p>
                  </div>
                  <Switch
                    checked={notificationSettings.projectUpdated}
                    onCheckedChange={(checked) => handleNotificationChange("projectUpdated", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rezumat săptămânal</p>
                    <p className="text-sm text-muted-foreground">Primește un rezumat săptămânal al activității</p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyDigest}
                    onCheckedChange={(checked) => handleNotificationChange("weeklyDigest", checked)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={notificationsLoading}>
                  {notificationsLoading ? "Se salvează..." : "Salvează preferințele"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
