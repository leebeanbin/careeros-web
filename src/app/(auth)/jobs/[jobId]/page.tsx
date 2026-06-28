'use client'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getJob, getSimilarJobs, saveJob, unsaveJob, recordApplyClick } from '@/lib/api/jobs'
import { useToastStore } from '@/stores/toastStore'

const REMOTE_LABELS: Record<string, string> = {
  REMOTE: '원격', HYBRID: '하이브리드', ON_SITE: '오프사이트',
}

const badgeStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center',
  backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)',
  borderRadius: '10px', fontSize: '11px', fontWeight: 500,
  padding: '0 8px', lineHeight: '20px',
}

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const id = Number(jobId)
  const router = useRouter()
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
      <div style={{ padding: '48px 24px' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            height: '44px', marginBottom: '4px',
            backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '4px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
        ))}
      </div>
    )
  }

  if (!job) return null

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '48px', padding: '0 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgb(8,9,10)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <button
            onClick={() => router.push('/jobs')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}
          >
            채용공고
          </button>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>/</span>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {job.title}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button
            onClick={() => toggleSave()}
            disabled={savePending}
            style={{
              height: '28px', padding: '0 12px',
              borderRadius: '4px', fontSize: '12px', cursor: 'pointer',
              backgroundColor: job.isSaved ? 'rgba(99,102,241,0.12)' : 'transparent',
              border: job.isSaved ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.1)',
              color: job.isSaved ? 'rgb(99,102,241)' : 'rgba(255,255,255,0.5)',
              opacity: savePending ? 0.5 : 1,
            }}
          >
            {job.isSaved ? '저장됨' : '저장'}
          </button>
          <button
            onClick={handleApply}
            style={{
              height: '28px', padding: '0 14px',
              backgroundColor: 'rgb(229,229,230)', color: 'rgb(8,9,10)',
              fontWeight: 510, fontSize: '12px',
              border: 'none', borderRadius: '4px', cursor: 'pointer',
            }}
          >
            지원하기
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        {/* Job header */}
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.01em' }}>
            {job.title}
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>{job.company}</p>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
          <span style={badgeStyle}>{REMOTE_LABELS[job.remoteType] ?? job.remoteType}</span>
          {job.roleCategory && <span style={badgeStyle}>{job.roleCategory}</span>}
          {job.experienceLevel && <span style={badgeStyle}>{job.experienceLevel}</span>}
          {job.preferredCountries.map((c) => <span key={c} style={badgeStyle}>{c}</span>)}
        </div>

        {/* Description */}
        <div style={{
          padding: '20px', borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: 'rgb(13,14,15)',
          marginBottom: '32px',
        }}>
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {job.description}
          </p>
          <p style={{ margin: '16px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
            게시일: {new Date(job.postedAt).toLocaleDateString('ko-KR')}
          </p>
        </div>

        {/* Similar jobs */}
        {similar && similar.length > 0 && (
          <div>
            <div style={{
              fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px',
            }}>
              유사 공고
            </div>
            <div style={{ borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', backgroundColor: 'rgb(13,14,15)' }}>
              {similar.map((j, i) => (
                <div
                  key={j.jobId}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    height: '44px', padding: '0 16px',
                    borderBottom: i < similar.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => router.push(`/jobs/${j.jobId}`)}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span style={{ flex: 1, fontSize: '13px', color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {j.title}
                  </span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>{j.company}</span>
                  <span style={badgeStyle}>{REMOTE_LABELS[j.remoteType] ?? j.remoteType}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
