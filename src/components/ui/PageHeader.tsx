interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="truncate text-[19px] font-semibold leading-tight text-[var(--da-text)]">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-[13px] leading-6 text-[var(--da-text-2)]">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
