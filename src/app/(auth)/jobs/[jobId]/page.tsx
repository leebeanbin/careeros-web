'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getJob, getSimilarJobs, saveJob, unsaveJob, recordApplyClick } from '@/lib/api/jobs'
import { CompanyAvatar } from '@/components/app/CompanyAvatar'
import { useToastStore } from '@/stores/toastStore'
import { AgentIntro, AgentPanel, AgentStepList } from '@/components/app/AgentPrimitives'

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
  const id = jobId
  const router = useRouter()
  const qc = useQueryClient()
  const { add } = useToastStore()
  const [menuOpen, setMenuOpen] = useState(false)

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

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setMenuOpen(false)
    add('success', '공고 링크를 복사했습니다.')
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, padding: '32px 40px' }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              height: '44px', marginBottom: '4px',
              backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '4px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ))}
        </div>
        <div style={{ width: '280px', borderLeft: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgb(11,12,13)' }} />
      </div>
    )
  }

  if (!job) return null

  const metaItems = [
    { label: '근무형태', content: REMOTE_LABELS[job.remoteType] ?? job.remoteType },
    { label: '직무', content: job.roleCategory ?? '—' },
    { label: '경력', content: job.experienceLevel ?? '—' },
    { label: '위치', content: job.preferredCountries.join(', ') || '—' },
    { label: '게시일', content: new Date(job.postedAt).toLocaleDateString('ko-KR') },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '48px', padding: '0 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgb(8,9,10)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <button
            onClick={() => router.push('/jobs')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '13px', color: 'rgb(138,143,152)' }}
          >
            ← 채용공고
          </button>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
          <span style={{ fontSize: '13px', color: 'rgb(138,143,152)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {job.title}
          </span>
        </div>
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            style={{ background: 'none', border: 'none', color: 'rgb(138,143,152)', cursor: 'pointer', fontSize: '16px', padding: '4px 8px', letterSpacing: '1px' }}
          >
            ···
          </button>
          {menuOpen && (
            <div
              role="menu"
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 6px)',
                width: '168px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: 'rgb(17,18,19)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                zIndex: 40,
                overflow: 'hidden',
              }}
            >
              {[
                { label: job.isSaved ? '저장 취소' : '저장하기', onClick: () => { toggleSave(); setMenuOpen(false) } },
                { label: '링크 복사', onClick: copyLink },
                { label: '목록으로 이동', onClick: () => router.push('/jobs') },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  onClick={item.onClick}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '9px 12px',
                    border: 'none',
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.72)',
                    textAlign: 'left',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2-column body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px' }}>
          <AgentIntro
            title="공고 요구사항을 지원 판단으로 바꿉니다"
            description="역할, 근무 형태, 위치, 유사 공고 신호를 읽고 이 공고를 어떤 후보로 둘지 정리합니다."
            steps={['요구사항 읽기', '내 선호와 비교', '유사 후보 확인']}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <CompanyAvatar company={job.company} size={32} />
            <div>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 500, color: 'rgb(247,248,248)', lineHeight: 1.3 }}>
                {job.title}
              </h1>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'rgb(138,143,152)' }}>{job.company}</p>
            </div>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
            <span style={badgeStyle}>{REMOTE_LABELS[job.remoteType] ?? job.remoteType}</span>
            {job.roleCategory && <span style={badgeStyle}>{job.roleCategory}</span>}
            {job.experienceLevel && <span style={badgeStyle}>{job.experienceLevel}</span>}
            {job.preferredCountries.map((c) => <span key={c} style={badgeStyle}>{c}</span>)}
          </div>

          {/* Description */}
          <AgentPanel style={{ padding: '20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Agent read</div>
            <AgentStepList
              steps={[
                { label: '역할 신호', detail: `${job.roleCategory || '직무'} 요구사항을 이력서 상단 요약과 맞춰봅니다.` },
                { label: '환경 신호', detail: `${REMOTE_LABELS[job.remoteType] ?? job.remoteType} 조건과 선호 국가/근무 형태를 비교합니다.`, tone: 'green' },
                { label: '지원 전 점검', detail: '설명에 반복되는 기술 키워드를 프로젝트 근거와 연결하세요.', tone: 'amber' },
              ]}
            />
          </AgentPanel>
          <div style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgb(138,143,152)', marginBottom: '40px', whiteSpace: 'pre-wrap' }}>
            {job.description}
          </div>

          {/* Similar jobs */}
          {similar && similar.length > 0 && (
            <div>
              <div style={{
                fontSize: '12px', fontWeight: 500, color: 'rgb(138,143,152)',
                textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px',
              }}>
                유사 공고
              </div>
              <AgentPanel style={{ overflow: 'hidden' }}>
                {similar.map((j, i) => (
                  <div
                    key={j.jobId}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      height: '36px', padding: '0 16px',
                      borderBottom: i < similar.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() => router.push(`/jobs/${j.jobId}`)}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <CompanyAvatar company={j.company} size={16} />
                    <span style={{ flex: 1, fontSize: '13px', color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {j.title}
                    </span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>{j.company}</span>
                  </div>
                ))}
              </AgentPanel>
            </div>
          )}
        </div>

        {/* Right: 280px meta panel */}
        <div style={{
          width: '280px', flexShrink: 0,
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: 'rgb(11,12,13)',
          padding: '24px 20px', overflow: 'auto',
        }}>
          {metaItems.map(({ label, content }) => (
            <div key={label} style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: 'rgb(138,143,152)', marginBottom: '6px', fontWeight: 500 }}>{label}</div>
              <div style={{ fontSize: '12px', color: 'rgb(208,214,224)' }}>{content}</div>
            </div>
          ))}

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => toggleSave()}
              disabled={savePending}
              style={{
                height: '32px', width: '100%',
                borderRadius: '6px', fontSize: '13px', cursor: savePending ? 'not-allowed' : 'pointer',
                backgroundColor: job.isSaved ? 'rgba(99,102,241,0.12)' : 'transparent',
                border: job.isSaved ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.15)',
                color: job.isSaved ? 'rgb(99,102,241)' : 'rgba(255,255,255,0.6)',
                opacity: savePending ? 0.5 : 1,
              }}
            >
              {job.isSaved ? '저장됨' : '저장하기'}
            </button>
            <button
              onClick={handleApply}
              disabled={!job.applyUrl}
              style={{
                height: '32px', width: '100%',
                backgroundColor: job.applyUrl ? 'rgb(229,229,230)' : 'rgba(229,229,230,0.28)',
                color: 'rgb(8,9,10)',
                fontWeight: 510, fontSize: '13px',
                border: 'none', borderRadius: '6px', cursor: job.applyUrl ? 'pointer' : 'not-allowed',
              }}
            >
              지원하기 →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
