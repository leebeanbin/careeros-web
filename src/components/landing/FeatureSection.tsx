import type { CSSProperties, ReactNode } from "react";
import { MarketingButton, MarketingContainer, MarketingHeading, MarketingSection } from "./MarketingPrimitives";

interface FeatureSectionProps {
  h2: string;
  description: string;
  actionNumber: string;
  actionLabel: string;
  actionHref: string;
  id?: string;
  illustration: ReactNode;
}

export function FeatureSection({
  h2,
  description,
  actionNumber,
  actionLabel,
  actionHref,
  id,
  illustration,
}: FeatureSectionProps) {
  return (
    <MarketingSection id={id} bordered>
      <MarketingContainer>
        <div className="grid gap-8 pb-10 lg:grid-cols-2 lg:items-end lg:gap-[80px] lg:pb-12">
          <MarketingHeading
            className="max-w-[520px] whitespace-pre-line"
          >
            {h2}
          </MarketingHeading>
          <div>
            <p className="text-base font-normal leading-[26px] text-[#8A8F98] mb-5">
              {description}
            </p>
            <MarketingButton href={actionHref} tone="text" className="gap-2">
              <span className="text-[#8A8F98]">{actionNumber}</span>
              <span>{actionLabel} →</span>
            </MarketingButton>
          </div>
        </div>
        <div
          className="cos-scroll-demo flex min-h-[400px] items-stretch overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0D0E0F]"
        >
          {illustration}
        </div>
      </MarketingContainer>
    </MarketingSection>
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
  { title: "백엔드 방향성", context: "관심 역할", score: 92, active: false },
  { title: "풀스택 전환", context: "목표 역할", score: 87, active: true },
  { title: "이력서 보완", context: "다음 행동", score: 74, active: false },
  { title: "면접 준비", context: "지원 전 점검", score: 68, active: false },
];

function scrollDelay(index: number): CSSProperties {
  return { "--cos-delay": `${index * 90}ms` } as CSSProperties;
}

function contributionCellStyle(value: number, index: number): CSSProperties {
  return {
    "--cos-delay": `${index * 8}ms`,
    backgroundColor:
      value > 70 ? "rgba(255,255,255,0.62)"
      : value > 40 ? "rgba(255,255,255,0.22)"
      : value > 20 ? "rgba(255,255,255,0.09)"
      : "rgba(255,255,255,0.06)",
  } as CSSProperties;
}

function MatchIllustration() {
  return (
    <div className="flex flex-1 p-8 gap-8">
      <div className="cos-scroll-panel flex-1 flex flex-col justify-center">
        <div className="text-[13px] font-[510] text-[#F7F8F8] mb-1">풀스택 전환 준비</div>
        <div className="text-[32px] font-[510] text-[#E9EDF5] mb-6">87점</div>
        {matchAxes.map((a, i) => (
          <div key={a.label} className="cos-scroll-row mb-4" style={scrollDelay(i)}>
            <div className="flex justify-between text-[13px] mb-1">
              <span className="text-[#8A8F98]">{a.label}</span>
              <span className="text-[#F7F8F8] font-[510]">{a.score}</span>
            </div>
            <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.08)]">
              <div
                className="cos-scroll-fill h-1.5 rounded-full bg-[#7A97D6]"
                style={{ width: `${a.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="w-[1px] bg-[rgba(255,255,255,0.06)]" />
      <div className="cos-scroll-panel flex-1 flex flex-col justify-center gap-2">
        {matchJobs.map((item, i) => (
          <div
            key={item.context}
            className={`cos-scroll-row flex items-center justify-between rounded-lg px-4 py-3 text-[13px]
              ${item.active
                ? "bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.16)]"
                : "bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]"}`}
            style={scrollDelay(i + 2)}
          >
            <div>
              <div className="text-[#F7F8F8] font-[500]">{item.title}</div>
              <div className="text-[11px] text-[#8A8F98]">{item.context}</div>
            </div>
            <div
              className={`text-[15px] font-[510] ${item.score >= 80 ? "text-[#E9EDF5]" : "text-[#AEB7C6]"}`}
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
    <div className="cos-scroll-panel flex-1 p-8">
      <div className="text-[13px] font-[510] text-[#F7F8F8] mb-1">leebeanbin</div>
      <div className="text-[11px] text-[#8A8F98] mb-6">342 contributions in the last year</div>
      <div className="flex gap-1">
        {CONTRIB_GRID.map((days, w) => (
          <div key={w} className="flex flex-col gap-1">
            {days.map((val, d) => (
              <div
                key={d}
                className="cos-scroll-cell w-3 h-3 rounded-sm"
                style={contributionCellStyle(val, w * 7 + d)}
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
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="cos-scroll-row bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-lg p-3"
            style={scrollDelay(i + 2)}
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
    text: "풀스택 전환 방향을 정리했습니다. 현재 단서는 충분하지만 프로젝트 영향도를 더 드러내면 좋아요.",
  },
  { role: "user" as const, text: "이력서에서 개선할 부분이 있을까요?" },
  {
    role: "assistant" as const,
    text: 'Spring Boot 프로젝트에 성능 지표를 추가하면 흐름이 더 선명해집니다. 예: "API 응답 시간 200ms → 80ms 개선"',
  },
];

function AdvisorIllustration() {
  return (
    <div className="flex-1 p-8 flex flex-col justify-between">
      <div className="space-y-4">
        {advisorMessages.map((m, i) => (
          <div key={i} className={`cos-scroll-message flex gap-3 ${m.role === "user" ? "justify-end" : ""}`} style={scrollDelay(i)}>
            {m.role === "assistant" && (
              <div className="w-6 h-6 rounded-full bg-[rgba(255,255,255,0.16)] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[9px] font-[600] tracking-[-0.02em] text-[#D0D6E0]">COS</span>
              </div>
            )}
            <div
              className={`max-w-[420px] rounded-xl px-4 py-3 text-[13px] leading-[20px]
                ${m.role === "assistant"
                  ? "bg-[rgba(255,255,255,0.05)] text-[#F7F8F8]"
                  : "bg-[rgba(255,255,255,0.09)] border border-[rgba(255,255,255,0.16)] text-[#F7F8F8]"}`}
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
        <div aria-hidden="true" className="w-8 h-8 rounded-full bg-[#E5E5E6] flex items-center justify-center shrink-0">
          <span className="text-[#08090A] text-[12px]">↑</span>
        </div>
      </div>
    </div>
  );
}

const jobListings = [
  { title: "백엔드 역할 탐색", context: "관심 역할", tags: ["Java", "Spring", "MySQL"], match: 92, isNew: true },
  { title: "풀스택 전환 점검", context: "목표 역할", tags: ["React", "Node.js", "TypeScript"], match: 87, isNew: false },
  { title: "인프라 경험 정리", context: "보완 영역", tags: ["Java", "Kubernetes", "Redis"], match: 74, isNew: false },
  { title: "프로젝트 설명 개선", context: "다음 행동", tags: ["Go", "gRPC", "PostgreSQL"], match: 68, isNew: false },
];

function JobsIllustration() {
  return (
    <div className="flex-1 p-6 space-y-2">
      {jobListings.map((job, i) => (
        <div
          key={job.title + job.context}
          className="cos-scroll-row flex items-center justify-between bg-[rgba(255,255,255,0.03)]
                     border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-3"
          style={scrollDelay(i)}
        >
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-[500] text-[#F7F8F8]">{job.title}</span>
                {job.isNew && (
                  <span className="text-[10px] bg-[rgba(255,255,255,0.12)] text-[#d5d7db]
                                   border border-[rgba(255,255,255,0.16)] rounded px-1.5 py-0.5">
                    NEW
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#8A8F98]">{job.context}</div>
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
          <div className={`text-[13px] font-[510] ${job.match >= 80 ? "text-[#E9EDF5]" : "text-[#AEB7C6]"}`}>
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
        h2={"이력서 한 장에서\n커리어 단서 정리"}
        description="COS가 이력서의 기술 스택, 경험, 역할 방향을 함께 읽고 지금 어디를 보완하면 좋을지 정리합니다."
        actionNumber="1.0"
        actionLabel="정리 시작"
        actionHref="/signup"
        id="matching"
        illustration={<MatchIllustration />}
      />
      <FeatureSection
        h2={"GitHub에서\n작업 흔적 읽기"}
        description="커밋 히스토리와 주요 프로젝트를 살펴보고 이력서에 아직 담기지 않은 강점을 찾아냅니다."
        actionNumber="2.0"
        actionLabel="GitHub 연동"
        actionHref="/signup"
        illustration={<GitHubIllustration />}
      />
      <FeatureSection
        h2={"COS 어드바이저와\n전략 수립"}
        description="커리어 방향, 이력서 개선, 면접 준비처럼 막히기 쉬운 다음 행동을 대화하듯 제안합니다."
        actionNumber="3.0"
        actionLabel="어드바이저"
        actionHref="/signup"
        illustration={<AdvisorIllustration />}
      />
      <FeatureSection
        h2={"관심 역할과\n다음 행동 연결"}
        description="관심 있는 역할을 기준으로 프로필을 점검하고 무리 없는 지원 준비 흐름을 만들어줍니다."
        actionNumber="4.0"
        actionLabel="흐름 보기"
        actionHref="/jobs"
        illustration={<JobsIllustration />}
      />
    </>
  );
}
