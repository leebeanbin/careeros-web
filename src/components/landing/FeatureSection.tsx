import type { ReactNode } from "react";

interface FeatureSectionProps {
  h2: string;
  description: string;
  actionNumber: string;
  actionLabel: string;
  illustration: ReactNode;
}

export function FeatureSection({
  h2,
  description,
  actionNumber,
  actionLabel,
  illustration,
}: FeatureSectionProps) {
  return (
    <section className="bg-[#08090A] py-20 px-16 border-t border-[rgba(255,255,255,0.05)]">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 gap-[80px] items-end pb-12">
          <h2
            className="text-[48px] font-[510] leading-[52px] tracking-[-0.02em]
                       text-[#F7F8F8] max-w-[520px] whitespace-pre-line"
          >
            {h2}
          </h2>
          <div>
            <p className="text-base font-normal leading-[26px] text-[#8A8F98] mb-5">
              {description}
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-[14px] font-[510] text-[#F7F8F8]
                         transition-opacity duration-[150ms] hover:opacity-70"
            >
              <span className="text-[#8A8F98]">{actionNumber}</span>
              <span>{actionLabel} →</span>
            </a>
          </div>
        </div>
        <div
          className="bg-[#0D0E0F] rounded-xl border border-[rgba(255,255,255,0.06)]
                     overflow-hidden min-h-[400px] flex items-stretch"
        >
          {illustration}
        </div>
      </div>
    </section>
  );
}

// ── Illustrations ──────────────────────────────────────────────────────────────

const matchAxes = [
  { label: "기술 스택", score: 91 },
  { label: "경력 매칭", score: 88 },
  { label: "포지션 적합도", score: 85 },
  { label: "선호도", score: 82 },
  { label: "최신성", score: 78 },
];

const matchJobs = [
  { title: "백엔드 개발자", company: "카카오", score: 92, active: false },
  { title: "풀스택 개발자", company: "토스", score: 87, active: true },
  { title: "서버 개발자", company: "네이버", score: 74, active: false },
  { title: "백엔드 엔지니어", company: "라인", score: 68, active: false },
];

function MatchIllustration() {
  return (
    <div className="flex flex-1 p-8 gap-8">
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-[13px] font-[510] text-[#F7F8F8] mb-1">풀스택 개발자 — 토스</div>
        <div className="text-[32px] font-[510] text-[#6366f1] mb-6">87점</div>
        {matchAxes.map((a) => (
          <div key={a.label} className="mb-4">
            <div className="flex justify-between text-[13px] mb-1">
              <span className="text-[#8A8F98]">{a.label}</span>
              <span className="text-[#F7F8F8] font-[510]">{a.score}</span>
            </div>
            <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.08)]">
              <div
                className="h-1.5 rounded-full bg-[#6366f1]"
                style={{ width: `${a.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="w-[1px] bg-[rgba(255,255,255,0.06)]" />
      <div className="flex-1 flex flex-col justify-center gap-2">
        {matchJobs.map((item) => (
          <div
            key={item.company}
            className={`flex items-center justify-between rounded-lg px-4 py-3 text-[13px]
              ${item.active
                ? "bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.3)]"
                : "bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]"}`}
          >
            <div>
              <div className="text-[#F7F8F8] font-[500]">{item.title}</div>
              <div className="text-[11px] text-[#8A8F98]">{item.company}</div>
            </div>
            <div
              className={`text-[15px] font-[510] ${item.score >= 80 ? "text-[#22c55e]" : "text-[#eab308]"}`}
            >
              {item.score}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Deterministic contribution grid — no Math.random(), avoids hydration mismatch
const CONTRIB_GRID = Array.from({ length: 24 }, (_, w) =>
  Array.from({ length: 7 }, (_, d) => ((w * 7 + d) * 2654435761) % 100)
);

function GitHubIllustration() {
  return (
    <div className="flex-1 p-8">
      <div className="text-[13px] font-[510] text-[#F7F8F8] mb-1">leebeanbin</div>
      <div className="text-[11px] text-[#8A8F98] mb-6">342 contributions in the last year</div>
      <div className="flex gap-1">
        {CONTRIB_GRID.map((days, w) => (
          <div key={w} className="flex flex-col gap-1">
            {days.map((val, d) => (
              <div
                key={d}
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor:
                    val > 70 ? "rgba(99,102,241,0.8)"
                    : val > 40 ? "rgba(99,102,241,0.4)"
                    : val > 20 ? "rgba(99,102,241,0.15)"
                    : "rgba(255,255,255,0.06)",
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-3 gap-3">
        {[
          { label: "총 커밋", value: "1,247" },
          { label: "주요 언어", value: "Java / TS" },
          { label: "공개 레포", value: "23" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-lg p-3"
          >
            <div className="text-[11px] text-[#8A8F98] mb-1">{stat.label}</div>
            <div className="text-[15px] font-[510] text-[#F7F8F8]">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const advisorMessages = [
  {
    role: "assistant" as const,
    text: "토스 풀스택 포지션 분석 완료했습니다. 합격 가능성 87%로 상위 매칭입니다.",
  },
  { role: "user" as const, text: "이력서에서 개선할 부분이 있을까요?" },
  {
    role: "assistant" as const,
    text: 'Spring Boot 프로젝트에 성능 지표를 추가하면 +5점 상승 예상됩니다. 예: "API 응답 시간 200ms → 80ms 개선"',
  },
];

function AdvisorIllustration() {
  return (
    <div className="flex-1 p-8 flex flex-col justify-between">
      <div className="space-y-4">
        {advisorMessages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
            {m.role === "assistant" && (
              <div className="w-6 h-6 rounded-full bg-[rgba(99,102,241,0.3)] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] text-[#6366f1]">AI</span>
              </div>
            )}
            <div
              className={`max-w-[420px] rounded-xl px-4 py-3 text-[13px] leading-[20px]
                ${m.role === "assistant"
                  ? "bg-[rgba(255,255,255,0.05)] text-[#F7F8F8]"
                  : "bg-[rgba(99,102,241,0.15)] border border-[rgba(99,102,241,0.3)] text-[#F7F8F8]"}`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-6">
        <input
          readOnly
          value="면접 준비 전략을 알려주세요"
          className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]
                     rounded-full px-4 py-2 text-[13px] text-[#8A8F98] outline-none"
        />
        <button className="w-8 h-8 rounded-full bg-[#6366f1] flex items-center justify-center shrink-0">
          <span className="text-white text-[12px]">↑</span>
        </button>
      </div>
    </div>
  );
}

const jobListings = [
  { title: "백엔드 개발자", company: "카카오", tags: ["Java", "Spring", "MySQL"], match: 92, isNew: true },
  { title: "풀스택 개발자", company: "토스", tags: ["React", "Node.js", "TypeScript"], match: 87, isNew: false },
  { title: "서버 개발자", company: "네이버", tags: ["Java", "Kubernetes", "Redis"], match: 74, isNew: false },
  { title: "백엔드 엔지니어", company: "라인", tags: ["Go", "gRPC", "PostgreSQL"], match: 68, isNew: false },
];

function JobsIllustration() {
  return (
    <div className="flex-1 p-6 space-y-2">
      {jobListings.map((job) => (
        <div
          key={job.title + job.company}
          className="flex items-center justify-between bg-[rgba(255,255,255,0.03)]
                     border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-3"
        >
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-[500] text-[#F7F8F8]">{job.title}</span>
                {job.isNew && (
                  <span className="text-[10px] bg-[rgba(99,102,241,0.2)] text-[#818cf8]
                                   border border-[rgba(99,102,241,0.3)] rounded px-1.5 py-0.5">
                    NEW
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#8A8F98]">{job.company}</div>
            </div>
            <div className="flex gap-1">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] text-[#8A8F98] bg-[rgba(255,255,255,0.06)] rounded px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className={`text-[13px] font-[510] ${job.match >= 80 ? "text-[#22c55e]" : "text-[#eab308]"}`}>
            {job.match}%
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Assembled sections export ──────────────────────────────────────────────────

export function FeatureSections() {
  return (
    <>
      <FeatureSection
        h2={"이력서 한 장으로\n수백 개의 포지션 분석"}
        description="AI가 이력서를 분석해 기술 스택, 경력, 역할 적합도를 종합 평가하고 맞춤형 매칭 점수를 제공합니다."
        actionNumber="1.0"
        actionLabel="매칭 시작"
        illustration={<MatchIllustration />}
      />
      <FeatureSection
        h2={"GitHub로\n증명하는 실력"}
        description="커밋 히스토리, 주요 프로젝트, 기여도를 AI가 분석해 채용 담당자가 이해할 수 있는 기술 프로필로 변환합니다."
        actionNumber="2.0"
        actionLabel="GitHub 연동"
        illustration={<GitHubIllustration />}
      />
      <FeatureSection
        h2={"AI 어드바이저와\n전략 수립"}
        description="매칭된 포지션별 합격 가능성을 분석하고 이력서 개선, 면접 준비, 지원 우선순위를 제안합니다."
        actionNumber="3.0"
        actionLabel="어드바이저"
        illustration={<AdvisorIllustration />}
      />
      <FeatureSection
        h2={"실시간 채용 공고\n매칭"}
        description="매일 업데이트되는 채용 공고 중 내 프로필에 맞는 것만 필터링해 보여줍니다."
        actionNumber="4.0"
        actionLabel="공고 보기"
        illustration={<JobsIllustration />}
      />
    </>
  );
}
