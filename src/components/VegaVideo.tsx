import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const VegaVideo = () => {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const { t } = useLanguage();

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden glass border border-cyan/40 aspect-video">
      <video
        ref={ref}
        className="absolute inset-0 w-full h-full object-cover"
        poster="/placeholder.svg"
        playsInline
        onEnded={() => setPlaying(false)}
      >
        <source src="/videos/isi_pompasi.mp4" type="video/mp4" />
      </video>

      <span className="pointer-events-none absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-cyan/70" />
      <span className="pointer-events-none absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-cyan/70" />
      <span className="pointer-events-none absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-cyan/70" />
      <span className="pointer-events-none absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-cyan/70" />

      <div className={`absolute inset-0 grid place-items-center transition-opacity duration-500 ${playing ? "opacity-0 pointer-events-none" : "opacity-100 bg-background/40 backdrop-blur-[2px]"}`}>
        <button
          type="button"
          onClick={toggle}
          className="group relative grid place-items-center w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-cyan bg-background/60 transition-all"
          aria-label={t("video.play")}
          style={{ boxShadow: "0 0 30px oklch(0.78 0.16 210 / 0.6)" }}
        >
          <span className="absolute inset-0 rounded-full border border-cyan/40 animate-ping" />
          <Play className="w-8 h-8 md:w-10 md:h-10 text-cyan translate-x-0.5" />
        </button>
      </div>

      {playing && (
        <button
          type="button"
          onClick={toggle}
          className="absolute bottom-4 right-4 grid place-items-center w-10 h-10 rounded-full bg-background/70 border border-cyan/60 text-cyan transition-all"
          aria-label="pause"
        >
          <Pause className="w-4 h-4" />
        </button>
      )}

      <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 font-display text-[10px] tracking-[0.4em] uppercase text-cyan/80 bg-background/50 px-3 py-1 rounded-full border border-cyan/30">
        {t("video.label")}
      </div>
    </div>
  );
};

export default VegaVideo;
