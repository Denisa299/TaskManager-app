import { type NextRequest, NextResponse } from "next/server"
import { getUserFromToken } from "@/lib/auth/auth-utils"
import { NotificationService } from "@/lib/services/notification-service"

// Obține numărul de notificări necitite
export async function GET(req: NextRequest) {
  try {
    // Verificare autentificare
    const user = await getUserFromToken(req)
    if (!user) {
      return NextResponse.json({ error: "Autentificare necesară" }, { status: 401 })
    }

    // Obține numărul de notificări necitite
    const count = await NotificationService.getUnreadCount((user as any).id.toString())


    return NextResponse.json({ count }, { status: 200 })
  } catch (error) {
    console.error("Eroare la obținerea numărului de notificări necitite:", error)
    return NextResponse.json({ error: "Eroare la obținerea numărului de notificări necitite" }, { status: 500 })
  }
}
