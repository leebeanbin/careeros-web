'use client'
import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { listMatches, hideMatch } from '@/lib/api/matches'
import type { MatchDto } from '@/lib/api/types'
import CursorList from '@/components/ui/CursorList'
import { MatchStatusIcon } from '@/components/app/MatchStatusIcon'
import { GroupHeader } from '@/components/app/GroupHeader'
import { FilterPill } from '@/components/app/FilterPill'
import { useToastStore } from '@/stores/toastStore'
import { AgentIntro, AgentStatusStrip } from '@/components/app/AgentPrimitives'

const SCORE_GROUPS = [
  { label: '우수 매칭', min: 80, max: 100 },
  { label: '양호 매칭', min: 65, max: 79 },
  { label: '보통 매칭', min: 50, max: 64 },
  { label: '낮은 매칭', min: 0,  max: 49 },
]

const MATCH_FILTERS = [
  { value: 'all', label: '전체 점수', min: 0 },
  { value: 'strong', label: '80점 이상', min: 80 },
  { value: 'good', label: '65점 이상', min: 65 },
  { value: 'possible', label: '50점 이상', min: 50 },
] as const

const MATCH_GROUPS = [
  { value: 'score', label: '점수별 그룹' },
  { value: 'company', label: '회사별 그룹' },
  { value: 'none', label: '그룹 없음' },
] as const

const MATCH_VIEWS = [
  { value: 'comfortable', label: '넓게 보기' },
  { value: 'compact', label: '촘촘히 보기' },
] as const

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

function MatchRow({
  m,
  showHide,
  onHide,
  view,
}: {
  m: MatchDto
  showHide: boolean
  onHide: (id: string | number) => void
  view: string
}) {
  const isCompact = view === 'compact'
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        minHeight: isCompact ? '32px' : '42px',
        padding: isCompact ? '0 16px' : '6px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <MatchStatusIcon score={m.totalScore} size={14} />
      <Link href={`/matches/${m.matchId}`} style={{
        flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', gap: '1px', textDecoration: 'none',
      }}>
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {m.job.title}
        </span>
        {!isCompact && (
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{m.job.company}</span>
        )}
      </Link>
      <ScoreBadge score={m.totalScore} />
      {showHide && (
        <button
          onClick={() => onHide(m.matchId)}
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
  )
}

function MatchesPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const qc = useQueryClient()
  const { add } = useToastStore()

  const tab = searchParams.get('tab') ?? 'all'
  const filter = searchParams.get('filter') ?? 'all'
  const group = searchParams.get('group') ?? 'score'
  const view = searchParams.get('view') ?? 'comfortable'
  const hideHidden = tab === 'all'
  const filterMeta = MATCH_FILTERS.find((f) => f.value === filter) ?? MATCH_FILTERS[0]

  const { data: allMatches } = useQuery({
    queryKey: ['matches', { all: true }],
    queryFn: () => listMatches({ size: 50, hideHidden: true }),
    enabled: tab === 'all',
  })

  const { mutate: hide } = useMutation({
    mutationFn: (matchId: string | number) => hideMatch(matchId),
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
    if (value === 'all') p.delete('tab')
    else p.set('tab', value)
    router.push(`/matches?${p.toString()}`)
  }

  const setParam = (key: string, value: string, defaultValue: string) => {
    const p = new URLSearchParams(searchParams.toString())
    if (value === defaultValue) p.delete(key)
    else p.set(key, value)
    router.push(`/matches?${p.toString()}`)
  }

  const cycleParam = <T extends readonly { value: string }[]>(key: string, values: T, current: string) => {
    const index = values.findIndex((item) => item.value === current)
    const next = values[(index + 1) % values.length].value
    setParam(key, next, values[0].value)
  }

  const visibleMatches = (allMatches?.content ?? []).filter((m) => m.totalScore >= filterMeta.min)

  const companyGroups = [...new Set(visibleMatches.map((m) => m.job.company || '회사 미상'))]
    .map((label) => ({
      label,
      items: visibleMatches.filter((m) => (m.job.company || '회사 미상') === label),
    }))

  const groupedMatches =
    group === 'none'
      ? [{ label: '전체 매칭', items: visibleMatches }]
      : group === 'company'
        ? companyGroups
        : SCORE_GROUPS.map((g) => ({
            label: g.label,
            items: visibleMatches.filter((m) => m.totalScore >= g.min && m.totalScore <= g.max),
          }))

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ padding: '16px 16px 0' }}>
        <AgentIntro
          title="매칭 근거를 우선순위로 정리했어요"
          description="점수, 회사, 보기 밀도를 바꾸면서 지원할 흐름과 보완할 흐름을 빠르게 분리합니다."
          steps={['점수 필터링', '그룹 재정렬', '숨김 처리']}
        />
        {tab === 'all' && (
          <AgentStatusStrip
            items={[
              { label: '보이는 매칭', value: visibleMatches.length, tone: 'green' },
              { label: '필터 기준', value: filterMeta.label, tone: filter === 'all' ? 'muted' : 'indigo' },
              { label: '보기 방식', value: view === 'compact' ? '촘촘히' : '넓게', tone: 'amber' },
            ]}
          />
        )}
      </div>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center',
        height: '48px', padding: '0 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgb(8,9,10)',
      }}>
        {/* Tabs */}
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
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: '6px' }}>
          <FilterPill
            label={`필터: ${filterMeta.label}`}
            onClick={() => cycleParam('filter', MATCH_FILTERS, filter)}
            active={filter !== 'all'}
            title="매칭 점수 기준을 변경합니다"
          />
          <FilterPill
            label={MATCH_GROUPS.find((g) => g.value === group)?.label ?? '점수별 그룹'}
            onClick={() => cycleParam('group', MATCH_GROUPS, group)}
            active={group !== 'score'}
            title="매칭 목록 그룹 방식을 변경합니다"
          />
          <FilterPill
            label={MATCH_VIEWS.find((v) => v.value === view)?.label ?? '넓게 보기'}
            onClick={() => cycleParam('view', MATCH_VIEWS, view)}
            active={view !== 'comfortable'}
            title="매칭 목록 표시 밀도를 변경합니다"
          />
        </div>
      </div>

      {/* All tab: grouped by score */}
      {tab === 'all' ? (
        <div>
          {groupedMatches.map(({ label, items }) => {
            if (!items.length) return null
            return (
              <div key={label}>
                {group !== 'none' && <GroupHeader label={label} count={items.length} />}
                {items.map((m) => (
                  <MatchRow key={m.matchId} m={m} showHide onHide={(id) => hide(id)} view={view} />
                ))}
              </div>
            )
          })}
          {!allMatches && (
            <div style={{ padding: '32px', textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
              로딩 중...
            </div>
          )}
          {allMatches && !visibleMatches.length && (
            <div style={{ padding: '32px', textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
              조건에 맞는 매칭이 없습니다
            </div>
          )}
        </div>
      ) : (
        /* Hidden tab: cursor list */
        <div style={{ padding: '0' }}>
          <CursorList<MatchDto>
            queryKey={['matches', { hideHidden: false }]}
            fetcher={(cursor) => listMatches({ cursor, size: 30, hideHidden: false })}
            className=""
            renderItem={(m) => (
              <MatchRow key={m.matchId} m={m} showHide={false} onHide={() => {}} view={view} />
            )}
            emptyTitle="숨긴 매칭이 없습니다"
          />
        </div>
      )}
    </div>
  )
}

export default function MatchesPage() {
  return (
    <Suspense fallback={null}>
      <MatchesPageContent />
    </Suspense>
  )
}
