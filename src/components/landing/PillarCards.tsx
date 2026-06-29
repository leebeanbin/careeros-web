import type { ReactNode } from "react";
import { MarketingHeading, MarketingSection } from "./MarketingPrimitives";

interface Pillar {
  title: string;
  desc: string;
  svg: ReactNode;
}

const RadarSvg = (
  <svg width="120" height="100" viewBox="0 0 120 100">
    <polygon
      points="60,10 100,35 100,65 60,90 20,65 20,35"
      fill="rgba(255,255,255,0.03)"
      stroke="rgba(255,255,255,0.2)"
      strokeWidth="1"
    />
    <polygon
      points="60,25 85,40 85,60 60,75 35,60 35,40"
      fill="rgba(99,102,241,0.1)"
      stroke="rgba(99,102,241,0.4)"
      strokeWidth="1"
    />
    <line x1="60" y1="10" x2="60" y2="90" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
    <line x1="20" y1="35" x2="100" y2="65" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
    <line x1="20" y1="65" x2="100" y2="35" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
    {[
      [60, 25], [85, 40], [85, 60], [60, 75], [35, 60], [35, 40],
    ].map(([cx, cy]) => (
      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="rgba(99,102,241,0.8)" />
    ))}
  </svg>
);

// Deterministic grid pattern — avoids hydration mismatch from Math.random()
const GITHUB_GRID: number[][] = Array.from({ length: 7 }, (_, col) =>
  Array.from({ length: 4 }, (_, row) => ((col * 7 + row) * 2654435761) % 100)
);

const GitSvg = (
  <svg width="120" height="100" viewBox="0 0 120 100">
    {GITHUB_GRID.map((rows, col) =>
      rows.map((val, row) => (
        <rect
          key={`${col}-${row}`}
          x={col * 16 + 8}
          y={row * 16 + 18}
          width="12"
          height="12"
          rx="2"
          fill={val > 50 ? "rgba(99,102,241,0.6)" : "rgba(255,255,255,0.06)"}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.5"
        />
      ))
    )}
  </svg>
);

const ChatSvg = (
  <svg width="120" height="100" viewBox="0 0 120 100">
    <rect
      x="10" y="10" width="100" height="60" rx="8"
      fill="rgba(255,255,255,0.03)"
      stroke="rgba(255,255,255,0.2)"
      strokeWidth="1"
    />
    <rect x="20" y="22" width="60" height="8" rx="2" fill="rgba(255,255,255,0.1)" />
    <rect x="20" y="34" width="80" height="6" rx="2" fill="rgba(255,255,255,0.06)" />
    <rect x="20" y="44" width="70" height="6" rx="2" fill="rgba(255,255,255,0.06)" />
    <rect x="20" y="54" width="40" height="6" rx="2" fill="rgba(99,102,241,0.4)" />
    <circle
      cx="30" cy="85" r="6"
      fill="rgba(255,255,255,0.06)"
      stroke="rgba(255,255,255,0.2)"
      strokeWidth="1"
    />
    <rect
      x="42" y="80" width="50" height="10" rx="5"
      fill="rgba(255,255,255,0.06)"
      stroke="rgba(255,255,255,0.1)"
      strokeWidth="1"
    />
  </svg>
);

const pillars: Pillar[] = [
  {
    title: "커리어 단서 정리",
    desc: "이력서 안의 경험과 기술을 읽고 지금 보이는 강점과 빈칸을 정리합니다.",
    svg: RadarSvg,
  },
  {
    title: "작업 흔적 해석",
    desc: "GitHub 활동에서 프로젝트 맥락과 기술 신호를 찾아 더 말하기 쉽게 바꿉니다.",
    svg: GitSvg,
  },
  {
    title: "다음 행동 제안",
    desc: "지원, 이력서 보완, 면접 준비 중 지금 먼저 할 일을 차분히 제안합니다.",
    svg: ChatSvg,
  },
];

export default function PillarCards() {
  return (
    <MarketingSection id="features">
      <MarketingHeading className="mb-12 max-w-[900px] lg:mb-16">
        혼자 정리하기 어려운 커리어를,{" "}
        <span className="text-[#8A8F98]">
          작은 단서부터 함께 읽고 다음 행동으로 이어줍니다.
        </span>
      </MarketingHeading>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="bg-[#0F1011] border border-[rgba(255,255,255,0.05)] rounded-lg px-6 pb-7 flex flex-col"
          >
            <div className="h-[220px] flex items-center justify-center mb-4">{p.svg}</div>
            <h3 className="text-[15px] font-[510] text-[#F7F8F8] mb-2">{p.title}</h3>
            <p className="text-[14px] font-normal leading-5 text-[#8A8F98]">{p.desc}</p>
          </div>
        ))}
      </div>
    </MarketingSection>
  );
}
