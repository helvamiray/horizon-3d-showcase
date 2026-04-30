import { useLanguage } from "@/i18n/LanguageContext";

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();
  return (
    <div className="inline-flex items-center rounded-md glass border border-cyan/40 overflow-hidden font-display text-[10px] tracking-[0.25em] uppercase">
      {(["tr", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`px-3 h-10 transition-colors ${
            lang === l
              ? "bg-cyan/15 text-cyan"
              : "text-foreground/60 hover:text-cyan"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageToggle;
