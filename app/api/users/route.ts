import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { User } from "@/lib/models/user"
import { checkPermission } from "@/lib/auth/permissions"

export async function GET(req: NextRequest) {
  try {
    // Verificare permisiuni
    const { hasPermission, user } = await checkPermission(req, "view_team_data")

    if (!user) {
      return NextResponse.json({ error: "Autentificare necesară" }, { status: 401 })
    }

    if (!hasPermission) {
      return NextResponse.json({ error: "Nu ai permisiunea de a vedea membrii echipei" }, { status: 403 })
    }

    // Conectare la baza de date
    await connectToDatabase()

    // Obținere utilizatori fără parolă
    const users = await User.find({}, { password: 0 })

    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    console.error("Eroare la obținerea utilizatorilor:", error)
    return NextResponse.json({ error: "Eroare la obținerea utilizatorilor" }, { status: 500 })
  }
}
