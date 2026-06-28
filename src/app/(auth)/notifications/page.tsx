'use client'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  listNotifications, markRead, markAllRead, deleteNotification,
} from '@/lib/api/notifications'
import type { NotificationDto } from '@/lib/api/types'
import CursorList from '@/components/ui/CursorList'

const TYPE_LABEL: Record<string, string> = {
  MATCH: '매칭', RESUME: '이력서', GITHUB: 'GitHub', ADVISOR: '어드바이저', SYSTEM: '시스템',
}

export default function NotificationsPage() {
  const qc = useQueryClient()
  const router = useRouter()

  const { mutate: read } = useMutation({
    mutationFn: (id: number) => markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
  const { mutate: del } = useMutation({
    mutationFn: (id: number) => deleteNotification(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
  const { mutate: readAll } = useMutation({
    mutationFn: markAllRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const handleClick = (n: NotificationDto) => {
    if (!n.isRead) read(n.notificationId)
    if (n.targetUrl) router.push(n.targetUrl)
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '48px', padding: '0 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgb(8,9,10)',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>알림</span>
        <button
          onClick={() => readAll()}
          style={{
            height: '26px', padding: '0 10px', borderRadius: '4px',
            border: '1px solid rgba(255,255,255,0.1)',
            backgroundColor: 'transparent', color: 'rgba(255,255,255,0.5)',
            fontSize: '12px', cursor: 'pointer',
          }}
        >
          전체 읽음
        </button>
      </div>

      <CursorList<NotificationDto>
        queryKey={['notifications']}
        fetcher={(cursor) => listNotifications({ cursor, size: 30 })}
        emptyTitle="알림이 없습니다"
        className=""
        renderItem={(n: NotificationDto) => (
          <div
            key={n.notificationId}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              cursor: n.targetUrl ? 'pointer' : 'default',
              backgroundColor: n.isRead ? 'transparent' : 'rgba(99,102,241,0.04)',
              transition: 'background-color 0.1s',
            }}
            onClick={() => handleClick(n)}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = n.isRead ? 'transparent' : 'rgba(99,102,241,0.04)')}
          >
            {/* Unread dot */}
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
              backgroundColor: n.isRead ? 'transparent' : 'rgb(99,102,241)',
            }} />

            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <span style={{
                  fontSize: '10px', fontWeight: 500,
                  color: 'rgba(255,255,255,0.4)',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  padding: '1px 6px', borderRadius: '3px',
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  {TYPE_LABEL[n.type] ?? n.type}
                </span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                  {new Date(n.createdAt).toLocaleString('ko-KR')}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>
                {n.message}
              </p>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); del(n.notificationId) }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '18px', color: 'rgba(255,255,255,0.2)',
                padding: '4px', borderRadius: '4px',
                lineHeight: 1, flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,80,80,0.7)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
            >
              ×
            </button>
          </div>
        )}
      />
    </div>
  )
}
