'use client'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { getMatch } from '@/lib/api/matches'
import ScoreBreakdownChart from '@/components/app/ScoreBreakdownChart'
import { MatchScoreBadge, Badge } from '@/components/ui/Badge'
import { CardSkeleton } from '@/components/ui/Skeleton'

const axes = [
  { key: 'skillScore' as const, label: '기술 스택' },
  { key: 'evidenceScore' as const, label: '경력 증거' },
  { key: 'roleScore' as const, label: '역할 적합' },
  { key: 'preferenceScore' as const, label: '선호도' },
  { key: 'freshnessScore' as const, label: '최신성' },
]

const remoteLabel: Record<string, string> = {
  REMOTE: '원격',
  HYBRID: '하이브리드',
  ON_SITE: '오프사이트',
}

export default function MatchDetailPage() {
  const { matchId } = useParams<{ matchId: string }>()
  const { data: match, isLoading } = useQuery({
    queryKey: ['matches', Number(matchId)],
    queryFn: () => getMatch(Number(matchId)),
  })

  if (isLoading) {
    return (
      <div className="max-w-[900px] mx-auto px-5 py-6 space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )
  }
  if (!match) return null

  return (
    <div className="max-w-[900px] mx-auto px-5 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/matches" className="text-sm text-gray-400 hover:text-gray-600">
          ← 매칭 목록
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">매칭 점수</h2>
            <MatchScoreBadge score={match.totalScore} />
          </div>
          <ScoreBreakdownChart
            skillScore={match.skillScore}
            evidenceScore={match.evidenceScore}
            roleScore={match.roleScore}
            preferenceScore={match.preferenceScore}
            freshnessScore={match.freshnessScore}
          />
          <div className="mt-4 space-y-2">
            {axes.map((a) => (
              <div key={a.key} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-20 shrink-0">{a.label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-gray-100">
                  <div
                    className="h-1.5 rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${match[a.key]}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700 w-8 text-right">
                  {match[a.key]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Job detail */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <h2 className="text-base font-semibold text-gray-900 mb-1">{match.job.title}</h2>
          <p className="text-sm text-gray-500 mb-4">{match.job.company}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            <Badge>{remoteLabel[match.job.remoteType] ?? match.job.remoteType}</Badge>
            {match.job.roleCategory && <Badge>{match.job.roleCategory}</Badge>}
            {match.job.preferredCountries.map((c) => (
              <Badge key={c}>{c}</Badge>
            ))}
          </div>
          <p className="text-sm leading-relaxed text-gray-700 line-clamp-6 mb-4">
            {match.job.description}
          </p>
          {match.job.applyUrl && (
            <a
              href={match.job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2
                         text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              지원하기 →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
