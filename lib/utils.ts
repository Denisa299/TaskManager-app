import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stringToColor(str: string): string {
  // Generează un hash din string
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Convertește hash-ul în culori
  const colors = [
    "from-blue-500 to-blue-600",
    "from-green-500 to-green-600",
    "from-purple-500 to-purple-600",
    "from-pink-500 to-pink-600",
    "from-indigo-500 to-indigo-600",
    "from-red-500 to-red-600",
    "from-yellow-500 to-yellow-600",
    "from-teal-500 to-teal-600",
    "from-orange-500 to-orange-600",
    "from-cyan-500 to-cyan-600",
  ]

  return colors[Math.abs(hash) % colors.length]
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("ro-RO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleString("ro-RO", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getInitials(firstName = "", lastName = ""): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U"
}
