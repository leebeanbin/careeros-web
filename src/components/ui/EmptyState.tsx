import Link from 'next/link'

interface EmptyStateProps {
  emoji?: string
  title: string
  description?: string
  action?: { label: string; href: string }
}

export default function EmptyState({ emoji = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-4xl">{emoji}</p>
      <p className="mt-3 text-sm font-medium text-gray-900">{title}</p>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      {action && (
        <Link href={action.href} className="mt-4 text-sm text-indigo-600 hover:underline">
          {action.label}
        </Link>
      )}
    </div>
  )
}
