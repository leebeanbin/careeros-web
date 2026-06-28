'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { listAdminJobs, updateJobStatus } from '@/lib/api/admin'
import type { AdminJobDto } from '@/lib/api/types'
import PageHeader from '@/components/ui/PageHeader'
import CursorList from '@/components/ui/CursorList'
import { Badge } from '@/components/ui/Badge'
import { useToastStore } from '@/stores/toastStore'

const statusVariant: Record<string, 'success' | 'warning' | 'default'> = {
  ACTIVE: 'success', DRAFT: 'default', CLOSED: 'warning',
}
const statusLabel: Record<string, string> = { ACTIVE: '활성', DRAFT: '초안', CLOSED: '마감' }

export default function AdminJobsPage() {
  const qc = useQueryClient()
  const { add } = useToastStore()

  const { mutate: changeStatus } = useMutation({
    mutationFn: ({ jobId, status }: { jobId: number; status: string }) =>
      updateJobStatus(jobId, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'jobs'] }); add('success', '상태가 변경되었습니다.') },
    onError: () => add('error', '변경에 실패했습니다.'),
  })

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-6">
      <PageHeader title="채용공고 관리" description="공고 목록 및 상태 관리" />

      <CursorList<AdminJobDto>
        queryKey={['admin', 'jobs']}
        fetcher={(cursor) => listAdminJobs({ cursor })}
        emptyTitle="공고가 없습니다"
        className=""
        renderItem={(j) => (
          <div
            key={j.jobId}
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 mb-2 hover:border-gray-300"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{j.title}</p>
              <p className="text-xs text-gray-500">{j.company}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 shrink-0">
              <span>조회 {j.viewCount}</span>
              <span>지원 {j.applyCount}</span>
            </div>
            <Badge variant={statusVariant[j.status] ?? 'default'}>
              {statusLabel[j.status] ?? j.status}
            </Badge>
            <div className="flex gap-2 shrink-0">
              {j.status !== 'ACTIVE' && (
                <button
                  onClick={() => changeStatus({ jobId: j.jobId, status: 'ACTIVE' })}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  활성화
                </button>
              )}
              {j.status === 'ACTIVE' && (
                <button
                  onClick={() => changeStatus({ jobId: j.jobId, status: 'CLOSED' })}
                  className="text-xs text-red-500 hover:underline"
                >
                  마감
                </button>
              )}
            </div>
          </div>
        )}
      />
    </div>
  )
}
