import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { User } from "@/lib/models/user"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Validare
    if (!email || !password) {
      return NextResponse.json({ error: "Email și parola sunt obligatorii" }, { status: 400 })
    }

    // Conectare la baza de date
    await connectToDatabase()

    // Găsire utilizator
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "Credențiale invalide" }, { status: 401 })
    }

    // Verificare parolă
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Credențiale invalide" }, { status: 401 })
    }

    // Actualizare status
    user.status = "online"
    await user.save()

    // Generare token JWT
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" })

    // Returnare utilizator fără parolă
    const userWithoutPassword = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      tasks: user.tasks,
    }

    // Setare cookie pentru token
    const response = NextResponse.json({ message: "Autentificare reușită", user: userWithoutPassword }, { status: 200 })

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 zile
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Eroare la autentificare:", error)
    return NextResponse.json({ error: "Eroare la autentificarea utilizatorului" }, { status: 500 })
  }
}
