'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { getMe, updateMe, deleteMe } from '@/lib/api/users'
import { logout } from '@/lib/api/auth'
import type { UpdateUserDto } from '@/lib/api/types'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'

type Section = 'profile' | 'danger'

const SETTINGS_NAV = [
  { group: '계정', items: [
    { id: 'profile' as Section, label: '프로필' },
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
    useForm<UpdateUserDto>({ values: me ? { name: me.name, email: me.email } : undefined })

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

  const sectionTitle = activeSection === 'profile' ? '프로필' : '계정 삭제'

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
          {activeSection === 'profile' && (
            <form onSubmit={handleSubmit((d) => save(d))} style={{
              backgroundColor: 'rgb(13,14,15)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px', padding: '20px',
            }}>
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
                  <input {...register('email', { required: true })} type="email" style={inputStyle} />
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
          )}

          {activeSection === 'danger' && (
            <div style={{
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
