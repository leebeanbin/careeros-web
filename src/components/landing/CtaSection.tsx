import { MarketingButton, MarketingHeading, MarketingSection } from "./MarketingPrimitives";

export default function CtaSection() {
  return (
    <MarketingSection id="start" bordered className="flex flex-col items-center text-center lg:py-[120px]">
      <MarketingHeading size="cta" className="mb-10 max-w-[700px]">
        내 커리어를 차분히 정리해볼까요?
      </MarketingHeading>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <MarketingButton href="/signup">
          커리어 정리 시작
        </MarketingButton>
        <MarketingButton href="#features" tone="secondary">
          어떻게 돕는지 보기
        </MarketingButton>
      </div>
    </MarketingSection>
  );
}
