'use client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { listMatches } from '@/lib/api/matches'
import { listNotifications } from '@/lib/api/notifications'
import { getDashboard } from '@/lib/api/advisor'
import { MatchStatusIcon } from '@/components/app/MatchStatusIcon'
import { AgentIntro, AgentPanel, AgentStatusStrip } from '@/components/app/AgentPrimitives'

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
    <span style={{ backgroundColor: bg, color, borderRadius: '10px', fontSize: '11px', fontWeight: 500, padding: '1px 7px', whiteSpace: 'nowrap', flexShrink: 0 }}>
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
    <div style={{ padding: '24px 24px 32px', maxWidth: '1100px', margin: '0 auto' }}>
      <AgentIntro
        title="오늘의 커리어 상태를 정리했어요"
        description="매칭, 알림, 어드바이저 신호를 한 번에 읽고 지금 먼저 볼 흐름을 띄웁니다."
        steps={['최근 매칭 확인', '읽지 않은 신호 정리', '어드바이저 요약']}
      />
      <AgentStatusStrip
        items={[
          { label: '최근 매칭', value: matchesData?.content.length ?? '...', tone: 'green' },
          { label: '읽지 않은 알림', value: notifData?.content.length ?? '...', tone: 'amber' },
          { label: '평균 점수', value: advisor?.avgMatchScore ?? '...', tone: 'indigo' },
        ]}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '24px' }}>
        {/* Left: recent matches */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={sl}>최근 매칭</span>
            <Link href="/matches" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.82)', textDecoration: 'none' }}>전체 보기</Link>
          </div>
          <AgentPanel style={{ overflow: 'hidden' }}>
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
                  minHeight: '44px', padding: '8px 16px',
                  borderBottom: i < matchesData.content.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  textDecoration: 'none', backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <MatchStatusIcon score={m.totalScore} size={14} />
                <span style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ flex: 1, minWidth: 0, fontSize: '13px', color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.job.title}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', minWidth: 0, flexShrink: 0 }}>
                    <span className="hidden min-[420px]:inline" style={{ maxWidth: '96px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.job.company}
                    </span>
                    <ScoreBadge score={m.totalScore} />
                  </span>
                </span>
              </Link>
            ))}
          </AgentPanel>
        </div>

        {/* Right: advisor + notifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {advisor && (
            <AgentPanel delay={80} style={{ padding: '16px' }}>
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
              <Link href="/advisor" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.82)', textDecoration: 'none' }}>어드바이저 보기 →</Link>
            </AgentPanel>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={sl}>읽지 않은 알림</span>
              <Link href="/notifications" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.82)', textDecoration: 'none' }}>전체</Link>
            </div>
            <AgentPanel delay={140} style={{ overflow: 'hidden' }}>
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
            </AgentPanel>
          </div>
        </div>
      </div>
    </div>
  )
}
