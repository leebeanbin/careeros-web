'use client'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDashboard, requestReport, listReports } from '@/lib/api/advisor'
import type { AdvisorReport } from '@/lib/api/types'
import PageHeader from '@/components/ui/PageHeader'
import CursorList from '@/components/ui/CursorList'
import { Badge } from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import { useToastStore } from '@/stores/toastStore'

const statusVariant = (s: string): 'success' | 'info' =>
  s === 'COMPLETED' ? 'success' : 'info'
const statusLabel = (s: string) =>
  s === 'COMPLETED' ? '완료' : '분석 중'

export default function AdvisorPage() {
  const qc = useQueryClient()
  const { add } = useToastStore()

  const { data: dashboard } = useQuery({
    queryKey: ['advisor', 'dashboard'],
    queryFn: getDashboard,
  })

  const { mutate: request, isPending } = useMutation({
    mutationFn: requestReport,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['advisor', 'reports'] })
      add('success', '새 보고서 요청이 완료되었습니다. 잠시 후 확인하세요.')
    },
    onError: () => add('error', '요청에 실패했습니다.'),
  })

  return (
    <div className="max-w-[900px] mx-auto px-5 py-6">
      <PageHeader
        title="AI 어드바이저"
        description="매칭 분석 보고서로 커리어 전략을 세우세요"
        action={
          <button
            onClick={() => request()}
            disabled={isPending}
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2
                       text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending && <Spinner size="sm" className="text-white" />}
            새 보고서 요청
          </button>
        }
      />

      {dashboard && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: '총 매칭', value: dashboard.totalMatches },
            { label: '최고 점수', value: dashboard.topMatchScore },
            { label: '평균 점수', value: dashboard.avgMatchScore },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-gray-200 bg-white p-4
                                          shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <p className="text-xs font-medium text-gray-500">{s.label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-sm font-semibold text-gray-700 mb-3">보고서 목록</h2>
      <CursorList<AdvisorReport>
        queryKey={['advisor', 'reports']}
        fetcher={(cursor) => listReports(cursor)}
        emptyTitle="아직 보고서가 없습니다"
        emptyDescription="새 보고서를 요청해보세요"
        renderItem={(report) => (
          <Link
            key={report.reportId}
            href={`/advisor/reports/${report.reportId}`}
            className="flex items-center justify-between rounded-lg border border-gray-200
                       bg-white px-4 py-3 hover:border-gray-300 transition-all duration-[150ms]"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">보고서 #{report.reportId}</p>
              <p className="text-xs text-gray-500">
                {new Date(report.createdAt).toLocaleString('ko-KR')}
              </p>
            </div>
            <Badge variant={statusVariant(report.status)}>{statusLabel(report.status)}</Badge>
          </Link>
        )}
      />
    </div>
  )
}
