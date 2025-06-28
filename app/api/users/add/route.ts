import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { User } from "@/lib/models/user"
import { checkPermission } from "@/lib/auth/permissions"
import { checkUserLimit } from "@/lib/services/user-service"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    // Verificare permisiuni
    const { hasPermission, user } = await checkPermission(req, "manage_team")

    if (!user) {
      return NextResponse.json({ error: "Autentificare necesară" }, { status: 401 })
    }

    if (!hasPermission) {
      return NextResponse.json({ error: "Nu ai permisiunea de a adăuga membri în echipă" }, { status: 403 })
    }

    // Tipăm manual user-ul pentru a include câmpurile necesare
    const typedUser = user as typeof user & { organizationId: string; plan: string }

    // Conectare la baza de date
    await connectToDatabase()

    // Verificăm dacă s-a atins limita de utilizatori pentru planul Free
    const limitReached = await checkUserLimit(typedUser.organizationId)

    if (limitReached && typedUser.plan === "free") {
      return NextResponse.json(
        {
          error:
            "Ai atins limita de 3 utilizatori pentru planul Free. Actualizează la planul Pro pentru a adăuga mai mulți utilizatori.",
          limitReached: true,
        },
        { status: 403 },
      )
    }

    // Obținere date utilizator
    const userData = await req.json()

    // Validare date
    if (!userData.email || !userData.firstName || !userData.lastName || !userData.password) {
      return NextResponse.json({ error: "Toate câmpurile sunt obligatorii" }, { status: 400 })
    }

    // Verificare dacă email-ul există deja
    const existingUser = await User.findOne({ email: userData.email })
    if (existingUser) {
      return NextResponse.json({ error: "Există deja un utilizator cu acest email" }, { status: 400 })
    }

    // Criptare parolă
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    // Creare utilizator nou
    const newUser = new User({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: hashedPassword,
      role: userData.role || "member",
      status: "active",
      organizationId: typedUser.organizationId,
      plan: typedUser.plan,
    })

    await newUser.save()

    // Returnare utilizator fără parolă
    const userResponse = { ...newUser.toObject(), password: undefined }

    return NextResponse.json({ message: "Utilizator adăugat cu succes", user: userResponse }, { status: 201 })
  } catch (error) {
    console.error("Eroare la adăugarea utilizatorului:", error)
    return NextResponse.json({ error: "Eroare la adăugarea utilizatorului" }, { status: 500 })
  }
}
