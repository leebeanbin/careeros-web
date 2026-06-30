"use client";

import { useEffect, useRef, useState } from "react";
import { MarketingContainer, MarketingHeading, MarketingSection } from "./MarketingPrimitives";

type StageId = "resume" | "signals" | "matches" | "action";

interface FlowStage {
  id: StageId;
  navLabel: string;
  kicker: string;
  title: string;
  body: string;
  metric: string;
  metricLabel: string;
}

const flowStages: FlowStage[] = [
  {
    id: "resume",
    navLabel: "이력서 읽기",
    kicker: "01 / 이력서 읽기",
    title: "이력서를 열면 COS가 먼저 구조를 읽습니다.",
    body: "헤더, 요약문, 경험, 성과 수치, 기술 스택을 분리해서 어느 문장이 지원 직무와 연결되는지 바로 보여줍니다.",
    metric: "6",
    metricLabel: "개선 지점 감지",
  },
  {
    id: "signals",
    navLabel: "단서 정리",
    kicker: "02 / 단서 정리",
    title: "흩어진 단서를 하나의 경력 신호로 묶습니다.",
    body: "GitHub, 프로젝트 설명, 선호 직무를 함께 보면서 강점, 공백, 위험 신호를 한 화면에서 정리합니다.",
    metric: "84%",
    metricLabel: "역할 적합 신호",
  },
  {
    id: "matches",
    navLabel: "공고 비교",
    kicker: "03 / 공고 비교",
    title: "공고는 점수가 아니라 이유와 함께 넘어갑니다.",
    body: "기술 매칭, 경력 방향, 선호 조건을 비교해 왜 추천되는지, 무엇을 보완해야 하는지 즉시 확인합니다.",
    metric: "12",
    metricLabel: "우선 검토 포지션",
  },
  {
    id: "action",
    navLabel: "다음 행동",
    kicker: "04 / 다음 행동",
    title: "마지막에는 오늘 할 일을 아주 구체적으로 남깁니다.",
    body: "분석 결과를 다시 카드로 늘리는 대신, 이력서 수정, 지원 준비, 면접 질문 생성으로 이어지는 작업 흐름을 만듭니다.",
    metric: "3",
    metricLabel: "다음 액션",
  },
];

export default function ProductFlowShowcase() {
  const [activeStage, setActiveStage] = useState(0);
  const activeStageRef = useRef(0);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    let frame = 0;

    const updateActiveStage = () => {
      const forwardAnchor = window.innerHeight * 0.34;
      const backwardAnchor = window.innerHeight * 0.68;
      let nextStage = activeStageRef.current;

      while (nextStage < flowStages.length - 1) {
        const nextNode = stepRefs.current[nextStage + 1];
        if (!nextNode || nextNode.getBoundingClientRect().top > forwardAnchor) break;
        nextStage += 1;
      }

      while (nextStage > 0) {
        const currentNode = stepRefs.current[nextStage];
        if (!currentNode || currentNode.getBoundingClientRect().top <= backwardAnchor) break;
        nextStage -= 1;
      }

      if (nextStage !== activeStageRef.current) {
        activeStageRef.current = nextStage;
        setActiveStage(nextStage);
      }
    };

    const scheduleUpdate = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveStage);
    };

    updateActiveStage();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  const stage = flowStages[activeStage];

  return (
    <MarketingSection id="product-flow" bordered className="overflow-visible py-0 lg:py-0">
      <MarketingContainer>
        <div className="grid gap-10 py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(620px,1.1fr)] lg:gap-12 lg:py-24">
          <div className="lg:py-[34vh]">
            <div className="mb-10 max-w-[560px]">
              <MarketingHeading className="max-w-[560px]">
                CareerOS는 이 순서로 커리어를 정리합니다.
              </MarketingHeading>
              <p className="mt-5 text-[16px] leading-[27px] text-[#8A8F98]">
                첫 화면에서 약속만 말하는 대신, 실제 제품 안에서 어떤 일이 일어나는지 바로 보여줍니다.
                이력서를 읽고, 단서를 묶고, 공고를 비교한 뒤 오늘 할 일로 좁혀지는 흐름입니다.
              </p>
            </div>

            <div className="space-y-6">
              {flowStages.map((item, index) => (
                <div
                  key={item.id}
                  ref={(node) => {
                    stepRefs.current[index] = node;
                  }}
                  data-stage-index={index}
                  data-active={activeStage === index}
                  className="cos-tour-step rounded-xl border border-[rgba(255,255,255,0.06)] px-5 py-5"
                >
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <span className="text-[12px] font-[520] uppercase tracking-[0.12em] text-[#8A8F98]">
                      {item.kicker}
                    </span>
                    <span className="cos-tour-dot" />
                  </div>
                  <h3 className="text-[22px] font-[520] leading-[29px] tracking-[-0.01em] text-[#F7F8F8]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[23px] text-[#8A8F98]">{item.body}</p>
                  <div className="mt-5 flex items-end gap-2">
                    <span className="text-[34px] font-[520] leading-none text-[#E9EDF5]">{item.metric}</span>
                    <span className="pb-1 text-[12px] text-[#8A8F98]">{item.metricLabel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-[88px] lg:flex lg:h-[calc(100vh-112px)] lg:items-center">
            <ProductScreen stage={stage} />
          </div>
        </div>
      </MarketingContainer>
    </MarketingSection>
  );
}

function ProductScreen({ stage }: { stage: FlowStage }) {
  return (
    <div className="cos-tour-screen w-full overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[#0C0D0E] shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
      <div className="flex h-11 items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#4B4D50]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#686B70]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#AEB7C6]" />
        </div>
        <div className="rounded-full border border-[rgba(255,255,255,0.08)] px-3 py-1 text-[11px] text-[#8A8F98]">
          CareerOS / {stage.id}
        </div>
      </div>

      <div className="cos-tour-body grid min-h-[520px] grid-cols-[138px_minmax(0,1fr)] max-md:grid-cols-1">
        <aside className="border-r border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.018)] p-4 max-md:hidden">
          <div className="mb-7 flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] text-[11px] font-[650] text-[#E9EDF5]">
              COS
            </div>
            <div className="text-[12px] font-[520] text-[#F7F8F8]">CareerOS</div>
          </div>
          {flowStages.map((item) => (
            <div
              key={item.id}
              data-active={stage.id === item.id}
              className="cos-tour-nav mb-2 rounded-lg px-3 py-2 text-[12px] text-[#8A8F98]"
            >
              {item.navLabel}
            </div>
          ))}
        </aside>

        <main className="p-5 sm:p-7">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-[12px] font-[520] uppercase tracking-[0.12em] text-[#8A8F98]">
                {stage.kicker}
              </div>
              <h3 className="mt-2 max-w-[560px] text-[28px] font-[520] leading-[34px] tracking-[-0.02em] text-[#F7F8F8]">
                {stage.title}
              </h3>
            </div>
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.035)] px-4 py-3 text-right">
              <div className="text-[25px] font-[520] leading-none text-[#E9EDF5]">{stage.metric}</div>
              <div className="mt-1 text-[11px] text-[#8A8F98]">{stage.metricLabel}</div>
            </div>
          </div>

          <div key={stage.id} className="cos-tour-pane">
            {stage.id === "resume" && <ResumePane />}
            {stage.id === "signals" && <SignalPane />}
            {stage.id === "matches" && <MatchPane />}
            {stage.id === "action" && <ActionPane />}
          </div>
        </main>
      </div>
    </div>
  );
}

function ResumePane() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.82fr]">
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#111214] p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-[15px] font-[520] text-[#F7F8F8]">resume.pdf</div>
            <div className="text-[12px] text-[#8A8F98]">요약문과 경험 섹션 분석 중</div>
          </div>
          <div className="rounded-full bg-[rgba(122,151,214,0.14)] px-3 py-1 text-[12px] text-[#D0D6E0]">
            Live scan
          </div>
        </div>
        {["헤더", "요약문", "경험 항목", "성과 수치", "기술 스택"].map((label, index) => (
          <div key={label} className="cos-tour-row mb-3 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.025)] p-3" style={{ "--cos-delay": `${index * 70}ms` } as React.CSSProperties}>
            <div className="mb-2 flex justify-between text-[12px]">
              <span className="text-[#D0D6E0]">{label}</span>
              <span className="text-[#8A8F98]">{index === 3 ? "보강 필요" : "감지 완료"}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(255,255,255,0.07)]">
              <div className="cos-tour-fill h-full rounded-full bg-[#AEB7C6]" style={{ width: `${index === 3 ? 54 : 78 + index * 3}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
        <div className="mb-4 text-[13px] font-[520] text-[#F7F8F8]">AI 판단</div>
        <div className="space-y-3 text-[13px] leading-[20px] text-[#AEB7C6]">
          <p>프로젝트 성과가 기술명 중심으로 적혀 있어 영향도가 약하게 보입니다.</p>
          <p>경험 항목 2개에 수치형 결과를 붙이면 백엔드 역할 매칭 근거가 더 강해집니다.</p>
        </div>
      </div>
    </div>
  );
}

function SignalPane() {
  const rows = [
    ["Spring Boot", "주요 경험", "강함"],
    ["React / Next.js", "전환 가능성", "보통"],
    ["운영 지표", "성과 증거", "부족"],
    ["원격 선호", "조건 일치", "높음"],
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#111214] p-5">
        <div className="text-[13px] font-[520] text-[#F7F8F8]">Career signal map</div>
        <div className="mt-6 space-y-5">
          {rows.map(([label, context, status], index) => (
            <div key={label} className="cos-tour-row flex items-center gap-4" style={{ "--cos-delay": `${index * 90}ms` } as React.CSSProperties}>
              <div className="h-2.5 w-2.5 rounded-full bg-[#AEB7C6]" />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-3 text-[13px]">
                  <span className="font-[520] text-[#F7F8F8]">{label}</span>
                  <span className="text-[#8A8F98]">{status}</span>
                </div>
                <div className="mt-1 text-[12px] text-[#8A8F98]">{context}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
        <div className="mb-4 text-[13px] font-[520] text-[#F7F8F8]">위험 신호</div>
        <div className="cos-tour-row rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.035)] p-4 text-[13px] leading-[20px] text-[#AEB7C6]">
          프론트엔드 전환 의지는 보이지만, 최근 프로젝트에서 UI 의사결정 근거가 부족합니다.
        </div>
        <div className="cos-tour-row mt-3 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.035)] p-4 text-[13px] leading-[20px] text-[#AEB7C6]" style={{ "--cos-delay": "100ms" } as React.CSSProperties}>
          성능 개선, 장애 대응, 사용자 영향 같은 증거를 한 문장씩 추가하세요.
        </div>
      </div>
    </div>
  );
}

function MatchPane() {
  const matches = [
    ["Product Engineer", "역할 전환 적합", "91"],
    ["Backend Platform", "경험 밀도 높음", "86"],
    ["AI Tools Engineer", "포트폴리오 보강 필요", "79"],
  ];

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#111214] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[13px] font-[520] text-[#F7F8F8]">추천 포지션</div>
        <div className="text-[12px] text-[#8A8F98]">조건, 기술, 방향성 비교</div>
      </div>
      <div className="space-y-3">
        {matches.map(([role, reason, score], index) => (
          <div key={role} className="cos-tour-row grid grid-cols-[1fr_auto] gap-4 rounded-lg border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.028)] p-4" style={{ "--cos-delay": `${index * 85}ms` } as React.CSSProperties}>
            <div>
              <div className="text-[15px] font-[520] text-[#F7F8F8]">{role}</div>
              <div className="mt-1 text-[12px] text-[#8A8F98]">{reason}</div>
            </div>
            <div className="text-right">
              <div className="text-[22px] font-[520] text-[#E9EDF5]">{score}</div>
              <div className="text-[11px] text-[#8A8F98]">match</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionPane() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#111214] p-5">
        <div className="mb-4 text-[13px] font-[520] text-[#F7F8F8]">오늘의 액션</div>
        {[
          "요약문 첫 문장을 지원 직무 기준으로 다시 작성",
          "프로젝트 성과에 수치형 결과 2개 추가",
          "Product Engineer 공고 3개 비교 후 저장",
        ].map((item, index) => (
          <div key={item} className="cos-tour-row mb-3 flex gap-3 rounded-lg border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.028)] p-3" style={{ "--cos-delay": `${index * 80}ms` } as React.CSSProperties}>
            <span className="mt-1 h-4 w-4 rounded-full border border-[#AEB7C6]" />
            <span className="text-[13px] leading-[20px] text-[#D0D6E0]">{item}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-[rgba(255,255,255,0.08)] text-[9px] font-[650] text-[#E9EDF5]">
            COS
          </div>
          <div className="text-[13px] font-[520] text-[#F7F8F8]">Advisor</div>
        </div>
        <div className="cos-tour-row rounded-xl bg-[rgba(255,255,255,0.055)] px-4 py-3 text-[13px] leading-[20px] text-[#D0D6E0]">
          지금은 리포트를 새로 쌓기보다, 분석 결과를 실제 수정 작업으로 이어가는 것이 더 좋습니다.
        </div>
      </div>
    </div>
  );
}
