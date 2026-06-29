'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { listAdminJobs, updateAdminJobStatus } from '@/lib/api/admin'
import type { AdminJobDto } from '@/lib/api/types'
import CursorList from '@/components/ui/CursorList'
import { useToastStore } from '@/stores/toastStore'
import { AgentIntro } from '@/components/app/AgentPrimitives'

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; color: string; label: string }> = {
    ACTIVE: { bg: 'rgba(34,197,94,0.12)',  color: 'rgb(34,197,94)',          label: '활성' },
    DRAFT:  { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)',  label: '초안' },
    CLOSED: { bg: 'rgba(234,179,8,0.12)',   color: 'rgb(234,179,8)',          label: '마감' },
  }
  const s = cfg[status] ?? cfg.DRAFT
  return (
    <span style={{
      backgroundColor: s.bg, color: s.color,
      borderRadius: '10px', fontSize: '11px', fontWeight: 500,
      padding: '0 7px', lineHeight: '18px', flexShrink: 0,
    }}>
      {s.label}
    </span>
  )
}

const ghostBtn: React.CSSProperties = {
  background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
  color: 'rgba(255,255,255,0.5)', borderRadius: '4px',
  height: '22px', padding: '0 8px', fontSize: '11px', cursor: 'pointer',
}
const dangerBtn: React.CSSProperties = {
  ...ghostBtn,
  border: '1px solid rgba(255,99,99,0.3)',
  color: 'rgba(255,99,99,0.7)',
}

export default function AdminJobsPage() {
  const qc = useQueryClient()
  const { add } = useToastStore()

  const { mutate: changeStatus } = useMutation({
    mutationFn: ({ jobId, status }: { jobId: string | number; status: string }) =>
      updateAdminJobStatus(jobId, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'jobs'] }); add('success', '상태 변경됨') },
    onError: () => add('error', '변경 실패'),
  })

  return (
    <div>
      <div style={{ padding: '16px 24px 0' }}>
        <AgentIntro
          eyebrow="Admin agent"
          title="공고 운영 상태를 정리합니다"
          description="활성, 마감, 초안 상태를 빠르게 확인하고 운영 액션으로 이어갑니다."
          steps={['상태 확인', '조회/지원 신호 확인', '운영 액션']}
        />
        <CursorList<AdminJobDto>
          queryKey={['admin', 'jobs']}
          fetcher={(cursor) => listAdminJobs({ cursor })}
          emptyTitle="공고가 없습니다"
          className=""
          renderItem={(j) => (
            <div
              key={j.jobId}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                height: '44px', padding: '0 4px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {j.title}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{j.company}</div>
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', display: 'flex', gap: '8px', flexShrink: 0 }}>
                <span>조회 {j.viewCount}</span>
                <span>지원 {j.applyCount}</span>
              </div>
              <StatusBadge status={j.status} />
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                {j.status !== 'ACTIVE' && (
                  <button
                    onClick={() => changeStatus({ jobId: j.jobId, status: 'ACTIVE' })}
                    style={ghostBtn}
                  >
                    활성화
                  </button>
                )}
                {j.status === 'ACTIVE' && (
                  <button
                    onClick={() => changeStatus({ jobId: j.jobId, status: 'CLOSED' })}
                    style={dangerBtn}
                  >
                    마감
                  </button>
                )}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}
