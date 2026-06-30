import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import ProductFlowShowcase from "@/components/landing/ProductFlowShowcase";
import PillarCards from "@/components/landing/PillarCards";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="bg-[#08090A]">
      <LandingNav />
      <HeroSection />
      <ProductFlowShowcase />
      <PillarCards />
      <CtaSection />
      <Footer />
    </div>
  );
}
