'use client'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDashboard, requestReport, listReports } from '@/lib/api/advisor'
import type { AdvisorReport } from '@/lib/api/types'
import CursorList from '@/components/ui/CursorList'
import { useToastStore } from '@/stores/toastStore'

function StatusBadge({ status }: { status: string }) {
  const completed = status === 'COMPLETED'
  return (
    <span style={{
      backgroundColor: completed ? 'rgba(34,197,94,0.12)' : 'rgba(99,102,241,0.12)',
      color: completed ? 'rgb(34,197,94)' : 'rgb(99,102,241)',
      borderRadius: '10px',
      fontSize: '11px',
      fontWeight: 500,
      padding: '2px 7px',
      whiteSpace: 'nowrap' as const,
    }}>
      {completed ? '완료' : '분석 중'}
    </span>
  )
}

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
    <div>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '48px', padding: '0 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgb(8,9,10)',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>AI 어드바이저</span>
        <button
          onClick={() => request()}
          disabled={isPending}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: isPending ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.8)',
            borderRadius: '6px', height: '32px', padding: '0 14px',
            fontSize: '13px', cursor: isPending ? 'not-allowed' : 'pointer',
          }}
        >
          {isPending && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20" strokeDashoffset="15"/>
            </svg>
          )}
          새 보고서 요청
        </button>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
        {/* Stats */}
        {dashboard && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '28px' }}>
            {[
              { label: '총 매칭', value: dashboard.totalMatches },
              { label: '최고 점수', value: dashboard.topMatchScore },
              { label: '평균 점수', value: dashboard.avgMatchScore },
            ].map((s) => (
              <div key={s.label} style={{
                backgroundColor: 'rgb(13,14,15)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '20px',
              }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>{s.label}</div>
                <div style={{ fontSize: '28px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1 }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Section label */}
        <div style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
          보고서 목록
        </div>

        <div style={{ borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', backgroundColor: 'rgb(13,14,15)' }}>
          <CursorList<AdvisorReport>
            queryKey={['advisor', 'reports']}
            fetcher={(cursor) => listReports(cursor)}
            emptyTitle="아직 보고서가 없습니다"
            emptyDescription="새 보고서를 요청해보세요"
            className=""
            renderItem={(report, i) => (
              <Link
                key={report.reportId}
                href={`/advisor/reports/${report.reportId}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0 16px', height: '52px',
                  borderBottom: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  textDecoration: 'none',
                  transition: 'background-color 0.1s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                    보고서 #{report.reportId}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                    {new Date(report.createdAt).toLocaleString('ko-KR')}
                  </div>
                </div>
                <StatusBadge status={report.status} />
              </Link>
            )}
          />
        </div>
      </div>
    </div>
  )
}
