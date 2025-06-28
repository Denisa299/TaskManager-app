import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { User } from "@/lib/models/user"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

export async function GET(req: NextRequest) {
  try {
    // Obținere token din cookie
    const token = req.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Autentificare necesară" }, { status: 401 })
    }

    try {
      // Verificare token
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

      // Conectare la baza de date
      await connectToDatabase()

      // Găsire utilizator
      const user = await User.findById(decoded.userId, { password: 0 })

      if (!user) {
        return NextResponse.json({ error: "Utilizator negăsit" }, { status: 404 })
      }

      return NextResponse.json({ user }, { status: 200 })
    } catch (error) {
      return NextResponse.json({ error: "Token invalid" }, { status: 401 })
    }
  } catch (error) {
    console.error("Eroare la verificarea autentificării:", error)
    return NextResponse.json({ error: "Eroare la verificarea autentificării" }, { status: 500 })
  }
}
