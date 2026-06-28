import { apiFetch, BASE_URL } from './client'
import type { ResumeAnalysis, ResumeDto, ResumeLayoutReview } from './types'

export const listResumes = () => apiFetch<ResumeDto[]>('/resumes')

export const getResume = (resumeId: number) => apiFetch<ResumeDto>(`/resumes/${resumeId}`)

export const getActiveResume = () => apiFetch<ResumeDto>('/resumes/active')

export const deleteResume = (resumeId: number) =>
  apiFetch<void>(`/resumes/${resumeId}`, { method: 'DELETE' })

export const getAnalysis = (resumeId: number) =>
  apiFetch<ResumeAnalysis>(`/resumes/${resumeId}/analysis`)

export const getLayoutReview = (resumeId: number) =>
  apiFetch<ResumeLayoutReview>(`/resumes/${resumeId}/layout-review`)

export const getDownloadUrl = (resumeId: number) =>
  `${BASE_URL}/resumes/${resumeId}/download`

export const uploadResume = (
  file: File,
  onProgress?: (pct: number) => void,
): Promise<ResumeDto> =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${BASE_URL}/resumes`)
    xhr.withCredentials = true
    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const body = JSON.parse(xhr.responseText) as Record<string, unknown>
        resolve(('data' in body ? body.data : body) as ResumeDto)
      } else {
        reject(new Error('업로드에 실패했습니다.'))
      }
    }
    xhr.onerror = () => reject(new Error('네트워크 오류가 발생했습니다.'))
    const form = new FormData()
    form.append('file', file)
    xhr.send(form)
  })
