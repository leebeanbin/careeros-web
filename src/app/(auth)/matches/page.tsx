'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { listMatches, hideMatch } from '@/lib/api/matches'
import type { MatchDto } from '@/lib/api/types'
import CursorList from '@/components/ui/CursorList'
import { MatchStatusIcon } from '@/components/app/MatchStatusIcon'
import { useToastStore } from '@/stores/toastStore'

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
      minWidth: '36px', height: '20px', padding: '0 6px', borderRadius: '10px',
      backgroundColor: bg, fontSize: '11px', fontWeight: 500, color,
    }}>{score}</span>
  )
}

export default function MatchesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const qc = useQueryClient()
  const { add } = useToastStore()

  const tab = searchParams.get('tab') ?? 'all'
  const hideHidden = tab === 'all'

  const { mutate: hide } = useMutation({
    mutationFn: (matchId: number) => hideMatch(matchId),
    onMutate: async (matchId) => {
      await qc.cancelQueries({ queryKey: ['matches'] })
      const prev = qc.getQueryData(['matches', { hideHidden }])
      qc.setQueriesData(
        { queryKey: ['matches'] },
        (old: { pages: { content: MatchDto[] }[] } | undefined) => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map((p) => ({
              ...p,
              content: p.content.filter((m: MatchDto) => m.matchId !== matchId),
            })),
          }
        },
      )
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(['matches', { hideHidden }], ctx.prev)
      add('error', '숨기기에 실패했습니다.')
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['matches'] }),
  })

  const setTab = (value: string) => {
    const p = new URLSearchParams(searchParams.toString())
    value === 'all' ? p.delete('tab') : p.set('tab', value)
    router.push(`/matches?${p.toString()}`)
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', gap: '0',
        height: '48px', padding: '0 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgb(8,9,10)',
      }}>
        {[{ value: 'all', label: '전체' }, { value: 'hidden', label: '숨김' }].map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            style={{
              height: '100%', padding: '0 16px',
              background: 'none', border: 'none',
              borderBottom: tab === t.value ? '2px solid rgb(99,102,241)' : '2px solid transparent',
              color: tab === t.value ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
              fontSize: '13px', fontWeight: tab === t.value ? 500 : 400,
              cursor: 'pointer', transition: 'color 0.1s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ padding: '0 24px 24px' }}>
        <CursorList<MatchDto>
          queryKey={['matches', { hideHidden }]}
          fetcher={(cursor) => listMatches({ cursor, size: 30, hideHidden })}
          className=""
          renderItem={(m, i) => (
            <div
              key={m.matchId}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                height: '44px', padding: '0 4px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <MatchStatusIcon score={m.totalScore} size={14} />
              <Link href={`/matches/${m.matchId}`} style={{
                flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', gap: '1px', textDecoration: 'none',
              }}>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {m.job.title}
                </span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{m.job.company}</span>
              </Link>
              <ScoreBadge score={m.totalScore} />
              {tab === 'all' && (
                <button
                  onClick={() => hide(m.matchId)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '12px', color: 'rgba(255,255,255,0.3)',
                    padding: '4px 6px', borderRadius: '4px', flexShrink: 0,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,99,99,0.7)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
                >
                  숨기기
                </button>
              )}
            </div>
          )}
          emptyTitle={tab === 'hidden' ? '숨긴 매칭이 없습니다' : '매칭된 공고가 없습니다'}
          emptyDescription={tab === 'all' ? '이력서를 업로드하면 매칭이 시작됩니다.' : undefined}
        />
      </div>
    </div>
  )
}
