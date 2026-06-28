'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logout } from '@/lib/api/auth'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'

interface TopbarProps {
  title?: string
  unreadCount?: number
}

export default function Topbar({ title, unreadCount = 0 }: TopbarProps) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { clear } = useAuthStore()
  const { add } = useToastStore()

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
    try {
      await logout()
    } catch {
      add('error', '로그아웃 중 오류가 발생했습니다.')
    }
    clear()
    router.push('/login')
  }

  return (
    <header className="flex h-12 items-center justify-between border-b border-gray-200 bg-white px-4">
      <span className="text-sm font-semibold text-gray-900">{title}</span>

      <div className="flex items-center gap-3">
        <Link href="/notifications" className="relative p-1 text-gray-500 hover:text-gray-700">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center
                             rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-full
                       bg-indigo-100 text-sm font-semibold text-indigo-600"
          >
            U
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-44 rounded-lg border border-gray-200
                            bg-white shadow-lg z-50">
              <Link href="/settings"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg">
                설정
              </Link>
              <hr className="border-gray-100" />
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-sm text-red-600
                           hover:bg-red-50 rounded-b-lg"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
