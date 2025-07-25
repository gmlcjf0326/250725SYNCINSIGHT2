import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  // Date 객체가 유효한지 확인
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Invalid Date 체크
  if (!dateObj || isNaN(dateObj.getTime())) {
    return '날짜 없음'
  }
  
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}