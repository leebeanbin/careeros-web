import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="bg-[#08090A] py-[120px] px-16 flex flex-col items-center text-center border-t border-[rgba(255,255,255,0.05)]">
      <h2 className="text-[72px] font-[510] leading-[76px] tracking-[-0.02em] text-[#F7F8F8] mb-10 max-w-[700px]">
        AI가 찾아주는 나의 커리어. 지금 시작하세요.
      </h2>
      <div className="flex items-center gap-3">
        <Link
          href="/signup"
          className="flex h-11 items-center rounded-full bg-[#E5E5E6] border border-[#E5E5E6] px-5 text-[16px] font-[510] text-[#08090A] transition-opacity duration-[150ms] hover:opacity-90"
        >
          무료로 시작하기
        </Link>
        <a
          href="#features"
          className="flex h-11 items-center rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] px-5 text-[16px] font-[510] text-[#F7F8F8] transition-opacity duration-[150ms] hover:opacity-70"
        >
          자세히 알아보기
        </a>
      </div>
    </section>
  );
}
