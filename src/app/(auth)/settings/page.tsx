'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { getMe, updateMe, deleteMe } from '@/lib/api/users'
import { logout } from '@/lib/api/auth'
import { getPreferences, updatePreferences } from '@/lib/api/candidate'
import { listRoles } from '@/lib/api/taxonomy'
import type { UpdateUserDto, CandidatePreferences } from '@/lib/api/types'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import { AgentIntro, AgentPanel } from '@/components/app/AgentPrimitives'

type Section = 'profile' | 'preferences' | 'danger'

const SETTINGS_NAV = [
  { group: '계정', items: [
    { id: 'profile' as Section, label: '프로필' },
    { id: 'preferences' as Section, label: '구직 선호도' },
    { id: 'danger' as Section, label: '계정 삭제' },
  ]},
]

const inputStyle: React.CSSProperties = {
  height: '36px', width: '100%',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '6px',
  backgroundColor: 'rgba(255,255,255,0.04)',
  color: 'rgb(247,248,248)',
  fontSize: '13px', outline: 'none',
  padding: '0 10px', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  fontSize: '12px', fontWeight: 500,
  color: 'rgba(255,255,255,0.5)',
  display: 'block', marginBottom: '6px',
}

export default function SettingsPage() {
  const qc = useQueryClient()
  const router = useRouter()
  const { clear } = useAuthStore()
  const { add } = useToastStore()
  const [showDelete, setShowDelete] = useState(false)
  const [activeSection, setActiveSection] = useState<Section>('profile')

  const { data: me } = useQuery({ queryKey: ['users', 'me'], queryFn: getMe })

  const { register, handleSubmit, formState: { isSubmitting, isDirty } } =
    useForm<UpdateUserDto>({ values: me ? { name: me.name } : undefined })

  const { mutate: save } = useMutation({
    mutationFn: updateMe,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users', 'me'] }); add('success', '저장되었습니다.') },
    onError: () => add('error', '저장에 실패했습니다.'),
  })

  const { mutate: doDelete, isPending: deleting } = useMutation({
    mutationFn: deleteMe,
    onSuccess: async () => {
      await logout().catch(() => null)
      clear()
      router.push('/')
    },
    onError: () => add('error', '탈퇴에 실패했습니다.'),
  })

  const sectionTitle =
    activeSection === 'profile' ? '프로필'
    : activeSection === 'preferences' ? '구직 선호도'
    : '계정 삭제'

  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: 'rgb(8,9,10)' }}>
      {/* Left nav */}
      <div style={{
        width: '200px', flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.06)',
        padding: '16px 8px', overflow: 'auto',
      }}>
        {SETTINGS_NAV.map(({ group, items }) => (
          <div key={group} style={{ marginBottom: '20px' }}>
            <div style={{
              fontSize: '11px', fontWeight: 500, color: 'rgb(138,143,152)',
              padding: '4px 8px 6px', textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
              {group}
            </div>
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  fontSize: '13px', padding: '6px 10px', borderRadius: '5px',
                  border: 'none', cursor: 'pointer',
                  backgroundColor: activeSection === item.id ? 'rgba(255,255,255,0.07)' : 'transparent',
                  color: activeSection === item.id ? 'rgb(247,248,248)' : 'rgb(138,143,152)',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Right content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Sticky header */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          height: '48px', display: 'flex', alignItems: 'center',
          padding: '0 32px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: 'rgb(8,9,10)',
        }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>
            {sectionTitle}
          </span>
        </div>

        <div style={{ padding: '32px' }}>
          <AgentIntro
            title="계정 상태를 조용히 정리합니다"
            description="프로필 정보와 위험 작업을 분리해 실수 없이 관리할 수 있게 합니다."
            steps={['프로필 확인', '변경사항 감지', '위험 작업 분리']}
          />
          {activeSection === 'profile' && (
            <AgentPanel>
            <form onSubmit={handleSubmit((d) => save(d))} style={{ padding: '20px' }}>
              <div style={{
                fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px',
              }}>
                프로필
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>이름</label>
                  <input {...register('name', { required: true })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>이메일</label>
                  <input value={me?.email || ''} readOnly disabled style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }} />
                </div>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  style={{
                    height: '32px', padding: '0 14px',
                    backgroundColor: isSubmitting || !isDirty ? 'rgba(229,229,230,0.3)' : 'rgb(229,229,230)',
                    color: 'rgb(8,9,10)', fontWeight: 510,
                    fontSize: '13px', border: 'none',
                    borderRadius: '6px',
                    cursor: isSubmitting || !isDirty ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting ? '저장 중...' : '저장'}
                </button>
              </div>
            </form>
            </AgentPanel>
          )}

          {activeSection === 'preferences' && (
            <PreferencesSection />
          )}

          {activeSection === 'danger' && (
            <div className="agent-reveal" style={{
              border: '1px solid rgba(255,99,99,0.2)',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,0,0,0.03)',
              padding: '20px',
            }}>
              <div style={{
                fontSize: '11px', fontWeight: 500, color: 'rgba(255,99,99,0.7)',
                textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px',
              }}>
                위험 구역
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '14px', lineHeight: 1.5 }}>
                계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
              </p>
              <button
                onClick={() => setShowDelete(true)}
                style={{
                  height: '30px', padding: '0 12px',
                  border: '1px solid rgba(255,99,99,0.3)',
                  color: 'rgba(255,99,99,0.8)',
                  backgroundColor: 'transparent',
                  borderRadius: '6px', fontSize: '13px', cursor: 'pointer',
                }}
              >
                계정 삭제
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm overlay */}
      {showDelete && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100,
        }}>
          <div style={{
            backgroundColor: 'rgb(17,18,19)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px', padding: '24px', width: '320px',
          }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', margin: '0 0 10px' }}>
              계정 삭제 확인
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, margin: '0 0 20px' }}>
              정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDelete(false)}
                style={{
                  height: '30px', padding: '0 12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.5)',
                  backgroundColor: 'transparent',
                  borderRadius: '6px', fontSize: '13px', cursor: 'pointer',
                }}
              >
                취소
              </button>
              <button
                onClick={() => doDelete()}
                disabled={deleting}
                style={{
                  height: '30px', padding: '0 12px',
                  backgroundColor: deleting ? 'rgba(220,38,38,0.5)' : 'rgb(220,38,38)',
                  color: 'white', border: 'none',
                  borderRadius: '6px', fontSize: '13px',
                  fontWeight: 500, cursor: deleting ? 'not-allowed' : 'pointer',
                }}
              >
                {deleting ? '삭제 중...' : '삭제 확인'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const REMOTE_OPTIONS = [
  { value: 'REMOTE', label: '원격' },
  { value: 'HYBRID', label: '하이브리드' },
  { value: 'ON_SITE', label: '오프사이트' },
] as const

function PreferencesSection() {
  const qc = useQueryClient()
  const { add } = useToastStore()

  const { data: prefs } = useQuery({
    queryKey: ['candidates', 'me', 'preferences'],
    queryFn: getPreferences,
  })
  const { data: roles } = useQuery({
    queryKey: ['taxonomy', 'roles'],
    queryFn: listRoles,
  })

  const { control, setValue } = useForm<CandidatePreferences>({
    values: prefs ? {
      preferredRoles: prefs.preferredRoles || [],
      preferredCountries: prefs.preferredCountries || [],
      remoteTypes: prefs.remoteTypes || [],
      employmentTypes: prefs.employmentTypes || [],
      relocationPossible: prefs.relocationPossible,
    } : {
      preferredRoles: [],
      preferredCountries: [],
      remoteTypes: [],
      employmentTypes: [],
      relocationPossible: false,
    }
  })

  const preferredRoles = useWatch({ control, name: 'preferredRoles' }) || []
  const preferredCountries = useWatch({ control, name: 'preferredCountries' }) || []
  const remoteTypes = useWatch({ control, name: 'remoteTypes' }) || []
  const employmentTypes = useWatch({ control, name: 'employmentTypes' }) || []
  const relocationPossible = useWatch({ control, name: 'relocationPossible' })

  const [countryInput, setCountryInput] = useState('')

  const { mutate: save, isPending } = useMutation({
    mutationFn: (body: Partial<CandidatePreferences>) => updatePreferences(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['candidates', 'me', 'preferences'] })
      add('success', '선호도가 저장되었습니다.')
    },
    onError: () => add('error', '저장에 실패했습니다.'),
  })

  const handleSave = () => {
    save({ preferredRoles, preferredCountries, remoteTypes, employmentTypes, relocationPossible })
  }

  const toggleRole = (code: string) => {
    const next = preferredRoles.includes(code)
      ? preferredRoles.filter((r) => r !== code)
      : [...preferredRoles, code]
    setValue('preferredRoles', next, { shouldDirty: true })
  }

  const addCountry = () => {
    const trimmed = countryInput.trim()
    if (trimmed && !preferredCountries.includes(trimmed)) {
      setValue('preferredCountries', [...preferredCountries, trimmed], { shouldDirty: true })
    }
    setCountryInput('')
  }

  const removeCountry = (c: string) => {
    setValue('preferredCountries', preferredCountries.filter((x) => x !== c), { shouldDirty: true })
  }

  const toggleRemote = (value: CandidatePreferences['remoteTypes'][number]) => {
    setValue(
      'remoteTypes',
      remoteTypes.includes(value) ? remoteTypes.filter((item) => item !== value) : [...remoteTypes, value],
      { shouldDirty: true },
    )
  }

  const chipStyle = (active: boolean): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    padding: '4px 10px', borderRadius: '14px', fontSize: '12px',
    fontWeight: 500, cursor: 'pointer', border: 'none',
    transition: 'all 150ms',
    backgroundColor: active ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.06)',
    color: active ? 'rgba(255,255,255,0.62)' : 'rgba(255,255,255,0.5)',
  })

  return (
    <AgentPanel>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{
          fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          구직 선호도
        </div>

        {/* Preferred roles */}
        <div>
          <label style={labelStyle}>선호 직무</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {(roles ?? []).map((r) => (
              <button
                key={r.code}
                type="button"
                onClick={() => toggleRole(r.code)}
                style={chipStyle(preferredRoles.includes(r.code))}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred countries */}
        <div>
          <label style={labelStyle}>선호 국가</label>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
            <input
              value={countryInput}
              onChange={(e) => setCountryInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCountry() } }}
              placeholder="국가명 입력 후 Enter"
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              type="button"
              onClick={addCountry}
              style={{
                height: '36px', padding: '0 12px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
                borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
              }}
            >
              추가
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {preferredCountries.map((c) => (
              <span key={c} style={{ ...chipStyle(true), cursor: 'default' }}>
                {c}
                <button
                  type="button"
                  onClick={() => removeCountry(c)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.3)', fontSize: '12px', padding: 0, lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Remote type */}
        <div>
          <label style={labelStyle}>근무 형태</label>
          <div style={{ display: 'flex', gap: '6px' }}>
            {REMOTE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleRemote(opt.value)}
                style={chipStyle(remoteTypes.includes(opt.value))}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Relocation */}
        <div>
          <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={relocationPossible}
              onChange={(e) => setValue('relocationPossible', e.target.checked, { shouldDirty: true })}
              style={{ accentColor: 'rgba(255,255,255,0.82)' }}
            />
            이주 가능
          </label>
        </div>

        {/* Save button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            style={{
              height: '32px', padding: '0 14px',
              backgroundColor: isPending ? 'rgba(229,229,230,0.3)' : 'rgb(229,229,230)',
              color: 'rgb(8,9,10)', fontWeight: 510,
              fontSize: '13px', border: 'none',
              borderRadius: '6px',
              cursor: isPending ? 'not-allowed' : 'pointer',
            }}
          >
            {isPending ? '저장 중...' : '선호도 저장'}
          </button>
        </div>
      </div>
    </AgentPanel>
  )
}
