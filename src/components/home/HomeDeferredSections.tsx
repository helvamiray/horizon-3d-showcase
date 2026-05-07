import { useEffect } from "react";
import { initScrollReveal } from "@/lib/scrollReveal";
import MissionVision from "@/components/MissionVision";
import { AnimatedStats } from "@/components/AnimatedStats";
import ProductSlider from "@/components/ProductSlider";
import ProductEngine from "@/components/ProductEngine";
import TurkeyMapLive from "@/components/TurkeyMapLive";
import { SolutionPartners } from "@/components/SolutionPartners";
import QuoteSimple from "@/components/QuoteSimple";
import { SiteFooter } from "@/components/SiteFooter";

/**
 * Ana sayfa hero’dan sonraki tüm bölümler — tek lazy chunk; sıra korunur (iletişim en sonda).
 */
export default function HomeDeferredSections() {
  useEffect(() => {
    initScrollReveal();
  }, []);

  return (
    <>
      <MissionVision />
      <AnimatedStats />
      <ProductSlider />
      <ProductEngine />
      <TurkeyMapLive />
      <SolutionPartners />
      <QuoteSimple />
      <SiteFooter />
    </>
  );
}
