import { Fragment, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CONTACT_TYPE_LABEL_TR, contactService, type ContactSubmission } from "@/lib/contactService";
import { AdminLayout } from "@/components/admin/AdminLayout";

const ADMIN_AUTH_KEY = "vega_admin_authed";

function previewText(text: string | undefined, max = 72): string {
  if (!text?.trim()) return "—";
  const t = text.trim();
  return t.length <= max ? t : `${t.slice(0, max)}…`;
}

export function AdminContactsPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [rows, setRows] = useState<ContactSubmission[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsAuthed(window.sessionStorage.getItem(ADMIN_AUTH_KEY) === "1");
  }, []);

  const refresh = () => setRows(contactService.getAll());

  useEffect(() => {
    if (!isAuthed) return;
    refresh();
  }, [isAuthed]);

  const sorted = useMemo(() => rows, [rows]);

  const logout = () => {
    if (typeof window !== "undefined") window.sessionStorage.removeItem(ADMIN_AUTH_KEY);
    window.location.href = "/admin";
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#090f1d] text-white p-6">
        <div className="rounded-xl border border-cyan/30 bg-[#0f1a2d] p-6 text-center max-w-md">
          <p>Yönetici oturumu gerekli.</p>
          <Link to="/admin" className="mt-3 inline-block text-cyan underline">
            /admin üzerinden giriş yapın
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout
      title="İletişim Kutusu"
      subtitle="Bu tarayıcıda yerel olarak saklanan talepler (localStorage)"
      onLogout={logout}
    >
      <div className="p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (!sorted.some((r) => !r.read)) return;
              if (!window.confirm("Tüm mesajlar okundu olarak işaretlensin mi?")) return;
              contactService.markAllRead();
              refresh();
            }}
            className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/5"
          >
            Tümünü Okundu İşaretle
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[960px] text-sm">
            <thead className="bg-[#0f1a2d] text-white/70">
              <tr>
                <th className="p-3 text-left w-8" aria-hidden />
                <th className="p-3 text-left">Tarih</th>
                <th className="p-3 text-left">Ad</th>
                <th className="p-3 text-left">E-posta</th>
                <th className="p-3 text-left">Tür</th>
                <th className="p-3 text-left">Mesaj önizleme</th>
                <th className="p-3 text-left">Okundu</th>
                <th className="p-3 text-left">Sil</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => {
                const expanded = expandedId === r.id;
                const msgPreview = previewText(r.message);
                return (
                  <Fragment key={r.id}>
                    <tr
                      className="border-t border-white/10 cursor-pointer hover:bg-white/[0.03]"
                      onClick={() => toggleExpand(r.id)}
                    >
                      <td className="p-3 text-white/50">{expanded ? "▼" : "▶"}</td>
                      <td className="p-3 whitespace-nowrap text-white/80">
                        {new Date(r.submittedAt).toLocaleString("tr-TR")}
                      </td>
                      <td className="p-3 max-w-[140px] break-words">{r.name}</td>
                      <td className="p-3 max-w-[180px] break-all text-cyan/90">{r.email}</td>
                      <td className="p-3 whitespace-nowrap">{CONTACT_TYPE_LABEL_TR[r.type]}</td>
                      <td className="p-3 max-w-[240px] text-white/75 text-xs">{msgPreview}</td>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={r.read}
                          onChange={(e) => {
                            if (e.target.checked) {
                              contactService.markRead(r.id);
                            } else {
                              contactService.setRead(r.id, false);
                            }
                            refresh();
                          }}
                        />
                      </td>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => {
                            if (!window.confirm("Emin misiniz?")) return;
                            contactService.delete(r.id);
                            if (expandedId === r.id) setExpandedId(null);
                            refresh();
                          }}
                          className="rounded border border-red-400/40 px-2 py-1 text-red-300"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                    {expanded ? (
                      <tr className="border-t border-white/10 bg-[#0c1526]/40">
                        <td colSpan={8} className="p-4 text-left text-sm space-y-3">
                          <div className="grid gap-2 md:grid-cols-2">
                            <div>
                              <span className="text-white/50">Telefon: </span>
                              {r.phone ?? "—"}
                            </div>
                            <div>
                              <span className="text-white/50">Şirket: </span>
                              {r.company ?? "—"}
                            </div>
                            <div className="md:col-span-2">
                              <span className="text-white/50">Kategori: </span>
                              {r.category ?? "—"}
                            </div>
                          </div>
                          <div>
                            <div className="text-white/50 text-xs mb-1">Mesaj</div>
                            <div className="whitespace-pre-wrap rounded border border-white/10 bg-[#0f1a2d] p-3">
                              {r.message?.trim() ? r.message : "—"}
                            </div>
                          </div>
                          {r.cartItems && r.cartItems.length > 0 ? (
                            <div>
                              <div className="text-white/50 text-xs mb-1">Sepet / ürünler</div>
                              <ul className="list-disc list-inside space-y-1">
                                {r.cartItems.map((item, i) => (
                                  <li key={i}>
                                    {item.productName} × {item.qty}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="rounded bg-cyan/20 px-3 py-1.5 text-cyan text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                contactService.markRead(r.id);
                                refresh();
                              }}
                            >
                              Okundu olarak işaretle
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-white/50">
                    Henüz mesaj bulunmuyor
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
