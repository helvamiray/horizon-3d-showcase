import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrandSlider from "@/components/BrandSlider";
import Villa3D from "@/components/Villa3D";
import ProductExplorer from "@/components/ProductExplorer";
import VegaVideo from "@/components/VegaVideo";
import QuoteForm from "@/components/QuoteForm";
import SocialIcons from "@/components/SocialIcons";
import LanguageToggle from "@/components/LanguageToggle";
import SolutionsSection from "@/components/SolutionsSection";
import TurkeyProjectsMap from "@/components/TurkeyProjectsMap";
import { PRODUCTS } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { Mail, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [selectedId, setSelectedId] = useState<string | null>(PRODUCTS[0].id);
  const rootRef = useRef<HTMLDivElement>(null);
  const { count, openCart } = useCart();
  const { t } = useLanguage();

  const highlightedKey = useMemo(
    () => PRODUCTS.find((p) => p.id === selectedId)?.componentKey ?? null,
    [selectedId]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".hero-reveal", { y: 40, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.15 });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(el, { y: 50, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal-children]").forEach((el) => {
        gsap.fromTo(el.children, { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none reverse" },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const stats = [
    { k: "18+", v: t("stats.brands") },
    { k: "25", v: t("stats.heritage") },
    { k: "1.2k", v: t("stats.projects") },
    { k: "A+++", v: t("stats.energy") },
  ];

  const capabilities = [
    { t: t("cap.heatpump.t"), d: t("cap.heatpump.d") },
    { t: t("cap.hydronic.t"), d: t("cap.hydronic.d") },
    { t: t("cap.vrf.t"), d: t("cap.vrf.d") },
    { t: t("cap.solar.t"), d: t("cap.solar.d") },
    { t: t("cap.bms.t"), d: t("cap.bms.d") },
    { t: t("cap.energy.t"), d: t("cap.energy.d") },
  ];

  return (
    <div ref={rootRef} className="relative min-h-screen text-foreground overflow-x-hidden">
      {/* Background video */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
        <video className="w-full h-full object-cover opacity-60" autoPlay muted loop playsInline poster="/placeholder.svg">
          <source src="/videos/isi_pompasi.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background" />
        <div className="absolute inset-0 grid-bg opacity-40" />
      </div>

      <BrandSlider />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/40 border-b border-cyan/15">
        <div className="container flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2 group">
            <span className="grid place-items-center w-9 h-9 rounded border border-cyan/60 font-display text-cyan neon-text">V</span>
            <div className="leading-none">
              <div className="font-display text-lg tracking-[0.25em] neon-text">VEGA</div>
              <div className="text-[9px] tracking-[0.4em] uppercase text-foreground/50 mt-1">Engineering</div>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-display text-xs tracking-[0.25em] uppercase text-foreground/70">
            <a href="#hakkimizda" className="hover:text-cyan transition-colors">{t("nav.about")}</a>
            <a href="#twin" className="hover:text-cyan transition-colors">{t("nav.twin")}</a>
            <a href="#systems" className="hover:text-cyan transition-colors">{t("nav.products")}</a>
            <a href="#solutions" className="hover:text-cyan transition-colors">{t("nav.solutions")}</a>
            <a href="#projects" className="hover:text-cyan transition-colors">{t("nav.projects")}</a>
            <a href="#vizyon" className="hover:text-cyan transition-colors">{t("nav.vision")}</a>
            <a href="#quote" className="hover:text-cyan transition-colors">{t("nav.quote")}</a>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <button
              type="button"
              onClick={openCart}
              className="relative h-10 px-3 rounded-md glass border border-cyan/40 hover:border-cyan flex items-center gap-2 font-display text-[10px] tracking-[0.25em] uppercase text-cyan transition-all"
              aria-label={t("header.cart")}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">{t("header.cart")}</span>
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 grid place-items-center w-5 h-5 rounded-full bg-amber text-background text-[10px] font-bold">
                  {count}
                </span>
              )}
            </button>
            <div className="hidden lg:block"><SocialIcons /></div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative container pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="max-w-3xl">
          <div className="hero-reveal inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-cyan/40 mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            <span className="font-display text-[10px] tracking-[0.4em] uppercase text-cyan">{t("header.tagline")}</span>
          </div>
          <h1 className="hero-reveal font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] mb-6">
            {t("hero.title.1")} <span className="text-gradient-cyan">{t("hero.title.2")}</span><br />
            <span className="amber-text">{t("hero.title.3")}</span> {t("hero.title.4")}
          </h1>
          <p className="hero-reveal text-base md:text-lg text-foreground/70 max-w-2xl mb-8">{t("hero.subtitle")}</p>
          <div className="hero-reveal flex flex-wrap gap-4">
            <a href="#twin" className="px-6 h-12 grid place-items-center rounded-md bg-gradient-to-r from-cyan to-cyan-glow text-primary-foreground font-display tracking-[0.25em] uppercase text-xs transition-all">
              {t("hero.cta.twin")}
            </a>
            <a href="#quote" className="px-6 h-12 grid place-items-center rounded-md glass border border-amber/60 amber-text font-display tracking-[0.25em] uppercase text-xs transition-all">
              {t("hero.cta.quote")}
            </a>
          </div>
        </div>

        <div data-reveal-children className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.v} className="glass rounded-xl p-5">
              <div className="font-display text-3xl neon-text">{s.k}</div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-foreground/60 mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Digital Twin + Products */}
      <section id="twin" className="container py-20 md:py-28">
        <div data-reveal className="mb-12 max-w-3xl">
          <span className="font-display text-[10px] tracking-[0.4em] uppercase text-cyan">{t("twin.eyebrow")}</span>
          <h2 className="font-display text-3xl md:text-5xl mt-3 mb-4">
            {t("twin.title.1")} <span className="amber-text">{t("twin.title.2")}</span> {t("twin.title.3")}
          </h2>
          <p className="text-foreground/70">{t("twin.subtitle")}</p>
        </div>

        <div id="systems" className="grid lg:grid-cols-5 gap-6">
          <div data-reveal className="lg:col-span-3 lg:sticky lg:top-24 lg:self-start">
            <Villa3D highlightedKey={highlightedKey} />
          </div>
          <div data-reveal className="lg:col-span-2 max-h-[680px] overflow-y-auto pr-1">
            <ProductExplorer selectedId={selectedId} onSelect={setSelectedId} />
          </div>
        </div>
      </section>

      {/* About */}
      <section id="hakkimizda" className="container py-20 md:py-28">
        <div data-reveal className="max-w-4xl">
          <span className="font-display text-[10px] tracking-[0.4em] uppercase text-cyan">{t("about.eyebrow")}</span>
          <h2 className="font-display text-3xl md:text-5xl mt-3 mb-6">{t("about.title")}</h2>
          <p className="text-foreground/80 text-base md:text-lg leading-relaxed">{t("about.body")}</p>
        </div>

        <div data-reveal-children className="mt-10 grid md:grid-cols-2 gap-5">
          <article className="glass rounded-xl p-7">
            <span className="font-display text-[10px] tracking-[0.35em] uppercase text-cyan">{t("mission.eyebrow")}</span>
            <h3 className="font-display text-2xl mt-2 mb-3">{t("mission.title")}</h3>
            <p className="text-foreground/75 leading-relaxed">{t("mission.body")}</p>
          </article>
          <article className="glass rounded-xl p-7 border-amber/40">
            <span className="font-display text-[10px] tracking-[0.35em] uppercase amber-text">{t("vision.eyebrow")}</span>
            <h3 className="font-display text-2xl mt-2 mb-3">{t("vision.title")}</h3>
            <p className="text-foreground/75 leading-relaxed">{t("vision.body")}</p>
          </article>
        </div>
      </section>

      {/* Vision video */}
      <section id="vizyon" className="container py-20 md:py-28">
        <div data-reveal className="max-w-3xl mb-10">
          <span className="font-display text-[10px] tracking-[0.4em] uppercase text-cyan">{t("video.eyebrow")}</span>
          <h2 className="font-display text-3xl md:text-5xl mt-3 mb-4">{t("video.title")}</h2>
          <p className="text-foreground/70">{t("video.subtitle")}</p>
        </div>
        <div data-reveal><VegaVideo /></div>
      </section>

      {/* Capabilities */}
      <section className="container py-20 md:py-28">
        <div data-reveal className="mb-12 max-w-3xl">
          <span className="font-display text-[10px] tracking-[0.4em] uppercase text-cyan">{t("capabilities.eyebrow")}</span>
          <h2 className="font-display text-3xl md:text-5xl mt-3">{t("capabilities.title")}</h2>
        </div>
        <div data-reveal-children className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((c) => (
            <div key={c.t} className="glass rounded-xl p-6 hover:border-cyan/60 transition-colors">
              <div className="w-10 h-10 mb-4 rounded grid place-items-center border border-cyan/50 text-cyan font-display">◆</div>
              <h3 className="font-display text-lg mb-2">{c.t}</h3>
              <p className="text-sm text-foreground/70">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions */}
      <section id="solutions" className="container py-20 md:py-28">
        <div data-reveal className="mb-12 max-w-3xl">
          <span className="font-display text-[10px] tracking-[0.4em] uppercase text-cyan">{t("solutions.eyebrow")}</span>
          <h2 className="font-display text-3xl md:text-5xl mt-3 mb-4">{t("solutions.title")}</h2>
          <p className="text-foreground/70">{t("solutions.subtitle")}</p>
        </div>
        <SolutionsSection />
      </section>

      {/* Projects map */}
      <section id="projects" className="container py-20 md:py-28">
        <div data-reveal className="mb-10 max-w-3xl">
          <span className="font-display text-[10px] tracking-[0.4em] uppercase text-cyan">{t("projects.eyebrow")}</span>
          <h2 className="font-display text-3xl md:text-5xl mt-3 mb-4">{t("projects.title")}</h2>
          <p className="text-foreground/70">{t("projects.subtitle")}</p>
        </div>
        <div data-reveal>
          <TurkeyProjectsMap />
        </div>
      </section>

      {/* Quote */}
      <section id="quote" className="container py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div data-reveal>
            <span className="font-display text-[10px] tracking-[0.4em] uppercase text-cyan">{t("quote.eyebrow")}</span>
            <h2 className="font-display text-3xl md:text-5xl mt-3 mb-5">
              <span className="amber-text">{t("quote.title.1")}</span> {t("quote.title.2")}
            </h2>
            <p className="text-foreground/70 mb-8">{t("quote.subtitle")}</p>
            <div className="space-y-4">
              {[
                [t("quote.row.response"), t("quote.row.responseV")],
                [t("quote.row.region"), t("quote.row.regionV")],
                [t("quote.row.email"), "mirayhelva15@icloud.com"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between glass rounded-lg px-4 py-3">
                  <span className="text-[11px] font-display tracking-[0.25em] uppercase text-foreground/60">{k}</span>
                  <span className="font-mono text-sm text-cyan">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <p className="text-[11px] font-display tracking-[0.3em] uppercase text-foreground/50 mb-3">{t("quote.follow")}</p>
              <SocialIcons />
            </div>
          </div>
          <div data-reveal><QuoteForm /></div>
        </div>
      </section>

      {/* Footer with Bize Ulaşın */}
      <footer id="contact" className="border-t border-cyan/15 mt-10">
        <div className="container py-14">
          <div data-reveal className="grid md:grid-cols-[1fr_auto] gap-8 items-center glass rounded-2xl p-8 md:p-10 border border-cyan/30">
            <div>
              <span className="font-display text-[10px] tracking-[0.4em] uppercase amber-text">
                {t("footer.contact.eyebrow")}
              </span>
              <h3 className="font-display text-2xl md:text-3xl mt-2 mb-2">
                {t("footer.contact.title")}
              </h3>
              <p className="text-foreground/70 max-w-xl">{t("footer.contact.body")}</p>
            </div>
            <a
              href="mailto:mirayhelva15@icloud.com"
              className="inline-flex items-center gap-3 px-6 h-12 rounded-md bg-gradient-to-r from-cyan to-cyan-glow text-primary-foreground font-display tracking-[0.25em] uppercase text-xs transition-all hover:opacity-90"
              style={{ boxShadow: "0 0 24px oklch(0.78 0.16 210 / 0.5)" }}
            >
              <Mail className="w-4 h-4" />
              <span>mirayhelva15@icloud.com</span>
            </a>
          </div>
        </div>
        <div className="container pb-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-mono text-foreground/50">
          <div>© {new Date().getFullYear()} {t("footer.copy")}</div>
          <div className="tracking-[0.25em] uppercase">{t("footer.tag")}</div>
        </div>
      </footer>
    </div>
  );
}
