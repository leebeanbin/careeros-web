'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { listMatches, hideMatch } from '@/lib/api/matches'
import type { MatchDto } from '@/lib/api/types'
import PageHeader from '@/components/ui/PageHeader'
import CursorList from '@/components/ui/CursorList'
import { MatchScoreBadge } from '@/components/ui/Badge'
import { useToastStore } from '@/stores/toastStore'

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

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-6">
      <PageHeader title="나의 매칭" description="AI가 분석한 맞춤 채용 매칭 결과" />

      <div className="flex border-b border-gray-200 mb-4">
        {[
          { value: 'all', label: '전체' },
          { value: 'hidden', label: '숨김' },
        ].map((t) => (
          <button
            key={t.value}
            onClick={() => {
              const p = new URLSearchParams(searchParams.toString())
              t.value === 'all' ? p.delete('tab') : p.set('tab', t.value)
              router.push(`/matches?${p.toString()}`)
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px
              ${tab === t.value
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <CursorList<MatchDto>
        queryKey={['matches', { hideHidden }]}
        fetcher={(cursor) => listMatches({ cursor, size: 20, hideHidden })}
        renderItem={(m) => (
          <div
            key={m.matchId}
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white
                       px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]
                       hover:border-gray-300 transition-all duration-[150ms]"
          >
            <Link href={`/matches/${m.matchId}`} className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 line-clamp-1">{m.job.title}</p>
              <p className="text-xs text-gray-500">{m.job.company}</p>
            </Link>
            <MatchScoreBadge score={m.totalScore} />
            {tab === 'all' && (
              <button
                onClick={() => hide(m.matchId)}
                className="text-xs text-gray-400 hover:text-red-400 transition-colors shrink-0"
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
  )
}
