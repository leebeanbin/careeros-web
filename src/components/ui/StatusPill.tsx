import type { ReactNode } from 'react'

type StatusTone = 'primary' | 'success' | 'warning' | 'danger' | 'muted'

const tones: Record<StatusTone, string> = {
  primary: 'border-[rgba(255,255,255,0.12)] bg-[var(--da-accent-dim)] text-[var(--da-text)]',
  success: 'border-[rgba(255,255,255,0.1)] bg-[var(--da-control)] text-[var(--da-success)]',
  warning: 'border-[rgba(255,255,255,0.1)] bg-[var(--da-control)] text-[var(--da-warning)]',
  danger: 'border-[rgba(248,113,113,0.28)] bg-[var(--da-danger-dim)] text-[var(--da-danger)]',
  muted: 'border-[var(--da-border)] bg-[var(--da-badge)] text-[var(--da-badge-text)]',
}

export default function StatusPill({
  tone = 'muted',
  children,
  className = '',
}: {
  tone?: StatusTone
  children: ReactNode
  className?: string
}) {
  return (
    <span className={`inline-flex h-5 items-center rounded-full border px-2 text-[11px] font-medium ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}
