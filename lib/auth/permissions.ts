import type { IUser, UserRole } from "@/lib/models/user"
import type { NextRequest } from "next/server"
import { getUserFromToken } from "./auth-utils"

// Definirea permisiunilor pentru fiecare rol
export const rolePermissions = {
  admin: [
    "manage_users", // Adăugare, editare, ștergere utilizatori
    "manage_all_projects", // Acces complet la toate proiectele
    "manage_all_tasks", // Acces complet la toate taskurile
    "view_all_data", // Poate vedea toate datele din aplicație
    "view_team_data", // Poate vedea date despre echipă
  ],
  manager: [
    "create_projects", // Poate crea proiecte noi
    "manage_own_projects", // Poate gestiona proiectele create de el
    "assign_tasks", // Poate asigna taskuri
    "view_team_data", // Poate vedea date despre echipă
  ],
  member: [
    "view_assigned_projects", // Poate vedea proiectele la care este asignat
    "update_own_tasks", // Poate actualiza taskurile proprii
    "view_own_data", // Poate vedea datele proprii
    // Eliminat "view_team_data" - membrii nu pot vedea echipa
  ],
}

// Verifică dacă un utilizator are o anumită permisiune
export function hasPermission(user: IUser | null, permission: string): boolean {
  if (!user) return false

  const userRole = user.role as UserRole
  return rolePermissions[userRole]?.includes(permission) || false
}

// Verifică dacă un utilizator are una dintre permisiunile specificate
export function hasAnyPermission(user: IUser | null, permissions: string[]): boolean {
  if (!user) return false

  const userRole = user.role as UserRole
  return permissions.some((permission) => rolePermissions[userRole]?.includes(permission))
}

// Verifică dacă un utilizator are toate permisiunile specificate
export function hasAllPermissions(user: IUser | null, permissions: string[]): boolean {
  if (!user) return false

  const userRole = user.role as UserRole
  return permissions.every((permission) => rolePermissions[userRole]?.includes(permission))
}

// Middleware pentru verificarea permisiunilor în API routes
export async function checkPermission(
  req: NextRequest,
  permission: string,
): Promise<{
  hasPermission: boolean
  user: IUser | null
}> {
  const user = await getUserFromToken(req)
  return {
    hasPermission: hasPermission(user, permission),
    user,
  }
}

// Verifică dacă utilizatorul este proprietarul resursei sau are permisiunea specificată
export function isOwnerOrHasPermission(
  user: IUser | null,
  resourceOwnerId: string | undefined,
  permission: string,
): boolean {
  if (!user) return false

  // Dacă utilizatorul este proprietarul resursei
if (resourceOwnerId && (user as any)._id.toString() === resourceOwnerId.toString()) {

    return true
  }

  // Dacă utilizatorul are permisiunea specificată
  return hasPermission(user, permission)
}
