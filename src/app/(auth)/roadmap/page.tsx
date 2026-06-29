'use client'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listMatches } from '@/lib/api/matches'
import type { MatchDto } from '@/lib/api/types'
import { AgentIntro, AgentStatusStrip } from '@/components/app/AgentPrimitives'

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

function getStage(score: number) {
  if (score >= 85) return { label: '지원 준비', color: 'rgb(34,197,94)' }
  if (score >= 70) return { label: '보완 후 지원', color: 'rgb(234,179,8)' }
  return { label: '탐색 유지', color: 'rgb(138,143,152)' }
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
  const [selectedQuarter, setSelectedQuarter] = useState(1)
  const [selectedMatchId, setSelectedMatchId] = useState<string | number | null>(null)
  const { data, isLoading } = useQuery({
    queryKey: ['matches', { roadmap: true }],
    queryFn: () => listMatches({ size: 20 }),
  })

  const matches = useMemo(() => data?.content ?? [], [data?.content])
  const selectedMonths = useMemo(() => {
    const start = selectedQuarter * 3
    return [start, start + 1, start + 2]
  }, [selectedQuarter])
  const visibleMatches = useMemo(() => {
    const scoped = matches.filter((m) => {
      const month = new Date(m.job.postedAt || now.toISOString()).getMonth()
      return selectedMonths.includes(month)
    })
    return scoped.length ? scoped : matches
  }, [matches, selectedMonths])
  const selectedMatch = visibleMatches.find((m) => m.matchId === selectedMatchId) ?? visibleMatches[0]
  const readyCount = visibleMatches.filter((m) => m.totalScore >= 85).length
  const improveCount = visibleMatches.filter((m) => m.totalScore >= 70 && m.totalScore < 85).length
  const avgScore = visibleMatches.length
    ? Math.round(visibleMatches.reduce((sum, m) => sum + m.totalScore, 0) / visibleMatches.length)
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'rgb(8,9,10)' }}>
      <div style={{ padding: '16px 20px 0' }}>
        <AgentIntro
          title="지원 흐름을 시간축으로 재정렬합니다"
          description="분기별 후보, 보완 필요 항목, 오늘 기준선을 함께 놓고 어떤 순서로 준비할지 보여줍니다."
          steps={['분기 스코프 선택', '준비 단계 산정', '다음 액션 추천']}
        />
      </div>
      {/* Header */}
      <div style={{
        height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 500, color: 'rgb(247,248,248)' }}>로드맵</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>분기별 지원 흐름과 보완 우선순위를 봅니다.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {['2026 Q1', '2026 Q2', '2026 Q3', '2026 Q4'].map((q, i) => (
            <button key={q} type="button" onClick={() => setSelectedQuarter(i)} style={{
              fontSize: '11px', padding: '4px 10px', borderRadius: '5px', cursor: 'pointer', border: 'none',
              backgroundColor: i === selectedQuarter ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: i === selectedQuarter ? 'rgb(247,248,248)' : 'rgb(138,143,152)',
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
        <>
        <div style={{ padding: '0 20px' }}>
          <AgentStatusStrip
            items={[
              { label: '분기 후보', value: `${visibleMatches.length}개`, tone: 'green' },
              { label: '평균 적합도', value: `${avgScore}점`, tone: 'indigo' },
              { label: '보완 필요', value: `${improveCount}개`, tone: improveCount ? 'amber' : 'muted' },
            ]}
          />
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px',
          padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {[
            { label: '분기 후보', value: `${visibleMatches.length}개` },
            { label: '평균 적합도', value: `${avgScore}점` },
            { label: '지원 준비', value: `${readyCount}개` },
            { label: '보완 필요', value: `${improveCount}개` },
          ].map((item) => (
            <div key={item.label} style={{
              border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px',
              backgroundColor: 'rgb(13,14,15)', padding: '14px',
            }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>{item.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 600, color: 'rgba(255,255,255,0.88)' }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', overflow: 'hidden' }}>
          {/* Left panel */}
          <div style={{ width: '240px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgb(11,12,13)' }}>
            <div style={{ height: '40px', borderBottom: '1px solid rgba(255,255,255,0.06)' }} />
            {visibleMatches.map((m: MatchDto) => {
              const color = scoreColor(m.totalScore)
              const active = selectedMatch?.matchId === m.matchId
              return (
                <button key={m.matchId} type="button" onClick={() => setSelectedMatchId(m.matchId)} style={{
                  width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left',
                  height: '52px', display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '0 16px', borderBottom: '1px solid rgba(255,255,255,0.04)',
                  backgroundColor: active ? 'rgba(99,102,241,0.12)' : 'transparent',
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: 'rgb(247,248,248)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.job.company}
                  </span>
                  <ScoreBadge score={m.totalScore} />
                </button>
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
                {visibleMatches.map((m: MatchDto) => {
                  const color = scoreColor(m.totalScore)
                  const stage = getStage(m.totalScore)
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
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        boxShadow: selectedMatch?.matchId === m.matchId ? `0 0 0 2px ${color}55` : 'none',
                      }}>
                        <span style={{
                          position: 'relative', fontSize: '11px', fontWeight: 500,
                          color: '#fff', paddingLeft: '10px',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {m.job.title}
                        </span>
                        <span style={{ fontSize: '10px', color: '#fff', opacity: 0.86, paddingRight: '10px', whiteSpace: 'nowrap' }}>
                          {stage.label}
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

          <aside style={{
            borderLeft: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgb(11,12,13)',
            padding: '18px', overflow: 'auto',
          }}>
            {selectedMatch && (
              <>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>선택한 흐름</div>
                <div style={{ fontSize: '16px', fontWeight: 600, lineHeight: 1.35, color: 'rgba(255,255,255,0.9)', marginBottom: '4px' }}>
                  {selectedMatch.job.title}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.42)', marginBottom: '16px' }}>
                  {selectedMatch.job.company}
                </div>
                {[
                  { label: '기술 스택', value: selectedMatch.skillScore },
                  { label: '경험 근거', value: selectedMatch.evidenceScore },
                  { label: '역할 적합도', value: selectedMatch.roleScore },
                  { label: '선호도', value: selectedMatch.preferenceScore },
                ].map((item) => (
                  <div key={item.label} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>
                      <span>{item.label}</span>
                      <span style={{ color: 'rgba(255,255,255,0.82)' }}>{item.value}</span>
                    </div>
                    <div style={{ height: '4px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.08)' }}>
                      <div style={{ height: '4px', borderRadius: '4px', width: `${item.value}%`, backgroundColor: scoreColor(item.value) }} />
                    </div>
                  </div>
                ))}
                <div className="agent-surface agent-reveal" style={{
                  marginTop: '18px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)',
                  backgroundColor: 'rgba(255,255,255,0.03)', padding: '14px',
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: getStage(selectedMatch.totalScore).color, marginBottom: '6px' }}>
                    {getStage(selectedMatch.totalScore).label}
                  </div>
                  <div style={{ fontSize: '12px', lineHeight: 1.55, color: 'rgba(255,255,255,0.52)' }}>
                    {selectedMatch.totalScore >= 85
                      ? '지원서와 포트폴리오를 맞춰 바로 준비해볼 수 있습니다.'
                      : selectedMatch.totalScore >= 70
                        ? '이력서 근거와 프로젝트 설명을 보강한 뒤 지원 우선순위에 올리는 것이 좋습니다.'
                        : '지금은 탐색 대상으로 두고 부족한 신호를 먼저 채우는 편이 좋습니다.'}
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
        </>
      )}
    </div>
  )
}
