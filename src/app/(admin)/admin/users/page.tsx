'use client'
import { Suspense } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams, useRouter } from 'next/navigation'
import { listUsers, updateUserRole, updateUserStatus } from '@/lib/api/admin'
import type { UserDto } from '@/lib/api/types'
import CursorList from '@/components/ui/CursorList'
import { useToastStore } from '@/stores/toastStore'
import { AgentIntro } from '@/components/app/AgentPrimitives'

function Badge({ children, variant }: { children: React.ReactNode; variant: 'green' | 'red' | 'indigo' | 'gray' }) {
  const colors = {
    green:  { backgroundColor: 'rgba(255,255,255,0.08)',  color: 'rgba(255,255,255,0.78)' },
    red:    { backgroundColor: 'rgba(255,99,99,0.12)',   color: 'rgba(255,99,99,0.8)' },
    indigo: { backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.84)' },
    gray:   { backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' },
  }
  return (
    <span style={{
      ...colors[variant],
      borderRadius: '10px', fontSize: '11px', fontWeight: 500,
      padding: '0 7px', lineHeight: '18px', display: 'inline-block',
      whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      {children}
    </span>
  )
}

const ghostBtn: React.CSSProperties = {
  background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
  color: 'rgba(255,255,255,0.5)', borderRadius: '4px',
  height: '22px', padding: '0 8px', fontSize: '11px', cursor: 'pointer',
}
const dangerBtn: React.CSSProperties = {
  ...ghostBtn,
  border: '1px solid rgba(255,99,99,0.3)',
  color: 'rgba(255,99,99,0.7)',
}

function AdminUsersPageContent() {
  const qc = useQueryClient()
  const { add } = useToastStore()
  const searchParams = useSearchParams()
  const router = useRouter()

  const keyword = searchParams.get('keyword') ?? ''
  const status = searchParams.get('status') ?? ''

  const setParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString())
    if (value) p.set(key, value)
    else p.delete(key)
    router.push(`/admin/users?${p.toString()}`)
  }

  const { mutate: changeRole } = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: 'USER' | 'ADMIN' }) =>
      updateUserRole(userId, role),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'users'] }); add('success', '역할 변경됨') },
    onError: () => add('error', '변경 실패'),
  })

  const { mutate: changeStatus } = useMutation({
    mutationFn: ({ userId, status: s }: { userId: number; status: 'ACTIVE' | 'SUSPENDED' }) =>
      updateUserStatus(userId, s),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'users'] }); add('success', '상태 변경됨') },
    onError: () => add('error', '변경 실패'),
  })

  return (
    <div>
      <div style={{ padding: '16px 24px 0' }}>
        <AgentIntro
          eyebrow="Admin agent"
          title="사용자 상태를 운영 관점으로 정리합니다"
          description="검색, 상태 필터, 역할 변경을 한 흐름 안에서 처리합니다."
          steps={['사용자 검색', '상태 필터', '역할/상태 변경']}
        />
      </div>
      {/* Filter bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <input
          value={keyword}
          onChange={(e) => setParam('keyword', e.target.value)}
          placeholder="이름 또는 이메일"
          style={{
            height: '28px', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.04)',
            color: 'rgb(247,248,248)', fontSize: '12px', outline: 'none',
            padding: '0 10px', boxSizing: 'border-box', width: '200px',
          }}
        />
        {['', 'ACTIVE', 'SUSPENDED'].map((s) => (
          <button
            key={s}
            onClick={() => setParam('status', s)}
            style={{
              height: '26px', padding: '0 10px',
              borderRadius: '4px', fontSize: '12px', cursor: 'pointer',
              border: status === s ? '1px solid rgba(255,255,255,0.22)' : '1px solid rgba(255,255,255,0.1)',
              backgroundColor: status === s ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: status === s ? 'rgba(255,255,255,0.86)' : 'rgba(255,255,255,0.5)',
            }}
          >
            {s === '' ? '전체' : s === 'ACTIVE' ? '활성' : '정지'}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 24px' }}>
        <CursorList<UserDto>
          queryKey={['admin', 'users', { keyword, status }]}
          fetcher={(cursor) => listUsers({ keyword: keyword || undefined, status: status || undefined, cursor })}
          emptyTitle="사용자가 없습니다"
          className=""
          renderItem={(u) => (
            <div
              key={u.userId}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                height: '44px', padding: '0 4px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {/* Avatar */}
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.16)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.86)', flexShrink: 0,
              }}>
                {u.name.charAt(0).toUpperCase()}
              </div>
              {/* Name + email */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {u.name}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {u.email}
                </div>
              </div>
              <Badge variant={u.status === 'ACTIVE' ? 'green' : 'red'}>
                {u.status === 'ACTIVE' ? '활성' : '정지'}
              </Badge>
              <Badge variant={u.role === 'ADMIN' ? 'indigo' : 'gray'}>{u.role}</Badge>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button
                  onClick={() => changeRole({ userId: u.userId, role: u.role === 'ADMIN' ? 'USER' : 'ADMIN' })}
                  style={ghostBtn}
                >
                  {u.role === 'ADMIN' ? 'USER로' : 'ADMIN으로'}
                </button>
                <button
                  onClick={() => changeStatus({ userId: u.userId, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' })}
                  style={dangerBtn}
                >
                  {u.status === 'ACTIVE' ? '정지' : '복구'}
                </button>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={null}>
      <AdminUsersPageContent />
    </Suspense>
  )
}
