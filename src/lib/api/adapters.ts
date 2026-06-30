import type {
  AdvisorDashboard,
  AdvisorReport,
  CandidateGraph,
  CandidatePreferences,
  CursorPage,
  GitHubRepo,
  JobDto,
  MatchDto,
  NotificationDto,
  ResumeAnalysis,
  ResumeDto,
  ResumeLayoutReview,
} from './types'

type BackendCursorPage<T> = CursorPage<T> & {
  items?: T[]
  notifications?: T[]
  total?: number
}

type BackendJob = Omit<Partial<JobDto>, 'company'> & {
  companyName?: string
  company?: string | { name?: string }
  country?: string
  matchScore?: number | null
  hasApplyLink?: boolean
}

type BackendMatch = Partial<MatchDto> & {
  jobId?: string | number
  jobTitle?: string
  companyName?: string
  score?: number
  stale?: boolean
  status?: string
  scoreBreakdown?: {
    skillScore?: number
    evidenceScore?: number
    roleScore?: number
    preferenceScore?: number
    freshnessScore?: number
    total?: number
  }
}

type BackendNotification = Omit<Partial<NotificationDto>, 'isRead' | 'targetUrl'> & {
  isRead?: boolean
  read?: boolean
  targetUrl?: string | null
  metadata?: Record<string, string>
}

type BackendResume = Omit<Partial<ResumeDto>, 'isActive' | 'uploadedAt'> & {
  isActive?: boolean
  uploadedAt?: string
  active?: boolean
  createdAt?: string
  updatedAt?: string
  status?: string
}

type BackendResumeAnalysis = Partial<ResumeAnalysis> & {
  status?: string
  skills?: string[]
  warnings?: string[]
  workExperiences?: { company?: string; title?: string }[]
  projects?: { name?: string; skills?: string[] }[]
}

type BackendResumeLayoutReview = Partial<ResumeLayoutReview> & {
  overallRating?: string
  strengths?: string[]
  improvements?: string[]
  atsCompatible?: boolean
}

type BackendCandidateGraph = Partial<CandidateGraph> & {
  skills?: { confidence?: number; strength?: 'WEAK' | 'MODERATE' | 'STRONG' }[]
}

type BackendCandidatePreferences = Partial<CandidatePreferences> & {
  countries?: string[]
  remoteType?: string
  remoteTypes?: string[]
  employmentTypes?: string[]
  roleCategories?: string[]
}

type BackendAdvisorDashboard = Partial<AdvisorDashboard> & {
  reportId?: string | number
  recommendedJobs?: { score?: number }[]
  applyNowList?: { score?: number }[]
  status?: 'PENDING' | 'COMPLETED'
  createdAt?: string
}

type BackendAdvisorReport = Partial<AdvisorReport> & {
  reportType?: string
  stale?: boolean
  headline?: string
  summary?: string
  recommendedJobs?: { jobId?: string | number; title?: string; companyName?: string; score?: number; applyUrl?: string; narrative?: string }[]
  applyNowList?: { jobId?: string | number; title?: string; companyName?: string; score?: number; applyUrl?: string; narrative?: string }[]
  missingSkills?: { skillName?: string; priority?: number; reason?: string }[]
  nextActions?: { priority?: string; type?: string; description?: string; skillName?: string }[]
}

type BackendGitHubRepo = Partial<GitHubRepo> & {
  repositoryId?: string | number
  repoId?: string | number
  fullName?: string
  included?: boolean
  isTracked?: boolean
  analysisStatus?: string
  skills?: string[]
  url?: string
  htmlUrl?: string
  stargazersCount?: number
}

export function normalizeCursorPage<T>(
  page: BackendCursorPage<T>,
  normalizeItem: (item: T) => T,
): CursorPage<T> {
  const content = page.content ?? page.items ?? page.notifications ?? []
  return {
    content: content.map(normalizeItem),
    nextCursor: page.nextCursor ?? null,
    hasNext: Boolean(page.hasNext),
    totalElements: page.totalElements ?? page.totalCount ?? page.total,
    totalCount: page.totalCount ?? page.totalElements ?? page.total,
  }
}

export function normalizeJob(job: BackendJob): JobDto {
  const company =
    typeof job.company === 'object'
      ? job.company?.name
      : job.company ?? job.companyName

  return {
    ...job,
    jobId: job.jobId ?? '',
    title: job.title ?? '',
    company: company ?? '',
    description: job.description ?? '',
    roleCategory: job.roleCategory ?? '',
    remoteType: job.remoteType ?? 'ON_SITE',
    experienceLevel: job.experienceLevel ?? '',
    preferredCountries: job.preferredCountries ?? (job.country ? [job.country] : []),
    applyUrl: job.applyUrl ?? '',
    isSaved: job.isSaved ?? false,
    postedAt: job.postedAt ?? '',
  }
}

export function normalizeMatch(match: BackendMatch): MatchDto {
  const breakdown = match.scoreBreakdown ?? {}
  const totalScore = match.totalScore ?? match.score ?? breakdown.total ?? 0
  const job = match.job
    ? normalizeJob(match.job as BackendJob)
    : normalizeJob({
        jobId: match.jobId,
        title: match.jobTitle,
        companyName: match.companyName,
      })

  return {
    ...match,
    matchId: match.matchId ?? '',
    job,
    totalScore,
    skillScore: match.skillScore ?? breakdown.skillScore ?? 0,
    evidenceScore: match.evidenceScore ?? breakdown.evidenceScore ?? 0,
    roleScore: match.roleScore ?? breakdown.roleScore ?? 0,
    preferenceScore: match.preferenceScore ?? breakdown.preferenceScore ?? 0,
    freshnessScore: match.freshnessScore ?? breakdown.freshnessScore ?? 0,
    isHidden: match.isHidden ?? false,
  }
}

export function normalizeNotification(notification: BackendNotification): NotificationDto {
  const metadata = notification.metadata ?? {}
  const targetUrl =
    notification.targetUrl ?? metadata.targetUrl ?? metadata.url ?? metadata.path ?? null

  return {
    ...notification,
    notificationId: notification.notificationId ?? '',
    type: notification.type ?? 'SYSTEM',
    message: notification.message ?? '',
    isRead: notification.isRead ?? notification.read ?? false,
    targetUrl,
    createdAt: notification.createdAt ?? new Date().toISOString(),
  }
}

export function normalizeResume(resume: BackendResume): ResumeDto {
  return {
    ...resume,
    resumeId: resume.resumeId ?? '',
    fileName: resume.fileName ?? '',
    uploadedAt: resume.uploadedAt ?? resume.createdAt ?? resume.updatedAt ?? '',
    isActive: resume.isActive ?? resume.active ?? false,
    status: (resume.status as ResumeDto['status']) ?? undefined,
  }
}

export function normalizeResumeAnalysis(analysis: BackendResumeAnalysis): ResumeAnalysis {
  const skills = analysis.skills ?? []
  const experienceCount = analysis.workExperiences?.length ?? 0
  const projectCount = analysis.projects?.length ?? 0

  return {
    ...analysis,
    resumeId: analysis.resumeId ?? '',
    summary:
      analysis.summary ??
      `스킬 ${skills.length}개, 경력 ${experienceCount}개, 프로젝트 ${projectCount}개가 분석되었습니다.`,
    strengths: analysis.strengths ?? skills,
    weaknesses: analysis.weaknesses ?? [],
    suggestions: analysis.suggestions ?? analysis.warnings ?? [],
  }
}

export function normalizeResumeLayoutReview(review: BackendResumeLayoutReview): ResumeLayoutReview {
  const ratingScore: Record<string, number> = {
    EXCELLENT: 95,
    GOOD: 82,
    FAIR: 68,
    POOR: 45,
  }
  return {
    ...review,
    resumeId: review.resumeId ?? '',
    score: review.score ?? ratingScore[review.overallRating ?? ''] ?? (review.atsCompatible ? 82 : 60),
    feedback: review.feedback ?? [...(review.strengths ?? []), ...(review.improvements ?? [])],
  }
}

export function normalizeCandidateGraph(graph: BackendCandidateGraph): CandidateGraph {
  const skills = graph.skills ?? []
  const avgConfidence = skills.length
    ? Math.round(skills.reduce((sum, skill) => sum + (skill.confidence ?? 0), 0) / skills.length)
    : 0
  const strongCount = skills.filter((skill) => skill.strength === 'STRONG').length
  const evidenceScore = skills.length ? Math.round((strongCount / skills.length) * 100) : avgConfidence

  return {
    ...graph,
    skillScore: graph.skillScore ?? avgConfidence,
    evidenceScore: graph.evidenceScore ?? evidenceScore,
    roleScore: graph.roleScore ?? avgConfidence,
    preferenceScore: graph.preferenceScore ?? 0,
    freshnessScore: graph.freshnessScore ?? avgConfidence,
    totalScore: graph.totalScore ?? avgConfidence,
  }
}

export function normalizeCandidatePreferences(prefs: BackendCandidatePreferences): CandidatePreferences {
  return {
    preferredRoles: prefs.preferredRoles ?? prefs.roleCategories ?? [],
    preferredCountries: prefs.preferredCountries ?? prefs.countries ?? [],
    remoteTypes: prefs.remoteTypes ?? (prefs.remoteType ? [prefs.remoteType] : []),
    employmentTypes: prefs.employmentTypes ?? [],
    relocationPossible: prefs.relocationPossible ?? false,
  }
}

export function toBackendCandidatePreferences(body: Partial<CandidatePreferences>) {
  return {
    countries: body.preferredCountries,
    roleCategories: body.preferredRoles,
    remoteTypes: body.remoteTypes,
    employmentTypes: body.employmentTypes,
    relocationPossible: body.relocationPossible,
  }
}

export function normalizeAdvisorReport(report: BackendAdvisorReport): AdvisorReport {
  return {
    ...report,
    reportId: report.reportId ?? '',
    status: report.status ?? 'PENDING',
    reportType: report.reportType as AdvisorReport['reportType'],
    headline: report.headline ?? undefined,
    summary: report.summary ?? undefined,
    recommendedJobs: report.recommendedJobs?.map((j) => ({
      jobId: j.jobId ?? '',
      title: j.title ?? '',
      companyName: j.companyName ?? '',
      score: j.score ?? 0,
      applyUrl: j.applyUrl ?? '',
      narrative: j.narrative ?? '',
    })),
    applyNowList: report.applyNowList?.map((j) => ({
      jobId: j.jobId ?? '',
      title: j.title ?? '',
      companyName: j.companyName ?? '',
      score: j.score ?? 0,
      applyUrl: j.applyUrl ?? '',
      narrative: j.narrative ?? '',
    })),
    missingSkills: report.missingSkills?.map((s) => ({
      skillName: s.skillName ?? '',
      priority: s.priority ?? 0,
      reason: s.reason ?? '',
    })),
    nextActions: report.nextActions?.map((a) => ({
      priority: a.priority ?? '',
      type: a.type ?? '',
      description: a.description ?? '',
      skillName: a.skillName,
    })),
    content: report.content ?? report.summary ?? null,
    createdAt: report.createdAt ?? new Date().toISOString(),
    completedAt: report.completedAt ?? null,
  }
}

export function normalizeGitHubRepo(repo: BackendGitHubRepo): GitHubRepo {
  return {
    ...repo,
    repoId: repo.repoId ?? repo.repositoryId ?? '',
    name: repo.name ?? '',
    fullName: repo.fullName ?? repo.name,
    language: repo.language ?? null,
    stars: repo.stars ?? repo.stargazersCount ?? 0,
    description: repo.description ?? null,
    url: repo.url ?? repo.htmlUrl ?? '',
    included: repo.included ?? repo.isTracked ?? true,
    analysisStatus: repo.analysisStatus,
    skills: repo.skills ?? [],
  }
}

export function normalizeAdvisorDashboard(dashboard: BackendAdvisorDashboard): AdvisorDashboard {
  const jobs = [...(dashboard.recommendedJobs ?? []), ...(dashboard.applyNowList ?? [])]
  const scores = jobs.map((job) => job.score ?? 0)
  const topMatchScore = scores.length ? Math.max(...scores) : 0
  const avgMatchScore = scores.length
    ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    : 0

  return {
    ...dashboard,
    totalMatches: dashboard.totalMatches ?? jobs.length,
    topMatchScore: dashboard.topMatchScore ?? topMatchScore,
    avgMatchScore: dashboard.avgMatchScore ?? avgMatchScore,
    topMatchJob: dashboard.topMatchJob ?? null,
    recentReport: dashboard.recentReport ?? normalizeAdvisorReport({
      reportId: dashboard.reportId,
      status: dashboard.status,
      createdAt: dashboard.createdAt,
    }),
  }
}
