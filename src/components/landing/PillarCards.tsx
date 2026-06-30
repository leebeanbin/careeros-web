import { MarketingContainer, MarketingHeading, MarketingSection } from "./MarketingPrimitives";

const values = [
  {
    title: "강점과 빈칸을 분리",
    desc: "이력서 안의 기술명, 경험, 성과 문장을 분리해서 지금 말할 수 있는 강점과 아직 보강해야 할 빈칸을 구분합니다.",
  },
  {
    title: "활동을 근거로 변환",
    desc: "GitHub와 프로젝트 흔적을 단순 기록이 아니라 지원서와 면접에서 설명할 수 있는 경험 근거로 바꿉니다.",
  },
  {
    title: "오늘 할 일을 하나로 좁힘",
    desc: "분석 결과를 카드로 쌓아두지 않고, 이력서 수정이나 공고 검토처럼 바로 실행할 수 있는 다음 행동으로 좁힙니다.",
  },
];

export default function PillarCards() {
  return (
    <MarketingSection id="features" bordered className="lg:py-24">
      <MarketingContainer>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <MarketingHeading className="max-w-[720px]">
            흩어진 재료를 판단 가능한 신호로 바꿉니다.
          </MarketingHeading>

          <div className="divide-y divide-[rgba(255,255,255,0.07)] border-y border-[rgba(255,255,255,0.07)]">
            {values.map((value, index) => (
              <div key={value.title} className="grid gap-5 py-7 sm:grid-cols-[96px_minmax(0,1fr)]">
                <div className="text-[12px] font-[520] uppercase tracking-[0.12em] text-[#8A8F98]">
                  0{index + 1}
                </div>
                <div>
                  <h3 className="text-[22px] font-[520] leading-[29px] tracking-[-0.01em] text-[#F7F8F8]">
                    {value.title}
                  </h3>
                  <p className="mt-3 max-w-[620px] text-[15px] leading-[25px] text-[#8A8F98]">
                    {value.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MarketingContainer>
    </MarketingSection>
  );
}
