'use client'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { getMatch } from '@/lib/api/matches'
import ScoreBreakdownChart from '@/components/app/ScoreBreakdownChart'
import { MatchStatusIcon } from '@/components/app/MatchStatusIcon'

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
  const { data: match, isLoading } = useQuery({
    queryKey: ['matches', Number(matchId)],
    queryFn: () => getMatch(Number(matchId)),
  })

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
        <button type="button" style={{ background: 'none', border: 'none', color: 'rgb(138,143,152)', cursor: 'pointer', fontSize: '16px', letterSpacing: '1px' }}>···</button>
      </div>

      {/* 2-column body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: score content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px' }}>
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
          <div style={{
            backgroundColor: 'rgb(13,14,15)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px', padding: '20px', marginBottom: '20px',
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
          </div>

          {/* 5-axis bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
