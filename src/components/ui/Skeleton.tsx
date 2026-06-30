export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg p-4" style={{ border: '1px solid var(--da-border)', backgroundColor: 'var(--da-surface)' }}>
      <div className="h-4 w-3/4 rounded" style={{ backgroundColor: 'var(--da-control-active)' }} />
      <div className="mt-2 h-3 w-1/2 rounded" style={{ backgroundColor: 'var(--da-control)' }} />
      <div className="mt-2 h-3 w-2/3 rounded" style={{ backgroundColor: 'var(--da-control)' }} />
    </div>
  )
}

export function RowSkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--da-border-row)' }}>
      <div className="h-4 w-1/3 rounded" style={{ backgroundColor: 'var(--da-control-active)' }} />
      <div className="h-4 w-1/4 rounded ml-auto" style={{ backgroundColor: 'var(--da-control)' }} />
    </div>
  )
}
