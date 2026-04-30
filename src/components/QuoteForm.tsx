import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";
import { useLanguage } from "@/i18n/LanguageContext";

const RECIPIENT = "mirayhelva15@icloud.com";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(1500),
});

const QuoteForm = () => {
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const { t } = useLanguage();

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid form");
      return;
    }
    setSubmitting(true);
    const subject = `VEGA Teklif Talebi — ${parsed.data.name}`;
    const body = [
      `Name: ${parsed.data.name}`,
      `Email: ${parsed.data.email}`,
      `Company: ${parsed.data.company || "—"}`,
      `Phone: ${parsed.data.phone || "—"}`,
      "",
      "Project details:",
      parsed.data.message,
    ].join("\n");
    const url = `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
    setTimeout(() => {
      setSubmitting(false);
      toast.success(t("form.opening"));
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-6 md:p-8 space-y-4 relative">
      <div className="absolute -top-3 left-6 px-3 py-0.5 bg-background border border-cyan/40 rounded">
        <span className="font-display text-[10px] tracking-[0.3em] uppercase text-cyan">{t("form.briefing")}</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input placeholder={t("form.name")} value={form.name} onChange={update("name")} className="bg-input/60 border-cyan/30 focus-visible:ring-cyan h-11" required />
        <Input type="email" placeholder={t("form.email")} value={form.email} onChange={update("email")} className="bg-input/60 border-cyan/30 focus-visible:ring-cyan h-11" required />
        <Input placeholder={t("form.company")} value={form.company} onChange={update("company")} className="bg-input/60 border-cyan/30 focus-visible:ring-cyan h-11" />
        <Input placeholder={t("form.phone")} value={form.phone} onChange={update("phone")} className="bg-input/60 border-cyan/30 focus-visible:ring-cyan h-11" />
      </div>

      <Textarea
        placeholder={t("form.message")}
        value={form.message}
        onChange={update("message")}
        rows={5}
        className="bg-input/60 border-cyan/30 focus-visible:ring-cyan resize-none"
        required
      />

      <Button
        type="submit"
        disabled={submitting}
        className="w-full h-12 font-display tracking-[0.25em] uppercase text-sm bg-gradient-to-r from-cyan to-cyan-glow text-primary-foreground hover:opacity-90 transition-all"
        style={{ boxShadow: "0 0 24px oklch(0.78 0.16 210 / 0.5)" }}
      >
        {submitting ? t("form.sending") : t("form.submit")}
      </Button>

      <p className="text-[11px] text-foreground/50 text-center font-mono">
        {t("form.secure")}: {RECIPIENT}
      </p>
    </form>
  );
};

export default QuoteForm;
