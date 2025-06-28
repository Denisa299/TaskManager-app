import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { User } from "@/lib/models/user"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

export async function POST(req: NextRequest) {
  try {
    // Obținere token din cookie
    const token = req.cookies.get("token")?.value

    if (token) {
      try {
        // Verificare token
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

        // Conectare la baza de date
        await connectToDatabase()

        // Actualizare status utilizator
        await User.findByIdAndUpdate(decoded.userId, { status: "offline" })
      } catch (error) {
        console.error("Eroare la decodarea token-ului:", error)
      }
    }

    // Ștergere cookie token
    const response = NextResponse.json({ message: "Deconectare reușită" }, { status: 200 })

    response.cookies.delete("token")

    return response
  } catch (error) {
    console.error("Eroare la deconectare:", error)
    return NextResponse.json({ error: "Eroare la deconectarea utilizatorului" }, { status: 500 })
  }
}
