/**
 * Dual solution cards — Kurumsal / Endüstriyel (glass + in-view motion).
 */
import { useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { IconBuildingSkyscraper, IconBuildingFactory } from "@tabler/icons-react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { useLanguage } from "@/i18n/LanguageContext";
import { useUiTheme } from "@/context/UiThemeContext";
import { navigateToHashSection } from "@/utils/navigateToHashSection";

export default function SolutionsSection() {
  const { t } = useLanguage();
  const { mode } = useUiTheme();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  const reduceMotion = useReducedMotion();
  const isLight = mode === "light";

  const y = reduceMotion ? 0 : 22;
  const trans = {
    duration: reduceMotion ? 0 : 0.48,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  const goProducts = () => {
    navigateToHashSection(navigate, "urunler");
  };

  return (
    <section
      ref={sectionRef}
      id="cozumler"
      className="dual-solutions-section relative overflow-hidden border-t border-white/[0.08]"
      style={{
        padding: "clamp(56px, 9vw, 96px) clamp(20px, 5vw, 72px)",
        background:
          "linear-gradient(180deg, var(--terminal-bg, #020608) 0%, rgba(8,12,18,0.97) 50%, var(--terminal-bg, #020608) 100%)",
      }}
      aria-labelledby="dual-solutions-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--electric-cyan, #00f0ff) 50%, transparent)",
        }}
      />

      <div className="relative z-[1] mx-auto max-w-[1400px]">
        <h2 id="dual-solutions-heading" className="sr-only">
          {t("nav.solutions")}
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <motion.article
            initial={{ opacity: reduceMotion ? 1 : 0, y }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: reduceMotion ? 1 : 0, y }}
            transition={{ ...trans, delay: reduceMotion ? 0 : 0 }}
            className={clsx(
              "relative rounded-2xl border p-6 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.65)] backdrop-blur-md md:p-8",
              "transition-[box-shadow,border-color] duration-300",
              isLight
                ? "border-slate-200/90 bg-white/75 hover:border-cyan-400/35 hover:shadow-[0_0_48px_-16px_rgba(34,211,238,0.22)]"
                : "border-white/10 bg-slate-900/40 hover:border-cyan-400/30 hover:shadow-[0_0_52px_-12px_rgba(34,211,238,0.28)]",
            )}
          >
            <div
              className={clsx(
                "mb-5 inline-flex rounded-xl border p-3 transition-colors duration-300",
                isLight
                  ? "border-cyan-500/25 bg-cyan-500/[0.08]"
                  : "border-white/10 bg-white/[0.06]",
              )}
            >
              <IconBuildingSkyscraper
                className={clsx("size-8 shrink-0", isLight ? "text-cyan-700" : "text-cyan-300")}
                stroke={1.25}
                aria-hidden
              />
            </div>
            <h3
              className={clsx(
                "mb-4 font-bold tracking-[0.06em]",
                isLight ? "text-slate-900" : "text-slate-100",
              )}
              style={{
                fontFamily: "var(--font-premium-body, Inter, system-ui, sans-serif)",
                fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
              }}
            >
              {t("solutions.dual.corp.title")}
            </h3>
            <p
              className={clsx(
                "mb-6 leading-relaxed",
                isLight ? "text-slate-600" : "text-slate-400",
              )}
              style={{
                fontFamily: "var(--font-premium-body, Inter, system-ui, sans-serif)",
                fontSize: "clamp(0.9375rem, 1.35vw, 1rem)",
              }}
            >
              {t("solutions.dual.corp.desc")}
            </p>
            <button
              type="button"
              onClick={goProducts}
              className={clsx(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
                isLight
                  ? "border-cyan-600/35 text-cyan-800 hover:bg-cyan-500/10"
                  : "border-white/15 text-cyan-200/95 hover:bg-white/[0.06]",
              )}
              style={{ fontFamily: "var(--font-premium-body, Inter, system-ui, sans-serif)" }}
            >
              {t("solutions.dual.cta")}
              <ArrowRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
            </button>
          </motion.article>

          <motion.article
            initial={{ opacity: reduceMotion ? 1 : 0, y }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: reduceMotion ? 1 : 0, y }}
            transition={{ ...trans, delay: reduceMotion ? 0 : 0.12 }}
            className={clsx(
              "relative rounded-2xl border p-6 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.65)] backdrop-blur-md md:p-8",
              "transition-[box-shadow,border-color] duration-300",
              isLight
                ? "border-slate-200/90 bg-white/75 hover:border-amber-400/40 hover:shadow-[0_0_48px_-16px_rgba(245,158,11,0.2)]"
                : "border-white/10 bg-slate-900/40 hover:border-amber-400/35 hover:shadow-[0_0_52px_-12px_rgba(251,191,36,0.22)]",
            )}
          >
            <div
              className={clsx(
                "mb-5 inline-flex rounded-xl border p-3 transition-colors duration-300",
                isLight
                  ? "border-amber-500/30 bg-amber-500/[0.08]"
                  : "border-white/10 bg-white/[0.06]",
              )}
            >
              <IconBuildingFactory
                className={clsx("size-8 shrink-0", isLight ? "text-amber-800" : "text-amber-200")}
                stroke={1.25}
                aria-hidden
              />
            </div>
            <h3
              className={clsx(
                "mb-4 font-bold tracking-[0.06em]",
                isLight ? "text-slate-900" : "text-slate-100",
              )}
              style={{
                fontFamily: "var(--font-premium-body, Inter, system-ui, sans-serif)",
                fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
              }}
            >
              {t("solutions.dual.ind.title")}
            </h3>
            <p
              className={clsx(
                "mb-6 leading-relaxed",
                isLight ? "text-slate-600" : "text-slate-400",
              )}
              style={{
                fontFamily: "var(--font-premium-body, Inter, system-ui, sans-serif)",
                fontSize: "clamp(0.9375rem, 1.35vw, 1rem)",
              }}
            >
              {t("solutions.dual.ind.desc")}
            </p>
            <button
              type="button"
              onClick={goProducts}
              className={clsx(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
                isLight
                  ? "border-amber-700/30 text-amber-900 hover:bg-amber-500/12"
                  : "border-white/15 text-amber-100/95 hover:bg-white/[0.06]",
              )}
              style={{ fontFamily: "var(--font-premium-body, Inter, system-ui, sans-serif)" }}
            >
              {t("solutions.dual.cta")}
              <ArrowRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
            </button>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
