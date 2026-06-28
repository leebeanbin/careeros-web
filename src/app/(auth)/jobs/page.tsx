'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { listJobs, listSavedJobs, saveJob, unsaveJob } from '@/lib/api/jobs'
import { listRoles } from '@/lib/api/taxonomy'
import type { JobDto } from '@/lib/api/types'
import PageHeader from '@/components/ui/PageHeader'
import CursorList from '@/components/ui/CursorList'
import JobCard from '@/components/app/JobCard'
import { useToastStore } from '@/stores/toastStore'

const REMOTE_OPTIONS = [
  { value: '', label: '근무형태 전체' },
  { value: 'REMOTE', label: '원격' },
  { value: 'HYBRID', label: '하이브리드' },
  { value: 'ON_SITE', label: '오프사이트' },
]

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
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('cursor')
    router.push(`/jobs?${params.toString()}`)
  }

  const { mutate: toggleSave } = useMutation({
    mutationFn: ({ jobId, saved }: { jobId: number; saved: boolean }) =>
      saved ? unsaveJob(jobId) : saveJob(jobId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs'] })
      add('success', '저장 상태가 변경되었습니다.')
    },
    onError: () => add('error', '저장에 실패했습니다.'),
  })

  const renderJob = (job: JobDto) => (
    <JobCard
      key={job.jobId}
      job={job}
      action={
        <button
          onClick={(e) => { e.preventDefault(); toggleSave({ jobId: job.jobId, saved: job.isSaved }) }}
          className={`text-sm px-2 py-1 rounded border transition-colors duration-[150ms]
            ${job.isSaved
              ? 'border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
              : 'border-gray-200 text-gray-400 hover:text-indigo-600'}`}
        >
          {job.isSaved ? '저장됨' : '저장'}
        </button>
      }
    />
  )

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-6">
      <PageHeader title="채용공고" description="AI 매칭 기반 채용 공고 목록" />

      <div className="flex border-b border-gray-200 mb-4">
        {[{ value: 'all', label: '전체' }, { value: 'saved', label: '저장됨' }].map((t) => (
          <button key={t.value} onClick={() => setParam('tab', t.value === 'all' ? '' : t.value)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px
                    ${tab === t.value
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'all' && (
        <div className="flex flex-wrap gap-3 rounded-lg border border-gray-200 bg-white p-4 mb-4">
          <input
            value={keyword}
            onChange={(e) => setParam('keyword', e.target.value)}
            placeholder="키워드 검색"
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm w-48
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select value={roleCategory} onChange={(e) => setParam('roleCategory', e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm">
            <option value="">직무 전체</option>
            {roles?.map((r) => <option key={r.code} value={r.code}>{r.label}</option>)}
          </select>
          <select value={remoteType} onChange={(e) => setParam('remoteType', e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm">
            {REMOTE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button onClick={() => router.push('/jobs')}
                  className="text-sm text-gray-500 hover:text-gray-700">
            초기화
          </button>
        </div>
      )}

      {tab === 'saved' ? (
        <CursorList<JobDto>
          queryKey={['jobs', 'saved']}
          fetcher={(cursor) => listSavedJobs(cursor)}
          renderItem={renderJob}
          emptyTitle="저장된 공고가 없습니다"
        />
      ) : (
        <CursorList<JobDto>
          queryKey={['jobs', { keyword, roleCategory, remoteType }]}
          fetcher={(cursor) => listJobs({
            keyword: keyword || undefined,
            roleCategory: roleCategory || undefined,
            remoteType: remoteType || undefined,
            cursor,
            size: 20,
          })}
          renderItem={renderJob}
          emptyTitle="공고가 없습니다"
          emptyDescription="필터를 변경해보세요"
        />
      )}
    </div>
  )
}
