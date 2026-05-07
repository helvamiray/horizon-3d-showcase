import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { useMagneticButton } from "@/hooks/useMagneticButton";
import { VEGA_CONTACTS } from "@/utils/contacts";

const CATEGORIES = [
  "Klima",
  "Isı Pompası",
  "Kazan Dairesi",
  "Yangın Sistemi",
  "Fancoil",
  "Radyatör",
  "Yerden Isıtma",
  "Diğer",
];

interface FormState {
  name: string;
  company: string;
  phone: string;
  email: string;
  category: string;
  message: string;
}

function FormSuccess() {
  return (
    <div className="form-success">
      <span className="form-success-icon" aria-hidden>
        <Mail size={28} strokeWidth={1.75} />
      </span>
      <h4
        style={{
          fontFamily: "var(--font-premium-display)",
          fontWeight: 800,
          fontSize: "1.25rem",
          color: "white",
          margin: 0,
        }}
      >
        Talebiniz iletildi!
      </h4>
      <p
        style={{
          fontFamily: "var(--font-premium-body)",
          color: "rgba(255,255,255,0.6)",
          margin: 0,
        }}
      >
        En kısa sürede sizinle iletişime geçeceğiz.
      </p>
    </div>
  );
}

const QuoteForm = () => {
  const [form, setForm] = useState<FormState>({
    name: "",
    company: "",
    phone: "",
    email: "",
    category: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const btnRef = useMagneticButton(0.3);

  const update =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim()) return;

    const subject = encodeURIComponent(
      `Teklif Talebi${form.category ? ` — ${form.category}` : ""}${form.company ? ` — ${form.company}` : ""}`
    );
    const body = encodeURIComponent(
      [
        `Ad Soyad: ${form.name}`,
        form.company ? `Şirket: ${form.company}` : null,
        form.phone ? `Telefon: ${form.phone}` : null,
        `E-posta: ${form.email}`,
        form.category ? `Kategori: ${form.category}` : null,
        "",
        form.message ? `Mesaj:\n${form.message}` : null,
      ]
        .filter(Boolean)
        .join("\n")
    );

    window.location.href = `mailto:${VEGA_CONTACTS.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  if (submitted) return <FormSuccess />;

  return (
    <div className="grav-quote-form">
      <h3
        style={{
          fontFamily: "var(--font-premium-display)",
          fontWeight: 800,
          fontSize: "1.25rem",
          color: "white",
          margin: "0 0 24px",
        }}
      >
        Teklif İste
      </h3>

      <div className="grav-form-grid">
        <input
          className="grav-form-input"
          placeholder="Ad Soyad *"
          value={form.name}
          onChange={update("name")}
          required
          aria-label="Ad Soyad"
        />
        <input
          className="grav-form-input"
          placeholder="Şirket"
          value={form.company}
          onChange={update("company")}
          aria-label="Şirket"
        />
        <input
          className="grav-form-input"
          placeholder="Telefon"
          type="tel"
          value={form.phone}
          onChange={update("phone")}
          aria-label="Telefon"
        />
        <input
          className="grav-form-input"
          placeholder="E-posta *"
          type="email"
          value={form.email}
          onChange={update("email")}
          required
          aria-label="E-posta"
        />
        <select
          className="grav-form-select"
          value={form.category}
          onChange={update("category")}
          aria-label="Sistem kategorisi"
        >
          <option value="">Sistem Kategorisi Seçin</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <textarea
          className="grav-form-textarea"
          placeholder="Projenizi kısaca anlatın..."
          value={form.message}
          onChange={update("message")}
          rows={4}
          aria-label="Proje açıklaması"
        />
      </div>

      <button
        ref={btnRef}
        className="btn-submit-magnetic"
        onClick={handleSubmit}
        type="button"
        aria-label="Teklif gönder"
      >
        <span>Teklif Gönder</span>
        <ArrowRight size={16} aria-hidden="true" />
      </button>
    </div>
  );
};

export default QuoteForm;
