'use client'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { getReport } from '@/lib/api/advisor'
import { Badge } from '@/components/ui/Badge'
import { CardSkeleton } from '@/components/ui/Skeleton'
import Spinner from '@/components/ui/Spinner'

export default function AdvisorReportPage() {
  const { reportId } = useParams<{ reportId: string }>()
  const { data: report, isLoading } = useQuery({
    queryKey: ['advisor', 'reports', Number(reportId)],
    queryFn: () => getReport(Number(reportId)),
    refetchInterval: (q) => (q.state.data?.status === 'PENDING' ? 3000 : false),
  })

  if (isLoading) {
    return (
      <div className="max-w-[640px] mx-auto px-5 py-6 space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )
  }
  if (!report) return null

  return (
    <div className="max-w-[640px] mx-auto px-5 py-6">
      <div className="mb-6">
        <Link href="/advisor" className="text-sm text-gray-400 hover:text-gray-600">
          ← 어드바이저
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-base font-semibold text-gray-900">보고서 #{report.reportId}</h1>
          <Badge variant={report.status === 'COMPLETED' ? 'success' : 'info'}>
            {report.status === 'COMPLETED' ? '완료' : '분석 중'}
          </Badge>
        </div>

        {report.status === 'PENDING' ? (
          <div className="flex flex-col items-center py-12 gap-3">
            <Spinner size="lg" className="text-indigo-600" />
            <p className="text-sm text-gray-500">AI가 분석 중입니다... 잠시만 기다려주세요</p>
          </div>
        ) : (
          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {report.content}
          </div>
        )}

        <p className="text-xs text-gray-400 mt-6">
          요청일: {new Date(report.createdAt).toLocaleString('ko-KR')}
          {report.completedAt &&
            ` · 완료: ${new Date(report.completedAt).toLocaleString('ko-KR')}`}
        </p>
      </div>
    </div>
  )
}
