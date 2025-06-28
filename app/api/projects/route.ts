import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { Project } from "@/lib/models/project"
import { getUserFromToken } from "@/lib/auth/auth-utils"
import { hasPermission } from "@/lib/auth/permissions"

// Obține toate proiectele
export async function GET(req: NextRequest) {
  try {
    // Verificare autentificare
    const user = await getUserFromToken(req)
    if (!user) {
      return NextResponse.json({ error: "Autentificare necesară" }, { status: 401 })
    }

    // Conectare la baza de date
    await connectToDatabase()

    // Construiește query-ul în funcție de permisiuni
    let query = {}

    // Administratorii pot vedea toate proiectele
    if (hasPermission(user, "manage_all_projects")) {
      // Nu adăugăm filtre, vor vedea toate proiectele
    }
    // Managerii pot vedea proiectele create de ei și cele la care sunt membri
    else if (hasPermission(user, "manage_own_projects")) {
      query = {
        $or: [{ members: user._id }, { createdBy: user._id }],
      }
    }
    // Membrii pot vedea doar proiectele la care sunt asignați
    else {
      query = { members: user._id }
    }

    // Obține proiectele
    const projects = await Project.find(query)
      .populate("members", "firstName lastName email avatar status")
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 })

    return NextResponse.json(projects, { status: 200 })
  } catch (error) {
    console.error("Eroare la obținerea proiectelor:", error)
    return NextResponse.json({ error: "Eroare la obținerea proiectelor" }, { status: 500 })
  }
}

// Creează un proiect nou
export async function POST(req: NextRequest) {
  try {
    // Verificare autentificare
    const user = await getUserFromToken(req)
    if (!user) {
      return NextResponse.json({ error: "Autentificare necesară" }, { status: 401 })
    }

    // Verifică dacă utilizatorul are permisiunea de a crea proiecte
    if (!hasPermission(user, "create_projects") && !hasPermission(user, "manage_all_projects")) {
      return NextResponse.json({ error: "Nu ai permisiunea de a crea proiecte" }, { status: 403 })
    }

    const { name, description, members } = await req.json()

    // Validare
    if (!name) {
      return NextResponse.json({ error: "Numele proiectului este obligatoriu" }, { status: 400 })
    }

    // Conectare la baza de date
    await connectToDatabase()

    // Creează proiect nou
    const project = new Project({
      name,
      description,
      members: members || [user._id],
      createdBy: user._id,
    })

    await project.save()

    // Populează membrii și creatorul pentru răspuns
    const populatedProject = await Project.findById(project._id)
      .populate("members", "firstName lastName email avatar status")
      .populate("createdBy", "firstName lastName email")

    return NextResponse.json(populatedProject, { status: 201 })
  } catch (error) {
    console.error("Eroare la crearea proiectului:", error)
    return NextResponse.json({ error: "Eroare la crearea proiectului" }, { status: 500 })
  }
}
