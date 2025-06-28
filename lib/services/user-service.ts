import { connectToDatabase } from "@/lib/db/mongodb"
import { User } from "@/lib/models/user"

export async function getUserCount() {
  try {
    await connectToDatabase()
    const count = await User.countDocuments()
    return count
  } catch (error) {
    console.error("Eroare la numărarea utilizatorilor:", error)
    throw error
  }
}

export async function checkUserLimit(organizationId: string) {
  try {
    await connectToDatabase()
    const count = await User.countDocuments({ organizationId })

    // Verificăm dacă s-a atins limita de 3 utilizatori pentru planul Free
    return count >= 3
  } catch (error) {
    console.error("Eroare la verificarea limitei de utilizatori:", error)
    throw error
  }
}
