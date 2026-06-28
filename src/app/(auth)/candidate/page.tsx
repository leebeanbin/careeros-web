'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { getGraph, getPreferences, updatePreferences } from '@/lib/api/candidate'
import type { CandidatePreferences } from '@/lib/api/types'
import ScoreBreakdownChart from '@/components/app/ScoreBreakdownChart'
import { useToastStore } from '@/stores/toastStore'

const REMOTE_OPTIONS = ['REMOTE', 'HYBRID', 'ON_SITE'] as const
const REMOTE_LABELS: Record<string, string> = { REMOTE: '원격', HYBRID: '하이브리드', ON_SITE: '오프사이트' }
const COUNTRY_OPTIONS = ['대한민국', '미국', '캐나다', '일본', '독일', '영국', '싱가포르', '호주']

const card: React.CSSProperties = {
  backgroundColor: 'rgb(13,14,15)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '16px',
}

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
    <div>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center',
        height: '48px', padding: '0 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgb(8,9,10)',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>경력 그래프</span>
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px' }}>
        {/* Score chart */}
        {graph && (
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                매칭 점수 분포
              </span>
              <span style={{ fontSize: '24px', fontWeight: 600, color: 'rgb(99,102,241)' }}>
                {graph.totalScore}
              </span>
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

        {/* Preferences form */}
        {prefs && (
          <form onSubmit={handleSubmit((d) => save(d))} style={card}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '20px' }}>
              선호도 설정
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Remote type */}
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 500, marginBottom: '10px' }}>근무 형태</div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  {REMOTE_OPTIONS.map((opt) => (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', accentColor: 'rgb(99,102,241)' } as React.CSSProperties}>
                      <input type="radio" value={opt} {...register('remoteType')} style={{ accentColor: 'rgb(99,102,241)' } as React.CSSProperties} />
                      {REMOTE_LABELS[opt]}
                    </label>
                  ))}
                </div>
              </div>

              {/* Countries */}
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 500, marginBottom: '10px' }}>선호 국가</div>
                <Controller
                  name="preferredCountries"
                  control={control}
                  render={({ field }) => (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      {COUNTRY_OPTIONS.map((country) => (
                        <label key={country} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
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
                            style={{ accentColor: 'rgb(99,102,241)' } as React.CSSProperties}
                          />
                          {country}
                        </label>
                      ))}
                    </div>
                  )}
                />
              </div>

              {/* Relocation */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                <input type="checkbox" {...register('relocationPossible')} style={{ accentColor: 'rgb(99,102,241)' } as React.CSSProperties} />
                이주 가능
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                type="submit"
                disabled={isSubmitting || !isDirty}
                style={{
                  backgroundColor: isSubmitting || !isDirty ? 'rgba(229,229,230,0.3)' : 'rgb(229,229,230)',
                  color: 'rgb(8,9,10)',
                  fontWeight: 510,
                  borderRadius: '6px',
                  height: '32px',
                  padding: '0 14px',
                  fontSize: '13px',
                  border: 'none',
                  cursor: isSubmitting || !isDirty ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? '저장 중...' : '저장'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
