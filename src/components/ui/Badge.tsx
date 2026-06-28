interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  children: React.ReactNode
  className?: string
}

const variantClasses = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  error:   'bg-red-100 text-red-700',
  info:    'bg-blue-100 text-blue-700',
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}

export function MatchScoreBadge({ score }: { score: number }) {
  const variant = score >= 80 ? 'success' : score >= 65 ? 'warning' : 'default'
  const label = score >= 80 ? '강력' : score >= 65 ? '좋음' : score >= 50 ? '보통' : '낮음'
  return (
    <Badge variant={variant} className="tabular-nums">
      {score}점 · {label}
    </Badge>
  )
}
