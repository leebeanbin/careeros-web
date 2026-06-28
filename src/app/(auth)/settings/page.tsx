'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { getMe, updateMe, deleteMe } from '@/lib/api/users'
import { logout } from '@/lib/api/auth'
import type { UpdateUserDto } from '@/lib/api/types'
import PageHeader from '@/components/ui/PageHeader'
import Spinner from '@/components/ui/Spinner'
import Modal from '@/components/ui/Modal'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import { useState } from 'react'

export default function SettingsPage() {
  const qc = useQueryClient()
  const router = useRouter()
  const { clear } = useAuthStore()
  const { add } = useToastStore()
  const [showDelete, setShowDelete] = useState(false)

  const { data: me } = useQuery({ queryKey: ['users', 'me'], queryFn: getMe })

  const { register, handleSubmit, formState: { isSubmitting, isDirty } } =
    useForm<UpdateUserDto>({ values: me ? { name: me.name, email: me.email } : undefined })

  const { mutate: save } = useMutation({
    mutationFn: updateMe,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users', 'me'] }); add('success', '저장되었습니다.') },
    onError: () => add('error', '저장에 실패했습니다.'),
  })

  const { mutate: doDelete, isPending: deleting } = useMutation({
    mutationFn: deleteMe,
    onSuccess: async () => {
      await logout().catch(() => null)
      clear()
      router.push('/')
    },
    onError: () => add('error', '탈퇴에 실패했습니다.'),
  })

  return (
    <div className="max-w-[560px] mx-auto px-5 py-6">
      <PageHeader title="설정" description="계정 정보 및 보안 설정" />

      <form
        onSubmit={handleSubmit((d) => save(d))}
        className="rounded-lg border border-gray-200 bg-white p-6 mb-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      >
        <h2 className="text-sm font-semibold text-gray-900 mb-4">프로필</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input
              {...register('name', { required: true })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              {...register('email', { required: true })}
              type="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm
                       font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting && <Spinner size="sm" className="text-white" />}
            저장
          </button>
        </div>
      </form>

      <div className="rounded-lg border border-red-100 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <h2 className="text-sm font-semibold text-red-700 mb-2">위험 구역</h2>
        <p className="text-xs text-gray-500 mb-4">계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.</p>
        <button
          onClick={() => setShowDelete(true)}
          className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium
                     text-red-600 hover:bg-red-50 transition-colors duration-[150ms]"
        >
          계정 삭제
        </button>
      </div>

      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="계정 삭제 확인">
        <p className="text-sm text-gray-600 mb-5">
          정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowDelete(false)}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={() => doDelete()}
            disabled={deleting}
            className="flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-sm
                       font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleting && <Spinner size="sm" className="text-white" />}
            삭제 확인
          </button>
        </div>
      </Modal>
    </div>
  )
}
