'use client'
import { useQuery } from '@tanstack/react-query'
import { listMatches } from '@/lib/api/matches'
import type { MatchDto } from '@/lib/api/types'

const MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
const COL_W = 160

const now = new Date()
const TODAY_X = now.getMonth() * COL_W + Math.round((now.getDate() / 30) * COL_W)

function scoreColor(score: number): string {
  if (score >= 80) return 'rgb(34,197,94)'
  if (score >= 65) return 'rgb(234,179,8)'
  if (score >= 50) return 'rgb(99,102,241)'
  return 'rgb(138,143,152)'
}

function getBarLeft(postedAt: string): number {
  const d = new Date(postedAt)
  return d.getMonth() * COL_W + Math.round((d.getDate() / 30) * COL_W)
}

function ScoreBadge({ score }: { score: number }) {
  const color = scoreColor(score)
  return (
    <span style={{
      fontSize: '10px', padding: '1px 6px', borderRadius: '3px',
      backgroundColor: `${color}20`, color, flexShrink: 0,
    }}>
      {score}
    </span>
  )
}

export default function RoadmapPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['matches', { roadmap: true }],
    queryFn: () => listMatches({ size: 20 }),
  })

  const matches = data?.content ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'rgb(8,9,10)' }}>
      {/* Header */}
      <div style={{
        height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
      }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgb(247,248,248)' }}>로드맵</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {['2026 Q1', '2026 Q2', '2026 Q3', '2026 Q4'].map((q, i) => (
            <button key={q} type="button" style={{
              fontSize: '11px', padding: '4px 10px', borderRadius: '5px', cursor: 'pointer', border: 'none',
              backgroundColor: i === 1 ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: i === 1 ? 'rgb(247,248,248)' : 'rgb(138,143,152)',
            }}>
              {q}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ height: '52px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>매칭된 공고가 없습니다</span>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left panel */}
          <div style={{ width: '240px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgb(11,12,13)' }}>
            <div style={{ height: '40px', borderBottom: '1px solid rgba(255,255,255,0.06)' }} />
            {matches.map((m: MatchDto) => {
              const color = scoreColor(m.totalScore)
              return (
                <div key={m.matchId} style={{
                  height: '52px', display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '0 16px', borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: 'rgb(247,248,248)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.job.company}
                  </span>
                  <ScoreBadge score={m.totalScore} />
                </div>
              )
            })}
          </div>

          {/* Gantt */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            <div style={{ minWidth: `${MONTHS.length * COL_W}px` }}>
              {/* Month header */}
              <div style={{
                height: '40px', display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)',
                position: 'sticky', top: 0, backgroundColor: 'rgb(11,12,13)', zIndex: 10,
              }}>
                {MONTHS.map((m, i) => {
                  const isCurrent = i === now.getMonth()
                  return (
                    <div key={m} style={{
                      width: `${COL_W}px`, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 500,
                      color: isCurrent ? 'rgb(247,248,248)' : 'rgb(138,143,152)',
                      borderRight: '1px solid rgba(255,255,255,0.04)',
                      backgroundColor: isCurrent ? 'rgba(255,255,255,0.02)' : 'transparent',
                    }}>
                      {m}
                    </div>
                  )
                })}
              </div>

              {/* Rows */}
              <div style={{ position: 'relative' }}>
                {matches.map((m: MatchDto) => {
                  const color = scoreColor(m.totalScore)
                  const barLeft = Math.max(0, getBarLeft(m.job.postedAt))
                  const barWidth = COL_W * 2
                  return (
                    <div key={m.matchId} style={{
                      height: '52px', display: 'flex', alignItems: 'center',
                      borderBottom: '1px solid rgba(255,255,255,0.04)', position: 'relative',
                    }}>
                      {MONTHS.map((_, i) => (
                        <div key={i} style={{
                          width: `${COL_W}px`, flexShrink: 0, height: '100%',
                          borderRight: '1px solid rgba(255,255,255,0.03)',
                          backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.005)',
                        }} />
                      ))}
                      <div style={{
                        position: 'absolute', left: `${barLeft}px`, width: `${barWidth}px`,
                        height: '28px', borderRadius: '6px',
                        backgroundColor: `${color}CC`, overflow: 'hidden',
                        display: 'flex', alignItems: 'center',
                      }}>
                        <span style={{
                          position: 'relative', fontSize: '11px', fontWeight: 500,
                          color: '#fff', paddingLeft: '10px',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {m.job.title}
                        </span>
                      </div>
                    </div>
                  )
                })}

                {/* Today line */}
                <div style={{
                  position: 'absolute', top: 0, bottom: 0,
                  left: `${TODAY_X}px`, width: '1px',
                  backgroundColor: 'rgb(96,121,241)', opacity: 0.7,
                  pointerEvents: 'none',
                }}>
                  <div style={{
                    position: 'absolute', top: '-4px', left: '-3px',
                    width: '7px', height: '7px', borderRadius: '50%',
                    backgroundColor: 'rgb(96,121,241)',
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
