'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { listNotifications } from '@/lib/api/notifications'
import { getMe } from '@/lib/api/users'
import type { CSSProperties, ReactNode } from 'react'
import { LogoWordmark } from '@/components/brand/Logo'

// ── Icons ───────────────────────────────────────────────────
function DashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1" y="1" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="8.5" y="1" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="1" y="8.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  )
}
function JobsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1" y="4" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M5 4V3a2 2 0 0 1 4 0v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}
function MatchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M5 7.5l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function ResumeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="2.5" y="1" width="10" height="13" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M5 5h5M5 7.5h5M5 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}
function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  )
}
function GraphIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <polygon points="7.5,1.5 13.5,5 13.5,10 7.5,13.5 1.5,10 1.5,5" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  )
}
function RoadmapIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M2 13L7 3L12 8L14 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function CyclesIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M2.5 7A4.5 4.5 0 0 1 7 2.5v0a4.5 4.5 0 0 1 4.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M11.5 7A4.5 4.5 0 0 1 7 11.5v0a4.5 4.5 0 0 1-4.5-4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <polyline points="9.5,2 11.5,4.5 9,4.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function AdvisorIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1" y="2" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M5 13h5M7.5 12v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M5.5 6.5L7.5 5l2 1.5-2 1.5-2-1.5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
    </svg>
  )
}
function BellIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M7.5 1.5A4 4 0 0 0 3.5 5.5V9l-1 2h10l-1-2V5.5A4 4 0 0 0 7.5 1.5z" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M6.5 11a1 1 0 0 0 2 0" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  )
}
function SettingsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M3.2 3.2l1 1M10.8 10.8l1 1M3.2 11.8l1-1M10.8 4.2l1-1"
            stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

// ── NavItem ─────────────────────────────────────────────────
interface NavItemProps {
  icon: ReactNode
  label: string
  href: string
  badge?: number
  active: boolean
}

function NavItem({ icon, label, href, badge, active }: NavItemProps) {
  const style: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    height: '32px',
    paddingLeft: '8px',
    paddingRight: '8px',
    borderRadius: '4px',
    textDecoration: 'none',
    backgroundColor: active ? 'rgba(255,255,255,0.06)' : 'transparent',
    color: active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
    fontSize: '13px',
    fontWeight: active ? 500 : 400,
    transition: 'background-color 0.1s',
    userSelect: 'none',
  }

  return (
    <Link href={href} style={style}
          onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.04)' }}
          onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}>
      <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, opacity: active ? 1 : 0.7 }}>
        {icon}
      </span>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      {badge !== undefined && badge > 0 && (
        <span style={{
          backgroundColor: 'rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.6)',
          borderRadius: '10px',
          fontSize: '11px',
          fontWeight: 500,
          padding: '0 6px',
          lineHeight: '18px',
          flexShrink: 0,
        }}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  )
}

// ── Sidebar ─────────────────────────────────────────────────
const NAV_MAIN = [
  { href: '/dashboard',  label: '대시보드',    icon: <DashIcon /> },
  { href: '/jobs',       label: '채용공고',    icon: <JobsIcon /> },
  { href: '/matches',    label: '나의 매칭',   icon: <MatchIcon /> },
  { href: '/resume',     label: '이력서',      icon: <ResumeIcon /> },
  { href: '/github',     label: 'GitHub',      icon: <GitHubIcon /> },
  { href: '/candidate',  label: '경력 그래프', icon: <GraphIcon /> },
  { href: '/roadmap',    label: '로드맵',      icon: <RoadmapIcon /> },
  { href: '/cycles',     label: '지원 사이클', icon: <CyclesIcon /> },
  { href: '/advisor',    label: 'AI 어드바이저', icon: <AdvisorIcon /> },
]

const NAV_SUB = [
  { href: '/notifications', label: '알림',    icon: <BellIcon /> },
  { href: '/settings',      label: '설정',    icon: <SettingsIcon /> },
]

export default function SidebarContent() {
  const pathname = usePathname()
  const router = useRouter()

  const { data: notifPage } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => listNotifications({ size: 1, unreadOnly: true }),
    staleTime: 60_000,
  })
  const unreadCount = (notifPage as { totalCount?: number } | undefined)?.totalCount ?? 0

  const { data: me } = useQuery({
    queryKey: ['users', 'me'],
    queryFn: getMe,
    staleTime: 300_000,
  })

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Logo row — two-line + ··· button (careeros-view AppSidebar pattern) */}
      <div style={{
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0 }}>
            <LogoWordmark
              size={20}
              textClassName="text-[13px] font-medium text-[rgba(255,255,255,0.9)]"
            />
            {me?.name && (
              <span style={{ marginLeft: '28px', fontSize: '11px', fontWeight: 400, color: 'rgba(255,255,255,0.4)', lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {me.name}
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          aria-label="설정 열기"
          title="설정"
          onClick={() => router.push('/settings')}
          style={{
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.4)', fontSize: '16px',
            cursor: 'pointer', padding: '4px', borderRadius: '4px',
            display: 'flex', alignItems: 'center', letterSpacing: '1px',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          ···
        </button>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {NAV_MAIN.map((item) => (
            <NavItem key={item.href} {...item} active={isActive(item.href)} />
          ))}
        </div>

        {/* Section label — careeros-view sectionLabelStyle */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          height: '28px', paddingLeft: '8px', paddingRight: '8px',
          marginTop: '4px',
          color: 'rgba(255,255,255,0.35)', fontSize: '11px',
          fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          My Space
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {NAV_SUB.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={isActive(item.href)}
              badge={item.href === '/notifications' ? unreadCount : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
