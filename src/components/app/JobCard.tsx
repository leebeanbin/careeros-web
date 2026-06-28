import Link from 'next/link'
import type { JobDto } from '@/lib/api/types'
import { Badge, MatchScoreBadge } from '@/components/ui/Badge'

interface JobCardProps {
  job: JobDto
  score?: number
  action?: React.ReactNode
}

const remoteLabels: Record<string, string> = {
  REMOTE: '원격',
  HYBRID: '하이브리드',
  ON_SITE: '오프사이트',
}

export default function JobCard({ job, score, action }: JobCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-[150ms] hover:border-gray-300 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_2px_6px_rgba(0,0,0,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/jobs/${job.jobId}`}
            className="text-sm font-semibold text-gray-900 hover:text-indigo-600 line-clamp-1"
          >
            {job.title}
          </Link>
          <p className="mt-0.5 text-sm text-gray-500">{job.company}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {score != null && <MatchScoreBadge score={score} />}
          {action}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge>{remoteLabels[job.remoteType] ?? job.remoteType}</Badge>
        {job.roleCategory && <Badge>{job.roleCategory}</Badge>}
        {job.preferredCountries.slice(0, 2).map((c) => (
          <Badge key={c}>{c}</Badge>
        ))}
      </div>
    </div>
  )
}
