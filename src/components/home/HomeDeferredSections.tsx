import { lazy, Suspense, useEffect } from "react";
import { initScrollReveal } from "@/lib/scrollReveal";
import MissionVision from "@/components/MissionVision";
import { AnimatedStats } from "@/components/AnimatedStats";
import ProductSlider from "@/components/ProductSlider";
import { SolutionPartners } from "@/components/SolutionPartners";
import QuoteSimple from "@/components/QuoteSimple";
import { SiteFooter } from "@/components/SiteFooter";

// Fold altındaki ağır bileşenler — DOM mount edilince yükle
const SolutionsSection = lazy(() => import("@/components/SolutionsSection"));
const ProductEngine = lazy(() => import("@/components/ProductEngine"));
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
      <Suspense fallback={null}>
        <SolutionsSection />
      </Suspense>
      <ProductSlider />
      <Suspense fallback={null}>
        <ProductEngine />
      </Suspense>
      <Suspense
        fallback={
          <div
            style={{
              height: "500px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.3)",
              fontFamily: "var(--font-premium-mono)",
              fontSize: "13px",
              letterSpacing: "0.1em",
            }}
          >
            Harita yükleniyor…
          </div>
        }
      >
        <TurkeyMapLive />
      </Suspense>
      <SolutionPartners />
      <QuoteSimple />
      <SiteFooter />
    </>
  );
}
