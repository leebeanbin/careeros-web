import Link from "next/link";
import { LogoWordmark } from "@/components/brand/Logo";

const columns = [
  {
    title: "도움",
    links: [
      { label: "커리어 정리", href: "#features" },
      { label: "GitHub 해석", href: "#features" },
      { label: "이력서 메모", href: "#features" },
      { label: "COS 어드바이저", href: "#features" },
    ],
  },
  {
    title: "작업 공간",
    links: [
      { label: "관심 역할", href: "/jobs" },
      { label: "나의 흐름", href: "/matches" },
      { label: "경력 그래프", href: "/candidate" },
      { label: "알림", href: "/notifications" },
    ],
  },
  {
    title: "프로젝트",
    links: [
      { label: "소개", href: "#features" },
      { label: "작동 방식", href: "#product-flow" },
      { label: "시작하기", href: "#start" },
    ],
  },
  {
    title: "리소스",
    links: [
      { label: "개인정보", href: "/privacy" },
      { label: "이용약관", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#08090A] border-t border-[rgba(255,255,255,0.08)] px-6 pt-12 pb-8 sm:px-8 lg:px-16">
      <div className="mb-12 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-[120px_repeat(4,1fr)] md:gap-x-10 md:items-start">
        <div>
          <LogoWordmark size={16} textClassName="text-[15px] font-[510] text-[#F7F8F8]" style={{ opacity: 0.8 }} />
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-[13px] font-[510] text-[#F7F8F8] mb-4">{col.title}</h3>
            {col.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-[13px] font-normal text-[#8A8F98] mb-3 transition-colors duration-[150ms] hover:text-[#F7F8F8]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 border-t border-[rgba(255,255,255,0.06)] pt-6 sm:flex-row sm:items-center sm:gap-5">
        <Link
          href="/privacy"
          className="text-[12px] text-[#8A8F98] transition-colors duration-[150ms] hover:text-[#F7F8F8]"
        >
          개인정보처리방침
        </Link>
        <Link
          href="/terms"
          className="text-[12px] text-[#8A8F98] transition-colors duration-[150ms] hover:text-[#F7F8F8]"
        >
          이용약관
        </Link>
        <span className="text-[12px] text-[#8A8F98] sm:ml-auto">
          © 2026 CareerOS. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
