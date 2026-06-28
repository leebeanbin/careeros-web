'use client'
import { useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getJob, getSimilarJobs, saveJob, unsaveJob, recordApplyClick } from '@/lib/api/jobs'
import { Badge } from '@/components/ui/Badge'
import JobCard from '@/components/app/JobCard'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { useToastStore } from '@/stores/toastStore'

const remoteLabel: Record<string, string> = {
  REMOTE: '원격', HYBRID: '하이브리드', ON_SITE: '오프사이트',
}

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const id = Number(jobId)
  const qc = useQueryClient()
  const { add } = useToastStore()

  const { data: job, isLoading } = useQuery({
    queryKey: ['jobs', id],
    queryFn: () => getJob(id),
  })

  const { data: similar } = useQuery({
    queryKey: ['jobs', id, 'similar'],
    queryFn: () => getSimilarJobs(id),
    enabled: !!job,
  })

  const { mutate: toggleSave, isPending: savePending } = useMutation({
    mutationFn: () => (job?.isSaved ? unsaveJob(id) : saveJob(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs', id] })
      add('success', job?.isSaved ? '저장 취소되었습니다.' : '저장되었습니다.')
    },
  })

  const handleApply = () => {
    recordApplyClick(id).catch(() => {})
    if (job?.applyUrl) window.open(job.applyUrl, '_blank', 'noopener')
  }

  if (isLoading) {
    return (
      <div className="max-w-[900px] mx-auto px-5 py-6 space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )
  }

  if (!job) return null

  return (
    <div className="max-w-[900px] mx-auto px-5 py-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6
                      shadow-[0_1px_2px_rgba(0,0,0,0.04)] mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{job.title}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{job.company}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => toggleSave()}
              disabled={savePending}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium
                          transition-colors duration-[150ms]
                ${job.isSaved
                  ? 'border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {job.isSaved ? '저장됨' : '저장'}
            </button>
            <button
              onClick={handleApply}
              className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white
                         hover:bg-indigo-700 transition-colors duration-[150ms]"
            >
              지원하기
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge>{remoteLabel[job.remoteType] ?? job.remoteType}</Badge>
          {job.roleCategory && <Badge>{job.roleCategory}</Badge>}
          {job.experienceLevel && <Badge>{job.experienceLevel}</Badge>}
          {job.preferredCountries.map((c) => <Badge key={c}>{c}</Badge>)}
        </div>

        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
          {job.description}
        </p>

        <p className="text-xs text-gray-400 mt-4">
          게시일: {new Date(job.postedAt).toLocaleDateString('ko-KR')}
        </p>
      </div>

      {similar && similar.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">유사 공고</h2>
          <div className="space-y-2">
            {similar.map((j) => <JobCard key={j.jobId} job={j} />)}
          </div>
        </div>
      )}
    </div>
  )
}
