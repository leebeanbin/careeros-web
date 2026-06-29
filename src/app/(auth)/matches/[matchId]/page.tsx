'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { getMatch, hideMatch } from '@/lib/api/matches'
import ScoreBreakdownChart from '@/components/app/ScoreBreakdownChart'
import { MatchStatusIcon } from '@/components/app/MatchStatusIcon'
import { useToastStore } from '@/stores/toastStore'
import { AgentIntro, AgentPanel, AgentStepList } from '@/components/app/AgentPrimitives'

const AXES = [
  { key: 'skillScore' as const,      label: '기술 스택' },
  { key: 'evidenceScore' as const,   label: '경력 증거' },
  { key: 'roleScore' as const,       label: '역할 적합' },
  { key: 'preferenceScore' as const, label: '선호도' },
  { key: 'freshnessScore' as const,  label: '최신성' },
]

const REMOTE: Record<string, string> = { REMOTE: '원격', HYBRID: '하이브리드', ON_SITE: '오프사이트' }

function ScoreBadge({ score }: { score: number }) {
  const [bg, color] =
    score >= 80
      ? ['rgba(34,197,94,0.12)', 'rgb(34,197,94)']
      : score >= 65
        ? ['rgba(234,179,8,0.12)', 'rgb(234,179,8)']
        : ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.4)']
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: '42px', height: '22px', padding: '0 8px', borderRadius: '11px',
      backgroundColor: bg, fontSize: '12px', fontWeight: 600, color,
    }}>{score}</span>
  )
}

export default function MatchDetailPage() {
  const { matchId } = useParams<{ matchId: string }>()
  const router = useRouter()
  const qc = useQueryClient()
  const { add } = useToastStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: match, isLoading } = useQuery({
    queryKey: ['matches', matchId],
    queryFn: () => getMatch(matchId),
  })

  const { mutate: hide, isPending: hiding } = useMutation({
    mutationFn: () => hideMatch(matchId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['matches'] })
      add('success', '매칭을 숨겼습니다.')
      router.push('/matches')
    },
    onError: () => add('error', '매칭 숨기기에 실패했습니다.'),
  })

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setMenuOpen(false)
    add('success', '매칭 링크를 복사했습니다.')
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '100%' }}>
        {[0, 1].map((i) => (
          <div key={i} style={{
            flex: i === 0 ? 1 : undefined,
            width: i === 1 ? '280px' : undefined,
            height: '100%',
            backgroundColor: i === 1 ? 'rgb(11,12,13)' : 'transparent',
            borderLeft: i === 1 ? '1px solid rgba(255,255,255,0.06)' : undefined,
          }} />
        ))}
      </div>
    )
  }
  if (!match) return null

  const metaItems: { label: string; content: React.ReactNode }[] = [
    { label: '매칭 점수', content: <ScoreBadge score={match.totalScore} /> },
    { label: '상태', content: <span style={{ fontSize: '12px', color: 'rgb(208,214,224)' }}>활성</span> },
    { label: '회사', content: <span style={{ fontSize: '12px', color: 'rgb(208,214,224)' }}>{match.job.company}</span> },
    { label: '근무형태', content: <span style={{ fontSize: '12px', color: 'rgb(208,214,224)' }}>{REMOTE[match.job.remoteType] ?? match.job.remoteType}</span> },
    { label: '직무', content: <span style={{ fontSize: '12px', color: 'rgb(208,214,224)' }}>{match.job.roleCategory || '—'}</span> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'rgb(8,9,10)' }}>
      {/* Sticky breadcrumb header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '48px', padding: '0 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgb(8,9,10)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <Link href="/matches" style={{ fontSize: '13px', color: 'rgb(138,143,152)', textDecoration: 'none' }}>
            ← 매칭
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
          <span style={{ fontSize: '13px', color: 'rgb(138,143,152)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {match.job.title}
          </span>
        </div>
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            style={{ background: 'none', border: 'none', color: 'rgb(138,143,152)', cursor: 'pointer', fontSize: '16px', letterSpacing: '1px' }}
          >
            ···
          </button>
          {menuOpen && (
            <div
              role="menu"
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 6px)',
                width: '168px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: 'rgb(17,18,19)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                zIndex: 40,
                overflow: 'hidden',
              }}
            >
              {[
                { label: hiding ? '숨기는 중...' : '매칭 숨기기', onClick: () => hide(), danger: true },
                { label: '링크 복사', onClick: copyLink },
                { label: '공고 상세 보기', onClick: () => router.push(`/jobs/${match.job.jobId}`) },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  disabled={item.label === '숨기는 중...'}
                  onClick={() => { item.onClick(); if (item.label !== '링크 복사') setMenuOpen(false) }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '9px 12px',
                    border: 'none',
                    background: 'transparent',
                    color: item.danger ? 'rgba(255,99,99,0.8)' : 'rgba(255,255,255,0.72)',
                    textAlign: 'left',
                    fontSize: '13px',
                    cursor: item.label === '숨기는 중...' ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2-column body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: score content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px' }}>
          <AgentIntro
            title="이 매칭의 근거를 분해합니다"
            description="총점보다 중요한 축별 근거와 보완 지점을 먼저 읽습니다."
            steps={['점수 축 분해', '역할 적합도 확인', '지원 판단']}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <MatchStatusIcon score={match.totalScore} size={16} />
            <ScoreBadge score={match.totalScore} />
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: 500, color: 'rgb(247,248,248)', margin: '0 0 6px', lineHeight: 1.3 }}>
            {match.job.title}
          </h1>
          <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgb(138,143,152)', margin: '0 0 32px' }}>
            {match.job.company}
          </p>

          {/* Score chart */}
          <AgentPanel style={{
            backgroundColor: 'rgb(13,14,15)',
            border: '1px solid rgba(255,255,255,0.06)',
            padding: '20px', marginBottom: '20px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
              매칭 점수 분포
            </div>
            <ScoreBreakdownChart
              skillScore={match.skillScore}
              evidenceScore={match.evidenceScore}
              roleScore={match.roleScore}
              preferenceScore={match.preferenceScore}
              freshnessScore={match.freshnessScore}
            />
          </AgentPanel>

          <AgentPanel delay={80} style={{ padding: '16px', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Agent next read</div>
            <AgentStepList
              steps={[
                { label: '강한 근거', detail: `기술 스택 ${match.skillScore}점, 경험 근거 ${match.evidenceScore}점 축을 지원서에 먼저 배치합니다.`, tone: 'green' },
                { label: '주의할 간극', detail: `선호도 ${match.preferenceScore}점과 최신성 ${match.freshnessScore}점을 확인해 무리한 지원인지 점검합니다.`, tone: 'amber' },
                { label: '다음 행동', detail: match.totalScore >= 80 ? '바로 지원 준비 후보로 올려도 좋습니다.' : '이력서 근거를 보강한 뒤 다시 비교하는 편이 좋습니다.' },
              ]}
            />
          </AgentPanel>

          {/* AI 매칭 해설 (Backend Explanation) */}
          {match.explanation && (
            <AgentPanel style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              padding: '20px',
              marginBottom: '20px',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                AI 매칭 해설
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.6, margin: '0 0 16px 0', whiteSpace: 'pre-wrap' }}>
                {match.explanation.summary}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {match.explanation.matchedSkills && match.explanation.matchedSkills.length > 0 && (
                  <div>
                    <span style={{ fontSize: '11px', color: 'rgb(34, 197, 94)', display: 'block', marginBottom: '6px', fontWeight: 500 }}>
                      일치하는 스킬
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {match.explanation.matchedSkills.map((s, idx) => (
                        <span key={idx} style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                          color: 'rgb(34, 197, 94)',
                        }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {match.explanation.missingSkills && match.explanation.missingSkills.length > 0 && (
                  <div>
                    <span style={{ fontSize: '11px', color: 'rgb(239, 68, 68)', display: 'block', marginBottom: '6px', fontWeight: 500 }}>
                      부족한 스킬
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {match.explanation.missingSkills.map((s, idx) => (
                        <span key={idx} style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: 'rgb(239, 68, 68)',
                        }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {match.explanation.preferenceMismatches && match.explanation.preferenceMismatches.length > 0 && (
                  <div>
                    <span style={{ fontSize: '11px', color: 'rgb(234, 179, 8)', display: 'block', marginBottom: '6px', fontWeight: 500 }}>
                      선호도 불일치 항목
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {match.explanation.preferenceMismatches.map((m, idx) => (
                        <span key={idx} style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(234, 179, 8, 0.1)',
                          color: 'rgb(234, 179, 8)',
                        }}>
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AgentPanel>
          )}

          {/* 5-axis bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {AXES.map((a) => (
              <div key={a.key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '60px', fontSize: '11px', color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>
                  {a.label}
                </span>
                <div style={{ flex: 1, height: '2px', borderRadius: '2px', backgroundColor: 'rgba(255,255,255,0.08)' }}>
                  <div style={{
                    height: '2px', borderRadius: '2px',
                    backgroundColor: 'rgb(99,102,241)',
                    width: `${match[a.key]}%`,
                    transition: 'width 0.4s ease',
                  }} />
                </div>
                <span style={{ width: '28px', fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.6)', textAlign: 'right', flexShrink: 0 }}>
                  {match[a.key]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 280px meta panel */}
        <div style={{
          width: '280px', flexShrink: 0,
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: 'rgb(11,12,13)',
          padding: '24px 20px', overflow: 'auto',
        }}>
          {metaItems.map(({ label, content }) => (
            <div key={label} style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: 'rgb(138,143,152)', marginBottom: '6px', fontWeight: 500 }}>{label}</div>
              {content}
            </div>
          ))}

          {match.job.applyUrl && (
            <a
              href={match.job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                height: '34px', borderRadius: '6px',
                backgroundColor: 'rgb(99,102,241)',
                fontSize: '13px', fontWeight: 500, color: 'white',
                textDecoration: 'none', marginTop: '8px',
                transition: 'opacity 0.1s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              지원하기 →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
