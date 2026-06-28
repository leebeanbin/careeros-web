const matchItems = [
  { title: "백엔드 개발자", company: "카카오", score: 92, color: "#22c55e" },
  { title: "풀스택 개발자", company: "토스", score: 87, color: "#22c55e" },
  { title: "서버 개발자", company: "네이버", score: 74, color: "#eab308" },
  { title: "백엔드 엔지니어", company: "라인", score: 68, color: "#eab308" },
];

const scoreAxes = [
  { label: "기술 스택", score: 91 },
  { label: "경력 매칭", score: 88 },
  { label: "포지션 적합도", score: 85 },
  { label: "선호도", score: 82 },
  { label: "최신성", score: 78 },
];

const sidebarItems = ["대시보드", "채용공고", "나의 매칭", "이력서", "GitHub", "AI 어드바이저"];

export default function HeroSection() {
  return (
    <section className="bg-[#08090A] pt-[180px] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-16 relative">
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-[64px] font-[510] leading-none tracking-[-0.022em]
                         text-[#F7F8F8] max-w-[860px]">
            AI가 찾아주는<br />커리어 매칭 플랫폼
          </h1>
          <a href="#features"
             className="flex items-center gap-2 text-[15px] text-[#D0D6E0]
                        transition-opacity duration-[150ms] hover:opacity-70 mt-3 shrink-0">
            <span className="font-[510]">New</span>
            <span className="text-[#8A8F98]">·</span>
            <span>AI 어드바이저 출시 →</span>
          </a>
        </div>
        <p className="text-base font-normal leading-6 text-[#8A8F98] mb-12">
          이력서를 올리면 AI가 맞춤 채용 포지션을 매칭합니다.
        </p>

        {/* App mockup */}
        <div className="rounded-t-xl border border-b-0 border-[rgba(255,255,255,0.08)]
                        bg-[#0F1011] min-h-[480px] overflow-hidden flex">
          {/* Sidebar */}
          <div className="w-[230px] shrink-0 border-r border-[rgba(255,255,255,0.06)]
                          flex flex-col px-2 py-3">
            <div className="px-2 py-1 mb-3 text-[13px] font-[510] text-[#F7F8F8]">
              CareerOS
            </div>
            {sidebarItems.map((item, i) => (
              <div key={item}
                   className={`flex h-7 items-center gap-2 rounded-md px-2 text-[13px]
                     ${i === 2
                       ? "bg-[rgba(255,255,255,0.08)] text-[#F7F8F8] font-[510]"
                       : "text-[#8A8F98]"}`}>
                {item}
              </div>
            ))}
          </div>

          {/* Match list */}
          <div className="flex-1 border-r border-[rgba(255,255,255,0.06)] p-4 bg-[#0D0E0F]">
            <div className="text-[13px] font-[510] text-[#F7F8F8] mb-3">나의 매칭</div>
            {matchItems.map((item) => (
              <div key={item.company}
                   className={`flex items-center justify-between rounded-md px-3 py-2 mb-1 text-[13px]
                     ${item.company === "토스" ? "bg-[rgba(255,255,255,0.05)]" : ""}`}>
                <div>
                  <div className="text-[#F7F8F8] font-[500]">{item.title}</div>
                  <div className="text-[11px] text-[#8A8F98]">{item.company}</div>
                </div>
                <div className="text-[13px] font-[510]" style={{ color: item.color }}>
                  {item.score}%
                </div>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          <div className="w-[280px] shrink-0 p-4">
            <div className="text-[13px] font-[510] text-[#F7F8F8] mb-1">풀스택 개발자 — 토스</div>
            <div className="text-[11px] text-[#8A8F98] mb-4">매칭 점수 87%</div>
            {scoreAxes.map((axis) => (
              <div key={axis.label} className="mb-3">
                <div className="flex justify-between text-[11px] text-[#8A8F98] mb-1">
                  <span>{axis.label}</span>
                  <span className="text-[#F7F8F8]">{axis.score}</span>
                </div>
                <div className="h-1 rounded-full bg-[rgba(255,255,255,0.08)]">
                  <div className="h-1 rounded-full bg-[#6366f1]"
                       style={{ width: `${axis.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
