interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'muted' | 'default' | 'warning' | 'error' | 'info'
  children: React.ReactNode
  className?: string
}

const variantClasses = {
  primary: 'bg-[var(--da-accent-dim)] text-[var(--da-text)] border-[rgba(255,255,255,0.12)]',
  secondary: 'bg-[var(--da-control)] text-[var(--da-text-2)]',
  ghost: 'bg-transparent text-[var(--da-text-2)]',
  danger: 'bg-[var(--da-danger-dim)] text-[var(--da-danger)]',
  muted: 'bg-[var(--da-badge)] text-[var(--da-badge-text)]',
  success: 'bg-[var(--da-control)] text-[var(--da-success)]',
  warning: 'bg-[var(--da-control)] text-[var(--da-warning)]',
  error:   'bg-[var(--da-danger-dim)] text-[var(--da-danger)]',
  info:    'bg-[var(--da-control)] text-[var(--da-text)]',
  default: 'bg-[var(--da-badge)] text-[var(--da-badge-text)]',
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-sm border border-[var(--da-border)] px-2 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}>
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
