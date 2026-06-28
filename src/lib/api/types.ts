// Shared API response types for careeros-web

export interface CursorPage<T> {
  content: T[]
  nextCursor: string | null
  hasNext: boolean
}

// --- Jobs ---
export interface JobDto {
  jobId: number
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
  experienceLevel?: string
  country?: string
  sort?: 'LATEST' | 'SCORE'
  cursor?: string
  size?: number
}

// --- Matches ---
export interface MatchDto {
  matchId: number
  job: JobDto
  totalScore: number
  skillScore: number
  evidenceScore: number
  roleScore: number
  preferenceScore: number
  freshnessScore: number
  isHidden: boolean
}

// --- Resume ---
export interface ResumeDto {
  resumeId: number
  fileName: string
  uploadedAt: string
  isActive: boolean
}

export interface ResumeAnalysis {
  resumeId: number
  summary: string
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
}

export interface ResumeLayoutReview {
  resumeId: number
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
  repoId: number
  name: string
  language: string | null
  stars: number
  description: string | null
  url: string
  isTracked: boolean
}

export interface SyncStatus {
  syncId: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
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
  remoteType: 'REMOTE' | 'HYBRID' | 'ON_SITE' | null
  relocationPossible: boolean
}

// --- Advisor ---
export interface AdvisorDashboard {
  totalMatches: number
  topMatchScore: number
  avgMatchScore: number
  topMatchJob: JobDto | null
  recentReport: AdvisorReport | null
}

export interface AdvisorReport {
  reportId: number
  status: 'PENDING' | 'COMPLETED'
  content: string | null
  createdAt: string
  completedAt: string | null
}

// --- Notifications ---
export interface NotificationDto {
  notificationId: number
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
}

export interface UpdateUserDto {
  name?: string
  email?: string
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
