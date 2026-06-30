import { MarketingButton, MarketingContainer, MarketingHeading, MarketingSection } from "./MarketingPrimitives";

const heroStats = [
  { label: "읽는 재료", value: "이력서 · GitHub · 관심 역할" },
  { label: "남기는 결과", value: "강점 · 빈칸 · 다음 행동" },
  { label: "오늘의 초점", value: "하나의 실행 항목" },
];

export default function HeroSection() {
  return (
    <MarketingSection className="relative overflow-hidden pb-14 pt-[132px] lg:pb-20 lg:pt-[180px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(122,151,214,0.08), transparent 34%), linear-gradient(115deg, rgba(255,255,255,0.05), transparent 28%, rgba(255,255,255,0.025) 54%, transparent 76%)",
          maskImage: "linear-gradient(to bottom, black 0%, black 62%, transparent 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-[72px] h-px bg-[linear-gradient(90deg,transparent,rgba(122,151,214,0.36),transparent)]"
      />

      <MarketingContainer className="relative">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <MarketingHeading size="hero" className="max-w-[900px]">
              내 커리어를 함께 정리하는<br />COS 어시스턴트
            </MarketingHeading>
            <p className="mt-6 max-w-[620px] text-[17px] font-normal leading-[28px] text-[#8A8F98]">
              이력서와 GitHub, 관심 역할을 한곳에 모아 지금 필요한 판단만 남깁니다.
              아래로 내리면 CareerOS가 어떤 순서로 커리어를 읽고 좁혀가는지 바로 볼 수 있습니다.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <MarketingButton href="/signup">커리어 점검 시작</MarketingButton>
              <MarketingButton href="#product-flow" tone="secondary">
                제품 흐름 보기
              </MarketingButton>
            </div>
          </div>

          <div className="border-y border-[rgba(255,255,255,0.08)]">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="grid gap-3 border-b border-[rgba(255,255,255,0.08)] py-4 last:border-b-0"
              >
                <div className="text-[11px] font-[520] uppercase tracking-[0.12em] text-[#8A8F98]">
                  {stat.label}
                </div>
                <div className="text-[15px] font-[520] leading-[22px] text-[#F7F8F8]">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </MarketingContainer>
    </MarketingSection>
  );
}
