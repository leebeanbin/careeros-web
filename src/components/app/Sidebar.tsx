'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navMain = [
  { href: '/dashboard', label: '대시보드' },
  { href: '/jobs', label: '채용공고' },
  { href: '/matches', label: '나의 매칭' },
  { href: '/resume', label: '이력서' },
  { href: '/github', label: 'GitHub' },
  { href: '/candidate', label: '경력 그래프' },
  { href: '/advisor', label: 'AI 어드바이저' },
]

const navSub = [
  { href: '/notifications', label: '알림' },
  { href: '/settings', label: '설정' },
]

interface SidebarContentProps {
  unreadCount?: number
}

function SidebarContent({ unreadCount = 0 }: SidebarContentProps) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href)

  return (
    <div className="flex flex-col h-full px-2 py-3">
      <div className="px-2 mb-4">
        <span className="text-[13px] font-semibold text-gray-900">CareerOS</span>
      </div>

      <nav className="flex-1 space-y-0.5">
        {navMain.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex h-7 items-center gap-2 rounded-md px-2 text-[13px]
              transition-colors duration-[150ms]
              ${isActive(item.href)
                ? 'bg-gray-200/70 font-medium text-gray-900'
                : 'font-normal text-gray-600 hover:bg-gray-200/50 hover:text-gray-800'
              }`}
          >
            {item.label}
          </Link>
        ))}

        <hr className="my-2 border-gray-200" />

        {navSub.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex h-7 items-center gap-2 rounded-md px-2 text-[13px]
              transition-colors duration-[150ms]
              ${isActive(item.href)
                ? 'bg-gray-200/70 font-medium text-gray-900'
                : 'font-normal text-gray-600 hover:bg-gray-200/50 hover:text-gray-800'
              }`}
          >
            <span className="flex-1">{item.label}</span>
            {item.href === '/notifications' && unreadCount > 0 && (
              <span className="text-[11px] text-gray-400">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default SidebarContent
