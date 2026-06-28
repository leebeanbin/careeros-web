'use client'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  listNotifications, markRead, markAllRead, deleteNotification,
} from '@/lib/api/notifications'
import type { NotificationDto } from '@/lib/api/types'
import PageHeader from '@/components/ui/PageHeader'
import CursorList from '@/components/ui/CursorList'

const typeLabel: Record<string, string> = {
  MATCH: '매칭', RESUME: '이력서', GITHUB: 'GitHub', ADVISOR: '어드바이저', SYSTEM: '시스템',
}

export default function NotificationsPage() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutate: read } = useMutation({
    mutationFn: (id: number) => markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const { mutate: del } = useMutation({
    mutationFn: (id: number) => deleteNotification(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const { mutate: readAll } = useMutation({
    mutationFn: markAllRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const handleClick = (n: NotificationDto) => {
    if (!n.isRead) read(n.notificationId)
    if (n.targetUrl) router.push(n.targetUrl)
  }

  return (
    <div className="max-w-[900px] mx-auto px-5 py-6">
      <PageHeader
        title="알림"
        action={
          <button
            onClick={() => readAll()}
            className="text-sm text-indigo-600 hover:underline"
          >
            전체 읽음
          </button>
        }
      />
      <CursorList<NotificationDto>
        queryKey={['notifications']}
        fetcher={(cursor) => listNotifications({ cursor, size: 20 })}
        emptyTitle="알림이 없습니다"
        renderItem={(n) => (
          <div
            key={n.notificationId}
            className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3
              cursor-pointer transition-colors duration-[150ms]
              ${n.isRead ? 'border-gray-100 bg-white' : 'border-indigo-100 bg-indigo-50'}`}
            onClick={() => handleClick(n)}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px]
                                 font-medium bg-gray-100 text-gray-600">
                  {typeLabel[n.type] ?? n.type}
                </span>
                {!n.isRead && (
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                )}
              </div>
              <p className="text-sm text-gray-800">{n.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(n.createdAt).toLocaleString('ko-KR')}
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); del(n.notificationId) }}
              className="text-gray-300 hover:text-red-400 transition-colors shrink-0 text-lg leading-none"
            >
              ×
            </button>
          </div>
        )}
      />
    </div>
  )
}
