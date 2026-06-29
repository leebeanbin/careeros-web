const cues = [
  { label: "이력서", description: "흩어진 경험 정리" },
  { label: "GitHub", description: "작업 흔적 해석" },
  { label: "관심 역할", description: "무리 없는 우선순위" },
  { label: "다음 행동", description: "오늘 할 일 제안" },
];

export default function LogoBar() {
  return (
    <div className="bg-[#08090A] px-6 py-8 sm:px-8 lg:px-16">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {cues.map((cue) => (
          <div
            key={cue.label}
            className="border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.025)] px-4 py-3"
          >
            <div className="text-[13px] font-[510] text-[#F7F8F8]">{cue.label}</div>
            <div className="mt-1 text-[12px] text-[#8A8F98]">{cue.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
