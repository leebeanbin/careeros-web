import Link from "next/link";

const navLinks = ["기능", "매칭", "가격"];

export default function LandingNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] h-[73px]
                       flex items-center justify-between px-8
                       border-b border-white/[0.08] backdrop-blur-xl">
      <Link href="/" className="text-[15px] font-[510] text-[#F7F8F8]">
        CareerOS
      </Link>
      <nav className="flex items-center">
        {navLinks.map((link) => (
          <a key={link} className="flex h-[73px] items-center px-3
                                   text-[13px] text-[#F7F8F8]
                                   transition-opacity duration-[150ms]
                                   hover:opacity-70">
            {link}
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
          시작하기
        </Link>
      </div>
    </header>
  );
}
