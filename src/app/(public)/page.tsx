import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import LogoBar from "@/components/landing/LogoBar";
import PillarCards from "@/components/landing/PillarCards";
import { FeatureSections } from "@/components/landing/FeatureSection";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="bg-[#08090A]">
      <LandingNav />
      <HeroSection />
      <LogoBar />
      <PillarCards />
      <FeatureSections />
      <CtaSection />
      <Footer />
    </div>
  );
}
