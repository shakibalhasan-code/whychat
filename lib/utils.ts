import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMessageTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days > 0) {
    if (days === 1) return "Yesterday"
    if (days <= 7) return date.toLocaleDateString("en-US", { weekday: "long" })
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
}

