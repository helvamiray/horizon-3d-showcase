import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";

import { Navbar } from "@/components/Navbar";
import HeroVideo from "@/components/HeroVideo";
import FlashlightOverlay from "@/components/FlashlightOverlay";

import { hashScrollIntoViewOptions } from "@/utils/navigateToHashSection";
import "@/styles/gravity.css";

const HomeDeferredSections = lazy(() => import("@/components/home/HomeDeferredSections"));

export const Route = createFileRoute("/")({
  component: Index,
});

/**
 * Lazy yüklenen bölümlerdeki #id (ürünler, hakkımızda) DOM’a girince kaydırmayı tekrar dene.
 */
function useDeferredHashScroll() {
  const hash = useRouterState({ select: (s) => s.location.hash });
  const hashId = (hash ?? "").replace(/^#/, "");

  useEffect(() => {
    if (!hashId) return;

    const deadline = Date.now() + 8000;
    const tryScroll = () => {
      const el = document.getElementById(hashId);
      if (el) {
        el.scrollIntoView(hashScrollIntoViewOptions());
        return true;
      }
      return false;
    };

    if (tryScroll()) return undefined;

    const id = window.setInterval(() => {
      if (tryScroll() || Date.now() > deadline) {
        clearInterval(id);
      }
    }, 48);

    return () => clearInterval(id);
  }, [hashId]);
}

function Index() {
  useDeferredHashScroll();

  useEffect(() => {
    let cancelled = false;

    void import("@/lib/smoothScroll").then((smooth) => {
      if (!cancelled) smooth.initSmoothScroll();
    });

    const prefetchDeferred = window.setTimeout(() => {
      void import("@/components/home/HomeDeferredSections");
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(prefetchDeferred);
      void import("@/lib/smoothScroll").then((m) => m.destroySmoothScroll());
      void import("gsap/ScrollTrigger").then((ST) => {
        ST.ScrollTrigger.getAll().forEach((t) => t.kill());
      });
    };
  }, []);

  return (
    <div
      className="landing-page"
      style={{
        fontFamily: "var(--font-premium-body, 'Inter', sans-serif)",
        background: "var(--terminal-bg, #020608)",
        overflowX: "hidden",
      }}
    >
      <FlashlightOverlay />
      <Navbar />

      <HeroVideo nextSectionId="hakkimizda" />

      <div className="main-content">
        <Suspense fallback={null}>
          <HomeDeferredSections />
        </Suspense>
      </div>
    </div>
  );
}
