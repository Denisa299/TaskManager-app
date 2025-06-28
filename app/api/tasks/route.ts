import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { Task } from "@/lib/models/task"
import { getUserFromToken } from "@/lib/auth/auth-utils"
import { hasPermission } from "@/lib/auth/permissions"

// Obține toate taskurile
export async function GET(req: NextRequest) {
  try {
    // Verificare autentificare
    const user = await getUserFromToken(req)
    if (!user) {
      return NextResponse.json({ error: "Autentificare necesară" }, { status: 401 })
    }

    // Conectare la baza de date
    await connectToDatabase()

    // Parametri de filtrare
    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get("projectId")
    const status = searchParams.get("status")

    // Construiește query-ul în funcție de permisiuni
    let query: any = {}

    // Administratorii pot vedea toate taskurile
    if (hasPermission(user, "manage_all_tasks")) {
      // Nu adăugăm filtre pentru utilizator, vor vedea toate taskurile
    }
    // Managerii pot vedea taskurile create de ei și cele asignate lor
    else if (hasPermission(user, "assign_tasks")) {
      query = {
        $or: [{ assignees: user._id }, { createdBy: user._id }],
      }
    }
    // Membrii pot vedea doar taskurile asignate lor
    else {
      query = { assignees: user._id }
    }

    // Adaugă filtrele suplimentare
    if (projectId) {
      query.project = projectId
    }

    if (status) {
      query.status = status
    }

    // Obține taskurile
    const tasks = await Task.find(query)
      .populate("assignees", "firstName lastName email avatar status")
      .populate("project", "name")
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 })

    return NextResponse.json(tasks, { status: 200 })
  } catch (error) {
    console.error("Eroare la obținerea taskurilor:", error)
    return NextResponse.json({ error: "Eroare la obținerea taskurilor" }, { status: 500 })
  }
}

// Creează un task nou
export async function POST(req: NextRequest) {
  try {
    // Verificare autentificare
    const user = await getUserFromToken(req)
    if (!user) {
      return NextResponse.json({ error: "Autentificare necesară" }, { status: 401 })
    }

    // Verifică dacă utilizatorul are permisiunea de a crea taskuri
    if (!hasPermission(user, "assign_tasks") && !hasPermission(user, "manage_all_tasks")) {
      return NextResponse.json({ error: "Nu ai permisiunea de a crea taskuri" }, { status: 403 })
    }

    const { title, description, status, priority, project, assignees, dueDate } = await req.json()

    // Validare
    if (!title || !project) {
      return NextResponse.json({ error: "Titlul și proiectul sunt obligatorii" }, { status: 400 })
    }

    // Conectare la baza de date
    await connectToDatabase()

    // Creează task nou
    const task = new Task({
      title,
      description,
      status: status || "todo",
      priority: priority || "medium",
      project,
      assignees: assignees || [user._id],
      dueDate: dueDate ? new Date(dueDate) : undefined,
      comments: 0,
      attachments: 0,
      subtasks: {
        total: 0,
        completed: 0,
      },
      createdBy: user._id,
    })

    await task.save()

    // Populează câmpurile pentru răspuns
    const populatedTask = await Task.findById(task._id)
      .populate("assignees", "firstName lastName email avatar status")
      .populate("project", "name")
      .populate("createdBy", "firstName lastName email")

    return NextResponse.json(populatedTask, { status: 201 })
  } catch (error) {
    console.error("Eroare la crearea taskului:", error)
    return NextResponse.json({ error: "Eroare la crearea taskului" }, { status: 500 })
  }
}
