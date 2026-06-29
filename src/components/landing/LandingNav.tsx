import Link from "next/link";
import { LogoWordmark } from "@/components/brand/Logo";

const navLinks = [
  { label: "기능", href: "#features" },
  { label: "정리", href: "#matching" },
  { label: "흐름", href: "#start" },
];

export default function LandingNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] h-[73px]
                       flex items-center justify-between gap-4 px-4 sm:px-8
                       border-b border-white/[0.08] backdrop-blur-xl">
      <Link href="/" className="text-[15px] font-[510] text-[#F7F8F8] no-underline">
        <LogoWordmark size={18} textClassName="font-[510] text-[#F7F8F8]" />
      </Link>
      <nav className="hidden items-center sm:flex">
        {navLinks.map((link) => (
          <a key={link.label} href={link.href} className="flex h-[73px] items-center px-3
                                   text-[13px] text-[#F7F8F8]
                                   transition-opacity duration-[150ms]
                                   hover:opacity-70">
            {link.label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-1">
        <Link href="/login" className="text-[13px] text-[#8A8F98] px-3">
          로그인
        </Link>
        <Link href="/signup"
              className="flex h-8 items-center rounded-full bg-[#E5E5E6]
                         px-3 text-[13px] font-[510] text-[#08090A]
                         transition-opacity duration-[150ms] hover:opacity-90">
          정리 시작
        </Link>
      </div>
    </header>
  );
}
