import { useState } from "react";
import { ArrowRight, MapPin, Instagram, Linkedin, Phone, Mail } from "lucide-react";
import { useMagneticButton } from "@/hooks/useMagneticButton";
import { VEGA_CONTACTS, VEGA_SOCIAL_HREF, openMaps } from "@/utils/contacts";
import { contactService } from "@/lib/contactService";

interface FormState {
  name: string;
  email: string;
  message: string;
}

const QuoteSimple = () => {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const btnRef = useMagneticButton(0.28);

  const update =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    contactService.create({
      type: "contact",
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim() || undefined,
    });
    const subject = encodeURIComponent(`Teklif Talebi — ${form.name}`);
    const body = encodeURIComponent(
      `Ad Soyad: ${form.name}\nE-posta: ${form.email}\n\nMesaj:\n${form.message}`
    );
    window.location.href = `mailto:${VEGA_CONTACTS.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <section
      id="iletisim"
      className="contact-section"
      style={{
        padding: "5rem 1.5rem",
        position: "relative",
        scrollMarginTop: "72px",
        borderTop: "1px solid var(--terminal-border, rgba(0,240,255,0.12))",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "5rem",
          alignItems: "start",
        }}
        className="contact-grid"
      >
        {/* Left: contact info — no data-reveal: keep always visible (scroll GSAP could leave opacity 0) */}
        <div>
          <span
            style={{
              fontFamily: "var(--font-premium-mono)",
              fontSize: "11px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--quote-eyebrow)",
              display: "block",
              marginBottom: "16px",
            }}
          >
            İletişim
          </span>
          <h2
            style={{
              fontFamily: "var(--font-premium-display)",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              color: "var(--text-on-terminal-strong)",
              lineHeight: 1.15,
            }}
          >
            Projenizi<br />
            <span style={{ color: "var(--electric-cyan, #00f0ff)" }}>Birlikte Tasarlayalım</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-premium-body)",
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "var(--quote-body)",
              maxWidth: "380px",
            }}
          >
            Isı pompasından yangın sistemine, tüm mekanik çözümler için
            uzman ekibimize ulaşın.
          </p>

          {/* Clickable address */}
          <button
            onClick={openMaps}
            aria-label="Haritada göster"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "none",
              border: "none",
              color: "var(--quote-link)",
              transition: "color 200ms ease",
              textAlign: "left",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--quote-link-hover)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--quote-link)")}
          >
            <MapPin size={16} style={{ color: "var(--gold, #c9a84c)", flexShrink: 0 }} />
            <span>
              {VEGA_CONTACTS.address}
              <span
                style={{
                  marginLeft: "8px",
                  fontFamily: "var(--font-premium-mono)",
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  color: "var(--gold, #c9a84c)",
                  textTransform: "uppercase",
                }}
              >
                → Yol Tarifi Al
              </span>
            </span>
          </button>

          {/* Phone + email direct links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1.5rem" }}>
            <a
              href={`tel:${VEGA_CONTACTS.phone}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "var(--quote-link)",
                textDecoration: "none",
                fontFamily: "var(--font-premium-body)",
                fontSize: "0.9375rem",
                transition: "color 200ms ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--quote-link-hover)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--quote-link)")}
            >
              <Phone size={15} style={{ color: "var(--gold, #c9a84c)", flexShrink: 0 }} />
              {VEGA_CONTACTS.phone}
            </a>
            <a
              href={`mailto:${VEGA_CONTACTS.email}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "var(--quote-link)",
                textDecoration: "none",
                fontFamily: "var(--font-premium-body)",
                fontSize: "0.9375rem",
                transition: "color 200ms ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--quote-link-hover)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--quote-link)")}
            >
              <Mail size={15} style={{ color: "var(--gold, #c9a84c)", flexShrink: 0 }} />
              {VEGA_CONTACTS.email}
            </a>
          </div>

          {/* Social links */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <a
              href={VEGA_SOCIAL_HREF.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--quote-social-bg)",
                border: "1px solid var(--quote-social-border)",
                borderRadius: "10px",
                padding: "10px 16px",
                color: "var(--quote-link)",
                cursor: "pointer",
                fontFamily: "var(--font-premium-body)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                transition: "background 200ms ease, color 200ms ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "var(--quote-social-bg-hover)";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--quote-link-hover)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "var(--quote-social-bg)";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--quote-link)";
              }}
            >
              <Instagram size={15} />
              Instagram
            </a>
            <a
              href={VEGA_SOCIAL_HREF.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--quote-social-bg)",
                border: "1px solid var(--quote-social-border)",
                borderRadius: "10px",
                padding: "10px 16px",
                color: "var(--quote-link)",
                cursor: "pointer",
                fontFamily: "var(--font-premium-body)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                transition: "background 200ms ease, color 200ms ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "var(--quote-social-bg-hover)";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--quote-link-hover)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "var(--quote-social-bg)";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--quote-link)";
              }}
            >
              <Linkedin size={15} />
              LinkedIn
            </a>
          </div>
        </div>

        {/* Right: 3-field form */}
        <div>
          {submitted ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                padding: "3rem 2rem",
                background: "var(--quote-card-bg)",
                border: "1px solid var(--quote-card-border)",
                borderRadius: "20px",
                textAlign: "center",
                color: "var(--text-on-terminal-strong)",
              }}
            >
              <span style={{ fontSize: "3rem" }}>✅</span>
              <h3
                style={{
                  fontFamily: "var(--font-premium-display)",
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  margin: 0,
                }}
              >
                Mesajınız iletildi
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-premium-body)",
                  color: "var(--quote-body)",
                  margin: 0,
                  fontSize: "0.9375rem",
                }}
              >
                En kısa sürede sizinle iletişime geçeceğiz.
              </p>
            </div>
          ) : (
            <div
              style={{
                background: "var(--quote-card-bg)",
                border: "1px solid var(--quote-card-border)",
                borderRadius: "20px",
                padding: "2.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              {[
                { field: "name" as const, placeholder: "Ad Soyad *", type: "text" },
                { field: "email" as const, placeholder: "E-posta *",  type: "email" },
              ].map(({ field, placeholder, type }) => (
                <input
                  key={field}
                  type={type}
                  placeholder={placeholder}
                  value={form[field]}
                  onChange={update(field)}
                  required={field !== "email" ? true : true}
                  aria-label={placeholder.replace(" *", "")}
                  style={{
                    background: "var(--quote-input-bg)",
                    border: "1px solid var(--quote-input-border)",
                    borderRadius: "10px",
                    padding: "13px 16px",
                    fontSize: "14px",
                    fontFamily: "var(--font-premium-body)",
                    color: "var(--text-on-terminal-strong)",
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box",
                    transition: "border-color 200ms ease",
                  }}
                  onFocus={(e) =>
                    ((e.currentTarget as HTMLInputElement).style.borderColor =
                      "var(--gold, #c9a84c)")
                  }
                  onBlur={(e) =>
                    ((e.currentTarget as HTMLInputElement).style.borderColor =
                      "var(--quote-input-border)")
                  }
                />
              ))}
              <textarea
                placeholder="Mesajınız"
                value={form.message}
                onChange={update("message")}
                rows={4}
                aria-label="Mesajınız"
                style={{
                  background: "var(--quote-input-bg)",
                  border: "1px solid var(--quote-input-border)",
                  borderRadius: "10px",
                  padding: "13px 16px",
                  fontSize: "14px",
                  fontFamily: "var(--font-premium-body)",
                  color: "var(--text-on-terminal-strong)",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                  resize: "vertical",
                  minHeight: "100px",
                  transition: "border-color 200ms ease",
                }}
                onFocus={(e) =>
                  ((e.currentTarget as HTMLTextAreaElement).style.borderColor =
                    "var(--gold, #c9a84c)")
                }
                onBlur={(e) =>
                  ((e.currentTarget as HTMLTextAreaElement).style.borderColor =
                    "var(--quote-input-border)")
                }
              />
              <button
                ref={btnRef}
                className="quote-send-btn"
                onClick={handleSubmit}
                type="button"
                aria-label="Mesaj gönder"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "var(--gold, #c9a84c)",
                  color: "var(--navy-primary, #0a1628)",
                  border: "none",
                  padding: "14px 28px",
                  borderRadius: "100px",
                  fontSize: "14px",
                  fontWeight: 700,
                  fontFamily: "var(--font-premium-display)",
                  cursor: "pointer",
                  transition: "background 280ms ease, box-shadow 280ms ease",
                  alignSelf: "flex-start",
                  willChange: "transform",
                  boxShadow: "none",
                }}
              >
                Mesaj Gönder
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr !important; gap: 3rem !important; } }
      `}</style>
    </section>
  );
};

export default QuoteSimple;
