'use client'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { getMatch } from '@/lib/api/matches'
import ScoreBreakdownChart from '@/components/app/ScoreBreakdownChart'

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

function Pill({ label }: { label: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      height: '20px', padding: '0 8px', borderRadius: '10px',
      backgroundColor: 'rgba(255,255,255,0.06)',
      fontSize: '11px', color: 'rgba(255,255,255,0.5)',
    }}>{label}</span>
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
      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {[0, 1].map((i) => (
          <div key={i} style={{
            height: '200px', borderRadius: '8px',
            backgroundColor: 'rgba(255,255,255,0.04)',
            marginBottom: '16px',
          }} />
        ))}
      </div>
    )
  }
  if (!match) return null

  const card: React.CSSProperties = {
    backgroundColor: 'rgb(13,14,15)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '8px',
    padding: '20px',
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', gap: '12px',
        height: '48px', padding: '0 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgb(8,9,10)',
      }}>
        <Link href="/matches" style={{
          fontSize: '13px', color: 'rgba(255,255,255,0.35)',
          textDecoration: 'none',
        }}>
          ← 매칭 목록
        </Link>
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>/</span>
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {match.job.title}
        </span>
      </div>

      <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Left — score chart */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>매칭 점수</span>
            <ScoreBadge score={match.totalScore} />
          </div>

          <ScoreBreakdownChart
            skillScore={match.skillScore}
            evidenceScore={match.evidenceScore}
            roleScore={match.roleScore}
            preferenceScore={match.preferenceScore}
            freshnessScore={match.freshnessScore}
          />

          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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

        {/* Right — job detail */}
        <div style={card}>
          <h1 style={{ fontSize: '15px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', margin: '0 0 4px' }}>
            {match.job.title}
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '0 0 16px' }}>
            {match.job.company}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            <Pill label={REMOTE[match.job.remoteType] ?? match.job.remoteType} />
            {match.job.roleCategory && <Pill label={match.job.roleCategory} />}
            {match.job.preferredCountries.map((c) => <Pill key={c} label={c} />)}
          </div>

          <p style={{
            fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)',
            margin: '0 0 20px',
            display: '-webkit-box', WebkitLineClamp: 8, WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {match.job.description}
          </p>

          {match.job.applyUrl && (
            <a
              href={match.job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center',
                height: '34px', padding: '0 16px', borderRadius: '6px',
                backgroundColor: 'rgb(99,102,241)',
                fontSize: '13px', fontWeight: 500, color: 'white',
                textDecoration: 'none', transition: 'opacity 0.1s',
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
