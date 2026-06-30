'use client'
import { useEffect, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { CursorPage } from '@/lib/api/types'
import { CardSkeleton } from './Skeleton'
import EmptyState from './EmptyState'

interface CursorListProps<T> {
  queryKey: unknown[]
  fetcher: (cursor?: string) => Promise<CursorPage<T>>
  renderItem: (item: T, index: number) => React.ReactNode
  emptyTitle?: string
  emptyDescription?: string
  errorTitle?: string
  errorDescription?: string
  className?: string
}

export default function CursorList<T>({
  queryKey,
  fetcher,
  renderItem,
  emptyTitle = '결과가 없습니다',
  emptyDescription,
  errorTitle = '데이터를 불러오지 못했습니다',
  errorDescription = '잠시 후 다시 시도하거나 백엔드 연결 상태를 확인하세요.',
  className = 'space-y-3',
}: CursorListProps<T>) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) => fetcher(pageParam as string | undefined),
      getNextPageParam: (last) => (last.hasNext ? (last.nextCursor ?? undefined) : undefined),
      initialPageParam: undefined as string | undefined,
    })

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage()
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) {
    return (
      <div className={className}>
        {[0, 1, 2].map((i) => <CardSkeleton key={i} />)}
      </div>
    )
  }

  if (isError) {
    return <EmptyState marker="!" title={errorTitle} description={errorDescription} tone="error" />
  }

  const items = data?.pages.flatMap((p) => p.content) ?? []

  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div>
      <div className={className}>
        {items.map((item, i) => renderItem(item, i))}
      </div>
      <div ref={sentinelRef} className="h-4" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
        </div>
      )}
    </div>
  )
}
