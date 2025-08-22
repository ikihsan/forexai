import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatPrice(value: number, pair: string): string {
  // Different forex pairs have different decimal places
  const jpyPairs = ['USDJPY', 'EURJPY', 'GBPJPY', 'AUDJPY', 'CADJPY']
  const decimals = jpyPairs.some(jpyPair => pair.includes('JPY')) ? 3 : 5
  
  return value.toFixed(decimals)
}

export function calculatePipValue(
  pair: string,
  entryPrice: number,
  exitPrice: number,
  lotSize: number = 1
): number {
  const isJpyPair = pair.includes('JPY')
  const pipSize = isJpyPair ? 0.01 : 0.0001
  const pips = Math.abs(exitPrice - entryPrice) / pipSize
  
  // Standard lot size is 100,000 units of base currency
  const standardLotSize = 100000
  const pipValue = isJpyPair ? (pipSize * standardLotSize) / exitPrice : pipSize * standardLotSize
  
  return pips * pipValue * lotSize
}

export function calculateProfitLoss(
  tradeType: 'BUY' | 'SELL',
  entryPrice: number,
  exitPrice: number,
  amount: number
): number {
  if (tradeType === 'BUY') {
    return (exitPrice - entryPrice) * amount
  } else {
    return (entryPrice - exitPrice) * amount
  }
}

export function getMarketStatus(): 'open' | 'closed' | 'pre-market' {
  const now = new Date()
  const utcHour = now.getUTCHours()
  const utcDay = now.getUTCDay()
  
  // Forex market is open 24/5 (Monday 00:00 UTC to Friday 22:00 UTC)
  if (utcDay === 0 || (utcDay === 6 && utcHour >= 22) || (utcDay === 1 && utcHour < 0)) {
    return 'closed'
  }
  
  if (utcDay === 5 && utcHour >= 22) {
    return 'closed'
  }
  
  return 'open'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  waitFor: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), waitFor)
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
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function generateTradeId(): string {
  return `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

export function timeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) {
    return `${days}d ago`
  } else if (hours > 0) {
    return `${hours}h ago`
  } else if (minutes > 0) {
    return `${minutes}m ago`
  } else {
    return 'Just now'
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
