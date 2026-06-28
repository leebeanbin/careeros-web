'use client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { listMatches } from '@/lib/api/matches'
import { listNotifications } from '@/lib/api/notifications'
import { getDashboard } from '@/lib/api/advisor'
import { MatchStatusIcon } from '@/components/app/MatchStatusIcon'

const sl = {
  fontSize: '11px', fontWeight: 500,
  color: 'rgba(255,255,255,0.4)' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
}

function ScoreBadge({ score }: { score: number }) {
  const bg = score >= 80 ? 'rgba(34,197,94,0.12)' : score >= 65 ? 'rgba(234,179,8,0.12)' : 'rgba(255,255,255,0.06)'
  const color = score >= 80 ? 'rgb(34,197,94)' : score >= 65 ? 'rgb(234,179,8)' : 'rgba(255,255,255,0.4)'
  return (
    <span style={{ backgroundColor: bg, color, borderRadius: '10px', fontSize: '11px', fontWeight: 500, padding: '1px 7px', whiteSpace: 'nowrap' }}>
      {score}
    </span>
  )
}

export default function DashboardPage() {
  const { data: matchesData } = useQuery({
    queryKey: ['matches', { size: 8 }],
    queryFn: () => listMatches({ size: 8 }),
  })
  const { data: notifData } = useQuery({
    queryKey: ['notifications', { size: 5, unreadOnly: true }],
    queryFn: () => listNotifications({ size: 5, unreadOnly: true }),
  })
  const { data: advisor } = useQuery({
    queryKey: ['advisor', 'dashboard'],
    queryFn: getDashboard,
  })

  return (
    <div style={{ padding: '0 24px 32px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Sticky page header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10, height: '48px',
        display: 'flex', alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgb(8,9,10)',
        margin: '0 -24px', padding: '0 24px',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>대시보드</span>
      </div>

      <div style={{ paddingTop: '24px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
        {/* Left: recent matches */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={sl}>최근 매칭</span>
            <Link href="/matches" style={{ fontSize: '12px', color: 'rgb(99,102,241)', textDecoration: 'none' }}>전체 보기</Link>
          </div>
          <div style={{ borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', backgroundColor: 'rgb(13,14,15)' }}>
            {!matchesData?.content.length ? (
              <div style={{ padding: '32px', textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
                매칭된 공고가 없습니다
              </div>
            ) : matchesData.content.map((m, i) => (
              <Link
                key={m.matchId}
                href={`/matches/${m.matchId}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  height: '44px', padding: '0 16px',
                  borderBottom: i < matchesData.content.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  textDecoration: 'none', backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <MatchStatusIcon score={m.totalScore} size={14} />
                <span style={{ flex: 1, fontSize: '13px', color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {m.job.title}
                </span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', marginRight: '4px' }}>
                  {m.job.company}
                </span>
                <ScoreBadge score={m.totalScore} />
              </Link>
            ))}
          </div>
        </div>

        {/* Right: advisor + notifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {advisor && (
            <div style={{ borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgb(13,14,15)', padding: '16px' }}>
              <div style={{ ...sl, marginBottom: '12px' }}>AI 어드바이저</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                {([
                  { label: '총 매칭', value: advisor.totalMatches },
                  { label: '평균 점수', value: advisor.avgMatchScore },
                ] as const).map((s) => (
                  <div key={s.label}>
                    <div style={{ fontSize: '22px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{s.value}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <Link href="/advisor" style={{ fontSize: '12px', color: 'rgb(99,102,241)', textDecoration: 'none' }}>어드바이저 보기 →</Link>
            </div>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={sl}>읽지 않은 알림</span>
              <Link href="/notifications" style={{ fontSize: '12px', color: 'rgb(99,102,241)', textDecoration: 'none' }}>전체</Link>
            </div>
            <div style={{ borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', backgroundColor: 'rgb(13,14,15)' }}>
              {!notifData?.content.length ? (
                <div style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>새 알림이 없습니다</div>
              ) : notifData.content.map((n, i) => (
                <div key={n.notificationId} style={{
                  padding: '10px 14px',
                  borderBottom: i < notifData.content.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {n.message}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '3px' }}>
                    {new Date(n.createdAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
