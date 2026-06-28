'use client'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import {
  connectGitHub, getGitHubProfile, disconnectGitHub, syncGitHub, getSyncStatus, listRepos,
} from '@/lib/api/github'
import type { GitHubRepo } from '@/lib/api/types'
import CursorList from '@/components/ui/CursorList'
import Spinner from '@/components/ui/Spinner'
import { useToastStore } from '@/stores/toastStore'
import { ApiError } from '@/lib/api/client'

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
      setSyncId(null)
      qc.invalidateQueries({ queryKey: ['github'] })
    } else if (syncStatus?.status === 'FAILED') {
      add('error', 'GitHub 동기화에 실패했습니다.')
      setSyncId(null)
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

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center',
        height: '48px', padding: '0 24px',
        borderBottom: `1px solid ${S.border}`,
        backgroundColor: 'rgb(8,9,10)',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: S.textMuted }}>GitHub 연동</span>
      </div>

      <div style={{ padding: '24px' }}>
        {profileLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <Spinner size="lg" className="text-indigo-400" />
          </div>
        ) : !profile ? (
          /* Connect form */
          <div style={{ ...S.surface, padding: '24px', maxWidth: '420px' }}>
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
          </div>
        ) : (
          <>
            {/* Profile card */}
            <div style={{ ...S.surface, padding: '20px', marginBottom: '24px' }}>
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
            </div>

            {/* Repo list */}
            <p style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              레포지토리
            </p>
            <div style={{ ...S.surface, overflow: 'hidden' }}>
              <CursorList<GitHubRepo>
                queryKey={['github', 'repos']}
                fetcher={(cursor) => listRepos(cursor)}
                emptyTitle="레포지토리가 없습니다"
                className=""
                renderItem={(repo, i) => (
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
                      <span style={{ fontSize: '12px', color: S.textHint }}>⭐ {repo.stars}</span>
                    </div>
                  </div>
                )}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
