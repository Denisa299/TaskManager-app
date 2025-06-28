import { type NextRequest, NextResponse } from "next/server"
import { getUserFromToken } from "@/lib/auth/auth-utils"
import { NotificationService } from "@/lib/services/notification-service"
import type { IUser } from "@/lib/models/user"

// Obține notificările utilizatorului
export async function GET(req: NextRequest) {
  try {
    // Verificare autentificare
    const user = await getUserFromToken(req) as Partial<IUser>
    if (!user || !user._id) {
      return NextResponse.json({ error: "Autentificare necesară" }, { status: 401 })
    }

    const userId = typeof user._id === "string" ? user._id : user._id.toString()

    // Parametri de paginare
    const { searchParams } = new URL(req.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Obține notificările
    const notifications = await NotificationService.getUserNotifications(userId, limit, offset)

    return NextResponse.json(notifications, { status: 200 })
  } catch (error) {
    console.error("Eroare la obținerea notificărilor:", error)
    return NextResponse.json({ error: "Eroare la obținerea notificărilor" }, { status: 500 })
  }
}
