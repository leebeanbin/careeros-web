'use client'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { listAdminJobs, updateAdminJobStatus, createJob, type CreateJobRequest } from '@/lib/api/admin'
import type { AdminJobDto } from '@/lib/api/types'
import CursorList from '@/components/ui/CursorList'
import { useToastStore } from '@/stores/toastStore'
import { AgentIntro } from '@/components/app/AgentPrimitives'
import Modal from '@/components/ui/Modal'

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; color: string; label: string }> = {
    ACTIVE: { bg: 'rgba(34,197,94,0.12)',  color: 'rgb(34,197,94)',          label: '활성' },
    DRAFT:  { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)',  label: '초안' },
    CLOSED: { bg: 'rgba(234,179,8,0.12)',   color: 'rgb(234,179,8)',          label: '마감' },
  }
  const s = cfg[status] ?? cfg.DRAFT
  return (
    <span style={{
      backgroundColor: s.bg, color: s.color,
      borderRadius: '10px', fontSize: '11px', fontWeight: 500,
      padding: '0 7px', lineHeight: '18px', flexShrink: 0,
    }}>
      {s.label}
    </span>
  )
}

const ghostBtn: React.CSSProperties = {
  background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
  color: 'rgba(255,255,255,0.5)', borderRadius: '4px',
  height: '22px', padding: '0 8px', fontSize: '11px', cursor: 'pointer',
}
const dangerBtn: React.CSSProperties = {
  ...ghostBtn,
  border: '1px solid rgba(255,99,99,0.3)',
  color: 'rgba(255,99,99,0.7)',
}
const primaryBtn: React.CSSProperties = {
  backgroundColor: 'rgb(229,229,230)', color: 'rgb(8,9,10)', fontWeight: 510,
  borderRadius: '6px', height: '32px', padding: '0 14px', fontSize: '13px', border: 'none', cursor: 'pointer',
}

const modalInput: React.CSSProperties = {
  width: '100%',
  height: '36px',
  border: '1px solid var(--da-border)',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--da-control)',
  color: 'var(--da-text)',
  fontSize: '13px',
  outline: 'none',
  padding: '0 10px',
}

const modalTextarea: React.CSSProperties = {
  ...modalInput,
  height: '84px',
  padding: '9px 10px',
  resize: 'vertical',
}

const modalSecondaryBtn: React.CSSProperties = {
  height: '32px',
  padding: '0 13px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--da-border)',
  backgroundColor: 'transparent',
  color: 'var(--da-text-2)',
  fontSize: '13px',
  cursor: 'pointer',
}

export default function AdminJobsPage() {
  const qc = useQueryClient()
  const { add } = useToastStore()
  const [modalOpen, setModalOpen] = useState(false)

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<CreateJobRequest>()

  const { mutate: changeStatus } = useMutation({
    mutationFn: ({ jobId, status }: { jobId: string | number; status: string }) =>
      updateAdminJobStatus(jobId, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'jobs'] }); add('success', '상태 변경됨') },
    onError: () => add('error', '변경 실패'),
  })

  const { mutate: create } = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'jobs'] })
      add('success', '새 공고가 등록되었습니다.')
      setModalOpen(false)
      reset()
    },
    onError: () => add('error', '공고 등록에 실패했습니다.'),
  })

  return (
    <div>
      <div style={{ padding: '16px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <AgentIntro
            eyebrow="Admin agent"
            title="공고 운영 상태를 정리합니다"
            description="활성, 마감, 초안 상태를 빠르게 확인하고 운영 액션으로 이어갑니다."
            steps={['상태 확인', '조회/지원 신호 확인', '운영 액션']}
          />
          <button style={primaryBtn} onClick={() => setModalOpen(true)}>+ 새 공고 등록</button>
        </div>
        
        <CursorList<AdminJobDto>
          queryKey={['admin', 'jobs']}
          fetcher={(cursor) => listAdminJobs({ cursor })}
          emptyTitle="공고가 없습니다"
          className=""
          renderItem={(j) => (
            <div
              key={j.jobId}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                height: '44px', padding: '0 4px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {j.title}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{j.company}</div>
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', display: 'flex', gap: '8px', flexShrink: 0 }}>
                <span>조회 {j.viewCount}</span>
                <span>지원 {j.applyCount}</span>
              </div>
              <StatusBadge status={j.status} />
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                {j.status !== 'ACTIVE' && (
                  <button
                    onClick={() => changeStatus({ jobId: j.jobId, status: 'ACTIVE' })}
                    style={ghostBtn}
                  >
                    활성화
                  </button>
                )}
                {j.status === 'ACTIVE' && (
                  <button
                    onClick={() => changeStatus({ jobId: j.jobId, status: 'CLOSED' })}
                    style={dangerBtn}
                  >
                    마감
                  </button>
                )}
              </div>
            </div>
          )}
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="새 공고 등록">
        <form onSubmit={handleSubmit((d) => create(d))} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input {...register('title', { required: true })} placeholder="공고 제목" style={modalInput} />
          <input {...register('companyName', { required: true })} placeholder="회사명" style={modalInput} />
          <textarea {...register('description', { required: true })} placeholder="상세 설명" style={modalTextarea} />
          <input {...register('applyUrl', { required: true })} placeholder="지원 URL" style={modalInput} />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input {...register('country')} placeholder="국가 (예: KR)" style={modalInput} />
            <select {...register('roleCategory')} style={modalInput}>
              <option value="">직무 카테고리</option>
              <option value="BACKEND_ENGINEER">Backend</option>
              <option value="FRONTEND_ENGINEER">Frontend</option>
              <option value="FULL_STACK_ENGINEER">Full Stack</option>
              <option value="DATA_SCIENTIST">Data Scientist</option>
              <option value="AI_ENGINEER">AI Engineer</option>
              <option value="DEVOPS_ENGINEER">DevOps</option>
            </select>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <select {...register('remoteType')} style={modalInput}>
              <option value="">근무형태</option>
              <option value="ON_SITE">오프사이트</option>
              <option value="HYBRID">하이브리드</option>
              <option value="REMOTE">원격</option>
            </select>
            <select {...register('employmentType')} style={modalInput}>
              <option value="">고용형태</option>
              <option value="FULL_TIME">정규직</option>
              <option value="PART_TIME">파트타임</option>
              <option value="CONTRACT">계약직</option>
            </select>
            <select {...register('experienceLevel')} style={modalInput}>
              <option value="">경력</option>
              <option value="ENTRY">신입</option>
              <option value="MID">주니어/미들</option>
              <option value="SENIOR">시니어</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
            <button type="button" onClick={() => setModalOpen(false)} style={modalSecondaryBtn}>취소</button>
            <button type="submit" disabled={isSubmitting} style={{
              ...primaryBtn,
              opacity: isSubmitting ? 0.55 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}>
              {isSubmitting ? '등록 중...' : '등록'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
