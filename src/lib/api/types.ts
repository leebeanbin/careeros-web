// Shared API response types for careeros-web

export interface CursorPage<T> {
  content: T[]
  nextCursor: string | null
  hasNext: boolean
  totalElements?: number
  totalCount?: number
}

// --- Jobs ---
export interface JobDto {
  jobId: string | number
  title: string
  company: string
  description: string
  roleCategory: string
  remoteType: 'REMOTE' | 'HYBRID' | 'ON_SITE'
  experienceLevel: string
  preferredCountries: string[]
  applyUrl: string
  isSaved: boolean
  postedAt: string
}

export interface JobSearchParams {
  keyword?: string
  roleCategory?: string
  remoteType?: string
  employmentType?: string
  experienceLevel?: string
  country?: string
  sort?: 'LATEST' | 'SCORE'
  cursor?: string
  size?: number
}

// --- Matches ---
export interface MatchDto {
  matchId: string | number
  job: JobDto
  totalScore: number
  skillScore: number
  evidenceScore: number
  roleScore: number
  preferenceScore: number
  freshnessScore: number
  isHidden: boolean
  status?: string
  stale?: boolean
  explanation?: MatchExplanation | null
}

export interface MatchExplanation {
  summary: string
  matchedSkills: string[]
  missingSkills: string[]
  preferenceMismatches: string[]
  generatedBy: string
}

// --- Resume ---
export type ResumeStatus = 'UPLOADED' | 'ANALYZING' | 'ANALYZED' | 'FAILED'

export interface ResumeDto {
  resumeId: string | number
  fileName: string
  uploadedAt: string
  isActive: boolean
  status?: ResumeStatus
}

export interface ResumeAnalysis {
  resumeId: string | number
  summary: string
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
}

export interface ResumeLayoutReview {
  resumeId: string | number
  score: number
  feedback: string[]
}

// --- GitHub ---
export interface GitHubProfile {
  username: string
  avatarUrl: string
  bio: string | null
  publicRepos: number
  followers: number
  following: number
  connectedAt: string
}

export interface GitHubRepo {
  repoId: string | number
  name: string
  fullName?: string
  language: string | null
  stars: number
  description: string | null
  url: string
  included: boolean
  analysisStatus?: string
  skills?: string[]
}

export interface SyncStatus {
  syncId: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  analyzedCount?: number
  skippedCount?: number
  failedCount?: number
  excludedCount?: number
  startedAt: string
  completedAt: string | null
}

// --- Candidate ---
export interface CandidateGraph {
  skillScore: number
  evidenceScore: number
  roleScore: number
  preferenceScore: number
  freshnessScore: number
  totalScore: number
}

export interface CandidatePreferences {
  preferredRoles: string[]
  preferredCountries: string[]
  remoteTypes: string[]
  employmentTypes: string[]
  relocationPossible: boolean
}

// --- Advisor ---
export type ReportType = 'FULL' | 'MATCHING' | 'RESUME' | 'INTERVIEW' | 'ROADMAP'

export interface AdvisorRecommendedJob {
  jobId: string | number
  title: string
  companyName: string
  score: number
  applyUrl: string
  narrative: string
}

export interface AdvisorMissingSkill {
  skillName: string
  priority: number
  reason: string
}

export interface AdvisorNextAction {
  priority: string
  type: string
  description: string
  skillName?: string
}

export interface AdvisorDashboard {
  // Backend actual fields
  reportId?: string | number
  headline?: string
  summary?: string
  recommendedJobs?: AdvisorRecommendedJob[]
  applyNowList?: AdvisorRecommendedJob[]
  missingSkills?: AdvisorMissingSkill[]
  nextActions?: AdvisorNextAction[]
  reportType?: ReportType
  status?: 'PENDING' | 'COMPLETED'
  stale?: boolean
  // Computed/normalized fields
  totalMatches: number
  topMatchScore: number
  avgMatchScore: number
  topMatchJob: JobDto | null
  recentReport: AdvisorReport | null
}

export interface AdvisorReport {
  reportId: string | number
  status: 'PENDING' | 'COMPLETED'
  reportType?: ReportType
  headline?: string
  summary?: string
  recommendedJobs?: AdvisorRecommendedJob[]
  applyNowList?: AdvisorRecommendedJob[]
  missingSkills?: AdvisorMissingSkill[]
  nextActions?: AdvisorNextAction[]
  // Legacy fallback
  content: string | null
  createdAt: string
  completedAt: string | null
}

// --- Notifications ---
export interface NotificationDto {
  notificationId: string | number
  type: 'MATCH' | 'RESUME' | 'GITHUB' | 'ADVISOR' | 'SYSTEM'
  message: string
  isRead: boolean
  targetUrl: string | null
  createdAt: string
}

// --- Users ---
export interface UserDto {
  userId: number
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  status: 'ACTIVE' | 'SUSPENDED'
  profileImageUrl?: string | null
  createdAt?: string
}

export interface UpdateUserDto {
  name?: string
  profileImageUrl?: string
}

// --- Admin ---
export interface AdminJobDto extends JobDto {
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT'
  viewCount: number
  applyCount: number
}

export interface AiCallDto {
  callId: number
  useCase: string
  success: boolean
  latencyMs: number
  errorMessage: string | null
  createdAt: string
}

export interface AiCallStats {
  totalCalls: number
  successRate: number
  avgLatencyMs: number
}

// --- Taxonomy ---
export interface RoleCategory {
  code: string
  label: string
}
