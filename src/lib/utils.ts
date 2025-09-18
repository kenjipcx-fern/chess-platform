import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Chess-specific utility functions
export function getSquareColor(file: number, rank: number): 'light' | 'dark' {
  return (file + rank) % 2 === 0 ? 'dark' : 'light'
}

export function fileToLetter(file: number): string {
  return String.fromCharCode(97 + file) // 'a' + file
}

export function rankToNumber(rank: number): string {
  return String(8 - rank)
}

export function getSquareNotation(file: number, rank: number): string {
  return `${fileToLetter(file)}${rankToNumber(rank)}`
}

export function parseSquareNotation(square: string): { file: number; rank: number } {
  const file = square.charCodeAt(0) - 97 // 'a' = 0
  const rank = 8 - parseInt(square[1]) // '8' = 0
  return { file, rank }
}

// Time formatting utilities
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// ELO rating utilities
export function getEloRatingClass(rating: number): string {
  if (rating < 800) return 'text-gray-500'
  if (rating < 1200) return 'text-amber-600'
  if (rating < 1600) return 'text-green-600'
  if (rating < 2000) return 'text-blue-600'
  if (rating < 2400) return 'text-purple-600'
  return 'text-red-600'
}

export function getEloRatingLabel(rating: number): string {
  if (rating < 800) return 'Beginner'
  if (rating < 1200) return 'Casual'
  if (rating < 1600) return 'Intermediate'
  if (rating < 2000) return 'Advanced'
  if (rating < 2400) return 'Expert'
  return 'Master'
}

// Animation utilities
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
