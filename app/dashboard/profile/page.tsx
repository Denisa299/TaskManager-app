"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Mail, MapPin, Phone, User } from "lucide-react"
import { AvatarUpload } from "@/components/ui/avatar-upload"
import { stringToColor } from "@/lib/utils"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: "", // Valoare implicită, se poate actualiza din API dacă există
        location: "", // Valoare implicită, se poate actualiza din API dacă există
        bio: "", // Valoare implicită, se poate actualiza din API dacă există
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (file: File | null, previewUrl?: string) => {
    setAvatarFile(file)

    // Actualizează datele profilului cu URL-ul de previzualizare
    if (previewUrl) {
      // Simulăm actualizarea profilului cu noul avatar
      console.log("Avatar preview URL:", previewUrl)

      // Aici am putea face un apel API pentru a actualiza avatarul în backend
      // Dar pentru moment doar simulăm actualizarea
      toast({
        title: "Avatar actualizat",
        description: "Avatarul tău a fost actualizat cu succes (simulare)",
      })
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Aici ar trebui să fie un apel API pentru a salva datele
      // Dacă există un fișier avatar, ar trebui încărcat
      if (avatarFile) {
        // Simulăm încărcarea avatarului
        console.log("Încărcare avatar:", avatarFile.name)
      }

      // Simulăm un apel API cu un timeout
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profil actualizat",
        description: "Profilul tău a fost actualizat cu succes",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza profilul",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Generează inițiale pentru avatar
  const getInitials = () => {
    if (!user) return "U"
    const firstInitial = user.firstName?.charAt(0).toUpperCase() || ""
    const lastInitial = user.lastName?.charAt(0).toUpperCase() || ""
    return `${firstInitial}${lastInitial}` || "U"
  }

  // Generează o culoare consistentă pentru avatar bazată pe numele utilizatorului
  const avatarColor = user ? stringToColor(`${user.firstName} ${user.lastName}`) : "from-green-600 to-green-500"

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Profil</h1>
        <p className="text-muted-foreground">Vizualizează și editează informațiile profilului tău</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview">Prezentare generală</TabsTrigger>
          <TabsTrigger value="edit">Editare profil</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Profilul meu</CardTitle>
              <CardDescription>Informațiile tale personale și de contact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-32 w-32 transition-all duration-300 hover:scale-105 shadow-md">
                    <AvatarImage src={user?.avatar || ""} alt="Avatar" />
                    <AvatarFallback className={`text-4xl bg-gradient-to-r ${avatarColor} text-white font-semibold`}>
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h2 className="text-xl font-bold">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <Badge variant="outline" className="mt-1">
                      {user?.role === "admin" ? "Administrator" : user?.role === "manager" ? "Manager" : "Membru"}
                    </Badge>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Nume complet</div>
                        <div className="font-medium">
                          {user?.firstName} {user?.lastName}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Email</div>
                        <div className="font-medium">{user?.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Telefon</div>
                        <div className="font-medium">{profileData.phone || "Nespecificat"}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Locație</div>
                        <div className="font-medium">{profileData.location || "Nespecificat"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm text-muted-foreground">Membru din</div>
                    </div>
                    <div className="font-medium">Aprilie 2025</div>
                  </div>

                  {profileData.bio && (
                    <div className="pt-4 border-t">
                      <div className="text-sm text-muted-foreground mb-2">Despre mine</div>
                      <div>{profileData.bio}</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => document.getElementById("edit-tab")?.click()}
                className="hover:bg-green-50 hover:text-green-600 hover:border-green-200"
              >
                Editează profilul
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="edit" id="edit-tab">
          <Card>
            <CardHeader>
              <CardTitle>Editează profilul</CardTitle>
              <CardDescription>Actualizează informațiile profilului tău</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex flex-col items-center gap-2">
                  <AvatarUpload
                    initialImage={user?.avatar}
                    firstName={user?.firstName || ""}
                    lastName={user?.lastName || ""}
                    onImageChange={handleAvatarChange}
                    size="lg"
                  />
                  <p className="text-xs text-muted-foreground text-center max-w-[150px]">
                    Click pe avatar pentru a schimba imaginea de profil
                  </p>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prenume</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleChange}
                        className="focus-visible:ring-green-500 border-green-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nume</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleChange}
                        className="focus-visible:ring-green-500 border-green-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleChange}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-muted-foreground">Adresa de email nu poate fi modificată</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleChange}
                        placeholder="Adaugă număr de telefon"
                        className="focus-visible:ring-green-500 border-green-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Locație</Label>
                      <Input
                        id="location"
                        name="location"
                        value={profileData.location}
                        onChange={handleChange}
                        placeholder="Adaugă locația"
                        className="focus-visible:ring-green-500 border-green-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Despre mine</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Scrie câteva cuvinte despre tine..."
                      value={profileData.bio}
                      onChange={handleChange}
                      rows={3}
                      className="focus-visible:ring-green-500 border-green-200 resize-none"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => document.getElementById("overview-tab")?.click()}
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                Anulează
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
              >
                {isSaving ? "Se salvează..." : "Salvează modificările"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
