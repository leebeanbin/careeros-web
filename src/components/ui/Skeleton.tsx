export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-4">
      <div className="h-4 w-3/4 rounded bg-gray-200" />
      <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
      <div className="mt-2 h-3 w-2/3 rounded bg-gray-200" />
    </div>
  )
}

export function RowSkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-3 px-4 py-3 border-b border-gray-100">
      <div className="h-4 w-1/3 rounded bg-gray-200" />
      <div className="h-4 w-1/4 rounded bg-gray-200 ml-auto" />
    </div>
  )
}
