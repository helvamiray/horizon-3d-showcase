import { Building2, Factory, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const SolutionsSection = () => {
  const { t } = useLanguage();

  const corporate = [
    t("solutions.corp.b1"),
    t("solutions.corp.b2"),
    t("solutions.corp.b3"),
    t("solutions.corp.b4"),
  ];
  const industrial = [
    t("solutions.ind.b1"),
    t("solutions.ind.b2"),
    t("solutions.ind.b3"),
    t("solutions.ind.b4"),
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Corporate */}
      <article
        data-reveal
        className="group relative glass rounded-2xl p-7 md:p-8 overflow-hidden border border-cyan/30 hover:border-cyan/60 transition-colors"
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-cyan/10 blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3 mb-4">
          <div className="grid place-items-center w-12 h-12 rounded-lg border border-cyan/50 text-cyan"
               style={{ boxShadow: "0 0 18px oklch(0.78 0.16 210 / 0.35)" }}>
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="font-display text-[10px] tracking-[0.35em] uppercase text-cyan">
              {t("solutions.corp.eyebrow")}
            </span>
            <h3 className="font-display text-2xl mt-1">{t("solutions.corp.title")}</h3>
          </div>
        </div>
        <p className="text-foreground/75 leading-relaxed mb-5">
          {t("solutions.corp.body")}
        </p>
        <ul className="space-y-2">
          {corporate.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-foreground/85">
              <CheckCircle2 className="w-4 h-4 text-cyan flex-shrink-0 mt-0.5" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          {["VRF", "VRV 5", "Multi-Split", "BMS", "Modbus"].map((tag) => (
            <span key={tag}
                  className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded border border-cyan/30 text-cyan/90 bg-secondary/40">
              {tag}
            </span>
          ))}
        </div>
      </article>

      {/* Industrial */}
      <article
        data-reveal
        className="group relative glass rounded-2xl p-7 md:p-8 overflow-hidden border border-amber/40 hover:border-amber/70 transition-colors"
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber/10 blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3 mb-4">
          <div className="grid place-items-center w-12 h-12 rounded-lg border border-amber/60 amber-text"
               style={{ boxShadow: "0 0 18px oklch(0.78 0.18 65 / 0.4)" }}>
            <Factory className="w-6 h-6" />
          </div>
          <div>
            <span className="font-display text-[10px] tracking-[0.35em] uppercase amber-text">
              {t("solutions.ind.eyebrow")}
            </span>
            <h3 className="font-display text-2xl mt-1">{t("solutions.ind.title")}</h3>
          </div>
        </div>
        <p className="text-foreground/75 leading-relaxed mb-5">
          {t("solutions.ind.body")}
        </p>
        <ul className="space-y-2">
          {industrial.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-foreground/85">
              <CheckCircle2 className="w-4 h-4 amber-text flex-shrink-0 mt-0.5" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          {["Yüksek Kapasite", "Chiller", "Sprinkler", "NFPA 13", "SCADA"].map((tag) => (
            <span key={tag}
                  className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded border border-amber/40 amber-text bg-secondary/40">
              {tag}
            </span>
          ))}
        </div>
      </article>
    </div>
  );
};

export default SolutionsSection;
