import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuthMessageProps {
  type: 'error' | 'success'
  message: string
  className?: string
}

export function AuthMessage({ type, message, className }: AuthMessageProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg p-3 text-sm',
        type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600',
        className
      )}
    >
      {type === 'error' ? (
        <AlertCircle className="h-4 w-4" />
      ) : (
        <CheckCircle2 className="h-4 w-4" />
      )}
      <span>{message}</span>
    </div>
  )
} 