import { type NextRequest, NextResponse } from "next/server"
import { getUserFromToken } from "@/lib/auth/auth-utils"
import { NotificationService } from "@/lib/services/notification-service"
import type { IUser } from "@/lib/models/user"

// Marchează o notificare ca citită
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificare autentificare
    const user = await getUserFromToken(req) as Partial<IUser>
    if (!user || !user._id) {
      return NextResponse.json({ error: "Autentificare necesară" }, { status: 401 })
    }

    const userId = typeof user._id === "string" ? user._id : user._id.toString()

    // Marchează notificarea ca citită
    const notification = await NotificationService.markAsRead(params.id, userId)

    if (!notification) {
      return NextResponse.json({ error: "Notificarea nu a fost găsită" }, { status: 404 })
    }

    return NextResponse.json(notification, { status: 200 })
  } catch (error) {
    console.error("Eroare la marcarea notificării ca citită:", error)
    return NextResponse.json({ error: "Eroare la marcarea notificării ca citită" }, { status: 500 })
  }
}
