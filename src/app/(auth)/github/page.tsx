'use client'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import {
  connectGitHub, getGitHubProfile, disconnectGitHub, syncGitHub, getSyncStatus, listRepos,
} from '@/lib/api/github'
import type { GitHubRepo } from '@/lib/api/types'
import PageHeader from '@/components/ui/PageHeader'
import CursorList from '@/components/ui/CursorList'
import { Badge } from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import { useToastStore } from '@/stores/toastStore'
import { ApiError } from '@/lib/api/client'

interface ConnectForm { username: string }

export default function GitHubPage() {
  const qc = useQueryClient()
  const { add } = useToastStore()
  const [syncId, setSyncId] = useState<string | null>(null)

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['github', 'connection'],
    queryFn: getGitHubProfile,
    retry: false,
  })

  const { data: syncStatus } = useQuery({
    queryKey: ['github', 'sync', syncId],
    queryFn: () => getSyncStatus(syncId!),
    enabled: !!syncId,
    refetchInterval: (q) => {
      const data = q.state.data
      if (!data || data.status === 'PENDING' || data.status === 'IN_PROGRESS') return 2000
      return false
    },
  })

  useEffect(() => {
    if (syncStatus?.status === 'COMPLETED') {
      add('success', 'GitHub 동기화가 완료되었습니다.')
      setSyncId(null)
      qc.invalidateQueries({ queryKey: ['github'] })
    } else if (syncStatus?.status === 'FAILED') {
      add('error', 'GitHub 동기화에 실패했습니다.')
      setSyncId(null)
    }
  }, [syncStatus?.status, add, qc])

  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<ConnectForm>()

  const { mutate: connect } = useMutation({
    mutationFn: (data: ConnectForm) => connectGitHub({ mode: 'username', username: data.username }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['github'] }); add('success', 'GitHub이 연결되었습니다.') },
    onError: (err) => add('error', err instanceof ApiError ? err.message : '연결에 실패했습니다.'),
  })

  const { mutate: disconnect } = useMutation({
    mutationFn: disconnectGitHub,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['github'] }); add('success', '연결이 해제되었습니다.') },
  })

  const { mutate: sync, isPending: syncing } = useMutation({
    mutationFn: syncGitHub,
    onSuccess: (data) => { setSyncId(data.syncId) },
    onError: () => add('error', '동기화 시작에 실패했습니다.'),
  })

  const isSyncing = syncing || syncStatus?.status === 'PENDING' || syncStatus?.status === 'IN_PROGRESS'

  if (profileLoading) {
    return (
      <div className="max-w-[640px] mx-auto px-5 py-6 flex items-center justify-center">
        <Spinner size="lg" className="text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="max-w-[640px] mx-auto px-5 py-6">
      <PageHeader title="GitHub 연동" description="GitHub 활동을 분석해 기술 프로필을 강화하세요" />

      {!profile ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">GitHub 계정 연결</h2>
          <form onSubmit={handleSubmit((d) => connect(d))} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub 사용자명</label>
              <input
                {...register('username', { required: '사용자명을 입력하세요' })}
                disabled={isSubmitting}
                placeholder="octocat"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white
                         hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Spinner size="sm" className="text-white" />}
              연결하기
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-gray-200 bg-white p-5 mb-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {profile.avatarUrl && (
                  <img src={profile.avatarUrl} alt={profile.username} className="h-10 w-10 rounded-full" />
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900">{profile.username}</p>
                  {profile.bio && <p className="text-xs text-gray-500 line-clamp-1">{profile.bio}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => sync()}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5
                             text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  {isSyncing && <Spinner size="sm" className="text-gray-500" />}
                  {isSyncing ? '동기화 중...' : '동기화'}
                </button>
                <button onClick={() => disconnect()} className="text-xs text-red-500 hover:underline">
                  연결 해제
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
              {[
                { label: '공개 레포', value: profile.publicRepos },
                { label: '팔로워', value: profile.followers },
                { label: '팔로잉', value: profile.following },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-sm font-semibold text-gray-700 mb-3">레포지토리</h2>
          <CursorList<GitHubRepo>
            queryKey={['github', 'repos']}
            fetcher={(cursor) => listRepos(cursor)}
            emptyTitle="레포지토리가 없습니다"
            renderItem={(repo) => (
              <div
                key={repo.repoId}
                className="flex items-center justify-between rounded-lg border border-gray-200
                           bg-white px-4 py-3 hover:border-gray-300 transition-all duration-[150ms]"
              >
                <div className="min-w-0">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-indigo-600 hover:underline"
                  >
                    {repo.name}
                  </a>
                  {repo.description && (
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{repo.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {repo.language && <Badge>{repo.language}</Badge>}
                  <span className="text-xs text-gray-400">⭐ {repo.stars}</span>
                </div>
              </div>
            )}
          />
        </>
      )}
    </div>
  )
}
