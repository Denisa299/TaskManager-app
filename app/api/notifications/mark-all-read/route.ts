import { type NextRequest, NextResponse } from "next/server"
import { getUserFromToken } from "@/lib/auth/auth-utils"
import { NotificationService } from "@/lib/services/notification-service"
import type { IUser } from "@/lib/models/user"

// Marchează toate notificările ca citite
export async function PUT(req: NextRequest) {
  try {
    // Verificare autentificare
    const user = await getUserFromToken(req) as Partial<IUser>
    if (!user || !user._id) {
      return NextResponse.json({ error: "Autentificare necesară" }, { status: 401 })
    }

    const userId = typeof user._id === "string" ? user._id : user._id.toString()

    // Marchează toate notificările ca citite
    await NotificationService.markAllAsRead(userId)

    return NextResponse.json({ message: "Toate notificările au fost marcate ca citite" }, { status: 200 })
  } catch (error) {
    console.error("Eroare la marcarea tuturor notificărilor ca citite:", error)
    return NextResponse.json({ error: "Eroare la marcarea tuturor notificărilor ca citite" }, { status: 500 })
  }
}
