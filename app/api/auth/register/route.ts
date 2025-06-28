import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { User } from "@/lib/models/user"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password, role } = await req.json()

    // Validare
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Toate câmpurile sunt obligatorii" }, { status: 400 })
    }

    // Verificare rol valid
    if (role && !["admin", "manager", "member"].includes(role)) {
      return NextResponse.json({ error: "Rol invalid" }, { status: 400 })
    }

    // Conectare la baza de date
    await connectToDatabase()

    // Verificare dacă utilizatorul există deja
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "Există deja un utilizator cu acest email" }, { status: 400 })
    }

    // Verifică dacă este primul utilizator (va fi admin dacă nu se specifică altfel)
    const userCount = await User.countDocuments()
    const userRole = userCount === 0 ? "admin" : role || "member"

    // Criptare parolă
    const hashedPassword = await bcrypt.hash(password, 10)

    // Creare utilizator nou
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: userRole,
      status: "offline",
      tasks: 0,
    })

    await user.save()

    // Returnare utilizator fără parolă
    const userWithoutPassword = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
    }

    return NextResponse.json(
      { message: "Utilizator înregistrat cu succes", user: userWithoutPassword },
      { status: 201 },
    )
  } catch (error) {
    console.error("Eroare la înregistrare:", error)
    return NextResponse.json({ error: "Eroare la înregistrarea utilizatorului" }, { status: 500 })
  }
}
