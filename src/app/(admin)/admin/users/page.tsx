'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { listUsers, updateUserRole, updateUserStatus } from '@/lib/api/admin'
import type { UserDto } from '@/lib/api/types'
import PageHeader from '@/components/ui/PageHeader'
import CursorList from '@/components/ui/CursorList'
import { Badge } from '@/components/ui/Badge'
import { useToastStore } from '@/stores/toastStore'

export default function AdminUsersPage() {
  const qc = useQueryClient()
  const { add } = useToastStore()

  const { mutate: changeRole } = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: 'USER' | 'ADMIN' }) =>
      updateUserRole(userId, role),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'users'] }); add('success', '역할이 변경되었습니다.') },
    onError: () => add('error', '변경에 실패했습니다.'),
  })

  const { mutate: changeStatus } = useMutation({
    mutationFn: ({ userId, status }: { userId: number; status: 'ACTIVE' | 'SUSPENDED' }) =>
      updateUserStatus(userId, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'users'] }); add('success', '상태가 변경되었습니다.') },
    onError: () => add('error', '변경에 실패했습니다.'),
  })

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-6">
      <PageHeader title="사용자 관리" description="전체 사용자 목록 및 권한 관리" />

      <CursorList<UserDto>
        queryKey={['admin', 'users']}
        fetcher={(cursor) => listUsers({ cursor })}
        emptyTitle="사용자가 없습니다"
        className=""
        renderItem={(u) => (
          <div
            key={u.userId}
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 mb-2 hover:border-gray-300"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{u.name}</p>
              <p className="text-xs text-gray-500">{u.email}</p>
            </div>
            <Badge variant={u.status === 'ACTIVE' ? 'success' : 'error'}>
              {u.status === 'ACTIVE' ? '활성' : '정지'}
            </Badge>
            <Badge variant={u.role === 'ADMIN' ? 'info' : 'default'}>{u.role}</Badge>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => changeRole({ userId: u.userId, role: u.role === 'ADMIN' ? 'USER' : 'ADMIN' })}
                className="text-xs text-indigo-600 hover:underline"
              >
                {u.role === 'ADMIN' ? 'USER로' : 'ADMIN으로'}
              </button>
              <button
                onClick={() => changeStatus({ userId: u.userId, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' })}
                className="text-xs text-red-500 hover:underline"
              >
                {u.status === 'ACTIVE' ? '정지' : '복구'}
              </button>
            </div>
          </div>
        )}
      />
    </div>
  )
}
