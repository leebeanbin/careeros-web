import Link from 'next/link'

interface EmptyStateProps {
  marker?: string
  title: string
  description?: string
  action?: { label: string; href: string }
  tone?: 'neutral' | 'error'
}

export default function EmptyState({ marker = '—', title, description, action, tone = 'neutral' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium"
        style={{
          border: '1px solid var(--da-border)',
          backgroundColor: tone === 'error' ? 'var(--da-danger-dim)' : 'var(--da-control)',
          color: tone === 'error' ? 'var(--da-danger)' : 'var(--da-text-3)',
        }}
      >
        {marker}
      </span>
      <p className="mt-3 text-sm font-medium" style={{ color: 'var(--da-text)' }}>{title}</p>
      {description && <p className="mt-1 text-sm" style={{ color: 'var(--da-text-2)' }}>{description}</p>}
      {action && (
        <Link href={action.href} className="mt-4 text-sm hover:underline" style={{ color: 'var(--da-text)' }}>
          {action.label}
        </Link>
      )}
    </div>
  )
}
