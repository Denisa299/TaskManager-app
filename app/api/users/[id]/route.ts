import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { User } from "@/lib/models/user"
import { checkPermission } from "@/lib/auth/permissions"

// Șterge un utilizator
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificare permisiuni
    const { hasPermission, user } = await checkPermission(req, "manage_users")

    if (!user) {
      return NextResponse.json({ error: "Autentificare necesară" }, { status: 401 })
    }

    if (!hasPermission) {
      return NextResponse.json({ error: "Nu ai permisiunea de a șterge utilizatori" }, { status: 403 })
    }

    // Asigură-te că user._id este convertit la string pentru comparație
    const userIdString = typeof user._id === "string" ? user._id : user._id?.toString?.()

    // Verifică dacă utilizatorul încearcă să se șteargă pe sine
    if (params.id === userIdString) {
      return NextResponse.json({ error: "Nu îți poți șterge propriul cont" }, { status: 400 })
    }

    // Conectare la baza de date
    await connectToDatabase()

    // Verifică dacă utilizatorul există
    const userToDelete = await User.findById(params.id)
    if (!userToDelete) {
      return NextResponse.json({ error: "Utilizatorul nu a fost găsit" }, { status: 404 })
    }

    // Verifică dacă utilizatorul este admin și nu ești admin
    if (userToDelete.role === "admin" && user.role !== "admin") {
      return NextResponse.json({ error: "Nu poți șterge un administrator" }, { status: 403 })
    }

    // Șterge utilizatorul
    await User.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Utilizator șters cu succes" }, { status: 200 })
  } catch (error) {
    console.error("Eroare la ștergerea utilizatorului:", error)
    return NextResponse.json({ error: "Eroare la ștergerea utilizatorului" }, { status: 500 })
  }
}
