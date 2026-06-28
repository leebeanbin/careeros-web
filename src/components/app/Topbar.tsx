'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { logout } from '@/lib/api/auth'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import { useQuery } from '@tanstack/react-query'
import { listNotifications } from '@/lib/api/notifications'

const ROUTE_LABELS: Record<string, string> = {
  '/dashboard':  '대시보드',
  '/jobs':       '채용공고',
  '/matches':    '나의 매칭',
  '/resume':     '이력서',
  '/github':     'GitHub',
  '/candidate':  '경력 그래프',
  '/advisor':    'AI 어드바이저',
  '/notifications': '알림',
  '/settings':   '설정',
  '/admin/users':    '사용자 관리',
  '/admin/jobs':     '공고 관리',
  '/admin/ai-calls': 'AI 호출 이력',
}

export default function Topbar() {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { clear } = useAuthStore()
  const { add } = useToastStore()

  const { data: notifPage } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => listNotifications({ size: 1, unreadOnly: true }),
    staleTime: 60_000,
  })
  const unreadCount = (notifPage as { totalCount?: number } | undefined)?.totalCount ?? 0

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    try { await logout() } catch { add('error', '로그아웃 중 오류가 발생했습니다.') }
    clear()
    router.push('/login')
  }

  const title = Object.entries(ROUTE_LABELS).find(([k]) => pathname.startsWith(k))?.[1] ?? ''

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '48px',
      padding: '0 16px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      backgroundColor: 'rgb(8,9,10)',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>
        {title}
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Bell */}
        <Link href="/notifications" style={{
          position: 'relative', display: 'flex', alignItems: 'center',
          padding: '6px', borderRadius: '4px',
          color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
        }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 1.5A4 4 0 0 0 3.5 5.5V9l-1 2h10l-1-2V5.5A4 4 0 0 0 7.5 1.5z"
                  stroke="currentColor" strokeWidth="1.2"/>
            <path d="M6.5 11a1 1 0 0 0 2 0" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: '2px', right: '2px',
              width: '14px', height: '14px', borderRadius: '50%',
              backgroundColor: 'rgb(99,102,241)',
              fontSize: '9px', fontWeight: 600, color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        {/* Avatar dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button onClick={() => setOpen((v) => !v)} style={{
            width: '28px', height: '28px', borderRadius: '50%',
            backgroundColor: 'rgb(99,102,241)',
            fontSize: '11px', fontWeight: 700, color: 'white',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            U
          </button>
          {open && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 6px)',
              width: '160px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.08)',
              backgroundColor: 'rgb(17,18,19)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              zIndex: 50, overflow: 'hidden',
            }}>
              <Link href="/settings" onClick={() => setOpen(false)} style={{
                display: 'block', padding: '8px 12px',
                fontSize: '13px', color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                설정
              </Link>
              <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
              <button onClick={handleLogout} style={{
                display: 'block', width: '100%', padding: '8px 12px',
                textAlign: 'left', fontSize: '13px',
                color: 'rgba(255,99,99,0.8)',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
