'use client'
import { useMemo, useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listResumes, uploadResume, deleteResume, setActiveResume, getAnalysis, getLayoutReview, getDownloadUrl,
} from '@/lib/api/resume'
import type { ResumeAnalysis, ResumeDto, ResumeLayoutReview } from '@/lib/api/types'
import Spinner from '@/components/ui/Spinner'
import { useToastStore } from '@/stores/toastStore'
import { AgentIntro } from '@/components/app/AgentPrimitives'

const S = {
  surface: { backgroundColor: 'rgb(13,14,15)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' } as React.CSSProperties,
  textPrimary: 'rgba(255,255,255,0.85)',
  textMuted: 'rgba(255,255,255,0.5)',
  textHint: 'rgba(255,255,255,0.3)',
  rowBorder: 'rgba(255,255,255,0.04)',
}

function scoreTone(score: number) {
  if (score >= 85) return 'rgba(255,255,255,0.88)'
  if (score >= 70) return 'rgba(255,255,255,0.72)'
  return 'rgba(255,255,255,0.58)'
}

function firstItems(items: string[] | undefined, fallback: string[], count = 3) {
  const source = items?.filter(Boolean)
  return (source?.length ? source : fallback).slice(0, count)
}

function buildAgentDiagnosis(analysis: ResumeAnalysis) {
  const strengths = firstItems(analysis.strengths, ['핵심 기술과 경험의 연결이 확인됩니다.'])
  const suggestions = firstItems(analysis.suggestions, ['성과 수치, 문제 상황, 본인 기여를 더 구체화하면 좋습니다.'])
  const weaknesses = firstItems(analysis.weaknesses, ['역할 범위와 임팩트가 아직 충분히 드러나지 않습니다.'])

  return [
    {
      title: '에이전트 판단',
      body: analysis.summary,
      tone: 'rgba(255,255,255,0.9)',
    },
    {
      title: '강하게 밀어도 되는 근거',
      body: strengths.join(' · '),
      tone: 'rgba(255,255,255,0.78)',
    },
    {
      title: '면접관이 되물을 지점',
      body: weaknesses.join(' · '),
      tone: 'rgba(255,255,255,0.66)',
    },
    {
      title: '오늘 바로 고칠 항목',
      body: suggestions.join(' · '),
      tone: 'rgba(255,255,255,0.72)',
    },
  ]
}

function buildLayoutTargets(review: ResumeLayoutReview) {
  const feedback = review.feedback.filter(Boolean)
  const fallbackTargets = [
    {
      area: '상단 요약',
      issue: '직무 방향과 핵심 강점이 첫 화면에서 바로 읽히는지 확인하세요.',
      fix: '2줄 요약에 목표 역할, 대표 기술, 가장 큰 성과를 함께 적습니다.',
    },
    {
      area: '경험 섹션',
      issue: '업무 나열보다 문제, 행동, 결과의 순서가 더 중요합니다.',
      fix: '각 경험을 문제 상황 -> 내가 한 일 -> 수치/결과 순서로 다시 씁니다.',
    },
    {
      area: '프로젝트 섹션',
      issue: '기술명만 많으면 실제 기여도가 흐려질 수 있습니다.',
      fix: '아키텍처 결정, 성능 개선, 장애 대응처럼 판단이 드러나는 문장을 추가합니다.',
    },
  ]

  if (!feedback.length) return fallbackTargets

  return feedback.slice(0, 5).map((item, index) => ({
    area: ['상단 요약', '경험 섹션', '프로젝트 섹션', '기술 스택', '가독성'][index] ?? `점검 ${index + 1}`,
    issue: item,
    fix: index === 0
      ? '첫 1/3 영역에서 이 메시지가 보이도록 문장 위치를 올립니다.'
      : '해당 섹션의 문장을 한 줄 더 구체적인 행동과 결과로 바꿉니다.',
  }))
}

function AgentAnalysisView({ analysis }: { analysis: ResumeAnalysis }) {
  const diagnosis = buildAgentDiagnosis(analysis)
  const actionItems = [
    '가장 강한 프로젝트 1개를 STAR 구조로 다시 작성',
    '성과가 있는 문장에 숫자 또는 비교 기준 추가',
    '지원하려는 역할과 무관한 기술 나열은 뒤로 이동',
  ]

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '16px', marginBottom: '18px' }}>
        <div style={{ border: '1px solid rgba(255,255,255,0.075)', backgroundColor: 'rgba(255,255,255,0.025)', borderRadius: '8px', padding: '18px' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.38)', marginBottom: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Agent read
          </div>
          <div style={{ fontSize: '15px', lineHeight: 1.72, color: 'rgba(255,255,255,0.82)', fontWeight: 430 }}>{analysis.summary}</div>
        </div>
        <div style={{ ...S.surface, padding: '16px' }}>
          <div style={{ fontSize: '11px', color: S.textHint, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>다음 액션</div>
          {actionItems.map((item, i) => (
            <div key={item} style={{ display: 'grid', gridTemplateColumns: '22px 1fr', gap: '8px', marginBottom: i === actionItems.length - 1 ? 0 : '10px' }}>
              <span style={{ color: 'rgba(255,255,255,0.82)', fontSize: '12px', fontWeight: 560 }}>{i + 1}</span>
              <span style={{ color: S.textMuted, fontSize: '13px', lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px', marginBottom: '18px' }}>
        {diagnosis.map((item) => (
          <div key={item.title} style={{ ...S.surface, padding: '15px', borderColor: 'rgba(255,255,255,0.07)', backgroundColor: 'rgba(255,255,255,0.018)' }}>
            <div style={{ fontSize: '12px', fontWeight: 560, color: item.tone, marginBottom: '8px' }}>{item.title}</div>
            <div style={{ fontSize: '13px', lineHeight: 1.62, color: S.textMuted }}>{item.body}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
        {[
          { title: '강점', items: analysis.strengths, empty: '강점 데이터가 아직 없습니다.', color: 'rgba(255,255,255,0.78)' },
          { title: '보완 제안', items: analysis.suggestions, empty: '보완 제안 데이터가 아직 없습니다.', color: 'rgba(255,255,255,0.68)' },
          { title: '취약점', items: analysis.weaknesses, empty: '취약점 데이터가 아직 없습니다.', color: 'rgba(255,255,255,0.58)' },
        ].map((group) => (
          <div key={group.title}>
            <p style={{ fontSize: '10px', fontWeight: 600, color: group.color, marginBottom: '9px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{group.title}</p>
            {(group.items.length ? group.items : [group.empty]).map((item, i) => (
              <p key={`${group.title}-${i}`} style={{ fontSize: '12px', color: S.textMuted, lineHeight: 1.55, marginBottom: '6px' }}>• {item}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function LayoutReviewView({ review }: { review: ResumeLayoutReview }) {
  const reviewTone = scoreTone(review.score)
  const targets = buildLayoutTargets(review)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '18px', marginBottom: '18px' }}>
        <div style={{ ...S.surface, padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '12px' }}>
            <span style={{ fontSize: '34px', fontWeight: 700, color: reviewTone, lineHeight: 1 }}>{review.score}</span>
            <span style={{ fontSize: '13px', color: S.textHint }}>/ 100</span>
          </div>
          <div style={{ height: '6px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: '12px' }}>
            <div style={{ height: '6px', borderRadius: '6px', width: `${review.score}%`, backgroundColor: reviewTone }} />
          </div>
          <div style={{ fontSize: '12px', lineHeight: 1.55, color: S.textMuted }}>
            {review.score >= 85 ? '전체 구조는 안정적입니다. 문장 임팩트만 더 다듬으면 됩니다.' : review.score >= 70 ? '읽히는 구조는 있으나 섹션별 우선순위 조정이 필요합니다.' : '첫 화면, 섹션 순서, 문장 길이를 먼저 정리해야 합니다.'}
          </div>
        </div>
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          {['상단 요약', '경험', '프로젝트', '기술', '교육/기타'].map((label, index) => {
            const active = index < Math.max(1, Math.ceil(targets.length / 2))
            return (
              <div key={label} style={{
                display: 'grid', gridTemplateColumns: '96px 1fr', gap: '12px', alignItems: 'center',
                padding: '10px 14px', borderBottom: index < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <span style={{ fontSize: '12px', color: active ? reviewTone : S.textHint, fontWeight: active ? 600 : 400 }}>{label}</span>
                <div style={{ height: '5px', borderRadius: '5px', backgroundColor: 'rgba(255,255,255,0.08)' }}>
                  <div style={{ height: '5px', borderRadius: '5px', width: active ? `${Math.min(92, review.score + index * 3)}%` : '36%', backgroundColor: active ? reviewTone : 'rgba(255,255,255,0.18)' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ marginBottom: '12px', fontSize: '11px', color: S.textHint, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        어디를 손봐야 하는지
      </div>
      <div style={{ display: 'grid', gap: '10px' }}>
        {targets.map((target, i) => (
          <div key={`${target.area}-${i}`} style={{ ...S.surface, padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: reviewTone, fontWeight: 700 }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontSize: '13px', color: S.textPrimary, fontWeight: 600 }}>{target.area}</span>
            </div>
            <div style={{ fontSize: '13px', color: S.textMuted, lineHeight: 1.55, marginBottom: '6px' }}>
              문제: {target.issue}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.68)', lineHeight: 1.55 }}>
              수정: {target.fix}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ResumePage() {
  const qc = useQueryClient()
  const { add } = useToastStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [selectedId, setSelectedId] = useState<string | number | null>(null)
  const [analysisOpen, setAnalysisOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const { data: resumes, isLoading } = useQuery({ queryKey: ['resumes'], queryFn: listResumes })
  const selectedResume = useMemo(
    () => resumes?.find((resume) => resume.resumeId === selectedId) ?? null,
    [resumes, selectedId],
  )

  const { data: analysis, isLoading: analysisLoading } = useQuery({
    queryKey: ['resumes', selectedId, 'analysis'],
    queryFn: () => getAnalysis(selectedId!),
    enabled: !!selectedId && analysisOpen,
  })

  const { data: review, isLoading: reviewLoading } = useQuery({
    queryKey: ['resumes', selectedId, 'layout-review'],
    queryFn: () => getLayoutReview(selectedId!),
    enabled: !!selectedId && reviewOpen,
  })

  const { mutate: del } = useMutation({
    mutationFn: deleteResume,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['resumes'] }); add('success', '삭제되었습니다.') },
    onError: () => add('error', '삭제에 실패했습니다.'),
  })

  const { mutate: activate, isPending: activating } = useMutation({
    mutationFn: setActiveResume,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['resumes'] }); add('success', '활성 이력서가 변경되었습니다.') },
    onError: () => add('error', '활성 변경에 실패했습니다.'),
  })

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.pdf')) { add('error', 'PDF 파일만 업로드 가능합니다.'); return }
    if (file.size > 10 * 1024 * 1024) { add('error', '파일 크기는 10MB 이하여야 합니다.'); return }
    setUploading(true); setProgress(0)
    try {
      await uploadResume(file, setProgress)
      qc.invalidateQueries({ queryKey: ['resumes'] })
      add('success', '이력서가 업로드되었습니다.')
    } catch { add('error', '업로드에 실패했습니다.') }
    finally { setUploading(false); setProgress(0) }
  }

  const openAnalysis = (resumeId: string | number) => {
    setSelectedId(resumeId)
    setAnalysisOpen(true)
    setReviewOpen(false)
  }

  const openReview = (resumeId: string | number) => {
    setSelectedId(resumeId)
    setReviewOpen(true)
    setAnalysisOpen(false)
  }

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto' }}>
      <div style={{ padding: '24px' }}>
        <AgentIntro
          title="이력서를 에이전트가 읽는 방식으로 펼칩니다"
          description="내용 분석과 레이아웃 리뷰를 분리해, 무엇을 말해야 하고 어느 위치를 고쳐야 하는지 보여줍니다."
          steps={['문맥 읽기', '면접 리스크 추출', '수정 위치 표시']}
        />

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
          onClick={() => inputRef.current?.click()}
          style={{
            marginBottom: '24px',
            border: `2px dashed ${isDragging ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: '8px',
            backgroundColor: isDragging ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.02)',
            cursor: 'pointer',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '40px 24px',
            transition: 'all 0.15s',
          }}
        >
          <input ref={inputRef} type="file" accept=".pdf" style={{ display: 'none' }}
                 onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
          {uploading ? (
            <div style={{ width: '100%', maxWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Spinner size="sm" className="text-neutral-300" />
                <span style={{ fontSize: '13px', color: S.textMuted }}>업로드 중... {progress}%</span>
              </div>
              <div style={{ height: '2px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
                <div style={{ height: '2px', borderRadius: '2px', backgroundColor: 'rgba(255,255,255,0.82)', width: `${progress}%`, transition: 'width 0.2s' }} />
              </div>
            </div>
          ) : (
            <>
              <p style={{ fontSize: '13px', fontWeight: 500, color: S.textMuted, margin: 0 }}>PDF를 드래그하거나 클릭해서 업로드</p>
              <p style={{ fontSize: '12px', color: S.textHint, margin: '4px 0 0' }}>최대 10MB</p>
            </>
          )}
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '32px', fontSize: '13px', color: S.textHint }}>로딩 중...</div>
        ) : !resumes?.length ? (
          <div style={{ textAlign: 'center', padding: '32px', fontSize: '13px', color: S.textHint }}>업로드된 이력서가 없습니다</div>
        ) : (
          <div style={{ ...S.surface, overflow: 'hidden', marginBottom: '16px' }}>
            {resumes.map((r: ResumeDto, i: number) => (
              <div key={r.resumeId} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                minHeight: '52px', padding: '0 16px',
                borderBottom: i < resumes.length - 1 ? `1px solid ${S.rowBorder}` : 'none',
                backgroundColor: selectedResume?.resumeId === r.resumeId ? 'rgba(255,255,255,0.045)' : 'transparent',
              }}>
                <span style={{ flex: 1, fontSize: '13px', color: S.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.fileName}
                </span>
                <span style={{ fontSize: '12px', color: S.textHint, whiteSpace: 'nowrap' }}>
                  {new Date(r.uploadedAt).toLocaleDateString('ko-KR')}
                </span>
                {r.isActive && (
                  <span style={{
                    backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.68)',
                    borderRadius: '10px', fontSize: '11px', fontWeight: 500, padding: '0 8px', lineHeight: '20px',
                  }}>활성</span>
                )}
                {!r.isActive && (
                  <button
                    onClick={(e) => { e.stopPropagation(); activate(r.resumeId) }}
                    disabled={activating}
                    style={{
                      background: 'none', border: '1px solid rgba(255,255,255,0.12)',
                      cursor: activating ? 'not-allowed' : 'pointer',
                      fontSize: '11px', color: 'rgba(255,255,255,0.45)',
                      borderRadius: '10px', padding: '0 8px', lineHeight: '20px',
                    }}
                  >
                    활성 지정
                  </button>
                )}
                <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                  <button onClick={() => openAnalysis(r.resumeId)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'rgba(255,255,255,0.76)', padding: 0, fontWeight: 500 }}>분석</button>
                  <button onClick={() => openReview(r.resumeId)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'rgba(255,255,255,0.76)', padding: 0, fontWeight: 500 }}>레이아웃</button>
                  <button onClick={() => del(r.resumeId)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'rgba(255,99,99,0.7)', padding: 0 }}>삭제</button>
                  <a href={getDownloadUrl(r.resumeId)} style={{ fontSize: '12px', color: S.textMuted, textDecoration: 'none' }}>다운로드</a>
                </div>
              </div>
            ))}
          </div>
        )}

        {analysisOpen && (
          <div className="agent-surface agent-reveal" style={{ ...S.surface, padding: '20px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: S.textPrimary }}>AI 에이전트 분석</div>
                <div style={{ fontSize: '12px', color: S.textHint, marginTop: '3px' }}>{selectedResume?.fileName}</div>
              </div>
              <button onClick={() => setAnalysisOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: S.textHint, lineHeight: 1, padding: 0 }}>×</button>
            </div>
            {analysisLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '28px' }}><Spinner size="md" className="text-neutral-300" /></div>
            ) : analysis ? (
              <AgentAnalysisView analysis={analysis} />
            ) : null}
          </div>
        )}

        {reviewOpen && (
          <div className="agent-surface agent-reveal" style={{ ...S.surface, padding: '20px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: S.textPrimary }}>레이아웃 위치 리뷰</div>
                <div style={{ fontSize: '12px', color: S.textHint, marginTop: '3px' }}>{selectedResume?.fileName}</div>
              </div>
              <button onClick={() => setReviewOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: S.textHint, lineHeight: 1, padding: 0 }}>×</button>
            </div>
            {reviewLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '28px' }}><Spinner size="md" className="text-neutral-300" /></div>
            ) : review ? (
              <LayoutReviewView review={review} />
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
