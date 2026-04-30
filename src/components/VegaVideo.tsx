import { useState } from "react";
import { Play } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const YT_ID = "Nd9TT4nTKfI";

/**
 * Compact YouTube player wrapped in a glassmorphism frame.
 * The iframe lazy-loads only after the user clicks Play (saves bandwidth
 * and prevents the YT cookie warning until the user opts in).
 */
const VegaVideo = () => {
  const [active, setActive] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Outer glass frame */}
      <div
        className="relative rounded-2xl overflow-hidden border border-cyan/40 backdrop-blur-2xl bg-background/40 p-3"
        style={{
          boxShadow:
            "0 0 60px oklch(0.78 0.16 210 / 0.18), inset 0 0 0 1px oklch(0.78 0.16 210 / 0.15)",
        }}
      >
        {/* Frame top label */}
        <div className="flex items-center justify-between px-2 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
            <span className="font-display text-[10px] tracking-[0.4em] uppercase text-cyan/85">
              {t("video.label")}
            </span>
          </div>
          <span className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest">
            16:9 · HD
          </span>
        </div>

        <div className="relative aspect-video rounded-xl overflow-hidden border border-cyan/20 bg-black/60">
          {active ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&rel=0&modestbranding=1`}
              title="VEGA Engineering"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <img
                src={`https://i.ytimg.com/vi/${YT_ID}/hqdefault.jpg`}
                alt="VEGA Engineering"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/30 to-background/40" />

              {/* Corner accents */}
              <span className="pointer-events-none absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-cyan/70" />
              <span className="pointer-events-none absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-cyan/70" />
              <span className="pointer-events-none absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-cyan/70" />
              <span className="pointer-events-none absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-cyan/70" />

              <div className="absolute inset-0 grid place-items-center">
                <button
                  type="button"
                  onClick={() => setActive(true)}
                  className="group relative grid place-items-center w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-cyan bg-background/70 transition-all hover:scale-105"
                  aria-label={t("video.play")}
                  style={{ boxShadow: "0 0 30px oklch(0.78 0.16 210 / 0.6)" }}
                >
                  <span className="absolute inset-0 rounded-full border border-cyan/40 animate-ping" />
                  <Play className="w-8 h-8 md:w-10 md:h-10 text-cyan translate-x-0.5" />
                </button>
              </div>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 font-display text-[10px] tracking-[0.35em] uppercase text-foreground/70 bg-background/60 px-3 py-1 rounded-full border border-cyan/25 whitespace-nowrap">
                ▸ YouTube · {t("video.play")}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Glow underlay */}
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-cyan/10 blur-3xl pointer-events-none" />
    </div>
  );
};

export default VegaVideo;
