'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { listAiCalls, getAiCallStats } from '@/lib/api/admin'
import type { AiCallDto } from '@/lib/api/types'
import CursorList from '@/components/ui/CursorList'

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

  const inputStyle: React.CSSProperties = {
    height: '28px', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.04)',
    color: 'rgb(247,248,248)', fontSize: '12px', outline: 'none',
    padding: '0 10px', boxSizing: 'border-box',
  }

  return (
    <div>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        height: '48px', display: 'flex', alignItems: 'center',
        padding: '0 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgb(8,9,10)',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>AI 호출 이력</span>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Stats */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: '총 호출', value: stats.totalCalls.toLocaleString() },
              { label: '성공률', value: `${(stats.successRate * 100).toFixed(1)}%` },
              { label: '평균 지연', value: `${stats.avgLatencyMs}ms` },
            ].map((s) => (
              <div key={s.label} style={{
                backgroundColor: 'rgb(13,14,15)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px', padding: '16px',
              }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>{s.label}</div>
                <div style={{ fontSize: '22px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            value={useCase}
            onChange={(e) => setParam('useCase', e.target.value)}
            placeholder="Use case 검색"
            style={{ ...inputStyle, width: '200px' }}
          />
          <select
            value={success}
            onChange={(e) => setParam('success', e.target.value)}
            style={{ ...inputStyle, width: '100px' }}
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
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                height: '36px', padding: '0 4px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                fontFamily: 'monospace',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <span style={{
                borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                padding: '1px 5px', flexShrink: 0,
                backgroundColor: c.success ? 'rgba(34,197,94,0.12)' : 'rgba(255,99,99,0.12)',
                color: c.success ? 'rgb(34,197,94)' : 'rgba(255,99,99,0.8)',
              }}>
                {c.success ? 'OK' : 'ERR'}
              </span>
              <span style={{ flex: 1, fontSize: '12px', color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.useCase}
              </span>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
                {c.latencyMs}ms
              </span>
              {c.errorMessage && (
                <span style={{ fontSize: '11px', color: 'rgba(255,99,99,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                  {c.errorMessage}
                </span>
              )}
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>
                {new Date(c.createdAt).toLocaleString('ko-KR')}
              </span>
            </div>
          )}
        />
      </div>
    </div>
  )
}
