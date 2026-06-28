'use client'
import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listResumes, uploadResume, deleteResume, getAnalysis, getLayoutReview, getDownloadUrl,
} from '@/lib/api/resume'
import type { ResumeDto } from '@/lib/api/types'
import Spinner from '@/components/ui/Spinner'
import { useToastStore } from '@/stores/toastStore'

const S = {
  surface: { backgroundColor: 'rgb(13,14,15)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' } as React.CSSProperties,
  textPrimary: 'rgba(255,255,255,0.85)',
  textMuted: 'rgba(255,255,255,0.5)',
  textHint: 'rgba(255,255,255,0.3)',
  border: 'rgba(255,255,255,0.06)',
  rowBorder: 'rgba(255,255,255,0.04)',
}

export default function ResumePage() {
  const qc = useQueryClient()
  const { add } = useToastStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [analysisOpen, setAnalysisOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const { data: resumes, isLoading } = useQuery({ queryKey: ['resumes'], queryFn: listResumes })

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

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center',
        height: '48px', padding: '0 24px',
        borderBottom: `1px solid ${S.border}`,
        backgroundColor: 'rgb(8,9,10)',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: S.textMuted }}>이력서</span>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
          onClick={() => inputRef.current?.click()}
          style={{
            marginBottom: '24px',
            border: `2px dashed ${isDragging ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: '8px',
            backgroundColor: isDragging ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.02)',
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
                <Spinner size="sm" className="text-indigo-400" />
                <span style={{ fontSize: '13px', color: S.textMuted }}>업로드 중... {progress}%</span>
              </div>
              <div style={{ height: '2px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
                <div style={{ height: '2px', borderRadius: '2px', backgroundColor: 'rgb(99,102,241)', width: `${progress}%`, transition: 'width 0.2s' }} />
              </div>
            </div>
          ) : (
            <>
              <p style={{ fontSize: '13px', fontWeight: 500, color: S.textMuted, margin: 0 }}>PDF를 드래그하거나 클릭해서 업로드</p>
              <p style={{ fontSize: '12px', color: S.textHint, margin: '4px 0 0' }}>최대 10MB</p>
            </>
          )}
        </div>

        {/* Resume list */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '32px', fontSize: '13px', color: S.textHint }}>로딩 중...</div>
        ) : !resumes?.length ? (
          <div style={{ textAlign: 'center', padding: '32px', fontSize: '13px', color: S.textHint }}>업로드된 이력서가 없습니다</div>
        ) : (
          <div style={{ ...S.surface, overflow: 'hidden', marginBottom: '16px' }}>
            {resumes.map((r: ResumeDto, i: number) => (
              <div key={r.resumeId} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                height: '44px', padding: '0 16px',
                borderBottom: i < resumes.length - 1 ? `1px solid ${S.rowBorder}` : 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                <span style={{ flex: 1, fontSize: '13px', color: S.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.fileName}
                </span>
                <span style={{ fontSize: '12px', color: S.textHint, whiteSpace: 'nowrap' }}>
                  {new Date(r.uploadedAt).toLocaleDateString('ko-KR')}
                </span>
                {r.isActive && (
                  <span style={{
                    backgroundColor: 'rgba(34,197,94,0.12)', color: 'rgb(34,197,94)',
                    borderRadius: '10px', fontSize: '11px', fontWeight: 500, padding: '0 8px', lineHeight: '20px',
                  }}>활성</span>
                )}
                <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                  {[
                    { label: '분석', onClick: () => { setSelectedId(r.resumeId); setAnalysisOpen(true); setReviewOpen(false) }, color: 'rgb(99,102,241)' },
                    { label: '레이아웃', onClick: () => { setSelectedId(r.resumeId); setReviewOpen(true); setAnalysisOpen(false) }, color: 'rgb(99,102,241)' },
                    { label: '삭제', onClick: () => del(r.resumeId), color: 'rgba(255,99,99,0.7)' },
                  ].map(({ label, onClick, color }) => (
                    <button key={label} onClick={onClick} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: '12px', color, padding: 0,
                    }}>{label}</button>
                  ))}
                  <a href={getDownloadUrl(r.resumeId)} style={{ fontSize: '12px', color: S.textMuted, textDecoration: 'none' }}>다운로드</a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Analysis panel */}
        {analysisOpen && (
          <div style={{ ...S.surface, padding: '20px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: S.textPrimary }}>AI 분석 결과</span>
              <button onClick={() => setAnalysisOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: S.textHint, lineHeight: 1, padding: 0 }}>×</button>
            </div>
            {analysisLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}><Spinner size="md" className="text-indigo-400" /></div>
            ) : analysis ? (
              <>
                <p style={{ fontSize: '13px', color: S.textMuted, lineHeight: 1.6, marginBottom: '16px' }}>{analysis.summary}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: 500, color: 'rgb(34,197,94)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>강점</p>
                    {analysis.strengths.map((s: string, i: number) => (
                      <p key={i} style={{ fontSize: '12px', color: S.textMuted, marginBottom: '4px' }}>• {s}</p>
                    ))}
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: 500, color: 'rgb(234,179,8)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>개선 제안</p>
                    {analysis.suggestions.map((s: string, i: number) => (
                      <p key={i} style={{ fontSize: '12px', color: S.textMuted, marginBottom: '4px' }}>• {s}</p>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* Layout review panel */}
        {reviewOpen && (
          <div style={{ ...S.surface, padding: '20px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: S.textPrimary }}>레이아웃 리뷰</span>
              <button onClick={() => setReviewOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: S.textHint, lineHeight: 1, padding: 0 }}>×</button>
            </div>
            {reviewLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}><Spinner size="md" className="text-indigo-400" /></div>
            ) : review ? (
              <>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '28px', fontWeight: 600, color: 'rgb(99,102,241)' }}>{review.score}</span>
                  <span style={{ fontSize: '13px', color: S.textHint }}>/ 100</span>
                </div>
                {review.feedback.map((f: string, i: number) => (
                  <p key={i} style={{ fontSize: '13px', color: S.textMuted, marginBottom: '6px' }}>• {f}</p>
                ))}
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
