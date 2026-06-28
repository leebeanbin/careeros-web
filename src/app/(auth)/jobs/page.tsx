'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { listJobs, listSavedJobs, saveJob, unsaveJob } from '@/lib/api/jobs'
import { listRoles } from '@/lib/api/taxonomy'
import type { JobDto } from '@/lib/api/types'
import CursorList from '@/components/ui/CursorList'
import { RemoteTypeIcon } from '@/components/app/RemoteTypeIcon'
import { CompanyAvatar } from '@/components/app/CompanyAvatar'
import { LabelPill } from '@/components/app/LabelPill'
import { FilterPill } from '@/components/app/FilterPill'
import { useToastStore } from '@/stores/toastStore'

const ROLE_COLORS: Record<string, string> = {
  BACKEND:  'rgb(59,130,246)',
  FRONTEND: 'rgb(139,92,246)',
  FULLSTACK:'rgb(99,102,241)',
  DATA:     'rgb(34,197,94)',
  AI:       'rgb(234,179,8)',
  DEVOPS:   'rgb(20,184,166)',
  MOBILE:   'rgb(236,72,153)',
}

export default function JobsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const qc = useQueryClient()
  const { add } = useToastStore()

  const tab = searchParams.get('tab') ?? 'all'
  const keyword = searchParams.get('keyword') ?? ''
  const roleCategory = searchParams.get('roleCategory') ?? ''
  const remoteType = searchParams.get('remoteType') ?? ''

  const { data: roles } = useQuery({ queryKey: ['taxonomy', 'roles'], queryFn: listRoles })

  const setParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString())
    value ? p.set(key, value) : p.delete(key)
    p.delete('cursor')
    router.push(`/jobs?${p.toString()}`)
  }

  const setTab = (t: string) => {
    const p = new URLSearchParams()
    if (t !== 'all') p.set('tab', t)
    router.push(`/jobs?${p.toString()}`)
  }

  const { mutate: toggleSave } = useMutation({
    mutationFn: ({ jobId, saved }: { jobId: number; saved: boolean }) =>
      saved ? unsaveJob(jobId) : saveJob(jobId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['jobs'] }); add('success', '저장 상태가 변경되었습니다.') },
    onError: () => add('error', '저장에 실패했습니다.'),
  })

  const renderJob = (job: JobDto) => (
    <div
      key={job.jobId}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        height: '36px', padding: '0 16px',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        cursor: 'pointer',
      }}
      onClick={() => router.push(`/jobs/${job.jobId}`)}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <RemoteTypeIcon remoteType={job.remoteType} size={14} />
      <CompanyAvatar company={job.company} size={18} />
      <span style={{ flex: 1, fontSize: '13px', color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {job.title}
      </span>
      {job.roleCategory && (
        <LabelPill label={job.roleCategory} color={ROLE_COLORS[job.roleCategory] ?? 'rgb(138,143,152)'} />
      )}
      <button
        onClick={(e) => { e.stopPropagation(); toggleSave({ jobId: job.jobId, saved: job.isSaved }) }}
        style={{
          backgroundColor: job.isSaved ? 'rgba(99,102,241,0.12)' : 'transparent',
          border: job.isSaved ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.1)',
          color: job.isSaved ? 'rgb(99,102,241)' : 'rgba(255,255,255,0.4)',
          borderRadius: '4px', height: '22px', padding: '0 8px', fontSize: '11px',
          cursor: 'pointer', flexShrink: 0,
        }}
      >
        {job.isSaved ? '저장됨' : '저장'}
      </button>
    </div>
  )

  const filterInput: React.CSSProperties = {
    height: '30px', padding: '0 10px',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px',
    backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgb(247,248,248)',
    fontSize: '12px', outline: 'none',
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', gap: '12px',
        height: '48px', padding: '0 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgb(8,9,10)',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)', flexShrink: 0 }}>채용공고</span>
        <input
          value={keyword}
          onChange={(e) => setParam('keyword', e.target.value)}
          placeholder="키워드 검색..."
          style={{ ...filterInput, flex: 1, maxWidth: '240px' }}
        />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          <FilterPill label="필터" />
          <FilterPill label="그룹" />
          <FilterPill label="보기" />
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 24px',
      }}>
        {[{ value: 'all', label: '전체' }, { value: 'saved', label: '저장됨' }].map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            style={{
              height: '36px', padding: '0 4px', marginRight: '16px',
              background: 'none', border: 'none',
              borderBottom: tab === t.value ? '2px solid rgb(99,102,241)' : '2px solid transparent',
              color: tab === t.value ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
              fontSize: '13px', cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filter bar — all tab only */}
      {tab === 'all' && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          <select
            value={roleCategory}
            onChange={(e) => setParam('roleCategory', e.target.value)}
            style={{ ...filterInput, appearance: 'none' as const }}
          >
            <option value="">직무 전체</option>
            {roles?.map((r) => <option key={r.code} value={r.code}>{r.label}</option>)}
          </select>
          <select
            value={remoteType}
            onChange={(e) => setParam('remoteType', e.target.value)}
            style={{ ...filterInput, appearance: 'none' as const }}
          >
            <option value="">근무형태 전체</option>
            <option value="REMOTE">원격</option>
            <option value="HYBRID">하이브리드</option>
            <option value="ON_SITE">오프사이트</option>
          </select>
          {(keyword || roleCategory || remoteType) && (
            <button
              onClick={() => router.push('/jobs')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '12px', color: 'rgba(255,255,255,0.3)',
              }}
            >
              초기화
            </button>
          )}
        </div>
      )}

      {/* List */}
      <div>
        {tab === 'saved' ? (
          <CursorList<JobDto>
            queryKey={['jobs', 'saved']}
            fetcher={(cursor) => listSavedJobs(cursor)}
            renderItem={renderJob}
            emptyTitle="저장된 공고가 없습니다"
            className=""
          />
        ) : (
          <CursorList<JobDto>
            queryKey={['jobs', { keyword, roleCategory, remoteType }]}
            fetcher={(cursor) => listJobs({
              keyword: keyword || undefined,
              roleCategory: roleCategory || undefined,
              remoteType: remoteType || undefined,
              cursor, size: 30,
            })}
            renderItem={renderJob}
            emptyTitle="공고가 없습니다"
            emptyDescription="필터를 변경해보세요"
            className=""
          />
        )}
      </div>
    </div>
  )
}
