import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { projectMapService, type MapProject, type MapProjectStatus } from "@/lib/projectMapService";

const ADMIN_AUTH_KEY = "vega_admin_authed";
const CURRENT_YEAR = new Date().getFullYear();

const CATEGORIES = ["klima", "vrf", "kazan", "isi-pompasi", "yangin", "diger"] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_TR: Record<Category, string> = {
  klima: "Klima",
  vrf: "VRF",
  kazan: "Kazan",
  "isi-pompasi": "Isı Pompası",
  yangin: "Yangın",
  diger: "Diğer",
};

const STATUSES: MapProjectStatus[] = ["tamamlandi", "devam-ediyor", "planlama"];
const STATUS_TR: Record<MapProjectStatus, string> = {
  tamamlandi: "Tamamlandı",
  "devam-ediyor": "Devam Ediyor",
  planlama: "Planlama Aşamasında",
};

interface FormState {
  cityLabel: string;
  district: string;
  lat: string;
  lng: string;
  projectName: string;
  category: Category;
  year: string;
  status: MapProjectStatus;
  description: string;
}

const slugFromIl = (il: string) =>
  il
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/\s+/g, "-")
    .replace(/[^a-zığüşöç0-9-]/gi, "");

const emptyForm = (): FormState => ({
  cityLabel: "",
  district: "",
  lat: "",
  lng: "",
  projectName: "",
  category: "klima",
  year: String(CURRENT_YEAR),
  status: "tamamlandi",
  description: "",
});

const toFormState = (row: MapProject): FormState => ({
  cityLabel: row.cityLabel,
  district: row.district ?? "",
  lat: String(row.lat),
  lng: String(row.lng),
  projectName: row.projectName,
  category: (CATEGORIES.includes(row.category as Category) ? row.category : "diger") as Category,
  year: String(row.year),
  status: STATUSES.includes(row.status) ? row.status : "tamamlandi",
  description: row.description ?? "",
});

export default function AdminProjectsPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [rows, setRows] = useState<MapProject[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsAuthed(window.sessionStorage.getItem(ADMIN_AUTH_KEY) === "1");
  }, []);

  const refresh = () => setRows(projectMapService.getAll());

  useEffect(() => {
    if (!isAuthed) return;
    refresh();
  }, [isAuthed]);

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [rows]
  );

  const logout = () => {
    if (typeof window !== "undefined") window.sessionStorage.removeItem(ADMIN_AUTH_KEY);
    window.location.href = "/admin";
  };

  const validate = () => {
    if (!form.cityLabel.trim()) return "İl zorunludur";
    if (!form.projectName.trim()) return "Proje veya tesis adı zorunludur";
    if (form.lat.trim() === "" || Number.isNaN(Number(form.lat))) return "Geçerli enlem girin";
    if (form.lng.trim() === "" || Number.isNaN(Number(form.lng))) return "Geçerli boylam girin";
    if (form.year.trim() === "" || Number.isNaN(Number(form.year))) return "Geçerli yıl girin";
    return null;
  };

  const save = () => {
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }
    const ilSlug = slugFromIl(form.cityLabel) || "proje";
    const payload: Omit<MapProject, "id" | "createdAt"> = {
      city: ilSlug,
      cityLabel: form.cityLabel.trim(),
      district: form.district.trim() || undefined,
      lat: Number(form.lat),
      lng: Number(form.lng),
      projectName: form.projectName.trim(),
      category: form.category,
      year: Number(form.year),
      status: form.status,
      description: form.description.trim() || undefined,
    };

    if (editingId) {
      projectMapService.update(editingId, payload);
    } else {
      projectMapService.create(payload);
    }
    setError(null);
    setEditingId(null);
    setIsFormOpen(false);
    setForm(emptyForm());
    refresh();
  };

  const edit = (row: MapProject) => {
    setEditingId(row.id);
    setIsFormOpen(true);
    setForm(toFormState(row));
    setError(null);
  };

  const cancel = () => {
    setEditingId(null);
    setIsFormOpen(false);
    setForm(emptyForm());
    setError(null);
  };

  const openCreate = () => {
    setEditingId(null);
    setIsFormOpen(true);
    setForm(emptyForm());
    setError(null);
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
      title="Proje Haritası Yönetimi"
      subtitle="Canlı Türkiye harita işaretçilerini buradan yönetin."
      onLogout={logout}
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Projeler</h2>
          {!isFormOpen ? (
            <button
              type="button"
              onClick={openCreate}
              className="rounded bg-cyan px-3 py-2 text-sm font-medium text-black"
            >
              Yeni Proje Ekle
            </button>
          ) : null}
        </div>

        {isFormOpen ? (
          <div className="rounded-xl border border-white/10 bg-[#0f1a2d] p-4">
            <div className="mb-3 text-sm text-white/70">{editingId ? "Proje Düzenle" : "Yeni Proje Ekle"}</div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <label className="space-y-1">
                <span className="text-xs text-white/60">İl (il)</span>
                <input
                  value={form.cityLabel}
                  onChange={(e) => setForm((prev) => ({ ...prev, cityLabel: e.target.value }))}
                  className="w-full rounded border border-white/20 bg-[#0c1526] px-3 py-2"
                  placeholder="İstanbul"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs text-white/60">İlçe (isteğe bağlı)</span>
                <input
                  value={form.district}
                  onChange={(e) => setForm((prev) => ({ ...prev, district: e.target.value }))}
                  className="w-full rounded border border-white/20 bg-[#0c1526] px-3 py-2"
                  placeholder="Kadıköy"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs text-white/60">Enlem</span>
                <input
                  type="number"
                  step="0.0001"
                  value={form.lat}
                  onChange={(e) => setForm((prev) => ({ ...prev, lat: e.target.value }))}
                  className="w-full rounded border border-white/20 bg-[#0c1526] px-3 py-2"
                />
                <span className="text-[11px] text-white/40 block">Google Maps&apos;ten koordinat kopyalayın</span>
              </label>
              <label className="space-y-1">
                <span className="text-xs text-white/60">Boylam</span>
                <input
                  type="number"
                  step="0.0001"
                  value={form.lng}
                  onChange={(e) => setForm((prev) => ({ ...prev, lng: e.target.value }))}
                  className="w-full rounded border border-white/20 bg-[#0c1526] px-3 py-2"
                />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-xs text-white/60">Proje / tesis adı</span>
                <input
                  value={form.projectName}
                  onChange={(e) => setForm((prev) => ({ ...prev, projectName: e.target.value }))}
                  className="w-full rounded border border-white/20 bg-[#0c1526] px-3 py-2"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs text-white/60">Kategori</span>
                <select
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as Category }))}
                  className="w-full rounded border border-white/20 bg-[#0c1526] px-3 py-2"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_TR[c]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-xs text-white/60">Yıl</span>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))}
                  className="w-full rounded border border-white/20 bg-[#0c1526] px-3 py-2"
                />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-xs text-white/60">Durum</span>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, status: e.target.value as MapProjectStatus }))
                  }
                  className="w-full rounded border border-white/20 bg-[#0c1526] px-3 py-2"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_TR[s]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 md:col-span-2 xl:col-span-4">
                <span className="text-xs text-white/60">
                  Tamamlanan işler / proje özeti (isteğe bağlı)
                </span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded border border-white/20 bg-[#0c1526] px-3 py-2 text-sm resize-y min-h-[72px]"
                  placeholder="Örn: 12 kat VRF, 48 iç ünite montajı tamamlandı."
                />
              </label>
            </div>

            {error ? <p className="mt-3 text-sm text-amber-300">{error}</p> : null}

            <div className="mt-4 flex gap-2">
              <button type="button" onClick={save} className="rounded bg-cyan px-3 py-2 text-black font-medium">
                {editingId ? "Güncelle" : "Kaydet"}
              </button>
              <button type="button" onClick={cancel} className="rounded border border-white/20 px-3 py-2">
                İptal
              </button>
            </div>
          </div>
        ) : null}

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[960px] text-sm">
            <thead className="bg-[#0f1a2d] text-white/70">
              <tr>
                <th className="p-3 text-left">İl / İlçe</th>
                <th className="p-3 text-left">Proje adı</th>
                <th className="p-3 text-left max-w-[200px]">Tamamlanan iş</th>
                <th className="p-3 text-left">Kategori</th>
                <th className="p-3 text-left">Yıl</th>
                <th className="p-3 text-left">Durum</th>
                <th className="p-3 text-left">Düzenle</th>
                <th className="p-3 text-left">Sil</th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row) => (
                <tr key={row.id} className="border-t border-white/10">
                  <td className="p-3">
                    {row.district?.trim() ? `${row.cityLabel} / ${row.district}` : row.cityLabel}
                  </td>
                  <td className="p-3">{row.projectName}</td>
                  <td className="p-3 max-w-[220px] truncate text-white/70 text-xs" title={row.description ?? ""}>
                    {row.description?.trim() ? row.description : "—"}
                  </td>
                  <td className="p-3">{CATEGORY_TR[row.category as Category] ?? row.category}</td>
                  <td className="p-3">{row.year}</td>
                  <td className="p-3">{STATUS_TR[row.status]}</td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => edit(row)}
                      className="rounded border border-white/20 px-2 py-1"
                    >
                      Düzenle
                    </button>
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (!window.confirm(`"${row.projectName}" silinsin mi?`)) return;
                        projectMapService.delete(row.id);
                        refresh();
                      }}
                      className="rounded border border-red-400/40 px-2 py-1 text-red-300"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
              {sortedRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-white/60">
                    Henüz proje yok.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
