import { lazy, Suspense, useEffect } from "react";
import { initScrollReveal } from "@/lib/scrollReveal";
import MissionVision from "@/components/MissionVision";
import { AnimatedStats } from "@/components/AnimatedStats";
import ProductSlider from "@/components/ProductSlider";
import ProductEngine from "@/components/ProductEngine";
import { SolutionPartners } from "@/components/SolutionPartners";
import QuoteSimple from "@/components/QuoteSimple";
import { SiteFooter } from "@/components/SiteFooter";

// Leaflet needs the browser DOM — load only on the client
const TurkeyMapLive = lazy(() => import("@/components/TurkeyMapLive"));

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
      <Suspense fallback={
        <div style={{ height: "500px", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-premium-mono)", fontSize: "13px", letterSpacing: "0.1em" }}>
          Harita yükleniyor…
        </div>
      }>
        <TurkeyMapLive />
      </Suspense>
      <SolutionPartners />
      <QuoteSimple />
      <SiteFooter />
    </>
  );
}
