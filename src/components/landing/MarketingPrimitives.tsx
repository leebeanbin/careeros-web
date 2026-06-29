import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

type Tone = "primary" | "secondary" | "text";

export function MarketingSection({
  id,
  children,
  bordered = false,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  bordered?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`bg-[#08090A] px-6 py-16 sm:px-8 lg:px-16 lg:py-20 ${
        bordered ? "border-t border-[rgba(255,255,255,0.05)]" : ""
      } ${className}`}
    >
      {children}
    </section>
  );
}

export function MarketingContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto max-w-[1440px] ${className}`}>{children}</div>;
}

export function MarketingHeading({
  children,
  size = "section",
  muted,
  className = "",
}: {
  children: ReactNode;
  size?: "hero" | "section" | "cta";
  muted?: ReactNode;
  className?: string;
}) {
  const sizeClass = {
    hero: "text-[40px] leading-[44px] sm:text-[52px] sm:leading-[56px] lg:text-[64px] lg:leading-none",
    section: "text-[34px] leading-[40px] sm:text-[42px] sm:leading-[48px] lg:text-[48px] lg:leading-[56px]",
    cta: "text-[42px] leading-[48px] sm:text-[56px] sm:leading-[62px] lg:text-[72px] lg:leading-[76px]",
  }[size];

  return (
    <h2 className={`${sizeClass} font-[510] tracking-[-0.02em] text-[#F7F8F8] ${className}`}>
      {children}
      {muted && <span className="text-[#8A8F98]">{muted}</span>}
    </h2>
  );
}

export function MarketingButton({
  href,
  children,
  tone = "primary",
  className = "",
  style,
}: {
  href: string;
  children: ReactNode;
  tone?: Tone;
  className?: string;
  style?: CSSProperties;
}) {
  const base =
    "inline-flex h-11 items-center justify-center rounded-full px-5 text-[16px] font-[510] transition-opacity duration-[150ms]";
  const toneClass = {
    primary: "border border-[#E5E5E6] bg-[#E5E5E6] text-[#08090A] hover:opacity-90",
    secondary:
      "border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] text-[#F7F8F8] hover:opacity-70",
    text: "h-auto rounded-none px-0 text-[14px] text-[#F7F8F8] hover:opacity-70",
  }[tone];

  if (href.startsWith("#")) {
    return (
      <a href={href} className={`${base} ${toneClass} ${className}`} style={style}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={`${base} ${toneClass} ${className}`} style={style}>
      {children}
    </Link>
  );
}
