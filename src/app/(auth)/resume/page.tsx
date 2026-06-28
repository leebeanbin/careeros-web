'use client'
import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listResumes, uploadResume, deleteResume, getAnalysis, getLayoutReview, getDownloadUrl,
} from '@/lib/api/resume'
import type { ResumeDto } from '@/lib/api/types'
import PageHeader from '@/components/ui/PageHeader'
import Spinner from '@/components/ui/Spinner'
import { useToastStore } from '@/stores/toastStore'

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

  const { data: resumes, isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: listResumes,
  })

  const { data: analysis } = useQuery({
    queryKey: ['resumes', selectedId, 'analysis'],
    queryFn: () => getAnalysis(selectedId!),
    enabled: !!selectedId && analysisOpen,
  })

  const { data: review } = useQuery({
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
    setUploading(true)
    setProgress(0)
    try {
      await uploadResume(file, setProgress)
      qc.invalidateQueries({ queryKey: ['resumes'] })
      add('success', '이력서가 업로드되었습니다.')
    } catch {
      add('error', '업로드에 실패했습니다.')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <div className="max-w-[640px] mx-auto px-5 py-6">
      <PageHeader title="이력서" description="이력서를 업로드하고 AI 분석을 받으세요" />

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          const f = e.dataTransfer.files[0]
          if (f) handleFile(f)
        }}
        onClick={() => inputRef.current?.click()}
        className={`mb-6 rounded-lg border-2 border-dashed cursor-pointer
          flex flex-col items-center justify-center py-10 transition-colors duration-[150ms]
          ${isDragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
        {uploading ? (
          <div className="w-full max-w-xs px-4">
            <div className="flex items-center gap-2 mb-2">
              <Spinner size="sm" className="text-indigo-600" />
              <span className="text-sm text-gray-600">업로드 중... {progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-200">
              <div
                className="h-1.5 rounded-full bg-indigo-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-700">PDF를 드래그하거나 클릭해서 업로드</p>
            <p className="text-xs text-gray-400 mt-1">최대 10MB</p>
          </>
        )}
      </div>

      {/* Resume list */}
      {isLoading ? (
        <div className="text-sm text-gray-400 text-center py-8">로딩 중...</div>
      ) : !resumes || resumes.length === 0 ? (
        <div className="text-sm text-gray-400 text-center py-8">업로드된 이력서가 없습니다</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">파일명</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">업로드일</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">상태</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {resumes.map((r: ResumeDto) => (
                <tr key={r.resumeId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900 font-medium">{r.fileName}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(r.uploadedAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-4 py-3">
                    {r.isActive && (
                      <span className="inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700">
                        활성
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setSelectedId(r.resumeId); setAnalysisOpen(true); setReviewOpen(false) }}
                        className="text-xs text-indigo-600 hover:underline"
                      >
                        분석
                      </button>
                      <button
                        onClick={() => { setSelectedId(r.resumeId); setReviewOpen(true); setAnalysisOpen(false) }}
                        className="text-xs text-indigo-600 hover:underline"
                      >
                        레이아웃
                      </button>
                      <a
                        href={getDownloadUrl(r.resumeId)}
                        className="text-xs text-gray-500 hover:underline"
                      >
                        다운로드
                      </a>
                      <button
                        onClick={() => del(r.resumeId)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Analysis panel */}
      {analysisOpen && analysis && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">AI 분석 결과</h3>
            <button onClick={() => setAnalysisOpen(false)} className="text-gray-400 hover:text-gray-600">×</button>
          </div>
          <p className="text-sm text-gray-700 mb-3">{analysis.summary}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-green-700 mb-1">강점</p>
              <ul className="text-xs text-gray-600 space-y-1">
                {analysis.strengths.map((s, i) => <li key={i}>• {s}</li>)}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-amber-700 mb-1">개선 제안</p>
              <ul className="text-xs text-gray-600 space-y-1">
                {analysis.suggestions.map((s, i) => <li key={i}>• {s}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Layout review panel */}
      {reviewOpen && review && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">레이아웃 리뷰</h3>
            <button onClick={() => setReviewOpen(false)} className="text-gray-400 hover:text-gray-600">×</button>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl font-semibold text-indigo-600">{review.score}</span>
            <span className="text-sm text-gray-500">/ 100</span>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            {review.feedback.map((f, i) => <li key={i}>• {f}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}
