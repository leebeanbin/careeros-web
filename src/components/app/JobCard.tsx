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
    <div className="agent-reveal rounded-lg border border-[var(--da-border)] bg-[var(--da-surface)] p-4 transition-colors duration-150 hover:border-[rgba(255,255,255,0.11)] hover:bg-[var(--da-surface-2)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/jobs/${job.jobId}`}
            className="line-clamp-1 text-[13px] font-semibold text-[var(--da-text)] transition-colors hover:text-white"
          >
            {job.title}
          </Link>
          <p className="mt-0.5 truncate text-[13px] text-[var(--da-text-2)]">{job.company}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
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
