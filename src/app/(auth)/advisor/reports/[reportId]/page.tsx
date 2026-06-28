'use client'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { getReport } from '@/lib/api/advisor'

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
    }}>
      {completed ? '완료' : '분석 중'}
    </span>
  )
}

export default function AdvisorReportPage() {
  const { reportId } = useParams<{ reportId: string }>()
  const { data: report, isLoading } = useQuery({
    queryKey: ['advisor', 'reports', Number(reportId)],
    queryFn: () => getReport(Number(reportId)),
    refetchInterval: (q) => (q.state.data?.status === 'PENDING' ? 3000 : false),
  })

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '720px', margin: '0 auto', padding: '24px' }}>
        {[0, 1].map((i) => (
          <div key={i} style={{ height: '80px', borderRadius: '8px', backgroundColor: 'rgb(13,14,15)', border: '1px solid rgba(255,255,255,0.06)', animation: 'pulse 1.5s infinite' }} />
        ))}
      </div>
    )
  }

  if (!report) return null

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/advisor" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
            ← 어드바이저
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>
            보고서 #{report.reportId}
          </span>
        </div>
        <StatusBadge status={report.status} />
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px' }}>
        {report.status === 'PENDING' ? (
          <div style={{
            backgroundColor: 'rgb(13,14,15)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px',
            padding: '64px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                 style={{ animation: 'spin 1s linear infinite', color: 'rgb(99,102,241)' }}>
              <circle cx="12" cy="12" r="10" stroke="rgba(99,102,241,0.2)" strokeWidth="2"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="rgb(99,102,241)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
              AI가 분석 중입니다... 잠시만 기다려주세요
            </p>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'rgb(13,14,15)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px',
            padding: '24px',
          }}>
            <div style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
            }}>
              {report.content}
            </div>

            <div style={{
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.3)',
            }}>
              요청일: {new Date(report.createdAt).toLocaleString('ko-KR')}
              {report.completedAt && ` · 완료: ${new Date(report.completedAt).toLocaleString('ko-KR')}`}
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
