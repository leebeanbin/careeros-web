import Link from "next/link";

const columns = [
  {
    title: "제품",
    links: [
      { label: "매칭 엔진", href: "#" },
      { label: "GitHub 분석", href: "#" },
      { label: "이력서 관리", href: "#" },
      { label: "AI 어드바이저", href: "#" },
      { label: "가격", href: "#" },
    ],
  },
  {
    title: "서비스",
    links: [
      { label: "채용공고", href: "/jobs" },
      { label: "나의 매칭", href: "/matches" },
      { label: "경력 그래프", href: "/candidate" },
      { label: "알림", href: "/notifications" },
    ],
  },
  {
    title: "회사",
    links: [
      { label: "소개", href: "#" },
      { label: "블로그", href: "#" },
      { label: "채용", href: "#" },
    ],
  },
  {
    title: "리소스",
    links: [
      { label: "문서", href: "#" },
      { label: "API", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#08090A] border-t border-[rgba(255,255,255,0.08)] pt-12 pb-8 px-16">
      <div className="grid grid-cols-[120px_repeat(4,1fr)] gap-x-10 mb-12 items-start">
        <div>
          <span className="text-[15px] font-[510] text-[#F7F8F8] opacity-80">CareerOS</span>
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
      <div className="flex items-center gap-5 pt-6 border-t border-[rgba(255,255,255,0.06)]">
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
        <span className="ml-auto text-[12px] text-[#8A8F98]">
          © 2026 CareerOS. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
