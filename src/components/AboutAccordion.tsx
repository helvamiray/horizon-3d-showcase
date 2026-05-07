import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// ── Animated counter hook ─────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1600) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          if (!motionOk) { setValue(target); return; }

          const start = performance.now();
          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { value, ref };
}

// ── Stat chip ─────────────────────────────────────────────────────────────────
interface StatChipProps {
  value: number;
  suffix?: string;
  label: string;
  color?: string;
}

function StatChip({ value, suffix = "+", label, color = "#c9a84c" }: StatChipProps) {
  const { value: displayed, ref } = useCountUp(value);
  return (
    <div
      style={{
        background: "rgba(10,22,40,0.04)",
        border: "1px solid rgba(10,22,40,0.08)",
        borderRadius: "16px",
        padding: "1.25rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        minWidth: "120px",
      }}
    >
      <span
        ref={ref}
        style={{
          fontFamily: "var(--font-premium-display)",
          fontWeight: 900,
          fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
          color,
          lineHeight: 1,
          letterSpacing: "-0.03em",
        }}
      >
        {displayed}{suffix}
      </span>
      <span
        style={{
          fontFamily: "var(--font-premium-mono)",
          fontSize: "10px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#64748b",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Shared style — must be declared BEFORE ITEMS to avoid TDZ ────────────────
const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-premium-body)",
  fontSize: "1rem",
  lineHeight: 1.8,
  color: "#475569",
  margin: 0,
};

// ── Accordion content ─────────────────────────────────────────────────────────
const ITEMS = [
  {
    value: "biz-kimiz",
    title: "Biz Kimiz",
    content: (
      <p style={bodyStyle}>
        Vega İklimlendirme, Türkiye'nin önde gelen kurumsal ve endüstriyel
        iklim çözümleri sağlayıcısıdır. Konut, ticari bina ve sanayi
        tesislerinde eksiksiz mekanik tesisat projeleri sunuyoruz.
        Uzman mühendis kadromuz ve güçlü tedarikçi ağımızla her ölçekteki
        projeye anahtar teslim çözümler üretiyoruz.
      </p>
    ),
  },
  {
    value: "hakkimizda",
    title: "Hakkımızda",
    content: (
      <div>
        <p style={{ ...bodyStyle, marginBottom: "1.75rem" }}>
          2012 yılından bu yana İstanbul merkezli faaliyetlerimizle Türkiye
          genelinde yüzlerce başarılı proje tamamladık. Daikin, Viessmann ve
          Tyco gibi küresel markalar ile Yetkili Servis anlaşmalarına sahibiz.
          Her projede enerji verimliliği, güvenlik ve uzun ömürlü işletme
          maliyeti hedefleri birlikte ele alınır.
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <StatChip value={500}  suffix="+"  label="Tamamlanan Proje"  color="#c9a84c" />
          <StatChip value={12}   suffix="+"  label="Yıl Deneyim"       color="#38bdf8" />
          <StatChip value={50}   suffix="+"  label="Uzman Ekip"        color="#34d399" />
          <StatChip value={3}    suffix=""   label="Sektör"            color="#a78bfa" />
        </div>
      </div>
    ),
  },
  {
    value: "misyonumuz",
    title: "Misyonumuz",
    content: (
      <p style={bodyStyle}>
        Müşterilerimize en yüksek enerji verimliliğini, konfor standartlarını
        ve güvenlik gerekliliklerini karşılayan sürdürülebilir iklim çözümleri
        sunmak; teknoloji, deneyim ve sorumluluk anlayışını bir araya getirerek
        sektörde güvenilir bir mühendislik ortağı olmak.
      </p>
    ),
  },
  {
    value: "vizyonumuz",
    title: "Vizyonumuz",
    content: (
      <p style={bodyStyle}>
        Kurumsal ve endüstriyel iklimlendirme alanında Türkiye'nin lider
        çözüm ortağı olmak; AR-GE yatırımları ve dijital ikiz teknolojileriyle
        bina enerji yönetiminin geleceğini şekillendirmek.
      </p>
    ),
  },
];

// ── Main component ────────────────────────────────────────────────────────────
const AboutAccordion = () => (
  <section
    id="hakkimizda"
    style={{
      background: "var(--off-white, #f8f9fb)",
      padding: "5.5rem 1.5rem",
    }}
  >
    <div
      style={{ maxWidth: "760px", margin: "0 auto" }}
      data-reveal
    >
      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span
          style={{
            fontFamily: "var(--font-premium-mono)",
            fontSize: "11px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#94a3b8",
            display: "block",
            marginBottom: "12px",
          }}
        >
          Hakkımızda
        </span>
        <h2
          style={{
            fontFamily: "var(--font-premium-display)",
            fontWeight: 800,
            fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
            color: "var(--navy-primary, #0a1628)",
            letterSpacing: "-0.025em",
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          Güvenilir Çözüm Ortağınız
        </h2>
      </div>

      {/* Styled accordion */}
      <Accordion type="single" collapsible defaultValue="biz-kimiz">
        {ITEMS.map((item) => (
          <AccordionItem
            key={item.value}
            value={item.value}
            style={{
              borderTop: "none",
              borderRight: "none",
              borderBottom: "1px solid rgba(10,22,40,0.08)",
              borderLeft: "none",
            }}
          >
            <AccordionTrigger
              style={{
                fontFamily: "var(--font-premium-display)",
                fontWeight: 700,
                fontSize: "1.0625rem",
                color: "var(--navy-primary, #0a1628)",
                letterSpacing: "-0.01em",
                padding: "1.25rem 0",
                textDecoration: "none",
              }}
              className="hover:no-underline"
            >
              {item.title}
            </AccordionTrigger>
            <AccordionContent
              style={{ paddingBottom: "1.5rem" }}
            >
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default AboutAccordion;
