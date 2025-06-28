import { type NextRequest, NextResponse } from "next/server"
import { getUserFromToken } from "@/lib/auth/auth-utils"
import { NotificationService } from "@/lib/services/notification-service"
import type { IUser } from "@/lib/models/user"

// Șterge o notificare
export async function DELETE(
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

    // Șterge notificarea
    await NotificationService.deleteNotification(params.id, userId)

    return NextResponse.json({ message: "Notificarea a fost ștearsă" }, { status: 200 })
  } catch (error) {
    console.error("Eroare la ștergerea notificării:", error)
    return NextResponse.json({ error: "Eroare la ștergerea notificării" }, { status: 500 })
  }
}
