'use client'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { getReport } from '@/lib/api/advisor'
import { AgentIntro, AgentPanel, AgentStepList } from '@/components/app/AgentPrimitives'

function StatusBadge({ status }: { status: string }) {
  const completed = status === 'COMPLETED'
  return (
    <span style={{
      backgroundColor: completed ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.08)',
      color: completed ? 'rgb(34,197,94)' : 'rgba(255,255,255,0.82)',
      borderRadius: '10px',
      fontSize: '11px',
      fontWeight: 500,
      padding: '2px 7px',
    }}>
      {completed ? '완료' : '분석 중'}
    </span>
  )
}

export default function AdvisorReportPage() {
  const { reportId } = useParams<{ reportId: string }>()
  const idVal = isNaN(Number(reportId)) ? reportId : Number(reportId)
  const { data: report, isLoading } = useQuery({
    queryKey: ['advisor', 'reports', idVal],
    queryFn: () => getReport(idVal),
    refetchInterval: (q) => (q.state.data?.status === 'PENDING' ? 3000 : false),
  })

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '720px', margin: '0 auto', padding: '24px' }}>
        {[0, 1].map((i) => (
          <div key={i} style={{ height: '80px', borderRadius: '8px', backgroundColor: 'rgb(13,14,15)', border: '1px solid rgba(255,255,255,0.06)', animation: 'pulse 1.5s infinite' }} />
        ))}
      </div>
    )
  }

  if (!report) return null

  return (
    <div>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '48px', padding: '0 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgb(8,9,10)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/advisor" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
            ← 어드바이저
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>
            보고서 #{report.reportId}
          </span>
        </div>
        <StatusBadge status={report.status} />
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px' }}>
        <AgentIntro
          title="보고서를 읽기 쉬운 작업물로 펼칩니다"
          description="어드바이저가 모은 신호를 실행 가능한 문장으로 확인합니다."
          steps={['신호 수집', '판단 정리', '다음 행동']}
        />
        {report.status === 'PENDING' ? (
          <AgentPanel style={{
            backgroundColor: 'rgb(13,14,15)',
            border: '1px solid rgba(255,255,255,0.06)',
            padding: '64px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                 style={{ animation: 'spin 1s linear infinite', color: 'rgba(255,255,255,0.82)' }}>
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.12)" strokeWidth="2"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="rgba(255,255,255,0.82)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
              AI가 분석 중입니다... 잠시만 기다려주세요
            </p>
            <AgentStepList
              steps={[
                { label: '프로필 신호 수집', detail: '이력서와 GitHub, 매칭 상태를 확인합니다.' },
                { label: '우선순위 계산', detail: '강한 후보와 보완 후보를 분리합니다.', tone: 'green' },
                { label: '보고서 작성', detail: '실행 가능한 문장으로 정리합니다.', tone: 'amber' },
              ]}
            />
          </AgentPanel>
        ) : (
          <AgentPanel style={{
            backgroundColor: 'rgb(13,14,15)',
            border: '1px solid rgba(255,255,255,0.06)',
            padding: '24px',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Headline & Summary */}
              {(report.headline || report.summary || report.content) && (
                <div style={{
                  padding: '24px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}>
                  {report.headline && (
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.95)',
                      margin: '0 0 12px 0',
                    }}>
                      {report.headline}
                    </h3>
                  )}
                  <p style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: 1.6,
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                  }}>
                    {report.summary || report.content}
                  </p>
                </div>
              )}

              {/* Next Actions */}
              {report.nextActions && report.nextActions.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px 0' }}>
                    추천 실행 과제 (Next Actions)
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {report.nextActions.map((action, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '16px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(99, 102, 241, 0.04)',
                        border: '1px solid rgba(99, 102, 241, 0.15)',
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: action.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                          color: action.priority === 'HIGH' ? 'rgb(239, 68, 68)' : 'rgb(129, 140, 248)',
                          fontSize: '11px',
                          fontWeight: 600,
                          flexShrink: 0,
                        }}>
                          {action.priority === 'HIGH' ? 'P0' : 'P1'}
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500, marginBottom: '4px' }}>
                            {action.description}
                          </div>
                          {action.type && (
                            <span style={{
                              fontSize: '10px',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(255, 255, 255, 0.08)',
                              color: 'rgba(255, 255, 255, 0.5)',
                            }}>
                              {action.type}
                            </span>
                          )}
                          {action.skillName && (
                            <span style={{
                              fontSize: '10px',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(99, 102, 241, 0.1)',
                              color: 'rgb(129, 140, 248)',
                              marginLeft: '6px',
                            }}>
                              {action.skillName}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Skills */}
              {report.missingSkills && report.missingSkills.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px 0' }}>
                    보완이 필요한 기술 스택 (Missing Skills)
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {report.missingSkills.map((skill, i) => (
                      <div key={i} style={{
                        padding: '14px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(234, 179, 8, 0.02)',
                        border: '1px solid rgba(234, 179, 8, 0.12)',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgb(234, 179, 8)' }}>
                            {skill.skillName}
                          </span>
                          <span style={{
                            fontSize: '10px',
                            padding: '1px 6px',
                            borderRadius: '3px',
                            backgroundColor: 'rgba(234, 179, 8, 0.1)',
                            color: 'rgb(234, 179, 8)',
                          }}>
                            우선순위 {skill.priority}
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)', margin: 0, lineHeight: 1.5 }}>
                          {skill.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Jobs */}
              {((report.recommendedJobs && report.recommendedJobs.length > 0) ||
                (report.applyNowList && report.applyNowList.length > 0)) && (
                <div>
                  <h4 style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px 0' }}>
                    에이전트 추천 채용 공고
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[...(report.applyNowList || []), ...(report.recommendedJobs || [])].map((job, i) => {
                      const isApplyNow = report.applyNowList?.some((j) => j.jobId === job.jobId)
                      return (
                        <div key={i} style={{
                          padding: '18px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <h5 style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
                                  {job.title}
                                </h5>
                                {isApplyNow && (
                                  <span style={{
                                    fontSize: '9px',
                                    padding: '1px 5px',
                                    borderRadius: '3px',
                                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                                    color: 'rgb(34, 197, 94)',
                                    fontWeight: 600,
                                  }}>
                                    즉시 지원
                                  </span>
                                )}
                              </div>
                              <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)' }}>
                                {job.companyName}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{
                                fontSize: '11px',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                backgroundColor: job.score >= 80 ? 'rgba(34, 197, 94, 0.12)' : 'rgba(99, 102, 241, 0.12)',
                                color: job.score >= 80 ? 'rgb(34, 197, 94)' : 'rgb(129, 140, 248)',
                                fontWeight: 600,
                              }}>
                                {job.score}점
                              </span>
                              {job.applyUrl && (
                                <a
                                  href={job.applyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    fontSize: '11px',
                                    color: 'rgb(8, 9, 10)',
                                    backgroundColor: 'rgb(229, 229, 230)',
                                    padding: '4px 10px',
                                    borderRadius: '5px',
                                    textDecoration: 'none',
                                    fontWeight: 500,
                                  }}
                                >
                                  지원하기
                                </a>
                              )}
                            </div>
                          </div>
                          {job.narrative && (
                            <p style={{
                              fontSize: '12.5px',
                              color: 'rgba(255, 255, 255, 0.6)',
                              lineHeight: 1.55,
                              margin: 0,
                              padding: '10px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(255, 255, 255, 0.015)',
                              borderLeft: '2px solid rgba(255, 255, 255, 0.1)',
                            }}>
                              {job.narrative}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div style={{
                marginTop: '12px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.3)',
              }}>
                요청일: {new Date(report.createdAt).toLocaleString('ko-KR')}
                {report.completedAt && ` · 완료: ${new Date(report.completedAt).toLocaleString('ko-KR')}`}
              </div>
            </div>
          </AgentPanel>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
