'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listMatches } from '@/lib/api/matches'
import { MatchStatusIcon } from '@/components/app/MatchStatusIcon'

export default function CyclesPage() {
  const [showCompleted, setShowCompleted] = useState(false)

  const { data } = useQuery({
    queryKey: ['matches', { cycles: true }],
    queryFn: () => listMatches({ size: 50, hideHidden: false }),
  })

  const matches = data?.content ?? []
  const activeMatches = matches.filter((m) => m.totalScore >= 65)
  const upcomingMatches = matches.filter((m) => m.totalScore >= 50 && m.totalScore < 65)
  const completedMatches = matches.filter((m) => m.totalScore < 50)

  const excellentCount = activeMatches.filter((m) => m.totalScore >= 80).length
  const progressPct = activeMatches.length
    ? Math.round((excellentCount / activeMatches.length) * 100)
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'rgb(8,9,10)' }}>
      {/* Header */}
      <div style={{
        height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
      }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgb(247,248,248)' }}>지원 사이클</span>
        <button type="button" style={{
          backgroundColor: 'transparent', color: 'rgb(208,214,224)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '6px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer',
        }}>
          + 새 사이클
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '24px 20px' }}>
        {matches.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
            매칭된 공고가 없습니다
          </div>
        )}

        {/* Active card */}
        {activeMatches.length > 0 && (
          <div style={{
            backgroundColor: 'rgb(13,14,15)',
            border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: '10px', padding: '20px', marginBottom: '16px',
            boxShadow: '0 0 20px rgba(34,197,94,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'rgb(34,197,94)', boxShadow: '0 0 6px rgb(34,197,94)' }} />
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgb(247,248,248)' }}>활성 매칭</span>
                <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '4px', backgroundColor: 'rgba(34,197,94,0.15)', color: 'rgb(34,197,94)' }}>Active</span>
              </div>
              <span style={{ fontSize: '12px', color: 'rgb(138,143,152)' }}>{activeMatches.length}개</span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: 'rgb(138,143,152)' }}>
                  {excellentCount} / {activeMatches.length} 우수 매칭
                </span>
                <span style={{ fontSize: '12px', color: 'rgb(34,197,94)' }}>{progressPct}%</span>
              </div>
              <div style={{ height: '4px', borderRadius: '2px', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <div style={{ width: `${progressPct}%`, height: '100%', borderRadius: '2px', backgroundColor: 'rgb(34,197,94)', transition: 'width 0.3s ease' }} />
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
              {activeMatches.slice(0, 5).map((m) => (
                <div key={m.matchId} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}>
                  <MatchStatusIcon score={m.totalScore} size={13} />
                  <span style={{ fontSize: '13px', color: 'rgb(208,214,224)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.job.title}
                  </span>
                  <span style={{ fontSize: '11px', color: 'rgb(138,143,152)', flexShrink: 0 }}>{m.job.company}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming cards */}
        {upcomingMatches.slice(0, 3).map((m) => (
          <div key={m.matchId} style={{
            backgroundColor: 'rgb(13,14,15)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px', padding: '20px', marginBottom: '16px', opacity: 0.8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'rgb(138,143,152)', border: '1.5px dashed rgba(138,143,152,0.5)' }} />
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgb(208,214,224)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>
                  {m.job.title}
                </span>
                <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '4px', backgroundColor: 'rgba(138,143,152,0.12)', color: 'rgb(138,143,152)', flexShrink: 0 }}>
                  검토 중
                </span>
              </div>
              <span style={{ fontSize: '12px', color: 'rgb(138,143,152)', flexShrink: 0 }}>{m.job.company}</span>
            </div>
          </div>
        ))}

        {/* Completed (collapsible) */}
        {completedMatches.length > 0 && (
          <div>
            <div
              onClick={() => setShowCompleted(!showCompleted)}
              style={{ fontSize: '12px', fontWeight: 500, color: 'rgb(138,143,152)', padding: '8px 0', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <span>{showCompleted ? '▼' : '▶'}</span>
              <span>낮은 매칭 · {completedMatches.length}개</span>
            </div>
            {showCompleted && completedMatches.map((m) => (
              <div key={m.matchId} style={{
                backgroundColor: 'rgb(13,14,15)', border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px', padding: '14px 16px', marginBottom: '8px', opacity: 0.6,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'rgb(138,143,152)' }} />
                    <span style={{ fontSize: '13px', color: 'rgb(208,214,224)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '320px' }}>
                      {m.job.title}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'rgb(138,143,152)', flexShrink: 0 }}>
                    {m.job.company} · 점수 {m.totalScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
