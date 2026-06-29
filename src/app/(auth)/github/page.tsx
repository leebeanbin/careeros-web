'use client'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import {
  connectGitHub, getGitHubProfile, disconnectGitHub, syncGitHub, getSyncStatus, listRepos, toggleRepoIncluded,
} from '@/lib/api/github'
import type { GitHubRepo } from '@/lib/api/types'
import CursorList from '@/components/ui/CursorList'
import Spinner from '@/components/ui/Spinner'
import { useToastStore } from '@/stores/toastStore'
import { ApiError } from '@/lib/api/client'
import { AgentIntro, AgentPanel, AgentStepList } from '@/components/app/AgentPrimitives'

interface ConnectForm { username: string }

const S = {
  surface: { backgroundColor: 'rgb(13,14,15)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' } as React.CSSProperties,
  border: 'rgba(255,255,255,0.06)',
  rowBorder: 'rgba(255,255,255,0.04)',
  textPrimary: 'rgba(255,255,255,0.85)',
  textMuted: 'rgba(255,255,255,0.5)',
  textHint: 'rgba(255,255,255,0.3)',
  input: {
    width: '100%', height: '42px',
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px', padding: '0 14px',
    fontSize: '14px', color: 'rgb(247,248,248)',
    outline: 'none', boxSizing: 'border-box',
  } as React.CSSProperties,
}

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
      const d = q.state.data
      if (!d || d.status === 'PENDING' || d.status === 'IN_PROGRESS') return 2000
      return false
    },
  })

  useEffect(() => {
    if (syncStatus?.status === 'COMPLETED') {
      add('success', 'GitHub 동기화가 완료되었습니다.')
      queueMicrotask(() => setSyncId(null))
      qc.invalidateQueries({ queryKey: ['github'] })
    } else if (syncStatus?.status === 'FAILED') {
      add('error', 'GitHub 동기화에 실패했습니다.')
      queueMicrotask(() => setSyncId(null))
    }
  }, [syncStatus?.status, add, qc])

  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<ConnectForm>()
  const { mutate: connect } = useMutation({
    mutationFn: (d: ConnectForm) => connectGitHub({ mode: 'username', username: d.username }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['github'] }); add('success', 'GitHub이 연결되었습니다.') },
    onError: (err) => add('error', err instanceof ApiError ? err.message : '연결에 실패했습니다.'),
  })
  const { mutate: disconnect } = useMutation({
    mutationFn: disconnectGitHub,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['github'] }); add('success', '연결이 해제되었습니다.') },
  })
  const { mutate: sync, isPending: syncing } = useMutation({
    mutationFn: syncGitHub,
    onSuccess: (d) => setSyncId(d.syncId),
    onError: () => add('error', '동기화 시작에 실패했습니다.'),
  })

  const isSyncing = syncing || syncStatus?.status === 'PENDING' || syncStatus?.status === 'IN_PROGRESS'

  const { mutate: toggleInclude } = useMutation({
    mutationFn: ({ repoId, included }: { repoId: string | number; included: boolean }) =>
      toggleRepoIncluded(repoId, included),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['github', 'repos'] })
    },
    onError: () => add('error', '레포 설정 변경에 실패했습니다.'),
  })

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ padding: '24px' }}>
        <AgentIntro
          title="GitHub 작업 흔적을 커리어 신호로 바꿉니다"
          description="레포, 언어, 스타, 설명을 읽어 이력서에 담을 수 있는 근거로 정리합니다."
          steps={['프로필 연결', '레포 신호 수집', '기술 근거 정리']}
        />
        {profileLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <Spinner size="lg" className="text-indigo-400" />
          </div>
        ) : !profile ? (
          /* Connect form */
          <AgentPanel style={{ padding: '24px', maxWidth: '420px' }}>
            <p style={{ fontSize: '13px', fontWeight: 500, color: S.textPrimary, marginBottom: '4px' }}>GitHub 계정 연결</p>
            <p style={{ fontSize: '12px', color: S.textHint, marginBottom: '20px' }}>GitHub 활동을 분석해 기술 프로필을 강화하세요</p>
            <form onSubmit={handleSubmit((d) => connect(d))} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: S.textMuted, fontWeight: 500, marginBottom: '6px' }}>
                  GitHub 사용자명
                </label>
                <input
                  {...register('username', { required: '사용자명을 입력하세요' })}
                  disabled={isSubmitting}
                  placeholder="octocat"
                  style={{ ...S.input, borderColor: errors.username ? 'rgba(255,99,99,0.5)' : 'rgba(255,255,255,0.1)' }}
                />
                {errors.username && (
                  <p style={{ fontSize: '12px', color: 'rgba(255,99,99,0.8)', margin: '4px 0 0' }}>{errors.username.message}</p>
                )}
              </div>
              <button type="submit" disabled={isSubmitting} style={{
                height: '42px', backgroundColor: isSubmitting ? 'rgba(229,229,230,0.5)' : 'rgb(229,229,230)',
                color: 'rgb(8,9,10)', fontSize: '14px', fontWeight: 510,
                border: 'none', borderRadius: '10px', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
                {isSubmitting && <Spinner size="sm" className="text-gray-600" />}
                연결하기
              </button>
            </form>
          </AgentPanel>
        ) : (
          <>
            {/* Profile card */}
            <AgentPanel style={{ padding: '20px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={profile.username}
                         style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  ) : (
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      backgroundColor: 'rgb(99,102,241)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '16px', fontWeight: 700, color: 'white',
                    }}>{profile.username[0].toUpperCase()}</div>
                  )}
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: S.textPrimary, margin: 0 }}>{profile.username}</p>
                    {profile.bio && (
                      <p style={{ fontSize: '12px', color: S.textHint, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                        {profile.bio}
                      </p>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={() => sync()} disabled={isSyncing} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    height: '28px', padding: '0 10px',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px',
                    backgroundColor: 'transparent', color: S.textMuted,
                    fontSize: '12px', cursor: isSyncing ? 'not-allowed' : 'pointer', opacity: isSyncing ? 0.6 : 1,
                  }}>
                    {isSyncing && <Spinner size="sm" className="text-gray-400" />}
                    {isSyncing ? '동기화 중...' : '동기화'}
                  </button>
                  <button onClick={() => disconnect()} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '12px', color: 'rgba(255,99,99,0.7)', padding: 0,
                  }}>연결 해제</button>
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                {[
                  { label: '공개 레포', value: profile.publicRepos },
                  { label: '팔로워', value: profile.followers },
                  { label: '팔로잉', value: profile.following },
                ].map((s) => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '20px', fontWeight: 600, color: S.textPrimary, margin: 0 }}>{s.value}</p>
                    <p style={{ fontSize: '11px', color: S.textHint, margin: '2px 0 0' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </AgentPanel>

            <AgentPanel delay={80} style={{ padding: '16px', marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', color: S.textHint, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Repository read</div>
              <AgentStepList
                steps={[
                  { label: '기술 스택 확인', detail: '주요 언어와 반복적으로 쓰인 기술을 이력서 키워드 후보로 봅니다.' },
                  { label: '프로젝트 근거 추출', detail: '설명이 있는 레포를 우선 검토해 문제 해결 맥락을 찾습니다.', tone: 'green' },
                  { label: '동기화 후 재분석', detail: '최신 커밋 신호가 반영되면 후보자 그래프와 매칭 점수가 갱신됩니다.', tone: 'amber' },
                ]}
              />
            </AgentPanel>

            {/* Repo list */}
            <p style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              레포지토리
            </p>
            <AgentPanel style={{ overflow: 'hidden' }}>
              <CursorList<GitHubRepo>
                queryKey={['github', 'repos']}
                fetcher={(cursor) => listRepos(cursor)}
                emptyTitle="레포지토리가 없습니다"
                className=""
                renderItem={(repo) => (
                  <div key={repo.repoId} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    height: '44px', padding: '0 16px',
                    borderBottom: `1px solid ${S.rowBorder}`,
                    transition: 'background-color 0.1s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                    <a href={repo.url} target="_blank" rel="noopener noreferrer" style={{
                      flex: 1, fontSize: '13px', color: 'rgb(99,102,241)',
                      textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{repo.name}</a>
                    {repo.description && (
                      <span style={{ fontSize: '12px', color: S.textHint, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                        {repo.description}
                      </span>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      {repo.language && (
                        <span style={{
                          backgroundColor: 'rgba(255,255,255,0.08)', color: S.textMuted,
                          borderRadius: '10px', fontSize: '11px', padding: '0 8px', lineHeight: '20px',
                        }}>{repo.language}</span>
                      )}
                      {(repo.skills ?? []).length > 0 && (
                        <span style={{ fontSize: '11px', color: S.textHint }}>
                          {repo.skills!.slice(0, 2).join(', ')}
                        </span>
                      )}
                      <span style={{ fontSize: '12px', color: S.textHint }}>⭐ {repo.stars}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); toggleInclude({ repoId: repo.repoId, included: !repo.included }) }}
                        title={repo.included ? '분석에서 제외' : '분석에 포함'}
                        style={{
                          width: '34px', height: '18px', borderRadius: '9px',
                          border: 'none', cursor: 'pointer', position: 'relative',
                          backgroundColor: repo.included ? 'rgb(99,102,241)' : 'rgba(255,255,255,0.12)',
                          transition: 'background-color 0.15s',
                        }}
                      >
                        <span style={{
                          position: 'absolute', top: '2px',
                          left: repo.included ? '18px' : '2px',
                          width: '14px', height: '14px', borderRadius: '50%',
                          backgroundColor: 'white',
                          transition: 'left 0.15s',
                        }} />
                      </button>
                    </div>
                  </div>
                )}
              />
            </AgentPanel>
          </>
        )}
      </div>
    </div>
  )
}
