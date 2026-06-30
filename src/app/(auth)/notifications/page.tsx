'use client'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  listNotifications, markRead, markAllRead, deleteNotification,
} from '@/lib/api/notifications'
import type { NotificationDto } from '@/lib/api/types'
import CursorList from '@/components/ui/CursorList'
import { AgentIntro } from '@/components/app/AgentPrimitives'

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return '방금'
  if (m < 60) return `${m}분 전`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}시간 전`
  const d = Math.floor(h / 24)
  if (d === 1) return '어제'
  if (d < 7) return `${d}일 전`
  return new Date(iso).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

const TYPE_LABEL: Record<string, string> = {
  MATCH: '매칭', RESUME: '이력서', GITHUB: 'GitHub', ADVISOR: '어드바이저', SYSTEM: '시스템',
}

export default function NotificationsPage() {
  const qc = useQueryClient()
  const router = useRouter()

  const { mutate: read } = useMutation({
    mutationFn: (id: string | number) => markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
  const { mutate: del } = useMutation({
    mutationFn: (id: string | number) => deleteNotification(id),
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
      <div style={{ padding: '16px 24px 0' }}>
        <AgentIntro
          title="새 신호를 정리해서 보여줍니다"
          description="매칭, 이력서, GitHub, 어드바이저 알림을 읽고 다음에 확인할 흐름으로 연결합니다."
          steps={['신호 분류', '읽음 상태 정리', '관련 화면 이동']}
        />
      </div>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        height: '48px', padding: '0 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgb(8,9,10)',
      }}>
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
              backgroundColor: n.isRead ? 'transparent' : 'rgba(255,255,255,0.035)',
              transition: 'background-color 0.1s',
            }}
            onClick={() => handleClick(n)}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = n.isRead ? 'transparent' : 'rgba(255,255,255,0.035)')}
          >
            {/* Unread dot */}
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
              backgroundColor: n.isRead ? 'transparent' : 'rgba(255,255,255,0.78)',
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
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {formatRelative(n.createdAt)}
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
