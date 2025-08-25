import { format, formatDistanceToNow } from 'date-fns'

// Price formatting
export const formatPrice = (cents: number, currency = 'USD') => {
  const dollars = cents / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(dollars)
}

// Date formatting
export const formatDate = (date: string | Date, formatStr = 'PPP') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, formatStr)
}

export const formatTime = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'p')
}

export const formatDateTime = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'PPP p')
}

export const timeAgo = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

// URL slug generation
export const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Validation helpers
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Array helpers
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

// String helpers
export const truncate = (str: string, length: number) => {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

// Class name helpers
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}
