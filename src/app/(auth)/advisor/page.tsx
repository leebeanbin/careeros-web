'use client'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDashboard, requestReport, listReports } from '@/lib/api/advisor'
import type { AdvisorReport } from '@/lib/api/types'
import CursorList from '@/components/ui/CursorList'
import { useToastStore } from '@/stores/toastStore'
import { AgentIntro, AgentPanel, AgentStatusStrip, AgentStepList } from '@/components/app/AgentPrimitives'

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
      qc.invalidateQueries({ queryKey: ['advisor', 'dashboard'] })
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
        <div>
          <div style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.88)' }}>AI 어드바이저</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>이력서 분석, 레이아웃 리뷰, 매칭 흐름을 종합한 보고서를 생성합니다.</div>
        </div>
        <span style={{ fontSize: '11px', color: isPending ? 'rgb(129,140,248)' : 'rgba(255,255,255,0.32)' }}>
          {isPending ? '보고서 작성 중...' : '대기 중'}
        </span>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
        <AgentIntro
          title="어드바이저가 여러 신호를 종합합니다"
          description="이력서, 매칭, 레이아웃, 알림 신호를 묶어 보고서로 정리합니다."
          steps={['프로필 신호 수집', '매칭 근거 비교', '보고서 작성']}
          action={
            <button
              onClick={() => request(undefined)}
              disabled={isPending}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                backgroundColor: 'rgba(229,229,230,0.92)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgb(8,9,10)',
                borderRadius: '7px', height: '34px', padding: '0 14px',
                fontSize: '13px', fontWeight: 600, cursor: isPending ? 'not-allowed' : 'pointer',
              }}
            >
              새 보고서 요청
            </button>
          }
        />
        {dashboard?.recentReport && (
          <AgentPanel style={{
            display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center',
            backgroundColor: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.22)',
            padding: '16px', marginBottom: '16px',
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.9)', marginBottom: '4px' }}>최근 어드바이저 메모</div>
              <div style={{ fontSize: '12px', lineHeight: 1.6, color: 'rgba(255,255,255,0.55)' }}>
                {dashboard.recentReport.content?.slice(0, 130) || '최근 보고서가 준비 중입니다. 완료되면 요약을 바로 확인할 수 있습니다.'}
              </div>
            </div>
            <StatusBadge status={dashboard.recentReport.status} />
          </AgentPanel>
        )}

        {/* Stats */}
        {dashboard && (
          <AgentStatusStrip
            items={[
              { label: '총 매칭', value: dashboard.totalMatches, tone: 'green' },
              { label: '최고 점수', value: dashboard.topMatchScore, tone: 'indigo' },
              { label: '평균 점수', value: dashboard.avgMatchScore, tone: 'amber' },
            ]}
          />
        )}

        <AgentPanel style={{ padding: '16px', marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Report pipeline</div>
          <AgentStepList
            steps={[
              { label: '이력서와 레이아웃 신호 읽기', detail: '강점, 취약점, 섹션별 수정 위치를 보고서 맥락으로 모읍니다.' },
              { label: '매칭 근거와 선호도 비교', detail: '점수만 보지 않고 역할, 근거, 선호도 간의 간극을 찾습니다.', tone: 'green' },
              { label: '다음 행동 문장으로 정리', detail: '지원, 보완, 면접 준비 중 바로 실행 가능한 항목으로 줄입니다.', tone: 'amber' },
            ]}
          />
        </AgentPanel>

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
