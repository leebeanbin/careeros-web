import { LogoWordmark } from "@/components/brand/Logo";
import { MarketingButton, MarketingContainer, MarketingHeading, MarketingSection } from "./MarketingPrimitives";
import type { CSSProperties } from "react";

const matchItems = [
  { title: "백엔드 방향성 정리", context: "관심 역할", score: 92, color: "#E9EDF5", active: false },
  { title: "풀스택 전환 준비", context: "목표 역할", score: 87, color: "#E9EDF5", active: true },
  { title: "이력서 보완 과제", context: "다음 행동", score: 74, color: "#AEB7C6", active: false },
  { title: "면접 준비 루틴", context: "지원 전 점검", score: 68, color: "#AEB7C6", active: false },
];

const scoreAxes = [
  { label: "기술 스택", score: 91 },
  { label: "경력 매칭", score: 88 },
  { label: "포지션 적합도", score: 85 },
  { label: "선호도", score: 82 },
  { label: "최신성", score: 78 },
];

const sidebarItems = ["대시보드", "관심 역할", "나의 흐름", "이력서", "GitHub", "COS 어드바이저"];

const heroStats = [
  { label: "정리된 단서", value: "42" },
  { label: "다음 행동", value: "6" },
  { label: "오늘의 초점", value: "1" },
];

const activityFeed = [
  { label: "이력서 단서", value: "정리됨" },
  { label: "GitHub 신호", value: "보강 필요" },
  { label: "어시스턴트 메모", value: "준비됨" },
];

const flowSteps = [
  { label: "읽기", detail: "이력서·GitHub" },
  { label: "정리", detail: "역할·근거" },
  { label: "제안", detail: "다음 행동" },
];

function flowDelay(index: number): CSSProperties {
  return { "--cos-delay": `${index * 1.1}s` } as CSSProperties;
}

export default function HeroSection() {
  return (
    <MarketingSection className="relative overflow-hidden pt-[132px] lg:pt-[180px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage: "linear-gradient(180deg, rgba(122,151,214,0.08), transparent 34%), linear-gradient(115deg, rgba(255,255,255,0.05), transparent 28%, rgba(255,255,255,0.025) 54%, transparent 76%)",
          maskImage: "linear-gradient(to bottom, black 0%, black 58%, transparent 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-[72px] h-px bg-[linear-gradient(90deg,transparent,rgba(122,151,214,0.42),transparent)]"
      />
      <MarketingContainer className="relative">
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <MarketingHeading size="hero" className="max-w-[860px]">
            내 커리어를 함께 정리하는<br />COS 어시스턴트
          </MarketingHeading>
          <MarketingButton href="#features" tone="text" className="mt-1 shrink-0 gap-2 text-[15px] text-[#D0D6E0] lg:mt-3">
            <span className="font-[510]">Today</span>
            <span className="text-[#8A8F98]">·</span>
            <span>커리어 점검하기 →</span>
          </MarketingButton>
        </div>
        <p className="text-base font-normal leading-6 text-[#8A8F98] mb-12">
          이력서와 GitHub, 관심 역할을 한곳에 모아 지금 필요한 다음 행동을 차분히 제안합니다.
        </p>

        <div className="mb-8 grid max-w-[760px] grid-cols-3 border-y border-[rgba(255,255,255,0.08)]">
          {heroStats.map((stat) => (
            <div key={stat.label} className="border-r border-[rgba(255,255,255,0.08)] px-4 py-3 first:pl-0 last:border-r-0">
              <div className="text-[11px] font-[500] uppercase tracking-[0.08em] text-[#8A8F98]">{stat.label}</div>
              <div className="mt-1 text-[18px] font-[510] text-[#F7F8F8]">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* App mockup */}
        <div className="overflow-x-auto">
        <div className="cos-demo-stage relative flex min-h-[520px] min-w-[820px] overflow-hidden rounded-t-xl border border-b-0 border-[rgba(255,255,255,0.1)] bg-[#0F1011] shadow-[0_40px_120px_rgba(0,0,0,0.5)]">
          {/* Sidebar */}
          <div className="w-[230px] shrink-0 border-r border-[rgba(255,255,255,0.06)]
                          flex flex-col px-2 py-3">
            <div className="px-2 py-1 mb-3 text-[13px] font-[510] text-[#F7F8F8]">
              <LogoWordmark size={16} textClassName="text-[13px] font-[510] text-[#F7F8F8]" />
            </div>
            {sidebarItems.map((item, i) => (
              <div key={item}
                   className={`flex h-7 items-center gap-2 rounded-md px-2 text-[13px]
                     ${i === 2
                       ? "cos-nav-pulse bg-[rgba(255,255,255,0.08)] text-[#F7F8F8] font-[510]"
                       : "text-[#8A8F98]"}`}>
                {item}
              </div>
            ))}
            <div className="mt-auto rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-3">
              <div className="mb-2 text-[10px] font-[510] uppercase tracking-[0.08em] text-[#8A8F98]">Live signals</div>
              {activityFeed.map((item, i) => (
                <div key={item.label} className="cos-signal-row flex items-center justify-between border-t border-[rgba(255,255,255,0.05)] py-1.5 first:border-t-0" style={flowDelay(i)}>
                  <span className="text-[11px] text-[#8A8F98]">{item.label}</span>
                  <span className="text-[11px] font-[510] text-[#D0D6E0]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Match list */}
          <div className="flex-1 border-r border-[rgba(255,255,255,0.06)] bg-[#0D0E0F] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[13px] font-[510] text-[#F7F8F8]">나의 흐름</div>
              <div className="text-[11px] text-[#8A8F98]">방금 정리됨</div>
            </div>
            <div className="mb-4 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.025)] p-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-[600] uppercase tracking-[0.08em] text-[#8A8F98]">COS flow</span>
                <span className="cos-demo-cursor text-[11px] font-[510] text-[#D0D6E0]">분석 중</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {flowSteps.map((step, i) => (
                  <div key={step.label} className="cos-flow-step rounded-md border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.025)] px-2 py-2" style={flowDelay(i)}>
                    <div className="mb-1 flex items-center gap-1.5">
                      <span className="cos-flow-dot h-1.5 w-1.5 rounded-full bg-[#7A97D6]" />
                      <span className="text-[11px] font-[510] text-[#F7F8F8]">{step.label}</span>
                    </div>
                    <div className="text-[10px] text-[#8A8F98]">{step.detail}</div>
                  </div>
                ))}
              </div>
            </div>
            {matchItems.map((item, i) => (
              <div key={item.context}
                   className={`cos-flow-card mb-1 grid grid-cols-[1fr_64px_54px] items-center rounded-md px-3 py-2 text-[13px]
                     ${item.active ? "border border-[rgba(122,151,214,0.22)] bg-[rgba(122,151,214,0.075)]" : "border border-transparent"}`}>
                <div>
                  <div className="text-[#F7F8F8] font-[500]">{item.title}</div>
                  <div className="text-[11px] text-[#8A8F98]">{item.context}</div>
                </div>
                <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.08)]">
                  <div className="cos-progress h-1.5 rounded-full bg-[#7A97D6]" style={{ width: `${item.score}%`, ...flowDelay(i) }} />
                </div>
                <div className="text-right text-[13px] font-[510]" style={{ color: item.color }}>
                  {item.score}%
                </div>
              </div>
            ))}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {["역할", "근거", "선호"].map((label, i) => (
                <div key={label} className="rounded-md border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-3">
                  <div className="text-[10px] uppercase tracking-[0.08em] text-[#8A8F98]">{label}</div>
                  <div className="mt-1 text-[15px] font-[510] text-[#F7F8F8]">{[91, 88, 82][i]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div className="w-[280px] shrink-0 p-4">
            <div className="text-[13px] font-[510] text-[#F7F8F8] mb-1">풀스택 전환 준비</div>
            <div className="text-[11px] text-[#8A8F98] mb-4">현재 정리도 87%</div>
            {scoreAxes.map((axis, i) => (
              <div key={axis.label} className="mb-3">
                <div className="flex justify-between text-[11px] text-[#8A8F98] mb-1">
                  <span>{axis.label}</span>
                  <span className="text-[#F7F8F8]">{axis.score}</span>
                </div>
                <div className="h-1 rounded-full bg-[rgba(255,255,255,0.08)]">
                  <div className="cos-axis-fill h-1 rounded-full bg-[#7A97D6]"
                       style={{ width: `${axis.score}%`, ...flowDelay(i) }} />
                </div>
              </div>
            ))}
            <div className="cos-insight-card mt-6 rounded-lg border border-[rgba(122,151,214,0.18)] bg-[rgba(122,151,214,0.07)] p-3">
              <div className="mb-1 text-[10px] font-[600] uppercase tracking-[0.08em] text-[#AEB7C6]">Next action</div>
              <p className="m-0 text-[12px] leading-5 text-[#E9EDF5]">성과 수치를 한 줄 더 보강하면 지원 흐름이 선명해집니다.</p>
            </div>
          </div>
        </div>
        </div>
      </MarketingContainer>
    </MarketingSection>
  );
}
