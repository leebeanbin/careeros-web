'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { listAiCalls, getAiCallStats } from '@/lib/api/admin'
import type { AiCallDto } from '@/lib/api/types'
import PageHeader from '@/components/ui/PageHeader'
import CursorList from '@/components/ui/CursorList'
import { Badge } from '@/components/ui/Badge'

export default function AdminAiCallsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const useCase = searchParams.get('useCase') ?? ''
  const success = searchParams.get('success') ?? ''

  const { data: stats } = useQuery({
    queryKey: ['admin', 'ai-calls', 'stats'],
    queryFn: getAiCallStats,
  })

  const setParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString())
    value ? p.set(key, value) : p.delete(key)
    router.push(`/admin/ai-calls?${p.toString()}`)
  }

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-6">
      <PageHeader title="AI 호출 현황" description="AI 모델 호출 로그 및 통계" />

      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: '총 호출', value: stats.totalCalls.toLocaleString() },
            { label: '성공률', value: `${(stats.successRate * 100).toFixed(1)}%` },
            { label: '평균 지연', value: `${stats.avgLatencyMs}ms` },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-gray-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={useCase}
          onChange={(e) => setParam('useCase', e.target.value)}
          placeholder="Use case 검색"
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm w-48
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={success}
          onChange={(e) => setParam('success', e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="">전체</option>
          <option value="true">성공</option>
          <option value="false">실패</option>
        </select>
      </div>

      <CursorList<AiCallDto>
        queryKey={['admin', 'ai-calls', { useCase, success }]}
        fetcher={(cursor) => listAiCalls({
          useCase: useCase || undefined,
          success: success === '' ? undefined : success === 'true',
          cursor,
        })}
        emptyTitle="호출 기록이 없습니다"
        className=""
        renderItem={(c) => (
          <div
            key={c.callId}
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 mb-2 font-mono text-xs"
          >
            <Badge variant={c.success ? 'success' : 'error'}>
              {c.success ? 'OK' : 'ERR'}
            </Badge>
            <span className="text-gray-600 flex-1 truncate">{c.useCase}</span>
            <span className="text-gray-400">{c.latencyMs}ms</span>
            {c.errorMessage && (
              <span className="text-red-500 truncate max-w-[200px]">{c.errorMessage}</span>
            )}
            <span className="text-gray-400 shrink-0">
              {new Date(c.createdAt).toLocaleString('ko-KR')}
            </span>
          </div>
        )}
      />
    </div>
  )
}
