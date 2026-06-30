import { MarketingButton, MarketingHeading, MarketingSection } from "./MarketingPrimitives";

export default function CtaSection() {
  return (
    <MarketingSection id="start" bordered className="flex flex-col items-center text-center lg:py-[120px]">
      <MarketingHeading size="cta" className="mb-10 max-w-[700px]">
        내 커리어를 차분히 정리해볼까요?
      </MarketingHeading>
      <MarketingButton href="/signup">
        커리어 점검 시작
      </MarketingButton>
    </MarketingSection>
  );
}
