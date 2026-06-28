'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { getGraph, getPreferences, updatePreferences } from '@/lib/api/candidate'
import type { CandidatePreferences } from '@/lib/api/types'
import ScoreBreakdownChart from '@/components/app/ScoreBreakdownChart'
import PageHeader from '@/components/ui/PageHeader'
import Spinner from '@/components/ui/Spinner'
import { useToastStore } from '@/stores/toastStore'

const REMOTE_OPTIONS = ['REMOTE', 'HYBRID', 'ON_SITE'] as const
const REMOTE_LABELS: Record<string, string> = { REMOTE: '원격', HYBRID: '하이브리드', ON_SITE: '오프사이트' }
const COUNTRY_OPTIONS = ['대한민국', '미국', '캐나다', '일본', '독일', '영국', '싱가포르', '호주']

export default function CandidatePage() {
  const qc = useQueryClient()
  const { add } = useToastStore()

  const { data: graph } = useQuery({ queryKey: ['candidates', 'me', 'graph'], queryFn: getGraph })
  const { data: prefs } = useQuery({ queryKey: ['candidates', 'me', 'preferences'], queryFn: getPreferences })

  const { register, handleSubmit, control, formState: { isSubmitting, isDirty } } =
    useForm<CandidatePreferences>({ values: prefs })

  const { mutate: save } = useMutation({
    mutationFn: updatePreferences,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['candidates', 'me', 'preferences'] })
      add('success', '선호도가 저장되었습니다.')
    },
    onError: () => add('error', '저장에 실패했습니다.'),
  })

  return (
    <div className="max-w-[640px] mx-auto px-5 py-6">
      <PageHeader title="경력 그래프" description="AI가 분석한 나의 기술 프로필" />

      {graph && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 mb-6
                        shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-900">매칭 점수 분포</h2>
            <span className="text-xl font-semibold text-indigo-600">{graph.totalScore}</span>
          </div>
          <ScoreBreakdownChart
            skillScore={graph.skillScore}
            evidenceScore={graph.evidenceScore}
            roleScore={graph.roleScore}
            preferenceScore={graph.preferenceScore}
            freshnessScore={graph.freshnessScore}
          />
        </div>
      )}

      {prefs && (
        <form
          onSubmit={handleSubmit((d) => save(d))}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        >
          <h2 className="text-sm font-semibold text-gray-900 mb-4">선호도 설정</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">근무 형태</label>
              <div className="flex gap-3">
                {REMOTE_OPTIONS.map((opt) => (
                  <label key={opt} className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input type="radio" value={opt} {...register('remoteType')} />
                    {REMOTE_LABELS[opt]}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">선호 국가</label>
              <Controller
                name="preferredCountries"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {COUNTRY_OPTIONS.map((country) => (
                      <label key={country} className="flex items-center gap-1.5 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          value={country}
                          checked={field.value?.includes(country) ?? false}
                          onChange={(e) => {
                            const current = field.value ?? []
                            field.onChange(
                              e.target.checked
                                ? [...current, country]
                                : current.filter((c: string) => c !== country),
                            )
                          }}
                        />
                        {country}
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" {...register('relocationPossible')} />
                <span className="font-medium text-gray-700">이주 가능</span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white
                         hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Spinner size="sm" className="text-white" />}
              저장
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
