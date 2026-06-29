'use client'
import { Suspense } from 'react'
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
import { GroupHeader } from '@/components/app/GroupHeader'
import { useToastStore } from '@/stores/toastStore'
import { AgentIntro, AgentStatusStrip } from '@/components/app/AgentPrimitives'

const ROLE_COLORS: Record<string, string> = {
  BACKEND:  'rgb(59,130,246)',
  FRONTEND: 'rgb(139,92,246)',
  FULLSTACK:'rgb(99,102,241)',
  DATA:     'rgb(34,197,94)',
  AI:       'rgb(234,179,8)',
  DEVOPS:   'rgb(20,184,166)',
  MOBILE:   'rgb(236,72,153)',
}

const JOB_GROUPS = [
  { value: 'none', label: '그룹 없음' },
  { value: 'role', label: '직무별 그룹' },
  { value: 'remote', label: '근무형태별 그룹' },
] as const

const JOB_VIEWS = [
  { value: 'comfortable', label: '넓게 보기' },
  { value: 'compact', label: '촘촘히 보기' },
] as const

const REMOTE_LABELS: Record<string, string> = {
  REMOTE: '원격',
  HYBRID: '하이브리드',
  ON_SITE: '오프사이트',
}

function JobsPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const qc = useQueryClient()
  const { add } = useToastStore()

  const tab = searchParams.get('tab') ?? 'all'
  const keyword = searchParams.get('keyword') ?? ''
  const roleCategory = searchParams.get('roleCategory') ?? ''
  const remoteType = searchParams.get('remoteType') ?? ''
  const showFilters = searchParams.get('filters') === 'open'
  const group = searchParams.get('group') ?? 'none'
  const view = searchParams.get('view') ?? 'comfortable'
  const isCompact = view === 'compact'

  const { data: roles } = useQuery({ queryKey: ['taxonomy', 'roles'], queryFn: listRoles })

  const setParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString())
    if (value) p.set(key, value)
    else p.delete(key)
    p.delete('cursor')
    router.push(`/jobs?${p.toString()}`)
  }

  const setTab = (t: string) => {
    const p = new URLSearchParams()
    if (t !== 'all') p.set('tab', t)
    router.push(`/jobs?${p.toString()}`)
  }

  const setUiParam = (key: string, value: string, defaultValue: string) => {
    const p = new URLSearchParams(searchParams.toString())
    if (value === defaultValue) p.delete(key)
    else p.set(key, value)
    router.push(`/jobs?${p.toString()}`)
  }

  const cycleParam = <T extends readonly { value: string }[]>(key: string, values: T, current: string) => {
    const index = values.findIndex((item) => item.value === current)
    const next = values[(index + 1) % values.length].value
    setUiParam(key, next, values[0].value)
  }

  const toggleFilters = () => {
    const p = new URLSearchParams(searchParams.toString())
    if (showFilters) p.delete('filters')
    else p.set('filters', 'open')
    router.push(`/jobs?${p.toString()}`)
  }

  const { mutate: toggleSave } = useMutation({
    mutationFn: ({ jobId, saved }: { jobId: string | number; saved: boolean }) =>
      saved ? unsaveJob(jobId) : saveJob(jobId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['jobs'] }); add('success', '저장 상태가 변경되었습니다.') },
    onError: () => add('error', '저장에 실패했습니다.'),
  })

  const groupedQueryParams = {
    keyword: keyword || undefined,
    roleCategory: roleCategory || undefined,
    remoteType: remoteType || undefined,
    size: 100,
  }

  const { data: groupedJobs } = useQuery({
    queryKey: ['jobs', 'grouped', tab, group, groupedQueryParams],
    queryFn: () => tab === 'saved' ? listSavedJobs({ size: 100 }) : listJobs(groupedQueryParams),
    enabled: group !== 'none',
  })

  const groupedItems = groupedJobs?.content ?? []
  const groupedSections =
    group === 'role'
      ? [...new Set(groupedItems.map((job) => job.roleCategory || '직무 미상'))].map((label) => ({
          label,
          items: groupedItems.filter((job) => (job.roleCategory || '직무 미상') === label),
        }))
      : [...new Set(groupedItems.map((job) => REMOTE_LABELS[job.remoteType] ?? job.remoteType ?? '근무형태 미상'))].map((label) => ({
          label,
          items: groupedItems.filter((job) => (REMOTE_LABELS[job.remoteType] ?? job.remoteType ?? '근무형태 미상') === label),
        }))

  const renderJob = (job: JobDto) => (
    <div
      key={job.jobId}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        minHeight: isCompact ? '32px' : '40px',
        padding: isCompact ? '0 16px' : '5px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        cursor: 'pointer',
      }}
      onClick={() => router.push(`/jobs/${job.jobId}`)}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <RemoteTypeIcon remoteType={job.remoteType} size={14} />
      <CompanyAvatar company={job.company} size={18} />
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {job.title}
        </span>
        {!isCompact && (
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {job.company}
          </span>
        )}
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
      <div style={{ padding: '16px 24px 0' }}>
        <AgentIntro
          title="관심 역할 후보를 정리하는 중"
          description="키워드, 직무, 근무 형태 신호를 조합해 지금 볼 만한 공고 흐름을 좁힙니다."
          steps={['검색어 해석', '필터 적용', '저장 후보 분류']}
        />
        <AgentStatusStrip
          items={[
            { label: '검색어', value: keyword || '전체', tone: keyword ? 'indigo' : 'muted' },
            { label: '직무', value: roleCategory || '전체', tone: roleCategory ? 'green' : 'muted' },
            { label: '근무형태', value: remoteType ? REMOTE_LABELS[remoteType] ?? remoteType : '전체', tone: remoteType ? 'amber' : 'muted' },
          ]}
        />
      </div>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', gap: '12px',
        height: '48px', padding: '0 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgb(8,9,10)',
      }}>
        <input
          value={keyword}
          onChange={(e) => setParam('keyword', e.target.value)}
          placeholder="키워드 검색..."
          style={{ ...filterInput, flex: 1, maxWidth: '240px' }}
        />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          <FilterPill
            label={showFilters ? '필터 닫기' : '필터 열기'}
            onClick={toggleFilters}
            active={showFilters || Boolean(roleCategory || remoteType)}
            title="상세 필터를 열거나 닫습니다"
          />
          <FilterPill
            label={JOB_GROUPS.find((g) => g.value === group)?.label ?? '그룹 없음'}
            onClick={() => cycleParam('group', JOB_GROUPS, group)}
            active={group !== 'none'}
            title="공고 목록 그룹 방식을 변경합니다"
          />
          <FilterPill
            label={JOB_VIEWS.find((v) => v.value === view)?.label ?? '넓게 보기'}
            onClick={() => cycleParam('view', JOB_VIEWS, view)}
            active={view !== 'comfortable'}
            title="공고 목록 표시 밀도를 변경합니다"
          />
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
      {tab === 'all' && showFilters && (
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
        {group !== 'none' ? (
          <div>
            {!groupedJobs && (
              <div style={{ padding: '32px', textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
                로딩 중...
              </div>
            )}
            {groupedJobs && !groupedItems.length && (
              <div style={{ padding: '32px', textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
                공고가 없습니다
              </div>
            )}
            {groupedSections.map(({ label, items }) => (
              <div key={label}>
                <GroupHeader label={label} count={items.length} />
                {items.map(renderJob)}
              </div>
            ))}
          </div>
        ) : tab === 'saved' ? (
          <CursorList<JobDto>
            queryKey={['jobs', 'saved']}
            fetcher={(cursor) => listSavedJobs({ cursor, size: 30 })}
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

export default function JobsPage() {
  return (
    <Suspense fallback={null}>
      <JobsPageContent />
    </Suspense>
  )
}
