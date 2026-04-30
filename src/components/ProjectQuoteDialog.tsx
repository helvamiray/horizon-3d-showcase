import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { z } from "zod";
import { useLanguage } from "@/i18n/LanguageContext";

const RECIPIENT = "mirayhelva15@icloud.com";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
});

interface Props { open: boolean; onOpenChange: (o: boolean) => void }

const ProjectQuoteDialog = ({ open, onOpenChange }: Props) => {
  const { items, clear, closeCart } = useCart();
  const { t, lang } = useLanguage();
  const [form, setForm] = useState({
    name: "", email: "", company: "", phone: "",
    projectType: "", location: "", area: "", timeline: "", notes: "",
  });

  const update = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error("Please complete required fields");
      return;
    }
    const cartLines = items.length
      ? items.map((i) => `• ${i.qty} × ${i.product.brand} — ${lang === "tr" ? i.product.name : i.product.name_en}`).join("\n")
      : "—";
    const subject = `VEGA Quote — ${form.name}`;
    const body = [
      `Name: ${form.name}`, `Email: ${form.email}`,
      `Company: ${form.company || "—"}`, `Phone: ${form.phone || "—"}`,
      "", "Cart:", cartLines, "", "Notes:", form.notes || "—",
    ].join("\n");
    window.location.href = `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.success(t("form.opening"));
    setTimeout(() => { onOpenChange(false); closeCart(); clear(); }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-w-2xl border-cyan/40 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <span className="font-display text-[10px] tracking-[0.3em] uppercase text-cyan">{t("form.briefing")}</span>
          <DialogTitle className="font-display text-2xl md:text-3xl neon-text">{t("cart.quote")}</DialogTitle>
          <DialogDescription className="text-foreground/70">{t("quote.subtitle")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <Input placeholder={t("form.name") + " *"} value={form.name} onChange={update("name")} className="bg-input/60 border-cyan/30 h-11" required />
            <Input type="email" placeholder={t("form.email") + " *"} value={form.email} onChange={update("email")} className="bg-input/60 border-cyan/30 h-11" required />
            <Input placeholder={t("form.company")} value={form.company} onChange={update("company")} className="bg-input/60 border-cyan/30 h-11" />
            <Input placeholder={t("form.phone")} value={form.phone} onChange={update("phone")} className="bg-input/60 border-cyan/30 h-11" />
          </div>

          {items.length > 0 && (
            <ul className="glass rounded-lg p-3 space-y-1 max-h-40 overflow-y-auto">
              {items.map((i) => (
                <li key={i.product.id} className="text-xs font-mono text-foreground/80 flex justify-between">
                  <span>{i.product.brand} — {lang === "tr" ? i.product.name : i.product.name_en}</span>
                  <span className="text-cyan">×{i.qty}</span>
                </li>
              ))}
            </ul>
          )}

          <Textarea placeholder={t("form.message")} value={form.notes} onChange={update("notes")} rows={4} className="bg-input/60 border-cyan/30 resize-none" />

          <Button type="submit" className="w-full h-12 font-display tracking-[0.25em] uppercase text-sm bg-gradient-to-r from-amber to-amber/80 text-background hover:opacity-90">
            {t("form.submit")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectQuoteDialog;
