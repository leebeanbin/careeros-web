'use client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { listMatches } from '@/lib/api/matches'
import { listNotifications } from '@/lib/api/notifications'
import { getDashboard } from '@/lib/api/advisor'
import PageHeader from '@/components/ui/PageHeader'
import JobCard from '@/components/app/JobCard'
import { CardSkeleton } from '@/components/ui/Skeleton'

export default function DashboardPage() {
  const { data: matchesData, isLoading: matchLoading } = useQuery({
    queryKey: ['matches', { size: 5 }],
    queryFn: () => listMatches({ size: 5 }),
  })

  const { data: notifData, isLoading: notifLoading } = useQuery({
    queryKey: ['notifications', { size: 5, unreadOnly: true }],
    queryFn: () => listNotifications({ size: 5, unreadOnly: true }),
  })

  const { data: advisorData } = useQuery({
    queryKey: ['advisor', 'dashboard'],
    queryFn: getDashboard,
  })

  return (
    <div className="max-w-[900px] mx-auto px-5 py-6">
      <PageHeader title="대시보드" description="최근 매칭과 알림을 확인하세요" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent matches */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">최근 매칭</h2>
            <Link href="/matches" className="text-xs text-indigo-600 hover:underline">전체 보기</Link>
          </div>
          <div className="space-y-2">
            {matchLoading
              ? [0, 1, 2].map((i) => <CardSkeleton key={i} />)
              : matchesData?.content.length === 0
                ? <p className="text-sm text-gray-400 py-4 text-center">매칭된 공고가 없습니다</p>
                : matchesData?.content.map((m) => (
                    <JobCard key={m.matchId} job={m.job} score={m.totalScore} />
                  ))
            }
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Advisor widget */}
          {advisorData && (
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">AI 어드바이저</h2>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <p className="text-xs text-gray-500">총 매칭</p>
                  <p className="text-lg font-semibold text-gray-900">{advisorData.totalMatches}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">평균 점수</p>
                  <p className="text-lg font-semibold text-indigo-600">{advisorData.avgMatchScore}</p>
                </div>
              </div>
              <Link href="/advisor" className="text-xs text-indigo-600 hover:underline">
                어드바이저 보기 →
              </Link>
            </div>
          )}

          {/* Unread notifications */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700">읽지 않은 알림</h2>
              <Link href="/notifications" className="text-xs text-indigo-600 hover:underline">전체</Link>
            </div>
            {notifLoading
              ? [0, 1].map((i) => <CardSkeleton key={i} />)
              : notifData?.content.length === 0
                ? <p className="text-sm text-gray-400 text-center py-2">새 알림이 없습니다</p>
                : (
                  <div className="space-y-1">
                    {notifData?.content.map((n) => (
                      <div key={n.notificationId}
                           className="rounded-md border border-gray-100 bg-white px-3 py-2">
                        <p className="text-xs text-gray-700 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {new Date(n.createdAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    ))}
                  </div>
                )
            }
          </div>
        </div>
      </div>
    </div>
  )
}
