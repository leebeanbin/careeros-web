const logos = ["삼성 SDS", "Kakao", "NAVER", "Toss", "Coupang", "LINE", "카카오뱅크", "두나무"];

export default function LogoBar() {
  return (
    <div className="bg-[#08090A] py-10 px-16">
      <div className="flex items-center justify-center gap-12 flex-wrap">
        {logos.map((logo) => (
          <span
            key={logo}
            className="text-[14px] font-[500] text-[#F7F8F8] opacity-60 whitespace-nowrap"
          >
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
}
