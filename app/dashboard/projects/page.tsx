"use client"

import { useProjects } from "@/contexts/project-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreateProjectDialog } from "@/components/dashboard/create-project-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { ro } from "date-fns/locale"
import Link from "next/link"
import { ArrowRight, Users } from "lucide-react"

export default function ProjectsPage() {
  const { projects, loading, error } = useProjects()

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: ro })
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2 text-red-500">Eroare la încărcarea proiectelor</h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Reîncarcă</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Proiecte</h1>
          <p className="text-muted-foreground">Gestionează proiectele tale și ale echipei</p>
        </div>
        <CreateProjectDialog />
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Nu există proiecte</h3>
          <p className="text-muted-foreground mb-6">Creează primul tău proiect pentru a începe.</p>
          <CreateProjectDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2">{project.name}</CardTitle>
                <CardDescription className="line-clamp-3">{project.description || "Fără descriere"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge variant="outline" className="flex items-center gap-1 w-fit">
                  <Users className="h-3 w-3" />
                  {project.members.length} {project.members.length === 1 ? "membru" : "membri"}
                </Badge>
                <p className="text-xs text-muted-foreground">Creat pe {formatDate(project.createdAt)}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/dashboard/tasks?project=${project._id}`} className="w-full">
                  <Button variant="outline" className="w-full group">
                    Vezi taskuri
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
